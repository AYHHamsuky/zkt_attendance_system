<script setup lang="ts">
import { Head, router, usePage } from '@inertiajs/vue3';
import AppLayout from '@/layouts/AppLayout.vue';
import { type BreadcrumbItem } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import { Users, Bell, BellRing, Send, Pencil, UserPlus, Eye, EyeOff, Trash2, CalendarDays } from 'lucide-vue-next';
import { ref, computed } from 'vue';

const userRole = computed(() => (usePage().props.auth as { user: { role: string } }).user?.role);
const isAdmin = computed(() => userRole.value === 'admin' || userRole.value === 'super_admin' || userRole.value === 'hr');
const isDeleteAllowed = computed(() => userRole.value === 'admin' || userRole.value === 'super_admin');

interface Review {
    id: number;
    status: string;
    overall_score: string | null;
    notify_sent_at: string | null;
    employee: { id: number; name: string; department: string | null; hr_profile: { line_manager_name: string | null; reports_to_employee_id: number | null } | null };
    reviewer: { id: number; name: string };
}

interface Cycle {
    id: number;
    name: string;
    year: number;
    period_type: string;
    start_date: string;
    end_date: string;
    status: string;
    current_phase: string;
    scores_visible: boolean;
    phase1_open_date: string | null;
    phase1_close_date: string | null;
    phase2_open_date: string | null;
    phase2_close_date: string | null;
    phase3_open_date: string | null;
    phase3_close_date: string | null;
    reviews: Review[];
}

interface Employee {
    id: number;
    name: string;
    department: string | null;
    position: string | null;
    line_manager_name: string | null;
}

const props = defineProps<{
    cycle: Cycle;
    employees: Employee[];
    departments: string[];
}>();

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'HRIS', href: '/hr' },
    { title: 'Performance', href: '/hr/performance/cycles' },
    { title: props.cycle.name },
];

// ── Individual appraisal dialog ────────────────────────────────────────────
const showCreateDialog = ref(false);
const employeeSearch = ref('');
const selectedEmployeeId = ref<number | null>(null);
const creating = ref(false);

// IDs of employees who already have a review in this cycle
const assignedEmployeeIds = computed(() =>
    new Set(props.cycle.reviews.map(r => r.employee.id))
);

// Employees not yet assigned, filtered by search
const availableEmployees = computed(() => {
    const q = employeeSearch.value.toLowerCase();
    return props.employees
        .filter(e => !assignedEmployeeIds.value.has(e.id))
        .filter(e => !q || e.name.toLowerCase().includes(q) || (e.department ?? '').toLowerCase().includes(q) || (e.position ?? '').toLowerCase().includes(q));
});

const selectedEmployee = computed(() =>
    props.employees.find(e => e.id === selectedEmployeeId.value) ?? null
);

function openCreateDialog() {
    employeeSearch.value = '';
    selectedEmployeeId.value = null;
    showCreateDialog.value = true;
}

function createIndividual() {
    if (!selectedEmployeeId.value) return;
    creating.value = true;
    router.post('/hr/performance/reviews', {
        employee_id: selectedEmployeeId.value,
        cycle_id: props.cycle.id,
    }, {
        preserveScroll: true,
        onSuccess: () => { showCreateDialog.value = false; selectedEmployeeId.value = null; },
        onFinish: () => { creating.value = false; },
    });
}

// ── Auto-assign all employees ───────────────────────────────────────────────
const assigning = ref(false);

function autoAssignAll() {
    const unassigned = props.employees.filter(e => !assignedEmployeeIds.value.has(e.id)).length;
    if (!confirm(
        `Create appraisals for all active employees?\n\n` +
        `• ${unassigned} employee(s) will receive a new appraisal.\n` +
        `• Each employee's line manager will be set as their reviewer.\n` +
        `• Employees who already have a review in this cycle will be skipped.`
    )) return;

    assigning.value = true;
    router.post('/hr/performance/reviews/bulk', {
        cycle_id: props.cycle.id,
    }, {
        preserveScroll: true,
        onFinish: () => { assigning.value = false; },
    });
}

// ── Notifications ──────────────────────────────────────────────────────────
const sendingNotification = ref<number | null>(null);

function sendIndividualNotification(reviewId: number) {
    sendingNotification.value = reviewId;
    router.post(`/hr/performance/reviews/${reviewId}/send-notification`, {}, {
        preserveScroll: true,
        onFinish: () => { sendingNotification.value = null; },
    });
}

function sendAllNotifications() {
    if (!confirm(`Send email notifications to all ${props.cycle.reviews.length} employees in this cycle?`)) return;
    router.post('/hr/performance/reviews/send-bulk-notification', {
        cycle_id: props.cycle.id,
    }, { preserveScroll: true });
}

// ── Score visibility toggle ─────────────────────────────────────────────────
function toggleScores() {
    router.post(`/hr/performance/cycles/${props.cycle.id}/toggle-scores`, {}, { preserveScroll: true });
}

// ── Extend dates dialog ────────────────────────────────────────────────────
const showExtendDialog = ref(false);
const extendForm = ref({
    start_date: props.cycle.start_date,
    end_date: props.cycle.end_date,
    phase1_open_date: props.cycle.phase1_open_date ?? '',
    phase1_close_date: props.cycle.phase1_close_date ?? '',
    phase2_open_date: props.cycle.phase2_open_date ?? '',
    phase2_close_date: props.cycle.phase2_close_date ?? '',
    phase3_open_date: props.cycle.phase3_open_date ?? '',
    phase3_close_date: props.cycle.phase3_close_date ?? '',
});
const extendSaving = ref(false);

function openExtendDialog() {
    extendForm.value = {
        start_date: props.cycle.start_date,
        end_date: props.cycle.end_date,
        phase1_open_date: props.cycle.phase1_open_date ?? '',
        phase1_close_date: props.cycle.phase1_close_date ?? '',
        phase2_open_date: props.cycle.phase2_open_date ?? '',
        phase2_close_date: props.cycle.phase2_close_date ?? '',
        phase3_open_date: props.cycle.phase3_open_date ?? '',
        phase3_close_date: props.cycle.phase3_close_date ?? '',
    };
    showExtendDialog.value = true;
}

function isDateElapsed(dateStr: string | null): boolean {
    if (!dateStr) return false;
    return dateStr < new Date().toISOString().slice(0, 10);
}

function saveExtendDates() {
    extendSaving.value = true;
    const payload: Record<string, string> = {};
    const f = extendForm.value;
    if (!isDateElapsed(props.cycle.start_date) && f.start_date) payload.start_date = f.start_date;
    if (!isDateElapsed(props.cycle.end_date) && f.end_date) payload.end_date = f.end_date;
    if (!isDateElapsed(props.cycle.phase1_open_date) && f.phase1_open_date) payload.phase1_open_date = f.phase1_open_date;
    if (!isDateElapsed(props.cycle.phase1_close_date) && f.phase1_close_date) payload.phase1_close_date = f.phase1_close_date;
    if (!isDateElapsed(props.cycle.phase2_open_date) && f.phase2_open_date) payload.phase2_open_date = f.phase2_open_date;
    if (!isDateElapsed(props.cycle.phase2_close_date) && f.phase2_close_date) payload.phase2_close_date = f.phase2_close_date;
    if (!isDateElapsed(props.cycle.phase3_open_date) && f.phase3_open_date) payload.phase3_open_date = f.phase3_open_date;
    if (!isDateElapsed(props.cycle.phase3_close_date) && f.phase3_close_date) payload.phase3_close_date = f.phase3_close_date;
    router.post(`/hr/performance/cycles/${props.cycle.id}/extend-dates`, payload, {
        preserveScroll: true,
        onSuccess: () => { showExtendDialog.value = false; },
        onFinish: () => { extendSaving.value = false; },
    });
}

// ── Phase advance ──────────────────────────────────────────────────────────
const phaseLabels: Record<string, string> = {
    planning: 'Planning Stage', tracking: 'Mid-Year Review', rating: 'Final Appraisal', completed: 'Completed',
};
const nextPhaseLabel: Record<string, string> = {
    planning: 'Mid-Year Review', tracking: 'Final Appraisal', rating: 'Complete Cycle',
};

function advancePhase() {
    const nextLabel = nextPhaseLabel[props.cycle.current_phase] ?? 'next phase';
    if (!confirm(`Advance cycle to ${nextLabel} phase? This will update all eligible review statuses.`)) return;
    router.post(`/hr/performance/cycles/${props.cycle.id}/advance-phase`, {}, { preserveScroll: true });
}

// ── Cycle status ───────────────────────────────────────────────────────────
function updateCycleStatus(status: string) {
    router.patch(`/hr/performance/cycles/${props.cycle.id}`, {
        name: props.cycle.name,
        status,
        start_date: props.cycle.start_date,
        end_date: props.cycle.end_date,
    }, { preserveScroll: true });
}

const statusColor: Record<string, string> = {
    draft: 'bg-gray-100 text-gray-700',
    planning_agreed: 'bg-blue-100 text-blue-800',
    tracking: 'bg-amber-100 text-amber-800',
    rating: 'bg-purple-100 text-purple-800',
    finalized: 'bg-green-100 text-green-800',
    // legacy
    pending: 'bg-yellow-100 text-yellow-800',
    submitted: 'bg-blue-100 text-blue-800',
    acknowledged: 'bg-purple-100 text-purple-800',
};

// ── Review table filter ────────────────────────────────────────────────────
const reviewSearch = ref('');
const reviewStatusFilter = ref('_all');

const filteredReviews = computed(() => {
    return props.cycle.reviews.filter(r => {
        const q = reviewSearch.value.toLowerCase();
        const matchSearch = !q || r.employee.name.toLowerCase().includes(q) || (r.employee.department ?? '').toLowerCase().includes(q);
        const matchStatus = reviewStatusFilter.value === '_all' || r.status === reviewStatusFilter.value;
        return matchSearch && matchStatus;
    });
});

// Stats
const stats = computed(() => ({
    total: props.cycle.reviews.length,
    draft: props.cycle.reviews.filter(r => r.status === 'draft').length,
    planning_agreed: props.cycle.reviews.filter(r => r.status === 'planning_agreed').length,
    tracking: props.cycle.reviews.filter(r => r.status === 'tracking').length,
    rating: props.cycle.reviews.filter(r => r.status === 'rating').length,
    finalized: props.cycle.reviews.filter(r => r.status === 'finalized').length,
    notified: props.cycle.reviews.filter(r => r.notify_sent_at).length,
}));

function deleteReview(reviewId: number, employeeName: string) {
    if (!confirm(`Delete appraisal for ${employeeName}? This cannot be undone.`)) return;
    router.delete(`/hr/performance/reviews/${reviewId}`, { preserveScroll: true });
}

function formatDate(d: string | null): string {
    if (!d) return '';
    return new Date(d).toLocaleDateString('en-GB', { day: '2-digit', month: 'short' });
}
</script>

<template>
    <Head :title="cycle.name" />
    <AppLayout :breadcrumbs="breadcrumbs">
        <div class="flex h-full flex-1 flex-col gap-4 p-4 md:p-6">

            <!-- Header -->
            <div class="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                <div>
                    <h2 class="text-2xl font-bold">{{ cycle.name }}</h2>
                    <p class="text-muted-foreground capitalize">{{ cycle.period_type }} · {{ cycle.start_date }} → {{ cycle.end_date }}</p>
                </div>
                <div v-if="isAdmin" class="flex flex-wrap gap-2">
                    <Select :model-value="cycle.status" @update:model-value="v => updateCycleStatus(String(v))">
                        <SelectTrigger class="w-[130px]"><SelectValue /></SelectTrigger>
                        <SelectContent>
                            <SelectItem value="draft">Draft</SelectItem>
                            <SelectItem value="active">Active</SelectItem>
                            <SelectItem value="completed">Completed</SelectItem>
                        </SelectContent>
                    </Select>
                    <Button
                        :variant="cycle.scores_visible ? 'default' : 'outline'"
                        @click="toggleScores"
                        :title="cycle.scores_visible ? 'Scores are visible to employees — click to hide' : 'Scores are hidden from employees — click to reveal'"
                    >
                        <Eye v-if="cycle.scores_visible" class="mr-2 size-4" />
                        <EyeOff v-else class="mr-2 size-4" />
                        {{ cycle.scores_visible ? 'Scores Visible' : 'Scores Hidden' }}
                    </Button>
                    <Button variant="outline" @click="sendAllNotifications" :disabled="cycle.reviews.length === 0">
                        <Send class="mr-2 size-4" />Send All Notifications
                    </Button>
                    <Button variant="outline" @click="openExtendDialog">
                        <CalendarDays class="mr-2 size-4" />Extend Dates
                    </Button>
                    <Button variant="outline" @click="openCreateDialog">
                        <UserPlus class="mr-2 size-4" />Create Individual Appraisal
                    </Button>
                    <Button @click="autoAssignAll" :disabled="assigning">
                        <Users class="mr-2 size-4" />
                        {{ assigning ? 'Creating...' : 'Create for All Staff' }}
                    </Button>
                </div>
            </div>

            <!-- Phase Management Panel (admin/hr only) -->
            <div v-if="isAdmin" class="rounded-xl border bg-white shadow-sm overflow-hidden">
                <div class="px-5 py-3 bg-gray-50 border-b flex items-center justify-between">
                    <div class="flex items-center gap-3">
                        <span class="text-sm font-semibold text-gray-700">Appraisal Phase</span>
                        <span :class="['text-xs font-medium px-2.5 py-0.5 rounded-full', cycle.current_phase === 'planning' ? 'bg-blue-100 text-blue-800' : cycle.current_phase === 'tracking' ? 'bg-amber-100 text-amber-800' : cycle.current_phase === 'rating' ? 'bg-purple-100 text-purple-800' : 'bg-green-100 text-green-800']">
                            {{ phaseLabels[cycle.current_phase] ?? cycle.current_phase }}
                        </span>
                    </div>
                    <Button v-if="cycle.current_phase !== 'completed'" variant="outline" size="sm" @click="advancePhase">
                        Advance to {{ nextPhaseLabel[cycle.current_phase] }} Phase →
                    </Button>
                    <span v-else class="text-xs text-green-700 font-medium">✓ Cycle Completed</span>
                </div>
                <div class="grid grid-cols-3 divide-x text-sm">
                    <div class="px-5 py-3" :class="cycle.current_phase === 'planning' ? 'bg-blue-50' : ''">
                        <p class="font-medium text-xs text-gray-500 uppercase mb-1">Phase 1 — Planning Stage</p>
                        <p class="text-xs text-gray-600">
                            {{ cycle.phase1_open_date ?? '—' }} → {{ cycle.phase1_close_date ?? '—' }}
                        </p>
                        <p class="text-xs mt-1 text-blue-700">
                            {{ stats.planning_agreed }} / {{ stats.total }} reviews agreed
                        </p>
                    </div>
                    <div class="px-5 py-3" :class="cycle.current_phase === 'tracking' ? 'bg-amber-50' : ''">
                        <p class="font-medium text-xs text-gray-500 uppercase mb-1">Phase 2 — Mid-Year Review</p>
                        <p class="text-xs text-gray-600">
                            {{ cycle.phase2_open_date ?? '—' }} → {{ cycle.phase2_close_date ?? '—' }}
                        </p>
                        <p class="text-xs mt-1 text-amber-700">
                            {{ stats.tracking }} review(s) in tracking
                        </p>
                    </div>
                    <div class="px-5 py-3" :class="cycle.current_phase === 'rating' ? 'bg-purple-50' : ''">
                        <p class="font-medium text-xs text-gray-500 uppercase mb-1">Phase 3 — Evaluation Stage</p>
                        <p class="text-xs text-gray-600">
                            {{ cycle.phase3_open_date ?? '—' }} → {{ cycle.phase3_close_date ?? '—' }}
                        </p>
                        <p class="text-xs mt-1 text-purple-700">
                            {{ stats.finalized }} / {{ stats.total }} finalized
                        </p>
                    </div>
                </div>
            </div>

            <!-- Stats row -->
            <div class="grid grid-cols-3 gap-3 md:grid-cols-6">
                <Card class="p-3 text-center">
                    <p class="text-2xl font-bold">{{ stats.total }}</p>
                    <p class="text-xs text-muted-foreground">Total</p>
                </Card>
                <Card class="p-3 text-center">
                    <p class="text-2xl font-bold text-blue-600">{{ stats.draft }}</p>
                    <p class="text-xs text-muted-foreground">Planning</p>
                </Card>
                <Card class="p-3 text-center">
                    <p class="text-2xl font-bold text-blue-600">{{ stats.planning_agreed }}</p>
                    <p class="text-xs text-muted-foreground">Agreed</p>
                </Card>
                <Card class="p-3 text-center">
                    <p class="text-2xl font-bold text-amber-600">{{ stats.tracking }}</p>
                    <p class="text-xs text-muted-foreground">Tracking</p>
                </Card>
                <Card class="p-3 text-center">
                    <p class="text-2xl font-bold text-purple-600">{{ stats.rating }}</p>
                    <p class="text-xs text-muted-foreground">Rating</p>
                </Card>
                <Card class="p-3 text-center">
                    <p class="text-2xl font-bold text-green-600">{{ stats.finalized }}</p>
                    <p class="text-xs text-muted-foreground">Finalized</p>
                </Card>
                <Card class="p-3 text-center">
                    <p class="text-2xl font-bold text-orange-500">{{ stats.notified }}</p>
                    <p class="text-xs text-muted-foreground">Notified</p>
                </Card>
            </div>

            <!-- Reviews table -->
            <Card>
                <CardHeader>
                    <div class="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                        <CardTitle>Reviews ({{ filteredReviews.length }})</CardTitle>
                        <div class="flex gap-2">
                            <Input v-model="reviewSearch" placeholder="Search employee..." class="h-8 w-40 text-sm" />
                            <Select :model-value="reviewStatusFilter" @update:model-value="v => reviewStatusFilter = String(v)">
                                <SelectTrigger class="h-8 w-36 text-sm">
                                    <SelectValue placeholder="All status" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="_all">All Status</SelectItem>
                                    <SelectItem value="pending">Pending</SelectItem>
                                    <SelectItem value="submitted">Submitted</SelectItem>
                                    <SelectItem value="acknowledged">Acknowledged</SelectItem>
                                    <SelectItem value="finalized">Finalized</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                </CardHeader>
                <CardContent class="p-0">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Employee</TableHead>
                                <TableHead class="hidden md:table-cell">Department</TableHead>
                                <TableHead>Line Manager / Reviewer</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead class="hidden lg:table-cell">Score</TableHead>
                                <TableHead class="hidden lg:table-cell">Notified</TableHead>
                                <TableHead class="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            <TableRow v-for="review in filteredReviews" :key="review.id">
                                <TableCell class="font-medium">{{ review.employee.name }}</TableCell>
                                <TableCell class="hidden md:table-cell text-muted-foreground text-sm">
                                    {{ review.employee.department ?? '—' }}
                                </TableCell>
                                <TableCell class="text-sm">
                                    {{ review.employee.hr_profile?.line_manager_name ?? review.reviewer.name }}
                                </TableCell>
                                <TableCell>
                                    <span
                                        class="inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium capitalize"
                                        :class="statusColor[review.status] ?? 'bg-gray-100 text-gray-800'"
                                    >{{ review.status }}</span>
                                </TableCell>
                                <TableCell class="hidden lg:table-cell">
                                    {{ review.overall_score ? `${review.overall_score}%` : '—' }}
                                </TableCell>
                                <TableCell class="hidden lg:table-cell">
                                    <span v-if="review.notify_sent_at" class="flex items-center gap-1 text-xs text-green-600">
                                        <BellRing class="size-3.5" />{{ formatDate(review.notify_sent_at) }}
                                    </span>
                                    <span v-else class="text-xs text-muted-foreground">—</span>
                                </TableCell>
                                <TableCell class="text-right">
                                    <div class="flex items-center justify-end gap-1">
                                        <Button
                                            v-if="isAdmin"
                                            size="sm"
                                            variant="ghost"
                                            :disabled="sendingNotification === review.id"
                                            @click="sendIndividualNotification(review.id)"
                                            :title="review.notify_sent_at ? 'Resend notification' : 'Send notification'"
                                        >
                                            <Bell class="size-4" :class="review.notify_sent_at ? 'text-green-600' : 'text-muted-foreground'" />
                                        </Button>
                                        <Button size="sm" variant="outline" as-child>
                                            <a :href="`/hr/performance/reviews/${review.id}`">
                                                <Pencil v-if="isAdmin" class="mr-1.5 size-3.5" />
                                                {{ isAdmin ? 'Edit' : 'View' }}
                                            </a>
                                        </Button>
                                        <Button
                                            v-if="isDeleteAllowed"
                                            size="sm"
                                            variant="ghost"
                                            class="text-destructive hover:text-destructive"
                                            @click="deleteReview(review.id, review.employee.name)"
                                            title="Delete appraisal"
                                        >
                                            <Trash2 class="size-4" />
                                        </Button>
                                    </div>
                                </TableCell>
                            </TableRow>
                            <TableRow v-if="filteredReviews.length === 0">
                                <TableCell colspan="7" class="py-10 text-center text-muted-foreground">
                                    {{ cycle.reviews.length === 0 ? 'No reviews assigned yet. Click "Auto-Assign All Employees" to get started.' : 'No reviews match the current filter.' }}
                                </TableCell>
                            </TableRow>
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>

        <!-- ── Extend Dates Dialog ────────────────────────────────────────── -->
        <Dialog v-model:open="showExtendDialog">
            <DialogContent class="max-w-lg">
                <DialogHeader>
                    <DialogTitle>Extend Cycle Dates</DialogTitle>
                    <DialogDescription>
                        Only dates that have not yet elapsed can be modified. Elapsed dates are shown as read-only.
                    </DialogDescription>
                </DialogHeader>

                <div class="space-y-4 text-sm">
                    <!-- Cycle dates -->
                    <div>
                        <p class="font-medium text-gray-700 mb-2">Cycle Period</p>
                        <div class="grid grid-cols-2 gap-3">
                            <div class="space-y-1">
                                <label class="text-xs text-gray-500">Start Date</label>
                                <Input
                                    v-if="!isDateElapsed(cycle.start_date)"
                                    v-model="extendForm.start_date"
                                    type="date"
                                    class="h-8 text-sm"
                                />
                                <p v-else class="text-xs text-muted-foreground italic px-1">{{ cycle.start_date }} (elapsed)</p>
                            </div>
                            <div class="space-y-1">
                                <label class="text-xs text-gray-500">End Date</label>
                                <Input
                                    v-if="!isDateElapsed(cycle.end_date)"
                                    v-model="extendForm.end_date"
                                    type="date"
                                    class="h-8 text-sm"
                                />
                                <p v-else class="text-xs text-muted-foreground italic px-1">{{ cycle.end_date }} (elapsed)</p>
                            </div>
                        </div>
                    </div>

                    <!-- Phase 1 -->
                    <div>
                        <p class="font-medium text-gray-700 mb-2">Phase 1 — Planning Stage</p>
                        <div class="grid grid-cols-2 gap-3">
                            <div class="space-y-1">
                                <label class="text-xs text-gray-500">Open Date</label>
                                <Input
                                    v-if="!isDateElapsed(cycle.phase1_open_date)"
                                    v-model="extendForm.phase1_open_date"
                                    type="date"
                                    class="h-8 text-sm"
                                />
                                <p v-else class="text-xs text-muted-foreground italic px-1">{{ cycle.phase1_open_date ?? '—' }} (elapsed)</p>
                            </div>
                            <div class="space-y-1">
                                <label class="text-xs text-gray-500">Close Date</label>
                                <Input
                                    v-if="!isDateElapsed(cycle.phase1_close_date)"
                                    v-model="extendForm.phase1_close_date"
                                    type="date"
                                    class="h-8 text-sm"
                                />
                                <p v-else class="text-xs text-muted-foreground italic px-1">{{ cycle.phase1_close_date ?? '—' }} (elapsed)</p>
                            </div>
                        </div>
                    </div>

                    <!-- Phase 2 -->
                    <div>
                        <p class="font-medium text-gray-700 mb-2">Phase 2 — Mid-Year Review</p>
                        <div class="grid grid-cols-2 gap-3">
                            <div class="space-y-1">
                                <label class="text-xs text-gray-500">Open Date</label>
                                <Input
                                    v-if="!isDateElapsed(cycle.phase2_open_date)"
                                    v-model="extendForm.phase2_open_date"
                                    type="date"
                                    class="h-8 text-sm"
                                />
                                <p v-else class="text-xs text-muted-foreground italic px-1">{{ cycle.phase2_open_date ?? '—' }} (elapsed)</p>
                            </div>
                            <div class="space-y-1">
                                <label class="text-xs text-gray-500">Close Date</label>
                                <Input
                                    v-if="!isDateElapsed(cycle.phase2_close_date)"
                                    v-model="extendForm.phase2_close_date"
                                    type="date"
                                    class="h-8 text-sm"
                                />
                                <p v-else class="text-xs text-muted-foreground italic px-1">{{ cycle.phase2_close_date ?? '—' }} (elapsed)</p>
                            </div>
                        </div>
                    </div>

                    <!-- Phase 3 -->
                    <div>
                        <p class="font-medium text-gray-700 mb-2">Phase 3 — Final Appraisal</p>
                        <div class="grid grid-cols-2 gap-3">
                            <div class="space-y-1">
                                <label class="text-xs text-gray-500">Open Date</label>
                                <Input
                                    v-if="!isDateElapsed(cycle.phase3_open_date)"
                                    v-model="extendForm.phase3_open_date"
                                    type="date"
                                    class="h-8 text-sm"
                                />
                                <p v-else class="text-xs text-muted-foreground italic px-1">{{ cycle.phase3_open_date ?? '—' }} (elapsed)</p>
                            </div>
                            <div class="space-y-1">
                                <label class="text-xs text-gray-500">Close Date</label>
                                <Input
                                    v-if="!isDateElapsed(cycle.phase3_close_date)"
                                    v-model="extendForm.phase3_close_date"
                                    type="date"
                                    class="h-8 text-sm"
                                />
                                <p v-else class="text-xs text-muted-foreground italic px-1">{{ cycle.phase3_close_date ?? '—' }} (elapsed)</p>
                            </div>
                        </div>
                    </div>
                </div>

                <DialogFooter>
                    <Button variant="outline" @click="showExtendDialog = false">Cancel</Button>
                    <Button @click="saveExtendDates" :disabled="extendSaving">
                        {{ extendSaving ? 'Saving…' : 'Save Dates' }}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>

        <!-- ── Create Individual Appraisal Dialog ────────────────────────── -->
        <Dialog v-model:open="showCreateDialog">
            <DialogContent class="max-w-2xl">
                <DialogHeader>
                    <DialogTitle>Create Individual Appraisal</DialogTitle>
                    <DialogDescription>
                        Select an employee to create an appraisal for the <strong>{{ cycle.name }}</strong> cycle.
                        Their line manager will automatically be set as the reviewer.
                    </DialogDescription>
                </DialogHeader>

                <!-- Search -->
                <Input
                    v-model="employeeSearch"
                    placeholder="Search by name, department or job role…"
                    class="mt-1"
                />

                <!-- Selected employee summary -->
                <div v-if="selectedEmployee" class="rounded-lg border border-primary/40 bg-primary/5 px-4 py-3 text-sm">
                    <p class="font-semibold">{{ selectedEmployee.name }}</p>
                    <p class="text-muted-foreground text-xs">
                        {{ selectedEmployee.position ?? '—' }}
                        <template v-if="selectedEmployee.department"> · {{ selectedEmployee.department }}</template>
                        <template v-if="selectedEmployee.line_manager_name"> · Manager: {{ selectedEmployee.line_manager_name }}</template>
                    </p>
                </div>

                <!-- Employee list -->
                <div class="max-h-72 overflow-y-auto rounded-md border text-sm">
                    <div
                        v-for="emp in availableEmployees"
                        :key="emp.id"
                        @click="selectedEmployeeId = emp.id"
                        class="flex cursor-pointer items-center justify-between px-4 py-2.5 hover:bg-muted/50 transition-colors"
                        :class="selectedEmployeeId === emp.id ? 'bg-primary/10 font-medium' : 'border-b border-border last:border-0'"
                    >
                        <div>
                            <p class="font-medium">{{ emp.name }}</p>
                            <p class="text-xs text-muted-foreground">
                                {{ emp.position ?? '—' }}
                                <template v-if="emp.department"> · {{ emp.department }}</template>
                            </p>
                        </div>
                        <span v-if="selectedEmployeeId === emp.id" class="text-xs font-semibold text-primary">Selected ✓</span>
                    </div>
                    <div v-if="availableEmployees.length === 0" class="py-6 text-center text-muted-foreground">
                        <template v-if="employeeSearch">No employees match "{{ employeeSearch }}".</template>
                        <template v-else>All active employees already have an appraisal in this cycle.</template>
                    </div>
                </div>

                <DialogFooter>
                    <Button variant="outline" @click="showCreateDialog = false">Cancel</Button>
                    <Button @click="createIndividual" :disabled="!selectedEmployeeId || creating">
                        {{ creating ? 'Creating…' : 'Create Appraisal' }}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    </AppLayout>
</template>
