<x-mail::message>
# Leave Request — Approval Required

Dear Line Manager,

**{{ $employeeName }}** ({{ $department }}) has submitted a leave request and requires your approval.

| Detail | Information |
|---|---|
| **Leave Type** | {{ $leaveType }} |
| **Start Date** | {{ $startDate }} |
| **End Date** | {{ $endDate }} |
| **Days Requested** | {{ $daysRequested }} working day(s) |
@if($reliever)
| **Reliever** | {{ $reliever }} |
@endif

@if($reason)
**Reason:**
{{ $reason }}
@endif

@if($documentUrl)
**Supporting Document:** A supporting document has been attached to this application. [View / Download Document]({{ $documentUrl }})
@endif

Please review and approve or reject this request at your earliest convenience.

<x-mail::button :url="$approvalUrl">
Review Leave Request
</x-mail::button>

If the button does not work, copy and paste this link:
{{ $approvalUrl }}

---
*This is an automated notification from the HR Management System.*

Thanks,
HR Department
</x-mail::message>
