<x-mail::message>
# Performance Appraisal Assigned — Planning Stage

Dear **{{ $employeeName }}**,

Your **{{ $cycleName }}** performance appraisal has been created and is now in the **Planning Stage**.

In this stage, you and your line manager **{{ $reviewerName }}** will agree on your KPI objectives and targets for the appraisal period. No scores are assigned yet — this is about setting and agreeing on what you will be measured against.

**What you need to do:**

1. Log in to the HR portal and open your appraisal
2. Review the KPI objectives and targets listed for you
3. Click **"I Agree"** to confirm the objectives with your line manager

Once both you and your line manager have agreed, the planning stage will be locked and submitted to HR for final approval before the appraisal proceeds.

<x-mail::button :url="$appraisalUrl">
Review My KPI Plan
</x-mail::button>

If the button above does not work, copy and paste this link into your browser:

{{ $appraisalUrl }}

---

*This is an automated notification from the Kaduna Electric HRIS. Please do not reply to this email.*

Thanks,
HR Department
</x-mail::message>
