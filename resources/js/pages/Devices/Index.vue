<script setup lang="ts">
import { Head, Link, router, usePage } from '@inertiajs/vue3';
import AppLayout from '@/layouts/AppLayout.vue';
import { type BreadcrumbItem } from '@/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Plus, Wifi, WifiOff, RefreshCw, Users, ClipboardList, RotateCcw, Trash2, Pencil, Eye, Cloud } from 'lucide-vue-next';
import { ref, computed } from 'vue';

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
}

const props = defineProps<{
    devices: Device[];
}>();

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Devices' },
];

const page = usePage();
const flash = computed(() => page.props as any);

const loading = ref<Record<string, boolean>>({});
const deleteDialogOpen = ref(false);
const deviceToDelete = ref<Device | null>(null);

function statusColor(status: string) {
    switch (status) {
        case 'online': return 'default';
        case 'offline': return 'destructive';
        default: return 'secondary';
    }
}

function pingDevice(device: Device) {
    loading.value[`ping-${device.id}`] = true;
    router.post(`/devices/${device.id}/ping`, {}, {
        preserveScroll: true,
        onFinish: () => { loading.value[`ping-${device.id}`] = false; },
    });
}

function syncUsers(device: Device) {
    loading.value[`sync-users-${device.id}`] = true;
    router.post(`/devices/${device.id}/sync-users`, {}, {
        preserveScroll: true,
        onFinish: () => { loading.value[`sync-users-${device.id}`] = false; },
    });
}

function syncAttendance(device: Device) {
    loading.value[`sync-att-${device.id}`] = true;
    router.post(`/devices/${device.id}/sync-attendance`, {}, {
        preserveScroll: true,
        onFinish: () => { loading.value[`sync-att-${device.id}`] = false; },
    });
}

function restartDevice(device: Device) {
    loading.value[`restart-${device.id}`] = true;
    router.post(`/devices/${device.id}/restart`, {}, {
        preserveScroll: true,
        onFinish: () => { loading.value[`restart-${device.id}`] = false; },
    });
}

function confirmDelete(device: Device) {
    deviceToDelete.value = device;
    deleteDialogOpen.value = true;
}

function deleteDevice() {
    if (!deviceToDelete.value) return;
    router.delete(`/devices/${deviceToDelete.value.id}`, {
        onFinish: () => {
            deleteDialogOpen.value = false;
            deviceToDelete.value = null;
        },
    });
}

function formatDate(date: string | null): string {
    if (!date) return 'Never';
    return new Date(date).toLocaleString();
}
</script>

<template>
    <Head title="Devices" />

    <AppLayout :breadcrumbs="breadcrumbs">
        <div class="flex h-full flex-1 flex-col gap-4 p-4 md:p-6">
            <!-- Header -->
            <div class="flex items-center justify-between">
                <div>
                    <h2 class="text-2xl font-bold tracking-tight">Devices</h2>
                    <p class="text-muted-foreground">Manage your ZKTeco attendance devices</p>
                </div>
                <Button as-child>
                    <Link href="/devices/create">
                        <Plus class="mr-2 size-4" />
                        Add Device
                    </Link>
                </Button>
            </div>

            <!-- Flash Messages -->
            <div v-if="flash.success" class="rounded-lg bg-green-50 p-4 text-sm text-green-800 dark:bg-green-950 dark:text-green-200">
                {{ flash.success }}
            </div>
            <div v-if="flash.error" class="rounded-lg bg-red-50 p-4 text-sm text-red-800 dark:bg-red-950 dark:text-red-200">
                {{ flash.error }}
            </div>

            <!-- Devices Grid -->
            <div v-if="devices.length > 0" class="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                <Card v-for="device in devices" :key="device.id" class="relative">
                    <CardHeader class="pb-3">
                        <div class="flex items-start justify-between">
                            <div>
                                <CardTitle class="text-lg">{{ device.name }}</CardTitle>
                                <CardDescription>
                                    <span v-if="device.connection_type === 'adms'" class="flex items-center gap-1">
                                        <Cloud class="size-3" /> ADMS · {{ device.serial_number ?? 'Pending' }}
                                    </span>
                                    <span v-else>{{ device.ip_address }}:{{ device.port }}</span>
                                </CardDescription>
                            </div>
                            <Badge :variant="statusColor(device.status)">
                                <component :is="device.status === 'online' ? Wifi : WifiOff" class="mr-1 size-3" />
                                {{ device.status }}
                            </Badge>
                        </div>
                    </CardHeader>
                    <CardContent class="space-y-4">
                        <!-- Device Info -->
                        <div class="grid grid-cols-2 gap-2 text-sm">
                            <div v-if="device.location" class="col-span-2">
                                <span class="text-muted-foreground">Location:</span>
                                <span class="ml-1 font-medium">{{ device.location }}</span>
                            </div>
                            <div v-if="device.serial_number">
                                <span class="text-muted-foreground">S/N:</span>
                                <span class="ml-1 font-medium">{{ device.serial_number }}</span>
                            </div>
                            <div v-if="device.platform">
                                <span class="text-muted-foreground">Platform:</span>
                                <span class="ml-1 font-medium">{{ device.platform }}</span>
                            </div>
                            <div>
                                <span class="text-muted-foreground">Employees:</span>
                                <span class="ml-1 font-medium">{{ device.employees_count }}</span>
                            </div>
                            <div>
                                <span class="text-muted-foreground">Logs:</span>
                                <span class="ml-1 font-medium">{{ device.attendance_logs_count }}</span>
                            </div>
                            <div class="col-span-2">
                                <span class="text-muted-foreground">Last Synced:</span>
                                <span class="ml-1 font-medium">{{ formatDate(device.last_synced_at) }}</span>
                            </div>
                        </div>

                        <!-- Actions -->
                        <div class="flex flex-wrap gap-2">
                            <template v-if="device.connection_type === 'lan'">
                                <Button
                                    size="sm"
                                    variant="outline"
                                    @click="pingDevice(device)"
                                    :disabled="loading[`ping-${device.id}`]"
                                >
                                    <RefreshCw class="mr-1 size-3" :class="{ 'animate-spin': loading[`ping-${device.id}`] }" />
                                    Ping
                                </Button>
                                <Button
                                    size="sm"
                                    variant="outline"
                                    @click="syncUsers(device)"
                                    :disabled="loading[`sync-users-${device.id}`]"
                                >
                                    <Users class="mr-1 size-3" :class="{ 'animate-spin': loading[`sync-users-${device.id}`] }" />
                                    Sync Users
                                </Button>
                                <Button
                                    size="sm"
                                    variant="outline"
                                    @click="syncAttendance(device)"
                                    :disabled="loading[`sync-att-${device.id}`]"
                                >
                                    <ClipboardList class="mr-1 size-3" :class="{ 'animate-spin': loading[`sync-att-${device.id}`] }" />
                                    Sync Attendance
                                </Button>
                            </template>
                            <template v-else>
                                <div class="text-xs text-muted-foreground rounded-md bg-muted px-2 py-1">
                                    <Cloud class="inline size-3 mr-1" /> Auto-syncing via ADMS
                                </div>
                            </template>
                        </div>
                        <div class="flex gap-2">
                            <Button size="sm" variant="ghost" as-child>
                                <Link :href="`/devices/${device.id}`">
                                    <Eye class="mr-1 size-3" /> View
                                </Link>
                            </Button>
                            <Button
                                v-if="device.connection_type === 'lan'"
                                size="sm"
                                variant="ghost"
                                @click="restartDevice(device)"
                                :disabled="loading[`restart-${device.id}`]"
                            >
                                <RotateCcw class="mr-1 size-3" /> Restart
                            </Button>
                            <Button
                                size="sm"
                                variant="ghost"
                                class="text-destructive hover:text-destructive"
                                @click="confirmDelete(device)"
                            >
                                <Trash2 class="mr-1 size-3" /> Delete
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </div>

            <!-- Empty State -->
            <Card v-else>
                <CardContent class="flex flex-col items-center justify-center py-12">
                    <WifiOff class="size-12 text-muted-foreground mb-4" />
                    <h3 class="text-lg font-medium">No devices added</h3>
                    <p class="text-muted-foreground mb-4">Add your first ZKTeco IN01 device to get started.</p>
                    <Button as-child>
                        <Link href="/devices/create">
                            <Plus class="mr-2 size-4" />
                            Add Device
                        </Link>
                    </Button>
                </CardContent>
            </Card>
        </div>

        <!-- Delete Confirmation Dialog -->
        <Dialog v-model:open="deleteDialogOpen">
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Delete Device</DialogTitle>
                    <DialogDescription>
                        Are you sure you want to delete "{{ deviceToDelete?.name }}"? This will also remove all associated attendance logs. This action cannot be undone.
                    </DialogDescription>
                </DialogHeader>
                <DialogFooter>
                    <Button variant="outline" @click="deleteDialogOpen = false">Cancel</Button>
                    <Button variant="destructive" @click="deleteDevice">Delete</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    </AppLayout>
</template>
