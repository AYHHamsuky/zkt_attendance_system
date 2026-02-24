<script setup lang="ts">
import { Head, Link, router, useForm } from '@inertiajs/vue3';
import AppLayout from '@/layouts/AppLayout.vue';
import { type BreadcrumbItem } from '@/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import InputError from '@/components/InputError.vue';
import { Wifi, WifiOff, RefreshCw, Users, ClipboardList, RotateCcw, Pencil, ArrowLeft, Cloud } from 'lucide-vue-next';
import { ref } from 'vue';

interface Device {
    id: number;
    name: string;
    ip_address: string;
    port: number;
    connection_type: 'lan' | 'adms';
    serial_number: string | null;
    device_name: string | null;
    platform: string | null;
    firmware_version: string | null;
    mac_address: string | null;
    location: string | null;
    status: 'online' | 'offline' | 'unknown';
    last_synced_at: string | null;
    employees_count: number;
    attendance_logs_count: number;
    created_at: string;
    updated_at: string;
}

const props = defineProps<{ device: Device }>();

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Devices', href: '/devices' },
    { title: props.device.name },
];

const editing = ref(false);
const loading = ref<Record<string, boolean>>({});

const form = useForm({
    name: props.device.name,
    connection_type: props.device.connection_type,
    ip_address: props.device.ip_address,
    port: props.device.port,
    serial_number: props.device.serial_number ?? '',
    location: props.device.location ?? '',
});

function saveDevice() {
    form.put(`/devices/${props.device.id}`, {
        onSuccess: () => { editing.value = false; },
    });
}

function pingDevice() {
    loading.value.ping = true;
    router.post(`/devices/${props.device.id}/ping`, {}, {
        preserveScroll: true,
        onFinish: () => { loading.value.ping = false; },
    });
}

function syncUsers() {
    loading.value.syncUsers = true;
    router.post(`/devices/${props.device.id}/sync-users`, {}, {
        preserveScroll: true,
        onFinish: () => { loading.value.syncUsers = false; },
    });
}

function syncAttendance() {
    loading.value.syncAtt = true;
    router.post(`/devices/${props.device.id}/sync-attendance`, {}, {
        preserveScroll: true,
        onFinish: () => { loading.value.syncAtt = false; },
    });
}

function restartDevice() {
    loading.value.restart = true;
    router.post(`/devices/${props.device.id}/restart`, {}, {
        preserveScroll: true,
        onFinish: () => { loading.value.restart = false; },
    });
}

function formatDate(date: string | null): string {
    if (!date) return 'Never';
    return new Date(date).toLocaleString();
}
</script>

<template>
    <Head :title="device.name" />

    <AppLayout :breadcrumbs="breadcrumbs">
        <div class="flex h-full flex-1 flex-col gap-4 p-4 md:p-6">
            <!-- Header -->
            <div class="flex items-center gap-4">
                <Button variant="ghost" size="sm" as-child>
                    <Link href="/devices"><ArrowLeft class="mr-1 size-4" /> Back</Link>
                </Button>
                <div class="flex-1">
                    <h2 class="text-2xl font-bold tracking-tight">{{ device.name }}</h2>
                    <p class="text-muted-foreground">
                        <span v-if="device.connection_type === 'adms'" class="flex items-center gap-1">
                            <Cloud class="size-3" /> ADMS · {{ device.serial_number ?? 'Pending connection' }}
                        </span>
                        <span v-else>{{ device.ip_address }}:{{ device.port }}</span>
                    </p>
                </div>
                <Badge :variant="device.status === 'online' ? 'default' : 'destructive'" class="text-sm">
                    <component :is="device.status === 'online' ? Wifi : WifiOff" class="mr-1 size-4" />
                    {{ device.status }}
                </Badge>
            </div>

            <div class="grid gap-4 md:grid-cols-2">
                <!-- Device Info / Edit Card -->
                <Card>
                    <CardHeader class="flex flex-row items-center justify-between">
                        <div>
                            <CardTitle>Device Information</CardTitle>
                            <CardDescription>Configuration and hardware details</CardDescription>
                        </div>
                        <Button variant="outline" size="sm" @click="editing = !editing">
                            <Pencil class="mr-1 size-3" />
                            {{ editing ? 'Cancel' : 'Edit' }}
                        </Button>
                    </CardHeader>
                    <CardContent>
                        <form v-if="editing" @submit.prevent="saveDevice" class="space-y-4">
                            <div class="space-y-2">
                                <Label for="name">Name</Label>
                                <Input id="name" v-model="form.name" required />
                                <InputError :message="form.errors.name" />
                            </div>
                            <div v-if="device.connection_type === 'adms'" class="space-y-2">
                                <Label for="serial_number">Serial Number</Label>
                                <Input id="serial_number" v-model="form.serial_number" />
                                <InputError :message="form.errors.serial_number" />
                            </div>
                            <div v-if="device.connection_type === 'lan'" class="grid grid-cols-2 gap-4">
                                <div class="space-y-2">
                                    <Label for="ip_address">IP Address</Label>
                                    <Input id="ip_address" v-model="form.ip_address" required />
                                    <InputError :message="form.errors.ip_address" />
                                </div>
                                <div class="space-y-2">
                                    <Label for="port">Port</Label>
                                    <Input id="port" v-model.number="form.port" type="number" required />
                                    <InputError :message="form.errors.port" />
                                </div>
                            </div>
                            <div class="space-y-2">
                                <Label for="location">Location</Label>
                                <Input id="location" v-model="form.location" />
                                <InputError :message="form.errors.location" />
                            </div>
                            <Button type="submit" :disabled="form.processing" class="w-full">
                                {{ form.processing ? 'Saving...' : 'Save Changes' }}
                            </Button>
                        </form>

                        <dl v-else class="space-y-3 text-sm">
                            <div class="flex justify-between">
                                <dt class="text-muted-foreground">Name</dt>
                                <dd class="font-medium">{{ device.name }}</dd>
                            </div>
                            <div class="flex justify-between">
                                <dt class="text-muted-foreground">Connection</dt>
                                <dd class="font-medium">
                                    <span v-if="device.connection_type === 'adms'" class="inline-flex items-center gap-1 rounded-full bg-blue-100 px-2 py-0.5 text-xs text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                                        <Cloud class="size-3" /> ADMS
                                    </span>
                                    <span v-else class="inline-flex items-center gap-1 rounded-full bg-gray-100 px-2 py-0.5 text-xs text-gray-800 dark:bg-gray-800 dark:text-gray-200">
                                        <Wifi class="size-3" /> LAN
                                    </span>
                                </dd>
                            </div>
                            <div v-if="device.connection_type === 'lan'" class="flex justify-between">
                                <dt class="text-muted-foreground">IP Address</dt>
                                <dd class="font-medium">{{ device.ip_address }}</dd>
                            </div>
                            <div v-if="device.connection_type === 'lan'" class="flex justify-between">
                                <dt class="text-muted-foreground">Port</dt>
                                <dd class="font-medium">{{ device.port }}</dd>
                            </div>
                            <div class="flex justify-between">
                                <dt class="text-muted-foreground">Location</dt>
                                <dd class="font-medium">{{ device.location ?? '—' }}</dd>
                            </div>
                            <div class="flex justify-between">
                                <dt class="text-muted-foreground">Serial Number</dt>
                                <dd class="font-medium">{{ device.serial_number ?? '—' }}</dd>
                            </div>
                            <div class="flex justify-between">
                                <dt class="text-muted-foreground">Device Name</dt>
                                <dd class="font-medium">{{ device.device_name ?? '—' }}</dd>
                            </div>
                            <div class="flex justify-between">
                                <dt class="text-muted-foreground">Platform</dt>
                                <dd class="font-medium">{{ device.platform ?? '—' }}</dd>
                            </div>
                            <div class="flex justify-between">
                                <dt class="text-muted-foreground">Firmware</dt>
                                <dd class="font-medium">{{ device.firmware_version ?? '—' }}</dd>
                            </div>
                            <div class="flex justify-between">
                                <dt class="text-muted-foreground">MAC Address</dt>
                                <dd class="font-medium">{{ device.mac_address ?? '—' }}</dd>
                            </div>
                            <div class="flex justify-between">
                                <dt class="text-muted-foreground">Employees</dt>
                                <dd class="font-medium">{{ device.employees_count }}</dd>
                            </div>
                            <div class="flex justify-between">
                                <dt class="text-muted-foreground">Attendance Logs</dt>
                                <dd class="font-medium">{{ device.attendance_logs_count }}</dd>
                            </div>
                            <div class="flex justify-between">
                                <dt class="text-muted-foreground">Last Synced</dt>
                                <dd class="font-medium">{{ formatDate(device.last_synced_at) }}</dd>
                            </div>
                            <div class="flex justify-between">
                                <dt class="text-muted-foreground">Created</dt>
                                <dd class="font-medium">{{ formatDate(device.created_at) }}</dd>
                            </div>
                        </dl>
                    </CardContent>
                </Card>

                <!-- Device Actions -->
                <Card>
                    <CardHeader>
                        <CardTitle>Device Actions</CardTitle>
                        <CardDescription>Send commands to the ZKTeco device</CardDescription>
                    </CardHeader>
                    <CardContent class="space-y-3">
                        <template v-if="device.connection_type === 'lan'">
                            <Button variant="outline" class="w-full justify-start" @click="pingDevice" :disabled="loading.ping">
                                <RefreshCw class="mr-2 size-4" :class="{ 'animate-spin': loading.ping }" />
                                Test Connection &amp; Fetch Info
                            </Button>
                            <Button variant="outline" class="w-full justify-start" @click="syncUsers" :disabled="loading.syncUsers">
                                <Users class="mr-2 size-4" :class="{ 'animate-spin': loading.syncUsers }" />
                                Sync Users from Device
                            </Button>
                            <Button variant="outline" class="w-full justify-start" @click="syncAttendance" :disabled="loading.syncAtt">
                                <ClipboardList class="mr-2 size-4" :class="{ 'animate-spin': loading.syncAtt }" />
                                Sync Attendance Logs
                            </Button>
                            <Button variant="outline" class="w-full justify-start" @click="restartDevice" :disabled="loading.restart">
                                <RotateCcw class="mr-2 size-4" :class="{ 'animate-spin': loading.restart }" />
                                Restart Device
                            </Button>
                        </template>
                        <template v-else>
                            <div class="rounded-lg border border-blue-200 bg-blue-50 p-4 dark:border-blue-900 dark:bg-blue-950">
                                <p class="text-sm font-medium text-blue-800 dark:text-blue-200 mb-2 flex items-center gap-2">
                                    <Cloud class="size-4" /> ADMS Auto-Sync Active
                                </p>
                                <ul class="text-xs text-blue-700 dark:text-blue-300 space-y-1">
                                    <li>✓ Attendance is pushed in real-time</li>
                                    <li>✓ New users are synced automatically</li>
                                    <li>✓ Device status updates on each connection</li>
                                </ul>
                            </div>
                            <div class="rounded-lg border p-4">
                                <p class="text-sm font-medium mb-1">Device Configuration</p>
                                <p class="text-xs text-muted-foreground">Ensure your device is set to:</p>
                                <ul class="text-xs text-muted-foreground mt-1 space-y-0.5">
                                    <li>Server: <strong class="text-foreground">zkt.alphanumeric.com.ng</strong></li>
                                    <li>Port: <strong class="text-foreground">80</strong></li>
                                    <li>Mode: <strong class="text-foreground">ADMS</strong></li>
                                </ul>
                            </div>
                        </template>
                    </CardContent>
                </Card>
            </div>
        </div>
    </AppLayout>
</template>
