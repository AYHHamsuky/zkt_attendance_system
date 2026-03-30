<?php

namespace App\Http\Controllers\HR;

use App\Http\Controllers\Controller;
use App\Models\Employee;
use App\Models\EmployeeTransfer;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class TransferController extends Controller
{
    public function index(Request $request): Response
    {
        $query = EmployeeTransfer::with(['employee', 'approvedBy', 'initiatedBy'])->latest();

        if ($request->filled('search')) {
            $employeeIds = Employee::search($request->input('search'))->keys();
            $query->whereIn('employee_id', $employeeIds);
        }

        if ($request->filled('status')) {
            $query->where('status', $request->input('status'));
        }

        $transfers = $query->paginate(20)->withQueryString();

        return Inertia::render('HR/Transfers/Index', [
            'transfers' => $transfers,
            'filters' => $request->only(['search', 'status']),
        ]);
    }

    public function create(): Response
    {
        $employees = Employee::select('id', 'name', 'department', 'unit', 'position', 'location')
            ->where('is_active', true)
            ->orderBy('name')
            ->get();

        $departments = Employee::select('department')->whereNotNull('department')->distinct()->pluck('department');
        $locations = Employee::select('location')->whereNotNull('location')->distinct()->pluck('location');

        return Inertia::render('HR/Transfers/Create', [
            'employees' => $employees,
            'departments' => $departments,
            'locations' => $locations,
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'employee_id' => 'required|exists:employees,id',
            'to_department' => 'required|string|max:255',
            'to_unit' => 'nullable|string|max:255',
            'to_location' => 'nullable|string|max:255',
            'to_position' => 'nullable|string|max:255',
            'reason' => 'required|string',
            'effective_date' => 'required|date',
        ]);

        $employee = Employee::findOrFail($validated['employee_id']);

        EmployeeTransfer::create([
            ...$validated,
            'from_department' => $employee->department ?? '',
            'from_unit' => $employee->unit,
            'from_location' => $employee->location,
            'from_position' => $employee->position,
            'status' => 'pending',
            'initiated_by' => auth()->id(),
        ]);

        return redirect()->route('hr.transfers.index')->with('success', 'Transfer request submitted.');
    }

    public function show(EmployeeTransfer $transfer): Response
    {
        $transfer->load(['employee', 'approvedBy', 'initiatedBy']);

        return Inertia::render('HR/Transfers/Show', [
            'transfer' => $transfer,
        ]);
    }

    public function approve(EmployeeTransfer $transfer): RedirectResponse
    {
        if ($transfer->status !== 'pending') {
            return back()->with('error', 'Transfer is not pending.');
        }

        $transfer->update([
            'status' => 'approved',
            'approved_by' => auth()->id(),
            'approved_at' => now(),
        ]);

        return back()->with('success', 'Transfer approved.');
    }

    public function reject(Request $request, EmployeeTransfer $transfer): RedirectResponse
    {
        if ($transfer->status !== 'pending') {
            return back()->with('error', 'Transfer is not pending.');
        }

        $transfer->update(['status' => 'rejected']);

        return back()->with('success', 'Transfer rejected.');
    }

    public function complete(EmployeeTransfer $transfer): RedirectResponse
    {
        if ($transfer->status !== 'approved') {
            return back()->with('error', 'Transfer must be approved before completing.');
        }

        // Update the employee's actual fields
        $transfer->employee->update([
            'department' => $transfer->to_department,
            'unit' => $transfer->to_unit,
            'location' => $transfer->to_location,
            'position' => $transfer->to_position ?? $transfer->employee->position,
        ]);

        $transfer->update(['status' => 'completed']);

        return back()->with('success', 'Transfer completed. Employee records updated.');
    }

    public function destroy(EmployeeTransfer $transfer): RedirectResponse
    {
        $transfer->delete();

        return redirect()->route('hr.transfers.index')->with('success', 'Transfer deleted.');
    }
}
