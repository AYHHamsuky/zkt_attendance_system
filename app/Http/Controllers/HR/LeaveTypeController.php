<?php

namespace App\Http\Controllers\HR;

use App\Http\Controllers\Controller;
use App\Models\LeaveType;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class LeaveTypeController extends Controller
{
    public function index(): Response
    {
        $leaveTypes = LeaveType::withCount('applications')->get();

        return Inertia::render('HR/Leave/Types', [
            'leaveTypes' => $leaveTypes,
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'name' => 'required|string|max:100|unique:leave_types,name',
            'days_allowed_per_year' => 'required|integer|min:1|max:365',
            'is_paid' => 'boolean',
            'gender_restriction' => 'nullable|in:male,female',
            'requires_approval' => 'boolean',
            'requires_reliever' => 'boolean',
            'requires_document' => 'boolean',
            'document_label' => 'nullable|string|max:100',
            'description' => 'nullable|string',
            'hr_email' => 'nullable|email|max:255',
        ]);

        LeaveType::create($validated);

        return back()->with('success', 'Leave type created.');
    }

    public function update(Request $request, LeaveType $leaveType): RedirectResponse
    {
        $validated = $request->validate([
            'name' => 'required|string|max:100|unique:leave_types,name,'.$leaveType->id,
            'days_allowed_per_year' => 'required|integer|min:1|max:365',
            'is_paid' => 'boolean',
            'gender_restriction' => 'nullable|in:male,female',
            'requires_approval' => 'boolean',
            'requires_reliever' => 'boolean',
            'requires_document' => 'boolean',
            'document_label' => 'nullable|string|max:100',
            'description' => 'nullable|string',
            'hr_email' => 'nullable|email|max:255',
        ]);

        $leaveType->update($validated);

        return back()->with('success', 'Leave type updated.');
    }

    public function destroy(LeaveType $leaveType): RedirectResponse
    {
        $leaveType->delete();

        return back()->with('success', 'Leave type deleted.');
    }
}
