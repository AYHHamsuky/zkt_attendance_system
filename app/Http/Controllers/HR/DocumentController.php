<?php

namespace App\Http\Controllers\HR;

use App\Http\Controllers\Controller;
use App\Models\Employee;
use App\Models\EmployeeDocument;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Inertia\Response;
use Symfony\Component\HttpFoundation\StreamedResponse;

class DocumentController extends Controller
{
    public function index(Request $request): Response
    {
        $query = EmployeeDocument::with(['employee', 'uploadedBy'])->latest();

        if ($request->filled('employee_id')) {
            $query->where('employee_id', $request->input('employee_id'));
        }

        if ($request->filled('document_type')) {
            $query->where('document_type', $request->input('document_type'));
        }

        if ($request->filled('expiring')) {
            $query->whereNotNull('expires_at')->where('expires_at', '<=', now()->addDays(30));
        }

        $documents = $query->paginate(20)->withQueryString();

        $employees = Employee::select('id', 'name')
            ->where('is_active', true)
            ->orderBy('name')
            ->get();

        return Inertia::render('HR/Documents/Index', [
            'documents' => $documents,
            'employees' => $employees,
            'filters' => $request->only(['employee_id', 'document_type', 'expiring']),
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'employee_id' => 'required|exists:employees,id',
            'title' => 'required|string|max:255',
            'document_type' => 'required|in:certificate,national_id,contract,appointment_letter,passport,other',
            'file' => 'required|file|max:10240|mimes:pdf,jpg,jpeg,png,doc,docx',
            'expires_at' => 'nullable|date|after:today',
        ]);

        $file = $request->file('file');
        $path = $file->store('employee-documents', 'local');

        EmployeeDocument::create([
            'employee_id' => $validated['employee_id'],
            'title' => $validated['title'],
            'document_type' => $validated['document_type'],
            'file_path' => $path,
            'file_name' => $file->getClientOriginalName(),
            'file_size' => $file->getSize(),
            'mime_type' => $file->getMimeType(),
            'expires_at' => $validated['expires_at'] ?? null,
            'uploaded_by' => auth()->id(),
        ]);

        return back()->with('success', 'Document uploaded successfully.');
    }

    public function download(EmployeeDocument $document): StreamedResponse
    {
        return Storage::disk('local')->download($document->file_path, $document->file_name);
    }

    public function destroy(EmployeeDocument $document): RedirectResponse
    {
        Storage::disk('local')->delete($document->file_path);
        $document->delete();

        return back()->with('success', 'Document deleted.');
    }
}
