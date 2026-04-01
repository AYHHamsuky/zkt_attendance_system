<x-mail::message>
# KPI Plan Agreement Recorded

Dear **{{ $employeeName }}**,

Your agreement on the KPI objectives for the **{{ $cycleName }}** appraisal cycle has been successfully recorded.

**What happens next:**

Your line manager **{{ $managerName }}** will review and agree to the same objectives. Once both parties have agreed, the planning stage will be locked and submitted to HR for approval.

You will receive another notification when:
- Your line manager agrees
- HR approves or returns the plan

<x-mail::button :url="$appraisalUrl">
View My Appraisal
</x-mail::button>

If the button above does not work, copy and paste this link into your browser:

{{ $appraisalUrl }}

---

*This is an automated notification from the Kaduna Electric HRIS. Please do not reply to this email.*

Thanks,
HR Department
</x-mail::message>
