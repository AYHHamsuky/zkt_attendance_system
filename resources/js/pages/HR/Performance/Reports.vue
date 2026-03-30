<script setup lang="ts">
import { Head, router } from '@inertiajs/vue3';
import AppLayout from '@/layouts/AppLayout.vue';
import { type BreadcrumbItem } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Users, CheckCircle, BarChart3, Star, TrendingUp, Download, Search } from 'lucide-vue-next';
import { ref } from 'vue';

interface Cycle {
    id: number;
    name: string;
    year: number;
    status: string;
}

interface Summary {
    total_employees: number;
    assigned: number;
    draft: number;
    planning_agreed: number;
    tracking: number;
    rating: number;
    finalized: number;
    avg_score: number | null;
    completion_rate: number;
}

interface ScorecardRow {
    employee_id: number;
    name: string;
    payroll_id: string | null;
    department: string | null;
    position: string | null;
    cycle: string;
    overall_score: number;
    grade: string;
}

interface DeptRow {
    department: string;
    assigned: number;
    finalized: number;
    avg_score: number | null;
    completion_rate: number;
}

interface ScoreBand {
    label: string;
    min: number;
    max: number;
    count: number;
    pct: number;
}

interface BscRow {
    category: string;
    avg_score: number | null;
    count: number;
}

interface TopPerformer {
    employee_id: number;
    name: string;
    department: string | null;
    position: string | null;
    overall_score: number;
}

const props = defineProps<{
    cycles: Cycle[];
    departments: string[];
    selectedCycle: Cycle | null;
    summary: Summary;
    byDepartment: DeptRow[];
    scoreDistribution: ScoreBand[];
    bscBreakdown: BscRow[];
    topPerformers: TopPerformer[];
    scorecard: ScorecardRow[];
    filters: { cycle_id: number | null; search: string | null; department: string | null; min_score: number | null; max_score: number | null };
}>();

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'HR Management', href: '/hr' },
    { title: 'Performance', href: '/hr/performance/cycles' },
    { title: 'Reports & Analysis' },
];

const searchQuery = ref(props.filters.search ?? '');
const departmentFilter = ref(props.filters.department ?? '_all');
const minScore = ref(props.filters.min_score !== null ? String(props.filters.min_score) : '');
const maxScore = ref(props.filters.max_score !== null ? String(props.filters.max_score) : '');
const selectedCycleId = ref(props.filters.cycle_id ? String(props.filters.cycle_id) : '_all');

function applyFilters() {
    const params: Record<string, string> = {};
    if (selectedCycleId.value && selectedCycleId.value !== '_all') {
        params.cycle_id = selectedCycleId.value;
    }
    if (searchQuery.value) { params.search = searchQuery.value; }
    if (departmentFilter.value && departmentFilter.value !== '_all') { params.department = departmentFilter.value; }
    if (minScore.value) { params.min_score = minScore.value; }
    if (maxScore.value) { params.max_score = maxScore.value; }
    router.get('/hr/performance/reports', params, { preserveState: true });
}

function changeCycle(val: string) {
    selectedCycleId.value = val;
    applyFilters();
}

function buildExportUrl(): string {
    const params = new URLSearchParams();
    if (selectedCycleId.value && selectedCycleId.value !== '_all') {
        params.set('cycle_id', selectedCycleId.value);
    }
    if (searchQuery.value) { params.set('search', searchQuery.value); }
    if (departmentFilter.value && departmentFilter.value !== '_all') { params.set('department', departmentFilter.value); }
    if (minScore.value) { params.set('min_score', minScore.value); }
    if (maxScore.value) { params.set('max_score', maxScore.value); }
    const qs = params.toString();
    return '/hr/performance/reports/export' + (qs ? '?' + qs : '');
}

function scoreColor(score: number | null): string {
    if (score === null) return 'text-muted-foreground';
    if (score >= 95) return 'text-green-600 dark:text-green-400';
    if (score >= 85) return 'text-blue-600 dark:text-blue-400';
    if (score >= 70) return 'text-yellow-600 dark:text-yellow-500';
    if (score >= 50) return 'text-orange-600 dark:text-orange-400';
    return 'text-red-600 dark:text-red-400';
}

function bandColor(label: string): string {
    if (label.startsWith('A')) return 'bg-green-500';
    if (label.startsWith('B')) return 'bg-blue-500';
    if (label.startsWith('C')) return 'bg-yellow-400';
    if (label.startsWith('D')) return 'bg-orange-400';
    return 'bg-red-400';
}

function completionBarColor(rate: number): string {
    if (rate >= 80) return 'bg-green-500';
    if (rate >= 50) return 'bg-blue-500';
    if (rate >= 25) return 'bg-yellow-400';
    return 'bg-red-400';
}

const statusFlow = ['draft', 'planning_agreed', 'tracking', 'rating', 'finalized'] as const;
const statusFlowLabels: Record<string, string> = {
    draft: 'Planning', planning_agreed: 'Agreed', tracking: 'Tracking', rating: 'Rating', finalized: 'Finalized',
};

function gradeColor(grade: string): string {
    const map: Record<string, string> = { A: 'text-green-600 font-bold', B: 'text-blue-600 font-bold', C: 'text-yellow-600 font-semibold', D: 'text-orange-600', E: 'text-red-600 font-semibold' };
    return map[grade] ?? '';
}
</script>

<template>
    <Head title="Performance Reports" />
    <AppLayout :breadcrumbs="breadcrumbs">
        <div class="flex h-full flex-1 flex-col gap-6 p-4 md:p-6">

            <!-- Header -->
            <div class="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h2 class="text-2xl font-bold">Performance Reports & Analysis</h2>
                    <p class="text-muted-foreground">
                        {{ selectedCycle ? selectedCycle.name : 'All cycles' }} · org-wide appraisal analytics
                    </p>
                </div>
                <div class="w-full sm:w-64">
                    <Select
                        :model-value="filters.cycle_id ? String(filters.cycle_id) : '_all'"
                        @update:model-value="changeCycle"
                    >
                        <SelectTrigger>
                            <SelectValue placeholder="Select cycle" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="_all">All Cycles</SelectItem>
                            <SelectItem v-for="c in cycles" :key="c.id" :value="String(c.id)">
                                {{ c.name }} · {{ c.year }}
                            </SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </div>

            <!-- Summary Cards -->
            <div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <Card>
                    <CardContent class="pt-6">
                        <div class="flex items-center gap-3">
                            <div class="rounded-lg bg-blue-100 p-2 dark:bg-blue-900/30">
                                <Users class="h-5 w-5 text-blue-600 dark:text-blue-400" />
                            </div>
                            <div>
                                <p class="text-2xl font-bold">{{ summary.assigned }}</p>
                                <p class="text-sm text-muted-foreground">Reviews Assigned</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent class="pt-6">
                        <div class="flex items-center gap-3">
                            <div class="rounded-lg bg-green-100 p-2 dark:bg-green-900/30">
                                <CheckCircle class="h-5 w-5 text-green-600 dark:text-green-400" />
                            </div>
                            <div>
                                <p class="text-2xl font-bold">{{ summary.finalized }}</p>
                                <p class="text-sm text-muted-foreground">Finalized</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent class="pt-6">
                        <div class="flex items-center gap-3">
                            <div class="rounded-lg bg-purple-100 p-2 dark:bg-purple-900/30">
                                <TrendingUp class="h-5 w-5 text-purple-600 dark:text-purple-400" />
                            </div>
                            <div>
                                <p class="text-2xl font-bold">{{ summary.completion_rate }}%</p>
                                <p class="text-sm text-muted-foreground">Completion Rate</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent class="pt-6">
                        <div class="flex items-center gap-3">
                            <div class="rounded-lg bg-yellow-100 p-2 dark:bg-yellow-900/30">
                                <Star class="h-5 w-5 text-yellow-600 dark:text-yellow-400" />
                            </div>
                            <div>
                                <p class="text-2xl font-bold" :class="scoreColor(summary.avg_score)">
                                    {{ summary.avg_score !== null ? summary.avg_score.toFixed(1) : '—' }}
                                </p>
                                <p class="text-sm text-muted-foreground">Avg Score (0–100)</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            <!-- Progress pipeline -->
            <Card>
                <CardHeader class="pb-2">
                    <CardTitle class="text-base">Review Pipeline (3-Phase)</CardTitle>
                </CardHeader>
                <CardContent>
                    <div class="grid grid-cols-2 gap-3 sm:grid-cols-5">
                        <div v-for="s in statusFlow" :key="s" class="rounded-lg border p-3 text-center">
                            <p class="text-2xl font-bold">{{ (summary as any)[s] ?? 0 }}</p>
                            <p class="mt-1 text-xs text-muted-foreground">{{ statusFlowLabels[s] }}</p>
                        </div>
                    </div>
                </CardContent>
            </Card>

            <div class="grid gap-6 lg:grid-cols-2">
                <!-- Score Distribution -->
                <Card>
                    <CardHeader class="pb-2">
                        <CardTitle class="flex items-center gap-2 text-base">
                            <BarChart3 class="h-4 w-4 text-primary" />
                            Score Distribution
                        </CardTitle>
                    </CardHeader>
                    <CardContent class="space-y-3">
                        <div v-if="scoreDistribution.every(b => b.count === 0)" class="py-8 text-center text-sm text-muted-foreground">
                            No finalized reviews yet.
                        </div>
                        <template v-else>
                            <div v-for="band in scoreDistribution" :key="band.label" class="space-y-1">
                                <div class="flex items-center justify-between text-sm">
                                    <span>{{ band.label }}</span>
                                    <span class="font-medium">{{ band.count }} <span class="text-muted-foreground">({{ band.pct }}%)</span></span>
                                </div>
                                <div class="h-2 w-full rounded-full bg-muted">
                                    <div
                                        class="h-2 rounded-full transition-all"
                                        :class="bandColor(band.label)"
                                        :style="{ width: band.pct + '%' }"
                                    />
                                </div>
                            </div>
                        </template>
                    </CardContent>
                </Card>

                <!-- BSC Category Breakdown -->
                <Card>
                    <CardHeader class="pb-2">
                        <CardTitle class="flex items-center gap-2 text-base">
                            <Star class="h-4 w-4 text-primary" />
                            BSC Category Avg Score (1–5)
                        </CardTitle>
                    </CardHeader>
                    <CardContent class="space-y-3">
                        <div v-if="bscBreakdown.length === 0" class="py-8 text-center text-sm text-muted-foreground">
                            No scored objectives yet.
                        </div>
                        <template v-else>
                            <div v-for="cat in bscBreakdown" :key="cat.category" class="flex items-center gap-3">
                                <div class="w-36 shrink-0 text-sm font-medium truncate">{{ cat.category }}</div>
                                <div class="flex-1">
                                    <div class="h-2 w-full rounded-full bg-muted">
                                        <div
                                            class="h-2 rounded-full bg-primary transition-all"
                                            :style="{ width: (cat.avg_score ? cat.avg_score / 5 * 100 : 0) + '%' }"
                                        />
                                    </div>
                                </div>
                                <div class="w-16 text-right text-sm" :class="scoreColor(cat.avg_score ? cat.avg_score * 20 : null)">
                                    {{ cat.avg_score !== null ? cat.avg_score.toFixed(2) : '—' }}
                                </div>
                                <div class="w-12 text-right text-xs text-muted-foreground">
                                    n={{ cat.count }}
                                </div>
                            </div>
                        </template>
                    </CardContent>
                </Card>
            </div>

            <!-- Department Table -->
            <Card>
                <CardHeader class="pb-2">
                    <CardTitle class="text-base">Completion by Department</CardTitle>
                </CardHeader>
                <CardContent>
                    <div v-if="byDepartment.length === 0" class="py-10 text-center text-sm text-muted-foreground">
                        No data available for this cycle.
                    </div>
                    <div v-else class="overflow-x-auto">
                        <table class="w-full text-sm">
                            <thead>
                                <tr class="border-b text-left text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                                    <th class="pb-2 pr-4">Department</th>
                                    <th class="pb-2 pr-4 text-right">Assigned</th>
                                    <th class="pb-2 pr-4 text-right">Finalized</th>
                                    <th class="pb-2 pr-4 text-right">Avg Score</th>
                                    <th class="pb-2">Completion</th>
                                </tr>
                            </thead>
                            <tbody class="divide-y">
                                <tr v-for="row in byDepartment" :key="row.department" class="hover:bg-muted/40">
                                    <td class="py-2 pr-4 font-medium">{{ row.department }}</td>
                                    <td class="py-2 pr-4 text-right text-muted-foreground">{{ row.assigned }}</td>
                                    <td class="py-2 pr-4 text-right">{{ row.finalized }}</td>
                                    <td class="py-2 pr-4 text-right font-medium" :class="scoreColor(row.avg_score)">
                                        {{ row.avg_score !== null ? row.avg_score.toFixed(1) : '—' }}
                                    </td>
                                    <td class="py-2">
                                        <div class="flex items-center gap-2">
                                            <div class="h-2 w-28 rounded-full bg-muted">
                                                <div
                                                    class="h-2 rounded-full transition-all"
                                                    :class="completionBarColor(row.completion_rate)"
                                                    :style="{ width: row.completion_rate + '%' }"
                                                />
                                            </div>
                                            <span class="text-xs text-muted-foreground">{{ row.completion_rate }}%</span>
                                        </div>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </CardContent>
            </Card>

            <!-- Top Performers -->
            <Card>
                <CardHeader class="pb-2">
                    <CardTitle class="flex items-center gap-2 text-base">
                        <TrendingUp class="h-4 w-4 text-primary" />
                        Top Performers
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div v-if="topPerformers.length === 0" class="py-10 text-center text-sm text-muted-foreground">
                        No finalized reviews yet.
                    </div>
                    <div v-else class="space-y-2">
                        <div
                            v-for="(p, idx) in topPerformers"
                            :key="p.employee_id"
                            class="flex items-center gap-3 rounded-lg border px-3 py-2"
                        >
                            <div class="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary">
                                {{ idx + 1 }}
                            </div>
                            <div class="flex-1 min-w-0">
                                <p class="truncate font-medium text-sm">{{ p.name }}</p>
                                <p class="truncate text-xs text-muted-foreground">{{ p.department ?? '—' }} · {{ p.position ?? '—' }}</p>
                            </div>
                            <Badge
                                :variant="p.overall_score >= 80 ? 'default' : p.overall_score >= 60 ? 'secondary' : 'outline'"
                                class="shrink-0 font-mono"
                            >
                                {{ p.overall_score.toFixed(1) }}
                            </Badge>
                        </div>
                    </div>
                </CardContent>
            </Card>

            <!-- Employee Scorecard Table -->
            <Card>
                <CardHeader class="pb-3">
                    <div class="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                        <CardTitle class="flex items-center gap-2 text-base">
                            <Star class="h-4 w-4 text-primary" />
                            Employee Scorecard (Finalized Reviews)
                        </CardTitle>
                        <a
                            :href="buildExportUrl()"
                            class="inline-flex items-center gap-1.5 rounded-md border border-border bg-background px-3 py-1.5 text-sm font-medium shadow-sm hover:bg-muted transition-colors"
                        >
                            <Download class="h-4 w-4" />
                            Export CSV
                        </a>
                    </div>
                    <!-- Search & Score Filters -->
                    <div class="flex flex-col gap-2 sm:flex-row sm:items-center mt-2">
                        <div class="relative flex-1">
                            <Search class="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                            <Input
                                v-model="searchQuery"
                                placeholder="Search by name or payroll ID..."
                                class="pl-8"
                                @keyup.enter="applyFilters"
                            />
                        </div>
                        <Select :model-value="departmentFilter" @update:model-value="v => departmentFilter = String(v)">
                            <SelectTrigger class="w-48">
                                <SelectValue placeholder="All Departments" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="_all">All Departments</SelectItem>
                                <SelectItem v-for="dept in departments" :key="dept" :value="dept">
                                    {{ dept }}
                                </SelectItem>
                            </SelectContent>
                        </Select>
                        <div class="flex items-center gap-2 shrink-0">
                            <Input
                                v-model="minScore"
                                type="number"
                                placeholder="Min %"
                                class="w-24"
                                min="0"
                                max="100"
                                @keyup.enter="applyFilters"
                            />
                            <span class="text-muted-foreground text-sm">–</span>
                            <Input
                                v-model="maxScore"
                                type="number"
                                placeholder="Max %"
                                class="w-24"
                                min="0"
                                max="100"
                                @keyup.enter="applyFilters"
                            />
                            <button
                                type="button"
                                class="inline-flex items-center gap-1 rounded-md bg-primary px-3 py-1.5 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors"
                                @click="applyFilters"
                            >
                                <Search class="h-3.5 w-3.5" />
                                Filter
                            </button>
                        </div>
                    </div>
                </CardHeader>
                <CardContent>
                    <div v-if="scorecard.length === 0" class="py-10 text-center text-sm text-muted-foreground">
                        No finalized reviews match your filters.
                    </div>
                    <div v-else class="overflow-x-auto">
                        <table class="w-full text-sm">
                            <thead>
                                <tr class="border-b text-left text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                                    <th class="pb-2 pr-4">#</th>
                                    <th class="pb-2 pr-4">Employee</th>
                                    <th class="pb-2 pr-3">Payroll ID</th>
                                    <th class="pb-2 pr-4">Department</th>
                                    <th class="pb-2 pr-4">Position</th>
                                    <th v-if="!filters.cycle_id" class="pb-2 pr-4">Cycle</th>
                                    <th class="pb-2 pr-4 text-right">Score</th>
                                    <th class="pb-2 text-center">Grade</th>
                                </tr>
                            </thead>
                            <tbody class="divide-y">
                                <tr v-for="(row, idx) in scorecard" :key="row.employee_id + '-' + row.cycle" class="hover:bg-muted/40">
                                    <td class="py-2 pr-4 text-muted-foreground text-xs">{{ idx + 1 }}</td>
                                    <td class="py-2 pr-4 font-medium">{{ row.name }}</td>
                                    <td class="py-2 pr-3 text-muted-foreground text-xs font-mono">{{ row.payroll_id ?? '—' }}</td>
                                    <td class="py-2 pr-4 text-muted-foreground text-xs">{{ row.department ?? '—' }}</td>
                                    <td class="py-2 pr-4 text-muted-foreground text-xs">{{ row.position ?? '—' }}</td>
                                    <td v-if="!filters.cycle_id" class="py-2 pr-4 text-muted-foreground text-xs">{{ row.cycle }}</td>
                                    <td class="py-2 pr-4 text-right font-mono" :class="scoreColor(row.overall_score)">
                                        {{ row.overall_score.toFixed(1) }}%
                                    </td>
                                    <td class="py-2 text-center">
                                        <span :class="['text-sm', gradeColor(row.grade)]">{{ row.grade }}</span>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </CardContent>
            </Card>

        </div>
    </AppLayout>
</template>
