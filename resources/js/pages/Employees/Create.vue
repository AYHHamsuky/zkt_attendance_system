<script setup lang="ts">
import { Head, useForm, Link } from '@inertiajs/vue3';
import AppLayout from '@/layouts/AppLayout.vue';
import { type BreadcrumbItem } from '@/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import InputError from '@/components/InputError.vue';

interface Device {
    id: number;
    name: string;
}

interface Shift {
    id: number;
    name: string;
    department: string | null;
    unit: string | null;
    expected_check_in: string;
    expected_check_out: string;
}

const props = defineProps<{ devices: Device[]; shifts: Shift[] }>();

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Employees', href: '/employees' },
    { title: 'Add Employee' },
];

const form = useForm({
    name: '',
    user_id: '',
    email: '',
    phone: '',
    department: '',
    unit: '',
    position: '',
    device_id: '',
    shift_id: '',
});

function submit() {
    form.post('/employees');
}
</script>

<template>
    <Head title="Add Employee" />

    <AppLayout :breadcrumbs="breadcrumbs">
        <div class="flex h-full flex-1 flex-col gap-4 p-4 md:p-6">
            <div class="mx-auto w-full max-w-2xl">
                <Card>
                    <CardHeader>
                        <CardTitle>Add New Employee</CardTitle>
                        <CardDescription>
                            Register a new employee in the system. They can later be synced to a device.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form @submit.prevent="submit" class="space-y-6">
                            <div class="grid gap-4 sm:grid-cols-2">
                                <div class="space-y-2">
                                    <Label for="name">Full Name</Label>
                                    <Input id="name" v-model="form.name" placeholder="John Doe" required />
                                    <InputError :message="form.errors.name" />
                                </div>

                                <div class="space-y-2">
                                    <Label for="user_id">Employee ID</Label>
                                    <Input id="user_id" v-model="form.user_id" placeholder="EMP001" required />
                                    <InputError :message="form.errors.user_id" />
                                </div>
                            </div>

                            <div class="grid gap-4 sm:grid-cols-2">
                                <div class="space-y-2">
                                    <Label for="email">Email (Optional)</Label>
                                    <Input id="email" v-model="form.email" type="email" placeholder="john@example.com" />
                                    <InputError :message="form.errors.email" />
                                </div>

                                <div class="space-y-2">
                                    <Label for="phone">Phone (Optional)</Label>
                                    <Input id="phone" v-model="form.phone" placeholder="+1 234 567 8900" />
                                    <InputError :message="form.errors.phone" />
                                </div>
                            </div>

                            <div class="grid gap-4 sm:grid-cols-2">
                                <div class="space-y-2">
                                    <Label for="department">Department (Optional)</Label>
                                    <Input id="department" v-model="form.department" placeholder="Engineering" />
                                    <InputError :message="form.errors.department" />
                                </div>

                                <div class="space-y-2">
                                    <Label for="unit">Unit (Optional)</Label>
                                    <Input id="unit" v-model="form.unit" placeholder="Unit A" />
                                    <InputError :message="form.errors.unit" />
                                </div>
                            </div>

                            <div class="space-y-2">
                                <Label for="position">Position (Optional)</Label>
                                <Input id="position" v-model="form.position" placeholder="Software Engineer" />
                                <InputError :message="form.errors.position" />
                            </div>

                            <div class="grid gap-4 sm:grid-cols-2">
                                <div class="space-y-2">
                                    <Label for="device_id">Assign to Device (Optional)</Label>
                                    <Select v-model="form.device_id">
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select a device" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="">None</SelectItem>
                                            <SelectItem v-for="device in devices" :key="device.id" :value="String(device.id)">
                                                {{ device.name }}
                                            </SelectItem>
                                        </SelectContent>
                                    </Select>
                                    <InputError :message="form.errors.device_id" />
                                </div>

                                <div class="space-y-2">
                                    <Label for="shift_id">Assign Shift (Optional)</Label>
                                    <Select v-model="form.shift_id">
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select a shift" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="">Auto-resolve</SelectItem>
                                            <SelectItem v-for="shift in shifts" :key="shift.id" :value="String(shift.id)">
                                                {{ shift.name }} ({{ shift.expected_check_in }} – {{ shift.expected_check_out }})
                                            </SelectItem>
                                        </SelectContent>
                                    </Select>
                                    <InputError :message="form.errors.shift_id" />
                                </div>
                            </div>

                            <div class="flex justify-end gap-3">
                                <Button variant="outline" as-child>
                                    <Link href="/employees">Cancel</Link>
                                </Button>
                                <Button type="submit" :disabled="form.processing">
                                    {{ form.processing ? 'Creating...' : 'Create Employee' }}
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </div>
    </AppLayout>
</template>
