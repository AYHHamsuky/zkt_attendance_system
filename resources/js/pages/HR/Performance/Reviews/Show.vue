<script setup lang="ts">
import { Head, router, useForm } from '@inertiajs/vue3';
import AppLayout from '@/layouts/AppLayout.vue';
import { type BreadcrumbItem } from '@/types';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Separator } from '@/components/ui/separator';
import { CheckCircle, Clock, Plus, Trash2, Lock, AlertTriangle, ChevronRight, Upload } from 'lucide-vue-next';
import { computed, ref } from 'vue';
import { useModuleTour } from '@/composables/useModuleTour';

useModuleTour('performance_review', 800);

interface TrackingEntry {
    id: number;
    period: string;
    status: string;
    remarks: string | null;
    created_at: string;
    tracked_by: { id: number; name: string } | null;
}

interface Objective {
    id: number;
    bsc_category: string;
    serial: number | null;
    is_custom: boolean;
    description: string;
    kpi: string | null;
    target: string | null;
    yearly_achieved: string | null;
    weight: string | number;
    score: string | number | null;
    self_rating: number | null;
    comments: string | null;
    self_remark: string | null;
    progress_status: string | null;
    tracking_entries: TrackingEntry[];
}

interface TrainingNeed {
    id: number;
    name: string;
    skill_gap: string | null;
    training_type: string;
    priority: string;
    target_date: string | null;
    status: string;
    notes: string | null;
}

interface Review {
    id: number;
    status: string;
    job_role_title: string | null;
    employee_comment: string | null;
    overall_score: string | null;
    reviewer_comments: string | null;
    submitted_at: string | null;
    acknowledged_at: string | null;
    reviewed_at: string | null;
    employee_agreed_at: string | null;
    manager_agreed_at: string | null;
    planning_locked_at: string | null;
    hr_approved_at: string | null;
    hr_rejected_at: string | null;
    hr_rejection_reason: string | null;
    employee: { id: number; name: string; department: string | null; position: string | null };
    cycle: { id: number; name: string; year: number; current_phase: string; scores_visible: boolean };
    reviewer: { id: number; name: string } | null;
    objectives: Objective[];
    training_needs: TrainingNeed[];
}

const props = defineProps<{
    review: Review;
    scoreLabels: Record<number, string>;
    bscCategories: string[];
    canViewScores: boolean;
    canManageReview: boolean;
    isEmployee: boolean;
    isReviewer: boolean;
    cyclePhase: string;
    personalTemplateId: number | null;
}>();

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'HR Management', href: '/hr' },
    { title: 'Performance', href: '/hr/performance/cycles' },
    { title: props.review.cycle.name, href: `/hr/performance/cycles/${props.review.cycle.id}` },
    { title: props.review.employee.name },
];

const isPlanningLocked = computed(() => !!props.review.planning_locked_at);
// Interactive planning edits/agreements only available when review is still in draft status
const canEditPlanningPhase = computed(() => props.cyclePhase === 'planning' && props.review.status === 'draft');

// ──────────────────────────────────────────
// Phase 1 — Planning
// ──────────────────────────────────────────

const templateObjectives = computed(() => props.review.objectives.filter(o => !o.is_custom));
const existingCustomObjectives = computed(() => props.review.objectives.filter(o => o.is_custom));

interface CustomObjectiveRow {
    id: number | null;
    bsc_category: string;
    description: string;
    kpi: string;
    target: string;
    weight: number | string;
}

const planForm = useForm({
    objectives: templateObjectives.value.map(o => ({
        id: o.id,
        description: o.description,
        kpi: o.kpi ?? '',
        target: o.target ?? '',
        weight: parseFloat(String(o.weight)) || 0,
    })),
    custom_objectives: existingCustomObjectives.value.map(o => ({
        id: o.id,
        bsc_category: o.bsc_category,
        description: o.description,
        kpi: o.kpi ?? '',
        target: o.target ?? '',
        weight: parseFloat(String(o.weight)) || 0,
    })) as CustomObjectiveRow[],
    deleted_custom_ids: [] as number[],
});

const planTotalWeight = computed(() => {
    const templateW = planForm.objectives.reduce((s, o) => s + (parseFloat(String(o.weight)) || 0), 0);
    const customW = planForm.custom_objectives.reduce((s, o) => s + (parseFloat(String(o.weight)) || 0), 0);
    return Math.round((templateW + customW) * 100) / 100;
});

function addCustomObjective() {
    planForm.custom_objectives.push({ id: null, bsc_category: 'Financials', description: '', kpi: '', target: '', weight: 0 });
}

function removeCustomObjective(idx: number) {
    const row = planForm.custom_objectives[idx];
    if (row.id) {
        planForm.deleted_custom_ids.push(row.id as number);
    }
    planForm.custom_objectives.splice(idx, 1);
}

function savePlan() {
    planForm.post(`/hr/performance/reviews/${props.review.id}/save-self`, {
        preserveScroll: true,
    });
}

// CSV upload for planning objectives
const csvInput = ref<HTMLInputElement | null>(null);
const csvForm = useForm({ csv: null as File | null });

function onCsvSelected(e: Event) {
    const file = (e.target as HTMLInputElement).files?.[0];
    if (!file) { return; }
    csvForm.csv = file;
    csvForm.post(`/hr/performance/reviews/${props.review.id}/upload-csv`, {
        preserveScroll: true,
        forceFormData: true,
        onSuccess: () => { csvForm.reset(); if (csvInput.value) { csvInput.value.value = ''; } },
    });
}

const agreeEmployeeForm = useForm({});
function agreeEmployee() {
    agreeEmployeeForm.post(`/hr/performance/reviews/${props.review.id}/agree-employee`, { preserveScroll: true });
}

const agreeManagerForm = useForm({});
function agreeManager() {
    agreeManagerForm.post(`/hr/performance/reviews/${props.review.id}/agree-manager`, { preserveScroll: true });
}

// HR approval / rejection
const hrApproveForm = useForm({});
const hrRejectForm = useForm({ reason: '' });
const showRejectDialog = ref(false);
function hrApprove() {
    hrApproveForm.post(`/hr/performance/reviews/${props.review.id}/hr-approve`, { preserveScroll: true });
}
function hrReject() {
    if (!hrRejectForm.reason.trim()) { return; }
    hrRejectForm.post(`/hr/performance/reviews/${props.review.id}/hr-reject`, {
        preserveScroll: true,
        onSuccess: () => { showRejectDialog.value = false; hrRejectForm.reset(); },
    });
}

// ──────────────────────────────────────────
// Phase 2 — Tracking
// ──────────────────────────────────────────

const trackingForm = useForm({
    objective_id: null as number | null,
    period: 'H1',
    status: 'on_track',
    remarks: '',
});

const showTrackingFormForObj = ref<number | null>(null);

function openTrackingForm(objId: number) {
    showTrackingFormForObj.value = objId;
    trackingForm.objective_id = objId;
    trackingForm.period = 'H1';
    trackingForm.status = 'on_track';
    trackingForm.remarks = '';
}

function submitTrackingEntry() {
    trackingForm.post(`/hr/performance/reviews/${props.review.id}/tracking-entries`, {
        preserveScroll: true,
        onSuccess: () => {
            showTrackingFormForObj.value = null;
        },
    });
}

function deleteTrackingEntry(entryId: number) {
    router.delete(`/hr/performance/reviews/${props.review.id}/tracking-entries/${entryId}`, {
        preserveScroll: true,
    });
}

function trackingStatusLabel(status: string) {
    const map: Record<string, string> = { on_track: 'On Track', off_track: 'Off Track', not_started: 'Not Started', not_required: 'Not Required' };
    return map[status] ?? status;
}

function trackingStatusColor(status: string) {
    if (status === 'on_track') return 'bg-green-100 text-green-800';
    if (status === 'off_track') return 'bg-red-100 text-red-800';
    if (status === 'not_started') return 'bg-gray-100 text-gray-700';
    if (status === 'not_required') return 'bg-slate-100 text-slate-600';
    return 'bg-gray-100 text-gray-700';
}

// ──────────────────────────────────────────
// Phase 3 — Rating
// ──────────────────────────────────────────

const CORE_VALUES: string[] = ['Team Work', 'Integrity', 'Excellence', 'Sustainability'];
const CORE_VALUES_KPI: Record<string, string> = {
    'Team Work': 'Respects diversity of individuals and thoughts. Works as a part of the cohesive team.',
    'Integrity': 'Conducts his/her business fairly and honestly. Ethical while dealing (serving) any stakeholder.',
    'Excellence': 'Achieves the highest possible standards of work. Embraces change and faces challenges boldly & intelligently.',
    'Sustainability': 'Continuously thrives for improvements in his/her assigned work/processes. Looks for creative & breakthrough solution to problems.',
};

const ratingForm = useForm({
    employee_comment: props.review.employee_comment ?? '',
    objectives: props.review.objectives.map(o => ({
        id: o.id,
        self_rating: o.self_rating ?? null,
        self_remark: o.self_remark ?? '',
        yearly_achieved: o.yearly_achieved ?? '',
    })),
});

const managerForm = useForm({
    reviewer_comments: props.review.reviewer_comments ?? '',
    objectives: props.review.objectives.map(o => ({
        id: o.id,
        score: o.score ? parseInt(o.score as string) : null,
        comments: o.comments ?? '',
    })),
});

function calcScore(lmRating: number | null, weight: number | string): string {
    if (!lmRating) return '—';
    return ((lmRating / 5) * parseFloat(weight as string)).toFixed(2);
}

const overallPercent = computed(() => {
    if (!props.review.overall_score) return null;
    return parseFloat(props.review.overall_score);
});

function overallGrade(pct: number): string {
    if (pct >= 95) return 'Exceptional';
    if (pct >= 85) return 'Exceeds Expectations';
    if (pct >= 70) return 'Meets Expectations';
    if (pct >= 50) return 'Needs Improvement';
    return 'Performance Improvement Plan';
}

function saveRatings() {
    ratingForm.post(`/hr/performance/reviews/${props.review.id}/save-self`, { preserveScroll: true });
}

function saveManagerScores() {
    managerForm.post(`/hr/performance/reviews/${props.review.id}/save-manager`, { preserveScroll: true });
}

function finalizeReview() {
    if (confirm('Finalize this review? Scores will be locked and the employee will be notified.')) {
        router.post(`/hr/performance/reviews/${props.review.id}/acknowledge`);
    }
}

// ──────────────────────────────────────────
// Training Needs
// ──────────────────────────────────────────

const showTrainingForm = ref(false);
const trainingForm = useForm({
    name: '',
    skill_gap: '',
    training_type: 'internal',
    priority: 'medium',
    target_date: '',
    notes: '',
});

function addTrainingNeed() {
    trainingForm.post(`/hr/performance/reviews/${props.review.id}/training-needs`, {
        preserveScroll: true,
        onSuccess: () => {
            trainingForm.reset();
            showTrainingForm.value = false;
        },
    });
}

function removeTrainingNeed(needId: number) {
    router.delete(`/hr/performance/reviews/${props.review.id}/training-needs/${needId}`, { preserveScroll: true });
}

// ──────────────────────────────────────────
// Status helpers
// ──────────────────────────────────────────

const statusColors: Record<string, string> = {
    draft: 'bg-gray-100 text-gray-700',
    planning_agreed: 'bg-blue-100 text-blue-800',
    tracking: 'bg-amber-100 text-amber-800',
    rating: 'bg-purple-100 text-purple-800',
    finalized: 'bg-green-100 text-green-800',
};

const statusLabels: Record<string, string> = {
    draft: 'Planning Stage',
    planning_agreed: 'Awaiting HR Approval',
    tracking: 'Mid-Year Review',
    rating: 'Final Appraisal',
    finalized: 'Finalized',
};

function formatDate(dt: string | null): string {
    if (!dt) return '—';
    return new Date(dt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });
}

// BSC category grouping for display
const bscGrouped = computed(() => {
    const groups: Record<string, Objective[]> = {};
    props.review.objectives.forEach(o => {
        if (!groups[o.bsc_category]) groups[o.bsc_category] = [];
        groups[o.bsc_category].push(o);
    });
    return groups;
});

// ratingForm index lookup for Phase 3
function ratingObjIndex(id: number): number {
    return ratingForm.objectives.findIndex(o => o.id === id);
}

function managerObjIndex(id: number): number {
    return managerForm.objectives.findIndex(o => o.id === id);
}

function planObjIndex(id: number): number {
    return planForm.objectives.findIndex(o => o.id === id);
}
</script>

<template>
    <AppLayout :breadcrumbs="breadcrumbs">
        <Head :title="`Appraisal — ${review.employee.name}`" />

        <div class="max-w-6xl mx-auto px-4 py-6 space-y-6">

            <!-- Header -->
            <div class="flex flex-wrap items-start gap-4 justify-between" data-tour="perf-review-header">
                <div>
                    <h1 class="text-2xl font-bold">{{ review.employee.name }}</h1>
                    <p class="text-sm text-muted-foreground">
                        {{ review.job_role_title ?? review.employee.position ?? '—' }}
                        · {{ review.employee.department ?? '—' }}
                        · {{ review.cycle.name }}
                    </p>
                    <p class="text-xs text-muted-foreground mt-1">
                        Line Manager: {{ review.reviewer?.name ?? '—' }}
                    </p>
                </div>
                <div class="flex items-center gap-2">
                    <span :class="['text-xs font-medium px-2 py-1 rounded-full', statusColors[review.status] ?? 'bg-gray-100 text-gray-700']">
                        {{ statusLabels[review.status] ?? review.status }}
                    </span>
                </div>
            </div>

            <!-- Phase progress strip -->
            <div class="flex items-center gap-2 text-xs font-medium">
                <span :class="['px-3 py-1 rounded-full', cyclePhase === 'planning' ? 'bg-blue-600 text-white' : (review.status === 'planning_agreed' || ['tracking','rating','finalized'].includes(review.status)) ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-500']">
                    1 · Planning Stage
                </span>
                <ChevronRight class="w-3 h-3 text-gray-400" />
                <span :class="['px-3 py-1 rounded-full', cyclePhase === 'tracking' ? 'bg-amber-500 text-white' : ['rating','finalized'].includes(review.status) ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-500']">
                    2 · Mid-Year Review
                </span>
                <ChevronRight class="w-3 h-3 text-gray-400" />
                <span :class="['px-3 py-1 rounded-full', cyclePhase === 'rating' ? 'bg-purple-600 text-white' : review.status === 'finalized' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-500']">
                    3 · Final Appraisal
                </span>
                <ChevronRight class="w-3 h-3 text-gray-400" />
                <span :class="['px-3 py-1 rounded-full', review.status === 'finalized' ? 'bg-green-600 text-white' : 'bg-gray-100 text-gray-500']">
                    Finalized
                </span>
            </div>

            <!-- ═══════════════════════════════════════
                 PHASE 1 — PLANNING
            ═══════════════════════════════════════ -->
            <template v-if="cyclePhase === 'planning' || review.status === 'draft' || review.status === 'planning_agreed'">
                <div class="bg-white border rounded-xl shadow-sm overflow-hidden">
                    <div class="bg-blue-50 border-b px-6 py-4 flex items-center justify-between">
                        <div>
                            <h2 class="font-semibold text-blue-900">Planning Stage</h2>
                            <p class="text-xs text-blue-700 mt-0.5">Employee and Line Manager jointly agree on objectives, KPIs, weights, and targets.</p>
                        </div>
                        <Lock v-if="isPlanningLocked" class="w-5 h-5 text-green-600" />
                    </div>

                    <!-- Planning Locked notice -->
                    <div v-if="isPlanningLocked" class="px-6 py-3 bg-green-50 border-b flex items-center gap-2 text-green-800 text-sm">
                        <CheckCircle class="w-4 h-4" />
                        <span>Planning phase agreed and locked on {{ formatDate(review.planning_locked_at) }}</span>
                    </div>

                    <div class="px-6 py-4 space-y-4" data-tour="perf-objectives-section">
                        <!-- Objectives Table -->
                        <div class="overflow-x-auto">
                            <table class="min-w-full text-sm border-collapse">
                                <thead>
                                    <tr class="bg-gray-50 text-xs font-semibold text-gray-600 uppercase tracking-wide">
                                        <th class="border px-3 py-2 text-left">BSC Category</th>
                                        <th class="border px-3 py-2 text-left">S/N</th>
                                        <th class="border px-3 py-2 text-left min-w-48">Objective / Description</th>
                                        <th class="border px-3 py-2 text-left min-w-48">KPI</th>
                                        <th class="border px-3 py-2 text-center w-20">Wt%</th>
                                        <th class="border px-3 py-2 text-left min-w-32">Target</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <template v-for="(objs, category) in bscGrouped" :key="category">
                                        <tr v-for="(obj, idx) in objs" :key="obj.id"
                                            :class="obj.is_custom ? 'bg-amber-50' : (idx % 2 === 0 ? 'bg-white' : 'bg-gray-50/50')">
                                            <td class="border px-3 py-2 text-xs text-gray-500 whitespace-nowrap">
                                                {{ obj.is_custom ? `${obj.bsc_category} (Custom)` : obj.bsc_category }}
                                                <span v-if="obj.bsc_category === 'Core Values'" class="ml-1 text-xs text-slate-400 italic">(auto)</span>
                                            </td>
                                            <td class="border px-3 py-2 text-xs text-center text-gray-400">{{ obj.serial ?? '—' }}</td>

                                            <!-- Editable when not locked, in planning phase, and NOT a Core Values objective -->
                                            <template v-if="!isPlanningLocked && (isEmployee || canManageReview) && canEditPlanningPhase && obj.bsc_category !== 'Core Values'">
                                                <td class="border px-2 py-1">
                                                    <textarea v-if="!obj.is_custom && planObjIndex(obj.id) >= 0"
                                                        v-model="planForm.objectives[planObjIndex(obj.id)].description"
                                                        class="w-full text-sm border-0 bg-transparent resize-none focus:ring-1 focus:ring-blue-300 rounded p-1 min-h-8" rows="2" />
                                                    <span v-else class="text-sm">{{ obj.description }}</span>
                                                </td>
                                                <td class="border px-2 py-1">
                                                    <textarea v-if="!obj.is_custom && planObjIndex(obj.id) >= 0"
                                                        v-model="planForm.objectives[planObjIndex(obj.id)].kpi"
                                                        class="w-full text-sm border-0 bg-transparent resize-none focus:ring-1 focus:ring-blue-300 rounded p-1 min-h-8" rows="2" />
                                                    <span v-else class="text-xs text-gray-500">{{ obj.kpi ?? '—' }}</span>
                                                </td>
                                                <td class="border px-2 py-1 text-center">
                                                    <input v-if="!obj.is_custom && planObjIndex(obj.id) >= 0"
                                                        type="number" min="0" max="100" step="0.5"
                                                        v-model.number="planForm.objectives[planObjIndex(obj.id)].weight"
                                                        class="w-16 text-sm text-center border rounded focus:ring-1 focus:ring-blue-300 p-1" />
                                                    <span v-else class="text-sm font-medium">{{ obj.weight }}%</span>
                                                </td>
                                                <td class="border px-2 py-1">
                                                    <input v-if="!obj.is_custom && planObjIndex(obj.id) >= 0"
                                                        type="text"
                                                        v-model="planForm.objectives[planObjIndex(obj.id)].target"
                                                        class="w-full text-sm border rounded focus:ring-1 focus:ring-blue-300 p-1" />
                                                    <span v-else class="text-sm">{{ obj.target ?? '—' }}</span>
                                                </td>
                                            </template>
                                            <!-- Read-only -->
                                            <template v-else>
                                                <td class="border px-3 py-2 text-sm">{{ obj.description }}</td>
                                                <td class="border px-3 py-2 text-xs text-gray-500">{{ obj.kpi ?? '—' }}</td>
                                                <td class="border px-3 py-2 text-sm font-medium text-center">{{ obj.weight }}%</td>
                                                <td class="border px-3 py-2 text-sm">{{ obj.target ?? '—' }}</td>
                                            </template>
                                        </tr>
                                    </template>
                                </tbody>
                                <tfoot>
                                    <tr class="bg-gray-50 font-semibold">
                                        <td colspan="4" class="border px-3 py-2 text-right text-sm">Total Weight</td>
                                        <td class="border px-3 py-2 text-center"
                                            :class="Math.abs(planTotalWeight - 100) < 0.01 ? 'text-green-700' : planTotalWeight > 100 ? 'text-red-600' : 'text-amber-600'">
                                            {{ planTotalWeight }}%
                                        </td>
                                        <td class="border px-3 py-2">
                                            <span v-if="Math.abs(planTotalWeight - 100) < 0.01" class="text-xs text-green-600">✓ Valid</span>
                                            <span v-else class="text-xs text-amber-600">Must equal 100%</span>
                                        </td>
                                    </tr>
                                </tfoot>
                            </table>
                        </div>

                        <!-- Custom Objectives Editor (Phase 1 only, when unlocked) -->
                        <div v-if="!isPlanningLocked && (isEmployee || canManageReview) && canEditPlanningPhase" class="space-y-3">
                            <div class="flex items-center justify-between">
                                <h3 class="text-sm font-semibold text-gray-700">Custom Objectives</h3>
                                <Button variant="outline" size="sm" @click="addCustomObjective">
                                    <Plus class="w-4 h-4 mr-1" /> Add Custom
                                </Button>
                            </div>
                            <div v-if="planForm.custom_objectives.length === 0" class="text-xs text-gray-400 italic">
                                No custom objectives added yet.
                            </div>
                            <div v-for="(co, idx) in planForm.custom_objectives" :key="idx"
                                class="grid grid-cols-12 gap-2 items-start bg-amber-50 border border-amber-200 rounded-lg p-3">
                                <div class="col-span-2">
                                    <label class="text-xs text-gray-500 mb-0.5 block">Category</label>
                                    <select v-model="co.bsc_category" class="w-full text-sm border rounded p-1">
                                        <option v-for="cat in bscCategories.filter(c => c !== 'Core Values')" :key="cat" :value="cat">{{ cat }}</option>
                                    </select>
                                </div>
                                <div class="col-span-3">
                                    <label class="text-xs text-gray-500 mb-0.5 block">Description *</label>
                                    <textarea v-model="co.description" rows="2" class="w-full text-sm border rounded p-1 resize-none" />
                                </div>
                                <div class="col-span-3">
                                    <label class="text-xs text-gray-500 mb-0.5 block">KPI</label>
                                    <textarea v-model="co.kpi" rows="2" class="w-full text-sm border rounded p-1 resize-none" />
                                </div>
                                <div class="col-span-1">
                                    <label class="text-xs text-gray-500 mb-0.5 block">Wt%</label>
                                    <input type="number" min="0" max="100" step="0.5" v-model.number="co.weight"
                                        class="w-full text-sm border rounded p-1" />
                                </div>
                                <div class="col-span-2">
                                    <label class="text-xs text-gray-500 mb-0.5 block">Target</label>
                                    <input type="text" v-model="co.target" class="w-full text-sm border rounded p-1" />
                                </div>
                                <div class="col-span-1 flex items-end pb-0.5">
                                    <Button variant="ghost" size="sm" class="text-red-500 hover:text-red-700" @click="removeCustomObjective(idx)">
                                        <Trash2 class="w-4 h-4" />
                                    </Button>
                                </div>
                            </div>
                        </div>

                        <!-- Save Plan + CSV Upload buttons -->
                        <div v-if="!isPlanningLocked && (isEmployee || canManageReview) && canEditPlanningPhase" class="flex items-center justify-between gap-3">
                            <div class="flex items-center gap-2">
                                <Button variant="outline" size="sm" :disabled="csvForm.processing" @click="csvInput?.click()">
                                    <Upload class="mr-1.5 size-3.5" />
                                    {{ csvForm.processing ? 'Uploading…' : 'Upload KPI in Excel' }}
                                </Button>
                                <span class="text-xs text-muted-foreground">
                                    Columns: BSC Category, S/N, Objectives, KPI, Wt%, Target
                                    &nbsp;·&nbsp;
                                    <a href="/hr/performance/reviews/planning-csv-template" class="underline underline-offset-2 hover:text-foreground" download>
                                        Download template
                                    </a>
                                </span>
                                <input ref="csvInput" type="file" accept=".csv,.txt" class="hidden" @change="onCsvSelected" />
                            </div>
                            <Button @click="savePlan" :disabled="planForm.processing">
                                {{ planForm.processing ? 'Saving…' : 'Save Planning Objectives' }}
                            </Button>
                        </div>

                        <Separator />

                        <!-- Agreement Section -->
                        <div class="grid grid-cols-2 gap-6">
                            <div class="border rounded-lg p-4 space-y-2">
                                <h4 class="text-sm font-semibold">Employee Agreement</h4>
                                <div v-if="review.employee_agreed_at" class="flex items-center gap-2 text-green-700 text-sm">
                                    <CheckCircle class="w-4 h-4" />
                                    <span>Agreed on {{ formatDate(review.employee_agreed_at) }}</span>
                                </div>
                                <div v-else class="flex items-center gap-2 text-gray-400 text-sm">
                                    <Clock class="w-4 h-4" />
                                    <span>Not yet agreed</span>
                                </div>
                                <Button v-if="isEmployee && !review.employee_agreed_at && !isPlanningLocked && cyclePhase === 'planning'"
                                    @click="agreeEmployee"
                                    :disabled="agreeEmployeeForm.processing || Math.abs(planTotalWeight - 100) > 0.01"
                                    variant="outline" size="sm" class="w-full">
                                    {{ agreeEmployeeForm.processing ? 'Processing…' : 'I Agree to This Plan' }}
                                </Button>
                                <p v-if="isEmployee && Math.abs(planTotalWeight - 100) > 0.01 && !isPlanningLocked" class="text-xs text-amber-600">
                                    Total weight must equal 100% before agreeing.
                                </p>
                            </div>
                            <div class="border rounded-lg p-4 space-y-2">
                                <h4 class="text-sm font-semibold">Line Manager Agreement</h4>
                                <div v-if="review.manager_agreed_at" class="flex items-center gap-2 text-green-700 text-sm">
                                    <CheckCircle class="w-4 h-4" />
                                    <span>Agreed on {{ formatDate(review.manager_agreed_at) }}</span>
                                </div>
                                <div v-else class="flex items-center gap-2 text-gray-400 text-sm">
                                    <Clock class="w-4 h-4" />
                                    <span>Not yet agreed</span>
                                </div>
                                <Button v-if="(isReviewer || canManageReview) && !review.manager_agreed_at && !isPlanningLocked && cyclePhase === 'planning'"
                                    @click="agreeManager"
                                    :disabled="agreeManagerForm.processing"
                                    variant="outline" size="sm" class="w-full">
                                    {{ agreeManagerForm.processing ? 'Processing…' : 'I Agree to This Plan' }}
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            </template>

            <!-- ═══════════════════════════════════════
                 HR APPROVAL PANEL
            ═══════════════════════════════════════ -->
            <template v-if="review.status === 'planning_agreed' || review.hr_rejected_at">
                <div class="bg-white border rounded-xl shadow-sm overflow-hidden">
                    <div class="bg-indigo-50 border-b px-6 py-4 flex items-center justify-between">
                        <div>
                            <h2 class="font-semibold text-indigo-900">HR Review</h2>
                            <p class="text-xs text-indigo-700 mt-0.5">HR must review and approve the agreed KPIs before the Mid-Year Review begins.</p>
                        </div>
                    </div>
                    <div class="px-6 py-5 space-y-4">
                        <!-- Rejection notice (visible to all) -->
                        <div v-if="review.hr_rejected_at" class="flex items-start gap-3 rounded-lg border border-red-200 bg-red-50 p-4 text-sm">
                            <AlertTriangle class="w-4 h-4 text-red-500 mt-0.5 shrink-0" />
                            <div>
                                <p class="font-medium text-red-800">KPIs rejected by HR on {{ formatDate(review.hr_rejected_at) }}</p>
                                <p class="text-red-700 mt-1">{{ review.hr_rejection_reason }}</p>
                                <p class="text-red-600 mt-1 text-xs">Please revise objectives and re-submit agreement.</p>
                            </div>
                        </div>

                        <!-- Awaiting HR approval notice (non-HR) -->
                        <div v-else-if="review.status === 'planning_agreed' && !canManageReview" class="flex items-center gap-2 text-sm text-indigo-700">
                            <Clock class="w-4 h-4" />
                            <span>Awaiting HR approval of agreed KPIs.</span>
                        </div>

                        <!-- HR approve / reject controls -->
                        <div v-if="canManageReview && review.status === 'planning_agreed'" class="flex flex-col gap-3">
                            <p class="text-sm text-gray-700">Review the agreed KPIs above and approve or reject below.</p>
                            <div class="flex gap-3">
                                <Button @click="hrApprove" :disabled="hrApproveForm.processing" class="bg-green-600 hover:bg-green-700 text-white">
                                    {{ hrApproveForm.processing ? 'Approving…' : 'Approve KPIs' }}
                                </Button>
                                <Button variant="outline" class="border-red-300 text-red-600 hover:bg-red-50" @click="showRejectDialog = true">
                                    Reject KPIs
                                </Button>
                            </div>

                            <!-- Reject inline form -->
                            <div v-if="showRejectDialog" class="border border-red-200 rounded-lg p-4 bg-red-50 space-y-3">
                                <p class="text-sm font-medium text-red-800">Rejection Reason <span class="text-red-500">*</span></p>
                                <Textarea v-model="hrRejectForm.reason" placeholder="Explain what needs to be revised…" rows="3" />
                                <p v-if="hrRejectForm.errors.reason" class="text-xs text-red-600">{{ hrRejectForm.errors.reason }}</p>
                                <div class="flex gap-2">
                                    <Button variant="destructive" size="sm" @click="hrReject" :disabled="hrRejectForm.processing || !hrRejectForm.reason.trim()">
                                        {{ hrRejectForm.processing ? 'Rejecting…' : 'Confirm Rejection' }}
                                    </Button>
                                    <Button variant="ghost" size="sm" @click="showRejectDialog = false">Cancel</Button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </template>

            <!-- ═══════════════════════════════════════
                 PHASE 2 — TRACKING
            ═══════════════════════════════════════ -->
            <template v-if="cyclePhase === 'tracking' || review.status === 'tracking'">
                <div class="bg-white border rounded-xl shadow-sm overflow-hidden">
                    <div class="bg-amber-50 border-b px-6 py-4">
                        <h2 class="font-semibold text-amber-900">Mid-Year Review</h2>
                        <p class="text-xs text-amber-700 mt-0.5">Manager tracks progress per objective periodically. Planning Stage objectives are read-only.</p>
                    </div>
                    <div class="px-6 py-4 space-y-6">
                        <div v-for="obj in review.objectives" :key="obj.id" class="border rounded-lg overflow-hidden">
                            <div class="bg-gray-50 px-4 py-3 flex items-start justify-between gap-4">
                                <div class="flex-1 min-w-0">
                                    <div class="flex items-center gap-2 flex-wrap">
                                        <span class="text-xs text-gray-500">{{ obj.bsc_category }}</span>
                                        <span v-if="obj.is_custom" class="text-xs bg-amber-100 text-amber-700 px-1.5 py-0.5 rounded">Custom</span>
                                    </div>
                                    <p class="text-sm font-medium mt-0.5">{{ obj.description }}</p>
                                    <p class="text-xs text-gray-500 mt-0.5">{{ obj.kpi ?? '—' }}</p>
                                    <div class="flex gap-4 mt-1 text-xs text-gray-500">
                                        <span>Wt: <strong>{{ obj.weight }}%</strong></span>
                                        <span>Target: <strong>{{ obj.target ?? '—' }}</strong></span>
                                    </div>
                                </div>
                                <div class="flex items-center gap-2" data-tour="perf-progress-status">
                                    <span v-if="obj.progress_status" :class="['text-xs px-2 py-0.5 rounded-full', trackingStatusColor(obj.progress_status)]">
                                        {{ trackingStatusLabel(obj.progress_status) }}
                                    </span>
                                    <Button v-if="canManageReview || isReviewer" variant="outline" size="sm"
                                        @click="openTrackingForm(obj.id)">
                                        <Plus class="w-3.5 h-3.5 mr-1" /> Add Entry
                                    </Button>
                                </div>
                            </div>

                            <!-- Add tracking entry form -->
                            <div v-if="showTrackingFormForObj === obj.id"
                                class="bg-blue-50 border-t px-4 py-3 grid grid-cols-4 gap-3 items-end">
                                <div>
                                    <label class="text-xs font-medium text-gray-600 mb-1 block">Period</label>
                                    <div class="w-full text-sm border rounded px-2 py-1.5 bg-gray-50 text-gray-500">H1</div>
                                </div>
                                <div>
                                    <label class="text-xs font-medium text-gray-600 mb-1 block">Status</label>
                                    <select v-model="trackingForm.status" class="w-full text-sm border rounded px-2 py-1.5">
                                        <option value="on_track">On Track</option>
                                        <option value="off_track">Off Track</option>
                                        <option value="not_started">Not Started</option>
                                        <option value="not_required">Not Required</option>
                                    </select>
                                </div>
                                <div>
                                    <label class="text-xs font-medium text-gray-600 mb-1 block">Remarks</label>
                                    <input type="text" v-model="trackingForm.remarks" placeholder="Optional remarks…"
                                        class="w-full text-sm border rounded px-2 py-1.5" />
                                </div>
                                <div class="flex gap-2">
                                    <Button size="sm" @click="submitTrackingEntry" :disabled="trackingForm.processing">
                                        {{ trackingForm.processing ? 'Saving…' : 'Save' }}
                                    </Button>
                                    <Button variant="ghost" size="sm" @click="showTrackingFormForObj = null">Cancel</Button>
                                </div>
                            </div>

                            <!-- Tracking history -->
                            <div v-if="obj.tracking_entries && obj.tracking_entries.length > 0" class="border-t divide-y">
                                <div v-for="entry in obj.tracking_entries" :key="entry.id"
                                    class="px-4 py-2 flex items-center gap-4 text-sm hover:bg-gray-50">
                                    <span class="text-xs font-medium text-gray-500 w-10">{{ entry.period }}</span>
                                    <span :class="['text-xs px-2 py-0.5 rounded-full', trackingStatusColor(entry.status)]">
                                        {{ trackingStatusLabel(entry.status) }}
                                    </span>
                                    <span class="flex-1 text-gray-600 text-xs">{{ entry.remarks ?? '—' }}</span>
                                    <span class="text-xs text-gray-400">{{ entry.tracked_by?.name ?? '—' }} · {{ formatDate(entry.created_at) }}</span>
                                    <Button v-if="canManageReview" variant="ghost" size="sm" class="text-red-400 hover:text-red-600 h-6 w-6 p-0"
                                        @click="deleteTrackingEntry(entry.id)">
                                        <Trash2 class="w-3.5 h-3.5" />
                                    </Button>
                                </div>
                            </div>
                            <div v-else class="border-t px-4 py-2 text-xs text-gray-400 italic">No tracking entries yet.</div>
                        </div>
                    </div>
                </div>
            </template>

            <!-- ═══════════════════════════════════════
                 PHASE 3 — RATING
            ═══════════════════════════════════════ -->
            <template v-if="cyclePhase === 'rating' || review.status === 'rating' || review.status === 'finalized'">
                <div class="bg-white border rounded-xl shadow-sm overflow-hidden">
                    <div class="bg-purple-50 border-b px-6 py-4">
                        <h2 class="font-semibold text-purple-900">Final Appraisal</h2>
                        <p class="text-xs text-purple-700 mt-0.5">Employee self-rates and manager scores each objective independently.</p>
                    </div>
                    <div class="px-6 py-4 space-y-4" data-tour="perf-objectives-section">

                        <!-- Rating scale legend -->
                        <div class="grid grid-cols-5 gap-2 text-xs">
                            <div v-for="(label, score) in scoreLabels" :key="score"
                                class="text-center bg-gray-50 border rounded p-1.5">
                                <span class="font-bold text-gray-700 block">{{ score }}</span>
                                <span class="text-gray-500 leading-tight">{{ label.split('—')[0].trim() }}</span>
                            </div>
                        </div>
                        <p class="text-xs text-gray-400">Score formula: (LM Rating ÷ 5) × Weight%</p>

                        <!-- Rating Table -->
                        <div class="overflow-x-auto">
                            <table class="min-w-full text-sm border-collapse">
                                <thead>
                                    <tr class="bg-gray-50 text-xs font-semibold text-gray-600 uppercase tracking-wide">
                                        <th class="border px-3 py-2 text-left">Category</th>
                                        <th class="border px-3 py-2 text-left min-w-40">Objective</th>
                                        <th class="border px-3 py-2 text-left min-w-40">KPI</th>
                                        <th class="border px-3 py-2 text-center w-16">Wt%</th>
                                        <th class="border px-3 py-2 text-left min-w-32">Target</th>
                                        <th class="border px-3 py-2 text-left min-w-32">Yearly Achieved</th>
                                        <th class="border px-3 py-2 text-center w-28">Self Assessment</th>
                                        <th v-if="canManageReview" class="border px-3 py-2 text-center w-28">LM Assessment</th>
                                        <th v-if="canViewScores" class="border px-3 py-2 text-center w-20">Score</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr v-for="(obj, idx) in review.objectives" :key="obj.id"
                                        :class="[obj.is_custom ? 'bg-amber-50' : (idx % 2 === 0 ? 'bg-white' : 'bg-gray-50/50')]">
                                        <td class="border px-3 py-2 text-xs text-gray-500 whitespace-nowrap">{{ obj.bsc_category }}</td>
                                        <td class="border px-3 py-2 text-sm">{{ obj.description }}</td>
                                        <td class="border px-3 py-2 text-xs text-gray-500">{{ obj.kpi ?? '—' }}</td>
                                        <td class="border px-3 py-2 text-center text-sm font-medium">{{ obj.weight }}%</td>
                                        <td class="border px-3 py-2 text-sm">{{ obj.target ?? '—' }}</td>

                                        <!-- Yearly Achieved — editable by employee in rating phase -->
                                        <td class="border px-2 py-1" data-tour="perf-yearly-achieved">
                                            <template v-if="isEmployee && review.status === 'rating' && ratingObjIndex(obj.id) >= 0">
                                                <input type="text"
                                                    v-model="ratingForm.objectives[ratingObjIndex(obj.id)].yearly_achieved"
                                                    class="w-full text-sm border rounded p-1 focus:ring-1 focus:ring-purple-300"
                                                    placeholder="e.g. 95%" />
                                            </template>
                                            <span v-else class="text-sm">{{ obj.yearly_achieved ?? '—' }}</span>
                                        </td>

                                        <!-- Self Rating — editable by employee in rating phase -->
                                        <td class="border px-2 py-1 text-center" data-tour="perf-self-rating">
                                            <template v-if="isEmployee && review.status === 'rating' && ratingObjIndex(obj.id) >= 0">
                                                <select v-model.number="ratingForm.objectives[ratingObjIndex(obj.id)].self_rating"
                                                    class="w-24 text-sm border rounded p-1 focus:ring-1 focus:ring-purple-300">
                                                    <option :value="null">—</option>
                                                    <option v-for="n in [1,2,3,4,5]" :key="n" :value="n">{{ n }}</option>
                                                </select>
                                            </template>
                                            <span v-else :class="obj.self_rating ? 'font-semibold text-blue-700' : 'text-gray-400'">
                                                {{ obj.self_rating ?? '—' }}
                                            </span>
                                        </td>

                                        <!-- LM Rating — editable by manager/admin in rating phase -->
                                        <td v-if="canManageReview" class="border px-2 py-1 text-center">
                                            <template v-if="(isReviewer || canManageReview) && review.status === 'rating' && managerObjIndex(obj.id) >= 0">
                                                <select v-model.number="managerForm.objectives[managerObjIndex(obj.id)].score"
                                                    class="w-24 text-sm border rounded p-1 focus:ring-1 focus:ring-orange-300">
                                                    <option :value="null">—</option>
                                                    <option v-for="n in [1,2,3,4,5]" :key="n" :value="n">{{ n }}</option>
                                                </select>
                                            </template>
                                            <span v-else :class="obj.score ? 'font-semibold text-orange-700' : 'text-gray-400'">
                                                {{ obj.score ? `${obj.score} (${scoreLabels[parseInt(obj.score as string)]?.split('—')[0]?.trim()})` : '—' }}
                                            </span>
                                        </td>

                                        <!-- Score (LM-based) — visible only if canViewScores -->
                                        <td v-if="canViewScores" class="border px-3 py-2 text-center font-semibold text-sm">
                                            {{ canManageReview && managerObjIndex(obj.id) >= 0
                                                ? calcScore(managerForm.objectives[managerObjIndex(obj.id)].score, obj.weight)
                                                : calcScore(obj.score ? parseInt(obj.score as string) : null, obj.weight) }}
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>

                        <!-- Employee self-remark textarea section -->
                        <div v-if="isEmployee && review.status === 'rating'" class="space-y-2" data-tour="perf-employee-comment">
                            <label class="text-sm font-medium">Employee Overall Comment</label>
                            <Textarea v-model="ratingForm.employee_comment" :rows="3"
                                placeholder="Overall comment on your performance this cycle…" />
                        </div>
                        <div v-else-if="review.employee_comment" class="border rounded p-3 bg-gray-50 text-sm">
                            <strong class="block text-xs text-gray-500 mb-1">Employee Comment</strong>
                            {{ review.employee_comment }}
                        </div>

                        <!-- Employee save/submit buttons -->
                        <div v-if="isEmployee && review.status === 'rating'" class="flex gap-3 justify-end" data-tour="perf-submit-btn">
                            <Button variant="outline" @click="saveRatings" :disabled="ratingForm.processing">
                                {{ ratingForm.processing ? 'Saving…' : 'Save Self-Ratings' }}
                            </Button>
                        </div>

                        <!-- Manager review area -->
                        <template v-if="(isReviewer || canManageReview) && review.status === 'rating'">
                            <Separator />
                            <div class="space-y-2">
                                <label class="text-sm font-medium">Manager's Overall Comments</label>
                                <Textarea v-model="managerForm.reviewer_comments" :rows="3"
                                    placeholder="Overall manager comments…" />
                            </div>
                            <div class="flex gap-3 justify-end">
                                <Button variant="outline" @click="saveManagerScores" :disabled="managerForm.processing">
                                    {{ managerForm.processing ? 'Saving…' : 'Save LM Scores' }}
                                </Button>
                                <Button @click="finalizeReview" class="bg-green-600 hover:bg-green-700 text-white">
                                    Finalize Review
                                </Button>
                            </div>
                        </template>

                        <!-- Reviewer comments (read-only for finalized) -->
                        <div v-if="review.reviewer_comments && review.status === 'finalized'" class="border rounded p-3 bg-gray-50 text-sm">
                            <strong class="block text-xs text-gray-500 mb-1">Manager Comments</strong>
                            {{ review.reviewer_comments }}
                        </div>

                        <!-- Overall Score Banner -->
                        <div v-if="canViewScores && overallPercent !== null && review.status === 'finalized'"
                            class="rounded-lg p-4 bg-green-50 border border-green-200 text-center">
                            <p class="text-2xl font-bold text-green-700">{{ overallPercent?.toFixed(1) }}%</p>
                            <p class="text-sm text-green-600">{{ overallGrade(overallPercent!) }}</p>
                        </div>
                    </div>
                </div>
            </template>

            <!-- ═══════════════════════════════════════
                 TRAINING NEEDS (Phase 3 & Finalized)
            ═══════════════════════════════════════ -->
            <div v-if="cyclePhase === 'rating' || review.status === 'rating' || review.status === 'finalized'"
                class="bg-white border rounded-xl shadow-sm overflow-hidden"
                data-tour="perf-training-needs">
                <div class="bg-gray-50 border-b px-6 py-4 flex items-center justify-between">
                    <h2 class="font-semibold">Training Needs</h2>
                    <Button v-if="canManageReview" variant="outline" size="sm" @click="showTrainingForm = !showTrainingForm">
                        <Plus class="w-4 h-4 mr-1" /> Add Training Need
                    </Button>
                </div>

                <!-- Add form -->
                <div v-if="showTrainingForm" class="px-6 py-4 bg-blue-50 border-b grid grid-cols-3 gap-3">
                    <div>
                        <label class="text-xs font-medium mb-1 block">Training Need *</label>
                        <input type="text" v-model="trainingForm.name" class="w-full text-sm border rounded p-1.5" required />
                    </div>
                    <div>
                        <label class="text-xs font-medium mb-1 block">Skill Gap</label>
                        <input type="text" v-model="trainingForm.skill_gap" class="w-full text-sm border rounded p-1.5" />
                    </div>
                    <div>
                        <label class="text-xs font-medium mb-1 block">Type</label>
                        <select v-model="trainingForm.training_type" class="w-full text-sm border rounded p-1.5">
                            <option value="internal">Internal</option>
                            <option value="external">External</option>
                            <option value="online">Online</option>
                            <option value="certification">Certification</option>
                            <option value="workshop">Workshop</option>
                            <option value="mentoring">Mentoring</option>
                            <option value="other">Other</option>
                        </select>
                    </div>
                    <div>
                        <label class="text-xs font-medium mb-1 block">Priority</label>
                        <select v-model="trainingForm.priority" class="w-full text-sm border rounded p-1.5">
                            <option value="low">Low</option>
                            <option value="medium">Medium</option>
                            <option value="high">High</option>
                            <option value="critical">Critical</option>
                        </select>
                    </div>
                    <div>
                        <label class="text-xs font-medium mb-1 block">Target Date</label>
                        <input type="date" v-model="trainingForm.target_date" class="w-full text-sm border rounded p-1.5" />
                    </div>
                    <div>
                        <label class="text-xs font-medium mb-1 block">Notes</label>
                        <input type="text" v-model="trainingForm.notes" class="w-full text-sm border rounded p-1.5" />
                    </div>
                    <div class="col-span-3 flex gap-2 justify-end">
                        <Button size="sm" @click="addTrainingNeed" :disabled="trainingForm.processing">
                            {{ trainingForm.processing ? 'Adding…' : 'Add' }}
                        </Button>
                        <Button variant="ghost" size="sm" @click="showTrainingForm = false">Cancel</Button>
                    </div>
                </div>

                <div class="px-6 py-4">
                    <div v-if="review.training_needs.length === 0" class="text-sm text-gray-400 italic text-center py-4">
                        No training needs recorded yet.
                    </div>
                    <table v-else class="min-w-full text-sm">
                        <thead>
                            <tr class="text-xs font-semibold text-gray-500 uppercase border-b">
                                <th class="py-2 text-left">Training Need</th>
                                <th class="py-2 text-left">Skill Gap</th>
                                <th class="py-2 text-left">Type</th>
                                <th class="py-2 text-left">Priority</th>
                                <th class="py-2 text-left">Target Date</th>
                                <th v-if="canManageReview" class="py-2" />
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="need in review.training_needs" :key="need.id" class="border-b hover:bg-gray-50">
                                <td class="py-2">{{ need.name }}</td>
                                <td class="py-2 text-xs text-gray-500">{{ need.skill_gap ?? '—' }}</td>
                                <td class="py-2 text-xs capitalize">{{ need.training_type }}</td>
                                <td class="py-2">
                                    <span :class="['text-xs px-2 py-0.5 rounded-full', need.priority === 'critical' ? 'bg-red-100 text-red-700' : need.priority === 'high' ? 'bg-orange-100 text-orange-700' : 'bg-gray-100 text-gray-600']">
                                        {{ need.priority }}
                                    </span>
                                </td>
                                <td class="py-2 text-xs text-gray-500">{{ need.target_date ?? '—' }}</td>
                                <td v-if="canManageReview" class="py-2 text-right">
                                    <Button variant="ghost" size="sm" class="text-red-400 hover:text-red-600 h-6 w-6 p-0"
                                        @click="removeTrainingNeed(need.id)">
                                        <Trash2 class="w-3.5 h-3.5" />
                                    </Button>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>

        </div>
    </AppLayout>
</template>
