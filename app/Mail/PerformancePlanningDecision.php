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
 * Sent to both parties (employee + manager) when HR approves or rejects the KPI plan.
 */
class PerformancePlanningDecision extends Mailable
{
    use Queueable, SerializesModels;

    public function __construct(
        public PerformanceReview $review,
        public string $recipientName,
        public bool $approved,
        public ?string $rejectionReason = null,
    ) {}

    public function envelope(): Envelope
    {
        $action = $this->approved ? 'Approved' : 'Requires Revision';

        return new Envelope(
            from: new Address(config('mail.hr_addresses.performance'), 'Kaduna Electric Performance'),
            subject: "KPI Plan {$action} — {$this->review->cycle->name}",
        );
    }

    public function content(): Content
    {
        return new Content(
            markdown: 'emails.performance.planning-decision',
            with: [
                'recipientName' => $this->recipientName,
                'employeeName' => $this->review->employee->name,
                'cycleName' => $this->review->cycle->name,
                'approved' => $this->approved,
                'rejectionReason' => $this->rejectionReason,
                'appraisalUrl' => url("/hr/performance/reviews/{$this->review->id}"),
            ],
        );
    }

    public function attachments(): array
    {
        return [];
    }
}
