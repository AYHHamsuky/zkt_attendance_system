<x-mail::message>
# Reliever Assignment Notice

Dear **{{ $relieverName }}**,

You have been designated as the **reliever** for **{{ $employeeName }}** during their approved leave period.

<x-mail::table>
| | |
|:---|:---|
| **Employee on Leave** | {{ $employeeName }} |
| **Leave Type** | {{ $leaveType }} |
| **From** | {{ $startDate }} |
| **To** | {{ $endDate }} |
| **Duration** | {{ $daysRequested }} working day(s) |
</x-mail::table>

Please ensure you are available to cover **{{ $employeeName }}'s** responsibilities during this period. If you have any concerns, please contact your Line Manager or HR as soon as possible.

---

*This is an automated notification from the Kaduna Electric HRIS. Please do not reply to this email.*

Thanks,
HR Department
</x-mail::message>
