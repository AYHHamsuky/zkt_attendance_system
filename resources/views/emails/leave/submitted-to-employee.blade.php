<x-mail::message>
# Leave Application Received

Dear **{{ $employeeName }}**,

Your leave application has been successfully submitted and is now **awaiting approval from your Line Manager**.

<x-mail::table>
| | |
|:---|:---|
| **Leave Type** | {{ $leaveType }} |
| **Start Date** | {{ $startDate }} |
| **End Date** | {{ $endDate }} |
| **Days Requested** | {{ $daysRequested }} working day(s) |
| **Status** | Pending Line Manager Review |
</x-mail::table>

You will receive another notification once your Line Manager has reviewed your application.

<x-mail::button :url="$viewUrl">
View My Application
</x-mail::button>

---

*This is an automated notification from the HR Management System. Please do not reply to this email.*

Thanks,
HR Department
</x-mail::message>
