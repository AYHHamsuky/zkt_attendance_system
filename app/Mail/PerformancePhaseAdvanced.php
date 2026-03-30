<?php

namespace App\Mail;

use App\Models\PerformanceCycle;
use App\Models\PerformanceReview;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Address;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class PerformancePhaseAdvanced extends Mailable
{
    use Queueable, SerializesModels;

    public function __construct(
        public PerformanceCycle $cycle,
        public PerformanceReview $review,
        public string $phase,
        public string $recipientName,
    ) {}

    public function envelope(): Envelope
    {
        $phaseLabels = [
            'tracking' => 'Tracking Stage',
            'rating' => 'Final Appraisal Stage',
            'completed' => 'Appraisal Completed',
        ];

        $label = $phaseLabels[$this->phase] ?? ucfirst($this->phase);

        return new Envelope(
            from: new Address(config('mail.hr_addresses.performance'), 'Kaduna Electric Performance'),
            subject: "{$label} Now Open — {$this->cycle->name}",
        );
    }

    public function content(): Content
    {
        $phaseNumber = match ($this->phase) {
            'tracking' => 2,
            'rating' => 3,
            default => null,
        };

        $openDate = $phaseNumber ? $this->cycle->{"phase{$phaseNumber}_open_date"} : null;
        $closeDate = $phaseNumber ? $this->cycle->{"phase{$phaseNumber}_close_date"} : null;

        return new Content(
            markdown: 'emails.performance.phase-advanced',
            with: [
                'recipientName' => $this->recipientName,
                'cycleName' => $this->cycle->name,
                'phase' => $this->phase,
                'openDate' => $openDate?->format('d M Y'),
                'closeDate' => $closeDate?->format('d M Y'),
                'appraisalUrl' => url("/hr/performance/reviews/{$this->review->id}"),
            ],
        );
    }

    public function attachments(): array
    {
        return [];
    }
}
