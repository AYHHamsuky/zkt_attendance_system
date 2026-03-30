<?php

namespace App\Http\Controllers\HR;

use App\Http\Controllers\Controller;
use App\Models\Employee;
use App\Models\EmployeeResignation;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class ResignationController extends Controller
{
    public function index(Request $request): Response
    {
        $query = EmployeeResignation::with(['employee', 'acceptedBy'])->latest();

        if ($request->filled('search')) {
            $employeeIds = Employee::search($request->input('search'))->keys();
            $query->whereIn('employee_id', $employeeIds);
        }

        if ($request->filled('status')) {
            $query->where('status', $request->input('status'));
        }

        $resignations = $query->paginate(20)->withQueryString();

        return Inertia::render('HR/Resignations/Index', [
            'resignations' => $resignations,
            'filters' => $request->only(['search', 'status']),
        ]);
    }

    public function create(): Response
    {
        $employees = Employee::select('id', 'name', 'department', 'position')
            ->where('is_active', true)
            ->orderBy('name')
            ->get();

        return Inertia::render('HR/Resignations/Create', [
            'employees' => $employees,
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'employee_id' => 'required|exists:employees,id',
            'resignation_date' => 'required|date',
            'last_working_date' => 'required|date|after_or_equal:resignation_date',
            'reason' => 'required|string',
            'exit_type' => 'required|in:voluntary,involuntary,retirement,end_of_contract',
            'notes' => 'nullable|string',
        ]);

        $validated['status'] = 'pending';

        EmployeeResignation::create($validated);

        return redirect()->route('hr.resignations.index')->with('success', 'Resignation recorded.');
    }

    public function show(EmployeeResignation $resignation): Response
    {
        $resignation->load(['employee', 'acceptedBy']);

        return Inertia::render('HR/Resignations/Show', [
            'resignation' => $resignation,
        ]);
    }

    public function accept(EmployeeResignation $resignation): RedirectResponse
    {
        if ($resignation->status !== 'pending') {
            return back()->with('error', 'Resignation is not pending.');
        }

        $resignation->update([
            'status' => 'accepted',
            'accepted_by' => auth()->id(),
            'accepted_at' => now(),
        ]);

        return back()->with('success', 'Resignation accepted.');
    }

    public function updateChecklist(Request $request, EmployeeResignation $resignation): RedirectResponse
    {
        $validated = $request->validate([
            'handover_completed' => 'boolean',
            'exit_interview_completed' => 'boolean',
            'clearance_completed' => 'boolean',
        ]);

        $resignation->update($validated);

        // If all checklist items are done, mark as completed
        $resignation->refresh();
        if ($resignation->handover_completed && $resignation->exit_interview_completed && $resignation->clearance_completed && $resignation->status === 'accepted') {
            $resignation->update(['status' => 'completed']);
            // Deactivate the employee
            $resignation->employee->update(['is_active' => false]);
        }

        return back()->with('success', 'Checklist updated.');
    }

    public function destroy(EmployeeResignation $resignation): RedirectResponse
    {
        $resignation->delete();

        return redirect()->route('hr.resignations.index')->with('success', 'Resignation record deleted.');
    }
}
