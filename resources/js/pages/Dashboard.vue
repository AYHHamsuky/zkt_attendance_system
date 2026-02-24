<script setup lang="ts">
import { Head, Link } from '@inertiajs/vue3';
import AppLayout from '@/layouts/AppLayout.vue';
import { type BreadcrumbItem } from '@/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Users, UserCheck, UserX, Server, Wifi, BarChart3 } from 'lucide-vue-next';
import { dashboard } from '@/routes';

interface AttendanceLog {
    id: number;
    uid: string;
    timestamp: string;
    state: number;
    type: number;
    state_label: string;
    type_label: string;
    employee: { id: number; name: string; user_id: string } | null;
    device: { id: number; name: string } | null;
}

interface WeeklyData {
    date: string;
    present: number;
    absent: number;
}

interface Props {
    stats: {
        total_employees: number;
        today_present: number;
        today_absent: number;
        total_devices: number;
        online_devices: number;
    };
    recentLogs: AttendanceLog[];
    weeklyData: WeeklyData[];
}

const props = defineProps<Props>();

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: dashboard().url },
];

function stateBadgeVariant(state: number): 'default' | 'secondary' | 'destructive' | 'outline' {
    switch (state) {
        case 0: return 'default';
        case 1: return 'secondary';
        case 2: return 'destructive';
        case 3: return 'outline';
        default: return 'outline';
    }
}

function formatTime(timestamp: string): string {
    return new Date(timestamp).toLocaleString();
}

const maxWeekly = Math.max(...props.weeklyData.map(d => d.present), 1);
</script>

<template>
    <Head title="Dashboard" />

    <AppLayout :breadcrumbs="breadcrumbs">
        <div class="flex h-full flex-1 flex-col gap-6 p-4 md:p-6">
            <!-- Stats Cards -->
            <div class="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
                <Card>
                    <CardHeader class="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle class="text-sm font-medium">Total Employees</CardTitle>
                        <Users class="size-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div class="text-2xl font-bold">{{ stats.total_employees }}</div>
                        <p class="text-xs text-muted-foreground">Active employees registered</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader class="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle class="text-sm font-medium">Present Today</CardTitle>
                        <UserCheck class="size-4 text-green-600" />
                    </CardHeader>
                    <CardContent>
                        <div class="text-2xl font-bold text-green-600">{{ stats.today_present }}</div>
                        <p class="text-xs text-muted-foreground">Checked in today</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader class="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle class="text-sm font-medium">Absent Today</CardTitle>
                        <UserX class="size-4 text-red-600" />
                    </CardHeader>
                    <CardContent>
                        <div class="text-2xl font-bold text-red-600">{{ stats.today_absent }}</div>
                        <p class="text-xs text-muted-foreground">Not checked in</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader class="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle class="text-sm font-medium">Total Devices</CardTitle>
                        <Server class="size-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div class="text-2xl font-bold">{{ stats.total_devices }}</div>
                        <p class="text-xs text-muted-foreground">Registered devices</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader class="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle class="text-sm font-medium">Online Devices</CardTitle>
                        <Wifi class="size-4 text-green-600" />
                    </CardHeader>
                    <CardContent>
                        <div class="text-2xl font-bold">
                            <span class="text-green-600">{{ stats.online_devices }}</span>
                            <span class="text-sm font-normal text-muted-foreground"> / {{ stats.total_devices }}</span>
                        </div>
                        <p class="text-xs text-muted-foreground">Currently connected</p>
                    </CardContent>
                </Card>
            </div>

            <div class="grid gap-4 md:grid-cols-7">
                <!-- Weekly Chart -->
                <Card class="md:col-span-4">
                    <CardHeader>
                        <CardTitle>Weekly Attendance</CardTitle>
                        <CardDescription>Employees present per day (last 7 days)</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div class="flex items-end gap-2 h-48">
                            <div v-for="day in weeklyData" :key="day.date" class="flex flex-1 flex-col items-center gap-1">
                                <span class="text-xs font-medium text-muted-foreground">{{ day.present }}</span>
                                <div
                                    class="w-full rounded-t bg-primary transition-all"
                                    :style="{ height: `${(day.present / maxWeekly) * 100}%`, minHeight: day.present > 0 ? '4px' : '0px' }"
                                ></div>
                                <span class="text-xs text-muted-foreground">{{ day.date }}</span>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <!-- Quick Actions -->
                <Card class="md:col-span-3">
                    <CardHeader>
                        <CardTitle>Quick Actions</CardTitle>
                        <CardDescription>Common tasks</CardDescription>
                    </CardHeader>
                    <CardContent class="grid gap-2">
                        <Button as-child variant="outline" class="justify-start">
                            <Link href="/devices">
                                <Server class="mr-2 size-4" />
                                Manage Devices
                            </Link>
                        </Button>
                        <Button as-child variant="outline" class="justify-start">
                            <Link href="/employees">
                                <Users class="mr-2 size-4" />
                                Manage Employees
                            </Link>
                        </Button>
                        <Button as-child variant="outline" class="justify-start">
                            <Link href="/attendance">
                                <UserCheck class="mr-2 size-4" />
                                View Attendance
                            </Link>
                        </Button>
                        <Button as-child variant="outline" class="justify-start">
                            <Link href="/attendance/report">
                                <BarChart3 class="mr-2 size-4" />
                                View Reports
                            </Link>
                        </Button>
                    </CardContent>
                </Card>
            </div>

            <!-- Recent Logs -->
            <Card>
                <CardHeader>
                    <CardTitle>Recent Attendance Logs</CardTitle>
                    <CardDescription>Latest 10 attendance records from all devices</CardDescription>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Employee</TableHead>
                                <TableHead>Device</TableHead>
                                <TableHead>Time</TableHead>
                                <TableHead>State</TableHead>
                                <TableHead>Method</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            <TableRow v-for="log in recentLogs" :key="log.id">
                                <TableCell class="font-medium">
                                    {{ log.employee?.name ?? `UID: ${log.uid}` }}
                                </TableCell>
                                <TableCell>{{ log.device?.name ?? '—' }}</TableCell>
                                <TableCell>{{ formatTime(log.timestamp) }}</TableCell>
                                <TableCell>
                                    <Badge :variant="stateBadgeVariant(log.state)">
                                        {{ log.state_label }}
                                    </Badge>
                                </TableCell>
                                <TableCell>{{ log.type_label }}</TableCell>
                            </TableRow>
                            <TableRow v-if="recentLogs.length === 0">
                                <TableCell colspan="5" class="text-center text-muted-foreground py-8">
                                    No attendance logs yet. Connect a device and sync attendance data.
                                </TableCell>
                            </TableRow>
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    </AppLayout>
</template>
