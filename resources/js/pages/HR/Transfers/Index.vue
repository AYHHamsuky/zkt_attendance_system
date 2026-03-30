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
import { Search, Plus, Eye, CheckCircle, XCircle, ArrowLeftRight } from 'lucide-vue-next';
import { ref, watch } from 'vue';
import { debounce } from '@/lib/debounce';

interface Transfer {
    id: number;
    employee: { id: number; name: string };
    from_department: string;
    to_department: string;
    to_location: string | null;
    effective_date: string;
    status: string;
    initiated_by: { name: string };
}

interface PaginatedData {
    data: Transfer[];
    current_page: number;
    last_page: number;
    total: number;
    links: Array<{ url: string | null; label: string; active: boolean }>;
}

const props = defineProps<{
    transfers: PaginatedData;
    filters: { search?: string; status?: string };
}>();

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'HR Management', href: '/hr' },
    { title: 'Transfers' },
];

const search = ref(props.filters.search ?? '');
const status = ref(props.filters.status ?? '');

const applyFilters = debounce(() => {
    router.get('/hr/transfers', {
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

function approve(id: number) {
    router.post(`/hr/transfers/${id}/approve`, {});
}

function reject(id: number) {
    router.post(`/hr/transfers/${id}/reject`, {});
}

function complete(id: number) {
    router.post(`/hr/transfers/${id}/complete`, {});
}

const statusVariant: Record<string, 'default' | 'secondary' | 'destructive' | 'outline'> = {
    pending: 'secondary',
    approved: 'default',
    rejected: 'destructive',
    completed: 'outline',
};
</script>

<template>
    <Head title="Transfers" />
    <AppLayout :breadcrumbs="breadcrumbs">
        <div class="flex h-full flex-1 flex-col gap-4 p-4 md:p-6">
            <div class="flex items-center justify-between">
                <div>
                    <h2 class="text-2xl font-bold tracking-tight">Employee Transfers</h2>
                    <p class="text-muted-foreground">{{ transfers.total }} transfer requests</p>
                </div>
                <Button as-child>
                    <Link href="/hr/transfers/create"><Plus class="mr-2 size-4" />New Transfer</Link>
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
                        <SelectItem value="approved">Approved</SelectItem>
                        <SelectItem value="rejected">Rejected</SelectItem>
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
                                <TableHead>From</TableHead>
                                <TableHead>To</TableHead>
                                <TableHead>Effective Date</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead class="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            <TableRow v-for="transfer in transfers.data" :key="transfer.id">
                                <TableCell class="font-medium">{{ transfer.employee.name }}</TableCell>
                                <TableCell>{{ transfer.from_department }}</TableCell>
                                <TableCell>
                                    <p>{{ transfer.to_department }}</p>
                                    <p v-if="transfer.to_location" class="text-xs text-muted-foreground">{{ transfer.to_location }}</p>
                                </TableCell>
                                <TableCell>{{ transfer.effective_date }}</TableCell>
                                <TableCell>
                                    <Badge :variant="statusVariant[transfer.status] ?? 'secondary'" class="capitalize">
                                        {{ transfer.status }}
                                    </Badge>
                                </TableCell>
                                <TableCell class="text-right">
                                    <div class="flex justify-end gap-1">
                                        <Button v-if="transfer.status === 'pending'" size="sm" variant="ghost" class="text-green-600" @click="approve(transfer.id)">
                                            <CheckCircle class="size-4" />
                                        </Button>
                                        <Button v-if="transfer.status === 'pending'" size="sm" variant="ghost" class="text-destructive" @click="reject(transfer.id)">
                                            <XCircle class="size-4" />
                                        </Button>
                                        <Button v-if="transfer.status === 'approved'" size="sm" variant="outline" @click="complete(transfer.id)">
                                            Complete
                                        </Button>
                                        <Button size="sm" variant="ghost" as-child>
                                            <Link :href="`/hr/transfers/${transfer.id}`"><Eye class="size-4" /></Link>
                                        </Button>
                                    </div>
                                </TableCell>
                            </TableRow>
                            <TableRow v-if="transfers.data.length === 0">
                                <TableCell colspan="6" class="py-8 text-center text-muted-foreground">
                                    <ArrowLeftRight class="size-8 mx-auto mb-2 opacity-50" />
                                    No transfer requests found.
                                </TableCell>
                            </TableRow>
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>

            <div v-if="transfers.last_page > 1" class="flex items-center justify-center gap-1">
                <template v-for="link in transfers.links" :key="link.label">
                    <Button v-if="link.url" size="sm" :variant="link.active ? 'default' : 'outline'" as-child>
                        <Link :href="link.url" preserve-state v-html="link.label" />
                    </Button>
                    <Button v-else size="sm" variant="outline" disabled v-html="link.label" />
                </template>
            </div>
        </div>
    </AppLayout>
</template>
