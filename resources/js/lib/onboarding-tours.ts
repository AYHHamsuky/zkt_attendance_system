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
                    'The sidebar on the left is your main navigation menu. Click any item to go to that module. Use the <strong>arrow icon</strong> at the top to collapse it and give yourself more screen space.',
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
                title: 'Human Resources Module',
                description:
                    'The <strong>Human Resources</strong> section contains all the HR tools you need: Leave Applications, Performance Appraisals, Nominal Roll, Contracts, Documents, Transfers, and Resignations. Click the label to expand or collapse this section.',
                side: 'right',
                align: 'start',
            },
        },
        {
            element: '[data-tour="help-button"]',
            popover: {
                title: '? Help & Tutorials',
                description:
                    'This <strong>?</strong> button is always available in the top-right corner of every page. Click it to restart this tour, or jump directly into a specific module tutorial at any time.',
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
    description: 'Learn how to read your leave history and check balances.',
    roles: [],
    path: '/hr/leave',
    steps: [
        {
            popover: {
                title: '📅 Leave Applications',
                description:
                    'This page shows all leave requests — yours, and (if you\'re HR or a manager) those submitted by other employees. Let\'s walk through the key elements.',
            },
        },
        {
            element: '[data-tour="leave-page-header"]',
            popover: {
                title: 'Page Title & Count',
                description:
                    'The heading shows whose leave applications are listed. The number below tells you the total count matching your current filters.',
                side: 'bottom',
                align: 'start',
            },
        },
        {
            element: '[data-tour="leave-new-btn"]',
            popover: {
                title: '➕ New Application Button',
                description:
                    'Click <strong>New Application</strong> to submit a leave request. You will select the leave type, set your start and end dates, choose a reliever if required, and optionally upload a supporting document.',
                side: 'bottom',
                align: 'end',
            },
        },
        {
            element: '[data-tour="leave-table"]',
            popover: {
                title: 'Applications Table',
                description:
                    'Each row shows an application: the employee name, leave type, date range, number of days requested, and the current status. Click the <strong>eye icon</strong> on any row to view full details including the approval trail.',
                side: 'top',
                align: 'start',
            },
        },
        {
            element: '[data-tour="leave-status-help"]',
            popover: {
                title: 'Understanding Leave Statuses',
                description:
                    '<strong>Pending LM</strong> — awaiting your line manager\'s approval.<br>'
                    + '<strong>Pending HR</strong> — approved by LM, now awaiting final HR sign-off.<br>'
                    + '<strong>Approved</strong> — fully approved, leave will be deducted from your balance.<br>'
                    + '<strong>Rejected</strong> — declined, with a reason provided.<br>'
                    + '<strong>Cancelled</strong> — withdrawn by the employee.',
                side: 'top',
            },
        },
        {
            popover: {
                title: '💡 Tip: Check Your Balance First',
                description:
                    'Before applying, it\'s a good idea to check how many days you have remaining. Your leave balances are shown when you click <strong>New Application</strong> and select a leave type. The system automatically prevents applications that exceed your entitlement.',
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
    description: 'Step-by-step guide to submitting a leave request.',
    roles: [],
    path: '/hr/leave/create',
    steps: [
        {
            popover: {
                title: '📝 Submitting a Leave Application',
                description:
                    'This form lets you request time off. Fill in each field carefully — your line manager will receive an email notification once you submit.',
            },
        },
        {
            element: '[data-tour="leave-form-employee"]',
            popover: {
                title: 'Employee Field',
                description:
                    'This is pre-filled with your name. If you are HR or an admin, you can change this to apply leave on behalf of another employee.',
                side: 'bottom',
            },
        },
        {
            element: '[data-tour="leave-form-type"]',
            popover: {
                title: 'Leave Type',
                description:
                    'Select the type of leave you are requesting — Annual Leave, Sick Leave, Maternity Leave, Study Leave, etc. Once selected, your remaining balance for that type will appear below automatically.',
                side: 'bottom',
            },
        },
        {
            element: '[data-tour="leave-form-balance"]',
            popover: {
                title: 'Your Leave Balance',
                description:
                    'This card shows how many days you have <strong>allowed</strong>, how many are <strong>already taken or pending</strong>, and how many are still <strong>remaining</strong>. The form will warn you if you try to exceed your entitlement.',
                side: 'bottom',
            },
        },
        {
            element: '[data-tour="leave-form-dates"]',
            popover: {
                title: 'Start & End Dates',
                description:
                    'Set your leave start and end dates. The system automatically calculates working days, excludes weekends, and deducts any public holidays that fall within your leave period.',
                side: 'bottom',
            },
        },
        {
            element: '[data-tour="leave-form-reason"]',
            popover: {
                title: 'Reason for Leave',
                description:
                    'Provide a brief reason. This is shared with your line manager when they review your request.',
                side: 'top',
            },
        },
        {
            element: '[data-tour="leave-form-reliever"]',
            popover: {
                title: 'Reliever (if required)',
                description:
                    'Some leave types (e.g. Annual Leave) require you to nominate a <strong>reliever</strong> — a colleague who will cover your duties while you are away. Search by name to select them.',
                side: 'top',
            },
        },
        {
            element: '[data-tour="leave-form-document"]',
            popover: {
                title: 'Supporting Document',
                description:
                    'Certain leave types (e.g. Sick Leave, Maternity Leave) require you to attach a supporting document such as a medical certificate. Upload it here as a PDF or image.',
                side: 'top',
            },
        },
        {
            element: '[data-tour="leave-form-submit"]',
            popover: {
                title: '✅ Submit Your Application',
                description:
                    'Once everything is filled in correctly, click <strong>Submit Application</strong>. Your line manager will receive an email and can approve or reject the request. You will be notified by email at each step of the approval process.',
                side: 'top',
                align: 'end',
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
    description: 'Understand your assigned appraisal cycles and their statuses.',
    roles: [],
    path: '/hr/performance/my-appraisals',
    steps: [
        {
            popover: {
                title: '⭐ Performance Appraisals',
                description:
                    'The Kaduna Electric performance system uses a <strong>Balanced Scorecard (BSC)</strong> framework. Your objectives are grouped into four categories: Financials, Customers, Internal Processes, and Learning & Growth. Let\'s walk through how appraisals work.',
            },
        },
        {
            element: '[data-tour="perf-mine-header"]',
            popover: {
                title: 'Your Appraisal Record',
                description:
                    'This page lists all appraisal cycles that HR has assigned to you. Each card represents one appraisal period (e.g. Annual 2025).',
                side: 'bottom',
                align: 'start',
            },
        },
        {
            element: '[data-tour="perf-reviews-grid"]',
            popover: {
                title: 'Appraisal Cards',
                description:
                    'Each card shows the cycle name, year, and its current status. The three steps at the bottom of each card — <strong>Self → Manager → Final</strong> — show you exactly where you are in the appraisal workflow.',
                side: 'top',
            },
        },
        {
            popover: {
                title: '🔄 The Appraisal Workflow',
                description:
                    '<strong>1. Self-Appraisal (Pending)</strong> — You complete your KPIs and rate yourself.<br>'
                    + '<strong>2. Manager Review (Submitted)</strong> — Your line manager reviews and rates your objectives.<br>'
                    + '<strong>3. Acknowledged</strong> — You confirm you have seen the manager\'s ratings.<br>'
                    + '<strong>4. Finalized</strong> — HR locks the appraisal. The final score is visible.',
            },
        },
        {
            popover: {
                title: '📊 Understanding Your Score',
                description:
                    'Scores use the BSC grading system:<br>'
                    + '<strong>D (1)</strong> — Below expectation<br>'
                    + '<strong>C (2)</strong> — Partially meets expectation<br>'
                    + '<strong>B (3)</strong> — Meets expectation<br>'
                    + '<strong>A (4)</strong> — Exceeds expectation<br>'
                    + '<strong>A+ (5)</strong> — Outstanding<br><br>'
                    + 'Each objective has a <em>weight</em>, and your final score is a weighted average expressed as a percentage.',
            },
        },
        {
            element: '[data-tour="perf-reviews-grid"]',
            popover: {
                title: '👆 Open Your Appraisal',
                description:
                    'Click <strong>Open Appraisal</strong> on any card to start filling in your self-assessment. The next tutorial will walk you through the appraisal form itself.',
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
    description: 'How to rate your KPIs, add comments, and submit your self-appraisal.',
    roles: [],
    path: '/hr/performance/my-appraisals',
    steps: [
        {
            popover: {
                title: '📋 Your Appraisal Form',
                description:
                    'This page contains your full appraisal. It is divided into sections matching your BSC categories. Work through each objective, rate yourself honestly, and add supporting comments before submitting.',
            },
        },
        {
            element: '[data-tour="perf-review-header"]',
            popover: {
                title: 'Review Header',
                description:
                    'Shows the cycle name, your current status, and your job title at the time of review. The status badge on the right indicates whether this appraisal is still open for editing.',
                side: 'bottom',
                align: 'start',
            },
        },
        {
            element: '[data-tour="perf-objectives-section"]',
            popover: {
                title: 'Your Objectives (KPIs)',
                description:
                    'Each row is a KPI (Key Performance Indicator) from the BSC template assigned to you. You will see the objective description, KPI measure, target, and the weight it carries towards your final score.',
                side: 'top',
                align: 'start',
            },
        },
        {
            element: '[data-tour="perf-self-rating"]',
            popover: {
                title: 'Self-Rating — D / C / B / A / A+',
                description:
                    'For each objective, select your self-rating using the radio buttons: <strong>D, C, B, A, or A+</strong>. Be honest — your line manager will see both your rating and theirs side-by-side when they review.',
                side: 'left',
            },
        },
        {
            element: '[data-tour="perf-progress-status"]',
            popover: {
                title: 'Progress Status',
                description:
                    'Mark whether this objective is <strong>On Track</strong>, <strong>Off Track</strong>, or <strong>Pending</strong>. This helps your manager see where you need support.',
                side: 'left',
            },
        },
        {
            element: '[data-tour="perf-yearly-achieved"]',
            popover: {
                title: 'What You Achieved',
                description:
                    'Use this field to document what you actually accomplished against this KPI during the year. Be specific — include numbers, dates, or outcomes where possible.',
                side: 'left',
            },
        },
        {
            element: '[data-tour="perf-training-needs"]',
            popover: {
                title: 'Training Needs',
                description:
                    'At the bottom of the form, you can add any training or development needs you identified during the year. List the skill gap and the type of training that would help address it. Your manager and HR will review these.',
                side: 'top',
                align: 'start',
            },
        },
        {
            element: '[data-tour="perf-employee-comment"]',
            popover: {
                title: 'Overall Comment',
                description:
                    'Write a brief overall comment about your performance this year — achievements, challenges, and goals for the next period. This is your opportunity to provide context.',
                side: 'top',
            },
        },
        {
            element: '[data-tour="perf-submit-btn"]',
            popover: {
                title: '📤 Submit Your Self-Appraisal',
                description:
                    'When you are satisfied with all your ratings and comments, click <strong>Submit for Review</strong>. This will notify your line manager to begin their assessment. <em>You will not be able to edit your responses after submission.</em>',
                side: 'top',
                align: 'end',
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
