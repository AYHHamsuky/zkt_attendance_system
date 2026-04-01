<script setup lang="ts">
import { Head, router, Link } from '@inertiajs/vue3';
import AppLayout from '@/layouts/AppLayout.vue';
import { type BreadcrumbItem } from '@/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Users, UserCheck, UserX, Clock, BarChart3, Filter, X, Download, Search, Palmtree } from 'lucide-vue-next';
import { ref, computed } from 'vue';

interface Device {
    id: number;
    name: string;
}

interface EmployeeReport {
    id: number;
    uid: number;
    user_id: string;
    name: string;
    department: string | null;
    unit: string | null;
    position: string | null;
    device: Device | null;
    check_ins: number;
    check_outs: number;
    total_logs: number;
    tardy_count: number;
    early_out_count: number;
    on_leave_days: number;
}

interface GroupedReport {
    group: string;
    total_employees: number;
    check_ins: number;
    check_outs: number;
    total_logs: number;
    tardy_count: number;
    attendance_rate: number;
}

const props = defineProps<{
    reportData: EmployeeReport[] | GroupedReport[];
    summary: {
        total_employees: number;
        today_present: number;
        today_on_leave: number;
        today_absent: number;
        today_tardy: number;
    };
    filters: {
        date_from: string;
        date_to: string;
        group_by: string;
        department: string | null;
        unit: string | null;
        device_id: number | null;
        search: string | null;
        attendance_status: string;
        tardy_filter: string | null;
    };
    filterOptions: {
        departments: string[];
        units: string[];
        devices: Device[];
    };
}>();

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Attendance', href: '/attendance' },
    { title: 'Report' },
];

const dateFrom = ref(props.filters.date_from);
const dateTo = ref(props.filters.date_to);
const groupBy = ref(props.filters.group_by);
const department = ref(props.filters.department ?? '');
const unit = ref(props.filters.unit ?? '');
const deviceId = ref(props.filters.device_id ? String(props.filters.device_id) : '');
const search = ref(props.filters.search ?? '');
const attendanceStatus = ref(props.filters.attendance_status ?? 'present');
const tardyFilter = ref(props.filters.tardy_filter ?? '');

const isGrouped = computed(() => groupBy.value !== 'individual');

function applyFilters() {
    router.get('/attendance/report', {
        date_from: dateFrom.value,
        date_to: dateTo.value,
        group_by: groupBy.value,
        department: department.value || undefined,
        unit: unit.value || undefined,
        device_id: deviceId.value || undefined,
        search: search.value || undefined,
        attendance_status: attendanceStatus.value !== 'present' ? attendanceStatus.value : undefined,
        tardy_filter: tardyFilter.value || undefined,
    }, { preserveState: true, replace: true });
}

function clearFilters() {
    department.value = '';
    unit.value = '';
    deviceId.value = '';
    search.value = '';
    tardyFilter.value = '';
    attendanceStatus.value = 'present';
    applyFilters();
}

function exportReport() {
    const params = new URLSearchParams();
    params.set('date_from', dateFrom.value);
    params.set('date_to', dateTo.value);
    params.set('group_by', groupBy.value);
    if (department.value) params.set('department', department.value);
    if (unit.value) params.set('unit', unit.value);
    if (deviceId.value) params.set('device_id', deviceId.value);
    if (search.value) params.set('search', search.value);
    if (attendanceStatus.value !== 'present') params.set('attendance_status', attendanceStatus.value);
    if (tardyFilter.value) params.set('tardy_filter', tardyFilter.value);
    
    window.location.href = '/attendance/export?' + params.toString();
}

function drillDown(row: GroupedReport) {
    const params: Record<string, string | undefined> = {
        date_from: dateFrom.value,
        date_to: dateTo.value,
        group_by: 'individual',
    };
    if (groupBy.value === 'department') {
        params.department = row.group !== 'Unassigned' ? row.group : undefined;
    } else {
        params.unit = row.group !== 'Unassigned' ? row.group : undefined;
    }
    router.get('/attendance/report', params, { preserveState: false });
}

const totalPossibleDays = computed(() => {
    const from = new Date(props.filters.date_from);
    const to = new Date(props.filters.date_to);
    const diff = Math.ceil((to.getTime() - from.getTime()) / (1000 * 60 * 60 * 24)) + 1;
    return Math.max(diff, 1);
});

const hasActiveFilters = computed(() =>
    !!props.filters.department ||
    !!props.filters.unit ||
    !!props.filters.device_id ||
    !!props.filters.search ||
    props.filters.attendance_status !== 'present' ||
    !!props.filters.tardy_filter
);
</script>

<template>
    <Head title="Attendance Report" />

    <AppLayout :breadcrumbs="breadcrumbs">
        <div class="flex h-full flex-1 flex-col gap-4 p-4 md:p-6">
            <!-- Header -->
            <div>
                <h2 class="text-2xl font-bold tracking-tight">Attendance Report</h2>
                <p class="text-muted-foreground">Detailed attendance data for the selected period</p>
            </div>

            <!-- Summary Cards -->
            <div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
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
                        <CardTitle class="text-sm font-medium">On Leave Today</CardTitle>
                        <Palmtree class="size-4 text-blue-600" />
                    </CardHeader>
                    <CardContent>
                        <div class="text-2xl font-bold text-blue-600">{{ summary.today_on_leave }}</div>
                        <p class="text-xs text-muted-foreground">Approved leave</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader class="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle class="text-sm font-medium">Absent Today</CardTitle>
                        <UserX class="size-4 text-red-600" />
                    </CardHeader>
                    <CardContent>
                        <div class="text-2xl font-bold text-red-600">{{ summary.today_absent }}</div>
                        <p class="text-xs text-muted-foreground">No leave on record</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader class="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle class="text-sm font-medium">Tardy Today</CardTitle>
                        <Clock class="size-4 text-yellow-600" />
                    </CardHeader>
                    <CardContent>
                        <div class="text-2xl font-bold text-yellow-600">{{ summary.today_tardy }}</div>
                        <p class="text-xs text-muted-foreground">Late arrivals</p>
                    </CardContent>
                </Card>
            </div>

            <Tabs v-model="groupBy" @update:model-value="applyFilters" class="space-y-4">
                <TabsList>
                    <TabsTrigger value="individual">Individual</TabsTrigger>
                    <TabsTrigger value="department">Departments</TabsTrigger>
                    <TabsTrigger value="unit">Units</TabsTrigger>
                </TabsList>

                <!-- Filters -->
                <Card>
                    <CardContent class="pt-5">
                        <!-- Primary Row: Date range + Actions -->
                        <div class="flex flex-wrap items-end gap-3">
                            <div class="space-y-1.5">
                                <Label for="date_from">From</Label>
                                <Input id="date_from" v-model="dateFrom" type="date" class="w-[150px]" />
                            </div>
                            <div class="space-y-1.5">
                                <Label for="date_to">To</Label>
                                <Input id="date_to" v-model="dateTo" type="date" class="w-[150px]" />
                            </div>
                            <div v-if="groupBy === 'individual'" class="space-y-1.5">
                                <Label>Search Employee</Label>
                                <div class="relative">
                                <Search class="absolute left-2.5 top-2.5 size-4 text-muted-foreground" />
                                <Input v-model="search" placeholder="Name or ID..." class="w-[180px] pl-8" @keyup.enter="applyFilters" />
                            </div>
                        </div>
                        <div class="ml-auto flex items-center gap-2">
                            <Button @click="applyFilters">
                                <Filter class="mr-2 size-4" />
                                Apply
                            </Button>
                            <Button v-if="hasActiveFilters" variant="outline" @click="clearFilters">
                                <X class="mr-2 size-4" />
                                Reset
                            </Button>
                            <Button variant="outline" @click="exportReport">
                                <Download class="mr-2 size-4" />
                                Export CSV
                            </Button>
                        </div>
                    </div>

                    <Separator class="my-4" />

                    <!-- Secondary Row: Contextual filters -->
                    <div class="flex flex-wrap items-end gap-3">
                        <div class="space-y-1.5">
                            <Label>Department</Label>
                            <Select :model-value="department || 'all'" @update:model-value="(v) => department = v === 'all' ? '' : v">
                                <SelectTrigger class="w-[160px]">
                                    <SelectValue placeholder="All departments" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All Departments</SelectItem>
                                    <SelectItem v-for="dept in filterOptions.departments" :key="dept" :value="dept">
                                        {{ dept }}
                                    </SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div class="space-y-1.5">
                            <Label>Unit</Label>
                            <Select :model-value="unit || 'all'" @update:model-value="(v) => unit = v === 'all' ? '' : v">
                                <SelectTrigger class="w-[150px]">
                                    <SelectValue placeholder="All units" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All Units</SelectItem>
                                    <SelectItem v-for="u in filterOptions.units" :key="u" :value="u">
                                        {{ u }}
                                    </SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div class="space-y-1.5">
                            <Label>Device</Label>
                            <Select :model-value="deviceId || 'all'" @update:model-value="(v) => deviceId = v === 'all' ? '' : v">
                                <SelectTrigger class="w-[155px]">
                                    <SelectValue placeholder="All devices" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All Devices</SelectItem>
                                    <SelectItem v-for="device in filterOptions.devices" :key="device.id" :value="String(device.id)">
                                        {{ device.name }}
                                    </SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <template v-if="groupBy === 'individual'">
                            <div class="space-y-1.5">
                                <Label>Status</Label>
                                <Select v-model="attendanceStatus" @update:model-value="applyFilters">
                                    <SelectTrigger class="w-[140px]">
                                        <SelectValue placeholder="Status" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">All</SelectItem>
                                        <SelectItem value="present">Present Only</SelectItem>
                                        <SelectItem value="absent">Absent Only</SelectItem>
                                        <SelectItem value="on_leave">On Leave Only</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div class="space-y-1.5">
                                <Label>Attendance</Label>
                                <Select v-model="tardyFilter" @update:model-value="applyFilters">
                                    <SelectTrigger class="w-[160px]">
                                        <SelectValue placeholder="All employees" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="">All Employees</SelectItem>
                                        <SelectItem value="late_in">Late In Only</SelectItem>
                                        <SelectItem value="early_out">Early Out Only</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </template>

                        <div v-if="groupBy === 'individual'" class="ml-auto self-end pb-[9px]">
                            <span class="text-sm text-muted-foreground">
                                {{ (reportData as EmployeeReport[]).length }} employee{{ (reportData as EmployeeReport[]).length === 1 ? '' : 's' }} shown
                                <span v-if="filters.attendance_status !== 'present'" class="text-xs">
                                    ({{ (reportData as EmployeeReport[]).filter(e => e.check_ins > 0).length }} with activity)
                                </span>
                            </span>
                        </div>
                    </div>
                </CardContent>
            </Card>

            <!-- Report Table -->
            <Card>
                <CardHeader>
                    <CardTitle>
                        <span v-if="groupBy === 'individual'">Employee Attendance Summary</span>
                        <span v-else-if="groupBy === 'department'">Attendance by Department</span>
                        <span v-else>Attendance by Unit</span>
                    </CardTitle>
                    <CardDescription>
                        {{ filters.date_from }} to {{ filters.date_to }} &mdash; {{ totalPossibleDays }} day{{ totalPossibleDays === 1 ? '' : 's' }}
                        <span v-if="filters.department"> &middot; {{ filters.department }}</span>
                        <span v-if="filters.unit"> &middot; {{ filters.unit }}</span>
                        <span v-if="filters.tardy_filter === 'late_in'"> &middot; <span class="text-destructive">Late In only</span></span>
                        <span v-if="filters.tardy_filter === 'early_out'"> &middot; <span class="text-destructive">Early Out only</span></span>
                    </CardDescription>
                </CardHeader>
                <CardContent class="p-0">

                    <!-- Grouped (Department / Unit) Table -->
                    <Table v-if="isGrouped">
                        <TableHeader>
                            <TableRow>
                                <TableHead>{{ groupBy === 'department' ? 'Department' : 'Unit' }}</TableHead>
                                <TableHead class="text-center">Employees</TableHead>
                                <TableHead class="text-center">Check Ins</TableHead>
                                <TableHead class="text-center">Check Outs</TableHead>
                                <TableHead class="text-center">Tardy</TableHead>
                                <TableHead class="text-center">Total Logs</TableHead>
                                <TableHead>Avg Check-Ins / Day</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            <TableRow
                                v-for="row in (reportData as GroupedReport[])"
                                :key="row.group"
                                class="cursor-pointer hover:bg-muted/50"
                                @click="drillDown(row)"
                            >
                                <TableCell class="font-medium">
                                    <span class="text-primary underline-offset-2 hover:underline">{{ row.group }}</span>
                                </TableCell>
                                <TableCell class="text-center">
                                    <Badge variant="outline">{{ row.total_employees }}</Badge>
                                </TableCell>
                                <TableCell class="text-center">
                                    <Badge variant="default">{{ row.check_ins }}</Badge>
                                </TableCell>
                                <TableCell class="text-center">
                                    <Badge variant="secondary">{{ row.check_outs }}</Badge>
                                </TableCell>
                                <TableCell class="text-center">
                                    <Badge :variant="row.tardy_count > 0 ? 'destructive' : 'outline'">
                                        {{ row.tardy_count }}
                                    </Badge>
                                </TableCell>
                                <TableCell class="text-center font-medium">{{ row.total_logs }}</TableCell>
                                <TableCell>
                                    <div class="flex items-center gap-2">
                                        <Progress
                                            :model-value="(row.total_employees * totalPossibleDays) > 0 ? Math.min(100, ((row.check_ins ?? 0) / (row.total_employees * totalPossibleDays)) * 100) : 0"
                                            class="h-2 w-20"
                                        />
                                        <span class="text-xs text-muted-foreground">
                                            {{ (row.total_employees * totalPossibleDays) > 0 ? Math.round(Math.min(100, ((row.check_ins ?? 0) / (row.total_employees * totalPossibleDays)) * 100)) : 0 }}%
                                        </span>
                                    </div>
                                </TableCell>
                            </TableRow>
                            <TableRow v-if="reportData.length === 0">
                                <TableCell colspan="7" class="text-center text-muted-foreground py-8">
                                    <BarChart3 class="size-8 mx-auto mb-2 opacity-50" />
                                    No data found for the selected period.
                                </TableCell>
                            </TableRow>
                        </TableBody>
                    </Table>

                    <!-- Individual Table -->
                    <Table v-else>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Employee</TableHead>
                                <TableHead>Department</TableHead>
                                <TableHead>Unit</TableHead>
                                <TableHead>Device</TableHead>
                                <TableHead class="text-center">Check Ins</TableHead>
                                <TableHead class="text-center">Check Outs</TableHead>
                                <TableHead class="text-center">Late In</TableHead>
                                <TableHead class="text-center">Early Out</TableHead>
                                <TableHead class="text-center">On Leave</TableHead>
                                <TableHead>Attendance Rate</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            <TableRow
                                v-for="emp in (reportData as EmployeeReport[])"
                                :key="emp.id"
                                :class="emp.on_leave_days > 0 && emp.check_ins === 0 ? 'bg-blue-50/50 dark:bg-blue-950/20' : ''"
                            >
                                <TableCell>
                                    <div class="flex items-center gap-2">
                                        <div>
                                            <Link
                                                :href="`/attendance?search=${emp.user_id}&date_from=${filters.date_from}&date_to=${filters.date_to}`"
                                                class="font-medium text-primary hover:underline"
                                                title="View daily logs"
                                            >
                                                {{ emp.name }}
                                            </Link>
                                            <p class="text-xs text-muted-foreground">{{ emp.user_id ?? `UID: ${emp.uid}` }}</p>
                                        </div>
                                        <Badge v-if="emp.on_leave_days > 0 && emp.check_ins === 0" class="shrink-0 bg-blue-100 text-blue-700 hover:bg-blue-100 dark:bg-blue-900 dark:text-blue-300">
                                            On Leave
                                        </Badge>
                                    </div>
                                </TableCell>
                                <TableCell>{{ emp.department ?? '—' }}</TableCell>
                                <TableCell>{{ emp.unit ?? '—' }}</TableCell>
                                <TableCell class="text-xs text-muted-foreground">{{ emp.device?.name ?? '—' }}</TableCell>
                                <TableCell class="text-center">
                                    <Badge variant="default">{{ emp.check_ins }}</Badge>
                                </TableCell>
                                <TableCell class="text-center">
                                    <Badge variant="secondary">{{ emp.check_outs }}</Badge>
                                </TableCell>
                                <TableCell class="text-center">
                                    <Badge :variant="emp.tardy_count > 0 ? 'destructive' : 'outline'">
                                        {{ emp.tardy_count }}
                                    </Badge>
                                </TableCell>
                                <TableCell class="text-center">
                                    <Badge :variant="emp.early_out_count > 0 ? 'destructive' : 'outline'">
                                        {{ emp.early_out_count }}
                                    </Badge>
                                </TableCell>
                                <TableCell class="text-center">
                                    <Badge v-if="emp.on_leave_days > 0" class="bg-blue-100 text-blue-700 hover:bg-blue-100 dark:bg-blue-900 dark:text-blue-300">
                                        {{ emp.on_leave_days }}d
                                    </Badge>
                                    <span v-else class="text-muted-foreground">—</span>
                                </TableCell>
                                <TableCell>
                                    <div class="flex items-center gap-2">
                                        <Progress
                                            :model-value="totalPossibleDays > 0 ? Math.min(100, ((emp.check_ins ?? 0) / totalPossibleDays) * 100) : 0"
                                            class="h-2 w-20"
                                        />
                                        <span class="text-xs text-muted-foreground">
                                            {{ totalPossibleDays > 0 ? Math.round(Math.min(100, ((emp.check_ins ?? 0) / totalPossibleDays) * 100)) : 0 }}%
                                        </span>
                                    </div>
                                </TableCell>
                            </TableRow>
                            <TableRow v-if="reportData.length === 0">
                                <TableCell colspan="10" class="text-center text-muted-foreground py-8">
                                    <BarChart3 class="size-8 mx-auto mb-2 opacity-50" />
                                    No employees found for the selected period.
                                </TableCell>
                            </TableRow>
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
            </Tabs>
        </div>
    </AppLayout>
</template>
