<?php

namespace App\Mail;

use App\Models\LeaveApplication;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Address;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

/**
 * Sent to the employee when their leave is approved or rejected at any stage.
 *
 * @param  string  $stage  'line_manager' or 'hr'
 * @param  string  $decision  'approved' or 'rejected'
 * @param  string|null  $reason  Rejection reason (required when rejected)
 */
class LeaveDecisionToEmployee extends Mailable
{
    use Queueable, SerializesModels;

    public function __construct(
        public LeaveApplication $application,
        public string $stage,
        public string $decision,
        public ?string $reason = null,
    ) {}

    public function envelope(): Envelope
    {
        $status = ucfirst($this->decision);
        $by = $this->stage === 'hr' ? 'HR' : 'Line Manager';

        return new Envelope(
            from: new Address(config('mail.hr_addresses.leave'), 'Kaduna Electric HR'),
            subject: "Leave Application {$status} by {$by} — {$this->application->leaveType->name}",
        );
    }

    public function content(): Content
    {
        return new Content(
            markdown: 'emails.leave.decision-to-employee',
            with: [
                'employeeName' => $this->application->employee->name,
                'leaveType' => $this->application->leaveType->name,
                'startDate' => $this->application->start_date->format('d M Y'),
                'endDate' => $this->application->end_date->format('d M Y'),
                'daysRequested' => $this->application->days_requested,
                'decision' => $this->decision,
                'stage' => $this->stage,
                'reason' => $this->reason,
                'isFinalApproval' => $this->decision === 'approved' && $this->stage === 'hr',
                'viewUrl' => url("/hr/leave/{$this->application->id}"),
            ],
        );
    }

    public function attachments(): array
    {
        return [];
    }
}
