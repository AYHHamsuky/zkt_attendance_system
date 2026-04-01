<x-mail::message>
# Leave Application — {{ ucfirst($decision) }}

Dear **{{ $employeeName }}**,

@if($decision === 'approved' && $isFinalApproval)
We are pleased to inform you that your leave application has been **fully approved** by HR. Your leave is now officially confirmed.
@elseif($decision === 'approved')
Your leave application has been **approved by your Line Manager** and has been forwarded to HR for final confirmation.
@else
We regret to inform you that your leave application has been **rejected** by {{ $stage === 'hr' ? 'HR' : 'your Line Manager' }}.
@endif

| Detail | Information |
|---|---|
| **Leave Type** | {{ $leaveType }} |
| **Start Date** | {{ $startDate }} |
| **End Date** | {{ $endDate }} |
| **Days Requested** | {{ $daysRequested }} working day(s) |

@if($decision === 'rejected' && $reason)
<x-mail::panel>
**Reason for Rejection:**
{{ $reason }}
</x-mail::panel>
@endif

<x-mail::button :url="$viewUrl">
View Application
</x-mail::button>

---
*This is an automated notification from the Kaduna Electric HRIS. Please do not reply to this email.*

Thanks,
HR Department
</x-mail::message>
