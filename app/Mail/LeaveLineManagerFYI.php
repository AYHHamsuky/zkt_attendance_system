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
 * FYI email sent to the Line Manager after HR makes the final decision (approve or reject).
 */
class LeaveLineManagerFYI extends Mailable
{
    use Queueable, SerializesModels;

    public function __construct(
        public LeaveApplication $application,
        public bool $approved,
        public ?string $rejectionReason = null,
    ) {}

    public function envelope(): Envelope
    {
        $action = $this->approved ? 'Approved' : 'Rejected';

        return new Envelope(
            from: new Address(config('mail.hr_addresses.leave'), 'Kaduna Electric HR'),
            subject: "FYI: {$this->application->employee->name}'s Leave {$action} by HR — {$this->application->leaveType->name}",
        );
    }

    public function content(): Content
    {
        return new Content(
            markdown: 'emails.leave.line-manager-fyi',
            with: [
                'employeeName' => $this->application->employee->name,
                'leaveType' => $this->application->leaveType->name,
                'startDate' => $this->application->start_date->format('d M Y'),
                'endDate' => $this->application->end_date->format('d M Y'),
                'daysRequested' => $this->application->days_requested,
                'approved' => $this->approved,
                'rejectionReason' => $this->rejectionReason,
                'viewUrl' => url("/hr/leave/{$this->application->id}"),
            ],
        );
    }

    public function attachments(): array
    {
        return [];
    }
}
