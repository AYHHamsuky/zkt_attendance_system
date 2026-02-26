<?php

use App\Models\AttendanceLog;
use App\Models\Employee;
use App\Models\Shift;
use App\Models\User;
use Carbon\Carbon;

beforeEach(function () {
    $this->user = User::factory()->create();
    $this->actingAs($this->user);
});

test('guests are redirected from report page', function () {
    auth()->logout();
    $this->get(route('attendance.report'))->assertRedirect(route('login'));
});

test('authenticated users can visit the report page', function () {
    $this->get(route('attendance.report'))->assertOk();
});

test('report page returns inertia component with required props', function () {
    $this->get(route('attendance.report'))
        ->assertInertia(fn ($page) => $page
            ->component('Attendance/Report')
            ->has('reportData')
            ->has('summary')
            ->has('summary.today_tardy')
            ->has('filters')
            ->has('filterOptions')
            ->has('filterOptions.departments')
            ->has('filterOptions.units')
            ->has('filterOptions.devices')
        );
});

test('report can be filtered by department', function () {
    Employee::factory()->create(['department' => 'Engineering', 'is_active' => true]);
    Employee::factory()->create(['department' => 'HR', 'is_active' => true]);

    $this->get(route('attendance.report', ['department' => 'Engineering']))
        ->assertInertia(fn ($page) => $page
            ->component('Attendance/Report')
            ->where('filters.department', 'Engineering')
        );
});

test('report can be filtered by unit', function () {
    Employee::factory()->create(['unit' => 'Unit A', 'is_active' => true]);

    $this->get(route('attendance.report', ['unit' => 'Unit A']))
        ->assertInertia(fn ($page) => $page
            ->where('filters.unit', 'Unit A')
        );
});

test('report groups data by department', function () {
    Employee::factory()->create(['department' => 'Engineering', 'is_active' => true]);

    $this->get(route('attendance.report', ['group_by' => 'department']))
        ->assertInertia(fn ($page) => $page
            ->where('filters.group_by', 'department')
            ->has('reportData.0', fn ($row) => $row
                ->has('group')
                ->has('total_employees')
                ->has('check_ins')
                ->has('tardy_count')
                ->etc()
            )
        );
});

test('report groups data by unit', function () {
    Employee::factory()->create(['unit' => 'Unit B', 'is_active' => true]);

    $this->get(route('attendance.report', ['group_by' => 'unit']))
        ->assertInertia(fn ($page) => $page
            ->where('filters.group_by', 'unit')
        );
});

test('individual report includes tardy count', function () {
    $shift = Shift::factory()->create([
        'expected_check_in' => '08:00:00',
        'grace_period_minutes' => 15,
    ]);

    $employee = Employee::factory()->create(['is_active' => true, 'shift_id' => $shift->id]);

    // On-time today
    AttendanceLog::factory()->create([
        'employee_id' => $employee->id,
        'uid' => $employee->uid,
        'state' => 0,
        'timestamp' => Carbon::today()->setTime(7, 55, 0),
    ]);

    // Late yesterday (after 08:15)
    AttendanceLog::factory()->create([
        'employee_id' => $employee->id,
        'uid' => $employee->uid,
        'state' => 0,
        'timestamp' => Carbon::yesterday()->setTime(8, 30, 0),
    ]);

    $this->get(route('attendance.report', [
        'date_from' => Carbon::yesterday()->toDateString(),
        'date_to' => Carbon::today()->toDateString(),
        'group_by' => 'individual',
    ]))
        ->assertInertia(fn ($page) => $page
            ->has('reportData', fn ($data) => $data
                ->first(fn ($row) => $row
                    ->where('id', $employee->id)
                    ->where('tardy_count', 1)
                    ->etc()
                )
            )
        );
});

test('employee can be stored with unit and shift', function () {
    $shift = Shift::factory()->create();

    $this->post(route('employees.store'), [
        'name' => 'Test Employee',
        'user_id' => 'EMP999',
        'department' => 'Engineering',
        'unit' => 'Unit A',
        'shift_id' => $shift->id,
    ])->assertRedirect(route('employees.index'));

    $this->assertDatabaseHas('employees', [
        'user_id' => 'EMP999',
        'unit' => 'Unit A',
        'shift_id' => $shift->id,
    ]);
});

test('shift resolution prefers unit over department over global', function () {
    $globalShift = Shift::factory()->create(['department' => null, 'unit' => null, 'expected_check_in' => '09:00:00']);
    $deptShift = Shift::factory()->create(['department' => 'Engineering', 'unit' => null, 'expected_check_in' => '08:30:00']);
    $unitShift = Shift::factory()->create(['department' => null, 'unit' => 'Unit A', 'expected_check_in' => '08:00:00']);

    $allShifts = Shift::all();

    $empWithUnit = Employee::factory()->make(['department' => 'Engineering', 'unit' => 'Unit A', 'shift_id' => null]);
    expect($empWithUnit->resolveShift($allShifts)?->id)->toBe($unitShift->id);

    $empWithDept = Employee::factory()->make(['department' => 'Engineering', 'unit' => null, 'shift_id' => null]);
    expect($empWithDept->resolveShift($allShifts)?->id)->toBe($deptShift->id);

    $empGlobal = Employee::factory()->make(['department' => 'Finance', 'unit' => null, 'shift_id' => null]);
    expect($empGlobal->resolveShift($allShifts)?->id)->toBe($globalShift->id);
});
