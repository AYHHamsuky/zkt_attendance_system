<script setup lang="ts">
import { Head, Link, useForm } from '@inertiajs/vue3';
import AppLayout from '@/layouts/AppLayout.vue';
import { type BreadcrumbItem } from '@/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import InputError from '@/components/InputError.vue';
import { ArrowLeft, Pencil, Fingerprint, CreditCard } from 'lucide-vue-next';
import { ref } from 'vue';

interface AttendanceLog {
    id: number;
    uid: string;
    timestamp: string;
    state: number;
    type: number;
    state_label: string;
    type_label: string;
}

interface Employee {
    id: number;
    uid: number;
    user_id: string;
    name: string;
    email: string | null;
    phone: string | null;
    department: string | null;
    position: string | null;
    role: 'user' | 'admin';
    card_number: number;
    has_fingerprint: boolean;
    is_active: boolean;
    device: { id: number; name: string } | null;
    attendance_logs: AttendanceLog[];
    created_at: string;
    updated_at: string;
}

const props = defineProps<{ employee: Employee }>();

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Employees', href: '/employees' },
    { title: props.employee.name },
];

const editing = ref(false);

const form = useForm({
    name: props.employee.name,
    email: props.employee.email ?? '',
    phone: props.employee.phone ?? '',
    department: props.employee.department ?? '',
    position: props.employee.position ?? '',
    is_active: props.employee.is_active,
});

function saveEmployee() {
    form.put(`/employees/${props.employee.id}`, {
        onSuccess: () => { editing.value = false; },
    });
}

function stateBadgeVariant(state: number): 'default' | 'secondary' | 'destructive' | 'outline' {
    switch (state) {
        case 0: return 'default';
        case 1: return 'secondary';
        case 2: return 'destructive';
        case 3: return 'outline';
        default: return 'outline';
    }
}

function stateLabel(state: number): string {
    const labels: Record<number, string> = { 0: 'Check In', 1: 'Check Out', 2: 'Break Out', 3: 'Break In', 4: 'OT In', 5: 'OT Out' };
    return labels[state] ?? 'Unknown';
}

function typeLabel(type: number): string {
    const labels: Record<number, string> = { 1: 'Fingerprint', 4: 'Card', 15: 'Face' };
    return labels[type] ?? 'Other';
}

function formatTime(timestamp: string): string {
    return new Date(timestamp).toLocaleString();
}
</script>

<template>
    <Head :title="employee.name" />

    <AppLayout :breadcrumbs="breadcrumbs">
        <div class="flex h-full flex-1 flex-col gap-4 p-4 md:p-6">
            <!-- Header -->
            <div class="flex items-center gap-4">
                <Button variant="ghost" size="sm" as-child>
                    <Link href="/employees"><ArrowLeft class="mr-1 size-4" /> Back</Link>
                </Button>
                <div class="flex-1">
                    <h2 class="text-2xl font-bold tracking-tight">{{ employee.name }}</h2>
                    <p class="text-muted-foreground">UID: {{ employee.uid }} · ID: {{ employee.user_id }}</p>
                </div>
                <Badge :variant="employee.is_active ? 'default' : 'secondary'" class="text-sm">
                    {{ employee.is_active ? 'Active' : 'Inactive' }}
                </Badge>
            </div>

            <div class="grid gap-4 md:grid-cols-2">
                <!-- Employee Info -->
                <Card>
                    <CardHeader class="flex flex-row items-center justify-between">
                        <div>
                            <CardTitle>Employee Details</CardTitle>
                            <CardDescription>Personal and work information</CardDescription>
                        </div>
                        <Button variant="outline" size="sm" @click="editing = !editing">
                            <Pencil class="mr-1 size-3" />
                            {{ editing ? 'Cancel' : 'Edit' }}
                        </Button>
                    </CardHeader>
                    <CardContent>
                        <form v-if="editing" @submit.prevent="saveEmployee" class="space-y-4">
                            <div class="space-y-2">
                                <Label for="name">Name</Label>
                                <Input id="name" v-model="form.name" required />
                                <InputError :message="form.errors.name" />
                            </div>
                            <div class="grid grid-cols-2 gap-4">
                                <div class="space-y-2">
                                    <Label for="email">Email</Label>
                                    <Input id="email" v-model="form.email" type="email" />
                                    <InputError :message="form.errors.email" />
                                </div>
                                <div class="space-y-2">
                                    <Label for="phone">Phone</Label>
                                    <Input id="phone" v-model="form.phone" />
                                    <InputError :message="form.errors.phone" />
                                </div>
                            </div>
                            <div class="grid grid-cols-2 gap-4">
                                <div class="space-y-2">
                                    <Label for="department">Department</Label>
                                    <Input id="department" v-model="form.department" />
                                    <InputError :message="form.errors.department" />
                                </div>
                                <div class="space-y-2">
                                    <Label for="position">Position</Label>
                                    <Input id="position" v-model="form.position" />
                                    <InputError :message="form.errors.position" />
                                </div>
                            </div>
                            <div class="flex items-center gap-2">
                                <Checkbox id="is_active" :checked="form.is_active" @update:checked="(val: boolean) => form.is_active = val" />
                                <Label for="is_active">Active</Label>
                            </div>
                            <Button type="submit" :disabled="form.processing" class="w-full">
                                {{ form.processing ? 'Saving...' : 'Save Changes' }}
                            </Button>
                        </form>

                        <dl v-else class="space-y-3 text-sm">
                            <div class="flex justify-between">
                                <dt class="text-muted-foreground">Name</dt>
                                <dd class="font-medium">{{ employee.name }}</dd>
                            </div>
                            <div class="flex justify-between">
                                <dt class="text-muted-foreground">Device UID</dt>
                                <dd class="font-mono font-medium">{{ employee.uid }}</dd>
                            </div>
                            <div class="flex justify-between">
                                <dt class="text-muted-foreground">Employee ID</dt>
                                <dd class="font-medium">{{ employee.user_id }}</dd>
                            </div>
                            <div class="flex justify-between">
                                <dt class="text-muted-foreground">Email</dt>
                                <dd class="font-medium">{{ employee.email ?? '—' }}</dd>
                            </div>
                            <div class="flex justify-between">
                                <dt class="text-muted-foreground">Phone</dt>
                                <dd class="font-medium">{{ employee.phone ?? '—' }}</dd>
                            </div>
                            <div class="flex justify-between">
                                <dt class="text-muted-foreground">Department</dt>
                                <dd class="font-medium">{{ employee.department ?? '—' }}</dd>
                            </div>
                            <div class="flex justify-between">
                                <dt class="text-muted-foreground">Position</dt>
                                <dd class="font-medium">{{ employee.position ?? '—' }}</dd>
                            </div>
                            <div class="flex justify-between">
                                <dt class="text-muted-foreground">Role</dt>
                                <dd>
                                    <Badge :variant="employee.role === 'admin' ? 'default' : 'secondary'">
                                        {{ employee.role }}
                                    </Badge>
                                </dd>
                            </div>
                            <div class="flex justify-between">
                                <dt class="text-muted-foreground">Device</dt>
                                <dd class="font-medium">{{ employee.device?.name ?? 'Unassigned' }}</dd>
                            </div>
                            <div class="flex justify-between items-center">
                                <dt class="text-muted-foreground flex items-center gap-1">
                                    <Fingerprint class="size-4" /> Fingerprint
                                </dt>
                                <dd>
                                    <Badge :variant="employee.has_fingerprint ? 'default' : 'outline'">
                                        {{ employee.has_fingerprint ? 'Enrolled' : 'Not Enrolled' }}
                                    </Badge>
                                </dd>
                            </div>
                            <div class="flex justify-between items-center">
                                <dt class="text-muted-foreground flex items-center gap-1">
                                    <CreditCard class="size-4" /> Card Number
                                </dt>
                                <dd class="font-mono font-medium">{{ employee.card_number || '—' }}</dd>
                            </div>
                        </dl>
                    </CardContent>
                </Card>

                <!-- Recent Attendance -->
                <Card>
                    <CardHeader>
                        <CardTitle>Recent Attendance</CardTitle>
                        <CardDescription>Last 50 attendance records</CardDescription>
                    </CardHeader>
                    <CardContent class="p-0">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Time</TableHead>
                                    <TableHead>State</TableHead>
                                    <TableHead>Method</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                <TableRow v-for="log in employee.attendance_logs" :key="log.id">
                                    <TableCell class="text-sm">{{ formatTime(log.timestamp) }}</TableCell>
                                    <TableCell>
                                        <Badge :variant="stateBadgeVariant(log.state)" class="text-xs">
                                            {{ stateLabel(log.state) }}
                                        </Badge>
                                    </TableCell>
                                    <TableCell class="text-sm">{{ typeLabel(log.type) }}</TableCell>
                                </TableRow>
                                <TableRow v-if="employee.attendance_logs.length === 0">
                                    <TableCell colspan="3" class="text-center text-muted-foreground py-8">
                                        No attendance records found.
                                    </TableCell>
                                </TableRow>
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            </div>
        </div>
    </AppLayout>
</template>
