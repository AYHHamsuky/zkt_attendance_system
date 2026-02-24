<script setup lang="ts">
import { Head, useForm, Link } from '@inertiajs/vue3';
import AppLayout from '@/layouts/AppLayout.vue';
import { type BreadcrumbItem } from '@/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import InputError from '@/components/InputError.vue';
import { Wifi, Cloud } from 'lucide-vue-next';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Devices', href: '/devices' },
    { title: 'Add Device' },
];

const form = useForm({
    name: '',
    connection_type: 'adms' as 'lan' | 'adms',
    ip_address: '',
    port: 4370,
    serial_number: '',
    location: '',
});

function submit() {
    form.post('/devices');
}
</script>

<template>
    <Head title="Add Device" />

    <AppLayout :breadcrumbs="breadcrumbs">
        <div class="flex h-full flex-1 flex-col gap-4 p-4 md:p-6">
            <div class="mx-auto w-full max-w-2xl">
                <Card>
                    <CardHeader>
                        <CardTitle>Add New Device</CardTitle>
                        <CardDescription>
                            Connect a ZKTeco attendance device. Choose the connection method based on your setup.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form @submit.prevent="submit" class="space-y-6">
                            <!-- Connection Type Selection -->
                            <div class="space-y-3">
                                <Label>Connection Type</Label>
                                <div class="grid gap-3 sm:grid-cols-2">
                                    <button
                                        type="button"
                                        @click="form.connection_type = 'adms'"
                                        :class="[
                                            'flex items-start gap-3 rounded-lg border-2 p-4 text-left transition-colors',
                                            form.connection_type === 'adms'
                                                ? 'border-primary bg-primary/5'
                                                : 'border-muted hover:border-muted-foreground/25'
                                        ]"
                                    >
                                        <Cloud class="mt-0.5 size-5 shrink-0 text-primary" />
                                        <div>
                                            <div class="font-medium">ADMS (Cloud Push)</div>
                                            <div class="text-sm text-muted-foreground">
                                                Device pushes data via internet. Best for SIM card / remote devices.
                                            </div>
                                        </div>
                                    </button>
                                    <button
                                        type="button"
                                        @click="form.connection_type = 'lan'"
                                        :class="[
                                            'flex items-start gap-3 rounded-lg border-2 p-4 text-left transition-colors',
                                            form.connection_type === 'lan'
                                                ? 'border-primary bg-primary/5'
                                                : 'border-muted hover:border-muted-foreground/25'
                                        ]"
                                    >
                                        <Wifi class="mt-0.5 size-5 shrink-0 text-primary" />
                                        <div>
                                            <div class="font-medium">LAN (Direct)</div>
                                            <div class="text-sm text-muted-foreground">
                                                Connect directly via IP address. Requires same network.
                                            </div>
                                        </div>
                                    </button>
                                </div>
                                <InputError :message="form.errors.connection_type" />
                            </div>

                            <div class="space-y-2">
                                <Label for="name">Device Name</Label>
                                <Input
                                    id="name"
                                    v-model="form.name"
                                    placeholder="e.g., Main Entrance, Reception"
                                    required
                                />
                                <InputError :message="form.errors.name" />
                            </div>

                            <!-- ADMS fields -->
                            <div v-if="form.connection_type === 'adms'" class="space-y-4">
                                <div class="space-y-2">
                                    <Label for="serial_number">Device Serial Number</Label>
                                    <Input
                                        id="serial_number"
                                        v-model="form.serial_number"
                                        placeholder="e.g., ABCD1234567890"
                                        required
                                    />
                                    <p class="text-xs text-muted-foreground">
                                        Found on the device: Menu → System Info → Serial Number
                                    </p>
                                    <InputError :message="form.errors.serial_number" />
                                </div>

                                <div class="rounded-lg border border-blue-200 bg-blue-50 p-4 text-sm dark:border-blue-900 dark:bg-blue-950">
                                    <p class="font-medium text-blue-800 dark:text-blue-200 mb-2">ADMS Device Setup</p>
                                    <p class="text-blue-700 dark:text-blue-300 mb-2">
                                        Configure these settings on your ZKTeco device under
                                        <strong>COMM → Cloud Server Setting</strong>:
                                    </p>
                                    <ul class="list-disc pl-5 text-blue-700 dark:text-blue-300 space-y-1">
                                        <li>Server Mode: <strong>ADMS</strong></li>
                                        <li>Enable Domain Name: <strong>ON</strong></li>
                                        <li>Server Address: <strong>zkt.alphanumeric.com.ng</strong></li>
                                        <li>Server Port: <strong>80</strong></li>
                                        <li>Enable Proxy Server: <strong>OFF</strong></li>
                                    </ul>
                                    <p class="text-blue-700 dark:text-blue-300 mt-2">
                                        The device will auto-connect and push attendance data in real-time.
                                    </p>
                                </div>
                            </div>

                            <!-- LAN fields -->
                            <div v-if="form.connection_type === 'lan'" class="grid gap-4 sm:grid-cols-2">
                                <div class="space-y-2">
                                    <Label for="ip_address">IP Address</Label>
                                    <Input
                                        id="ip_address"
                                        v-model="form.ip_address"
                                        placeholder="e.g., 192.168.1.201"
                                        required
                                    />
                                    <InputError :message="form.errors.ip_address" />
                                </div>

                                <div class="space-y-2">
                                    <Label for="port">Port</Label>
                                    <Input
                                        id="port"
                                        v-model.number="form.port"
                                        type="number"
                                        min="1"
                                        max="65535"
                                        required
                                    />
                                    <InputError :message="form.errors.port" />
                                </div>
                            </div>

                            <div class="space-y-2">
                                <Label for="location">Location (Optional)</Label>
                                <Input
                                    id="location"
                                    v-model="form.location"
                                    placeholder="e.g., Building A, Floor 1"
                                />
                                <InputError :message="form.errors.location" />
                            </div>

                            <div class="flex justify-end gap-3">
                                <Button variant="outline" as-child>
                                    <Link href="/devices">Cancel</Link>
                                </Button>
                                <Button type="submit" :disabled="form.processing">
                                    {{ form.processing ? 'Adding...' : 'Add Device' }}
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </div>
    </AppLayout>
</template>
