<script setup lang="ts">
import { Head, Link, router, usePage } from '@inertiajs/vue3';
import AppLayout from '@/layouts/AppLayout.vue';
import { type BreadcrumbItem } from '@/types';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Search, Eye, Users, GitBranch, LayoutGrid, List, Plus, ChevronLeft, ChevronRight } from 'lucide-vue-next';
import { ref, watch, computed } from 'vue';

const userRole = computed(() => (usePage().props.auth as { user: { role: string } }).user?.role);
const isAdmin = computed(() => userRole.value === 'admin' || userRole.value === 'super_admin' || userRole.value === 'hr');
import { debounce } from '@/lib/debounce';

interface HrProfile {
    payroll_id: string;
    job_grade: string | null;
    job_level: string | null;
    start_date: string | null;
    title: string | null;
}

interface Employee {
    id: number;
    name: string;
    department: string | null;
    unit: string | null;
    position: string | null;
    location: string | null;
    email: string | null;
    phone: string | null;
    photo_url: string | null;
    hr_profile: HrProfile | null;
}

interface PaginatedData {
    data: Employee[];
    current_page: number;
    last_page: number;
    from: number | null;
    to: number | null;
    total: number;
    links: Array<{ url: string | null; label: string; active: boolean }>;
}

interface DeptSummary { department: string; total: number }

const props = defineProps<{
    employees: PaginatedData;
    departments: string[];
    locations: string[];
    departmentSummary: DeptSummary[];
    filters: { search?: string; department?: string; location?: string; profile?: string; view?: string };
}>();

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'HRIS', href: '/hr' },
    { title: 'Staff List' },
];

const search = ref(props.filters.search ?? '');
const department = ref(props.filters.department ?? '');
const location = ref(props.filters.location ?? '');
const profile = ref(props.filters.profile ?? '');
const view = ref(props.filters.view ?? 'grid');

function buildParams() {
    return {
        search: search.value || undefined,
        department: department.value || undefined,
        location: location.value || undefined,
        profile: profile.value || undefined,
        view: view.value !== 'grid' ? view.value : undefined,
    };
}

const applyFilters = debounce(() => {
    router.get('/hr/nominal-roll', buildParams(), { preserveState: true, replace: true });
}, 300);

watch([search], () => applyFilters());

function onChange(key: string, val: unknown) {
    const v = String(val ?? '');
    if (key === 'location') { location.value = v === 'all' ? '' : v; }
    if (key === 'profile') { profile.value = v === 'all' ? '' : v; }
    if (key === 'department') { department.value = v === 'all' ? '' : v; }
    applyFilters();
}

function setView(v: string) {
    view.value = v;
    router.get('/hr/nominal-roll', buildParams(), { preserveState: true, replace: true });
}

function filterByDept(dept: string) {
    department.value = dept;
    router.get('/hr/nominal-roll', buildParams(), { preserveState: true, replace: true });
}

function clearDepartment() {
    department.value = '';
    router.get('/hr/nominal-roll', buildParams(), { preserveState: true, replace: true });
}

function initials(name: string) {
    return name.split(' ').slice(0, 2).map(w => w[0]).join('').toUpperCase();
}

const avatarBgColors = [
    'bg-blue-600', 'bg-purple-600', 'bg-emerald-600', 'bg-orange-500',
    'bg-pink-600', 'bg-teal-600', 'bg-indigo-600', 'bg-red-600',
    'bg-amber-600', 'bg-cyan-600', 'bg-violet-600', 'bg-rose-600',
];

function avatarBg(name: string): string {
    return avatarBgColors[name.charCodeAt(0) % avatarBgColors.length];
}

const prevLink = () => props.employees.links[0] ?? null;
const nextLink = () => props.employees.links[props.employees.links.length - 1] ?? null;
</script>

<template>
    <Head title="Staff List" />

    <AppLayout :breadcrumbs="breadcrumbs">
        <div class="flex h-full flex-1 overflow-hidden">

            <!-- ── LEFT SIDEBAR ── -->
            <aside class="hidden md:flex w-52 shrink-0 flex-col border-r bg-background overflow-y-auto">
                <!-- COMPANY -->
                <div class="px-2 pt-3 pb-2">
                    <p class="px-2 py-1 text-xs font-semibold uppercase tracking-wide text-muted-foreground">Company</p>
                    <button
                        class="w-full text-left px-2 py-1.5 rounded text-sm flex items-center justify-between transition-colors"
                        :class="!department ? 'bg-primary/10 text-primary font-medium' : 'hover:bg-muted'"
                        @click="clearDepartment"
                    >
                        <span>All</span>
                        <span class="text-xs tabular-nums" :class="!department ? 'text-primary' : 'text-muted-foreground'">
                            {{ employees.total }}
                        </span>
                    </button>
                    <div class="px-2 py-1.5 text-sm flex items-center justify-between">
                        <span class="text-muted-foreground truncate">Kaduna Electric</span>
                        <span class="text-xs text-muted-foreground tabular-nums shrink-0">{{ employees.total }}</span>
                    </div>
                </div>

                <Separator />

                <!-- DEPARTMENT -->
                <div class="px-2 py-2 flex-1">
                    <p class="px-2 py-1 text-xs font-semibold uppercase tracking-wide text-muted-foreground">Department</p>
                    <button
                        v-for="dept in departmentSummary"
                        :key="dept.department"
                        class="w-full text-left px-2 py-1.5 rounded text-sm flex items-center justify-between gap-1 transition-colors"
                        :class="department === dept.department ? 'bg-primary/10 text-primary font-medium' : 'hover:bg-muted'"
                        @click="filterByDept(dept.department)"
                    >
                        <span class="truncate leading-tight">{{ dept.department }}</span>
                        <span class="text-xs shrink-0 tabular-nums" :class="department === dept.department ? 'text-primary' : 'text-muted-foreground'">
                            {{ dept.total }}
                        </span>
                    </button>
                </div>
            </aside>

            <!-- ── MAIN AREA ── -->
            <div class="flex flex-1 flex-col overflow-hidden min-w-0">

                <!-- TOP BAR -->
                <div class="flex items-center gap-2 border-b px-3 py-2 bg-background shrink-0 flex-wrap">
                    <!-- Search -->
                    <div class="relative min-w-[180px] flex-1 max-w-sm">
                        <Search class="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input v-model="search" placeholder="Search..." class="pl-8 h-9" />
                    </div>

                    <!-- Filters -->
                    <Select :model-value="location || 'all'" @update:model-value="onChange('location', $event)">
                        <SelectTrigger class="w-[130px] h-9"><SelectValue placeholder="Location" /></SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Locations</SelectItem>
                            <SelectItem v-for="loc in locations" :key="loc" :value="loc">{{ loc }}</SelectItem>
                        </SelectContent>
                    </Select>

                    <Select :model-value="profile || 'all'" @update:model-value="onChange('profile', $event)">
                        <SelectTrigger class="w-[130px] h-9"><SelectValue placeholder="Profile" /></SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Profiles</SelectItem>
                            <SelectItem value="complete">Complete</SelectItem>
                            <SelectItem value="incomplete">No Profile</SelectItem>
                        </SelectContent>
                    </Select>

                    <div class="flex-1" />

                    <!-- Pagination info -->
                    <span class="text-sm text-muted-foreground tabular-nums whitespace-nowrap">
                        {{ employees.from ?? 0 }}-{{ employees.to ?? 0 }} / {{ employees.total }}
                    </span>

                    <!-- Prev / Next -->
                    <div class="flex items-center gap-0.5">
                        <Button
                            v-if="prevLink()?.url"
                            size="icon"
                            variant="ghost"
                            class="h-8 w-8"
                            as-child
                        >
                            <Link :href="prevLink()!.url!" preserve-state>
                                <ChevronLeft class="h-4 w-4" />
                            </Link>
                        </Button>
                        <Button v-else size="icon" variant="ghost" class="h-8 w-8" disabled>
                            <ChevronLeft class="h-4 w-4" />
                        </Button>

                        <Button
                            v-if="nextLink()?.url"
                            size="icon"
                            variant="ghost"
                            class="h-8 w-8"
                            as-child
                        >
                            <Link :href="nextLink()!.url!" preserve-state>
                                <ChevronRight class="h-4 w-4" />
                            </Link>
                        </Button>
                        <Button v-else size="icon" variant="ghost" class="h-8 w-8" disabled>
                            <ChevronRight class="h-4 w-4" />
                        </Button>
                    </div>

                    <!-- View toggle -->
                    <div class="flex items-center rounded border p-0.5 gap-0.5">
                        <button
                            class="rounded p-1 transition-colors"
                            :class="view === 'grid' ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:text-foreground'"
                            title="Card view"
                            @click="setView('grid')"
                        >
                            <LayoutGrid class="h-4 w-4" />
                        </button>
                        <button
                            class="rounded p-1 transition-colors"
                            :class="view === 'list' ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:text-foreground'"
                            title="List view"
                            @click="setView('list')"
                        >
                            <List class="h-4 w-4" />
                        </button>
                    </div>

                    <!-- Actions -->
                    <Button size="sm" as-child>
                        <Link href="/hr/nominal-roll/create">
                            <Plus class="mr-1 h-4 w-4" />
                            New Employee
                        </Link>
                    </Button>
                    <Button v-if="isAdmin" size="sm" variant="outline" as-child title="Org Chart">
                        <Link href="/hr/nominal-roll/org-chart">
                            <GitBranch class="h-4 w-4" />
                        </Link>
                    </Button>
                </div>

                <!-- CONTENT AREA -->
                <div class="flex-1 overflow-y-auto">

                    <!-- ── GRID VIEW (Odoo style) ── -->
                    <template v-if="view === 'grid'">
                        <div v-if="employees.data.length === 0" class="flex flex-col items-center justify-center py-20 text-muted-foreground">
                            <Users class="h-14 w-14 opacity-30 mb-3" />
                            <p class="font-medium">No employees found.</p>
                        </div>
                        <div v-else class="grid grid-cols-2 gap-4 p-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
                            <Link
                                v-for="emp in employees.data"
                                :key="emp.id"
                                :href="`/hr/nominal-roll/${emp.id}`"
                                class="block"
                            >
                                <div class="group relative rounded-lg border bg-card overflow-hidden hover:shadow-md hover:border-primary/40 transition-all cursor-pointer">
                                    <!-- Status dot -->
                                    <span class="absolute top-2 right-2 z-10 h-2.5 w-2.5 rounded-full bg-green-400 border-2 border-white shadow-sm" />

                                    <!-- Avatar area -->
                                    <div :class="[avatarBg(emp.name), 'flex items-center justify-center h-28 relative overflow-hidden']">
                                        <img
                                            v-if="emp.photo_url"
                                            :src="emp.photo_url"
                                            :alt="emp.name"
                                            class="h-full w-full object-cover"
                                        />
                                        <span v-else class="text-white text-5xl font-bold select-none">{{ initials(emp.name)[0] }}</span>
                                    </div>

                                    <!-- Info area -->
                                    <div class="p-3">
                                        <p class="font-semibold text-sm leading-snug line-clamp-2">{{ emp.name }}</p>
                                        <p class="text-xs text-muted-foreground line-clamp-1 mt-0.5">{{ emp.position ?? '' }}</p>
                                        <p v-if="emp.email" class="text-xs text-muted-foreground truncate mt-1">{{ emp.email }}</p>
                                        <p v-if="emp.phone" class="text-xs text-muted-foreground">{{ emp.phone }}</p>
                                    </div>
                                </div>
                            </Link>
                        </div>
                    </template>

                    <!-- ── LIST VIEW ── -->
                    <template v-else>
                        <!-- Dept filter for list (sidebar handles it in grid) -->
                        <div class="flex flex-wrap gap-3 px-4 pt-3">
                            <Select :model-value="department || 'all'" @update:model-value="onChange('department', $event)">
                                <SelectTrigger class="w-[200px]"><SelectValue placeholder="Department" /></SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All Departments</SelectItem>
                                    <SelectItem v-for="dept in departments" :key="dept" :value="dept">{{ dept }}</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div class="p-4">
                            <div class="rounded-lg border overflow-hidden">
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead class="w-10"></TableHead>
                                            <TableHead>Payroll ID</TableHead>
                                            <TableHead>Name</TableHead>
                                            <TableHead>Email</TableHead>
                                            <TableHead>Position</TableHead>
                                            <TableHead>Department / Unit</TableHead>
                                            <TableHead>Job Grade</TableHead>
                                            <TableHead>Location</TableHead>
                                            <TableHead>Profile</TableHead>
                                            <TableHead class="text-right">View</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        <TableRow v-for="emp in employees.data" :key="emp.id" class="hover:bg-muted/40">
                                            <TableCell>
                                                <div class="h-8 w-8 rounded-full overflow-hidden shrink-0">
                                                    <img v-if="emp.photo_url" :src="emp.photo_url" :alt="emp.name" class="h-full w-full object-cover" />
                                                    <div v-else :class="[avatarBg(emp.name), 'flex h-full w-full items-center justify-center text-white text-xs font-bold']">
                                                        {{ initials(emp.name) }}
                                                    </div>
                                                </div>
                                            </TableCell>
                                            <TableCell class="font-mono text-sm font-medium">{{ emp.hr_profile?.payroll_id ?? '—' }}</TableCell>
                                            <TableCell>
                                                <p class="font-medium">{{ emp.hr_profile?.title ? emp.hr_profile.title + ' ' : '' }}{{ emp.name }}</p>
                                            </TableCell>
                                            <TableCell class="text-sm">
                                                <a v-if="emp.email" :href="`mailto:${emp.email}`" class="text-primary hover:underline">{{ emp.email }}</a>
                                                <span v-else class="text-muted-foreground">—</span>
                                            </TableCell>
                                            <TableCell class="text-sm">{{ emp.position ?? '—' }}</TableCell>
                                            <TableCell>
                                                <p>{{ emp.department ?? '—' }}</p>
                                                <p v-if="emp.unit" class="text-xs text-muted-foreground">{{ emp.unit }}</p>
                                            </TableCell>
                                            <TableCell>{{ emp.hr_profile?.job_grade ?? '—' }}</TableCell>
                                            <TableCell>{{ emp.location ?? '—' }}</TableCell>
                                            <TableCell>
                                                <Badge :variant="emp.hr_profile ? 'default' : 'secondary'">
                                                    {{ emp.hr_profile ? 'Complete' : 'Missing' }}
                                                </Badge>
                                            </TableCell>
                                            <TableCell class="text-right">
                                                <Button size="sm" variant="ghost" as-child>
                                                    <Link :href="`/hr/nominal-roll/${emp.id}`">
                                                        <Eye class="h-4 w-4" />
                                                    </Link>
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                        <TableRow v-if="employees.data.length === 0">
                                            <TableCell colspan="10" class="py-10 text-center text-muted-foreground">
                                                <Users class="mx-auto mb-2 h-8 w-8 opacity-40" />
                                                No employees found.
                                            </TableCell>
                                        </TableRow>
                                    </TableBody>
                                </Table>
                            </div>
                        </div>
                    </template>
                </div>

                <!-- BOTTOM PAGINATION (full page links) -->
                <div v-if="employees.last_page > 1" class="border-t px-4 py-2 flex items-center justify-center gap-1 bg-background shrink-0">
                    <template v-for="link in employees.links" :key="link.label">
                        <Button v-if="link.url" size="sm" :variant="link.active ? 'default' : 'outline'" as-child>
                            <Link :href="link.url" preserve-state v-html="link.label" />
                        </Button>
                        <Button v-else size="sm" variant="outline" disabled v-html="link.label" />
                    </template>
                </div>

            </div>
        </div>
    </AppLayout>
</template>
