<?php

namespace App\Http\Controllers\HR;

use App\Http\Controllers\Controller;
use App\Models\Employee;
use App\Models\PerformanceCycle;
use App\Models\PerformanceObjective;
use App\Models\PerformanceReview;
use Illuminate\Http\Request;
use Illuminate\Http\Response as HttpResponse;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Inertia\Response;

class PerformanceReportController extends Controller
{
    public function index(Request $request): Response
    {
        $cycles = PerformanceCycle::select('id', 'name', 'year', 'status')
            ->orderByDesc('year')
            ->get();

        $departments = Employee::select('department')
            ->whereNotNull('department')
            ->distinct()
            ->orderBy('department')
            ->pluck('department');

        $cycleId = $request->input('cycle_id');
        $search = $request->input('search');
        $department = $request->input('department');
        $minScore = $request->filled('min_score') ? (float) $request->input('min_score') : null;
        $maxScore = $request->filled('max_score') ? (float) $request->input('max_score') : null;

        // Default to the latest active cycle, then most recent
        if (! $cycleId) {
            $default = $cycles->firstWhere('status', 'active') ?? $cycles->first();
            $cycleId = $default?->id;
        }

        $cycle = $cycleId ? PerformanceCycle::find($cycleId) : null;

        $summary = $this->buildSummary($cycleId);
        $byDepartment = $this->byDepartment($cycleId);
        $scoreDistribution = $this->scoreDistribution($cycleId);
        $bscBreakdown = $this->bscCategoryBreakdown($cycleId);
        $topPerformers = $this->topPerformers($cycleId, 10);
        $scorecard = $this->scorecard($cycleId, $search, $department, $minScore, $maxScore);

        return Inertia::render('HR/Performance/Reports', [
            'cycles' => $cycles,
            'departments' => $departments,
            'selectedCycle' => $cycle,
            'summary' => $summary,
            'byDepartment' => $byDepartment,
            'scoreDistribution' => $scoreDistribution,
            'bscBreakdown' => $bscBreakdown,
            'topPerformers' => $topPerformers,
            'scorecard' => $scorecard,
            'filters' => [
                'cycle_id' => $cycleId,
                'search' => $search,
                'department' => $department,
                'min_score' => $minScore,
                'max_score' => $maxScore,
            ],
        ]);
    }

    /** Export scorecard as CSV download. */
    public function export(Request $request): HttpResponse
    {
        $cycleId = $request->input('cycle_id');
        $search = $request->input('search');
        $department = $request->input('department');
        $minScore = $request->filled('min_score') ? (float) $request->input('min_score') : null;
        $maxScore = $request->filled('max_score') ? (float) $request->input('max_score') : null;

        $rows = $this->scorecard($cycleId, $search, $department, $minScore, $maxScore);

        $lines = [];
        $lines[] = implode(',', ['#', 'Employee Name', 'Payroll ID', 'Department', 'Position', 'Cycle', 'Score (%)', 'Grade']);

        foreach ($rows as $i => $row) {
            $lines[] = implode(',', [
                $i + 1,
                '"'.str_replace('"', '""', $row['name'] ?? '').'"',
                '"'.str_replace('"', '""', $row['payroll_id'] ?? '').'"',
                '"'.str_replace('"', '""', $row['department'] ?? '').'"',
                '"'.str_replace('"', '""', $row['position'] ?? '').'"',
                '"'.str_replace('"', '""', $row['cycle'] ?? '').'"',
                number_format($row['overall_score'], 1),
                $row['grade'],
            ]);
        }

        $csv = implode("\n", $lines);
        $filename = 'appraisal-scorecard-'.now()->format('Y-m-d').'.csv';

        return response($csv, 200, [
            'Content-Type' => 'text/csv',
            'Content-Disposition' => "attachment; filename=\"{$filename}\"",
        ]);
    }

    /** @return array{total: int, assigned: int, draft: int, planning_agreed: int, tracking: int, rating: int, finalized: int, avg_score: float|null, completion_rate: float} */
    private function buildSummary(?int $cycleId): array
    {
        $total = Employee::where('is_active', true)->count();

        $query = PerformanceReview::query();

        if ($cycleId) {
            $query->where('cycle_id', $cycleId);
        }

        $assigned = $query->count();
        $byStatus = (clone $query)->select('status', DB::raw('count(*) as cnt'))
            ->groupBy('status')
            ->pluck('cnt', 'status')
            ->toArray();

        $finalized = $byStatus['finalized'] ?? 0;
        $avgScore = (clone $query)->where('status', 'finalized')
            ->whereNotNull('overall_score')
            ->avg('overall_score');

        return [
            'total_employees' => $total,
            'assigned' => $assigned,
            'draft' => $byStatus['draft'] ?? 0,
            'planning_agreed' => $byStatus['planning_agreed'] ?? 0,
            'tracking' => $byStatus['tracking'] ?? 0,
            'rating' => $byStatus['rating'] ?? 0,
            'finalized' => $finalized,
            'avg_score' => $avgScore ? round((float) $avgScore, 2) : null,
            'completion_rate' => $assigned > 0 ? round($finalized / $assigned * 100, 1) : 0,
        ];
    }

    /**
     * Individual employee scorecard with grades for finalized reviews.
     *
     * @return array<int, array{employee_id: int, name: string, payroll_id: string|null, department: string|null, position: string|null, cycle: string, overall_score: float, grade: string}>
     */
    private function scorecard(?int $cycleId, ?string $search = null, ?string $department = null, ?float $minScore = null, ?float $maxScore = null): array
    {
        $query = PerformanceReview::query()
            ->join('employees', 'employees.id', '=', 'performance_reviews.employee_id')
            ->leftJoin('hr_profiles', 'hr_profiles.employee_id', '=', 'performance_reviews.employee_id')
            ->join('performance_cycles', 'performance_cycles.id', '=', 'performance_reviews.cycle_id')
            ->select(
                'performance_reviews.employee_id',
                'performance_reviews.overall_score',
                'employees.name',
                'employees.department',
                'employees.position',
                'hr_profiles.payroll_id',
                'performance_cycles.name as cycle_name',
            )
            ->where('performance_reviews.status', 'finalized')
            ->whereNotNull('performance_reviews.overall_score')
            ->orderByDesc('performance_reviews.overall_score');

        if ($cycleId) {
            $query->where('performance_reviews.cycle_id', $cycleId);
        }

        if ($search) {
            $query->where(function ($q) use ($search) {
                $q->where('employees.name', 'like', "%{$search}%")
                    ->orWhere('hr_profiles.payroll_id', 'like', "%{$search}%");
            });
        }

        if ($department) {
            $query->where('employees.department', $department);
        }

        if ($minScore !== null) {
            $query->where('performance_reviews.overall_score', '>=', $minScore);
        }

        if ($maxScore !== null) {
            $query->where('performance_reviews.overall_score', '<=', $maxScore);
        }

        return $query->get()->map(function ($r) {
            $score = (float) $r->overall_score;

            if ($score >= 95) {
                $grade = 'A';
            } elseif ($score >= 85) {
                $grade = 'B';
            } elseif ($score >= 70) {
                $grade = 'C';
            } elseif ($score >= 50) {
                $grade = 'D';
            } else {
                $grade = 'E';
            }

            return [
                'employee_id' => $r->employee_id,
                'name' => $r->name,
                'payroll_id' => $r->payroll_id,
                'department' => $r->department,
                'position' => $r->position,
                'cycle' => $r->cycle_name,
                'overall_score' => $score,
                'grade' => $grade,
            ];
        })->values()->toArray();
    }

    /**
     * @return array<int, array{department: string, total: int, assigned: int, finalized: int, avg_score: float|null, completion_rate: float}>
     */
    private function byDepartment(?int $cycleId): array
    {
        $query = PerformanceReview::query()
            ->join('employees', 'employees.id', '=', 'performance_reviews.employee_id')
            ->select(
                'employees.department',
                DB::raw('count(*) as assigned'),
                DB::raw("sum(case when performance_reviews.status = 'finalized' then 1 else 0 end) as finalized"),
                DB::raw("avg(case when performance_reviews.status = 'finalized' then performance_reviews.overall_score else null end) as avg_score")
            )
            ->whereNotNull('employees.department')
            ->groupBy('employees.department')
            ->orderBy('employees.department');

        if ($cycleId) {
            $query->where('performance_reviews.cycle_id', $cycleId);
        }

        return $query->get()->map(function ($row) {
            $finalized = (int) $row->finalized;
            $assigned = (int) $row->assigned;

            return [
                'department' => $row->department,
                'assigned' => $assigned,
                'finalized' => $finalized,
                'avg_score' => $row->avg_score ? round((float) $row->avg_score, 2) : null,
                'completion_rate' => $assigned > 0 ? round($finalized / $assigned * 100, 1) : 0.0,
            ];
        })->values()->toArray();
    }

    /**
     * Score distribution bands: A (>= 95), B (85-94), C (70-84), D (50-69), E (< 50)
     *
     * @return array<int, array{label: string, min: int, max: int, count: int, pct: float}>
     */
    private function scoreDistribution(?int $cycleId): array
    {
        $query = PerformanceReview::where('status', 'finalized')
            ->whereNotNull('overall_score');

        if ($cycleId) {
            $query->where('cycle_id', $cycleId);
        }

        $scores = $query->pluck('overall_score')->map(fn ($s) => (float) $s);
        $total = $scores->count();

        $bands = [
            ['label' => 'A — Exceptional (95%+)', 'min' => 95, 'max' => 100],
            ['label' => 'B — Exceeds Expectations (85–94%)', 'min' => 85, 'max' => 94],
            ['label' => 'C — Meets Expectations (70–84%)', 'min' => 70, 'max' => 84],
            ['label' => 'D — Improvement Needed (50–69%)', 'min' => 50, 'max' => 69],
            ['label' => 'E — Performance Improvement Plan (< 50%)', 'min' => 0, 'max' => 49],
        ];

        return array_map(function ($band) use ($scores, $total) {
            $count = $scores->filter(fn ($s) => $s >= $band['min'] && $s <= $band['max'])->count();

            return array_merge($band, [
                'count' => $count,
                'pct' => $total > 0 ? round($count / $total * 100, 1) : 0.0,
            ]);
        }, $bands);
    }

    /**
     * @return array<int, array{category: string, avg_score: float|null, count: int}>
     */
    private function bscCategoryBreakdown(?int $cycleId): array
    {
        $query = PerformanceObjective::query()
            ->join('performance_reviews', 'performance_reviews.id', '=', 'performance_objectives.review_id')
            ->select(
                'performance_objectives.bsc_category',
                DB::raw('avg(performance_objectives.score) as avg_score'),
                DB::raw('count(performance_objectives.score) as count')
            )
            ->whereNotNull('performance_objectives.score')
            ->whereNotNull('performance_objectives.bsc_category')
            ->groupBy('performance_objectives.bsc_category')
            ->orderBy('performance_objectives.bsc_category');

        if ($cycleId) {
            $query->where('performance_reviews.cycle_id', $cycleId);
        }

        return $query->get()->map(fn ($row) => [
            'category' => $row->bsc_category,
            'avg_score' => $row->avg_score ? round((float) $row->avg_score, 2) : null,
            'count' => (int) $row->count,
        ])->values()->toArray();
    }

    /**
     * @return array<int, array{employee_id: int, name: string, department: string|null, overall_score: float, status: string}>
     */
    private function topPerformers(?int $cycleId, int $limit): array
    {
        $query = PerformanceReview::with('employee:id,name,department,position')
            ->where('status', 'finalized')
            ->whereNotNull('overall_score')
            ->orderByDesc('overall_score')
            ->limit($limit);

        if ($cycleId) {
            $query->where('cycle_id', $cycleId);
        }

        return $query->get()->map(fn ($r) => [
            'employee_id' => $r->employee_id,
            'name' => $r->employee?->name,
            'department' => $r->employee?->department,
            'position' => $r->employee?->position,
            'overall_score' => (float) $r->overall_score,
            'status' => $r->status,
        ])->toArray();
    }
}
