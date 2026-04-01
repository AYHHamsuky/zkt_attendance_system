<script setup lang="ts">
import { Head, router } from '@inertiajs/vue3';
import AppLayout from '@/layouts/AppLayout.vue';
import { type BreadcrumbItem } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

interface Resignation {
    id: number;
    resignation_date: string;
    last_working_date: string;
    reason: string;
    exit_type: string;
    status: string;
    handover_completed: boolean;
    exit_interview_completed: boolean;
    clearance_completed: boolean;
    accepted_at: string | null;
    notes: string | null;
    employee: { id: number; name: string; department: string | null; position: string | null };
    acceptedBy: { name: string } | null;
}

const props = defineProps<{ resignation: Resignation }>();

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'HRIS', href: '/hr' },
    { title: 'Resignations', href: '/hr/resignations' },
    { title: props.resignation.employee.name },
];

function accept() { router.post(`/hr/resignations/${props.resignation.id}/accept`, {}); }
function updateChecklist(field: string, value: boolean) {
    router.post(`/hr/resignations/${props.resignation.id}/checklist`, { [field]: value }, { preserveScroll: true });
}

const statusVariant: Record<string, 'default' | 'secondary' | 'destructive' | 'outline'> = {
    pending: 'secondary', accepted: 'default', withdrawn: 'outline', completed: 'outline',
};
</script>

<template>
    <Head :title="`Resignation — ${resignation.employee.name}`" />
    <AppLayout :breadcrumbs="breadcrumbs">
        <div class="flex h-full flex-1 flex-col gap-4 p-4 md:p-6">
            <div class="flex items-center justify-between">
                <div>
                    <h2 class="text-2xl font-bold">{{ resignation.employee.name }}</h2>
                    <p class="text-muted-foreground capitalize">{{ resignation.exit_type.replace('_', ' ') }} · Last day: {{ resignation.last_working_date }}</p>
                </div>
                <div class="flex gap-2">
                    <Button v-if="resignation.status === 'pending'" @click="accept">Accept Resignation</Button>
                    <Badge :variant="statusVariant[resignation.status] ?? 'secondary'" class="capitalize text-sm px-3 py-1">{{ resignation.status }}</Badge>
                </div>
            </div>

            <div class="grid gap-4 md:grid-cols-2">
                <Card>
                    <CardHeader><CardTitle>Details</CardTitle></CardHeader>
                    <CardContent class="space-y-2 text-sm">
                        <div class="flex justify-between"><span class="text-muted-foreground">Employee</span><span class="font-medium">{{ resignation.employee.name }}</span></div>
                        <div class="flex justify-between"><span class="text-muted-foreground">Department</span><span>{{ resignation.employee.department ?? '—' }}</span></div>
                        <div class="flex justify-between"><span class="text-muted-foreground">Resignation Date</span><span>{{ resignation.resignation_date }}</span></div>
                        <div class="flex justify-between"><span class="text-muted-foreground">Last Working Date</span><span>{{ resignation.last_working_date }}</span></div>
                        <div class="flex justify-between"><span class="text-muted-foreground">Exit Type</span><span class="capitalize">{{ resignation.exit_type.replace('_', ' ') }}</span></div>
                        <div v-if="resignation.acceptedBy" class="flex justify-between"><span class="text-muted-foreground">Accepted by</span><span>{{ resignation.acceptedBy.name }}</span></div>
                        <div class="pt-2"><p class="text-muted-foreground mb-1">Reason</p><p>{{ resignation.reason }}</p></div>
                        <div v-if="resignation.notes" class="pt-2"><p class="text-muted-foreground mb-1">HR Notes</p><p class="text-muted-foreground italic">{{ resignation.notes }}</p></div>
                    </CardContent>
                </Card>

                <!-- Exit Checklist -->
                <Card>
                    <CardHeader><CardTitle>Exit Checklist</CardTitle></CardHeader>
                    <CardContent class="space-y-4">
                        <div class="flex items-center justify-between">
                            <div>
                                <p class="font-medium">Handover Completed</p>
                                <p class="text-xs text-muted-foreground">Work handover to successor</p>
                            </div>
                            <input
                                type="checkbox"
                                :checked="resignation.handover_completed"
                                :disabled="resignation.status === 'completed'"
                                class="size-5"
                                @change="updateChecklist('handover_completed', ($event.target as HTMLInputElement).checked)"
                            />
                        </div>
                        <div class="flex items-center justify-between">
                            <div>
                                <p class="font-medium">Exit Interview</p>
                                <p class="text-xs text-muted-foreground">Exit interview conducted</p>
                            </div>
                            <input
                                type="checkbox"
                                :checked="resignation.exit_interview_completed"
                                :disabled="resignation.status === 'completed'"
                                class="size-5"
                                @change="updateChecklist('exit_interview_completed', ($event.target as HTMLInputElement).checked)"
                            />
                        </div>
                        <div class="flex items-center justify-between">
                            <div>
                                <p class="font-medium">Clearance Completed</p>
                                <p class="text-xs text-muted-foreground">All company items returned</p>
                            </div>
                            <input
                                type="checkbox"
                                :checked="resignation.clearance_completed"
                                :disabled="resignation.status === 'completed'"
                                class="size-5"
                                @change="updateChecklist('clearance_completed', ($event.target as HTMLInputElement).checked)"
                            />
                        </div>
                        <div v-if="resignation.status === 'completed'" class="rounded-md bg-green-50 p-3 text-center">
                            <p class="text-sm font-medium text-green-700">All exit procedures completed. Employee deactivated.</p>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    </AppLayout>
</template>
