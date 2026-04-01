<script setup lang="ts">
import { Head, Link, useForm } from '@inertiajs/vue3';
import AppLayout from '@/layouts/AppLayout.vue';
import { type BreadcrumbItem } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import EmployeeCombobox from '@/components/EmployeeCombobox.vue';
import { AlertTriangle, Info, Upload } from 'lucide-vue-next';
import { ref, watch, computed } from 'vue';
import { useModuleTour } from '@/composables/useModuleTour';

useModuleTour('leave_apply', 800);

interface LeaveType {
    id: number;
    name: string;
    days_allowed_per_year: number;
    is_paid: boolean;
    gender_restriction: string | null;
    requires_reliever: boolean;
    requires_document: boolean;
    document_label: string | null;
    is_annual_leave: boolean;
    requires_annual_exhausted: boolean;
}
interface MyEmployee { id: number; name: string; department: string | null }
interface DayPreview { weekdays: number; holidays: { name: string; date: string }[]; working_days: number }
interface BalanceInfo { days_allowed: number; days_taken: number; days_pending: number; remaining: number }

const props = defineProps<{
    myEmployee: MyEmployee | null;
    leaveTypes: LeaveType[];
    balances: Record<string, BalanceInfo>;
    annualLeaveRemaining: number;
}>();

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'HRIS', href: '/hr' },
    { title: 'Leave', href: '/hr/leave' },
    { title: 'New Application' },
];

const form = useForm({
    employee_id: props.myEmployee ? String(props.myEmployee.id) : '',
    leave_type_id: '',
    start_date: '',
    end_date: '',
    reason: '',
    reliever_employee_id: '',
    document: null as File | null,
});

const documentFile = ref<File | null>(null);

// Leave types that require annual leave exhaustion are hidden while annual leave days remain
const availableLeaveTypes = computed<LeaveType[]>(() =>
    props.leaveTypes.filter(lt => !lt.requires_annual_exhausted || props.annualLeaveRemaining <= 0)
);

const selectedLeaveType = computed<LeaveType | null>(
    () => props.leaveTypes.find(lt => String(lt.id) === form.leave_type_id) ?? null
);

const selectedBalance = computed<BalanceInfo | null>(() => {
    if (!form.leave_type_id) return null;
    return props.balances[form.leave_type_id] ?? null;
});

const remainingDays = computed<number>(() => {
    if (selectedBalance.value) return selectedBalance.value.remaining;
    if (selectedLeaveType.value) return selectedLeaveType.value.days_allowed_per_year;
    return 0;
});

const exceedsBalance = computed<boolean>(() => {
    if (!preview.value || !selectedLeaveType.value) return false;
    return preview.value.working_days > remainingDays.value;
});

// ── Day preview ───────────────────────────────────────────────────────────
const preview = ref<DayPreview | null>(null);
const previewLoading = ref(false);

async function fetchPreview() {
    if (!form.start_date || !form.end_date || form.end_date < form.start_date) {
        preview.value = null;
        return;
    }
    previewLoading.value = true;
    try {
        const params = new URLSearchParams({ start_date: form.start_date, end_date: form.end_date });
        const res = await fetch(`/hr/leave/days-preview?${params}`, {
            headers: { Accept: 'application/json', 'X-Requested-With': 'XMLHttpRequest' },
        });
        preview.value = await res.json();
    } catch {
        preview.value = null;
    } finally {
        previewLoading.value = false;
    }
}

watch([() => form.start_date, () => form.end_date], fetchPreview);

function onDocumentChange(e: Event) {
    const file = (e.target as HTMLInputElement).files?.[0] ?? null;
    documentFile.value = file;
    form.document = file;
}

function submit() {
    form.post('/hr/leave', { forceFormData: true });
}
</script>

<template>
    <Head title="New Leave Application" />
    <AppLayout :breadcrumbs="breadcrumbs">
        <div class="flex h-full flex-1 flex-col gap-4 p-4 md:p-6">
            <h2 class="text-2xl font-bold">New Leave Application</h2>
            <Card class="max-w-2xl">
                <CardHeader><CardTitle>Leave Details</CardTitle></CardHeader>
                <CardContent>
                    <form class="space-y-4" @submit.prevent="submit">

                        <!-- Employee — auto-filled from logged-in user, read-only -->
                        <div class="space-y-1.5" data-tour="leave-form-employee">
                            <Label>Employee</Label>
                            <div class="flex items-center gap-2 rounded-md border bg-muted/50 px-3 py-2 text-sm">
                                <span class="font-medium">{{ myEmployee?.name ?? '—' }}</span>
                                <span v-if="myEmployee?.department" class="text-muted-foreground">· {{ myEmployee.department }}</span>
                            </div>
                            <p v-if="form.errors.employee_id" class="text-sm text-destructive">{{ form.errors.employee_id }}</p>
                        </div>

                        <!-- Leave Type -->
                        <div class="space-y-1.5" data-tour="leave-form-type">
                            <Label>Leave Type <span class="text-destructive">*</span></Label>
                            <Select :model-value="form.leave_type_id || ''" @update:model-value="v => form.leave_type_id = String(v)">
                                <SelectTrigger><SelectValue placeholder="Select leave type" /></SelectTrigger>
                                <SelectContent>
                                    <SelectItem v-for="lt in availableLeaveTypes" :key="lt.id" :value="String(lt.id)">
                                        {{ lt.name }} ({{ lt.days_allowed_per_year }}d/yr)
                                    </SelectItem>
                                </SelectContent>
                            </Select>
                            <p v-if="form.errors.leave_type_id" class="text-sm text-destructive">{{ form.errors.leave_type_id }}</p>
                            <p v-if="selectedLeaveType" class="text-xs text-muted-foreground" data-tour="leave-form-balance">
                                Balance: <strong>{{ remainingDays }}</strong> day(s) remaining of {{ selectedLeaveType.days_allowed_per_year }}
                                <template v-if="selectedBalance">
                                    ({{ selectedBalance.days_taken }} taken, {{ selectedBalance.days_pending }} pending)
                                </template>
                            </p>
                        </div>

                        <!-- Dates -->
                        <div class="grid gap-4 sm:grid-cols-2" data-tour="leave-form-dates">
                            <div class="space-y-1.5">
                                <Label>Start Date <span class="text-destructive">*</span></Label>
                                <Input v-model="form.start_date" type="date" />
                                <p v-if="form.errors.start_date" class="text-sm text-destructive">{{ form.errors.start_date }}</p>
                            </div>
                            <div class="space-y-1.5">
                                <Label>End Date <span class="text-destructive">*</span></Label>
                                <Input v-model="form.end_date" type="date" />
                                <p v-if="form.errors.end_date" class="text-sm text-destructive">{{ form.errors.end_date }}</p>
                            </div>
                        </div>

                        <!-- Day breakdown preview -->
                        <div
                            v-if="preview && !previewLoading"
                            class="flex items-start gap-2 rounded-md border border-blue-200 bg-blue-50 px-3 py-2.5 text-sm dark:border-blue-800 dark:bg-blue-950"
                        >
                            <Info class="mt-0.5 size-4 shrink-0 text-blue-600" />
                            <div class="space-y-0.5 text-blue-900 dark:text-blue-200">
                                <p v-if="preview.holidays.length === 0">
                                    <strong>{{ preview.working_days }}</strong>
                                    working day{{ preview.working_days !== 1 ? 's' : '' }} will be deducted from your balance.
                                </p>
                                <p v-else>
                                    You requested <strong>{{ preview.weekdays }}</strong> weekday{{ preview.weekdays !== 1 ? 's' : '' }}.
                                    <strong>{{ preview.holidays.length }}</strong> public holiday{{ preview.holidays.length !== 1 ? 's' : '' }} excluded —
                                    <strong>{{ preview.working_days }}</strong> day{{ preview.working_days !== 1 ? 's' : '' }} will be deducted.
                                </p>
                                <ul v-if="preview.holidays.length" class="mt-1 space-y-0 text-xs text-blue-700 dark:text-blue-300">
                                    <li v-for="h in preview.holidays" :key="h.date">• {{ h.name }} ({{ h.date }})</li>
                                </ul>
                            </div>
                        </div>
                        <p v-else-if="previewLoading" class="text-xs text-muted-foreground">Calculating days…</p>

                        <!-- Exceeds balance warning -->
                        <div
                            v-if="exceedsBalance && preview"
                            class="flex items-start gap-2 rounded-md border border-destructive/50 bg-destructive/10 px-3 py-2.5 text-sm"
                        >
                            <AlertTriangle class="mt-0.5 size-4 shrink-0 text-destructive" />
                            <p class="text-destructive">
                                This request requires <strong>{{ preview.working_days }}</strong> working day(s),
                                but you only have <strong>{{ remainingDays }}</strong> day(s) remaining for {{ selectedLeaveType?.name }}.
                            </p>
                        </div>

                        <!-- Reliever — required, filtered by same department -->
                        <div class="space-y-1.5" data-tour="leave-form-reliever">
                            <Label>
                                Reliever
                                <span class="text-destructive">*</span>
                            </Label>
                            <EmployeeCombobox
                                v-model="form.reliever_employee_id"
                                placeholder="Type name to search reliever..."
                                :exclude-id="myEmployee?.id"
                                :department="myEmployee?.department"
                            />
                            <p class="text-xs text-muted-foreground">The colleague covering your duties while you are away.</p>
                            <p v-if="form.errors.reliever_employee_id" class="text-sm text-destructive">{{ form.errors.reliever_employee_id }}</p>
                        </div>

                        <!-- Supporting Document — shown only if leave type requires it -->
                        <div v-if="selectedLeaveType?.requires_document" class="space-y-1.5" data-tour="leave-form-document">
                            <Label>
                                {{ selectedLeaveType.document_label || 'Supporting Document' }}
                                <span class="text-destructive">*</span>
                            </Label>
                            <div class="flex items-center gap-3">
                                <label class="flex cursor-pointer items-center gap-2 rounded-md border border-dashed px-4 py-2.5 text-sm hover:bg-muted/50">
                                    <Upload class="size-4 text-muted-foreground" />
                                    <span class="text-muted-foreground">{{ documentFile?.name ?? 'Choose file…' }}</span>
                                    <input type="file" class="hidden" accept=".pdf,.jpg,.jpeg,.png" @change="onDocumentChange" />
                                </label>
                                <span class="text-xs text-muted-foreground">PDF, JPG or PNG · max 5MB</span>
                            </div>
                            <p v-if="form.errors.document" class="text-sm text-destructive">{{ form.errors.document }}</p>
                        </div>

                        <!-- Reason -->
                        <div class="space-y-1.5" data-tour="leave-form-reason">
                            <Label>Reason</Label>
                            <Textarea v-model="form.reason" placeholder="Brief reason for leave..." rows="3" />
                        </div>

                        <div class="flex justify-end gap-2 pt-2">
                            <Button type="button" variant="outline" as-child><Link href="/hr/leave">Cancel</Link></Button>
                            <Button type="submit" :disabled="form.processing || exceedsBalance" data-tour="leave-form-submit">
                                {{ form.processing ? 'Submitting…' : 'Submit Application' }}
                            </Button>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    </AppLayout>
</template>
