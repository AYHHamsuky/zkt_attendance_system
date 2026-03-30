<x-mail::message>
# Action Required — KPI Plan Awaiting Your Agreement

Dear **{{ $managerName }}**,

**{{ $employeeName }}** has reviewed and agreed to their KPI objectives for the **{{ $cycleName }}** appraisal cycle.

Your agreement is now required to lock the planning stage and proceed to the next phase.

**What you need to do:**

1. Log in to the HR portal
2. Review the agreed objectives with your team member
3. Click **"I Agree"** to confirm the KPI plan

<x-mail::button :url="$appraisalUrl">
Review & Agree
</x-mail::button>

If the button above does not work, copy and paste this link into your browser:

{{ $appraisalUrl }}

---

*This is an automated notification from the HR Management System. Please do not reply to this email.*

Thanks,
HR Department
</x-mail::message>
