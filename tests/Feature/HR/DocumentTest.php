<?php

use App\Models\Employee;
use App\Models\EmployeeDocument;
use App\Models\User;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;

test('guests are redirected from documents', function () {
    $this->get(route('hr.documents.index'))->assertRedirect(route('login'));
});

test('authenticated users can view documents index', function () {
    $this->actingAs(User::factory()->create())
        ->get(route('hr.documents.index'))
        ->assertOk()
        ->assertInertia(fn ($page) => $page->component('HR/Documents/Index'));
});

test('authenticated users can upload a document', function () {
    Storage::fake('local');

    $user = User::factory()->create();
    $employee = Employee::factory()->create();
    $file = UploadedFile::fake()->create('cv.pdf', 100, 'application/pdf');

    $this->actingAs($user)
        ->post(route('hr.documents.store'), [
            'employee_id' => $employee->id,
            'title' => 'Curriculum Vitae',
            'document_type' => 'certificate',
            'file' => $file,
        ])
        ->assertRedirect();

    $document = EmployeeDocument::where('employee_id', $employee->id)->first();
    expect($document)->not->toBeNull();
    expect($document->file_name)->toBe('cv.pdf');
    expect($document->uploaded_by)->toBe($user->id);
    Storage::disk('local')->assertExists($document->file_path);
});

test('document upload validates file type', function () {
    Storage::fake('local');

    $user = User::factory()->create();
    $employee = Employee::factory()->create();
    $file = UploadedFile::fake()->create('script.exe', 100, 'application/octet-stream');

    $this->actingAs($user)
        ->post(route('hr.documents.store'), [
            'employee_id' => $employee->id,
            'title' => 'Bad File',
            'document_type' => 'other',
            'file' => $file,
        ])
        ->assertSessionHasErrors(['file']);
});

test('authenticated users can delete a document', function () {
    Storage::fake('local');
    Storage::disk('local')->put('employee-documents/test.pdf', 'content');

    $user = User::factory()->create();
    $employee = Employee::factory()->create();
    $document = EmployeeDocument::create([
        'employee_id' => $employee->id,
        'title' => 'Test Doc',
        'document_type' => 'other',
        'file_path' => 'employee-documents/test.pdf',
        'file_name' => 'test.pdf',
        'file_size' => 100,
        'mime_type' => 'application/pdf',
        'uploaded_by' => $user->id,
    ]);

    $this->actingAs($user)
        ->delete(route('hr.documents.destroy', $document))
        ->assertRedirect();

    expect(EmployeeDocument::find($document->id))->toBeNull();
    Storage::disk('local')->assertMissing('employee-documents/test.pdf');
});
