<script setup lang="ts">
import { Head, Link } from '@inertiajs/vue3';
import AppLayout from '@/layouts/AppLayout.vue';
import { type BreadcrumbItem } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

interface Contract {
    id: number;
    contract_type: string;
    start_date: string;
    end_date: string | null;
    probation_end_date: string | null;
    salary_amount: string;
    terms: string | null;
    status: string;
    created_at: string;
    employee: { id: number; name: string; department: string | null; position: string | null };
    created_by: { name: string };
    renewed_from: { id: number } | null;
    renewals: Array<{ id: number; contract_type: string; status: string; start_date: string }>;
}

const props = defineProps<{ contract: Contract }>();

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'HR Management', href: '/hr' },
    { title: 'Contracts', href: '/hr/contracts' },
    { title: props.contract.employee.name },
];

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
    <Head :title="`Contract — ${contract.employee.name}`" />
    <AppLayout :breadcrumbs="breadcrumbs">
        <div class="flex h-full flex-1 flex-col gap-4 p-4 md:p-6">
            <div class="flex items-center justify-between">
                <div>
                    <h2 class="text-2xl font-bold">{{ contract.employee.name }}</h2>
                    <p class="text-muted-foreground capitalize">{{ contract.contract_type }} Contract</p>
                </div>
                <div class="flex gap-2">
                    <Button variant="outline" as-child>
                        <Link :href="`/hr/contracts/${contract.id}/edit`">Edit</Link>
                    </Button>
                    <Badge :variant="statusVariant[contract.status] ?? 'secondary'" class="capitalize text-sm px-3 py-1">
                        {{ contract.status }}
                    </Badge>
                </div>
            </div>

            <div class="grid gap-4 md:grid-cols-2">
                <Card>
                    <CardHeader><CardTitle>Contract Details</CardTitle></CardHeader>
                    <CardContent class="space-y-3 text-sm">
                        <div class="flex justify-between"><span class="text-muted-foreground">Employee</span><span class="font-medium">{{ contract.employee.name }}</span></div>
                        <div class="flex justify-between"><span class="text-muted-foreground">Department</span><span>{{ contract.employee.department ?? '—' }}</span></div>
                        <div class="flex justify-between"><span class="text-muted-foreground">Position</span><span>{{ contract.employee.position ?? '—' }}</span></div>
                        <div class="flex justify-between"><span class="text-muted-foreground">Type</span><span class="capitalize">{{ contract.contract_type }}</span></div>
                        <div class="flex justify-between"><span class="text-muted-foreground">Salary</span><span class="font-medium">{{ formatCurrency(contract.salary_amount) }}/mo</span></div>
                        <div class="flex justify-between"><span class="text-muted-foreground">Start Date</span><span>{{ contract.start_date }}</span></div>
                        <div class="flex justify-between"><span class="text-muted-foreground">End Date</span><span>{{ contract.end_date ?? 'Open-ended' }}</span></div>
                        <div v-if="contract.probation_end_date" class="flex justify-between"><span class="text-muted-foreground">Probation End</span><span>{{ contract.probation_end_date }}</span></div>
                        <div class="flex justify-between"><span class="text-muted-foreground">Created by</span><span>{{ contract.created_by.name }}</span></div>
                    </CardContent>
                </Card>

                <Card v-if="contract.terms">
                    <CardHeader><CardTitle>Contract Terms</CardTitle></CardHeader>
                    <CardContent>
                        <p class="text-sm whitespace-pre-wrap">{{ contract.terms }}</p>
                    </CardContent>
                </Card>

                <Card v-if="contract.renewals.length > 0">
                    <CardHeader><CardTitle>Renewal History</CardTitle></CardHeader>
                    <CardContent class="space-y-2">
                        <div v-for="renewal in contract.renewals" :key="renewal.id" class="flex items-center justify-between rounded border p-2 text-sm">
                            <span class="capitalize">{{ renewal.contract_type }} — {{ renewal.start_date }}</span>
                            <Badge :variant="statusVariant[renewal.status] ?? 'secondary'" class="capitalize">{{ renewal.status }}</Badge>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    </AppLayout>
</template>
