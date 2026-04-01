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

interface Employee { id: number; name: string; department: string | null; position: string | null }

defineProps<{ employees: Employee[] }>();

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'HRIS', href: '/hr' },
    { title: 'Resignations', href: '/hr/resignations' },
    { title: 'Record Resignation' },
];

const form = useForm({
    employee_id: '',
    resignation_date: '',
    last_working_date: '',
    exit_type: 'voluntary',
    reason: '',
    notes: '',
});

function submit() {
    form.post('/hr/resignations');
}
</script>

<template>
    <Head title="Record Resignation" />
    <AppLayout :breadcrumbs="breadcrumbs">
        <div class="flex h-full flex-1 flex-col gap-4 p-4 md:p-6">
            <h2 class="text-2xl font-bold">Record Resignation</h2>
            <Card class="max-w-2xl">
                <CardHeader><CardTitle>Resignation Details</CardTitle></CardHeader>
                <CardContent>
                    <form class="space-y-4" @submit.prevent="submit">
                        <div class="space-y-1.5">
                            <Label>Employee</Label>
                            <Select :model-value="form.employee_id || ''" @update:model-value="v => form.employee_id = String(v)">
                                <SelectTrigger><SelectValue placeholder="Select employee" /></SelectTrigger>
                                <SelectContent>
                                    <SelectItem v-for="emp in employees" :key="emp.id" :value="String(emp.id)">
                                        {{ emp.name }} {{ emp.department ? `— ${emp.department}` : '' }}
                                    </SelectItem>
                                </SelectContent>
                            </Select>
                            <p v-if="form.errors.employee_id" class="text-sm text-destructive">{{ form.errors.employee_id }}</p>
                        </div>

                        <div class="space-y-1.5">
                            <Label>Exit Type</Label>
                            <Select :model-value="form.exit_type" @update:model-value="v => form.exit_type = String(v)">
                                <SelectTrigger><SelectValue /></SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="voluntary">Voluntary Resignation</SelectItem>
                                    <SelectItem value="involuntary">Involuntary (Termination)</SelectItem>
                                    <SelectItem value="retirement">Retirement</SelectItem>
                                    <SelectItem value="end_of_contract">End of Contract</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div class="grid gap-4 sm:grid-cols-2">
                            <div class="space-y-1.5">
                                <Label>Resignation Date</Label>
                                <Input v-model="form.resignation_date" type="date" />
                                <p v-if="form.errors.resignation_date" class="text-sm text-destructive">{{ form.errors.resignation_date }}</p>
                            </div>
                            <div class="space-y-1.5">
                                <Label>Last Working Date</Label>
                                <Input v-model="form.last_working_date" type="date" />
                                <p v-if="form.errors.last_working_date" class="text-sm text-destructive">{{ form.errors.last_working_date }}</p>
                            </div>
                        </div>

                        <div class="space-y-1.5">
                            <Label>Reason</Label>
                            <Textarea v-model="form.reason" rows="3" placeholder="Reason for resignation..." />
                            <p v-if="form.errors.reason" class="text-sm text-destructive">{{ form.errors.reason }}</p>
                        </div>

                        <div class="space-y-1.5">
                            <Label>HR Notes <span class="text-muted-foreground text-xs">(internal)</span></Label>
                            <Textarea v-model="form.notes" rows="2" placeholder="Internal notes..." />
                        </div>

                        <div class="flex justify-end gap-2 pt-2">
                            <Button type="button" variant="outline" as-child><Link href="/hr/resignations">Cancel</Link></Button>
                            <Button type="submit" :disabled="form.processing">
                                {{ form.processing ? 'Saving...' : 'Record Resignation' }}
                            </Button>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    </AppLayout>
</template>
