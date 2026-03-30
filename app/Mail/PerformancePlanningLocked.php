<?php

namespace App\Mail;

use App\Models\PerformanceReview;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Address;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

/**
 * Sent to both parties (employee + manager) when the planning phase is fully locked
 * (both have agreed). Notifies them to await HR approval.
 */
class PerformancePlanningLocked extends Mailable
{
    use Queueable, SerializesModels;

    public function __construct(
        public PerformanceReview $review,
        public string $recipientName,
    ) {}

    public function envelope(): Envelope
    {
        return new Envelope(
            from: new Address(config('mail.hr_addresses.performance'), 'Kaduna Electric Performance'),
            subject: "KPI Plan Agreed & Submitted for HR Approval — {$this->review->cycle->name}",
        );
    }

    public function content(): Content
    {
        return new Content(
            markdown: 'emails.performance.planning-locked',
            with: [
                'recipientName' => $this->recipientName,
                'employeeName' => $this->review->employee->name,
                'managerName' => $this->review->reviewer->name,
                'cycleName' => $this->review->cycle->name,
                'appraisalUrl' => url("/hr/performance/reviews/{$this->review->id}"),
            ],
        );
    }

    public function attachments(): array
    {
        return [];
    }
}
