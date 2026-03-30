<?php

use App\Http\Controllers\HR\ContractController;
use App\Http\Controllers\HR\DocumentController;
use App\Http\Controllers\HR\LeaveController;
use App\Http\Controllers\HR\LeaveTypeController;
use App\Http\Controllers\HR\NominalRollController;
use App\Http\Controllers\HR\PerformanceCycleController;
use App\Http\Controllers\HR\PerformanceReportController;
use App\Http\Controllers\HR\PerformanceReviewController;
use App\Http\Controllers\HR\PerformanceTemplateController;
use App\Http\Controllers\HR\PublicHolidayController;
use App\Http\Controllers\HR\ResignationController;
use App\Http\Controllers\HR\TransferController;
use Illuminate\Support\Facades\Route;

Route::middleware(['auth', 'verified'])->prefix('hr')->name('hr.')->group(function () {
    // /hr redirects to /dashboard (which now serves the HR Dashboard)
    Route::redirect('/', '/dashboard')->name('dashboard');

    // Nominal Roll
    Route::get('nominal-roll', [NominalRollController::class, 'index'])->name('nominal-roll.index');
    Route::get('nominal-roll/create', [NominalRollController::class, 'create'])->name('nominal-roll.create');
    Route::post('nominal-roll', [NominalRollController::class, 'store'])->name('nominal-roll.store');
    Route::post('nominal-roll/import', [NominalRollController::class, 'importCsv'])->name('nominal-roll.import');
    Route::get('nominal-roll/csv-template', [NominalRollController::class, 'csvTemplate'])->name('nominal-roll.csv-template');
    Route::get('nominal-roll/org-chart', [NominalRollController::class, 'orgChart'])->name('nominal-roll.org-chart');
    Route::get('nominal-roll/{employee}', [NominalRollController::class, 'show'])->name('nominal-roll.show');
    Route::patch('nominal-roll/{employee}', [NominalRollController::class, 'update'])->name('nominal-roll.update');
    Route::post('nominal-roll/{employee}/photo', [NominalRollController::class, 'uploadPhoto'])->name('nominal-roll.photo');

    // Contracts
    Route::resource('contracts', ContractController::class);

    // Leave Types (admin only)
    Route::middleware('admin')->resource('leave-types', LeaveTypeController::class)->except(['show']);

    // Public Holidays
    Route::get('public-holidays', [PublicHolidayController::class, 'index'])->name('public-holidays.index');
    Route::post('public-holidays', [PublicHolidayController::class, 'store'])->name('public-holidays.store');
    Route::patch('public-holidays/{publicHoliday}', [PublicHolidayController::class, 'update'])->name('public-holidays.update');
    Route::delete('public-holidays/{publicHoliday}', [PublicHolidayController::class, 'destroy'])->name('public-holidays.destroy');

    // Leave day preview (called from Create.vue before submission)
    Route::get('leave/days-preview', [LeaveController::class, 'daysPreview'])->name('leave.days-preview');

    // Employee search (shared — used by Leave, Transfer, etc.)
    Route::get('employees/search', [LeaveController::class, 'searchEmployees'])->name('employees.search');

    // Leave Applications
    Route::resource('leave', LeaveController::class)->parameters(['leave' => 'leaveApplication']);
    Route::post('leave/{leaveApplication}/lm-approve', [LeaveController::class, 'lmApprove'])->name('leave.lm-approve');
    Route::post('leave/{leaveApplication}/lm-reject', [LeaveController::class, 'lmReject'])->name('leave.lm-reject');
    Route::post('leave/{leaveApplication}/approve', [LeaveController::class, 'approve'])->name('leave.approve');
    Route::post('leave/{leaveApplication}/reject', [LeaveController::class, 'reject'])->name('leave.reject');
    Route::get('leave/{leaveApplication}/document', [LeaveController::class, 'downloadDocument'])->name('leave.document');

    // Documents
    Route::get('documents', [DocumentController::class, 'index'])->name('documents.index');
    Route::post('documents', [DocumentController::class, 'store'])->name('documents.store');
    Route::get('documents/{document}/download', [DocumentController::class, 'download'])->name('documents.download');
    Route::delete('documents/{document}', [DocumentController::class, 'destroy'])->name('documents.destroy');

    // Transfers
    Route::resource('transfers', TransferController::class)->except(['edit', 'update']);
    Route::post('transfers/{transfer}/approve', [TransferController::class, 'approve'])->name('transfers.approve');
    Route::post('transfers/{transfer}/reject', [TransferController::class, 'reject'])->name('transfers.reject');
    Route::post('transfers/{transfer}/complete', [TransferController::class, 'complete'])->name('transfers.complete');

    // Resignations
    Route::resource('resignations', ResignationController::class)->except(['edit', 'update']);
    Route::post('resignations/{resignation}/accept', [ResignationController::class, 'accept'])->name('resignations.accept');
    Route::post('resignations/{resignation}/checklist', [ResignationController::class, 'updateChecklist'])->name('resignations.checklist');

    // Performance Reports & Analysis
    Route::get('performance/reports', [PerformanceReportController::class, 'index'])->name('performance.reports');
    Route::get('performance/reports/export', [PerformanceReportController::class, 'export'])->name('performance.reports.export');

    // Performance Templates — CRUD management (fixed segments MUST come before {template})
    Route::get('performance/templates', [PerformanceTemplateController::class, 'index'])->name('performance.templates.index');
    Route::post('performance/templates', [PerformanceTemplateController::class, 'store'])->name('performance.templates.store');
    Route::get('performance/templates/downloads/sample', [PerformanceTemplateController::class, 'downloadSample'])->name('performance.templates.sample');
    Route::get('performance/templates/downloads/blank', [PerformanceTemplateController::class, 'downloadTemplate'])->name('performance.templates.template');
    Route::get('performance/templates/downloads/bulk', [PerformanceTemplateController::class, 'downloadBulk'])->name('performance.templates.bulk');
    Route::get('performance/templates/{template}', [PerformanceTemplateController::class, 'show'])->name('performance.templates.show');
    Route::patch('performance/templates/{template}', [PerformanceTemplateController::class, 'update'])->name('performance.templates.update');
    Route::delete('performance/templates/{template}', [PerformanceTemplateController::class, 'destroy'])->name('performance.templates.destroy');
    Route::post('performance/templates/{template}/items', [PerformanceTemplateController::class, 'storeItem'])->name('performance.templates.items.store');
    Route::patch('performance/templates/{template}/items/{item}', [PerformanceTemplateController::class, 'updateItem'])->name('performance.templates.items.update');
    Route::delete('performance/templates/{template}/items/{item}', [PerformanceTemplateController::class, 'destroyItem'])->name('performance.templates.items.destroy');
    Route::get('performance/templates/{employee}/download', [PerformanceTemplateController::class, 'downloadForEmployee'])->name('performance.templates.employee');

    // Performance Cycles
    Route::post('performance/cycles/{cycle}/toggle-scores', [PerformanceCycleController::class, 'toggleScores'])->name('performance.cycles.toggle-scores');
    Route::post('performance/cycles/{cycle}/advance-phase', [PerformanceCycleController::class, 'advancePhase'])->name('performance.cycles.advance-phase');
    Route::post('performance/cycles/{cycle}/extend-dates', [PerformanceCycleController::class, 'extendDates'])->name('performance.cycles.extend-dates');
    Route::resource('performance/cycles', PerformanceCycleController::class)->names([
        'index' => 'performance.cycles.index',
        'create' => 'performance.cycles.create',
        'store' => 'performance.cycles.store',
        'show' => 'performance.cycles.show',
        'edit' => 'performance.cycles.edit',
        'update' => 'performance.cycles.update',
        'destroy' => 'performance.cycles.destroy',
    ]);

    // Performance Reviews
    Route::get('performance/reviews', [PerformanceReviewController::class, 'index'])->name('performance.reviews.index');
    Route::post('performance/reviews', [PerformanceReviewController::class, 'store'])->name('performance.reviews.store');
    Route::post('performance/reviews/bulk', [PerformanceReviewController::class, 'bulkStore'])->name('performance.reviews.bulk');
    Route::post('performance/reviews/send-bulk-notification', [PerformanceReviewController::class, 'sendBulkNotification'])->name('performance.reviews.send-bulk-notification');
    Route::get('performance/my-appraisals', [PerformanceReviewController::class, 'myReviews'])->name('performance.my-appraisals');
    Route::get('performance/reviews/planning-csv-template', [PerformanceReviewController::class, 'downloadPlanningCsvTemplate'])->name('performance.reviews.planning-csv-template');
    Route::get('performance/reviews/{review}', [PerformanceReviewController::class, 'show'])->name('performance.reviews.show');
    Route::put('performance/reviews/{review}', [PerformanceReviewController::class, 'update'])->name('performance.reviews.update');
    Route::post('performance/reviews/{review}/save-self', [PerformanceReviewController::class, 'saveSelf'])->name('performance.reviews.save-self');
    Route::post('performance/reviews/{review}/submit', [PerformanceReviewController::class, 'submit'])->name('performance.reviews.submit');
    Route::post('performance/reviews/{review}/save-manager', [PerformanceReviewController::class, 'saveManagerReview'])->name('performance.reviews.save-manager');
    Route::post('performance/reviews/{review}/acknowledge', [PerformanceReviewController::class, 'acknowledge'])->name('performance.reviews.acknowledge');
    Route::post('performance/reviews/{review}/finalize', [PerformanceReviewController::class, 'finalize'])->name('performance.reviews.finalize');
    Route::post('performance/reviews/{review}/send-notification', [PerformanceReviewController::class, 'sendNotification'])->name('performance.reviews.send-notification');
    Route::delete('performance/reviews/{review}', [PerformanceReviewController::class, 'destroy'])->name('performance.reviews.destroy');
    Route::post('performance/reviews/{review}/upload-csv', [PerformanceReviewController::class, 'uploadPlanningCsv'])->name('performance.reviews.upload-csv');
    Route::post('performance/reviews/{review}/training-needs', [PerformanceReviewController::class, 'storeTrainingNeed'])->name('performance.reviews.training-needs.store');
    Route::delete('performance/reviews/{review}/training-needs/{trainingNeed}', [PerformanceReviewController::class, 'destroyTrainingNeed'])->name('performance.reviews.training-needs.destroy');
    Route::post('performance/reviews/{review}/agree-employee', [PerformanceReviewController::class, 'agreeEmployee'])->name('performance.reviews.agree-employee');
    Route::post('performance/reviews/{review}/agree-manager', [PerformanceReviewController::class, 'agreeManager'])->name('performance.reviews.agree-manager');
    Route::post('performance/reviews/{review}/hr-approve', [PerformanceReviewController::class, 'hrApprove'])->name('performance.reviews.hr-approve');
    Route::post('performance/reviews/{review}/hr-reject', [PerformanceReviewController::class, 'hrReject'])->name('performance.reviews.hr-reject');
    Route::post('performance/reviews/{review}/tracking-entries', [PerformanceReviewController::class, 'storeTrackingEntry'])->name('performance.reviews.tracking-entries.store');
    Route::delete('performance/reviews/{review}/tracking-entries/{trackingEntry}', [PerformanceReviewController::class, 'destroyTrackingEntry'])->name('performance.reviews.tracking-entries.destroy');
});
