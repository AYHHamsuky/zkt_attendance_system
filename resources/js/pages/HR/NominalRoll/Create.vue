<script setup lang="ts">
import { Head, Link, useForm } from '@inertiajs/vue3';
import AppLayout from '@/layouts/AppLayout.vue';
import { type BreadcrumbItem } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Upload, Download, FileText, UserPlus } from 'lucide-vue-next';
import { ref } from 'vue';

defineProps<{
    departments: string[];
    locations: string[];
    regions: string[];
}>();

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'HR Management', href: '/hr' },
    { title: 'Staff List', href: '/hr/nominal-roll' },
    { title: 'New Employee' },
];

// ── Single employee form ──
const form = useForm({
    title: '',
    first_name: '',
    middle_name: '',
    last_name: '',
    gender: '',
    date_of_birth: '',
    marital_status: '',
    payroll_id: '',
    position: '',
    job_grade: '',
    job_level: '',
    department: '',
    unit: '',
    division: '',
    start_date: '',
    region: '',
    location: '',
    email: '',
    phone: '',
    line_manager_name: '',
    line_manager_phone: '',
});

function submit() {
    form.post('/hr/nominal-roll');
}

// ── CSV upload form ──
const csvForm = useForm({ csv_file: null as File | null });
const csvFile = ref<File | null>(null);
const csvFileName = ref('');

function onFileChange(e: Event) {
    const file = (e.target as HTMLInputElement).files?.[0] ?? null;
    csvFile.value = file;
    csvForm.csv_file = file;
    csvFileName.value = file?.name ?? '';
}

function submitCsv() {
    if (!csvFile.value) return;
    csvForm.post('/hr/nominal-roll/import', { forceFormData: true });
}
</script>

<template>
    <Head title="New Employee" />
    <AppLayout :breadcrumbs="breadcrumbs">
        <div class="flex h-full flex-1 flex-col gap-6 p-4 md:p-6">
            <div>
                <h2 class="text-2xl font-bold tracking-tight">New Employee</h2>
                <p class="text-muted-foreground">Add a single employee or bulk-import from a CSV file.</p>
            </div>

            <Tabs default-value="single" class="max-w-4xl">
                <TabsList class="mb-4">
                    <TabsTrigger value="single">
                        <UserPlus class="mr-2 h-4 w-4" />
                        Single Employee
                    </TabsTrigger>
                    <TabsTrigger value="csv">
                        <Upload class="mr-2 h-4 w-4" />
                        Upload CSV
                    </TabsTrigger>
                </TabsList>

                <!-- ══ TAB 1: Single Employee ══ -->
                <TabsContent value="single">
                    <form @submit.prevent="submit" class="space-y-6">

                        <!-- Identity -->
                        <Card>
                            <CardHeader><CardTitle>Personal Identity</CardTitle></CardHeader>
                            <CardContent class="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                                <div class="space-y-1.5">
                                    <Label>Title</Label>
                                    <Select :model-value="form.title" @update:model-value="v => form.title = String(v)">
                                        <SelectTrigger><SelectValue placeholder="Select…" /></SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="">None</SelectItem>
                                            <SelectItem value="Mr.">Mr.</SelectItem>
                                            <SelectItem value="Mrs.">Mrs.</SelectItem>
                                            <SelectItem value="Ms.">Ms.</SelectItem>
                                            <SelectItem value="Dr.">Dr.</SelectItem>
                                            <SelectItem value="Prof.">Prof.</SelectItem>
                                            <SelectItem value="Engr.">Engr.</SelectItem>
                                            <SelectItem value="Alhaji">Alhaji</SelectItem>
                                            <SelectItem value="Alhaja">Alhaja</SelectItem>
                                            <SelectItem value="Hon.">Hon.</SelectItem>
                                            <SelectItem value="Barr.">Barr.</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div class="space-y-1.5">
                                    <Label>First Name <span class="text-destructive">*</span></Label>
                                    <Input v-model="form.first_name" required />
                                    <p v-if="form.errors.first_name" class="text-sm text-destructive">{{ form.errors.first_name }}</p>
                                </div>

                                <div class="space-y-1.5">
                                    <Label>Middle Name</Label>
                                    <Input v-model="form.middle_name" />
                                </div>

                                <div class="space-y-1.5">
                                    <Label>Last Name <span class="text-destructive">*</span></Label>
                                    <Input v-model="form.last_name" required />
                                    <p v-if="form.errors.last_name" class="text-sm text-destructive">{{ form.errors.last_name }}</p>
                                </div>

                                <div class="space-y-1.5">
                                    <Label>Gender</Label>
                                    <Select :model-value="form.gender" @update:model-value="v => form.gender = String(v)">
                                        <SelectTrigger><SelectValue placeholder="Select…" /></SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="">Not specified</SelectItem>
                                            <SelectItem value="male">Male</SelectItem>
                                            <SelectItem value="female">Female</SelectItem>
                                            <SelectItem value="other">Other</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div class="space-y-1.5">
                                    <Label>Date of Birth</Label>
                                    <Input v-model="form.date_of_birth" type="date" />
                                    <p v-if="form.errors.date_of_birth" class="text-sm text-destructive">{{ form.errors.date_of_birth }}</p>
                                </div>

                                <div class="space-y-1.5">
                                    <Label>Marital Status</Label>
                                    <Select :model-value="form.marital_status" @update:model-value="v => form.marital_status = String(v)">
                                        <SelectTrigger><SelectValue placeholder="Select…" /></SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="">Not specified</SelectItem>
                                            <SelectItem value="single">Single</SelectItem>
                                            <SelectItem value="married">Married</SelectItem>
                                            <SelectItem value="divorced">Divorced</SelectItem>
                                            <SelectItem value="widowed">Widowed</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </CardContent>
                        </Card>

                        <!-- Employment -->
                        <Card>
                            <CardHeader><CardTitle>Employment Details</CardTitle></CardHeader>
                            <CardContent class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                                <div class="space-y-1.5">
                                    <Label>Payroll ID <span class="text-destructive">*</span></Label>
                                    <Input v-model="form.payroll_id" required />
                                    <p v-if="form.errors.payroll_id" class="text-sm text-destructive">{{ form.errors.payroll_id }}</p>
                                </div>

                                <div class="space-y-1.5">
                                    <Label>Job Role Title</Label>
                                    <Input v-model="form.position" />
                                </div>

                                <div class="space-y-1.5">
                                    <Label>Job Grade</Label>
                                    <Input v-model="form.job_grade" />
                                </div>

                                <div class="space-y-1.5">
                                    <Label>Job Level</Label>
                                    <Input v-model="form.job_level" />
                                </div>

                                <div class="space-y-1.5">
                                    <Label>Department</Label>
                                    <Input v-model="form.department" list="dept-list" />
                                    <datalist id="dept-list">
                                        <option v-for="d in departments" :key="d" :value="d" />
                                    </datalist>
                                </div>

                                <div class="space-y-1.5">
                                    <Label>Unit</Label>
                                    <Input v-model="form.unit" />
                                </div>

                                <div class="space-y-1.5">
                                    <Label>Division</Label>
                                    <Input v-model="form.division" />
                                </div>

                                <div class="space-y-1.5">
                                    <Label>Start Date</Label>
                                    <Input v-model="form.start_date" type="date" />
                                </div>
                            </CardContent>
                        </Card>

                        <!-- Location & Contact -->
                        <Card>
                            <CardHeader><CardTitle>Location & Contact</CardTitle></CardHeader>
                            <CardContent class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                                <div class="space-y-1.5">
                                    <Label>Region</Label>
                                    <Input v-model="form.region" list="region-list" />
                                    <datalist id="region-list">
                                        <option v-for="r in regions" :key="r" :value="r" />
                                    </datalist>
                                </div>

                                <div class="space-y-1.5">
                                    <Label>Location</Label>
                                    <Input v-model="form.location" list="loc-list" />
                                    <datalist id="loc-list">
                                        <option v-for="l in locations" :key="l" :value="l" />
                                    </datalist>
                                </div>

                                <div class="space-y-1.5">
                                    <Label>Official Email</Label>
                                    <Input v-model="form.email" type="email" />
                                    <p v-if="form.errors.email" class="text-sm text-destructive">{{ form.errors.email }}</p>
                                </div>

                                <div class="space-y-1.5">
                                    <Label>Active Phone Number</Label>
                                    <Input v-model="form.phone" />
                                </div>
                            </CardContent>
                        </Card>

                        <!-- Reporting Line -->
                        <Card>
                            <CardHeader><CardTitle>Reporting Line</CardTitle></CardHeader>
                            <CardContent class="grid gap-4 sm:grid-cols-2">
                                <div class="space-y-1.5">
                                    <Label>Line Manager's Name</Label>
                                    <Input v-model="form.line_manager_name" />
                                </div>

                                <div class="space-y-1.5">
                                    <Label>Line Manager's Phone</Label>
                                    <Input v-model="form.line_manager_phone" />
                                </div>
                            </CardContent>
                        </Card>

                        <div class="flex items-center justify-end gap-3">
                            <Button type="button" variant="outline" as-child>
                                <Link href="/hr/nominal-roll">Cancel</Link>
                            </Button>
                            <Button type="submit" :disabled="form.processing">
                                {{ form.processing ? 'Creating…' : 'Create Employee' }}
                            </Button>
                        </div>
                    </form>
                </TabsContent>

                <!-- ══ TAB 2: CSV Upload ══ -->
                <TabsContent value="csv">
                    <Card>
                        <CardHeader><CardTitle>Bulk Import from CSV</CardTitle></CardHeader>
                        <CardContent class="space-y-6">
                            <!-- Instructions -->
                            <div class="rounded-lg border bg-muted/40 p-4 space-y-2 text-sm">
                                <p class="font-medium">CSV Format Requirements</p>
                                <p class="text-muted-foreground">
                                    The file must match the Kaduna Electric nominal roll spreadsheet column order:
                                    S/N, Full Name, Payroll ID, Title, Last Name, Middle Name, First Name,
                                    Department, Unit, Job Role Title, Job Grade, Job Level, Start Date,
                                    Region, Location, Division, Line Manager Name, Line Manager Phone,
                                    Official Email, Active Phone, Marital Status.
                                </p>
                                <p class="text-muted-foreground">
                                    Existing records are <strong>updated</strong> (matched by Payroll ID). New records are created.
                                    Rows with missing Payroll ID or Full Name are skipped.
                                </p>
                            </div>

                            <!-- Download template -->
                            <div class="flex items-center gap-3">
                                <a
                                    href="/hr/nominal-roll/csv-template"
                                    class="inline-flex items-center gap-2 rounded-md border border-input bg-background px-4 py-2 text-sm font-medium shadow-sm hover:bg-accent hover:text-accent-foreground"
                                >
                                    <Download class="h-4 w-4" />
                                    Download Template
                                </a>
                                <span class="text-sm text-muted-foreground">Get a blank CSV with the correct column headers.</span>
                            </div>

                            <!-- File upload -->
                            <form @submit.prevent="submitCsv" class="space-y-4">
                                <div class="space-y-1.5">
                                    <Label>Select CSV File</Label>
                                    <label class="flex cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed p-10 text-center transition-colors hover:border-primary/50 hover:bg-muted/30">
                                        <FileText class="mb-3 h-8 w-8 text-muted-foreground" />
                                        <span v-if="csvFileName" class="font-medium text-sm">{{ csvFileName }}</span>
                                        <span v-else class="text-sm text-muted-foreground">Click to select a .csv file</span>
                                        <input type="file" accept=".csv,text/csv" class="sr-only" @change="onFileChange" />
                                    </label>
                                    <p v-if="csvForm.errors.csv_file" class="text-sm text-destructive">{{ csvForm.errors.csv_file }}</p>
                                </div>

                                <div class="flex items-center justify-end gap-3">
                                    <Button type="button" variant="outline" as-child>
                                        <Link href="/hr/nominal-roll">Cancel</Link>
                                    </Button>
                                    <Button type="submit" :disabled="csvForm.processing || !csvFile">
                                        <Upload class="mr-2 h-4 w-4" />
                                        {{ csvForm.processing ? 'Importing…' : 'Import Records' }}
                                    </Button>
                                </div>
                            </form>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    </AppLayout>
</template>
