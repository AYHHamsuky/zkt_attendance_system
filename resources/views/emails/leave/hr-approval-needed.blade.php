<x-mail::message>
# HR Final Approval Required

Dear HR Officer,

A leave application has been approved by the Line Manager (**{{ $lmName }}**) and now requires your final approval.

| Detail | Information |
|---|---|
| **Employee** | {{ $employeeName }} |
| **Department** | {{ $department }} |
| **Leave Type** | {{ $leaveType }} |
| **Start Date** | {{ $startDate }} |
| **End Date** | {{ $endDate }} |
| **Days Requested** | {{ $daysRequested }} working day(s) |

@if($documentUrl)
**Supporting Document:** A supporting document has been submitted with this application. [View / Download Document]({{ $documentUrl }})

@endif
Please review the application and provide the final approval or rejection.

<x-mail::button :url="$approvalUrl">
Review & Approve
</x-mail::button>

If the button does not work, copy and paste this link:
{{ $approvalUrl }}

---
*This is an automated notification from the HR Management System.*

Thanks,
HR Management System
</x-mail::message>
