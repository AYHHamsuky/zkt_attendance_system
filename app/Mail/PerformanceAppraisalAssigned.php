<?php

namespace App\Mail;

use App\Models\PerformanceReview;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Address;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class PerformanceAppraisalAssigned extends Mailable
{
    use Queueable, SerializesModels;

    public function __construct(public PerformanceReview $review) {}

    public function envelope(): Envelope
    {
        return new Envelope(
            from: new Address(config('mail.hr_addresses.performance'), 'Kaduna Electric Performance'),
            subject: "Performance Appraisal — {$this->review->cycle->name}",
        );
    }

    public function content(): Content
    {
        return new Content(
            markdown: 'emails.performance.appraisal-assigned',
            with: [
                'employeeName' => $this->review->employee->name,
                'cycleName' => $this->review->cycle->name,
                'reviewerName' => $this->review->reviewer->name,
                'appraisalUrl' => url("/hr/performance/reviews/{$this->review->id}"),
            ],
        );
    }

    public function attachments(): array
    {
        return [];
    }
}
