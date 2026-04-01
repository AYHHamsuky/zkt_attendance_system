import type { DriveStep } from 'driver.js';

export type TourId =
    | 'main'
    | 'leave_overview'
    | 'leave_apply'
    | 'performance_mine'
    | 'performance_review'
    | 'profile_update'
    | 'nominal_roll'
    | 'hr_leave_management'
    | 'hr_performance_management'
    | 'hr_contracts'
    | 'hr_documents';

export type RoleTour = {
    id: TourId;
    label: string;
    description: string;
    /** Empty = visible to all roles. Otherwise only listed roles see this tour. */
    roles: string[];
    /** The app path the user should be on for this tour to work. Used by help dropdown. */
    path?: string;
    steps: DriveStep[];
};

// ─────────────────────────────────────────────────────────────────────────────
// MAIN NAVIGATION OVERVIEW  (all roles, any page)
// ─────────────────────────────────────────────────────────────────────────────
const mainTour: RoleTour = {
    id: 'main',
    label: 'System Overview',
    description: 'A guided walk-through of the main navigation and key features.',
    roles: [],
    steps: [
        {
            popover: {
                title: '👋 Welcome to the Kaduna Electric HR Portal',
                description:
                    'This system is your central hub for leave, performance appraisals, contracts, attendance, and all your HR records. Let\'s take a quick tour so you know where everything is.',
            },
        },
        {
            element: '[data-tour="sidebar"]',
            popover: {
                title: 'Navigation Sidebar',
                description:
                    'The sidebar on the left is your main navigation menu. Click any item to navigate to the desired module. Use the <strong>arrow icon</strong> at the top to collapse it and give yourself more screen space.',
                side: 'right',
                align: 'start',
            },
        },
        {
            element: '[data-tour="nav-dashboard"]',
            popover: {
                title: 'Dashboard',
                description:
                    'This takes you to your personal dashboard — a snapshot of your attendance, recent activity, and key metrics for the current period.',
                side: 'right',
                align: 'center',
            },
        },
        {
            element: '[data-tour="nav-hr"]',
            popover: {
                title: 'HRIS Module',
                description:
                    'The <strong>HRIS</strong> section contains all the HR tools you need. Click the label to expand or collapse this section and see the individual modules inside.',
                side: 'right',
                align: 'start',
            },
            onHighlighted: () => {
                // Ensure the HRIS collapsible is open so subsequent steps can find the nav items
                const leaveItem = document.querySelector('[data-tour="nav-hr-leave"]');
                const isVisible = leaveItem && leaveItem.getBoundingClientRect().height > 0;
                if (!isVisible) {
                    const toggle = document.querySelector<HTMLElement>('[data-tour="nav-hr"] [data-tour-module-toggle]');
                    toggle?.click();
                }
            },
        },
        {
            element: '[data-tour="nav-hr-leave"]',
            popover: {
                title: 'Leave',
                description:
                    'Apply for leave, track your leave balance, and (for HR/managers) approve or reject employee leave requests. The system follows a two-stage approval workflow: Line Manager → HR.',
                side: 'right',
                align: 'center',
            },
        },
        {
            element: '[data-tour="nav-hr-nominal-roll"]',
            popover: {
                title: 'Staff List',
                description:
                    'Browse the complete staff directory for Kaduna Electric. View each employee\'s HR profile, line manager, department, and employment history.',
                side: 'right',
                align: 'center',
            },
        },
        {
            element: '[data-tour="nav-hr-contracts"]',
            popover: {
                title: 'Contracts',
                description:
                    'View and manage employment contracts. Contracts approaching expiry are flagged on the HR Dashboard so renewals are never missed.',
                side: 'right',
                align: 'center',
            },
        },
        {
            element: '[data-tour="nav-hr-documents"]',
            popover: {
                title: 'Documents',
                description:
                    'Store and retrieve official HR documents — appointment letters, certificates, disciplinary notices, and more — securely linked to each employee.',
                side: 'right',
                align: 'center',
            },
        },
        {
            element: '[data-tour="nav-hr-transfers"]',
            popover: {
                title: 'Transfers',
                description:
                    'Record and process staff transfers between departments, units, or locations. Completing a transfer automatically updates the employee\'s profile.',
                side: 'right',
                align: 'center',
            },
        },
        {
            element: '[data-tour="nav-hr-resignations"]',
            popover: {
                title: 'Resignations',
                description:
                    'Manage employee resignations and exit checklists. When all checklist items are marked complete and the resignation is accepted, the employee\'s account is automatically deactivated.',
                side: 'right',
                align: 'center',
            },
        },
        {
            element: '[data-tour="help-button"]',
            popover: {
                title: '? Help & Tutorials',
                description:
                    'This <strong>?</strong> button is always available in the top-right corner of every page. Click it to restart this tour or jump directly into a module tutorial at any time.',
                side: 'bottom',
                align: 'end',
            },
        },
        {
            popover: {
                title: '✅ You\'re all set!',
                description:
                    'You\'ve completed the system overview. As you navigate to each module — Leave, Performance, Profile — a short tutorial will automatically guide you through that section on your first visit. You can always re-launch any tutorial from the <strong>?</strong> button.',
            },
        },
    ],
};

// ─────────────────────────────────────────────────────────────────────────────
// LEAVE — OVERVIEW  (Leave/Index page)
// ─────────────────────────────────────────────────────────────────────────────
const leaveOverviewTour: RoleTour = {
    id: 'leave_overview',
    label: 'Leave — Overview',
    description: 'Learn how to read your leave history, check balances, and understand leave statuses.',
    roles: [],
    path: '/hr/leave',
    steps: [
        {
            popover: {
                title: '📅 Leave Applications',
                description:
                    'This page is your leave hub. You can see all your submitted leave requests, their current approval status, and how many days remain in your entitlement. Let\'s walk through everything on this page.',
            },
        },
        {
            element: '[data-tour="leave-page-header"]',
            popover: {
                title: 'Page Title & Total Count',
                description:
                    'The heading shows whose leave applications are listed. If you are a regular employee, you see only your own. HR staff and managers see all employees\' applications. The number below is the total count currently matching your filters.',
                side: 'bottom',
                align: 'start',
            },
        },
        {
            element: '[data-tour="leave-new-btn"]',
            popover: {
                title: '➕ New Application',
                description:
                    'Click <strong>New Application</strong> to apply for leave. You\'ll fill in the leave type, dates, reliever, and optionally upload a supporting document. The next tutorial (Leave — How to Apply) walks through that form in detail.',
                side: 'bottom',
                align: 'end',
            },
        },
        {
            element: '[data-tour="leave-table"]',
            popover: {
                title: 'Applications Table',
                description:
                    'Each row is a leave application. You can see the employee name, leave type, date range (<strong>Start → End</strong>), number of working days requested, and the current status badge. Click the <strong>eye icon</strong> on any row to see the full detail view including the approval trail and any rejection reasons.',
                side: 'top',
                align: 'start',
            },
        },
        {
            element: '[data-tour="leave-status-help"]',
            popover: {
                title: '🏷️ What Do the Status Labels Mean?',
                description:
                    '<strong>Pending LM</strong> — Submitted and awaiting your Line Manager\'s approval.<br>'
                    + '<strong>Pending HR</strong> — Line Manager approved it; now awaiting final HR sign-off.<br>'
                    + '<strong>Approved</strong> — Fully approved by both LM and HR. The days are deducted from your balance.<br>'
                    + '<strong>LM Rejected</strong> — Your Line Manager declined the request.<br>'
                    + '<strong>Rejected</strong> — HR declined the request after LM approval.<br>'
                    + '<strong>Cancelled</strong> — Withdrawn by the employee before approval.',
                side: 'top',
            },
        },
        {
            popover: {
                title: '🔄 The Two-Stage Approval Workflow',
                description:
                    'Every leave request goes through two stages:<br><br>'
                    + '<strong>Stage 1 — Line Manager:</strong> Your direct manager reviews and approves or rejects your request. You receive an email notification of their decision.<br><br>'
                    + '<strong>Stage 2 — HR Final Approval:</strong> After LM approval, HR gives the final sign-off. You receive another email when this is done.<br><br>'
                    + 'You are notified by email at every step of the process.',
            },
        },
        {
            popover: {
                title: '📊 Leave Types & Eligibility Rules',
                description:
                    'Kaduna Electric offers several types of leave, each with its own entitlement:<br><br>'
                    + '• <strong>Annual Leave</strong> — Your standard yearly entitlement. Must be fully used before Leave of Absence or Leave Without Pay becomes available.<br>'
                    + '• <strong>Sick Leave</strong> — Requires a medical certificate upload.<br>'
                    + '• <strong>Leave of Absence</strong> — Only available once Annual Leave is exhausted.<br>'
                    + '• <strong>Leave Without Pay</strong> — Unpaid leave; only available after Annual Leave is exhausted.',
            },
        },
        {
            popover: {
                title: '💡 Tips for Leave Applications',
                description:
                    '• <strong>Check your balance first</strong> — Your remaining days are shown on the application form when you select a leave type.<br>'
                    + '• <strong>Weekends & public holidays are excluded</strong> — The system calculates only working days.<br>'
                    + '• <strong>Apply in advance</strong> — Your line manager needs time to review and arrange cover.<br>'
                    + '• <strong>Reliever required</strong> — You must nominate a colleague to cover your duties for most leave types.',
            },
        },
    ],
};

// ─────────────────────────────────────────────────────────────────────────────
// LEAVE — APPLYING  (Leave/Create page)
// ─────────────────────────────────────────────────────────────────────────────
const leaveApplyTour: RoleTour = {
    id: 'leave_apply',
    label: 'Leave — How to Apply',
    description: 'Step-by-step guide to submitting a leave request correctly.',
    roles: [],
    path: '/hr/leave/create',
    steps: [
        {
            popover: {
                title: '📝 Applying for Leave — Step by Step',
                description:
                    'This form is how you submit a leave request. It takes about two minutes to fill in. Your line manager will receive an email notification as soon as you submit. Let\'s go through each field.',
            },
        },
        {
            element: '[data-tour="leave-form-employee"]',
            popover: {
                title: 'Step 1 — Your Name',
                description:
                    'This field is pre-filled with your name and cannot be changed (it\'s tied to your login). If you are HR or an admin, you can click here to change it and apply leave on behalf of another employee.',
                side: 'bottom',
            },
        },
        {
            element: '[data-tour="leave-form-type"]',
            popover: {
                title: 'Step 2 — Choose Your Leave Type',
                description:
                    'Select the type of leave you need:<br>'
                    + '• <strong>Annual Leave</strong> — Your standard yearly entitlement<br>'
                    + '• <strong>Sick Leave</strong> — Requires a medical certificate<br>'
                    + '• <strong>Leave of Absence</strong> — Only if Annual Leave is exhausted<br>'
                    + '• <strong>Leave Without Pay</strong> — Unpaid; only if Annual Leave is exhausted<br><br>'
                    + 'Once selected, your remaining balance for that type is shown below.',
                side: 'bottom',
            },
        },
        {
            element: '[data-tour="leave-form-balance"]',
            popover: {
                title: 'Your Leave Balance',
                description:
                    'This tells you exactly how many days you have left for the selected leave type. It shows:<br>'
                    + '• <strong>Total allowed</strong> for the year (e.g. 30 days)<br>'
                    + '• <strong>Already taken</strong> — days from approved past leave<br>'
                    + '• <strong>Pending</strong> — days from applications still awaiting approval<br>'
                    + '• <strong>Remaining</strong> — what you can still apply for<br><br>'
                    + 'The system will block your submission if your request exceeds the remaining balance.',
                side: 'bottom',
            },
        },
        {
            element: '[data-tour="leave-form-dates"]',
            popover: {
                title: 'Step 3 — Set Your Dates',
                description:
                    'Select your <strong>Start Date</strong> and <strong>End Date</strong>. As soon as both are set, the system automatically:<br>'
                    + '• Counts only weekdays (Monday–Friday)<br>'
                    + '• Deducts any public holidays within the period<br>'
                    + '• Shows you a blue summary of working days that will be deducted<br><br>'
                    + 'A warning will appear if the calculated days exceed your balance.',
                side: 'bottom',
            },
        },
        {
            element: '[data-tour="leave-form-reliever"]',
            popover: {
                title: 'Step 4 — Nominate a Reliever',
                description:
                    'You must nominate a <strong>reliever</strong> — a colleague who will handle your responsibilities while you are away. Type their name in the search box and select them from the list. The system will automatically notify your reliever when your leave is approved.',
                side: 'top',
            },
        },
        {
            element: '[data-tour="leave-form-document"]',
            popover: {
                title: 'Step 5 — Upload Supporting Document (if required)',
                description:
                    'For <strong>Sick Leave</strong>, you must attach a medical certificate or doctor\'s note. The upload box only appears when the selected leave type requires it. Accepted formats: PDF, JPG, or PNG (max 5MB). Without this document, the form cannot be submitted.',
                side: 'top',
            },
        },
        {
            element: '[data-tour="leave-form-reason"]',
            popover: {
                title: 'Step 6 — Reason for Leave',
                description:
                    'Write a brief explanation for your leave request. This is visible to your line manager and HR when they review the application. Be clear and professional — this is part of your official HR record.',
                side: 'top',
            },
        },
        {
            element: '[data-tour="leave-form-submit"]',
            popover: {
                title: '✅ Step 7 — Submit Your Application',
                description:
                    'Once all fields are correctly filled in, click <strong>Submit Application</strong>. The button is disabled if your request exceeds your balance — fix the dates first.<br><br>'
                    + 'After submission:<br>'
                    + '1. You receive a confirmation email<br>'
                    + '2. Your Line Manager receives an email to review<br>'
                    + '3. You are notified at each approval stage',
                side: 'top',
                align: 'end',
            },
        },
        {
            popover: {
                title: '📬 What Happens After You Submit?',
                description:
                    'Your application status will show as <strong>Pending LM</strong> on the Leave list. You can track it there at any time.<br><br>'
                    + 'If your manager approves it, it moves to <strong>Pending HR</strong> for final sign-off. Once HR approves, it becomes <strong>Approved</strong> and the days are deducted from your balance.<br><br>'
                    + 'If it is rejected at any stage, you will receive an email with the reason.',
            },
        },
    ],
};

// ─────────────────────────────────────────────────────────────────────────────
// PERFORMANCE — MY APPRAISALS LIST  (Performance/Reviews/Mine page)
// ─────────────────────────────────────────────────────────────────────────────
const performanceMineTour: RoleTour = {
    id: 'performance_mine',
    label: 'Performance — My Appraisals',
    description: 'Understand your assigned appraisal cycles, statuses, and the BSC grading system.',
    roles: [],
    path: '/hr/performance/my-appraisals',
    steps: [
        {
            popover: {
                title: '⭐ Welcome to Performance Appraisals',
                description:
                    'The Kaduna Electric performance system uses a <strong>Balanced Scorecard (BSC)</strong> framework. Your work is measured across four categories:<br><br>'
                    + '📊 <strong>Financials</strong> — revenue, cost, and financial targets<br>'
                    + '👥 <strong>Customers</strong> — service quality and satisfaction<br>'
                    + '⚙️ <strong>Internal Processes</strong> — operational efficiency<br>'
                    + '📚 <strong>Learning & Growth</strong> — skills and development<br><br>'
                    + 'Each category contains specific KPIs (Key Performance Indicators) assigned to your role.',
            },
        },
        {
            element: '[data-tour="perf-mine-header"]',
            popover: {
                title: 'Your Appraisal History',
                description:
                    'This page lists every appraisal cycle HR has assigned to you — one card per appraisal period (e.g. Annual 2025, Annual 2024). You can track all historical appraisals here and see your progress over time.',
                side: 'bottom',
                align: 'start',
            },
        },
        {
            element: '[data-tour="perf-reviews-grid"]',
            popover: {
                title: 'Reading an Appraisal Card',
                description:
                    'Each card shows:<br>'
                    + '• <strong>Cycle name and year</strong> — the appraisal period<br>'
                    + '• <strong>Status badge</strong> — where you currently are in the workflow<br>'
                    + '• <strong>Progress steps</strong> — Self → Manager → Final (checkmarks fill in as each stage completes)<br>'
                    + '• <strong>Open Appraisal button</strong> — click to enter the appraisal form<br><br>'
                    + 'A card showing <em>Pending</em> means it is your turn to act.',
                side: 'top',
            },
        },
        {
            popover: {
                title: '🔄 The Four-Stage Appraisal Workflow',
                description:
                    'Every appraisal moves through four stages:<br><br>'
                    + '<strong>1. Pending (Self-Appraisal)</strong> — HR opens the cycle and you fill in your KPI ratings and comments. This is your chance to assess yourself before your manager does.<br><br>'
                    + '<strong>2. Submitted (Manager Review)</strong> — After you submit, your Line Manager sees your self-ratings and adds their own scoring. You cannot edit at this stage.<br><br>'
                    + '<strong>3. Acknowledged</strong> — The manager\'s scores are shared with you. You click "Acknowledge" to confirm you have reviewed them.<br><br>'
                    + '<strong>4. Finalized</strong> — HR locks the appraisal. Your final score and grade are recorded in your HR profile.',
            },
        },
        {
            popover: {
                title: '📊 The BSC Grading System Explained',
                description:
                    'Each KPI is rated on a 1–5 scale with letter grades:<br><br>'
                    + '<strong>E (1 — 20%)</strong> — Below expectation. Significant improvement needed.<br>'
                    + '<strong>D (2 — 40%)</strong> — Partially meets expectation. Some areas met, others missed.<br>'
                    + '<strong>C (3 — 60%)</strong> — Meets expectation. Solid performance against target.<br>'
                    + '<strong>B (4 — 80%)</strong> — Exceeds expectation. Above-target delivery.<br>'
                    + '<strong>A (5 — 100%)</strong> — Outstanding. Exceptional performance.<br><br>'
                    + '<em>Final score = sum of (your rating × KPI weight) / (total weight × 5) × 100</em>',
            },
        },
        {
            popover: {
                title: '⚖️ How KPI Weights Work',
                description:
                    'Each KPI has a <strong>weight percentage</strong> that reflects how important it is to your role. For example:<br><br>'
                    + '• A KPI with 20% weight counts twice as much as one with 10%<br>'
                    + '• All weights in your appraisal typically sum to 100%<br>'
                    + '• A high score on a heavily-weighted KPI will significantly boost your final grade<br><br>'
                    + 'You can see each KPI\'s weight in the objectives table on the appraisal form.',
            },
        },
        {
            element: '[data-tour="perf-reviews-grid"]',
            popover: {
                title: '👆 How to Start Your Self-Appraisal',
                description:
                    'Find the card with <strong>Pending</strong> status and click <strong>Open Appraisal</strong>. This takes you to the full appraisal form where you will rate each KPI and add your comments. The next tutorial — <em>Performance — Completing Your Appraisal</em> — walks through that form step by step.',
                side: 'top',
            },
        },
    ],
};

// ─────────────────────────────────────────────────────────────────────────────
// PERFORMANCE — COMPLETING AN APPRAISAL  (Performance/Reviews/Show page)
// ─────────────────────────────────────────────────────────────────────────────
const performanceReviewTour: RoleTour = {
    id: 'performance_review',
    label: 'Performance — Completing Your Appraisal',
    description: 'How to rate your KPIs, add training needs, and submit your self-appraisal.',
    roles: [],
    path: '/hr/performance/my-appraisals',
    steps: [
        {
            popover: {
                title: '📋 Inside Your Appraisal Form',
                description:
                    'This form is where you do your self-assessment. It contains all the KPIs assigned to your role for this appraisal cycle, grouped by BSC category. Work through each one carefully — your ratings and comments form the basis of your annual performance record.',
            },
        },
        {
            element: '[data-tour="perf-review-header"]',
            popover: {
                title: 'Appraisal Header',
                description:
                    'The header shows the <strong>cycle name</strong> (e.g. Annual 2025), your <strong>job title</strong> at the time of this review, and the current <strong>status badge</strong>. When the status is <em>Pending</em>, you can edit the form. Once you submit, editing is locked until the process completes.',
                side: 'bottom',
                align: 'start',
            },
        },
        {
            element: '[data-tour="perf-objectives-section"]',
            popover: {
                title: 'Your KPI Objectives Table',
                description:
                    'Each row is one of your KPIs. The columns are:<br>'
                    + '• <strong>BSC Category</strong> — which scorecard quadrant this falls under<br>'
                    + '• <strong>Description</strong> — what you are expected to deliver<br>'
                    + '• <strong>KPI</strong> — how your performance on this objective is measured<br>'
                    + '• <strong>Target</strong> — the specific goal set for this period<br>'
                    + '• <strong>Weight %</strong> — how much this KPI contributes to your final score<br><br>'
                    + 'Scroll right to see the rating and progress columns.',
                side: 'top',
                align: 'start',
            },
        },
        {
            element: '[data-tour="perf-self-rating"]',
            popover: {
                title: 'Rating Yourself — D / C / B / A / A+',
                description:
                    'For each KPI, select your honest self-rating:<br><br>'
                    + '• Click <strong>D</strong> — if you did not meet the target<br>'
                    + '• Click <strong>C</strong> — if you partially met the target<br>'
                    + '• Click <strong>B</strong> — if you fully met the target<br>'
                    + '• Click <strong>A</strong> — if you exceeded the target<br>'
                    + '• Click <strong>A+</strong> — if you delivered exceptional results<br><br>'
                    + '<em>Be honest and realistic. Your manager will see your self-rating alongside theirs, and large discrepancies may prompt a discussion.</em>',
                side: 'left',
            },
        },
        {
            element: '[data-tour="perf-progress-status"]',
            popover: {
                title: 'Progress Status',
                description:
                    'For each KPI, also mark its progress status:<br><br>'
                    + '• <strong>On Track</strong> — you are meeting or ahead of target<br>'
                    + '• <strong>Off Track</strong> — you are behind target and need support<br>'
                    + '• <strong>No More Required</strong> — this objective is no longer applicable<br><br>'
                    + 'This helps your manager quickly identify where you may need coaching or resources.',
                side: 'left',
            },
        },
        {
            element: '[data-tour="perf-training-needs"]',
            popover: {
                title: 'Training & Development Needs',
                description:
                    'At the bottom of the form, you can add training needs you identified during the year. For each need, you specify:<br><br>'
                    + '• <strong>Training Name</strong> — what course or skill area<br>'
                    + '• <strong>Skill Gap</strong> — what you currently lack<br>'
                    + '• <strong>Type</strong> — classroom, on-the-job, e-learning, mentoring, etc.<br>'
                    + '• <strong>Priority</strong> — High / Medium / Low<br>'
                    + '• <strong>Target Date</strong> — when you want to complete it<br><br>'
                    + 'Click <strong>Add Training Need</strong> to add a row. Your manager and HR review these as part of your development plan.',
                side: 'top',
                align: 'start',
            },
        },
        {
            element: '[data-tour="perf-employee-comment"]',
            popover: {
                title: 'Your Overall Comment',
                description:
                    'Write a summary of your performance this year. This is your opportunity to:<br>'
                    + '• Highlight key achievements not fully captured in the KPI table<br>'
                    + '• Explain any circumstances that affected your performance<br>'
                    + '• State your goals for the next appraisal period<br><br>'
                    + 'This comment is visible to your manager and HR and is stored permanently in your HR record.',
                side: 'top',
            },
        },
        {
            element: '[data-tour="perf-submit-btn"]',
            popover: {
                title: '📤 Saving vs Submitting',
                description:
                    'You have two options:<br><br>'
                    + '• <strong>Save Draft</strong> — saves your ratings without submitting. You can come back and continue editing later. Use this if you need more time.<br><br>'
                    + '• <strong>Submit for Review</strong> — finalises your self-appraisal and notifies your Line Manager to begin their assessment. <em>You cannot edit your ratings after submitting.</em><br><br>'
                    + 'Make sure all KPIs are rated before you submit.',
                side: 'top',
                align: 'end',
            },
        },
        {
            popover: {
                title: '📬 What Happens After You Submit?',
                description:
                    'After submission:<br><br>'
                    + '1. Your appraisal status changes to <strong>Submitted</strong><br>'
                    + '2. Your Line Manager receives an email notification<br>'
                    + '3. The manager opens the form, sees your self-ratings in blue, and adds their own scores<br>'
                    + '4. Once the manager submits, you receive an email — go back to the form to see the manager\'s ratings<br>'
                    + '5. Click <strong>Acknowledge</strong> to confirm you have reviewed the manager\'s scores<br>'
                    + '6. HR finalises the appraisal and your grade is recorded',
            },
        },
        {
            popover: {
                title: '✅ Tips for a Strong Appraisal',
                description:
                    '• <strong>Use numbers</strong> — "Reduced downtime by 15%" is stronger than "Improved performance"<br>'
                    + '• <strong>Rate all KPIs</strong> — don\'t leave any blank before submitting<br>'
                    + '• <strong>Be timely</strong> — HR sets deadlines; late self-appraisals delay the whole cycle<br>'
                    + '• <strong>Add real training needs</strong> — they feed directly into your Personal Development Plan<br>'
                    + '• <strong>Save often</strong> — use Save Draft regularly to avoid losing your work',
            },
        },
    ],
};

// ─────────────────────────────────────────────────────────────────────────────
// PROFILE UPDATE  (settings/Profile page)
// ─────────────────────────────────────────────────────────────────────────────
const profileUpdateTour: RoleTour = {
    id: 'profile_update',
    label: 'Profile & Account Settings',
    description: 'How to update your name, email, password, and security settings.',
    roles: [],
    path: '/settings/profile',
    steps: [
        {
            popover: {
                title: '👤 Your Profile & Account Settings',
                description:
                    'The Settings area lets you manage your personal account — your display name, email address, password, and security options like Two-Factor Authentication.',
            },
        },
        {
            element: '[data-tour="settings-nav"]',
            popover: {
                title: 'Settings Navigation',
                description:
                    'Use this left sidebar to switch between the different settings sections: <strong>Profile</strong>, <strong>Password</strong>, <strong>Two-Factor Auth</strong>, and <strong>Appearance</strong>.',
                side: 'right',
                align: 'start',
            },
        },
        {
            element: '[data-tour="profile-form"]',
            popover: {
                title: 'Update Your Profile',
                description:
                    'You can update your display <strong>Name</strong> and <strong>Email Address</strong> here. Your email is used for login and all system notifications — keep it accurate.',
                side: 'right',
                align: 'start',
            },
        },
        {
            element: '[data-tour="profile-name"]',
            popover: {
                title: 'Display Name',
                description:
                    'This is how your name appears throughout the system — in appraisals, leave requests, the nominal roll, and email notifications. Use your full official name.',
                side: 'bottom',
            },
        },
        {
            element: '[data-tour="profile-email"]',
            popover: {
                title: 'Email Address',
                description:
                    'Your official Kaduna Electric email address. All system alerts — leave approvals, appraisal assignments, and HR notifications — are sent to this address.',
                side: 'bottom',
            },
        },
        {
            element: '[data-tour="profile-save"]',
            popover: {
                title: 'Save Changes',
                description:
                    'Click <strong>Save</strong> after making any changes to your profile. The page will confirm success with a green notification.',
                side: 'top',
                align: 'end',
            },
        },
        {
            popover: {
                title: '🔐 Keep Your Account Secure',
                description:
                    'We strongly recommend:<br>'
                    + '• Changing your password from the default (especially if imported with your Payroll ID).<br>'
                    + '• Enabling <strong>Two-Factor Authentication (2FA)</strong> under Settings → Two-Factor Auth for an extra layer of security.<br>'
                    + 'You can access these from the Settings navigation on the left.',
            },
        },
    ],
};

// ─────────────────────────────────────────────────────────────────────────────
// NOMINAL ROLL  (HR/admin/super_admin only)
// ─────────────────────────────────────────────────────────────────────────────
const nominalRollTour: RoleTour = {
    id: 'nominal_roll',
    label: 'Nominal Roll — Staff Directory',
    description: 'How to search employee records and use the org chart.',
    roles: ['admin', 'hr', 'super_admin'],
    path: '/hr/nominal-roll',
    steps: [
        {
            popover: {
                title: '👥 The Nominal Roll',
                description:
                    'The Nominal Roll is the complete staff directory for Kaduna Electric. It stores every employee\'s HR profile, including their personal details, payroll ID, line manager, and employment history.',
            },
        },
        {
            element: '[data-tour="nominal-search"]',
            popover: {
                title: 'Search & Filter',
                description:
                    'Type a name, department, or position to quickly find any employee. You can also switch between the <strong>All Staff</strong> list and the <strong>Departments</strong> grouped view using the tabs.',
                side: 'bottom',
            },
        },
        {
            element: '[data-tour="nominal-org-chart"]',
            popover: {
                title: 'Organisation Chart',
                description:
                    'Click <strong>Org Chart</strong> to see the reporting hierarchy as an interactive drill-down tree. You can click any employee to see who they report to and who reports to them.',
                side: 'bottom',
                align: 'end',
            },
        },
        {
            popover: {
                title: '📋 Employee Profile Tabs',
                description:
                    'When you open an individual employee\'s record, you\'ll find several tabs:<br>'
                    + '<strong>HR Profile</strong> — personal, employment, and family details.<br>'
                    + '<strong>Contracts</strong> — all employment contracts on file.<br>'
                    + '<strong>Documents</strong> — uploaded HR documents (certificates, letters, etc.).<br>'
                    + '<strong>Change History</strong> — an audit log of every field change, who made it, and when.',
            },
        },
    ],
};

// ─────────────────────────────────────────────────────────────────────────────
// HR LEAVE MANAGEMENT  (HR/admin only)
// ─────────────────────────────────────────────────────────────────────────────
const hrLeaveManagementTour: RoleTour = {
    id: 'hr_leave_management',
    label: 'HR — Managing Leave Applications',
    description: 'How to approve, reject, and manage employee leave as HR or a manager.',
    roles: ['admin', 'hr', 'super_admin'],
    path: '/hr/leave',
    steps: [
        {
            popover: {
                title: '📋 Managing Employee Leave',
                description:
                    'As HR or an admin, you have access to all leave applications across the organisation. Leave follows a <strong>two-stage approval workflow</strong>: Line Manager → HR Final Approval.',
            },
        },
        {
            element: '[data-tour="leave-filters"]',
            popover: {
                title: 'Filter & Search',
                description:
                    'Use the search box to find a specific employee. Filter by <strong>Status</strong> (Pending LM, Pending HR, Approved, etc.) or by <strong>Leave Type</strong> to focus on what needs attention.',
                side: 'bottom',
            },
        },
        {
            element: '[data-tour="leave-table"]',
            popover: {
                title: 'Action Buttons on Each Row',
                description:
                    '<strong>Stage 1 (green ✓ / red ✗)</strong> — Line Manager approval buttons appear when status is <em>Pending LM</em>.<br>'
                    + '<strong>Stage 2 (green ✓ / red ✗)</strong> — HR final approval buttons appear when status is <em>Pending HR</em>.<br>'
                    + 'The <strong>eye icon</strong> opens the full detail view including reason and supporting documents.',
                side: 'top',
            },
        },
        {
            element: '[data-tour="leave-new-btn"]',
            popover: {
                title: 'Apply On Behalf of an Employee',
                description:
                    'HR staff can also click <strong>New Application</strong> and select a different employee from the dropdown to submit leave on their behalf.',
                side: 'bottom',
                align: 'end',
            },
        },
        {
            popover: {
                title: '⚙️ Leave Types & Public Holidays',
                description:
                    'To configure the types of leave available (e.g. Annual Leave, Sick Leave, Study Leave) and their entitlements, go to <strong>Leave → Manage Leave Types</strong>. Public holidays that affect working day calculations are managed under <strong>Leave → Public Holidays</strong>.',
            },
        },
    ],
};

// ─────────────────────────────────────────────────────────────────────────────
// HR PERFORMANCE MANAGEMENT  (HR/admin only)
// ─────────────────────────────────────────────────────────────────────────────
const hrPerformanceManagementTour: RoleTour = {
    id: 'hr_performance_management',
    label: 'HR — Managing Performance Cycles',
    description: 'How to create cycles, assign appraisals, and advance phases.',
    roles: ['admin', 'hr', 'super_admin'],
    path: '/hr/performance/cycles',
    steps: [
        {
            popover: {
                title: '⭐ Performance Cycle Management',
                description:
                    'As HR, you control the appraisal lifecycle. You create cycles, assign templates to employees, advance phases, and give final HR sign-off after the manager\'s review.',
            },
        },
        {
            element: '[data-tour="perf-cycle-header"]',
            popover: {
                title: 'Active Cycle',
                description:
                    'The cycle header shows the current period (e.g. Annual 2025), its phase (Planning / Tracking / Appraisal), and whether scores are visible to employees.',
                side: 'bottom',
            },
        },
        {
            popover: {
                title: '🔄 The Three Phases',
                description:
                    '<strong>Planning</strong> — Employees and managers agree on KPIs and targets for the year.<br>'
                    + '<strong>Tracking / Mid-Year</strong> — Mid-year check-in; employees update progress status on each KPI.<br>'
                    + '<strong>Appraisal / Annual</strong> — End-of-year self-rating and manager scoring.',
            },
        },
        {
            element: '[data-tour="perf-advance-phase"]',
            popover: {
                title: 'Advance Phase',
                description:
                    'Use the <strong>Advance Phase</strong> button to move all reviews in this cycle to the next phase simultaneously. Employees will be notified by email.',
                side: 'bottom',
            },
        },
        {
            popover: {
                title: '📋 Assigning Appraisals',
                description:
                    'In the <strong>Cycles & Reviews</strong> section, you can see all reviews for each cycle. Use the <strong>Assign</strong> button to pair employees with their templates and reviewers. You can also bulk-assign using the performance template seeder.',
            },
        },
        {
            popover: {
                title: '✅ HR Final Approval',
                description:
                    'After both the employee and manager have agreed on the scores, the review moves to <em>HR Approval</em> status. Go to the individual review and click <strong>HR Approve</strong> to finalise it — or <strong>HR Reject</strong> if it needs to go back for correction.',
            },
        },
    ],
};

// ─────────────────────────────────────────────────────────────────────────────
// HR CONTRACTS  (HR/admin only)
// ─────────────────────────────────────────────────────────────────────────────
const hrContractsTour: RoleTour = {
    id: 'hr_contracts',
    label: 'HR — Contracts',
    description: 'How to record and manage employee contracts.',
    roles: ['admin', 'hr', 'super_admin'],
    path: '/hr/contracts',
    steps: [
        {
            popover: {
                title: '📄 Employee Contracts',
                description:
                    'The Contracts module allows HR to record and track employment contracts for each employee — start dates, end dates, contract types, and status.',
            },
        },
        {
            element: '[data-tour="contracts-table"]',
            popover: {
                title: 'Contracts List',
                description:
                    'All contracts are listed here with the employee name, contract type, start and expiry dates, and the current status (Active, Expired, Terminated).',
                side: 'top',
            },
        },
        {
            element: '[data-tour="contracts-new-btn"]',
            popover: {
                title: 'Record a New Contract',
                description:
                    'Click here to open the contract creation form. Select the employee, enter the contract period and type, and save.',
                side: 'bottom',
                align: 'end',
            },
        },
        {
            popover: {
                title: '⏰ Contract Expiry Alerts',
                description:
                    'Contracts approaching expiry (within 30 days) are highlighted on the HR Dashboard so no renewal slips through unnoticed.',
            },
        },
    ],
};

// ─────────────────────────────────────────────────────────────────────────────
// HR DOCUMENTS  (HR/admin only)
// ─────────────────────────────────────────────────────────────────────────────
const hrDocumentsTour: RoleTour = {
    id: 'hr_documents',
    label: 'HR — Employee Documents',
    description: 'How to upload and manage HR documents for employees.',
    roles: ['admin', 'hr', 'super_admin'],
    path: '/hr/documents',
    steps: [
        {
            popover: {
                title: '🗂️ Employee Documents',
                description:
                    'The Documents module is where HR stores official employee files — appointment letters, certificates, disciplinary notices, medical reports, and any other HR documents.',
            },
        },
        {
            element: '[data-tour="documents-table"]',
            popover: {
                title: 'Document List',
                description:
                    'All uploaded documents are listed with the employee name, document type, upload date, and a download link.',
                side: 'top',
            },
        },
        {
            element: '[data-tour="documents-upload-btn"]',
            popover: {
                title: 'Upload a Document',
                description:
                    'Click here to upload a new document. Select the employee, choose the document type, and attach the file (PDF or image). The document will be stored securely and visible to HR and the employee.',
                side: 'bottom',
                align: 'end',
            },
        },
    ],
};

// ─────────────────────────────────────────────────────────────────────────────
// REGISTRY
// ─────────────────────────────────────────────────────────────────────────────
export const ALL_TOURS: RoleTour[] = [
    mainTour,
    leaveOverviewTour,
    leaveApplyTour,
    performanceMineTour,
    performanceReviewTour,
    profileUpdateTour,
    nominalRollTour,
    hrLeaveManagementTour,
    hrPerformanceManagementTour,
    hrContractsTour,
    hrDocumentsTour,
];

/** Return tours visible to the given role. */
export function toursForRole(role: string): RoleTour[] {
    return ALL_TOURS.filter((t) => t.roles.length === 0 || t.roles.includes(role));
}
