<script setup lang="ts">
import { Head, router } from '@inertiajs/vue3';
import AppLayout from '@/layouts/AppLayout.vue';
import { type BreadcrumbItem } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

interface Transfer {
    id: number;
    from_department: string;
    from_unit: string | null;
    from_location: string | null;
    from_position: string | null;
    to_department: string;
    to_unit: string | null;
    to_location: string | null;
    to_position: string | null;
    reason: string;
    effective_date: string;
    status: string;
    approved_at: string | null;
    employee: { id: number; name: string; department: string | null; position: string | null };
    approvedBy: { name: string } | null;
    initiatedBy: { name: string };
}

const props = defineProps<{ transfer: Transfer }>();

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'HR Management', href: '/hr' },
    { title: 'Transfers', href: '/hr/transfers' },
    { title: props.transfer.employee.name },
];

function approve() { router.post(`/hr/transfers/${props.transfer.id}/approve`, {}); }
function reject() { router.post(`/hr/transfers/${props.transfer.id}/reject`, {}); }
function complete() { router.post(`/hr/transfers/${props.transfer.id}/complete`, {}); }

const statusVariant: Record<string, 'default' | 'secondary' | 'destructive' | 'outline'> = {
    pending: 'secondary', approved: 'default', rejected: 'destructive', completed: 'outline',
};
</script>

<template>
    <Head :title="`Transfer — ${transfer.employee.name}`" />
    <AppLayout :breadcrumbs="breadcrumbs">
        <div class="flex h-full flex-1 flex-col gap-4 p-4 md:p-6">
            <div class="flex items-center justify-between">
                <div>
                    <h2 class="text-2xl font-bold">{{ transfer.employee.name }}</h2>
                    <p class="text-muted-foreground">Transfer — Effective {{ transfer.effective_date }}</p>
                </div>
                <div class="flex gap-2">
                    <Button v-if="transfer.status === 'pending'" @click="approve">Approve</Button>
                    <Button v-if="transfer.status === 'pending'" variant="destructive" @click="reject">Reject</Button>
                    <Button v-if="transfer.status === 'approved'" variant="outline" @click="complete">Mark Completed</Button>
                    <Badge :variant="statusVariant[transfer.status] ?? 'secondary'" class="capitalize text-sm px-3 py-1">{{ transfer.status }}</Badge>
                </div>
            </div>

            <div class="grid gap-4 md:grid-cols-2">
                <Card>
                    <CardHeader><CardTitle>From</CardTitle></CardHeader>
                    <CardContent class="space-y-2 text-sm">
                        <div class="flex justify-between"><span class="text-muted-foreground">Department</span><span>{{ transfer.from_department }}</span></div>
                        <div class="flex justify-between"><span class="text-muted-foreground">Unit</span><span>{{ transfer.from_unit ?? '—' }}</span></div>
                        <div class="flex justify-between"><span class="text-muted-foreground">Location</span><span>{{ transfer.from_location ?? '—' }}</span></div>
                        <div class="flex justify-between"><span class="text-muted-foreground">Position</span><span>{{ transfer.from_position ?? '—' }}</span></div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader><CardTitle>To</CardTitle></CardHeader>
                    <CardContent class="space-y-2 text-sm">
                        <div class="flex justify-between"><span class="text-muted-foreground">Department</span><span class="font-medium">{{ transfer.to_department }}</span></div>
                        <div class="flex justify-between"><span class="text-muted-foreground">Unit</span><span>{{ transfer.to_unit ?? '—' }}</span></div>
                        <div class="flex justify-between"><span class="text-muted-foreground">Location</span><span>{{ transfer.to_location ?? '—' }}</span></div>
                        <div class="flex justify-between"><span class="text-muted-foreground">Position</span><span>{{ transfer.to_position ?? '—' }}</span></div>
                    </CardContent>
                </Card>
                <Card class="md:col-span-2">
                    <CardHeader><CardTitle>Details</CardTitle></CardHeader>
                    <CardContent class="space-y-3 text-sm">
                        <div class="flex justify-between"><span class="text-muted-foreground">Initiated by</span><span>{{ transfer.initiatedBy.name }}</span></div>
                        <div v-if="transfer.approvedBy" class="flex justify-between"><span class="text-muted-foreground">Approved by</span><span>{{ transfer.approvedBy.name }}</span></div>
                        <div class="pt-2"><p class="text-muted-foreground mb-1">Reason</p><p>{{ transfer.reason }}</p></div>
                    </CardContent>
                </Card>
            </div>
        </div>
    </AppLayout>
</template>
