<?php

namespace App\Http\Controllers\HR;

use App\Http\Controllers\Controller;
use App\Models\Employee;
use App\Models\HrProfile;
use Carbon\Carbon;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Inertia\Response;

class NominalRollController extends Controller
{
    public function index(Request $request): Response|RedirectResponse
    {
        // Regular users see only their own profile
        $user = auth()->user();
        if (! $user->isAdmin() && $user->role !== 'hr') {
            $employee = $user->employee;
            if ($employee) {
                return redirect()->route('hr.nominal-roll.show', $employee);
            }
            // No linked employee record — show empty state rather than full list
            abort(403, 'Your account is not linked to an employee record.');
        }

        $query = Employee::with('hrProfile')->where('is_active', true);

        if ($request->filled('search')) {
            $search = $request->input('search');
            // Scout searches name, user_id, email, department, position, location, region
            $scoutIds = Employee::search($search)->keys();
            // Separately search payroll_id in HrProfile (Scout DB engine can't cross tables)
            $profileIds = HrProfile::where('payroll_id', 'like', "%{$search}%")->pluck('employee_id');
            $matchingIds = $scoutIds->merge($profileIds)->unique()->values();
            $query->whereIn('id', $matchingIds);
        }

        if ($request->filled('department')) {
            $query->where('department', $request->input('department'));
        }

        if ($request->filled('location')) {
            $query->where('location', $request->input('location'));
        }

        if ($request->filled('profile')) {
            if ($request->input('profile') === 'complete') {
                $query->whereHas('hrProfile');
            } else {
                $query->whereDoesntHave('hrProfile');
            }
        }

        $departments = Employee::select('department')->whereNotNull('department')->distinct()->orderBy('department')->pluck('department');
        $locations = Employee::select('location')->whereNotNull('location')->distinct()->orderBy('location')->pluck('location');

        // Department summary for the card view
        $departmentSummary = Employee::where('is_active', true)
            ->whereNotNull('department')
            ->selectRaw('department, count(*) as total')
            ->groupBy('department')
            ->orderBy('department')
            ->get();

        $employees = $query->orderBy('name')->paginate(80)->withQueryString();
        $employees->through(fn ($e) => array_merge($e->toArray(), [
            'photo_url' => $e->photo_path ? Storage::url($e->photo_path) : null,
        ]));

        return Inertia::render('HR/NominalRoll/Index', [
            'employees' => $employees,
            'departments' => $departments,
            'locations' => $locations,
            'departmentSummary' => $departmentSummary,
            'filters' => $request->only(['search', 'department', 'location', 'profile', 'view']),
        ]);
    }

    public function create(): Response
    {
        abort_unless(auth()->user()->isAdmin() || auth()->user()->role === 'hr', 403);
        $departments = Employee::select('department')->whereNotNull('department')->distinct()->orderBy('department')->pluck('department');
        $locations = Employee::select('location')->whereNotNull('location')->distinct()->orderBy('location')->pluck('location');
        $regions = Employee::select('region')->whereNotNull('region')->distinct()->orderBy('region')->pluck('region');

        return Inertia::render('HR/NominalRoll/Create', [
            'departments' => $departments,
            'locations' => $locations,
            'regions' => $regions,
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            // HR Profile
            'payroll_id' => 'required|string|max:50|unique:hr_profiles,payroll_id',
            'title' => 'nullable|string|max:20',
            'first_name' => 'required|string|max:100',
            'middle_name' => 'nullable|string|max:100',
            'last_name' => 'required|string|max:100',
            'job_grade' => 'nullable|string|max:50',
            'job_level' => 'nullable|string|max:50',
            'division' => 'nullable|string|max:100',
            'start_date' => 'nullable|date',
            'line_manager_name' => 'nullable|string|max:255',
            'line_manager_phone' => 'nullable|string|max:20',
            'marital_status' => 'nullable|in:single,married,divorced,widowed',
            'gender' => 'nullable|in:male,female,other',
            'date_of_birth' => 'nullable|date|before:today',
            // Employee
            'department' => 'nullable|string|max:255',
            'unit' => 'nullable|string|max:255',
            'position' => 'nullable|string|max:255',
            'region' => 'nullable|string|max:100',
            'location' => 'nullable|string|max:255',
            'email' => 'nullable|email|max:255|unique:employees,email',
            'phone' => 'nullable|string|max:20',
        ]);

        $employee = DB::transaction(function () use ($validated) {
            // Construct full name: "Title FirstName MiddleName LastName"
            $nameParts = array_filter([
                $validated['title'] ?? null,
                $validated['first_name'],
                $validated['middle_name'] ?? null,
                $validated['last_name'],
            ]);
            $fullName = implode(' ', $nameParts);

            $maxUid = Employee::max('uid') ?? 0;

            $employee = Employee::create([
                'name' => $fullName,
                'user_id' => $validated['payroll_id'],
                'uid' => $maxUid + 1,
                'email' => $validated['email'] ?? null,
                'phone' => $validated['phone'] ?? null,
                'department' => $validated['department'] ?? null,
                'unit' => $validated['unit'] ?? null,
                'position' => $validated['position'] ?? null,
                'region' => $validated['region'] ?? null,
                'location' => $validated['location'] ?? null,
                'is_active' => true,
            ]);

            $employee->hrProfile()->create([
                'payroll_id' => $validated['payroll_id'],
                'title' => $validated['title'] ?? null,
                'first_name' => $validated['first_name'],
                'middle_name' => $validated['middle_name'] ?? null,
                'last_name' => $validated['last_name'],
                'job_grade' => $validated['job_grade'] ?? null,
                'job_level' => $validated['job_level'] ?? null,
                'division' => $validated['division'] ?? null,
                'start_date' => $validated['start_date'] ?? null,
                'line_manager_name' => $validated['line_manager_name'] ?? null,
                'line_manager_phone' => $validated['line_manager_phone'] ?? null,
                'marital_status' => $validated['marital_status'] ?? null,
                'gender' => $validated['gender'] ?? null,
                'date_of_birth' => $validated['date_of_birth'] ?? null,
            ]);

            return $employee;
        });

        return redirect()->route('hr.nominal-roll.show', $employee)
            ->with('success', 'Employee record created successfully.');
    }

    public function importCsv(Request $request): RedirectResponse
    {
        abort_unless(auth()->user()->isAdmin() || auth()->user()->role === 'hr', 403);

        $request->validate([
            'csv_file' => 'required|file|max:10240',
        ]);

        $handle = fopen($request->file('csv_file')->getRealPath(), 'r');

        // Skip header row
        fgetcsv($handle);

        $created = $updated = $skipped = 0;

        HrProfile::withoutEvents(function () use ($handle, &$created, &$updated, &$skipped) {
            while (($cols = fgetcsv($handle)) !== false) {
                if (count($cols) < 15 || empty(trim($cols[1] ?? ''))) {
                    $skipped++;

                    continue;
                }

                $payrollId = trim($cols[2] ?? '');
                $fullName = trim($cols[1] ?? '');

                if (empty($payrollId) || empty($fullName)) {
                    $skipped++;

                    continue;
                }

                $email = trim($cols[18] ?? '');
                if ($email === '#ERROR!' || ! filter_var($email, FILTER_VALIDATE_EMAIL)) {
                    $email = null;
                }

                $startDate = null;
                $rawDate = trim($cols[12] ?? '');
                if (! empty($rawDate)) {
                    try {
                        $startDate = Carbon::createFromFormat('n/j/Y', $rawDate)->toDateString();
                    } catch (\Exception) {
                        try {
                            $startDate = Carbon::parse($rawDate)->toDateString();
                        } catch (\Exception) {
                            $startDate = null;
                        }
                    }
                }

                $department = preg_replace('/\s*\n\s*/', ' ', trim($cols[7] ?? ''));
                $unit = preg_replace('/\s*\n\s*/', ' ', trim($cols[8] ?? ''));

                $isNew = ! Employee::where('user_id', $payrollId)->exists();

                $employee = Employee::updateOrCreate(
                    ['user_id' => $payrollId],
                    [
                        'uid' => (int) $payrollId,
                        'name' => $fullName,
                        'email' => $email,
                        'phone' => trim($cols[19] ?? '') ?: null,
                        'department' => $department ?: null,
                        'unit' => $unit ?: null,
                        'position' => trim($cols[9] ?? '') ?: null,
                        'role' => 'user',
                        'card_number' => 0,
                        'has_fingerprint' => false,
                        'is_active' => true,
                        'region' => trim($cols[13] ?? '') ?: null,
                        'location' => trim($cols[14] ?? '') ?: null,
                    ]
                );

                HrProfile::updateOrCreate(
                    ['employee_id' => $employee->id],
                    [
                        'payroll_id' => $payrollId,
                        'title' => trim($cols[3] ?? '') ?: null,
                        'last_name' => trim($cols[4] ?? '') ?: null,
                        'middle_name' => trim($cols[5] ?? '') ?: null,
                        'first_name' => trim($cols[6] ?? '') ?: null,
                        'job_grade' => trim($cols[10] ?? '') ?: null,
                        'job_level' => trim($cols[11] ?? '') ?: null,
                        'division' => trim($cols[15] ?? '') ?: null,
                        'line_manager_name' => trim($cols[16] ?? '') ?: null,
                        'line_manager_phone' => trim($cols[17] ?? '') ?: null,
                        'start_date' => $startDate,
                        'marital_status' => $this->normaliseMaritalStatus(trim($cols[20] ?? '')),
                    ]
                );

                $isNew ? $created++ : $updated++;
            }
        });

        fclose($handle);

        return redirect()->route('hr.nominal-roll.index')
            ->with('success', "Import complete — Created: {$created} | Updated: {$updated} | Skipped: {$skipped}");
    }

    public function csvTemplate(): \Symfony\Component\HttpFoundation\StreamedResponse
    {
        abort_unless(auth()->user()->isAdmin() || auth()->user()->role === 'hr', 403);
        $headers = [
            'S/N', 'Full Name', 'Payroll ID', 'Title', 'Last name', 'Middle Name', 'First Name',
            'Department', 'Unit', 'Job Role Title', 'Job Grade', 'Job Level', 'Start Date',
            'Region', 'Location', 'Division', "Line Manager's Name", "Line Manager's Phone",
            'Official Email Address', 'Active Phone Number', 'Marital Status',
        ];

        return response()->streamDownload(function () use ($headers) {
            $out = fopen('php://output', 'w');
            fputcsv($out, $headers);
            fclose($out);
        }, 'employee-import-template.csv', ['Content-Type' => 'text/csv']);
    }

    private function normaliseMaritalStatus(string $value): ?string
    {
        $lower = strtolower(trim($value));

        return match (true) {
            str_starts_with($lower, 'married') => 'married',
            str_starts_with($lower, 'single') => 'single',
            str_starts_with($lower, 'divorced') => 'divorced',
            str_starts_with($lower, 'widow') => 'widowed',
            default => null,
        };
    }

    public function show(Employee $employee): Response
    {
        $employee->load([
            'hrProfile.reportsTo.hrProfile',
            'contracts' => fn ($q) => $q->latest(),
            'shift',
            'device',
            'auditLogs' => fn ($q) => $q->with('user')->latest()->limit(50),
        ]);

        $directReports = Employee::whereHas(
            'hrProfile',
            fn ($q) => $q->where('reports_to_employee_id', $employee->id)
        )->with('hrProfile')->get();

        $viewer = auth()->user();
        $isAdminOrHr = $viewer->isAdmin() || $viewer->role === 'hr';
        $isOwnRecord = $viewer->employee && $viewer->employee->id === $employee->id;

        // Regular users may only view their own record
        abort_unless($isAdminOrHr || $isOwnRecord, 403);

        // Regular users may only edit their own record; admin/hr can edit anyone
        $canEdit = $isAdminOrHr || $isOwnRecord;
        // Only admin/hr may change the payroll ID
        $canEditPayrollId = $isAdminOrHr;

        return Inertia::render('HR/NominalRoll/Show', [
            'employee' => array_merge($employee->toArray(), [
                'photo_url' => $employee->photo_path ? Storage::url($employee->photo_path) : null,
            ]),
            'directReports' => $directReports,
            'canEdit' => $canEdit,
            'canEditPayrollId' => $canEditPayrollId,
        ]);
    }

    public function uploadPhoto(Request $request, Employee $employee): RedirectResponse
    {
        $request->validate([
            'photo' => 'required|image|mimes:jpeg,png,jpg,webp|max:2048',
        ]);

        if ($employee->photo_path) {
            Storage::delete($employee->photo_path);
        }

        $path = $request->file('photo')->store('employee-photos', 'public');
        $employee->update(['photo_path' => $path]);

        return back()->with('success', 'Photo updated successfully.');
    }

    public function orgChart(Request $request): Response
    {
        abort_unless(auth()->user()->isAdmin() || auth()->user()->role === 'hr', 403);
        $employeeId = $request->integer('employee_id', 0);
        $departments = Employee::select('department')->whereNotNull('department')->distinct()->orderBy('department')->pluck('department');

        if ($employeeId) {
            $focal = Employee::with(['hrProfile.reportsTo.hrProfile'])->findOrFail($employeeId);

            $directReports = $this->buildDirectReports($focal->id);

            $ancestors = [];
            $current = $focal->hrProfile?->reportsTo;
            $depth = 0;
            while ($current && $depth < 6) {
                $ancestors[] = $this->serializeEmployee($current);
                $current = $current->hrProfile?->reportsTo;
                $depth++;
            }

            return Inertia::render('HR/NominalRoll/OrgChart', [
                'focal' => array_merge($this->serializeEmployee($focal), [
                    'direct_reports_count' => count($directReports),
                ]),
                'roots' => [],
                'directReports' => $directReports,
                'ancestors' => array_reverse($ancestors),
                'departments' => $departments,
            ]);
        }

        // No employee selected — show all top-level employees as roots
        $roots = Employee::whereHas(
            'hrProfile',
            fn ($q) => $q->whereNull('reports_to_employee_id')
        )->with('hrProfile')
            ->orderBy('name')
            ->get()
            ->map(fn ($e) => array_merge($this->serializeEmployee($e), [
                'direct_reports_count' => Employee::whereHas(
                    'hrProfile',
                    fn ($q) => $q->where('reports_to_employee_id', $e->id)
                )->count(),
            ]))
            ->values()
            ->all();

        return Inertia::render('HR/NominalRoll/OrgChart', [
            'focal' => null,
            'roots' => $roots,
            'directReports' => [],
            'ancestors' => [],
            'departments' => $departments,
        ]);
    }

    public function update(Request $request, Employee $employee): RedirectResponse
    {
        $viewer = auth()->user();
        $canEdit = $viewer->isAdmin() || $viewer->role === 'hr'
            || ($viewer->employee && $viewer->employee->id === $employee->id);
        abort_unless($canEdit, 403);

        $validated = $request->validate([
            'payroll_id' => 'required|string|max:50|unique:hr_profiles,payroll_id,'.optional($employee->hrProfile)->id,
            'email' => 'nullable|email|max:255|unique:employees,email,'.$employee->id,
            'reports_to_employee_id' => 'nullable|exists:employees,id',
            'title' => 'nullable|string|max:20',
            'first_name' => 'nullable|string|max:100',
            'middle_name' => 'nullable|string|max:100',
            'last_name' => 'nullable|string|max:100',
            'job_grade' => 'nullable|string|max:50',
            'job_level' => 'nullable|string|max:50',
            'division' => 'nullable|string|max:100',
            'line_manager_name' => 'nullable|string|max:255',
            'line_manager_phone' => 'nullable|string|max:20',
            'line_manager_email' => 'nullable|email|max:255',
            'start_date' => 'nullable|date',
            'date_of_confirmation' => 'nullable|date',
            'marital_status' => 'nullable|in:single,married,divorced,widowed',
            'date_of_birth' => 'nullable|date|before:today',
            'gender' => 'nullable|in:male,female,other',
            'state_of_origin' => 'nullable|string|max:100',
            'lga' => 'nullable|string|max:100',
            'nationality' => 'nullable|string|max:100',
            'religion' => 'nullable|string|max:100',
            'home_address' => 'nullable|string',
            'next_of_kin_name' => 'nullable|string|max:255',
            'next_of_kin_relationship' => 'nullable|string|max:100',
            'next_of_kin_phone' => 'nullable|string|max:20',
            'next_of_kin_address' => 'nullable|string',
            'highest_qualification' => 'nullable|in:FSLC,WAEC,OND,HND,BSc,MSc,PhD,other',
            'institution' => 'nullable|string|max:255',
            'course_of_study' => 'nullable|string|max:255',
            'grade_level' => 'nullable|string|max:50',
            'step' => 'nullable|string|max:20',
            'pensionable' => 'boolean',
        ]);

        $employee->update(['email' => ($validated['email'] ?? null) ?: null]);

        // Regular users (not admin/hr) cannot change the payroll ID
        $isAdminOrHr = $viewer->isAdmin() || $viewer->role === 'hr';
        $profileData = collect($validated)->except('email');
        if (! $isAdminOrHr) {
            $profileData = $profileData->except('payroll_id');
        }

        $employee->hrProfile()->updateOrCreate(
            ['employee_id' => $employee->id],
            $profileData->all()
        );

        return back()->with('success', 'HR profile updated successfully.');
    }

    /** @return array<int, array<string, mixed>> */
    private function buildDirectReports(int $employeeId): array
    {
        return Employee::whereHas(
            'hrProfile',
            fn ($q) => $q->where('reports_to_employee_id', $employeeId)
        )->with('hrProfile')
            ->orderBy('name')
            ->get()
            ->map(fn ($e) => array_merge($this->serializeEmployee($e), [
                'direct_reports_count' => Employee::whereHas(
                    'hrProfile',
                    fn ($q) => $q->where('reports_to_employee_id', $e->id)
                )->count(),
            ]))
            ->values()
            ->all();
    }

    /** @return array<string, mixed> */
    private function serializeEmployee(Employee $e): array
    {
        return [
            'id' => $e->id,
            'name' => $e->name,
            'position' => $e->position,
            'department' => $e->department,
            'job_grade' => $e->hrProfile?->job_grade,
            'photo_url' => $e->photo_path ? Storage::url($e->photo_path) : null,
        ];
    }
}
