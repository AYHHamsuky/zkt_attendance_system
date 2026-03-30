<x-mail::message>
# KPI Plan Agreed & Pending HR Approval

Dear **{{ $recipientName }}**,

Both **{{ $employeeName }}** and **{{ $managerName }}** have agreed to the KPI objectives for the **{{ $cycleName }}** appraisal cycle.

The plan has been submitted to HR for approval. You will receive a notification once a decision has been made.

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
