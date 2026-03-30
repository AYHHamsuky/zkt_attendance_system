<?php

namespace App\Http\Controllers\HR;

use App\Http\Controllers\Controller;
use App\Models\Employee;
use App\Models\PerformanceTemplate;
use App\Models\PerformanceTemplateItem;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;
use Symfony\Component\HttpFoundation\StreamedResponse;

class PerformanceTemplateController extends Controller
{
    // ── Template Management ────────────────────────────────────────────────

    public function index(): Response
    {
        $templates = PerformanceTemplate::withCount('items')
            ->with('createdBy:id,name', 'employee:id,name')
            ->orderBy('is_active', 'desc')
            ->orderBy('name')
            ->get()
            ->map(fn (PerformanceTemplate $t) => [
                'id' => $t->id,
                'name' => $t->name,
                'position' => $t->position,
                'employee_id' => $t->employee_id,
                'employee_name' => $t->employee?->name,
                'description' => $t->description,
                'is_active' => $t->is_active,
                'items_count' => $t->items_count,
                'total_weight' => $t->totalWeight(),
                'created_by' => $t->createdBy?->name,
                'created_at' => $t->created_at?->format('d/m/Y'),
            ]);

        $positions = Employee::select('position')->whereNotNull('position')
            ->distinct()->orderBy('position')->pluck('position');

        return Inertia::render('HR/Performance/Templates/Index', [
            'templates' => $templates,
            'positions' => $positions,
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'name' => 'required|string|max:200',
            'position' => 'nullable|string|max:200',
            'description' => 'nullable|string|max:1000',
        ]);

        $template = PerformanceTemplate::create([
            ...$validated,
            'is_active' => true,
            'created_by' => auth()->id(),
        ]);

        return redirect()->route('hr.performance.templates.show', $template)
            ->with('success', 'Template created. Now add objectives below.');
    }

    public function show(PerformanceTemplate $template): Response
    {
        $template->load(['items', 'createdBy:id,name']);

        $bscCategories = ['Financials', 'Customers', 'Internal Process', 'Learning & Growth', 'Core Values'];

        return Inertia::render('HR/Performance/Templates/Show', [
            'template' => [
                'id' => $template->id,
                'name' => $template->name,
                'position' => $template->position,
                'description' => $template->description,
                'is_active' => $template->is_active,
                'total_weight' => $template->totalWeight(),
                'created_by' => $template->createdBy?->name,
            ],
            'items' => $template->items->map(fn (PerformanceTemplateItem $item) => [
                'id' => $item->id,
                'bsc_category' => $item->bsc_category,
                'serial' => $item->serial,
                'objective' => $item->objective,
                'kpi' => $item->kpi,
                'weight' => $item->weight,
                'target' => $item->target,
                'sort_order' => $item->sort_order,
            ]),
            'bsc_categories' => $bscCategories,
            'score_labels' => PerformanceReviewController::SCORE_LABELS,
        ]);
    }

    public function update(Request $request, PerformanceTemplate $template): RedirectResponse
    {
        $validated = $request->validate([
            'name' => 'required|string|max:200',
            'position' => 'nullable|string|max:200',
            'description' => 'nullable|string|max:1000',
            'is_active' => 'boolean',
        ]);

        $template->update($validated);

        return back()->with('success', 'Template updated.');
    }

    public function destroy(PerformanceTemplate $template): RedirectResponse
    {
        $template->delete();

        return redirect()->route('hr.performance.templates.index')
            ->with('success', 'Template deleted.');
    }

    // ── Template Items ─────────────────────────────────────────────────────

    public function storeItem(Request $request, PerformanceTemplate $template): RedirectResponse
    {
        $validated = $request->validate([
            'bsc_category' => 'required|string|max:100',
            'serial' => 'required|integer|min:1',
            'objective' => 'required|string|max:500',
            'kpi' => 'nullable|string|max:500',
            'weight' => 'required|numeric|min:0|max:100',
            'target' => 'nullable|string|max:200',
        ]);

        $maxOrder = $template->items()->max('sort_order') ?? 0;
        $template->items()->create(array_merge($validated, ['sort_order' => $maxOrder + 1]));

        return back()->with('success', 'Objective added.');
    }

    public function updateItem(Request $request, PerformanceTemplate $template, PerformanceTemplateItem $item): RedirectResponse
    {
        abort_if($item->template_id !== $template->id, 404);

        $validated = $request->validate([
            'bsc_category' => 'required|string|max:100',
            'serial' => 'required|integer|min:1',
            'objective' => 'required|string|max:500',
            'kpi' => 'nullable|string|max:500',
            'weight' => 'required|numeric|min:0|max:100',
            'target' => 'nullable|string|max:200',
        ]);

        $item->update($validated);

        return back()->with('success', 'Objective updated.');
    }

    public function destroyItem(PerformanceTemplate $template, PerformanceTemplateItem $item): RedirectResponse
    {
        abort_if($item->template_id !== $template->id, 404);
        $item->delete();

        return back()->with('success', 'Objective removed.');
    }

    // ── CSV Downloads ──────────────────────────────────────────────────────

    public function downloadSample(): StreamedResponse
    {
        $path = storage_path('app/public/performance-templates/sample.csv');

        return response()->streamDownload(function () use ($path) {
            readfile($path);
        }, 'performance-appraisal-sample.csv', ['Content-Type' => 'text/csv']);
    }

    public function downloadTemplate(): StreamedResponse
    {
        $path = storage_path('app/public/performance-templates/template.csv');

        return response()->streamDownload(function () use ($path) {
            readfile($path);
        }, 'performance-appraisal-template.csv', ['Content-Type' => 'text/csv']);
    }

    public function downloadForEmployee(Request $request, Employee $employee): StreamedResponse
    {
        $employee->load('hrProfile');
        $profile = $employee->hrProfile;

        $displayName = $profile?->title ? $profile->title.' '.$employee->name : $employee->name;

        $tmpl = PerformanceTemplate::where('is_active', true)->where('position', $employee->position)->with('items')->first()
            ?? PerformanceTemplate::where('is_active', true)->whereNull('position')->with('items')->first();
        $items = $tmpl?->items ?? collect();

        $filename = 'performance-template-'.str_replace(' ', '-', strtolower($employee->name)).'.csv';

        return response()->streamDownload(function () use ($displayName, $profile, $employee, $items) {
            $out = fopen('php://output', 'w');
            fputcsv($out, ['', 'Name:', $displayName, '', '', '', '']);
            fputcsv($out, ['', 'Payroll ID:', $profile?->payroll_id ?? '', '', '', '', '']);
            fputcsv($out, ['', 'Job Role:', $employee->position ?? '', '', '', '', '']);
            fputcsv($out, ['', 'Department:', $employee->department ?? '', '', '', '', '']);
            fputcsv($out, ['', 'Unit:', $employee->unit ?? '', '', '', '', '']);
            fputcsv($out, ['', 'Location:', $employee->location ?? '', '', '', '', '']);
            fputcsv($out, ['', 'Official Email:', $employee->email ?? '', '', '', '', '']);
            fputcsv($out, ['BSC', 'S/N', 'Objectives', 'KPIs', 'Weight (%)', 'Target', 'Remark']);
            foreach ($items as $item) {
                fputcsv($out, [$item->bsc_category, $item->serial, $item->objective, $item->kpi ?? '', $item->weight, $item->target ?? '', '']);
            }
            fputcsv($out, ['', '', '', '', '', 'Total Weight: 100%', '']);
            fputcsv($out, ['', '', '', '', '', '', '']);
            fputcsv($out, ["Employee's Comment & Date:", '', '', '', '', '', '']);
            fputcsv($out, ["Line Manager's Comment & Date:", '', '', '', '', '', '']);
            fputcsv($out, ["Employee's Training Needs:", '', '', '', '', '', '']);
            fclose($out);
        }, $filename, ['Content-Type' => 'text/csv']);
    }

    public function downloadBulk(Request $request): StreamedResponse
    {
        $employees = Employee::with('hrProfile')
            ->where('is_active', true)
            ->when($request->filled('department'), fn ($q) => $q->where('department', $request->input('department')))
            ->orderBy('department')->orderBy('name')
            ->get();

        $byPosition = PerformanceTemplate::where('is_active', true)->whereNotNull('position')->with('items')->get()->keyBy('position');
        $genericTmpl = PerformanceTemplate::where('is_active', true)->whereNull('position')->with('items')->first();

        $zipPath = tempnam(sys_get_temp_dir(), 'perf_').'.zip';
        $zip = new \ZipArchive;
        $zip->open($zipPath, \ZipArchive::CREATE | \ZipArchive::OVERWRITE);

        foreach ($employees as $employee) {
            $profile = $employee->hrProfile;
            $displayName = $profile?->title ? $profile->title.' '.$employee->name : $employee->name;
            $items = ($byPosition[$employee->position] ?? $genericTmpl)?->items ?? collect();

            $rows = [];
            $rows[] = $this->csvLine(['', 'Name:', $displayName, '', '', '', '']);
            $rows[] = $this->csvLine(['', 'Payroll ID:', $profile?->payroll_id ?? '', '', '', '', '']);
            $rows[] = $this->csvLine(['', 'Job Role:', $employee->position ?? '', '', '', '', '']);
            $rows[] = $this->csvLine(['', 'Department:', $employee->department ?? '', '', '', '', '']);
            $rows[] = $this->csvLine(['', 'Unit:', $employee->unit ?? '', '', '', '', '']);
            $rows[] = $this->csvLine(['', 'Location:', $employee->location ?? '', '', '', '', '']);
            $rows[] = $this->csvLine(['', 'Official Email:', $employee->email ?? '', '', '', '', '']);
            $rows[] = $this->csvLine(['BSC', 'S/N', 'Objectives', 'KPIs', 'Weight (%)', 'Target', 'Remark']);
            foreach ($items as $item) {
                $rows[] = $this->csvLine([$item->bsc_category, $item->serial, $item->objective, $item->kpi ?? '', $item->weight, $item->target ?? '', '']);
            }
            $rows[] = $this->csvLine(['', '', '', '', '', 'Total Weight: 100%', '']);
            $rows[] = $this->csvLine(['', '', '', '', '', '', '']);
            $rows[] = $this->csvLine(["Employee's Comment & Date:", '', '', '', '', '', '']);
            $rows[] = $this->csvLine(["Line Manager's Comment & Date:", '', '', '', '', '', '']);
            $rows[] = $this->csvLine(["Employee's Training Needs:", '', '', '', '', '', '']);

            $dept = $employee->department ?? 'Unassigned';
            $slug = preg_replace('/[^a-z0-9_-]/', '-', strtolower($employee->name));
            $zip->addFromString("{$dept}/{$slug}.csv", implode("\n", $rows));
        }

        $zip->close();

        return response()->streamDownload(function () use ($zipPath) {
            readfile($zipPath);
            unlink($zipPath);
        }, 'performance-templates-bulk.zip', ['Content-Type' => 'application/zip']);
    }

    private function csvLine(array $row): string
    {
        $escaped = array_map(function (mixed $val): string {
            $val = (string) $val;
            if (str_contains($val, ',') || str_contains($val, '"') || str_contains($val, "\n")) {
                $val = '"'.str_replace('"', '""', $val).'"';
            }

            return $val;
        }, $row);

        return implode(',', $escaped);
    }
}
