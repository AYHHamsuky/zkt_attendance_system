<script setup lang="ts">
import { Head, Link, router } from '@inertiajs/vue3';
import AppLayout from '@/layouts/AppLayout.vue';
import { type BreadcrumbItem } from '@/types';
import { Card, CardContent } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, Plus, Eye, DoorOpen, CheckCircle } from 'lucide-vue-next';
import { ref, watch } from 'vue';
import { debounce } from '@/lib/debounce';

interface Resignation {
    id: number;
    employee: { id: number; name: string };
    resignation_date: string;
    last_working_date: string;
    exit_type: string;
    status: string;
    handover_completed: boolean;
    exit_interview_completed: boolean;
    clearance_completed: boolean;
}

interface PaginatedData {
    data: Resignation[];
    current_page: number;
    last_page: number;
    total: number;
    links: Array<{ url: string | null; label: string; active: boolean }>;
}

const props = defineProps<{
    resignations: PaginatedData;
    filters: { search?: string; status?: string };
}>();

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'HRIS', href: '/hr' },
    { title: 'Resignations' },
];

const search = ref(props.filters.search ?? '');
const status = ref(props.filters.status ?? '');

const applyFilters = debounce(() => {
    router.get('/hr/resignations', {
        search: search.value || undefined,
        status: status.value || undefined,
    }, { preserveState: true, replace: true });
}, 300);

watch([search], () => applyFilters());

function onStatusChange(val: unknown) {
    const v = String(val ?? '');
    status.value = v === 'all' ? '' : v;
    applyFilters();
}

function accept(id: number) {
    router.post(`/hr/resignations/${id}/accept`, {});
}

const statusVariant: Record<string, 'default' | 'secondary' | 'destructive' | 'outline'> = {
    pending: 'secondary',
    accepted: 'default',
    withdrawn: 'outline',
    completed: 'outline',
};

function checklistCount(res: Resignation): number {
    return [res.handover_completed, res.exit_interview_completed, res.clearance_completed].filter(Boolean).length;
}
</script>

<template>
    <Head title="Resignations" />
    <AppLayout :breadcrumbs="breadcrumbs">
        <div class="flex h-full flex-1 flex-col gap-4 p-4 md:p-6">
            <div class="flex items-center justify-between">
                <div>
                    <h2 class="text-2xl font-bold tracking-tight">Employee Resignations</h2>
                    <p class="text-muted-foreground">{{ resignations.total }} resignation records</p>
                </div>
                <Button as-child>
                    <Link href="/hr/resignations/create"><Plus class="mr-2 size-4" />Record Resignation</Link>
                </Button>
            </div>

            <div class="flex flex-wrap gap-3">
                <div class="relative min-w-[200px] flex-1 max-w-sm">
                    <Search class="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                    <Input v-model="search" placeholder="Search employee..." class="pl-9" />
                </div>
                <Select :model-value="status || 'all'" @update:model-value="onStatusChange">
                    <SelectTrigger class="w-[140px]"><SelectValue placeholder="Status" /></SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">All Status</SelectItem>
                        <SelectItem value="pending">Pending</SelectItem>
                        <SelectItem value="accepted">Accepted</SelectItem>
                        <SelectItem value="withdrawn">Withdrawn</SelectItem>
                        <SelectItem value="completed">Completed</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            <Card>
                <CardContent class="p-0">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Employee</TableHead>
                                <TableHead>Exit Type</TableHead>
                                <TableHead>Resignation Date</TableHead>
                                <TableHead>Last Working Day</TableHead>
                                <TableHead>Checklist</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead class="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            <TableRow v-for="res in resignations.data" :key="res.id">
                                <TableCell class="font-medium">{{ res.employee.name }}</TableCell>
                                <TableCell class="capitalize">{{ res.exit_type.replace('_', ' ') }}</TableCell>
                                <TableCell>{{ res.resignation_date }}</TableCell>
                                <TableCell>{{ res.last_working_date }}</TableCell>
                                <TableCell>
                                    <span class="text-sm font-medium">{{ checklistCount(res) }}/3</span>
                                    <span class="text-xs text-muted-foreground ml-1">done</span>
                                </TableCell>
                                <TableCell>
                                    <Badge :variant="statusVariant[res.status] ?? 'secondary'" class="capitalize">
                                        {{ res.status }}
                                    </Badge>
                                </TableCell>
                                <TableCell class="text-right">
                                    <div class="flex justify-end gap-1">
                                        <Button v-if="res.status === 'pending'" size="sm" variant="ghost" class="text-green-600" @click="accept(res.id)">
                                            <CheckCircle class="size-4" />
                                        </Button>
                                        <Button size="sm" variant="ghost" as-child>
                                            <Link :href="`/hr/resignations/${res.id}`"><Eye class="size-4" /></Link>
                                        </Button>
                                    </div>
                                </TableCell>
                            </TableRow>
                            <TableRow v-if="resignations.data.length === 0">
                                <TableCell colspan="7" class="py-8 text-center text-muted-foreground">
                                    <DoorOpen class="size-8 mx-auto mb-2 opacity-50" />
                                    No resignation records found.
                                </TableCell>
                            </TableRow>
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>

            <div v-if="resignations.last_page > 1" class="flex items-center justify-center gap-1">
                <template v-for="link in resignations.links" :key="link.label">
                    <Button v-if="link.url" size="sm" :variant="link.active ? 'default' : 'outline'" as-child>
                        <Link :href="link.url" preserve-state v-html="link.label" />
                    </Button>
                    <Button v-else size="sm" variant="outline" disabled v-html="link.label" />
                </template>
            </div>
        </div>
    </AppLayout>
</template>
