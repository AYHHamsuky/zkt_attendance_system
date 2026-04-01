<script setup lang="ts">
import { Head, Link, router, useForm } from '@inertiajs/vue3';
import AppLayout from '@/layouts/AppLayout.vue';
import { type BreadcrumbItem } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { CheckCircle2, Circle, XCircle } from 'lucide-vue-next';
import { ref } from 'vue';

interface LeaveApplication {
    id: number;
    start_date: string;
    end_date: string;
    days_requested: number;
    reason: string | null;
    status: string;
    rejection_reason: string | null;
    lm_rejection_reason: string | null;
    approved_at: string | null;
    lm_approved_at: string | null;
    line_manager_email: string | null;
    employee: { id: number; name: string; department: string | null };
    leaveType: { name: string; is_paid: boolean };
    approvedBy: { name: string } | null;
    lmApprovedBy: { name: string } | null;
    reliever: { name: string } | null;
}

const props = defineProps<{ application: LeaveApplication; hasDocument: boolean }>();

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'HRIS', href: '/hr' },
    { title: 'Leave', href: '/hr/leave' },
    { title: props.application.employee?.name ?? '—' },
];

// Stage 1: LM
function lmApprove() {
    router.post(`/hr/leave/${props.application.id}/lm-approve`, {});
}

const lmRejectDialogOpen = ref(false);
const lmRejectForm = useForm({ rejection_reason: '' });

function submitLmReject() {
    lmRejectForm.post(`/hr/leave/${props.application.id}/lm-reject`, {
        onSuccess: () => { lmRejectDialogOpen.value = false; lmRejectForm.reset(); },
    });
}

// Stage 2: HR
function hrApprove() {
    router.post(`/hr/leave/${props.application.id}/approve`, {});
}

const hrRejectDialogOpen = ref(false);
const hrRejectForm = useForm({ rejection_reason: '' });

function submitHrReject() {
    hrRejectForm.post(`/hr/leave/${props.application.id}/reject`, {
        onSuccess: () => { hrRejectDialogOpen.value = false; hrRejectForm.reset(); },
    });
}

const statusLabel: Record<string, string> = {
    pending: 'Pending LM Approval',
    lm_approved: 'Pending HR Approval',
    lm_rejected: 'Rejected by Line Manager',
    approved: 'Approved',
    rejected: 'Rejected by HR',
    cancelled: 'Cancelled',
};

const statusVariant: Record<string, 'default' | 'secondary' | 'destructive' | 'outline'> = {
    pending: 'secondary',
    lm_approved: 'outline',
    lm_rejected: 'destructive',
    approved: 'default',
    rejected: 'destructive',
    cancelled: 'outline',
};

// Approval timeline helpers
function lmStageStatus(): 'done' | 'rejected' | 'active' | 'waiting' {
    if (['lm_rejected'].includes(props.application.status)) { return 'rejected'; }
    if (['lm_approved', 'approved', 'rejected'].includes(props.application.status)) { return 'done'; }
    if (props.application.status === 'pending') { return 'active'; }
    return 'waiting';
}

function hrStageStatus(): 'done' | 'rejected' | 'active' | 'waiting' {
    if (props.application.status === 'rejected') { return 'rejected'; }
    if (props.application.status === 'approved') { return 'done'; }
    if (props.application.status === 'lm_approved') { return 'active'; }
    return 'waiting';
}
</script>

<template>
    <Head :title="`Leave — ${application.employee?.name ?? ''}`" />
    <AppLayout :breadcrumbs="breadcrumbs">
        <div class="flex h-full flex-1 flex-col gap-4 p-4 md:p-6">
            <!-- Header -->
            <div class="flex items-center justify-between">
                <div>
                    <h2 class="text-2xl font-bold">{{ application.employee?.name ?? '—' }}</h2>
                    <p class="text-muted-foreground">{{ application.leaveType?.name }} · {{ application.days_requested }} day(s)</p>
                </div>
                <div class="flex items-center gap-2">
                    <!-- Stage 1: LM actions -->
                    <template v-if="application.status === 'pending'">
                        <Button @click="lmApprove">LM Approve</Button>
                        <Button variant="destructive" @click="lmRejectDialogOpen = true">LM Reject</Button>
                    </template>
                    <!-- Stage 2: HR actions -->
                    <template v-if="application.status === 'lm_approved'">
                        <Button @click="hrApprove">HR Approve</Button>
                        <Button variant="destructive" @click="hrRejectDialogOpen = true">HR Reject</Button>
                    </template>
                    <Badge :variant="statusVariant[application.status] ?? 'secondary'" class="text-sm px-3 py-1">
                        {{ statusLabel[application.status] ?? application.status }}
                    </Badge>
                </div>
            </div>

            <div class="grid gap-4 lg:grid-cols-3">
                <!-- Application Details -->
                <Card class="lg:col-span-2">
                    <CardHeader><CardTitle>Application Details</CardTitle></CardHeader>
                    <CardContent class="space-y-3 text-sm">
                        <div class="flex justify-between">
                            <span class="text-muted-foreground">Employee</span>
                            <span class="font-medium">{{ application.employee?.name ?? '—' }}</span>
                        </div>
                        <div class="flex justify-between">
                            <span class="text-muted-foreground">Department</span>
                            <span>{{ application.employee?.department ?? '—' }}</span>
                        </div>
                        <div class="flex justify-between">
                            <span class="text-muted-foreground">Leave Type</span>
                            <span>{{ application.leaveType?.name }}</span>
                        </div>
                        <div class="flex justify-between">
                            <span class="text-muted-foreground">Duration</span>
                            <span>{{ application.start_date }} → {{ application.end_date }}</span>
                        </div>
                        <div class="flex justify-between">
                            <span class="text-muted-foreground">Days Requested</span>
                            <span class="font-medium">{{ application.days_requested }}</span>
                        </div>
                        <div v-if="application.reliever" class="flex justify-between">
                            <span class="text-muted-foreground">Reliever</span>
                            <span>{{ application.reliever.name }}</span>
                        </div>
                        <div v-if="hasDocument" class="flex justify-between">
                            <span class="text-muted-foreground">Supporting Document</span>
                            <a :href="`/hr/leave/${application.id}/document`" target="_blank"
                               class="text-sm text-blue-600 hover:underline font-medium">
                                View / Download
                            </a>
                        </div>
                        <div v-if="application.line_manager_email" class="flex justify-between">
                            <span class="text-muted-foreground">Line Manager Email</span>
                            <span class="text-xs">{{ application.line_manager_email }}</span>
                        </div>
                        <div v-if="application.reason" class="pt-2">
                            <p class="text-muted-foreground mb-1">Reason</p>
                            <p>{{ application.reason }}</p>
                        </div>
                        <!-- LM rejection reason -->
                        <div v-if="application.lm_rejection_reason" class="rounded-md bg-destructive/10 p-3">
                            <p class="text-sm font-medium text-destructive">LM Rejection Reason</p>
                            <p class="text-sm text-destructive">{{ application.lm_rejection_reason }}</p>
                        </div>
                        <!-- HR rejection reason -->
                        <div v-if="application.rejection_reason" class="rounded-md bg-destructive/10 p-3">
                            <p class="text-sm font-medium text-destructive">HR Rejection Reason</p>
                            <p class="text-sm text-destructive">{{ application.rejection_reason }}</p>
                        </div>
                    </CardContent>
                </Card>

                <!-- Approval Timeline -->
                <Card>
                    <CardHeader><CardTitle>Approval Progress</CardTitle></CardHeader>
                    <CardContent>
                        <ol class="relative border-l border-muted-foreground/20 space-y-6 ml-2">
                            <!-- Stage 1: Line Manager -->
                            <li class="ml-4">
                                <span class="absolute -left-3 flex size-6 items-center justify-center rounded-full">
                                    <CheckCircle2 v-if="lmStageStatus() === 'done'" class="size-6 text-green-600" />
                                    <XCircle v-else-if="lmStageStatus() === 'rejected'" class="size-6 text-destructive" />
                                    <span v-else-if="lmStageStatus() === 'active'" class="size-4 rounded-full bg-primary animate-pulse inline-block" />
                                    <Circle v-else class="size-6 text-muted-foreground/40" />
                                </span>
                                <p class="font-medium text-sm">Line Manager Review</p>
                                <p v-if="lmStageStatus() === 'done'" class="text-xs text-muted-foreground mt-0.5">
                                    Approved{{ application.lmApprovedBy ? ' by ' + application.lmApprovedBy.name : '' }}
                                    <span v-if="application.lm_approved_at"> · {{ application.lm_approved_at }}</span>
                                </p>
                                <p v-else-if="lmStageStatus() === 'rejected'" class="text-xs text-destructive mt-0.5">
                                    Rejected{{ application.lmApprovedBy ? ' by ' + application.lmApprovedBy.name : '' }}
                                </p>
                                <p v-else-if="lmStageStatus() === 'active'" class="text-xs text-muted-foreground mt-0.5">Awaiting review</p>
                                <p v-else class="text-xs text-muted-foreground mt-0.5">Not yet reached</p>
                            </li>
                            <!-- Stage 2: HR -->
                            <li class="ml-4">
                                <span class="absolute -left-3 flex size-6 items-center justify-center rounded-full">
                                    <CheckCircle2 v-if="hrStageStatus() === 'done'" class="size-6 text-green-600" />
                                    <XCircle v-else-if="hrStageStatus() === 'rejected'" class="size-6 text-destructive" />
                                    <span v-else-if="hrStageStatus() === 'active'" class="size-4 rounded-full bg-primary animate-pulse inline-block" />
                                    <Circle v-else class="size-6 text-muted-foreground/40" />
                                </span>
                                <p class="font-medium text-sm">HR Final Approval</p>
                                <p v-if="hrStageStatus() === 'done'" class="text-xs text-muted-foreground mt-0.5">
                                    Approved{{ application.approvedBy ? ' by ' + application.approvedBy.name : '' }}
                                    <span v-if="application.approved_at"> · {{ application.approved_at }}</span>
                                </p>
                                <p v-else-if="hrStageStatus() === 'rejected'" class="text-xs text-destructive mt-0.5">
                                    Rejected{{ application.approvedBy ? ' by ' + application.approvedBy.name : '' }}
                                </p>
                                <p v-else-if="hrStageStatus() === 'active'" class="text-xs text-muted-foreground mt-0.5">Awaiting HR review</p>
                                <p v-else class="text-xs text-muted-foreground mt-0.5">Pending LM approval first</p>
                            </li>
                        </ol>
                    </CardContent>
                </Card>
            </div>
        </div>

        <!-- LM Reject Dialog -->
        <Dialog v-model:open="lmRejectDialogOpen">
            <DialogContent>
                <DialogHeader><DialogTitle>Line Manager Rejection</DialogTitle></DialogHeader>
                <div class="space-y-2">
                    <Label>Reason</Label>
                    <Textarea v-model="lmRejectForm.rejection_reason" placeholder="Rejection reason..." />
                    <p v-if="lmRejectForm.errors.rejection_reason" class="text-sm text-destructive">{{ lmRejectForm.errors.rejection_reason }}</p>
                </div>
                <DialogFooter>
                    <Button variant="outline" @click="lmRejectDialogOpen = false">Cancel</Button>
                    <Button variant="destructive" :disabled="lmRejectForm.processing" @click="submitLmReject">Reject</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>

        <!-- HR Reject Dialog -->
        <Dialog v-model:open="hrRejectDialogOpen">
            <DialogContent>
                <DialogHeader><DialogTitle>HR Rejection</DialogTitle></DialogHeader>
                <div class="space-y-2">
                    <Label>Reason</Label>
                    <Textarea v-model="hrRejectForm.rejection_reason" placeholder="Rejection reason..." />
                    <p v-if="hrRejectForm.errors.rejection_reason" class="text-sm text-destructive">{{ hrRejectForm.errors.rejection_reason }}</p>
                </div>
                <DialogFooter>
                    <Button variant="outline" @click="hrRejectDialogOpen = false">Cancel</Button>
                    <Button variant="destructive" :disabled="hrRejectForm.processing" @click="submitHrReject">Reject</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    </AppLayout>
</template>
