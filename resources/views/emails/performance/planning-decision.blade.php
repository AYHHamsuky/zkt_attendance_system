<x-mail::message>
@if ($approved)
# KPI Plan Approved ✓

Dear **{{ $recipientName }}**,

The KPI plan for **{{ $employeeName }}** in the **{{ $cycleName }}** appraisal cycle has been **approved by HR**.

The appraisal will now move to the Mid-Year Review phase. No further action is required at this stage.
@else
# KPI Plan Requires Revision

Dear **{{ $recipientName }}**,

The KPI plan for **{{ $employeeName }}** in the **{{ $cycleName }}** appraisal cycle has been **returned for revision** by HR.

@if ($rejectionReason)
**Reason:**

{{ $rejectionReason }}

@endif

**What needs to happen next:**

1. The employee and line manager must review the feedback above
2. Update the KPI objectives accordingly
3. Both parties must re-agree to the revised plan

The appraisal has been reset to draft status for revisions.
@endif

<x-mail::button :url="$appraisalUrl">
View Appraisal
</x-mail::button>

If the button above does not work, copy and paste this link into your browser:

{{ $appraisalUrl }}

---

*This is an automated notification from the HR Management System. Please do not reply to this email.*

Thanks,
HR Department
</x-mail::message>
