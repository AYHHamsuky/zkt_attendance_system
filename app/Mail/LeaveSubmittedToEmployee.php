<?php

namespace App\Mail;

use App\Models\LeaveApplication;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Address;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class LeaveSubmittedToEmployee extends Mailable
{
    use Queueable, SerializesModels;

    public function __construct(public LeaveApplication $application) {}

    public function envelope(): Envelope
    {
        return new Envelope(
            from: new Address(config('mail.hr_addresses.leave'), 'Kaduna Electric HR'),
            subject: "Leave Application Received — {$this->application->leaveType->name}",
        );
    }

    public function content(): Content
    {
        return new Content(
            markdown: 'emails.leave.submitted-to-employee',
            with: [
                'employeeName' => $this->application->employee->name,
                'leaveType' => $this->application->leaveType->name,
                'startDate' => $this->application->start_date->format('d M Y'),
                'endDate' => $this->application->end_date->format('d M Y'),
                'daysRequested' => $this->application->days_requested,
                'viewUrl' => url("/hr/leave/{$this->application->id}"),
            ],
        );
    }

    public function attachments(): array
    {
        return [];
    }
}
