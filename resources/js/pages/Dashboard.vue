<script setup lang="ts">
import { computed } from 'vue';
import { Head, Link } from '@inertiajs/vue3';
import AppLayout from '@/layouts/AppLayout.vue';
import { type BreadcrumbItem } from '@/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Users, UserCheck, UserX, Server, Wifi, BarChart3, Clock, AlertCircle } from 'lucide-vue-next';
import { dashboard } from '@/routes';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';
import { Bar } from 'vue-chartjs';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

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

interface DepartmentPunctuality {
    department: string;
    on_time: number;
    late: number;
    total: number;
}

interface Props {
    stats: {
        total_employees: number;
        today_present: number;
        today_absent: number;
        today_on_time: number;
        today_late: number;
        total_devices: number;
        online_devices: number;
    };
    recentLogs: AttendanceLog[];
    weeklyData: WeeklyData[];
    departmentPunctuality: DepartmentPunctuality[];
    resumptionPolicy: {
        start: string;
        grace: string;
        close: string;
    };
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

// --- Department Punctuality Chart ---
const deptChartData = computed(() => ({
    labels: props.departmentPunctuality.map(d => d.department),
    datasets: [
        {
            label: 'On Time / Early',
            data: props.departmentPunctuality.map(d => d.on_time),
            backgroundColor: '#16a34a',
            borderColor: '#15803d',
            borderWidth: 1,
            borderRadius: 4,
        },
        {
            label: 'Late (after 08:30)',
            data: props.departmentPunctuality.map(d => d.late),
            backgroundColor: '#dc2626',
            borderColor: '#b91c1c',
            borderWidth: 1,
            borderRadius: 4,
        },
    ],
}));

const deptChartOptions = computed(() => ({
    indexAxis: 'y' as const,
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
        legend: {
            position: 'top' as const,
            labels: {
                boxWidth: 12,
                padding: 16,
                font: { size: 12 },
            },
        },
        tooltip: {
            callbacks: {
                afterBody: (items: { dataIndex: number }[]) => {
                    const idx = items[0]?.dataIndex;
                    if (idx === undefined) { return ''; }
                    const dept = props.departmentPunctuality[idx];
                    const pct = dept.total > 0
                        ? Math.round((dept.on_time / dept.total) * 100)
                        : 0;
                    return `Punctuality rate: ${pct}%`;
                },
            },
        },
    },
    scales: {
        x: {
            stacked: true,
            grid: { color: 'rgba(0,0,0,0.05)' },
            ticks: { precision: 0, font: { size: 11 } },
        },
        y: {
            stacked: true,
            ticks: {
                font: { size: 11 },
                callback: (value: unknown, index: number) => {
                    const label = props.departmentPunctuality[index]?.department ?? '';
                    return label.length > 28 ? label.slice(0, 26) + '…' : label;
                },
            },
        },
    },
}));

// --- Weekly Chart (Bar) ---
const weeklyChartData = computed(() => ({
    labels: props.weeklyData.map(d => d.date),
    datasets: [
        {
            label: 'Present',
            data: props.weeklyData.map(d => d.present),
            backgroundColor: '#16a34a',
            borderColor: '#15803d',
            borderWidth: 1,
            borderRadius: 4,
        },
        {
            label: 'Absent',
            data: props.weeklyData.map(d => d.absent),
            backgroundColor: '#e5e7eb',
            borderColor: '#d1d5db',
            borderWidth: 1,
            borderRadius: 4,
        },
    ],
}));

const weeklyChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
        legend: {
            position: 'top' as const,
            labels: { boxWidth: 12, padding: 16, font: { size: 12 } },
        },
    },
    scales: {
        x: {
            stacked: true,
            grid: { display: false },
            ticks: { font: { size: 11 } },
        },
        y: {
            stacked: true,
            grid: { color: 'rgba(0,0,0,0.05)' },
            ticks: { precision: 0, font: { size: 11 } },
        },
    },
};

const onTimePct = computed(() => {
    const total = props.stats.today_on_time + props.stats.today_late;
    return total > 0 ? Math.round((props.stats.today_on_time / total) * 100) : 0;
});
</script>

<template>
    <Head title="Dashboard" />

    <AppLayout :breadcrumbs="breadcrumbs">
        <div class="flex h-full flex-1 flex-col gap-6 p-4 md:p-6">

            <!-- Stats Cards -->
            <div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-7">
                <Card>
                    <CardHeader class="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle class="text-sm font-medium">Total Employees</CardTitle>
                        <Users class="size-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div class="text-2xl font-bold">{{ stats.total_employees }}</div>
                        <p class="text-xs text-muted-foreground">Active Head Office staff</p>
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
                        <CardTitle class="text-sm font-medium">On Time</CardTitle>
                        <Clock class="size-4 text-green-600" />
                    </CardHeader>
                    <CardContent>
                        <div class="text-2xl font-bold text-green-600">{{ stats.today_on_time }}</div>
                        <p class="text-xs text-muted-foreground">Arrived by {{ resumptionPolicy.grace }}</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader class="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle class="text-sm font-medium">Late</CardTitle>
                        <AlertCircle class="size-4 text-amber-600" />
                    </CardHeader>
                    <CardContent>
                        <div class="text-2xl font-bold text-amber-600">{{ stats.today_late }}</div>
                        <p class="text-xs text-muted-foreground">Arrived after {{ resumptionPolicy.grace }}</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader class="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle class="text-sm font-medium">Punctuality</CardTitle>
                        <BarChart3 class="size-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div class="text-2xl font-bold">{{ onTimePct }}%</div>
                        <p class="text-xs text-muted-foreground">On-time rate today</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader class="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle class="text-sm font-medium">Devices</CardTitle>
                        <Wifi class="size-4 text-green-600" />
                    </CardHeader>
                    <CardContent>
                        <div class="text-2xl font-bold">
                            <span class="text-green-600">{{ stats.online_devices }}</span>
                            <span class="text-sm font-normal text-muted-foreground"> / {{ stats.total_devices }}</span>
                        </div>
                        <p class="text-xs text-muted-foreground">Online devices</p>
                    </CardContent>
                </Card>
            </div>

            <!-- Policy Note -->
            <div class="rounded-md border border-amber-200 bg-amber-50 px-4 py-2 text-sm text-amber-800 dark:border-amber-800 dark:bg-amber-950/20 dark:text-amber-400">
                <strong>Resumption policy:</strong>
                Resumption at {{ resumptionPolicy.start }} · Grace period until {{ resumptionPolicy.grace }} ·
                Anything after {{ resumptionPolicy.grace }} is <strong>Late</strong> · Closing time {{ resumptionPolicy.close }}
            </div>

            <!-- Charts Row -->
            <div class="grid gap-4 md:grid-cols-5">
                <!-- Weekly Attendance Chart -->
                <Card class="md:col-span-2">
                    <CardHeader>
                        <CardTitle>Weekly Attendance</CardTitle>
                        <CardDescription>Present vs Absent — last 7 days</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div class="h-64">
                            <Bar :data="weeklyChartData" :options="weeklyChartOptions" />
                        </div>
                    </CardContent>
                </Card>

                <!-- Department Punctuality Chart -->
                <Card class="md:col-span-3">
                    <CardHeader>
                        <CardTitle>Department Punctuality — Today</CardTitle>
                        <CardDescription>
                            On time (≤ {{ resumptionPolicy.grace }}) vs Late — by department
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div v-if="departmentPunctuality.length > 0"
                             :style="{ height: Math.max(200, departmentPunctuality.length * 36) + 'px' }">
                            <Bar :data="deptChartData" :options="deptChartOptions" />
                        </div>
                        <div v-else class="flex h-48 flex-col items-center justify-center gap-2 text-muted-foreground">
                            <BarChart3 class="size-10 opacity-30" />
                            <p class="text-sm">No attendance data yet for today.</p>
                        </div>
                    </CardContent>
                </Card>
            </div>

            <!-- Quick Actions -->
            <div class="grid gap-4 md:grid-cols-4">
                <Card>
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

                <!-- Recent Logs -->
                <Card class="md:col-span-3">
                    <CardHeader>
                        <CardTitle>Recent Attendance Logs</CardTitle>
                        <CardDescription>Latest 10 records from all devices</CardDescription>
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
                                    <TableCell colspan="5" class="py-8 text-center text-muted-foreground">
                                        No attendance logs yet. Connect a device and sync attendance data.
                                    </TableCell>
                                </TableRow>
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            </div>

        </div>
    </AppLayout>
</template>
