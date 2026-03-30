<x-mail::message>
@if($phase === 'tracking')
# Performance Tracking Stage Now Open

Dear **{{ $recipientName }}**,

The **{{ $cycleName }}** appraisal cycle has moved to the **Tracking Stage (Stage 2)**.

During this stage, you are expected to track and record your progress against the KPI objectives agreed in the planning stage. Your line manager will also be monitoring your performance throughout this period.

@if($openDate || $closeDate)
**Tracking Period:**
@if($openDate)
- **Start:** {{ $openDate }}
@endif
@if($closeDate)
- **Deadline:** {{ $closeDate }}
@endif
@endif

**What you need to do:**

1. Log in to the HR portal and open your appraisal
2. Record your progress updates for each KPI objective
3. Ensure your updates are completed before the deadline

@elseif($phase === 'rating')
# Final Appraisal Stage Now Open

Dear **{{ $recipientName }}**,

The **{{ $cycleName }}** appraisal cycle has moved to the **Final Appraisal Stage (Stage 3)**.

This is the final stage where you will self-rate your performance against each KPI objective, and your line manager will independently score your achievements.

@if($openDate || $closeDate)
**Rating Period:**
@if($openDate)
- **Start:** {{ $openDate }}
@endif
@if($closeDate)
- **Deadline:** {{ $closeDate }}
@endif
@endif

**What you need to do:**

1. Log in to the HR portal and open your appraisal
2. Enter your yearly achieved results for each objective
3. Assign yourself a self-rating (A to E) for each KPI
4. Submit before the deadline so your line manager can complete their assessment

@else
# Appraisal Cycle Completed

Dear **{{ $recipientName }}**,

The **{{ $cycleName }}** appraisal cycle has been marked as **Completed**.

Your appraisal records have been finalised and are available for your reference in the HR portal.

@endif

<x-mail::button :url="$appraisalUrl">
Open My Appraisal
</x-mail::button>

If the button above does not work, copy and paste this link into your browser:

{{ $appraisalUrl }}

---

*This is an automated notification from the HR Management System. Please do not reply to this email.*

Thanks,
HR Department
</x-mail::message>
