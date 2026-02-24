<script setup lang="ts">
import { Head, Link, router } from '@inertiajs/vue3';
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
import { Search, ClipboardList, Download } from 'lucide-vue-next';
import { ref, watch } from 'vue';
import { debounce } from '@/lib/debounce';

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

interface PaginatedData {
    data: AttendanceLog[];
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
    links: Array<{ url: string | null; label: string; active: boolean }>;
}

const props = defineProps<{
    logs: PaginatedData;
    filters: {
        search?: string;
        date_from?: string;
        date_to?: string;
        state?: string;
    };
}>();

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Attendance' },
];

const search = ref(props.filters.search ?? '');
const dateFrom = ref(props.filters.date_from ?? '');
const dateTo = ref(props.filters.date_to ?? '');
const state = ref(props.filters.state ?? '');

const applyFilters = debounce(() => {
    router.get('/attendance', {
        search: search.value || undefined,
        date_from: dateFrom.value || undefined,
        date_to: dateTo.value || undefined,
        state: state.value || undefined,
    }, {
        preserveState: true,
        replace: true,
    });
}, 300);

watch([search], () => applyFilters());

function onDateChange() {
    applyFilters();
}

function onStateChange(val: any) {
    const v = String(val ?? '');
    state.value = v === 'all' ? '' : v;
    applyFilters();
}

function stateBadgeVariant(s: number): 'default' | 'secondary' | 'destructive' | 'outline' {
    switch (s) {
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
</script>

<template>
    <Head title="Attendance Logs" />

    <AppLayout :breadcrumbs="breadcrumbs">
        <div class="flex h-full flex-1 flex-col gap-4 p-4 md:p-6">
            <!-- Header -->
            <div class="flex items-center justify-between">
                <div>
                    <h2 class="text-2xl font-bold tracking-tight">Attendance Logs</h2>
                    <p class="text-muted-foreground">{{ logs.total }} records found</p>
                </div>
                <Button as-child variant="outline">
                    <Link href="/attendance/report">
                        <Download class="mr-2 size-4" />
                        View Report
                    </Link>
                </Button>
            </div>

            <!-- Filters -->
            <div class="flex flex-wrap gap-3">
                <div class="relative flex-1 min-w-[200px] max-w-sm">
                    <Search class="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                    <Input
                        v-model="search"
                        placeholder="Search by employee name..."
                        class="pl-9"
                    />
                </div>
                <Input
                    v-model="dateFrom"
                    type="date"
                    class="w-[160px]"
                    @change="onDateChange"
                />
                <Input
                    v-model="dateTo"
                    type="date"
                    class="w-[160px]"
                    @change="onDateChange"
                />
                <Select :model-value="state || 'all'" @update:model-value="onStateChange">
                    <SelectTrigger class="w-[160px]">
                        <SelectValue placeholder="All States" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">All States</SelectItem>
                        <SelectItem value="0">Check In</SelectItem>
                        <SelectItem value="1">Check Out</SelectItem>
                        <SelectItem value="2">Break Out</SelectItem>
                        <SelectItem value="3">Break In</SelectItem>
                        <SelectItem value="4">OT In</SelectItem>
                        <SelectItem value="5">OT Out</SelectItem>
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
                                <TableHead>Device</TableHead>
                                <TableHead>Date &amp; Time</TableHead>
                                <TableHead>State</TableHead>
                                <TableHead>Method</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            <TableRow v-for="log in logs.data" :key="log.id">
                                <TableCell>
                                    <div>
                                        <p class="font-medium">{{ log.employee?.name ?? `UID: ${log.uid}` }}</p>
                                        <p v-if="log.employee" class="text-xs text-muted-foreground">{{ log.employee.user_id }}</p>
                                    </div>
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
                            <TableRow v-if="logs.data.length === 0">
                                <TableCell colspan="5" class="text-center text-muted-foreground py-8">
                                    <ClipboardList class="size-8 mx-auto mb-2 opacity-50" />
                                    No attendance records found. Sync data from a device first.
                                </TableCell>
                            </TableRow>
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>

            <!-- Pagination -->
            <div v-if="logs.last_page > 1" class="flex items-center justify-center gap-1">
                <template v-for="link in logs.links" :key="link.label">
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
