<script setup lang="ts">
import { Head, Link, router } from '@inertiajs/vue3';
import AppLayout from '@/layouts/AppLayout.vue';
import { type BreadcrumbItem } from '@/types';
import { Card, CardContent } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Eye } from 'lucide-vue-next';
import { ref, watch } from 'vue';
import { debounce } from '@/lib/debounce';

interface Review {
    id: number;
    status: string;
    overall_score: string | null;
    employee: { name: string; department: string | null };
    cycle: { id: number; name: string };
    reviewer: { name: string };
}

interface Cycle { id: number; name: string; year: number }

interface PaginatedData {
    data: Review[];
    current_page: number;
    last_page: number;
    total: number;
    links: Array<{ url: string | null; label: string; active: boolean }>;
}

const props = defineProps<{
    reviews: PaginatedData;
    cycles: Cycle[];
    filters: { cycle_id?: string; status?: string };
}>();

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'HRIS', href: '/hr' },
    { title: 'Performance', href: '/hr/performance/cycles' },
    { title: 'All Reviews' },
];

const cycleId = ref(props.filters.cycle_id ?? '');
const status = ref(props.filters.status ?? '');

const applyFilters = debounce(() => {
    router.get('/hr/performance/reviews', {
        cycle_id: cycleId.value || undefined,
        status: status.value || undefined,
    }, { preserveState: true, replace: true });
}, 300);

watch([cycleId, status], () => applyFilters());

const statusVariant: Record<string, 'default' | 'secondary' | 'outline'> = {
    pending: 'secondary', submitted: 'default', acknowledged: 'outline', finalized: 'default',
};
</script>

<template>
    <Head title="Performance Reviews" />
    <AppLayout :breadcrumbs="breadcrumbs">
        <div class="flex h-full flex-1 flex-col gap-4 p-4 md:p-6">
            <div class="flex items-center justify-between">
                <div>
                    <h2 class="text-2xl font-bold">Performance Reviews</h2>
                    <p class="text-muted-foreground">{{ reviews.total }} reviews</p>
                </div>
            </div>

            <div class="flex gap-3">
                <Select :model-value="cycleId || 'all'" @update:model-value="v => cycleId = String(v) === 'all' ? '' : String(v)">
                    <SelectTrigger class="w-[200px]"><SelectValue placeholder="Filter by cycle" /></SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">All Cycles</SelectItem>
                        <SelectItem v-for="cycle in cycles" :key="cycle.id" :value="String(cycle.id)">{{ cycle.name }}</SelectItem>
                    </SelectContent>
                </Select>
                <Select :model-value="status || 'all'" @update:model-value="v => status = String(v) === 'all' ? '' : String(v)">
                    <SelectTrigger class="w-[160px]"><SelectValue placeholder="Status" /></SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">All Status</SelectItem>
                        <SelectItem value="pending">Pending</SelectItem>
                        <SelectItem value="submitted">Submitted</SelectItem>
                        <SelectItem value="acknowledged">Acknowledged</SelectItem>
                        <SelectItem value="finalized">Finalized</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            <Card>
                <CardContent class="p-0">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Employee</TableHead>
                                <TableHead>Cycle</TableHead>
                                <TableHead>Reviewer</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead>Score</TableHead>
                                <TableHead class="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            <TableRow v-for="review in reviews.data" :key="review.id">
                                <TableCell>
                                    <p class="font-medium">{{ review.employee.name }}</p>
                                    <p v-if="review.employee.department" class="text-xs text-muted-foreground">{{ review.employee.department }}</p>
                                </TableCell>
                                <TableCell>{{ review.cycle.name }}</TableCell>
                                <TableCell>{{ review.reviewer.name }}</TableCell>
                                <TableCell>
                                    <Badge :variant="statusVariant[review.status] ?? 'secondary'" class="capitalize">{{ review.status }}</Badge>
                                </TableCell>
                                <TableCell>{{ review.overall_score ? `${review.overall_score}%` : '—' }}</TableCell>
                                <TableCell class="text-right">
                                    <Button size="sm" variant="ghost" as-child>
                                        <Link :href="`/hr/performance/reviews/${review.id}`"><Eye class="size-4" /></Link>
                                    </Button>
                                </TableCell>
                            </TableRow>
                            <TableRow v-if="reviews.data.length === 0">
                                <TableCell colspan="6" class="py-8 text-center text-muted-foreground">No reviews found.</TableCell>
                            </TableRow>
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>

            <div v-if="reviews.last_page > 1" class="flex items-center justify-center gap-1">
                <template v-for="link in reviews.links" :key="link.label">
                    <Button v-if="link.url" size="sm" :variant="link.active ? 'default' : 'outline'" as-child>
                        <Link :href="link.url" preserve-state v-html="link.label" />
                    </Button>
                    <Button v-else size="sm" variant="outline" disabled v-html="link.label" />
                </template>
            </div>
        </div>
    </AppLayout>
</template>
