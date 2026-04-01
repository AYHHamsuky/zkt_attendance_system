<script setup lang="ts">
import { Head, Link, router, useForm } from '@inertiajs/vue3';
import AppLayout from '@/layouts/AppLayout.vue';
import { type BreadcrumbItem } from '@/types';
import { Card, CardContent } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Search, ClipboardList, BarChart2, LogIn, LogOut, Clock } from 'lucide-vue-next';
import { ref, watch } from 'vue';
import { debounce } from '@/lib/debounce';

interface Session {
    employee_id: number;
    employee_name: string;
    employee_user_id: string;
    employee_department: string | null;
    log_date: string;
    clock_in: string | null;
    clock_out: string | null;
}

interface PaginatedSessions {
    data: Session[];
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
    links: Array<{ url: string | null; label: string; active: boolean }>;
}

interface MyClockStatus {
    clock_in: string | null;
    clock_out: string | null;
    is_clocked_in: boolean;
}

const props = defineProps<{
    sessions: PaginatedSessions;
    filters: {
        search?: string;
        date_from?: string;
        date_to?: string;
        department?: string;
    };
    departments: string[];
    myClockStatus: MyClockStatus | null;
}>();

const clockForm = useForm({});

function submitClock() {
    clockForm.post(route('attendance.manual-clock'));
}

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Attendance' },
];

const today = new Date().toISOString().split('T')[0];
const search     = ref(props.filters.search ?? '');
const dateFrom   = ref(props.filters.date_from ?? today);
const dateTo     = ref(props.filters.date_to ?? today);
const department = ref(props.filters.department ?? '');

const applyFilters = debounce(() => {
    router.get('/attendance', {
        search:     search.value || undefined,
        date_from:  dateFrom.value || undefined,
        date_to:    dateTo.value || undefined,
        department: department.value || undefined,
    }, { preserveState: true, replace: true });
}, 300);

watch([search], () => applyFilters());

function onDateChange() { applyFilters(); }

function onDepartmentChange(val: string) {
    department.value = val === 'all' ? '' : val;
    applyFilters();
}

function formatTime(dt: string | null): string {
    if (!dt) return '—';
    return new Date(dt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

function formatDate(d: string): string {
    return new Date(d + 'T00:00:00').toLocaleDateString([], {
        weekday: 'short', year: 'numeric', month: 'short', day: 'numeric',
    });
}

function duration(clockIn: string | null, clockOut: string | null): string {
    if (!clockIn || !clockOut) return '—';
    const mins = Math.round((new Date(clockOut).getTime() - new Date(clockIn).getTime()) / 60000);
    if (mins <= 0) return '—';
    const h = Math.floor(mins / 60);
    const m = mins % 60;
    return h > 0 ? `${h}h ${m}m` : `${m}m`;
}

function sessionStatus(s: Session): 'in' | 'out' | 'partial' {
    if (s.clock_in && s.clock_out) return 'out';
    if (s.clock_in) return 'in';
    return 'partial';
}
</script>

<template>
    <Head title="Attendance" />

    <AppLayout :breadcrumbs="breadcrumbs">
        <div class="flex h-full flex-1 flex-col gap-4 p-4 md:p-6">
            <!-- Header -->
            <div class="flex items-center justify-between">
                <div>
                    <h2 class="text-2xl font-bold tracking-tight">Attendance</h2>
                    <p class="text-muted-foreground">{{ sessions.total }} sessions found</p>
                </div>
                <Button as-child variant="outline">
                    <Link href="/attendance/report">
                        <BarChart2 class="mr-2 size-4" />
                        View Report
                    </Link>
                </Button>
            </div>

            <!-- Manual Clock-In/Out (super admin only) -->
            <Card v-if="myClockStatus !== null" class="border-primary/20 bg-primary/5">
                <CardContent class="flex items-center justify-between gap-4 p-4">
                    <div class="flex items-center gap-3">
                        <div class="flex size-10 items-center justify-center rounded-full bg-primary/10">
                            <Clock class="size-5 text-primary" />
                        </div>
                        <div>
                            <p class="text-sm font-semibold">My Attendance Today</p>
                            <p class="text-xs text-muted-foreground">
                                <span v-if="myClockStatus.clock_in">
                                    In: {{ myClockStatus.clock_in }}
                                    <span v-if="myClockStatus.clock_out"> &nbsp;·&nbsp; Out: {{ myClockStatus.clock_out }}</span>
                                </span>
                                <span v-else>Not clocked in yet</span>
                            </p>
                        </div>
                    </div>
                    <div class="flex items-center gap-2">
                        <Badge :variant="myClockStatus.is_clocked_in ? 'default' : 'secondary'" class="hidden sm:flex">
                            {{ myClockStatus.is_clocked_in ? 'Clocked In' : 'Clocked Out' }}
                        </Badge>
                        <Button
                            :variant="myClockStatus.is_clocked_in ? 'outline' : 'default'"
                            :disabled="clockForm.processing"
                            @click="submitClock"
                        >
                            <LogOut v-if="myClockStatus.is_clocked_in" class="mr-2 size-4" />
                            <LogIn v-else class="mr-2 size-4" />
                            {{ myClockStatus.is_clocked_in ? 'Clock Out' : 'Clock In' }}
                        </Button>
                    </div>
                </CardContent>
            </Card>

            <!-- Filters -->
            <div class="flex flex-wrap gap-3">
                <div class="relative flex-1 min-w-[200px] max-w-sm">
                    <Search class="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                    <Input
                        v-model="search"
                        placeholder="Search by name or payroll ID..."
                        class="pl-9"
                    />
                </div>
                <Input v-model="dateFrom" type="date" class="w-[160px]" @change="onDateChange" />
                <Input v-model="dateTo"   type="date" class="w-[160px]" @change="onDateChange" />
                <Select :model-value="department || 'all'" @update:model-value="onDepartmentChange">
                    <SelectTrigger class="w-[180px]">
                        <SelectValue placeholder="All Departments" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">All Departments</SelectItem>
                        <SelectItem v-for="dept in departments" :key="dept" :value="dept">
                            {{ dept }}
                        </SelectItem>
                    </SelectContent>
                </Select>
            </div>

            <!-- Table -->
            <Card>
                <CardContent class="p-0">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Employee</TableHead>
                                <TableHead>Department</TableHead>
                                <TableHead>Date</TableHead>
                                <TableHead>Time In</TableHead>
                                <TableHead>Time Out</TableHead>
                                <TableHead>Duration</TableHead>
                                <TableHead>Status</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            <TableRow v-for="(s, i) in sessions.data" :key="`${s.employee_id}-${s.log_date}-${i}`">
                                <TableCell>
                                    <div>
                                        <p class="font-medium">{{ s.employee_name }}</p>
                                        <p class="text-xs text-muted-foreground">{{ s.employee_user_id }}</p>
                                    </div>
                                </TableCell>
                                <TableCell class="text-sm">{{ s.employee_department ?? '—' }}</TableCell>
                                <TableCell class="text-sm whitespace-nowrap">{{ formatDate(s.log_date) }}</TableCell>
                                <TableCell class="font-mono text-sm">{{ formatTime(s.clock_in) }}</TableCell>
                                <TableCell class="font-mono text-sm">{{ formatTime(s.clock_out) }}</TableCell>
                                <TableCell class="text-sm">{{ duration(s.clock_in, s.clock_out) }}</TableCell>
                                <TableCell>
                                    <Badge
                                        :variant="sessionStatus(s) === 'out' ? 'default' : sessionStatus(s) === 'in' ? 'secondary' : 'outline'"
                                    >
                                        {{ sessionStatus(s) === 'out' ? 'Complete' : sessionStatus(s) === 'in' ? 'Clocked In' : 'No Clock-In' }}
                                    </Badge>
                                </TableCell>
                            </TableRow>
                            <TableRow v-if="sessions.data.length === 0">
                                <TableCell colspan="7" class="text-center text-muted-foreground py-8">
                                    <ClipboardList class="size-8 mx-auto mb-2 opacity-50" />
                                    No attendance sessions found for this period.
                                </TableCell>
                            </TableRow>
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>

            <!-- Pagination -->
            <div v-if="sessions.last_page > 1" class="flex items-center justify-center gap-1">
                <template v-for="link in sessions.links" :key="link.label">
                    <Button
                        v-if="link.url"
                        size="sm"
                        :variant="link.active ? 'default' : 'outline'"
                        as-child
                    >
                        <Link :href="link.url" preserve-state v-html="link.label" />
                    </Button>
                    <Button
                        v-else
                        size="sm"
                        variant="outline"
                        disabled
                        v-html="link.label"
                    />
                </template>
            </div>
        </div>
    </AppLayout>
</template>
