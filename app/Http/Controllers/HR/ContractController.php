<?php

namespace App\Http\Controllers\HR;

use App\Http\Controllers\Controller;
use App\Models\Contract;
use App\Models\Employee;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class ContractController extends Controller
{
    public function index(Request $request): Response
    {
        $query = Contract::with('employee')->latest();

        if ($request->filled('search')) {
            $employeeIds = Employee::search($request->input('search'))->keys();
            $query->whereIn('employee_id', $employeeIds);
        }

        if ($request->filled('status')) {
            $query->where('status', $request->input('status'));
        }

        if ($request->filled('type')) {
            $query->where('contract_type', $request->input('type'));
        }

        $contracts = $query->paginate(20)->withQueryString();

        return Inertia::render('HR/Contracts/Index', [
            'contracts' => $contracts,
            'filters' => $request->only(['search', 'status', 'type']),
        ]);
    }

    public function create(): Response
    {
        $employees = Employee::select('id', 'name', 'department', 'position')
            ->where('is_active', true)
            ->orderBy('name')
            ->get();

        return Inertia::render('HR/Contracts/Create', [
            'employees' => $employees,
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'employee_id' => 'required|exists:employees,id',
            'contract_type' => 'required|in:permanent,contract,temporary,casual',
            'start_date' => 'required|date',
            'end_date' => 'nullable|date|after:start_date',
            'probation_end_date' => 'nullable|date|after:start_date',
            'salary_amount' => 'required|numeric|min:0',
            'terms' => 'nullable|string',
        ]);

        $validated['created_by'] = auth()->id();
        $validated['status'] = 'active';

        Contract::create($validated);

        return redirect()->route('hr.contracts.index')->with('success', 'Contract created successfully.');
    }

    public function show(Contract $contract): Response
    {
        $contract->load(['employee', 'createdBy', 'renewedFrom', 'renewals.employee']);

        return Inertia::render('HR/Contracts/Show', [
            'contract' => $contract,
        ]);
    }

    public function edit(Contract $contract): Response
    {
        $employees = Employee::select('id', 'name', 'department', 'position')
            ->where('is_active', true)
            ->orderBy('name')
            ->get();

        return Inertia::render('HR/Contracts/Create', [
            'contract' => $contract->load('employee'),
            'employees' => $employees,
        ]);
    }

    public function update(Request $request, Contract $contract): RedirectResponse
    {
        $validated = $request->validate([
            'contract_type' => 'required|in:permanent,contract,temporary,casual',
            'start_date' => 'required|date',
            'end_date' => 'nullable|date|after:start_date',
            'probation_end_date' => 'nullable|date|after:start_date',
            'salary_amount' => 'required|numeric|min:0',
            'terms' => 'nullable|string',
            'status' => 'required|in:active,expired,terminated,renewed',
        ]);

        $contract->update($validated);

        return redirect()->route('hr.contracts.show', $contract)->with('success', 'Contract updated successfully.');
    }

    public function destroy(Contract $contract): RedirectResponse
    {
        $contract->delete();

        return redirect()->route('hr.contracts.index')->with('success', 'Contract deleted.');
    }
}
