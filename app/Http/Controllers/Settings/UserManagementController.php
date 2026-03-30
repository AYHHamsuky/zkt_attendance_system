<?php

namespace App\Http\Controllers\Settings;

use App\Http\Controllers\Controller;
use App\Models\Employee;
use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;
use Illuminate\Validation\Rules\Password;
use Inertia\Inertia;
use Inertia\Response;

class UserManagementController extends Controller
{
    private const COMPANY = 'Kaduna Electric';

    /** Roles that can be assigned (super_admin is protected — cannot be set via UI). */
    private const ASSIGNABLE_ROLES = ['admin', 'hr', 'user'];

    public function index(Request $request): Response
    {
        $search = $request->input('search', '');
        $roleFilter = $request->input('role', '');

        $query = User::with('employee')
            ->when($search, fn ($q) => $q->where('name', 'like', "%{$search}%")->orWhere('email', 'like', "%{$search}%"))
            ->when($roleFilter, fn ($q) => $q->where('role', $roleFilter))
            ->orderBy('name');

        $total = $query->count();
        $paginated = $query->paginate(80)->withQueryString();
        $offset = ($paginated->currentPage() - 1) * $paginated->perPage();

        $users = $paginated->through(function (User $user, int $index) use ($offset) {
            return [
                'id' => $user->id,
                'serial' => $offset + $index + 1,
                'name' => $user->name,
                'email' => $user->email,
                'role' => $user->role,
                'employee_id' => $user->employee_id,
                'company' => self::COMPANY,
                'last_login_at' => $user->last_login_at?->format('d/m/Y H:i:s'),
                'email_verified_at' => $user->email_verified_at,
                'created_at' => $user->created_at?->toDateString(),
                'is_super_admin' => $user->isSuperAdmin(),
                'employee' => $user->employee ? [
                    'id' => $user->employee->id,
                    'name' => $user->employee->name,
                    'department' => $user->employee->department,
                    'position' => $user->employee->position,
                ] : null,
            ];
        });

        // All active employees for the link-employee dialog
        $allEmployees = Employee::where('is_active', true)
            ->select('id', 'name', 'department', 'position')
            ->orderBy('department')
            ->orderBy('name')
            ->get()
            ->map(fn (Employee $e) => [
                'id' => $e->id,
                'name' => $e->name,
                'department' => $e->department,
                'position' => $e->position,
            ]);

        // Employees without a user account — for the import dialog
        $existingEmails = User::pluck('email')->map(fn ($e) => strtolower($e))->toArray();

        $unlinkedEmployees = Employee::with('hrProfile:employee_id,payroll_id')
            ->where('is_active', true)
            ->whereNotNull('email')
            ->when(
                count($existingEmails) > 0,
                fn ($q) => $q->whereRaw(
                    'LOWER(email) NOT IN ('.implode(',', array_fill(0, count($existingEmails), '?')).')',
                    $existingEmails
                )
            )
            ->select('id', 'name', 'email', 'department', 'position')
            ->orderBy('department')
            ->orderBy('name')
            ->get()
            ->map(fn (Employee $e) => [
                'id' => $e->id,
                'name' => $e->name,
                'email' => $e->email,
                'department' => $e->department,
                'position' => $e->position,
                'payroll_id' => $e->hrProfile?->payroll_id,
            ]);

        return Inertia::render('settings/Users', [
            'users' => $users,
            'total' => $total,
            'filters' => ['search' => $search, 'role' => $roleFilter],
            'allEmployees' => $allEmployees,
            'unlinkedEmployees' => $unlinkedEmployees,
            'roles' => self::ASSIGNABLE_ROLES,
            'company' => self::COMPANY,
        ]);
    }

    /** Create a single new user account. */
    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|max:255|unique:users,email',
            'role' => 'required|in:'.implode(',', self::ASSIGNABLE_ROLES),
            'password' => ['required', Password::min(8)],
        ]);

        User::create([
            'name' => $validated['name'],
            'email' => $validated['email'],
            'role' => $validated['role'],
            'password' => Hash::make($validated['password']),
        ]);

        return back()->with('success', 'User account created successfully.');
    }

    /** Update a user's role. Super admins cannot have their role changed. */
    public function updateRole(Request $request, User $user): RedirectResponse
    {
        if ($user->isSuperAdmin()) {
            return back()->with('error', 'The super admin role cannot be changed.');
        }

        $validated = $request->validate([
            'role' => 'required|in:'.implode(',', self::ASSIGNABLE_ROLES),
        ]);

        $user->update(['role' => $validated['role']]);

        return back()->with('success', "Role updated to {$validated['role']}.");
    }

    /** Reset a user's password (admin sets a new password). */
    public function resetPassword(Request $request, User $user): RedirectResponse
    {
        $validated = $request->validate([
            'password' => ['required', Password::min(8)],
        ]);

        $user->update(['password' => Hash::make($validated['password'])]);

        return back()->with('success', "Password reset for {$user->name}.");
    }

    /** Delete a user account. Cannot delete own account or super admin. */
    public function destroy(Request $request, User $user): RedirectResponse
    {
        if ($user->id === $request->user()->id) {
            return back()->with('error', 'You cannot delete your own account.');
        }

        if ($user->isSuperAdmin()) {
            return back()->with('error', 'The super admin account cannot be deleted.');
        }

        $user->delete();

        return back()->with('success', 'User account deleted.');
    }

    /** Reset a user's onboarding so they see the welcome tour on next login. */
    public function resetOnboarding(User $user): RedirectResponse
    {
        $user->update(['onboarding_state' => null]);

        return back()->with('success', "Onboarding reset for {$user->name}. They will see the guided tour on next login.");
    }

    /** Link (or unlink) a user account to an employee record. */
    public function linkEmployee(Request $request, User $user): RedirectResponse
    {
        $validated = $request->validate([
            'employee_id' => 'nullable|exists:employees,id',
        ]);

        $user->update(['employee_id' => $validated['employee_id'] ?? null]);

        $message = $validated['employee_id']
            ? 'Employee record linked successfully.'
            : 'Employee link removed.';

        return back()->with('success', $message);
    }

    /**
     * Bulk-import selected employees as user accounts.
     * If employee_ids is provided, only those employees are imported.
     */
    public function importFromEmployees(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'role' => 'required|in:'.implode(',', self::ASSIGNABLE_ROLES),
            'password_mode' => 'required|in:payroll_id,random',
            'employee_ids' => 'nullable|array',
            'employee_ids.*' => 'integer|exists:employees,id',
        ]);

        $existingEmails = User::pluck('email')->map(fn ($e) => strtolower($e))->toArray();

        $query = Employee::with('hrProfile')
            ->where('is_active', true)
            ->whereNotNull('email')
            ->when(
                count($existingEmails) > 0,
                fn ($q) => $q->whereRaw(
                    'LOWER(email) NOT IN ('.implode(',', array_fill(0, count($existingEmails), '?')).')',
                    $existingEmails
                )
            );

        if (! empty($validated['employee_ids'])) {
            $query->whereIn('id', $validated['employee_ids']);
        }

        $employees = $query->get();
        $created = 0;

        foreach ($employees as $employee) {
            $rawPassword = $validated['password_mode'] === 'payroll_id'
                ? ($employee->hrProfile?->payroll_id ?? Str::random(10))
                : Str::random(12);

            User::create([
                'name' => $employee->name,
                'email' => strtolower($employee->email),
                'role' => $validated['role'],
                'password' => Hash::make($rawPassword),
            ]);

            $created++;
        }

        return back()->with('success', "{$created} user account(s) created. Employees can now log in with their official email.");
    }
}
