<?php

namespace App\Mail;

use App\Models\PerformanceReview;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Address;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class PerformanceManagerAgreed extends Mailable
{
    use Queueable, SerializesModels;

    public function __construct(public PerformanceReview $review) {}

    public function envelope(): Envelope
    {
        return new Envelope(
            from: new Address(config('mail.hr_addresses.performance'), 'Kaduna Electric Performance'),
            subject: "Action Required — KPI Plan Awaiting Your Agreement: {$this->review->cycle->name}",
        );
    }

    public function content(): Content
    {
        return new Content(
            markdown: 'emails.performance.manager-agreed',
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
