<x-mail::message>
@if($approved)
# FYI — Leave Approved by HR

Dear Line Manager,

This is to inform you that **{{ $employeeName }}'s** leave application has been **fully approved by HR**.

@else
# FYI — Leave Rejected by HR

Dear Line Manager,

This is to inform you that **{{ $employeeName }}'s** leave application has been **rejected by HR**.

@if($rejectionReason)
**Rejection Reason:** {{ $rejectionReason }}
@endif

@endif

<x-mail::table>
| | |
|:---|:---|
| **Employee** | {{ $employeeName }} |
| **Leave Type** | {{ $leaveType }} |
| **Start Date** | {{ $startDate }} |
| **End Date** | {{ $endDate }} |
| **Days** | {{ $daysRequested }} working day(s) |
</x-mail::table>

No action is required from you. This email is for your records only.

<x-mail::button :url="$viewUrl">
View Application
</x-mail::button>

---

*This is an automated notification from the HR Management System. Please do not reply to this email.*

Thanks,
HR Department
</x-mail::message>
