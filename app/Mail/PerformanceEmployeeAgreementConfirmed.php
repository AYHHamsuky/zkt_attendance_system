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
 * Confirmation sent to the employee after they agree on their KPI plan.
 */
class PerformanceEmployeeAgreementConfirmed extends Mailable
{
    use Queueable, SerializesModels;

    public function __construct(public PerformanceReview $review) {}

    public function envelope(): Envelope
    {
        return new Envelope(
            from: new Address(config('mail.hr_addresses.performance'), 'Kaduna Electric Performance'),
            subject: "KPI Plan Agreement Recorded — {$this->review->cycle->name}",
        );
    }

    public function content(): Content
    {
        return new Content(
            markdown: 'emails.performance.employee-agreement-confirmed',
            with: [
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
