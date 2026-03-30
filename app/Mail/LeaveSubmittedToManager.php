<?php

namespace App\Mail;

use App\Models\LeaveApplication;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Address;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class LeaveSubmittedToManager extends Mailable
{
    use Queueable, SerializesModels;

    public function __construct(public LeaveApplication $application) {}

    public function envelope(): Envelope
    {
        return new Envelope(
            from: new Address(config('mail.hr_addresses.leave'), 'Kaduna Electric HR'),
            subject: "Leave Request — {$this->application->employee->name} ({$this->application->leaveType->name})",
        );
    }

    public function content(): Content
    {
        return new Content(
            markdown: 'emails.leave.submitted-to-manager',
            with: [
                'employeeName' => $this->application->employee->name,
                'department' => $this->application->employee->department ?? '—',
                'leaveType' => $this->application->leaveType->name,
                'startDate' => $this->application->start_date->format('d M Y'),
                'endDate' => $this->application->end_date->format('d M Y'),
                'daysRequested' => $this->application->days_requested,
                'reason' => $this->application->reason,
                'reliever' => $this->application->reliever?->name,
                'documentUrl' => $this->application->document_path
                    ? url("/hr/leave/{$this->application->id}/document")
                    : null,
                'approvalUrl' => url("/hr/leave/{$this->application->id}"),
            ],
        );
    }

    public function attachments(): array
    {
        return [];
    }
}
