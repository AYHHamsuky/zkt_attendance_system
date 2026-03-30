<script setup lang="ts">
import { Head, Link, router, useForm } from '@inertiajs/vue3';
import AppLayout from '@/layouts/AppLayout.vue';
import { type BreadcrumbItem } from '@/types';
import { Card, CardContent } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
    Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Search, Plus, Eye, Calendar, CheckCircle, XCircle, Trash2 } from 'lucide-vue-next';
import { ref, watch } from 'vue';
import { debounce } from '@/lib/debounce';

interface LeaveApplication {
    id: number;
    employee: { id: number; name: string };
    leaveType: { id: number; name: string };
    start_date: string;
    end_date: string;
    days_requested: number;
    status: string;
    reason: string | null;
    approved_by: { name: string } | null;
    lmApprovedBy: { name: string } | null;
}

interface LeaveType {
    id: number;
    name: string;
}

interface PaginatedData {
    data: LeaveApplication[];
    current_page: number;
    last_page: number;
    total: number;
    links: Array<{ url: string | null; label: string; active: boolean }>;
}

const props = defineProps<{
    applications: PaginatedData;
    leaveTypes: LeaveType[];
    filters: { search?: string; status?: string; leave_type_id?: string };
    canManage: boolean;
    isAdmin: boolean;
}>();

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'HR Management', href: '/hr' },
    { title: 'Leave Applications' },
];

const search = ref(props.filters.search ?? '');
const status = ref(props.filters.status ?? '');
const leaveTypeId = ref(props.filters.leave_type_id ?? '');

const applyFilters = debounce(() => {
    router.get('/hr/leave', {
        search: search.value || undefined,
        status: status.value || undefined,
        leave_type_id: leaveTypeId.value || undefined,
    }, { preserveState: true, replace: true });
}, 300);

watch([search], () => applyFilters());

function onChange(key: string, val: unknown) {
    const v = String(val ?? '');
    if (key === 'status') { status.value = v === 'all' ? '' : v; }
    if (key === 'leave_type_id') { leaveTypeId.value = v === 'all' ? '' : v; }
    applyFilters();
}

// Stage 1 — Line Manager actions
function lmApprove(id: number) {
    router.post(`/hr/leave/${id}/lm-approve`, {});
}

// Stage 2 — HR final approval
function hrApprove(id: number) {
    router.post(`/hr/leave/${id}/approve`, {});
}

// Shared reject dialog (used for both LM and HR stage)
const rejectDialogOpen = ref(false);
const selectedAppId = ref<number | null>(null);
const rejectStage = ref<'lm' | 'hr'>('lm');
const rejectForm = useForm({ rejection_reason: '' });

function openRejectDialog(id: number, stage: 'lm' | 'hr') {
    selectedAppId.value = id;
    rejectStage.value = stage;
    rejectDialogOpen.value = true;
}

function submitReject() {
    if (!selectedAppId.value) { return; }
    const url = rejectStage.value === 'lm'
        ? `/hr/leave/${selectedAppId.value}/lm-reject`
        : `/hr/leave/${selectedAppId.value}/reject`;
    rejectForm.post(url, {
        onSuccess: () => {
            rejectDialogOpen.value = false;
            rejectForm.reset();
        },
    });
}

// Delete confirmation
const deleteDialogOpen = ref(false);
const deleteAppId = ref<number | null>(null);

function openDeleteDialog(id: number) {
    deleteAppId.value = id;
    deleteDialogOpen.value = true;
}

function confirmDelete() {
    if (!deleteAppId.value) return;
    router.delete(`/hr/leave/${deleteAppId.value}`, {
        onSuccess: () => { deleteDialogOpen.value = false; },
    });
}

const statusLabel: Record<string, string> = {
    pending: 'Pending LM',
    lm_approved: 'Pending HR',
    lm_rejected: 'LM Rejected',
    approved: 'Approved',
    rejected: 'Rejected',
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
</script>

<template>
    <Head title="Leave Applications" />
    <AppLayout :breadcrumbs="breadcrumbs">
        <div class="flex h-full flex-1 flex-col gap-4 p-4 md:p-6">
            <div class="flex items-center justify-between">
                <div>
                    <h2 class="text-2xl font-bold tracking-tight">
                        {{ canManage ? 'Leave Applications' : 'My Leave Applications' }}
                    </h2>
                    <p class="text-muted-foreground">{{ applications.total }} application{{ applications.total !== 1 ? 's' : '' }}</p>
                </div>
                <div class="flex gap-2">
                    <Button v-if="canManage" variant="outline" as-child>
                        <Link href="/hr/leave-types">Manage Leave Types</Link>
                    </Button>
                    <Button as-child>
                        <Link href="/hr/leave/create"><Plus class="mr-2 size-4" />New Application</Link>
                    </Button>
                </div>
            </div>

            <!-- Filters — admin/hr only -->
            <div v-if="canManage" class="flex flex-wrap gap-3">
                <div class="relative min-w-[200px] flex-1 max-w-sm">
                    <Search class="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                    <Input v-model="search" placeholder="Search employee..." class="pl-9" />
                </div>
                <Select :model-value="status || 'all'" @update:model-value="onChange('status', $event)">
                    <SelectTrigger class="w-[150px]"><SelectValue placeholder="Status" /></SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">All Status</SelectItem>
                        <SelectItem value="pending">Pending LM</SelectItem>
                        <SelectItem value="lm_approved">Pending HR</SelectItem>
                        <SelectItem value="lm_rejected">LM Rejected</SelectItem>
                        <SelectItem value="approved">Approved</SelectItem>
                        <SelectItem value="rejected">Rejected</SelectItem>
                        <SelectItem value="cancelled">Cancelled</SelectItem>
                    </SelectContent>
                </Select>
                <Select :model-value="leaveTypeId || 'all'" @update:model-value="onChange('leave_type_id', $event)">
                    <SelectTrigger class="w-[160px]"><SelectValue placeholder="Leave Type" /></SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">All Types</SelectItem>
                        <SelectItem v-for="lt in leaveTypes" :key="lt.id" :value="String(lt.id)">{{ lt.name }}</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            <Card>
                <CardContent class="p-0">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Employee</TableHead>
                                <TableHead>Leave Type</TableHead>
                                <TableHead>Duration</TableHead>
                                <TableHead>Days</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead class="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            <TableRow v-for="app in applications.data" :key="app.id">
                                <TableCell class="font-medium">{{ app.employee.name }}</TableCell>
                                <TableCell>{{ app.leaveType?.name ?? '—' }}</TableCell>
                                <TableCell class="text-sm">{{ app.start_date }} → {{ app.end_date }}</TableCell>
                                <TableCell>{{ app.days_requested }}d</TableCell>
                                <TableCell>
                                    <Badge :variant="statusVariant[app.status] ?? 'secondary'" class="capitalize">
                                        {{ statusLabel[app.status] ?? app.status }}
                                    </Badge>
                                </TableCell>
                                <TableCell class="text-right">
                                    <div class="flex justify-end gap-1">
                                        <!-- Stage 1: LM actions — admin/hr only -->
                                        <Button
                                            v-if="canManage && app.status === 'pending'"
                                            size="sm" variant="ghost"
                                            class="text-green-600 hover:text-green-700"
                                            title="LM Approve"
                                            @click="lmApprove(app.id)"
                                        >
                                            <CheckCircle class="size-4" />
                                        </Button>
                                        <Button
                                            v-if="canManage && app.status === 'pending'"
                                            size="sm" variant="ghost"
                                            class="text-destructive hover:text-destructive"
                                            title="LM Reject"
                                            @click="openRejectDialog(app.id, 'lm')"
                                        >
                                            <XCircle class="size-4" />
                                        </Button>
                                        <!-- Stage 2: HR actions — admin/hr only -->
                                        <Button
                                            v-if="canManage && app.status === 'lm_approved'"
                                            size="sm" variant="ghost"
                                            class="text-green-600 hover:text-green-700"
                                            title="HR Final Approve"
                                            @click="hrApprove(app.id)"
                                        >
                                            <CheckCircle class="size-4" />
                                        </Button>
                                        <Button
                                            v-if="canManage && app.status === 'lm_approved'"
                                            size="sm" variant="ghost"
                                            class="text-destructive hover:text-destructive"
                                            title="HR Reject"
                                            @click="openRejectDialog(app.id, 'hr')"
                                        >
                                            <XCircle class="size-4" />
                                        </Button>
                                        <Button size="sm" variant="ghost" as-child>
                                            <Link :href="`/hr/leave/${app.id}`"><Eye class="size-4" /></Link>
                                        </Button>
                                        <Button
                                            v-if="isAdmin"
                                            size="sm" variant="ghost"
                                            class="text-destructive hover:text-destructive"
                                            title="Delete"
                                            @click="openDeleteDialog(app.id)"
                                        >
                                            <Trash2 class="size-4" />
                                        </Button>
                                    </div>
                                </TableCell>
                            </TableRow>
                            <TableRow v-if="applications.data.length === 0">
                                <TableCell colspan="6" class="py-8 text-center text-muted-foreground">
                                    <Calendar class="size-8 mx-auto mb-2 opacity-50" />
                                    No leave applications found.
                                </TableCell>
                            </TableRow>
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>

            <div v-if="applications.last_page > 1" class="flex items-center justify-center gap-1">
                <template v-for="link in applications.links" :key="link.label">
                    <Button v-if="link.url" size="sm" :variant="link.active ? 'default' : 'outline'" as-child>
                        <Link :href="link.url" preserve-state v-html="link.label" />
                    </Button>
                    <Button v-else size="sm" variant="outline" disabled v-html="link.label" />
                </template>
            </div>
        </div>

        <!-- Reject Dialog (shared for LM and HR stage) -->
        <Dialog v-model:open="rejectDialogOpen">
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>{{ rejectStage === 'lm' ? 'Line Manager Rejection' : 'HR Rejection' }}</DialogTitle>
                    <DialogDescription>Please provide a reason for rejecting this application.</DialogDescription>
                </DialogHeader>
                <div class="space-y-2">
                    <Label for="rejection_reason">Reason</Label>
                    <Textarea id="rejection_reason" v-model="rejectForm.rejection_reason" placeholder="Enter rejection reason..." />
                    <p v-if="rejectForm.errors.rejection_reason" class="text-sm text-destructive">{{ rejectForm.errors.rejection_reason }}</p>
                </div>
                <DialogFooter>
                    <Button variant="outline" @click="rejectDialogOpen = false">Cancel</Button>
                    <Button variant="destructive" :disabled="rejectForm.processing" @click="submitReject">Reject</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
        <!-- Delete Confirmation Dialog — admin only -->
        <Dialog v-model:open="deleteDialogOpen">
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Delete Leave Application</DialogTitle>
                    <DialogDescription>Are you sure you want to delete this leave application? This action cannot be undone.</DialogDescription>
                </DialogHeader>
                <DialogFooter>
                    <Button variant="outline" @click="deleteDialogOpen = false">Cancel</Button>
                    <Button variant="destructive" @click="confirmDelete">Delete</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    </AppLayout>
</template>
