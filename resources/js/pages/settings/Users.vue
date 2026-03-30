<script setup lang="ts">
import { Head, router, useForm } from '@inertiajs/vue3';
import AppLayout from '@/layouts/AppLayout.vue';
import SettingsLayout from '@/layouts/settings/Layout.vue';
import Heading from '@/components/Heading.vue';
import { type BreadcrumbItem } from '@/types';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Separator } from '@/components/ui/separator';
import { Checkbox } from '@/components/ui/checkbox';
import { Plus, Trash2, KeyRound, ShieldCheck, Building2, Users, Search, UserPlus, Download, ShieldAlert, Link2 } from 'lucide-vue-next';
import { Link } from '@inertiajs/vue3';
import { index as userAccessRoute } from '@/actions/App/Http/Controllers/Settings/UserAccessController';
import { ref, computed } from 'vue';

interface AllEmployee {
    id: number;
    name: string;
    department: string | null;
    position: string | null;
}

interface UnlinkedEmployee {
    id: number;
    name: string;
    email: string;
    department: string | null;
    position: string | null;
    payroll_id: string | null;
}

interface UserRow {
    id: number;
    serial: number;
    name: string;
    email: string;
    role: string;
    employee_id: number | null;
    company: string;
    last_login_at: string | null;
    email_verified_at: string | null;
    created_at: string;
    is_super_admin: boolean;
    employee: { id: number; name: string; department: string | null; position: string | null } | null;
}

interface PaginatedUsers {
    data: UserRow[];
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
    from: number;
    to: number;
    links: { url: string | null; label: string; active: boolean }[];
}

const props = defineProps<{
    users: PaginatedUsers;
    total: number;
    filters: { search: string; role: string };
    allEmployees: AllEmployee[];
    unlinkedEmployees: UnlinkedEmployee[];
    roles: string[];
    company: string;
}>();

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Settings', href: '/settings/profile' },
    { title: 'Users' },
];

// ── Search + filter ─────────────────────────────────────────────────────────
const searchQuery = ref(props.filters.search);
const roleFilter = ref(props.filters.role || '_all');
let searchTimeout: ReturnType<typeof setTimeout> | null = null;

function applyFilters() {
    router.get('/settings/users', {
        search: searchQuery.value,
        role: roleFilter.value === '_all' ? '' : roleFilter.value,
    }, { preserveState: true, replace: true });
}

function onSearch() {
    if (searchTimeout) clearTimeout(searchTimeout);
    searchTimeout = setTimeout(applyFilters, 350);
}

function onRoleFilter(val: string) {
    roleFilter.value = val;
    applyFilters();
}

// ── Create User Dialog ─────────────────────────────────────────────────────
const createDialogOpen = ref(false);
const createForm = useForm({ name: '', email: '', role: 'user', password: '' });

function submitCreate() {
    createForm.post('/settings/users', {
        onSuccess: () => { createDialogOpen.value = false; createForm.reset(); },
    });
}

// ── Assign Role Dialog (row click) ─────────────────────────────────────────
const roleDialogOpen = ref(false);
const editingUser = ref<UserRow | null>(null);
const roleForm = useForm({ role: 'user' });

function openRoleDialog(user: UserRow) {
    if (user.is_super_admin) return; // super admin role is locked
    editingUser.value = user;
    roleForm.role = user.role;
    roleDialogOpen.value = true;
}

function submitRole() {
    if (!editingUser.value) return;
    roleForm.patch(`/settings/users/${editingUser.value.id}/role`, {
        onSuccess: () => { roleDialogOpen.value = false; },
    });
}

// ── Reset Password Dialog ──────────────────────────────────────────────────
const passwordDialogOpen = ref(false);
const passwordUser = ref<UserRow | null>(null);
const passwordForm = useForm({ password: '' });

function openPasswordDialog(user: UserRow, event: Event) {
    event.stopPropagation();
    passwordUser.value = user;
    passwordForm.reset();
    passwordDialogOpen.value = true;
}

function submitPassword() {
    if (!passwordUser.value) return;
    passwordForm.post(`/settings/users/${passwordUser.value.id}/reset-password`, {
        onSuccess: () => { passwordDialogOpen.value = false; },
    });
}

// ── Delete ─────────────────────────────────────────────────────────────────
function deleteUser(user: UserRow, event: Event) {
    event.stopPropagation();
    if (user.is_super_admin) return;
    if (!confirm(`Delete account for "${user.name}" (${user.email})? This cannot be undone.`)) return;
    router.delete(`/settings/users/${user.id}`, { preserveScroll: true });
}

// ── Link Employee Dialog ────────────────────────────────────────────────────
const linkDialogOpen = ref(false);
const linkingUser = ref<UserRow | null>(null);
const linkSearch = ref('');
const linkForm = useForm({ employee_id: null as number | null });

const filteredLinkEmployees = computed(() => {
    const q = linkSearch.value.toLowerCase();
    if (!q) return props.allEmployees.slice(0, 50);
    return props.allEmployees
        .filter(e => e.name.toLowerCase().includes(q) || (e.department ?? '').toLowerCase().includes(q))
        .slice(0, 50);
});

function openLinkDialog(user: UserRow, event: Event) {
    event.stopPropagation();
    linkingUser.value = user;
    linkSearch.value = '';
    linkForm.employee_id = user.employee_id;
    linkDialogOpen.value = true;
}

function submitLink() {
    if (!linkingUser.value) return;
    linkForm.patch(`/settings/users/${linkingUser.value.id}/link-employee`, {
        onSuccess: () => { linkDialogOpen.value = false; },
    });
}

function unlinkEmployee(event: Event) {
    event.stopPropagation();
    linkForm.employee_id = null;
    submitLink();
}

// ── Import from Employees Dialog ───────────────────────────────────────────
const importDialogOpen = ref(false);
const importSearch = ref('');
const importDeptFilter = ref('');
const selectedIds = ref<number[]>([]);
const importForm = useForm({ role: 'user', password_mode: 'payroll_id', employee_ids: [] as number[] });

const importDepartments = computed(() => {
    const depts = [...new Set(props.unlinkedEmployees.map(e => e.department).filter(Boolean))].sort();
    return depts as string[];
});

const filteredUnlinked = computed(() => {
    const q = importSearch.value.toLowerCase();
    const dept = importDeptFilter.value;
    return props.unlinkedEmployees.filter(e => {
        const matchSearch = !q || e.name.toLowerCase().includes(q) || (e.email ?? '').toLowerCase().includes(q);
        const matchDept = !dept || e.department === dept;
        return matchSearch && matchDept;
    });
});

const allFilteredSelected = computed(() =>
    filteredUnlinked.value.length > 0 &&
    filteredUnlinked.value.every(e => selectedIds.value.includes(e.id))
);

function toggleSelectAll() {
    if (allFilteredSelected.value) {
        const filteredIds = filteredUnlinked.value.map(e => e.id);
        selectedIds.value = selectedIds.value.filter(id => !filteredIds.includes(id));
    } else {
        const newIds = filteredUnlinked.value.map(e => e.id).filter(id => !selectedIds.value.includes(id));
        selectedIds.value = [...selectedIds.value, ...newIds];
    }
}

function toggleEmployee(id: number) {
    selectedIds.value = selectedIds.value.includes(id)
        ? selectedIds.value.filter(i => i !== id)
        : [...selectedIds.value, id];
}

function openImportDialog() {
    importSearch.value = '';
    importDeptFilter.value = '';
    selectedIds.value = [];
    importForm.reset();
    importDialogOpen.value = true;
}

function submitImport() {
    importForm.employee_ids = selectedIds.value.length > 0 ? selectedIds.value : props.unlinkedEmployees.map(e => e.id);
    importForm.post('/settings/users/import', {
        onSuccess: () => { importDialogOpen.value = false; selectedIds.value = []; },
    });
}

// ── Helpers ─────────────────────────────────────────────────────────────────
const roleBadge: Record<string, { variant: 'default' | 'secondary' | 'outline' | 'destructive'; icon: typeof ShieldCheck; label: string }> = {
    super_admin: { variant: 'destructive', icon: ShieldCheck, label: 'Super Admin' },
    admin: { variant: 'destructive', icon: ShieldCheck, label: 'Admin' },
    hr: { variant: 'default', icon: Building2, label: 'HR' },
    user: { variant: 'secondary', icon: Users, label: 'User' },
};

function initials(name: string): string {
    return name.split(' ').slice(0, 2).map(w => w[0]).join('').toUpperCase();
}

const paginationFrom = computed(() => props.users.from ?? ((props.users.current_page - 1) * props.users.per_page + 1));
const paginationTo = computed(() => props.users.to ?? Math.min(props.users.current_page * props.users.per_page, props.total));
</script>

<template>
    <Head title="Users" />
    <AppLayout :breadcrumbs="breadcrumbs">
        <SettingsLayout>
            <Heading variant="small" title="Users & Access" description="Manage application users and their access roles" />

            <!-- Toolbar -->
            <div class="flex flex-wrap items-center gap-2">
                <!-- Search -->
                <div class="relative flex-1 min-w-48">
                    <Search class="absolute left-2.5 top-2.5 size-4 text-muted-foreground" />
                    <Input v-model="searchQuery" placeholder="Search name or email…" class="h-9 pl-8" @input="onSearch" />
                </div>

                <!-- Role filter -->
                <Select :model-value="roleFilter" @update:model-value="onRoleFilter">
                    <SelectTrigger class="h-9 w-36">
                        <SelectValue placeholder="All Roles" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="_all">All Roles</SelectItem>
                        <SelectItem value="super_admin">Super Admin</SelectItem>
                        <SelectItem value="admin">Admin</SelectItem>
                        <SelectItem value="hr">HR</SelectItem>
                        <SelectItem value="user">User</SelectItem>
                    </SelectContent>
                </Select>

                <div class="ml-auto flex items-center gap-2">
                    <!-- Import button (amber when unlinked exist) -->
                    <Button
                        v-if="unlinkedEmployees.length > 0"
                        variant="outline"
                        size="sm"
                        class="gap-1.5 border-amber-400 text-amber-700 hover:bg-amber-50 dark:text-amber-400"
                        @click="openImportDialog"
                    >
                        <Download class="size-4" />
                        Import Employees
                        <Badge variant="outline" class="ml-1 text-[10px] border-amber-400 text-amber-700">{{ unlinkedEmployees.length }}</Badge>
                    </Button>

                    <Button size="sm" @click="createDialogOpen = true">
                        <Plus class="mr-1.5 size-4" />New User
                    </Button>
                </div>
            </div>

            <Separator />

            <!-- Odoo-style counter: "1-80 / 3600" + prev/next -->
            <div class="flex items-center justify-between text-sm text-muted-foreground">
                <span>
                    <span class="font-medium text-foreground">{{ paginationFrom }}-{{ paginationTo }}</span>
                    / {{ total }}
                </span>
                <div class="flex items-center gap-1">
                    <Button
                        size="icon"
                        variant="ghost"
                        class="size-7"
                        :disabled="users.current_page <= 1"
                        @click="router.get('/settings/users', { ...filters, page: users.current_page - 1 }, { preserveState: true })"
                    >‹</Button>
                    <Button
                        size="icon"
                        variant="ghost"
                        class="size-7"
                        :disabled="users.current_page >= users.last_page"
                        @click="router.get('/settings/users', { ...filters, page: users.current_page + 1 }, { preserveState: true })"
                    >›</Button>
                </div>
            </div>

            <!-- Odoo-style table -->
            <div class="overflow-x-auto rounded-md border">
                <table class="w-full text-sm">
                    <thead class="border-b bg-muted/40 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                        <tr>
                            <th class="w-12 px-3 py-2.5 text-center">#</th>
                            <th class="px-3 py-2.5 text-left">Name</th>
                            <th class="px-3 py-2.5 text-left">Login</th>
                            <th class="px-3 py-2.5 text-left">Role</th>
                            <th class="hidden px-3 py-2.5 text-left lg:table-cell">Latest Authentication</th>
                            <th class="hidden px-3 py-2.5 text-left md:table-cell">Employee Record</th>
                            <th class="px-3 py-2.5 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody class="divide-y">
                        <tr
                            v-for="user in users.data"
                            :key="user.id"
                            class="group transition-colors"
                            :class="[
                                user.is_super_admin ? 'bg-amber-50/60 dark:bg-amber-900/10' : 'hover:bg-muted/40',
                                !user.last_login_at && !user.is_super_admin ? 'text-blue-700 dark:text-blue-400' : '',
                            ]"
                            :style="!user.is_super_admin ? 'cursor:pointer' : ''"
                            @click="openRoleDialog(user)"
                        >
                            <!-- S/N -->
                            <td class="px-3 py-2.5 text-center text-xs text-muted-foreground">{{ user.serial }}</td>

                            <!-- Name + avatar -->
                            <td class="px-3 py-2.5">
                                <div class="flex items-center gap-2.5">
                                    <div
                                        class="flex size-7 shrink-0 items-center justify-center rounded-full text-[10px] font-bold text-white"
                                        :class="user.is_super_admin ? 'bg-amber-500' : user.role === 'admin' ? 'bg-red-500' : user.role === 'hr' ? 'bg-blue-500' : 'bg-slate-400'"
                                    >
                                        {{ initials(user.name) }}
                                    </div>
                                    <span class="font-medium">{{ user.name }}</span>
                                </div>
                            </td>

                            <!-- Login (email) -->
                            <td class="px-3 py-2.5">
                                <span :class="!user.last_login_at && !user.is_super_admin ? 'text-blue-600 dark:text-blue-400' : 'text-muted-foreground'">
                                    {{ user.email }}
                                </span>
                            </td>

                            <!-- Role badge -->
                            <td class="px-3 py-2.5">
                                <Badge
                                    :variant="roleBadge[user.role]?.variant ?? 'secondary'"
                                    class="gap-1 capitalize text-xs"
                                >
                                    <component :is="roleBadge[user.role]?.icon ?? Users" class="size-3" />
                                    {{ roleBadge[user.role]?.label ?? user.role }}
                                </Badge>
                            </td>

                            <!-- Last login -->
                            <td class="hidden px-3 py-2.5 lg:table-cell">
                                <span v-if="user.last_login_at" class="text-muted-foreground">{{ user.last_login_at }}</span>
                                <span v-else class="text-xs italic text-muted-foreground/60">Never</span>
                            </td>

                            <!-- Company / Linked Employee -->
                            <td class="hidden px-3 py-2.5 md:table-cell">
                                <span v-if="user.employee" class="text-xs text-muted-foreground">
                                    {{ user.employee.name }}
                                    <span v-if="user.employee.department" class="text-muted-foreground/60"> · {{ user.employee.department }}</span>
                                </span>
                                <span v-else class="text-xs italic text-amber-600">No employee linked</span>
                            </td>

                            <!-- Actions -->
                            <td class="px-3 py-2.5 text-right" @click.stop>
                                <div class="flex items-center justify-end gap-0.5 opacity-0 group-hover:opacity-100">
                                    <Button
                                        size="icon"
                                        variant="ghost"
                                        class="size-7"
                                        :class="user.employee ? 'text-green-600' : 'text-amber-500'"
                                        :title="user.employee ? `Linked: ${user.employee.name} — click to change` : 'Link to employee record'"
                                        @click="openLinkDialog(user, $event)"
                                    >
                                        <Link2 class="size-3.5" />
                                    </Button>
                                    <Button
                                        size="icon"
                                        variant="ghost"
                                        class="size-7"
                                        title="Access Rights"
                                        as-child
                                    >
                                        <Link :href="userAccessRoute(user.id).url">
                                            <ShieldAlert class="size-3.5" />
                                        </Link>
                                    </Button>
                                    <Button
                                        size="icon"
                                        variant="ghost"
                                        class="size-7"
                                        title="Reset password"
                                        @click="openPasswordDialog(user, $event)"
                                    >
                                        <KeyRound class="size-3.5" />
                                    </Button>
                                    <Button
                                        v-if="!user.is_super_admin"
                                        size="icon"
                                        variant="ghost"
                                        class="size-7 text-destructive hover:text-destructive"
                                        title="Delete user"
                                        @click="deleteUser(user, $event)"
                                    >
                                        <Trash2 class="size-3.5" />
                                    </Button>
                                </div>
                            </td>
                        </tr>

                        <tr v-if="users.data.length === 0">
                            <td colspan="7" class="py-16 text-center text-muted-foreground">
                                <Users class="mx-auto mb-3 size-10 opacity-30" />
                                <p>No users found.</p>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>

        </SettingsLayout>
    </AppLayout>

    <!-- ── Assign Role Dialog (row click) ── -->
    <Dialog v-model:open="roleDialogOpen">
        <DialogContent class="max-w-sm">
            <DialogHeader>
                <DialogTitle>Assign Role</DialogTitle>
                <p class="text-sm text-muted-foreground">{{ editingUser?.name }} · {{ editingUser?.email }}</p>
            </DialogHeader>
            <form class="space-y-4" @submit.prevent="submitRole">
                <div class="space-y-1.5">
                    <Label>Role</Label>
                    <Select :model-value="roleForm.role" @update:model-value="v => roleForm.role = String(v)">
                        <SelectTrigger><SelectValue /></SelectTrigger>
                        <SelectContent>
                            <SelectItem value="user">User — Employee (standard access)</SelectItem>
                            <SelectItem value="hr">HR — HR staff (HR modules)</SelectItem>
                            <SelectItem value="admin">Admin — Full access</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
                <div class="rounded-md bg-muted/50 p-3 text-xs text-muted-foreground space-y-1">
                    <p><strong>User</strong> — can view their own appraisals and HR self-service</p>
                    <p><strong>HR</strong> — full HR module access (nominal roll, leave, contracts, performance)</p>
                    <p><strong>Admin</strong> — full access including devices, attendance, and user management</p>
                </div>
                <DialogFooter>
                    <Button type="button" variant="outline" @click="roleDialogOpen = false">Cancel</Button>
                    <Button type="submit" :disabled="roleForm.processing">Save Role</Button>
                </DialogFooter>
            </form>
        </DialogContent>
    </Dialog>

    <!-- ── Create User Dialog ── -->
    <Dialog v-model:open="createDialogOpen">
        <DialogContent class="max-w-md">
            <DialogHeader><DialogTitle>Create New User Account</DialogTitle></DialogHeader>
            <form class="space-y-4" @submit.prevent="submitCreate">
                <div class="space-y-1.5">
                    <Label>Full Name</Label>
                    <Input v-model="createForm.name" placeholder="Employee full name" />
                    <p v-if="createForm.errors.name" class="text-xs text-destructive">{{ createForm.errors.name }}</p>
                </div>
                <div class="space-y-1.5">
                    <Label>Official Email</Label>
                    <Input v-model="createForm.email" type="email" placeholder="employee@kadunaelectric.com" />
                    <p v-if="createForm.errors.email" class="text-xs text-destructive">{{ createForm.errors.email }}</p>
                </div>
                <div class="space-y-1.5">
                    <Label>Role</Label>
                    <Select :model-value="createForm.role" @update:model-value="v => createForm.role = String(v)">
                        <SelectTrigger><SelectValue /></SelectTrigger>
                        <SelectContent>
                            <SelectItem value="user">User — Employee (standard access)</SelectItem>
                            <SelectItem value="hr">HR — HR staff (HR modules)</SelectItem>
                            <SelectItem value="admin">Admin — Full access</SelectItem>
                        </SelectContent>
                    </Select>
                    <p v-if="createForm.errors.role" class="text-xs text-destructive">{{ createForm.errors.role }}</p>
                </div>
                <div class="space-y-1.5">
                    <Label>Password</Label>
                    <Input v-model="createForm.password" type="password" placeholder="Minimum 8 characters" />
                    <p v-if="createForm.errors.password" class="text-xs text-destructive">{{ createForm.errors.password }}</p>
                </div>
                <DialogFooter>
                    <Button type="button" variant="outline" @click="createDialogOpen = false">Cancel</Button>
                    <Button type="submit" :disabled="createForm.processing">Create Account</Button>
                </DialogFooter>
            </form>
        </DialogContent>
    </Dialog>

    <!-- ── Reset Password Dialog ── -->
    <Dialog v-model:open="passwordDialogOpen">
        <DialogContent class="max-w-sm">
            <DialogHeader>
                <DialogTitle>Reset Password</DialogTitle>
                <p class="text-sm text-muted-foreground">{{ passwordUser?.name }} · {{ passwordUser?.email }}</p>
            </DialogHeader>
            <form class="space-y-4" @submit.prevent="submitPassword">
                <div class="space-y-1.5">
                    <Label>New Password</Label>
                    <Input v-model="passwordForm.password" type="password" placeholder="Minimum 8 characters" />
                    <p v-if="passwordForm.errors.password" class="text-xs text-destructive">{{ passwordForm.errors.password }}</p>
                </div>
                <DialogFooter>
                    <Button type="button" variant="outline" @click="passwordDialogOpen = false">Cancel</Button>
                    <Button type="submit" :disabled="passwordForm.processing">Reset Password</Button>
                </DialogFooter>
            </form>
        </DialogContent>
    </Dialog>

    <!-- ── Link Employee Dialog ── -->
    <Dialog v-model:open="linkDialogOpen">
        <DialogContent class="flex max-h-[85vh] max-w-lg flex-col gap-0 overflow-hidden p-0">
            <div class="border-b px-6 py-4">
                <DialogHeader>
                    <DialogTitle>Link Employee Record</DialogTitle>
                    <p class="text-sm text-muted-foreground">{{ linkingUser?.name }} · {{ linkingUser?.email }}</p>
                </DialogHeader>
            </div>

            <!-- Current link -->
            <div v-if="linkingUser?.employee" class="flex items-center justify-between border-b bg-green-50 px-6 py-3 dark:bg-green-950/20">
                <div class="text-sm">
                    <span class="font-medium text-green-700 dark:text-green-400">Currently linked:</span>
                    <span class="ml-1.5">{{ linkingUser.employee.name }}</span>
                    <span v-if="linkingUser.employee.department" class="ml-1 text-xs text-muted-foreground">· {{ linkingUser.employee.department }}</span>
                </div>
                <Button variant="ghost" size="sm" class="text-destructive text-xs h-7" @click="unlinkEmployee($event)">Remove</Button>
            </div>

            <!-- Search -->
            <div class="border-b px-4 py-2">
                <div class="relative">
                    <Search class="absolute left-2.5 top-2 size-3.5 text-muted-foreground" />
                    <input
                        v-model="linkSearch"
                        placeholder="Search by name or department…"
                        class="w-full rounded-md border border-input bg-background py-1.5 pl-8 pr-3 text-sm focus:outline-none focus:ring-1 focus:ring-ring"
                        autofocus
                    />
                </div>
                <p class="mt-1 text-[10px] text-muted-foreground">Showing first 50 matches · type to filter</p>
            </div>

            <!-- Employee list -->
            <div class="flex-1 overflow-y-auto px-2 py-1">
                <button
                    v-for="emp in filteredLinkEmployees"
                    :key="emp.id"
                    type="button"
                    class="flex w-full items-center gap-3 rounded-md px-3 py-2 text-left text-sm transition-colors hover:bg-muted/50"
                    :class="linkForm.employee_id === emp.id ? 'bg-primary/10 font-medium' : ''"
                    @click="linkForm.employee_id = emp.id"
                >
                    <div class="flex size-7 shrink-0 items-center justify-center rounded-full bg-slate-200 text-[10px] font-bold text-slate-600">
                        {{ initials(emp.name) }}
                    </div>
                    <div class="flex-1 min-w-0">
                        <p class="truncate">{{ emp.name }}</p>
                        <p class="truncate text-xs text-muted-foreground">{{ emp.department ?? '—' }}</p>
                    </div>
                    <span v-if="linkForm.employee_id === emp.id" class="text-xs font-semibold text-primary">✓ Selected</span>
                </button>
                <p v-if="filteredLinkEmployees.length === 0" class="py-6 text-center text-sm text-muted-foreground">
                    No employees match your search.
                </p>
            </div>

            <div class="border-t px-6 py-3 flex justify-end gap-2">
                <Button variant="outline" size="sm" @click="linkDialogOpen = false">Cancel</Button>
                <Button size="sm" :disabled="linkForm.processing || !linkForm.employee_id" @click="submitLink">
                    <Link2 class="mr-1.5 size-3.5" />
                    Link Employee
                </Button>
            </div>
        </DialogContent>
    </Dialog>

    <!-- ── Import Employees Dialog ── -->
    <Dialog v-model:open="importDialogOpen">
        <DialogContent class="flex max-h-[90vh] max-w-2xl flex-col gap-0 overflow-hidden p-0">
            <div class="border-b px-6 py-4">
                <DialogHeader>
                    <DialogTitle>Import Employees as Users</DialogTitle>
                    <p class="text-sm text-muted-foreground">
                        <strong>{{ unlinkedEmployees.length }}</strong> active employees have no login account yet.
                        Select who to create accounts for.
                    </p>
                </DialogHeader>
            </div>

            <!-- Filters + select all -->
            <div class="flex flex-wrap items-center gap-2 border-b px-6 py-3">
                <div class="relative flex-1 min-w-40">
                    <Search class="absolute left-2.5 top-2 size-3.5 text-muted-foreground" />
                    <Input v-model="importSearch" placeholder="Search…" class="h-8 pl-7 text-sm" />
                </div>
                <Select :model-value="importDeptFilter || '_all'" @update:model-value="v => importDeptFilter = String(v) === '_all' ? '' : String(v)">
                    <SelectTrigger class="h-8 w-40 text-xs"><SelectValue placeholder="All Departments" /></SelectTrigger>
                    <SelectContent>
                        <SelectItem value="_all">All Departments</SelectItem>
                        <SelectItem v-for="dept in importDepartments" :key="dept" :value="dept">{{ dept }}</SelectItem>
                    </SelectContent>
                </Select>
                <div class="flex items-center gap-1.5">
                    <Checkbox :checked="allFilteredSelected" @update:checked="toggleSelectAll" id="sel-all" />
                    <label for="sel-all" class="cursor-pointer select-none text-xs text-muted-foreground">
                        Select all ({{ filteredUnlinked.length }})
                    </label>
                </div>
            </div>

            <!-- Employee list -->
            <div class="flex-1 overflow-y-auto px-6 py-2">
                <div v-if="filteredUnlinked.length === 0" class="py-10 text-center text-sm text-muted-foreground">
                    No employees match your filter.
                </div>
                <div
                    v-for="emp in filteredUnlinked"
                    :key="emp.id"
                    class="flex cursor-pointer items-center gap-3 rounded-md px-2 py-1.5 hover:bg-muted/50"
                    @click="toggleEmployee(emp.id)"
                >
                    <Checkbox :checked="selectedIds.includes(emp.id)" @update:checked="toggleEmployee(emp.id)" @click.stop />
                    <div
                        class="flex size-7 shrink-0 items-center justify-center rounded-full bg-slate-300 text-[10px] font-bold text-slate-700"
                    >{{ initials(emp.name) }}</div>
                    <div class="flex-1 min-w-0">
                        <p class="truncate text-sm font-medium">{{ emp.name }}</p>
                        <p class="truncate text-xs text-muted-foreground">{{ emp.email }}</p>
                    </div>
                    <div class="shrink-0 text-right text-xs text-muted-foreground">
                        <p>{{ emp.department ?? '—' }}</p>
                        <p v-if="emp.payroll_id">{{ emp.payroll_id }}</p>
                    </div>
                </div>
            </div>

            <!-- Footer -->
            <div class="border-t px-6 py-4 space-y-3">
                <div class="grid grid-cols-2 gap-3">
                    <div class="space-y-1">
                        <Label class="text-xs">Assign Role</Label>
                        <Select :model-value="importForm.role" @update:model-value="v => importForm.role = String(v)">
                            <SelectTrigger class="h-8 text-xs"><SelectValue /></SelectTrigger>
                            <SelectContent>
                                <SelectItem value="user">User (standard access)</SelectItem>
                                <SelectItem value="hr">HR staff</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <div class="space-y-1">
                        <Label class="text-xs">Initial Password</Label>
                        <Select :model-value="importForm.password_mode" @update:model-value="v => importForm.password_mode = String(v)">
                            <SelectTrigger class="h-8 text-xs"><SelectValue /></SelectTrigger>
                            <SelectContent>
                                <SelectItem value="payroll_id">Use Payroll ID</SelectItem>
                                <SelectItem value="random">Generate random</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>
                <div class="flex items-center justify-between">
                    <span class="text-xs text-muted-foreground">
                        {{ selectedIds.length > 0 ? selectedIds.length : unlinkedEmployees.length }} account(s) will be created
                    </span>
                    <div class="flex gap-2">
                        <Button variant="outline" size="sm" @click="importDialogOpen = false">Cancel</Button>
                        <Button size="sm" :disabled="importForm.processing" @click="submitImport">
                            <UserPlus class="mr-1.5 size-4" />
                            {{ importForm.processing ? 'Creating…' : 'Create Accounts' }}
                        </Button>
                    </div>
                </div>
            </div>
        </DialogContent>
    </Dialog>
</template>
