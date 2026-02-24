<script setup lang="ts">
import { Head, router } from '@inertiajs/vue3';
import AppLayout from '@/layouts/AppLayout.vue';
import { type BreadcrumbItem } from '@/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { Users, UserCheck, UserX, BarChart3, Filter } from 'lucide-vue-next';
import { ref } from 'vue';

interface EmployeeReport {
    id: number;
    uid: number;
    user_id: string;
    name: string;
    department: string | null;
    is_active: boolean;
    total_logs: number;
    check_ins: number;
    check_outs: number;
}

const props = defineProps<{
    employees: EmployeeReport[];
    summary: {
        total_employees: number;
        today_present: number;
        today_absent: number;
    };
    filters: {
        date_from: string;
        date_to: string;
    };
}>();

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Attendance', href: '/attendance' },
    { title: 'Report' },
];

const dateFrom = ref(props.filters.date_from);
const dateTo = ref(props.filters.date_to);

function applyFilters() {
    router.get('/attendance/report', {
        date_from: dateFrom.value,
        date_to: dateTo.value,
    }, {
        preserveState: true,
        replace: true,
    });
}

const maxLogs = Math.max(...props.employees.map(e => e.total_logs), 1);

// Attendance rate calculation
const totalPossibleDays = (() => {
    const from = new Date(props.filters.date_from);
    const to = new Date(props.filters.date_to);
    const diff = Math.ceil((to.getTime() - from.getTime()) / (1000 * 60 * 60 * 24)) + 1;
    return Math.max(diff, 1);
})();
</script>

<template>
    <Head title="Attendance Report" />

    <AppLayout :breadcrumbs="breadcrumbs">
        <div class="flex h-full flex-1 flex-col gap-4 p-4 md:p-6">
            <!-- Header -->
            <div class="flex items-center justify-between">
                <div>
                    <h2 class="text-2xl font-bold tracking-tight">Attendance Report</h2>
                    <p class="text-muted-foreground">Aggregated attendance data for the selected period</p>
                </div>
            </div>

            <!-- Summary Cards -->
            <div class="grid gap-4 md:grid-cols-3">
                <Card>
                    <CardHeader class="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle class="text-sm font-medium">Total Employees</CardTitle>
                        <Users class="size-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div class="text-2xl font-bold">{{ summary.total_employees }}</div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader class="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle class="text-sm font-medium">Present Today</CardTitle>
                        <UserCheck class="size-4 text-green-600" />
                    </CardHeader>
                    <CardContent>
                        <div class="text-2xl font-bold text-green-600">{{ summary.today_present }}</div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader class="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle class="text-sm font-medium">Absent Today</CardTitle>
                        <UserX class="size-4 text-red-600" />
                    </CardHeader>
                    <CardContent>
                        <div class="text-2xl font-bold text-red-600">{{ summary.today_absent }}</div>
                    </CardContent>
                </Card>
            </div>

            <!-- Date Filter -->
            <Card>
                <CardContent class="pt-6">
                    <div class="flex flex-wrap items-end gap-4">
                        <div class="space-y-2">
                            <Label for="date_from">From</Label>
                            <Input id="date_from" v-model="dateFrom" type="date" class="w-[180px]" />
                        </div>
                        <div class="space-y-2">
                            <Label for="date_to">To</Label>
                            <Input id="date_to" v-model="dateTo" type="date" class="w-[180px]" />
                        </div>
                        <Button @click="applyFilters">
                            <Filter class="mr-2 size-4" />
                            Apply Filter
                        </Button>
                    </div>
                </CardContent>
            </Card>

            <!-- Report Table -->
            <Card>
                <CardHeader>
                    <CardTitle>Employee Attendance Summary</CardTitle>
                    <CardDescription>
                        Period: {{ filters.date_from }} to {{ filters.date_to }} ({{ totalPossibleDays }} days)
                    </CardDescription>
                </CardHeader>
                <CardContent class="p-0">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Employee</TableHead>
                                <TableHead>Department</TableHead>
                                <TableHead class="text-center">Check Ins</TableHead>
                                <TableHead class="text-center">Check Outs</TableHead>
                                <TableHead class="text-center">Total Logs</TableHead>
                                <TableHead>Attendance Rate</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            <TableRow v-for="emp in employees" :key="emp.id">
                                <TableCell>
                                    <p class="font-medium">{{ emp.name }}</p>
                                    <p class="text-xs text-muted-foreground">{{ emp.user_id ?? `UID: ${emp.uid}` }}</p>
                                </TableCell>
                                <TableCell>{{ emp.department ?? '—' }}</TableCell>
                                <TableCell class="text-center">
                                    <Badge variant="default">{{ emp.check_ins }}</Badge>
                                </TableCell>
                                <TableCell class="text-center">
                                    <Badge variant="secondary">{{ emp.check_outs }}</Badge>
                                </TableCell>
                                <TableCell class="text-center font-medium">{{ emp.total_logs }}</TableCell>
                                <TableCell>
                                    <div class="flex items-center gap-2">
                                        <Progress :model-value="Math.min(100, (emp.check_ins / totalPossibleDays) * 100)" class="h-2 w-20" />
                                        <span class="text-xs text-muted-foreground">
                                            {{ Math.round(Math.min(100, (emp.check_ins / totalPossibleDays) * 100)) }}%
                                        </span>
                                    </div>
                                </TableCell>
                            </TableRow>
                            <TableRow v-if="employees.length === 0">
                                <TableCell colspan="6" class="text-center text-muted-foreground py-8">
                                    <BarChart3 class="size-8 mx-auto mb-2 opacity-50" />
                                    No employees found for the selected period.
                                </TableCell>
                            </TableRow>
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    </AppLayout>
</template>
