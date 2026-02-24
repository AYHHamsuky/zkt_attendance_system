<script setup lang="ts">
import { Head, Link, router, usePage } from '@inertiajs/vue3';
import AppLayout from '@/layouts/AppLayout.vue';
import { type BreadcrumbItem } from '@/types';
import { Card, CardContent } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
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
import { Plus, Search, Trash2, Eye, UserX, Users } from 'lucide-vue-next';
import { ref, watch } from 'vue';
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
    };
}>();

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Employees' },
];

const search = ref(props.filters.search ?? '');
const department = ref(props.filters.department ?? '');
const status = ref(props.filters.status ?? '');

const deleteDialogOpen = ref(false);
const employeeToDelete = ref<Employee | null>(null);

const applyFilters = debounce(() => {
    router.get('/employees', {
        search: search.value || undefined,
        department: department.value || undefined,
        status: status.value || undefined,
    }, {
        preserveState: true,
        replace: true,
    });
}, 300);

watch([search], () => applyFilters());

function onDepartmentChange(val: any) {
    const v = String(val ?? '');
    department.value = v === 'all' ? '' : v;
    applyFilters();
}

function onStatusChange(val: any) {
    const v = String(val ?? '');
    status.value = v === 'all' ? '' : v;
    applyFilters();
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
</script>

<template>
    <Head title="Employees" />

    <AppLayout :breadcrumbs="breadcrumbs">
        <div class="flex h-full flex-1 flex-col gap-4 p-4 md:p-6">
            <!-- Header -->
            <div class="flex items-center justify-between">
                <div>
                    <h2 class="text-2xl font-bold tracking-tight">Employees</h2>
                    <p class="text-muted-foreground">{{ employees.total }} employees found</p>
                </div>
                <Button as-child>
                    <Link href="/employees/create">
                        <Plus class="mr-2 size-4" />
                        Add Employee
                    </Link>
                </Button>
            </div>

            <!-- Filters -->
            <div class="flex flex-wrap gap-3">
                <div class="relative flex-1 min-w-[200px] max-w-sm">
                    <Search class="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                    <Input
                        v-model="search"
                        placeholder="Search employees..."
                        class="pl-9"
                    />
                </div>
                <Select :model-value="department || 'all'" @update:model-value="onDepartmentChange">
                    <SelectTrigger class="w-[180px]">
                        <SelectValue placeholder="Department" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">All Departments</SelectItem>
                        <SelectItem v-for="dept in departments" :key="dept" :value="dept">
                            {{ dept }}
                        </SelectItem>
                    </SelectContent>
                </Select>
                <Select :model-value="status || 'all'" @update:model-value="onStatusChange">
                    <SelectTrigger class="w-[140px]">
                        <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">All Status</SelectItem>
                        <SelectItem value="active">Active</SelectItem>
                        <SelectItem value="inactive">Inactive</SelectItem>
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
                            <TableRow v-for="emp in employees.data" :key="emp.id">
                                <TableCell class="font-mono text-sm">{{ emp.uid }}</TableCell>
                                <TableCell>
                                    <div>
                                        <p class="font-medium">{{ emp.name }}</p>
                                        <p v-if="emp.email" class="text-xs text-muted-foreground">{{ emp.email }}</p>
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
                                    <Badge :variant="emp.has_fingerprint ? 'default' : 'outline'">
                                        {{ emp.has_fingerprint ? 'Yes' : 'No' }}
                                    </Badge>
                                </TableCell>
                                <TableCell class="text-right">
                                    <div class="flex justify-end gap-1">
                                        <Button size="sm" variant="ghost" as-child>
                                            <Link :href="`/employees/${emp.id}`">
                                                <Eye class="size-4" />
                                            </Link>
                                        </Button>
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
                                    No employees found.
                                </TableCell>
                            </TableRow>
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>

            <!-- Pagination -->
            <div v-if="employees.last_page > 1" class="flex items-center justify-center gap-1">
                <template v-for="link in employees.links" :key="link.label">
                    <Button
                        v-if="link.url"
                        size="sm"
                        :variant="link.active ? 'default' : 'outline'"
                        as-child
                    >
                        <Link :href="link.url" preserve-state v-html="link.label" />
                    </Button>
                    <Button
                        v-else
                        size="sm"
                        variant="outline"
                        disabled
                        v-html="link.label"
                    />
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
    </AppLayout>
</template>
