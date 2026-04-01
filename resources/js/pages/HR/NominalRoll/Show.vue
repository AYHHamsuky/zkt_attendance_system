<script setup lang="ts">
import { Head, Link, useForm, router } from '@inertiajs/vue3';
import AppLayout from '@/layouts/AppLayout.vue';
import { type BreadcrumbItem } from '@/types';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { GitBranch, Users, ArrowRight, Clock, Camera, Download } from 'lucide-vue-next';
import { ref } from 'vue';

interface HrProfile {
    id?: number;
    payroll_id: string;
    title: string | null;
    first_name: string | null;
    middle_name: string | null;
    last_name: string | null;
    job_grade: string | null;
    job_level: string | null;
    division: string | null;
    line_manager_name: string | null;
    line_manager_phone: string | null;
    line_manager_email: string | null;
    start_date: string | null;
    date_of_confirmation: string | null;
    marital_status: string | null;
    date_of_birth: string | null;
    gender: string | null;
    state_of_origin: string | null;
    lga: string | null;
    nationality: string | null;
    religion: string | null;
    home_address: string | null;
    next_of_kin_name: string | null;
    next_of_kin_relationship: string | null;
    next_of_kin_phone: string | null;
    next_of_kin_address: string | null;
    highest_qualification: string | null;
    institution: string | null;
    course_of_study: string | null;
    grade_level: string | null;
    step: string | null;
    pensionable: boolean;
    reports_to?: { id: number; name: string; email: string | null; position: string | null; hr_profile: { job_grade: string | null } | null } | null;
}

interface AuditChange {
    field: string;
    label: string;
    old: string | null;
    new: string | null;
}

interface AuditLog {
    id: number;
    changes: AuditChange[];
    created_at: string;
    user: { id: number; name: string } | null;
}

interface Employee {
    id: number;
    name: string;
    email: string | null;
    phone: string | null;
    department: string | null;
    unit: string | null;
    position: string | null;
    location: string | null;
    region: string | null;
    photo_url: string | null;
    hr_profile: HrProfile | null;
    contracts: Array<{ id: number; contract_type: string; status: string; start_date: string; end_date: string | null; salary_amount: string }>;
    audit_logs: AuditLog[];
}

interface DirectReport {
    id: number;
    name: string;
    position: string | null;
    department: string | null;
    hr_profile: { job_grade: string | null } | null;
}

const props = defineProps<{
    employee: Employee;
    directReports: DirectReport[];
    canEdit: boolean;
    canEditPayrollId: boolean;
}>();

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'HRIS', href: '/hr' },
    { title: 'Staff List', href: '/hr/nominal-roll' },
    { title: props.employee.name },
];

const p = props.employee.hr_profile;

const form = useForm({
    payroll_id: p?.payroll_id ?? '',
    title: p?.title ?? '',
    first_name: p?.first_name ?? '',
    middle_name: p?.middle_name ?? '',
    last_name: p?.last_name ?? '',
    job_grade: p?.job_grade ?? '',
    job_level: p?.job_level ?? '',
    division: p?.division ?? '',
    email: props.employee.email ?? '',
    line_manager_name: p?.line_manager_name ?? '',
    line_manager_phone: p?.line_manager_phone ?? '',
    line_manager_email: p?.line_manager_email ?? '',
    start_date: p?.start_date ?? '',
    date_of_confirmation: p?.date_of_confirmation ?? '',
    marital_status: p?.marital_status ?? '',
    date_of_birth: p?.date_of_birth ?? '',
    gender: p?.gender ?? '',
    state_of_origin: p?.state_of_origin ?? '',
    lga: p?.lga ?? '',
    nationality: p?.nationality ?? 'Nigerian',
    religion: p?.religion ?? '',
    home_address: p?.home_address ?? '',
    next_of_kin_name: p?.next_of_kin_name ?? '',
    next_of_kin_relationship: p?.next_of_kin_relationship ?? '',
    next_of_kin_phone: p?.next_of_kin_phone ?? '',
    next_of_kin_address: p?.next_of_kin_address ?? '',
    highest_qualification: p?.highest_qualification ?? '',
    institution: p?.institution ?? '',
    course_of_study: p?.course_of_study ?? '',
    grade_level: p?.grade_level ?? '',
    step: p?.step ?? '',
    pensionable: p?.pensionable ?? true,
});

function submit() {
    form.patch(`/hr/nominal-roll/${props.employee.id}`);
}

function formatCurrency(amount: string): string {
    return new Intl.NumberFormat('en-NG', { style: 'currency', currency: 'NGN', maximumFractionDigits: 0 }).format(Number(amount));
}

function formatDate(dt: string): string {
    return new Date(dt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });
}

function initials(name: string) {
    return name.split(' ').slice(0, 2).map(w => w[0]).join('').toUpperCase();
}

const photoInput = ref<HTMLInputElement | null>(null);
const photoPreview = ref<string | null>(props.employee.photo_url);
const uploadingPhoto = ref(false);

function onPhotoSelected(e: Event) {
    const file = (e.target as HTMLInputElement).files?.[0];
    if (!file) { return; }
    photoPreview.value = URL.createObjectURL(file);
    uploadingPhoto.value = true;
    router.post(
        `/hr/nominal-roll/${props.employee.id}/photo`,
        { photo: file },
        {
            forceFormData: true,
            preserveScroll: true,
            onFinish: () => { uploadingPhoto.value = false; },
        },
    );
}
</script>

<template>
    <Head :title="`${employee.name} — HR Profile`" />
    <AppLayout :breadcrumbs="breadcrumbs">
        <div class="flex h-full flex-1 flex-col gap-4 p-4 md:p-6">

            <!-- Header -->
            <div class="flex items-start justify-between">
                <div class="flex items-center gap-4">
                    <!-- Avatar / Photo with upload -->
                    <div class="relative group">
                        <div class="h-16 w-16 rounded-full overflow-hidden ring-2 ring-border">
                            <img
                                v-if="photoPreview"
                                :src="photoPreview"
                                :alt="employee.name"
                                class="h-full w-full object-cover"
                            />
                            <div
                                v-else
                                class="flex h-full w-full items-center justify-center bg-primary text-primary-foreground text-lg font-bold"
                            >
                                {{ initials(employee.name) }}
                            </div>
                        </div>
                        <!-- Upload overlay -->
                        <button
                            type="button"
                            class="absolute inset-0 flex items-center justify-center rounded-full bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                            :class="{ 'opacity-100': uploadingPhoto }"
                            @click="photoInput?.click()"
                        >
                            <Camera class="h-5 w-5 text-white" />
                        </button>
                        <input ref="photoInput" type="file" accept="image/*" class="hidden" @change="onPhotoSelected" />
                    </div>
                    <div>
                        <h2 class="text-2xl font-bold">{{ p?.title ? p.title + ' ' : '' }}{{ employee.name }}</h2>
                        <p class="text-sm font-medium">
                            <span class="text-muted-foreground">Job Role Title:</span>
                            {{ employee.position ?? '—' }}
                        </p>
                        <p class="text-muted-foreground text-sm">{{ employee.department }}{{ employee.unit ? ' · ' + employee.unit : '' }}</p>
                        <p v-if="p?.payroll_id" class="text-muted-foreground text-xs font-mono">{{ p.payroll_id }}</p>
                        <a
                            v-if="employee.email"
                            :href="`mailto:${employee.email}`"
                            class="text-xs text-primary hover:underline"
                        >{{ employee.email }}</a>
                    </div>
                </div>
                <div class="flex items-center gap-2">
                    <Button v-if="canEditPayrollId" variant="outline" as-child>
                        <a :href="`/hr/performance/templates/${employee.id}`" download>
                            <Download class="mr-2 h-4 w-4" />
                            Template
                        </a>
                    </Button>
                    <Button v-if="canEditPayrollId" variant="outline" as-child>
                        <Link :href="`/hr/nominal-roll/org-chart?employee_id=${employee.id}`">
                            <GitBranch class="mr-2 h-4 w-4" />
                            Org Chart
                        </Link>
                    </Button>
                    <Button v-if="canEdit" :disabled="form.processing" @click="submit">
                        {{ form.processing ? 'Saving…' : 'Save Profile' }}
                    </Button>
                </div>
            </div>

            <!-- Reports to / Direct reports bar -->
            <div class="flex flex-wrap items-center gap-4 rounded-lg border bg-muted/30 px-4 py-3">
                <div v-if="p?.reports_to" class="flex items-center gap-2">
                    <span class="text-muted-foreground text-sm">Reports to:</span>
                    <Link
                        :href="`/hr/nominal-roll/${p.reports_to.id}`"
                        class="flex items-center gap-1.5 text-sm font-medium text-primary hover:underline"
                    >
                        {{ p.reports_to.name }}
                        <Badge variant="outline" class="text-xs">{{ p.reports_to.hr_profile?.job_grade }}</Badge>
                    </Link>
                    <a
                        v-if="p.reports_to.email || p.line_manager_email"
                        :href="`mailto:${p.reports_to.email ?? p.line_manager_email}`"
                        class="text-xs text-muted-foreground hover:text-primary hover:underline"
                    >{{ p.reports_to.email ?? p.line_manager_email }}</a>
                </div>
                <Separator v-if="p?.reports_to && directReports.length" orientation="vertical" class="h-4" />
                <div v-if="directReports.length" class="flex items-center gap-2">
                    <Users class="h-4 w-4 text-muted-foreground" />
                    <span class="text-muted-foreground text-sm">{{ directReports.length }} direct report{{ directReports.length !== 1 ? 's' : '' }}:</span>
                    <div class="flex flex-wrap gap-1">
                        <Link
                            v-for="dr in directReports.slice(0, 5)"
                            :key="dr.id"
                            :href="`/hr/nominal-roll/${dr.id}`"
                            class="text-xs font-medium text-primary hover:underline"
                        >
                            {{ dr.name }}<span v-if="dr !== directReports.slice(0, 5).at(-1)">,</span>
                        </Link>
                        <span v-if="directReports.length > 5" class="text-muted-foreground text-xs">
                            +{{ directReports.length - 5 }} more
                        </span>
                    </div>
                </div>
            </div>

            <form @submit.prevent="submit">
                <fieldset :disabled="!canEdit" class="contents">
                <Tabs default-value="employment" class="space-y-4">
                    <TabsList>
                        <TabsTrigger value="employment">Employment</TabsTrigger>
                        <TabsTrigger value="personal">Personal</TabsTrigger>
                        <TabsTrigger value="qualifications">Qualifications</TabsTrigger>
                        <TabsTrigger value="next-of-kin">Next of Kin</TabsTrigger>
                        <TabsTrigger value="contracts">Contracts</TabsTrigger>
                        <TabsTrigger value="history">
                            Change History
                            <Badge v-if="employee.audit_logs.length" variant="secondary" class="ml-1.5 text-xs">
                                {{ employee.audit_logs.length }}
                            </Badge>
                        </TabsTrigger>
                    </TabsList>

                    <!-- Employment Tab -->
                    <TabsContent value="employment">
                        <Card>
                            <CardHeader>
                                <CardTitle>Employment Details</CardTitle>
                                <CardDescription>Official employment information from HR records.</CardDescription>
                            </CardHeader>
                            <CardContent class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                                <div class="space-y-1.5 lg:col-span-2">
                                    <Label>Job Role Title</Label>
                                    <div class="flex h-9 items-center rounded-md border bg-muted/50 px-3 text-sm font-medium">
                                        {{ employee.position ?? '—' }}
                                    </div>
                                    <p class="text-xs text-muted-foreground">Synced from employee record. Update via Transfers or direct employee edit.</p>
                                </div>
                                <div class="space-y-1.5">
                                    <Label>Payroll ID</Label>
                                    <Input
                                        v-model="form.payroll_id"
                                        placeholder="e.g. 100379"
                                        :disabled="!canEditPayrollId"
                                        :class="!canEditPayrollId ? 'bg-muted text-muted-foreground cursor-not-allowed' : ''"
                                    />
                                    <p v-if="!canEditPayrollId" class="text-xs text-muted-foreground">Payroll ID can only be changed by HR or Admin.</p>
                                    <p v-if="form.errors.payroll_id" class="text-destructive text-sm">{{ form.errors.payroll_id }}</p>
                                </div>
                                <div class="space-y-1.5">
                                    <Label>Title</Label>
                                    <Select :model-value="form.title || '_none'" @update:model-value="v => form.title = String(v) === '_none' ? '' : String(v)">
                                        <SelectTrigger><SelectValue placeholder="Select title" /></SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="_none">None</SelectItem>
                                            <SelectItem value="Mr.">Mr.</SelectItem>
                                            <SelectItem value="Mrs.">Mrs.</SelectItem>
                                            <SelectItem value="Ms.">Ms.</SelectItem>
                                            <SelectItem value="Dr.">Dr.</SelectItem>
                                            <SelectItem value="Prof.">Prof.</SelectItem>
                                            <SelectItem value="Engr.">Engr.</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div class="space-y-1.5">
                                    <Label>First Name</Label>
                                    <Input v-model="form.first_name" />
                                </div>
                                <div class="space-y-1.5">
                                    <Label>Middle Name</Label>
                                    <Input v-model="form.middle_name" />
                                </div>
                                <div class="space-y-1.5">
                                    <Label>Last Name</Label>
                                    <Input v-model="form.last_name" />
                                </div>
                                <div class="space-y-1.5">
                                    <Label>Job Grade</Label>
                                    <Input v-model="form.job_grade" placeholder="e.g. Manager" />
                                </div>
                                <div class="space-y-1.5">
                                    <Label>Job Level</Label>
                                    <Input v-model="form.job_level" placeholder="e.g. Senior" />
                                </div>
                                <div class="space-y-1.5">
                                    <Label>Division</Label>
                                    <Input v-model="form.division" />
                                </div>
                                <div class="space-y-1.5">
                                    <Label>Grade Level</Label>
                                    <Input v-model="form.grade_level" />
                                </div>
                                <div class="space-y-1.5">
                                    <Label>Step</Label>
                                    <Input v-model="form.step" />
                                </div>
                                <div class="space-y-1.5">
                                    <Label>Start Date</Label>
                                    <Input v-model="form.start_date" type="date" />
                                </div>
                                <div class="space-y-1.5">
                                    <Label>Confirmation Date</Label>
                                    <Input v-model="form.date_of_confirmation" type="date" />
                                </div>
                                <div class="space-y-1.5">
                                    <Label>Line Manager</Label>
                                    <Input v-model="form.line_manager_name" />
                                </div>
                                <div class="space-y-1.5">
                                    <Label>Line Manager Phone</Label>
                                    <Input v-model="form.line_manager_phone" type="tel" />
                                </div>
                                <div class="space-y-1.5">
                                    <Label>Line Manager Email</Label>
                                    <Input v-model="form.line_manager_email" type="email" placeholder="manager@kadunaelectric.com" />
                                </div>
                                <div class="space-y-1.5">
                                    <Label>Official Email</Label>
                                    <Input v-model="form.email" type="email" placeholder="name@kadunaelectric.com" />
                                </div>
                                <div class="flex items-center gap-2 pt-5">
                                    <input id="pensionable" v-model="form.pensionable" type="checkbox" class="h-4 w-4" />
                                    <Label for="pensionable">Pensionable</Label>
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    <!-- Personal Tab -->
                    <TabsContent value="personal">
                        <Card>
                            <CardHeader><CardTitle>Personal Information</CardTitle></CardHeader>
                            <CardContent class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                                <div class="space-y-1.5">
                                    <Label>Date of Birth</Label>
                                    <Input v-model="form.date_of_birth" type="date" />
                                </div>
                                <div class="space-y-1.5">
                                    <Label>Gender</Label>
                                    <Select :model-value="form.gender || '_none'" @update:model-value="v => form.gender = String(v) === '_none' ? '' : String(v)">
                                        <SelectTrigger><SelectValue placeholder="Select gender" /></SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="_none">Not specified</SelectItem>
                                            <SelectItem value="male">Male</SelectItem>
                                            <SelectItem value="female">Female</SelectItem>
                                            <SelectItem value="other">Other</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div class="space-y-1.5">
                                    <Label>Marital Status</Label>
                                    <Select :model-value="form.marital_status || '_none'" @update:model-value="v => form.marital_status = String(v) === '_none' ? '' : String(v)">
                                        <SelectTrigger><SelectValue placeholder="Select status" /></SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="_none">Not specified</SelectItem>
                                            <SelectItem value="single">Single</SelectItem>
                                            <SelectItem value="married">Married</SelectItem>
                                            <SelectItem value="divorced">Divorced</SelectItem>
                                            <SelectItem value="widowed">Widowed</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div class="space-y-1.5">
                                    <Label>State of Origin</Label>
                                    <Input v-model="form.state_of_origin" />
                                </div>
                                <div class="space-y-1.5">
                                    <Label>LGA</Label>
                                    <Input v-model="form.lga" />
                                </div>
                                <div class="space-y-1.5">
                                    <Label>Nationality</Label>
                                    <Input v-model="form.nationality" />
                                </div>
                                <div class="space-y-1.5">
                                    <Label>Religion</Label>
                                    <Input v-model="form.religion" />
                                </div>
                                <div class="space-y-1.5 sm:col-span-2">
                                    <Label>Home Address</Label>
                                    <Input v-model="form.home_address" />
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    <!-- Qualifications Tab -->
                    <TabsContent value="qualifications">
                        <Card>
                            <CardHeader><CardTitle>Academic Qualifications</CardTitle></CardHeader>
                            <CardContent class="grid gap-4 sm:grid-cols-2">
                                <div class="space-y-1.5">
                                    <Label>Highest Qualification</Label>
                                    <Select :model-value="form.highest_qualification || '_none'" @update:model-value="v => form.highest_qualification = String(v) === '_none' ? '' : String(v)">
                                        <SelectTrigger><SelectValue placeholder="Select qualification" /></SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="_none">Not specified</SelectItem>
                                            <SelectItem value="FSLC">FSLC</SelectItem>
                                            <SelectItem value="WAEC">WAEC/NECO</SelectItem>
                                            <SelectItem value="OND">OND</SelectItem>
                                            <SelectItem value="HND">HND</SelectItem>
                                            <SelectItem value="BSc">B.Sc / B.A / B.Eng</SelectItem>
                                            <SelectItem value="MSc">M.Sc / MBA / M.A</SelectItem>
                                            <SelectItem value="PhD">PhD</SelectItem>
                                            <SelectItem value="other">Other</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div class="space-y-1.5">
                                    <Label>Institution</Label>
                                    <Input v-model="form.institution" placeholder="University/Polytechnic name" />
                                </div>
                                <div class="space-y-1.5 sm:col-span-2">
                                    <Label>Course of Study</Label>
                                    <Input v-model="form.course_of_study" />
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    <!-- Next of Kin Tab -->
                    <TabsContent value="next-of-kin">
                        <Card>
                            <CardHeader><CardTitle>Next of Kin</CardTitle></CardHeader>
                            <CardContent class="grid gap-4 sm:grid-cols-2">
                                <div class="space-y-1.5">
                                    <Label>Name</Label>
                                    <Input v-model="form.next_of_kin_name" />
                                </div>
                                <div class="space-y-1.5">
                                    <Label>Relationship</Label>
                                    <Input v-model="form.next_of_kin_relationship" placeholder="e.g. Spouse, Parent" />
                                </div>
                                <div class="space-y-1.5">
                                    <Label>Phone Number</Label>
                                    <Input v-model="form.next_of_kin_phone" type="tel" />
                                </div>
                                <div class="space-y-1.5">
                                    <Label>Address</Label>
                                    <Input v-model="form.next_of_kin_address" />
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    <!-- Contracts Tab -->
                    <TabsContent value="contracts">
                        <Card>
                            <CardHeader><CardTitle>Contract History</CardTitle></CardHeader>
                            <CardContent>
                                <div v-if="employee.contracts.length === 0" class="text-muted-foreground py-8 text-center">No contracts recorded.</div>
                                <div v-else class="space-y-2">
                                    <div
                                        v-for="contract in employee.contracts"
                                        :key="contract.id"
                                        class="flex items-center justify-between rounded-md border p-3"
                                    >
                                        <div>
                                            <p class="font-medium capitalize">{{ contract.contract_type }}</p>
                                            <p class="text-muted-foreground text-sm">{{ contract.start_date }} — {{ contract.end_date ?? 'Open-ended' }}</p>
                                        </div>
                                        <div class="text-right">
                                            <p class="font-medium">{{ formatCurrency(contract.salary_amount) }}</p>
                                            <Badge :variant="contract.status === 'active' ? 'default' : 'secondary'" class="mt-1 capitalize">{{ contract.status }}</Badge>
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    <!-- Change History Tab -->
                    <TabsContent value="history">
                        <Card>
                            <CardHeader>
                                <CardTitle>Change History</CardTitle>
                                <CardDescription>A complete audit trail of all changes made to this employee's HR profile.</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div v-if="employee.audit_logs.length === 0" class="text-muted-foreground py-8 text-center">
                                    <Clock class="mx-auto mb-2 h-8 w-8 opacity-40" />
                                    No changes recorded yet.
                                </div>

                                <div v-else class="space-y-0">
                                    <div
                                        v-for="(log, idx) in employee.audit_logs"
                                        :key="log.id"
                                        class="relative pb-6"
                                    >
                                        <!-- Timeline line -->
                                        <div v-if="idx < employee.audit_logs.length - 1" class="absolute left-4 top-8 bottom-0 w-px bg-border" />

                                        <div class="flex items-start gap-4">
                                            <!-- Avatar dot -->
                                            <div class="relative z-10 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground text-xs font-bold">
                                                {{ initials(log.user?.name ?? 'System') }}
                                            </div>

                                            <div class="flex-1 min-w-0">
                                                <div class="flex items-center gap-2 mb-2">
                                                    <span class="font-semibold text-sm">{{ log.user?.name ?? 'System' }}</span>
                                                    <span class="text-muted-foreground text-xs">{{ formatDate(log.created_at) }}</span>
                                                </div>

                                                <!-- Changes list -->
                                                <div class="space-y-1.5">
                                                    <div
                                                        v-for="change in log.changes"
                                                        :key="change.field"
                                                        class="flex flex-wrap items-center gap-1.5 text-sm"
                                                    >
                                                        <span class="font-medium text-muted-foreground">{{ change.label }}:</span>
                                                        <span
                                                            v-if="change.old"
                                                            class="rounded bg-red-50 px-1.5 py-0.5 text-red-700 line-through text-xs"
                                                        >
                                                            {{ change.old }}
                                                        </span>
                                                        <span v-else class="text-muted-foreground text-xs italic">empty</span>
                                                        <ArrowRight class="h-3 w-3 text-muted-foreground" />
                                                        <span
                                                            v-if="change.new"
                                                            class="rounded bg-green-50 px-1.5 py-0.5 text-green-700 text-xs font-medium"
                                                        >
                                                            {{ change.new }}
                                                        </span>
                                                        <span v-else class="text-muted-foreground text-xs italic">empty</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>
                </Tabs>
                </fieldset>
            </form>
        </div>
    </AppLayout>
</template>
