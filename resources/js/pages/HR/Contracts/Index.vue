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
import { Search, Plus, Eye, FileText } from 'lucide-vue-next';
import { ref, watch } from 'vue';
import { debounce } from '@/lib/debounce';

interface Contract {
    id: number;
    employee: { id: number; name: string; department: string | null };
    contract_type: string;
    start_date: string;
    end_date: string | null;
    salary_amount: string;
    status: string;
    created_at: string;
}

interface PaginatedData {
    data: Contract[];
    current_page: number;
    last_page: number;
    total: number;
    links: Array<{ url: string | null; label: string; active: boolean }>;
}

const props = defineProps<{
    contracts: PaginatedData;
    filters: { search?: string; status?: string; type?: string };
}>();

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'HRIS', href: '/hr' },
    { title: 'Contracts' },
];

const search = ref(props.filters.search ?? '');
const status = ref(props.filters.status ?? '');
const type = ref(props.filters.type ?? '');

const applyFilters = debounce(() => {
    router.get('/hr/contracts', {
        search: search.value || undefined,
        status: status.value || undefined,
        type: type.value || undefined,
    }, { preserveState: true, replace: true });
}, 300);

watch([search], () => applyFilters());

function onChange(key: string, val: unknown) {
    const v = String(val ?? '');
    if (key === 'status') { status.value = v === 'all' ? '' : v; }
    if (key === 'type') { type.value = v === 'all' ? '' : v; }
    applyFilters();
}

const statusVariant: Record<string, 'default' | 'secondary' | 'destructive' | 'outline'> = {
    active: 'default',
    expired: 'secondary',
    terminated: 'destructive',
    renewed: 'outline',
};

function formatCurrency(amount: string): string {
    return new Intl.NumberFormat('en-NG', { style: 'currency', currency: 'NGN', maximumFractionDigits: 0 }).format(Number(amount));
}
</script>

<template>
    <Head title="Contracts" />
    <AppLayout :breadcrumbs="breadcrumbs">
        <div class="flex h-full flex-1 flex-col gap-4 p-4 md:p-6">
            <div class="flex items-center justify-between">
                <div>
                    <h2 class="text-2xl font-bold tracking-tight">Contracts</h2>
                    <p class="text-muted-foreground">{{ contracts.total }} contracts</p>
                </div>
                <Button as-child>
                    <Link href="/hr/contracts/create"><Plus class="mr-2 size-4" />New Contract</Link>
                </Button>
            </div>

            <div class="flex flex-wrap gap-3">
                <div class="relative min-w-[200px] flex-1 max-w-sm">
                    <Search class="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                    <Input v-model="search" placeholder="Search employee..." class="pl-9" />
                </div>
                <Select :model-value="status || 'all'" @update:model-value="onChange('status', $event)">
                    <SelectTrigger class="w-[140px]"><SelectValue placeholder="Status" /></SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">All Status</SelectItem>
                        <SelectItem value="active">Active</SelectItem>
                        <SelectItem value="expired">Expired</SelectItem>
                        <SelectItem value="terminated">Terminated</SelectItem>
                        <SelectItem value="renewed">Renewed</SelectItem>
                    </SelectContent>
                </Select>
                <Select :model-value="type || 'all'" @update:model-value="onChange('type', $event)">
                    <SelectTrigger class="w-[150px]"><SelectValue placeholder="Contract Type" /></SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">All Types</SelectItem>
                        <SelectItem value="permanent">Permanent</SelectItem>
                        <SelectItem value="contract">Contract</SelectItem>
                        <SelectItem value="temporary">Temporary</SelectItem>
                        <SelectItem value="casual">Casual</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            <Card>
                <CardContent class="p-0">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Employee</TableHead>
                                <TableHead>Type</TableHead>
                                <TableHead>Start Date</TableHead>
                                <TableHead>End Date</TableHead>
                                <TableHead>Salary</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead class="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            <TableRow v-for="contract in contracts.data" :key="contract.id">
                                <TableCell>
                                    <p class="font-medium">{{ contract.employee.name }}</p>
                                    <p v-if="contract.employee.department" class="text-xs text-muted-foreground">{{ contract.employee.department }}</p>
                                </TableCell>
                                <TableCell class="capitalize">{{ contract.contract_type }}</TableCell>
                                <TableCell>{{ contract.start_date }}</TableCell>
                                <TableCell>{{ contract.end_date ?? 'Open-ended' }}</TableCell>
                                <TableCell>{{ formatCurrency(contract.salary_amount) }}</TableCell>
                                <TableCell>
                                    <Badge :variant="statusVariant[contract.status] ?? 'secondary'" class="capitalize">
                                        {{ contract.status }}
                                    </Badge>
                                </TableCell>
                                <TableCell class="text-right">
                                    <Button size="sm" variant="ghost" as-child>
                                        <Link :href="`/hr/contracts/${contract.id}`"><Eye class="size-4" /></Link>
                                    </Button>
                                </TableCell>
                            </TableRow>
                            <TableRow v-if="contracts.data.length === 0">
                                <TableCell colspan="7" class="py-8 text-center text-muted-foreground">
                                    <FileText class="size-8 mx-auto mb-2 opacity-50" />
                                    No contracts found.
                                </TableCell>
                            </TableRow>
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>

            <div v-if="contracts.last_page > 1" class="flex items-center justify-center gap-1">
                <template v-for="link in contracts.links" :key="link.label">
                    <Button v-if="link.url" size="sm" :variant="link.active ? 'default' : 'outline'" as-child>
                        <Link :href="link.url" preserve-state v-html="link.label" />
                    </Button>
                    <Button v-else size="sm" variant="outline" disabled v-html="link.label" />
                </template>
            </div>
        </div>
    </AppLayout>
</template>
