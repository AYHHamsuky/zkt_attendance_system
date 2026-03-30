<script setup lang="ts">
import { Head, Link, useForm } from '@inertiajs/vue3';
import AppLayout from '@/layouts/AppLayout.vue';
import { type BreadcrumbItem } from '@/types';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';

interface Employee {
    id: number;
    name: string;
    department: string | null;
    position: string | null;
}

interface Contract {
    id: number;
    employee_id: number;
    contract_type: string;
    start_date: string;
    end_date: string | null;
    probation_end_date: string | null;
    salary_amount: string;
    terms: string | null;
    status: string;
}

const props = defineProps<{
    employees: Employee[];
    contract?: Contract;
}>();

const isEditing = !!props.contract;

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'HR Management', href: '/hr' },
    { title: 'Contracts', href: '/hr/contracts' },
    { title: isEditing ? 'Edit Contract' : 'New Contract' },
];

const form = useForm({
    employee_id: props.contract ? String(props.contract.employee_id) : '',
    contract_type: props.contract?.contract_type ?? 'permanent',
    start_date: props.contract?.start_date ?? '',
    end_date: props.contract?.end_date ?? '',
    probation_end_date: props.contract?.probation_end_date ?? '',
    salary_amount: props.contract?.salary_amount ?? '',
    terms: props.contract?.terms ?? '',
    status: props.contract?.status ?? 'active',
});

function submit() {
    if (isEditing) {
        form.patch(`/hr/contracts/${props.contract!.id}`, { preserveScroll: true });
    } else {
        form.post('/hr/contracts');
    }
}
</script>

<template>
    <Head :title="isEditing ? 'Edit Contract' : 'New Contract'" />
    <AppLayout :breadcrumbs="breadcrumbs">
        <div class="flex h-full flex-1 flex-col gap-4 p-4 md:p-6">
            <div>
                <h2 class="text-2xl font-bold">{{ isEditing ? 'Edit Contract' : 'New Contract' }}</h2>
            </div>

            <Card class="max-w-2xl">
                <CardHeader>
                    <CardTitle>Contract Details</CardTitle>
                    <CardDescription>Create an employment contract for an employee.</CardDescription>
                </CardHeader>
                <CardContent>
                    <form class="space-y-4" @submit.prevent="submit">
                        <div class="space-y-1.5">
                            <Label>Employee</Label>
                            <Select :model-value="form.employee_id || ''" @update:model-value="v => form.employee_id = String(v)" :disabled="isEditing">
                                <SelectTrigger><SelectValue placeholder="Select employee" /></SelectTrigger>
                                <SelectContent>
                                    <SelectItem v-for="emp in employees" :key="emp.id" :value="String(emp.id)">
                                        {{ emp.name }} {{ emp.department ? `— ${emp.department}` : '' }}
                                    </SelectItem>
                                </SelectContent>
                            </Select>
                            <p v-if="form.errors.employee_id" class="text-sm text-destructive">{{ form.errors.employee_id }}</p>
                        </div>

                        <div class="grid gap-4 sm:grid-cols-2">
                            <div class="space-y-1.5">
                                <Label>Contract Type</Label>
                                <Select :model-value="form.contract_type" @update:model-value="v => form.contract_type = String(v)">
                                    <SelectTrigger><SelectValue /></SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="permanent">Permanent</SelectItem>
                                        <SelectItem value="contract">Contract</SelectItem>
                                        <SelectItem value="temporary">Temporary</SelectItem>
                                        <SelectItem value="casual">Casual</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            <div class="space-y-1.5">
                                <Label>Monthly Salary (₦)</Label>
                                <Input v-model="form.salary_amount" type="number" min="0" placeholder="0" />
                                <p v-if="form.errors.salary_amount" class="text-sm text-destructive">{{ form.errors.salary_amount }}</p>
                            </div>

                            <div class="space-y-1.5">
                                <Label>Start Date</Label>
                                <Input v-model="form.start_date" type="date" />
                                <p v-if="form.errors.start_date" class="text-sm text-destructive">{{ form.errors.start_date }}</p>
                            </div>

                            <div class="space-y-1.5">
                                <Label>End Date <span class="text-muted-foreground text-xs">(leave blank for permanent)</span></Label>
                                <Input v-model="form.end_date" type="date" />
                            </div>

                            <div class="space-y-1.5">
                                <Label>Probation End Date</Label>
                                <Input v-model="form.probation_end_date" type="date" />
                            </div>

                            <div v-if="isEditing" class="space-y-1.5">
                                <Label>Status</Label>
                                <Select :model-value="form.status" @update:model-value="v => form.status = String(v)">
                                    <SelectTrigger><SelectValue /></SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="active">Active</SelectItem>
                                        <SelectItem value="expired">Expired</SelectItem>
                                        <SelectItem value="terminated">Terminated</SelectItem>
                                        <SelectItem value="renewed">Renewed</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>

                        <div class="space-y-1.5">
                            <Label>Contract Terms</Label>
                            <Textarea v-model="form.terms" placeholder="Enter any special terms or conditions..." rows="4" />
                        </div>

                        <div class="flex justify-end gap-2 pt-2">
                            <Button type="button" variant="outline" as-child>
                                <Link href="/hr/contracts">Cancel</Link>
                            </Button>
                            <Button type="submit" :disabled="form.processing">
                                {{ form.processing ? 'Saving...' : (isEditing ? 'Update Contract' : 'Create Contract') }}
                            </Button>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    </AppLayout>
</template>
