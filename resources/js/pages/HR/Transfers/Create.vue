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
import { ref, watch } from 'vue';

interface Employee { id: number; name: string; department: string | null; unit: string | null; position: string | null; location: string | null }

const props = defineProps<{
    employees: Employee[];
    departments: string[];
    locations: string[];
}>();

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'HR Management', href: '/hr' },
    { title: 'Transfers', href: '/hr/transfers' },
    { title: 'New Transfer' },
];

const form = useForm({
    employee_id: '',
    to_department: '',
    to_unit: '',
    to_location: '',
    to_position: '',
    reason: '',
    effective_date: '',
});

const selectedEmployee = ref<Employee | null>(null);

watch(() => form.employee_id, (id) => {
    selectedEmployee.value = props.employees.find(e => String(e.id) === id) ?? null;
});

function submit() {
    form.post('/hr/transfers');
}
</script>

<template>
    <Head title="New Transfer" />
    <AppLayout :breadcrumbs="breadcrumbs">
        <div class="flex h-full flex-1 flex-col gap-4 p-4 md:p-6">
            <h2 class="text-2xl font-bold">New Employee Transfer</h2>
            <Card class="max-w-2xl">
                <CardHeader><CardTitle>Transfer Details</CardTitle></CardHeader>
                <CardContent>
                    <form class="space-y-4" @submit.prevent="submit">
                        <div class="space-y-1.5">
                            <Label>Employee</Label>
                            <Select :model-value="form.employee_id || ''" @update:model-value="v => form.employee_id = String(v)">
                                <SelectTrigger><SelectValue placeholder="Select employee" /></SelectTrigger>
                                <SelectContent>
                                    <SelectItem v-for="emp in employees" :key="emp.id" :value="String(emp.id)">
                                        {{ emp.name }} — {{ emp.department ?? 'No dept' }}
                                    </SelectItem>
                                </SelectContent>
                            </Select>
                            <p v-if="form.errors.employee_id" class="text-sm text-destructive">{{ form.errors.employee_id }}</p>
                        </div>

                        <!-- Current info (read-only) -->
                        <div v-if="selectedEmployee" class="rounded-md bg-muted p-3 text-sm">
                            <p class="font-medium mb-1">Current Assignment</p>
                            <p>Department: <span class="text-muted-foreground">{{ selectedEmployee.department ?? '—' }}</span></p>
                            <p>Unit: <span class="text-muted-foreground">{{ selectedEmployee.unit ?? '—' }}</span></p>
                            <p>Location: <span class="text-muted-foreground">{{ selectedEmployee.location ?? '—' }}</span></p>
                            <p>Position: <span class="text-muted-foreground">{{ selectedEmployee.position ?? '—' }}</span></p>
                        </div>

                        <div class="grid gap-4 sm:grid-cols-2">
                            <div class="space-y-1.5">
                                <Label>Transfer To Department</Label>
                                <Select :model-value="form.to_department || ''" @update:model-value="v => form.to_department = String(v)">
                                    <SelectTrigger><SelectValue placeholder="Select department" /></SelectTrigger>
                                    <SelectContent>
                                        <SelectItem v-for="dept in departments" :key="dept" :value="dept">{{ dept }}</SelectItem>
                                    </SelectContent>
                                </Select>
                                <p v-if="form.errors.to_department" class="text-sm text-destructive">{{ form.errors.to_department }}</p>
                            </div>
                            <div class="space-y-1.5">
                                <Label>Unit <span class="text-muted-foreground text-xs">(optional)</span></Label>
                                <Input v-model="form.to_unit" placeholder="New unit" />
                            </div>
                            <div class="space-y-1.5">
                                <Label>Location</Label>
                                <Select :model-value="form.to_location || ''" @update:model-value="v => form.to_location = String(v)">
                                    <SelectTrigger><SelectValue placeholder="Select location" /></SelectTrigger>
                                    <SelectContent>
                                        <SelectItem v-for="loc in locations" :key="loc" :value="loc">{{ loc }}</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div class="space-y-1.5">
                                <Label>New Position <span class="text-muted-foreground text-xs">(optional)</span></Label>
                                <Input v-model="form.to_position" placeholder="New job title" />
                            </div>
                            <div class="space-y-1.5 sm:col-span-2">
                                <Label>Effective Date</Label>
                                <Input v-model="form.effective_date" type="date" />
                                <p v-if="form.errors.effective_date" class="text-sm text-destructive">{{ form.errors.effective_date }}</p>
                            </div>
                        </div>

                        <div class="space-y-1.5">
                            <Label>Reason for Transfer</Label>
                            <Textarea v-model="form.reason" rows="3" placeholder="State the reason for this transfer..." />
                            <p v-if="form.errors.reason" class="text-sm text-destructive">{{ form.errors.reason }}</p>
                        </div>

                        <div class="flex justify-end gap-2 pt-2">
                            <Button type="button" variant="outline" as-child><Link href="/hr/transfers">Cancel</Link></Button>
                            <Button type="submit" :disabled="form.processing">
                                {{ form.processing ? 'Submitting...' : 'Submit Transfer' }}
                            </Button>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    </AppLayout>
</template>
