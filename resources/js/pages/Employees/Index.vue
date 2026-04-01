<script setup lang="ts">
import { Head, Link, router, useForm, usePage } from '@inertiajs/vue3';
import AppLayout from '@/layouts/AppLayout.vue';
import { type BreadcrumbItem } from '@/types';
import { Card, CardContent } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Plus, Search, Trash2, Eye, UserX, RefreshCw, Archive, ArchiveRestore } from 'lucide-vue-next';
import { computed, ref, watch } from 'vue';
import { debounce } from '@/lib/debounce';

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
    archived_at: string | null;
    archive_reason: string | null;
    device: { id: number; name: string } | null;
    created_at: string;
}

interface PaginatedData {
    data: Employee[];
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
    links: Array<{ url: string | null; label: string; active: boolean }>;
}

const props = defineProps<{
    employees: PaginatedData;
    departments: string[];
    filters: {
        search?: string;
        department?: string;
        status?: string;
        fingerprint?: string;
        archived?: string;
    };
}>();

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Employees' },
];

const page = usePage();
const userRole = computed(() => (page.props.auth as { user: { role: string } }).user?.role);
const isAdmin = computed(() => userRole.value === 'admin' || userRole.value === 'super_admin');

const search = ref(props.filters.search ?? '');
const department = ref(props.filters.department ?? '');
const status = ref(props.filters.status ?? '');
const fingerprint = ref(props.filters.fingerprint ?? '');
const archived = ref(props.filters.archived ?? 'no');
const syncing = ref(false);

// Delete dialog
const deleteDialogOpen = ref(false);
const employeeToDelete = ref<Employee | null>(null);

// Archive dialog
const archiveDialogOpen = ref(false);
const employeeToArchive = ref<Employee | null>(null);
const archiveForm = useForm({ reason: '' });

const applyFilters = debounce(() => {
    router.get('/employees', {
        search: search.value || undefined,
        department: department.value || undefined,
        status: status.value || undefined,
        fingerprint: fingerprint.value || undefined,
        archived: archived.value !== 'no' ? archived.value : undefined,
    }, { preserveState: true, replace: true });
}, 300);

watch([search], () => applyFilters());

function onDepartmentChange(val: any) {
    department.value = String(val ?? '') === 'all' ? '' : String(val ?? '');
    applyFilters();
}

function onStatusChange(val: any) {
    status.value = String(val ?? '') === 'all' ? '' : String(val ?? '');
    applyFilters();
}

function onFingerprintChange(val: any) {
    fingerprint.value = String(val ?? '') === 'all' ? '' : String(val ?? '');
    applyFilters();
}

function onArchivedChange(val: any) {
    archived.value = String(val ?? 'no');
    applyFilters();
}

function syncFromDevices() {
    syncing.value = true;
    router.post('/devices/sync-all-users', {}, {
        onFinish: () => { syncing.value = false; },
    });
}

function confirmDelete(employee: Employee) {
    employeeToDelete.value = employee;
    deleteDialogOpen.value = true;
}

function deleteEmployee() {
    if (!employeeToDelete.value) return;
    router.delete(`/employees/${employeeToDelete.value.id}`, {
        onFinish: () => {
            deleteDialogOpen.value = false;
            employeeToDelete.value = null;
        },
    });
}

function confirmArchive(employee: Employee) {
    employeeToArchive.value = employee;
    archiveForm.reset();
    archiveDialogOpen.value = true;
}

function archiveEmployee() {
    if (!employeeToArchive.value) return;
    archiveForm.post(`/employees/${employeeToArchive.value.id}/archive`, {
        onSuccess: () => {
            archiveDialogOpen.value = false;
            employeeToArchive.value = null;
        },
    });
}

function unarchiveEmployee(employee: Employee) {
    router.post(`/employees/${employee.id}/unarchive`);
}
</script>

<template>
    <Head title="Employees" />

    <AppLayout :breadcrumbs="breadcrumbs">
        <div class="flex h-full flex-1 flex-col gap-4 p-4 md:p-6">
            <!-- Header -->
            <div class="flex items-center justify-between">
                <div>
                    <h2 class="text-2xl font-bold tracking-tight">
                        {{ archived === 'yes' ? 'Archived Employees' : 'Employees' }}
                    </h2>
                    <p class="text-muted-foreground">{{ employees.total }} employee{{ employees.total === 1 ? '' : 's' }} found</p>
                </div>
                <div class="flex gap-2">
                    <Button variant="outline" :disabled="syncing" @click="syncFromDevices">
                        <RefreshCw class="mr-2 size-4" :class="{ 'animate-spin': syncing }" />
                        Sync from Devices
                    </Button>
                    <Button as-child>
                        <Link href="/employees/create">
                            <Plus class="mr-2 size-4" />
                            Add Employee
                        </Link>
                    </Button>
                </div>
            </div>

            <!-- Filters -->
            <div class="flex flex-wrap gap-3">
                <div class="relative flex-1 min-w-[200px] max-w-sm">
                    <Search class="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                    <Input v-model="search" placeholder="Search employees..." class="pl-9" />
                </div>
                <Select :model-value="department || 'all'" @update:model-value="onDepartmentChange">
                    <SelectTrigger class="w-[180px]"><SelectValue placeholder="Department" /></SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">All Departments</SelectItem>
                        <SelectItem v-for="dept in departments" :key="dept" :value="dept">{{ dept }}</SelectItem>
                    </SelectContent>
                </Select>
                <Select :model-value="status || 'all'" @update:model-value="onStatusChange">
                    <SelectTrigger class="w-[140px]"><SelectValue placeholder="Status" /></SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">All Status</SelectItem>
                        <SelectItem value="active">Active</SelectItem>
                        <SelectItem value="inactive">Inactive</SelectItem>
                    </SelectContent>
                </Select>
                <Select :model-value="fingerprint || 'all'" @update:model-value="onFingerprintChange">
                    <SelectTrigger class="w-[170px]"><SelectValue placeholder="Fingerprint" /></SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">All Fingerprints</SelectItem>
                        <SelectItem value="enrolled">Enrolled</SelectItem>
                        <SelectItem value="not_enrolled">Not Enrolled</SelectItem>
                    </SelectContent>
                </Select>
                <!-- Archived toggle — admin only -->
                <Select v-if="isAdmin" :model-value="archived" @update:model-value="onArchivedChange">
                    <SelectTrigger class="w-[165px]"><SelectValue placeholder="Archive status" /></SelectTrigger>
                    <SelectContent>
                        <SelectItem value="no">Active Employees</SelectItem>
                        <SelectItem value="yes">Archived Employees</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            <!-- Table -->
            <Card>
                <CardContent class="p-0">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>UID</TableHead>
                                <TableHead>Name</TableHead>
                                <TableHead>Department</TableHead>
                                <TableHead>Position</TableHead>
                                <TableHead>Device</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead>Fingerprint</TableHead>
                                <TableHead class="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            <TableRow v-for="emp in employees.data" :key="emp.id" :class="emp.archived_at ? 'opacity-60' : ''">
                                <TableCell class="font-mono text-sm">{{ emp.uid }}</TableCell>
                                <TableCell>
                                    <div>
                                        <div class="flex items-center gap-2">
                                            <p class="font-medium">{{ emp.name }}</p>
                                            <Badge v-if="emp.archived_at" variant="outline" class="text-xs border-amber-400 text-amber-600">
                                                Archived
                                            </Badge>
                                        </div>
                                        <p v-if="emp.email" class="text-xs text-muted-foreground">{{ emp.email }}</p>
                                        <p v-if="emp.archive_reason" class="text-xs text-amber-600 mt-0.5">{{ emp.archive_reason }}</p>
                                    </div>
                                </TableCell>
                                <TableCell>{{ emp.department ?? '—' }}</TableCell>
                                <TableCell>{{ emp.position ?? '—' }}</TableCell>
                                <TableCell>{{ emp.device?.name ?? '—' }}</TableCell>
                                <TableCell>
                                    <Badge :variant="emp.is_active ? 'default' : 'secondary'">
                                        {{ emp.is_active ? 'Active' : 'Inactive' }}
                                    </Badge>
                                </TableCell>
                                <TableCell>
                                    <Badge :variant="emp.has_fingerprint ? 'default' : 'secondary'">
                                        {{ emp.has_fingerprint ? '✓ Enrolled' : 'Not Enrolled' }}
                                    </Badge>
                                </TableCell>
                                <TableCell class="text-right">
                                    <div class="flex justify-end gap-1">
                                        <Button size="sm" variant="ghost" as-child>
                                            <Link :href="`/employees/${emp.id}`"><Eye class="size-4" /></Link>
                                        </Button>
                                        <!-- Archive / Unarchive — admin only -->
                                        <template v-if="isAdmin">
                                            <Button
                                                v-if="!emp.archived_at"
                                                size="sm"
                                                variant="ghost"
                                                class="text-amber-600 hover:text-amber-700"
                                                title="Archive employee"
                                                @click="confirmArchive(emp)"
                                            >
                                                <Archive class="size-4" />
                                            </Button>
                                            <Button
                                                v-else
                                                size="sm"
                                                variant="ghost"
                                                class="text-green-600 hover:text-green-700"
                                                title="Reinstate employee"
                                                @click="unarchiveEmployee(emp)"
                                            >
                                                <ArchiveRestore class="size-4" />
                                            </Button>
                                        </template>
                                        <Button
                                            size="sm"
                                            variant="ghost"
                                            class="text-destructive hover:text-destructive"
                                            @click="confirmDelete(emp)"
                                        >
                                            <Trash2 class="size-4" />
                                        </Button>
                                    </div>
                                </TableCell>
                            </TableRow>
                            <TableRow v-if="employees.data.length === 0">
                                <TableCell colspan="8" class="text-center text-muted-foreground py-8">
                                    <UserX class="size-8 mx-auto mb-2 opacity-50" />
                                    {{ archived === 'yes' ? 'No archived employees found.' : 'No employees found.' }}
                                </TableCell>
                            </TableRow>
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>

            <!-- Pagination -->
            <div v-if="employees.last_page > 1" class="flex items-center justify-center gap-1">
                <template v-for="link in employees.links" :key="link.label">
                    <Button v-if="link.url" size="sm" :variant="link.active ? 'default' : 'outline'" as-child>
                        <Link :href="link.url" preserve-state v-html="link.label" />
                    </Button>
                    <Button v-else size="sm" variant="outline" disabled v-html="link.label" />
                </template>
            </div>
        </div>

        <!-- Delete Dialog -->
        <Dialog v-model:open="deleteDialogOpen">
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Delete Employee</DialogTitle>
                    <DialogDescription>
                        Are you sure you want to delete "{{ employeeToDelete?.name }}"?
                        This will also remove their attendance records. This cannot be undone.
                    </DialogDescription>
                </DialogHeader>
                <DialogFooter>
                    <Button variant="outline" @click="deleteDialogOpen = false">Cancel</Button>
                    <Button variant="destructive" @click="deleteEmployee">Delete</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>

        <!-- Archive Dialog -->
        <Dialog v-model:open="archiveDialogOpen">
            <DialogContent>
                <DialogHeader>
                    <DialogTitle class="flex items-center gap-2">
                        <Archive class="size-5 text-amber-600" />
                        Archive Employee
                    </DialogTitle>
                    <DialogDescription>
                        "{{ employeeToArchive?.name }}" will be marked as archived and removed from active lists.
                        Their records are preserved and can be reinstated at any time.
                    </DialogDescription>
                </DialogHeader>
                <div class="space-y-2 py-2">
                    <Label for="archive-reason">Reason (optional)</Label>
                    <Textarea
                        id="archive-reason"
                        v-model="archiveForm.reason"
                        placeholder="e.g. Resigned, Contract ended, Retired..."
                        rows="3"
                    />
                </div>
                <DialogFooter>
                    <Button variant="outline" @click="archiveDialogOpen = false">Cancel</Button>
                    <Button
                        class="bg-amber-600 hover:bg-amber-700 text-white"
                        :disabled="archiveForm.processing"
                        @click="archiveEmployee"
                    >
                        <Archive class="mr-2 size-4" />
                        Archive Employee
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    </AppLayout>
</template>
