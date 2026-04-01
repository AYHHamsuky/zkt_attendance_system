<script setup lang="ts">
import { Head, Link } from '@inertiajs/vue3';
import AppLayout from '@/layouts/AppLayout.vue';
import { type BreadcrumbItem } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    Users, FileText, Calendar, FolderOpen,
    ArrowLeftRight, DoorOpen, Star, AlertTriangle, Clock,
    ClipboardList, CheckCircle, ChevronRight,
} from 'lucide-vue-next';

// ── Admin/HR props ────────────────────────────────────────────────────────
interface Stats {
    total_employees: number;
    nominal_roll_count: number;
    active_contracts: number;
    expiring_contracts: number;
    pending_leave: number;
    approved_leave: number;
    pending_transfers: number;
    pending_resignations: number;
    active_performance_cycles: number;
}

interface RecentLeave {
    id: number;
    employee?: { name: string };
    leaveType: { name: string };
    status: string;
    days_requested: number;
    start_date: string;
    end_date: string;
}

interface RecentTransfer {
    id: number;
    employee: { name: string };
    from_department: string;
    to_department: string;
    status: string;
    effective_date: string;
}

interface RecentResignation {
    id: number;
    employee: { name: string };
    exit_type: string;
    status: string;
    last_working_date: string;
}

interface ExpiringContract {
    id: number;
    employee: { name: string };
    contract_type: string;
    end_date: string;
}

// ── Personal view props ───────────────────────────────────────────────────
interface LeaveBalance {
    leave_type: string;
    days_allowed: number;
    days_taken: number;
    days_pending: number;
    remaining: number;
}

interface ActiveReview {
    id: number;
    status: string;
    cycle: { name: string; year: number };
}

const props = defineProps<{
    isPersonalView: boolean;
    // Admin view
    stats?: Stats;
    recentLeave?: RecentLeave[];
    recentTransfers?: RecentTransfer[];
    recentResignations?: RecentResignation[];
    expiringContracts?: ExpiringContract[];
    // Personal view
    hasEmployee?: boolean;
    employee?: { id: number; name: string; department: string | null; position: string | null };
    leaveBalances?: LeaveBalance[];
    activeReview?: ActiveReview | null;
    year?: number;
}>();

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Human Resources', href: '/hr' },
];

// Admin module cards — only computed when in admin view
const modules = props.stats ? [
    { title: 'Nominal Roll',  href: '/hr/nominal-roll',          icon: Users,         stat: props.stats.nominal_roll_count,         label: 'profiles',      color: 'text-blue-600',   alert: null },
    { title: 'Contracts',     href: '/hr/contracts',             icon: FileText,      stat: props.stats.active_contracts,           label: 'active',        color: 'text-green-600',  alert: props.stats.expiring_contracts > 0 ? `${props.stats.expiring_contracts} expiring soon` : null },
    { title: 'Leave',         href: '/hr/leave',                 icon: Calendar,      stat: props.stats.pending_leave,              label: 'pending',       color: 'text-orange-600', alert: props.stats.approved_leave > 0 ? `${props.stats.approved_leave} currently on leave` : null },
    { title: 'Documents',     href: '/hr/documents',             icon: FolderOpen,    stat: null,                                   label: null,            color: 'text-purple-600', alert: null },
    { title: 'Transfers',     href: '/hr/transfers',             icon: ArrowLeftRight, stat: props.stats.pending_transfers,         label: 'pending',       color: 'text-yellow-600', alert: null },
    { title: 'Resignations',  href: '/hr/resignations',          icon: DoorOpen,      stat: props.stats.pending_resignations,       label: 'pending',       color: 'text-red-600',    alert: null },
    { title: 'Performance',   href: '/hr/performance/cycles',    icon: Star,          stat: props.stats.active_performance_cycles,  label: 'active cycles', color: 'text-indigo-600', alert: null },
] : [];

const statusVariant: Record<string, 'default' | 'secondary' | 'destructive' | 'outline'> = {
    pending: 'secondary',
    lm_approved: 'outline',
    lm_rejected: 'destructive',
    approved: 'default',
    rejected: 'destructive',
    cancelled: 'outline',
    active: 'default',
    completed: 'outline',
    accepted: 'default',
    submitted: 'default',
    acknowledged: 'outline',
    finalized: 'default',
};

const appraisalStatusLabel: Record<string, string> = {
    pending: 'Awaiting your self-appraisal',
    submitted: 'Submitted — awaiting manager review',
    acknowledged: 'Acknowledged by manager',
    finalized: 'Finalized',
};
</script>

<template>
    <Head title="HR Dashboard" />
    <AppLayout :breadcrumbs="breadcrumbs">
        <div class="flex h-full flex-1 flex-col gap-6 p-4 md:p-6">

            <!-- ══════════════════════════════════════
                 ADMIN / HR VIEW
                 ══════════════════════════════════════ -->
            <template v-if="!isPersonalView && stats">

                <!-- Header -->
                <div>
                    <h2 class="text-2xl font-bold tracking-tight">HRIS</h2>
                    <p class="text-muted-foreground">{{ stats.total_employees }} active employees across all modules</p>
                </div>

                <!-- Module Cards -->
                <div class="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
                    <Link v-for="mod in modules" :key="mod.title" :href="mod.href" class="block">
                        <Card class="hover:shadow-md transition-shadow cursor-pointer">
                            <CardHeader class="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle class="text-sm font-medium">{{ mod.title }}</CardTitle>
                                <component :is="mod.icon" :class="['size-4', mod.color]" />
                            </CardHeader>
                            <CardContent>
                                <div v-if="mod.stat !== null" class="text-2xl font-bold">{{ mod.stat }}</div>
                                <div v-else class="text-2xl font-bold text-muted-foreground">—</div>
                                <p v-if="mod.label" class="text-xs text-muted-foreground">{{ mod.label }}</p>
                                <p v-if="mod.alert" class="mt-1 flex items-center gap-1 text-xs text-orange-600">
                                    <AlertTriangle class="size-3" /> {{ mod.alert }}
                                </p>
                            </CardContent>
                        </Card>
                    </Link>
                </div>

                <!-- Recent Activity Grid -->
                <div class="grid gap-4 lg:grid-cols-2">
                    <Card v-if="expiringContracts && expiringContracts.length > 0">
                        <CardHeader>
                            <CardTitle class="flex items-center gap-2 text-base">
                                <AlertTriangle class="size-4 text-orange-500" />Contracts Expiring Soon
                            </CardTitle>
                        </CardHeader>
                        <CardContent class="space-y-2">
                            <div v-for="contract in expiringContracts" :key="contract.id"
                                class="flex items-center justify-between rounded-md border p-2 text-sm">
                                <div>
                                    <p class="font-medium">{{ contract.employee?.name ?? '—' }}</p>
                                    <p class="text-xs text-muted-foreground capitalize">{{ contract.contract_type }}</p>
                                </div>
                                <p class="text-xs text-orange-600 font-medium">{{ contract.end_date }}</p>
                            </div>
                            <Button variant="outline" size="sm" as-child class="w-full mt-2">
                                <Link href="/hr/contracts">View All Contracts</Link>
                            </Button>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle class="flex items-center gap-2 text-base">
                                <Clock class="size-4 text-blue-500" />Recent Leave Applications
                            </CardTitle>
                        </CardHeader>
                        <CardContent class="space-y-2">
                            <div v-for="leave in recentLeave" :key="leave.id"
                                class="flex items-center justify-between rounded-md border p-2 text-sm">
                                <div>
                                    <p class="font-medium">{{ leave.employee?.name }}</p>
                                    <p class="text-xs text-muted-foreground">{{ leave.leaveType?.name }} · {{ leave.days_requested }}d</p>
                                </div>
                                <Badge :variant="statusVariant[leave.status] ?? 'secondary'" class="text-xs capitalize">
                                    {{ leave.status }}
                                </Badge>
                            </div>
                            <div v-if="!recentLeave?.length" class="py-4 text-center text-sm text-muted-foreground">No recent leave applications.</div>
                            <Button variant="outline" size="sm" as-child class="w-full mt-2">
                                <Link href="/hr/leave">View All Leave</Link>
                            </Button>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle class="flex items-center gap-2 text-base">
                                <ArrowLeftRight class="size-4 text-yellow-500" />Recent Transfers
                            </CardTitle>
                        </CardHeader>
                        <CardContent class="space-y-2">
                            <div v-for="transfer in recentTransfers" :key="transfer.id"
                                class="flex items-center justify-between rounded-md border p-2 text-sm">
                                <div>
                                    <p class="font-medium">{{ transfer.employee?.name ?? '—' }}</p>
                                    <p class="text-xs text-muted-foreground">{{ transfer.from_department }} → {{ transfer.to_department }}</p>
                                </div>
                                <Badge :variant="statusVariant[transfer.status] ?? 'secondary'" class="text-xs capitalize">{{ transfer.status }}</Badge>
                            </div>
                            <div v-if="!recentTransfers?.length" class="py-4 text-center text-sm text-muted-foreground">No recent transfers.</div>
                            <Button variant="outline" size="sm" as-child class="w-full mt-2">
                                <Link href="/hr/transfers">View All Transfers</Link>
                            </Button>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle class="flex items-center gap-2 text-base">
                                <DoorOpen class="size-4 text-red-500" />Recent Resignations
                            </CardTitle>
                        </CardHeader>
                        <CardContent class="space-y-2">
                            <div v-for="res in recentResignations" :key="res.id"
                                class="flex items-center justify-between rounded-md border p-2 text-sm">
                                <div>
                                    <p class="font-medium">{{ res.employee?.name ?? '—' }}</p>
                                    <p class="text-xs text-muted-foreground capitalize">{{ res.exit_type }} · Last: {{ res.last_working_date }}</p>
                                </div>
                                <Badge :variant="statusVariant[res.status] ?? 'secondary'" class="text-xs capitalize">{{ res.status }}</Badge>
                            </div>
                            <div v-if="!recentResignations?.length" class="py-4 text-center text-sm text-muted-foreground">No recent resignations.</div>
                            <Button variant="outline" size="sm" as-child class="w-full mt-2">
                                <Link href="/hr/resignations">View All Resignations</Link>
                            </Button>
                        </CardContent>
                    </Card>
                </div>
            </template>

            <!-- ══════════════════════════════════════
                 PERSONAL VIEW (regular user)
                 ══════════════════════════════════════ -->
            <template v-else-if="isPersonalView">

                <!-- No employee record -->
                <Card v-if="!hasEmployee">
                    <CardContent class="flex flex-col items-center gap-3 py-16">
                        <ClipboardList class="size-12 text-muted-foreground" />
                        <p class="text-lg font-medium">No employee record linked</p>
                        <p class="text-sm text-muted-foreground text-center max-w-sm">
                            Your user account is not linked to an employee record. Contact HR for assistance.
                        </p>
                    </CardContent>
                </Card>

                <template v-else>
                    <!-- Header -->
                    <div>
                        <h2 class="text-2xl font-bold tracking-tight">My HR Overview</h2>
                        <p class="text-muted-foreground">
                            {{ employee?.name }}
                            <span v-if="employee?.position"> · {{ employee.position }}</span>
                            <span v-if="employee?.department"> · {{ employee.department }}</span>
                        </p>
                    </div>

                    <!-- Leave Balances -->
                    <div>
                        <h3 class="mb-3 text-sm font-semibold text-muted-foreground uppercase tracking-wide">
                            Leave Balances — {{ year }}
                        </h3>
                        <div v-if="leaveBalances && leaveBalances.length > 0" class="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                            <Card v-for="balance in leaveBalances" :key="balance.leave_type">
                                <CardHeader class="pb-1">
                                    <CardTitle class="text-sm font-medium">{{ balance.leave_type }}</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <!-- Progress bar -->
                                    <div class="mb-2 h-2 w-full rounded-full bg-muted overflow-hidden">
                                        <div
                                            class="h-2 rounded-full bg-primary transition-all"
                                            :style="{ width: balance.days_allowed > 0 ? `${Math.min(100, ((balance.days_taken + balance.days_pending) / balance.days_allowed) * 100)}%` : '0%' }"
                                        />
                                    </div>
                                    <div class="flex justify-between text-xs text-muted-foreground">
                                        <span>{{ balance.days_taken + balance.days_pending }} used</span>
                                        <span class="font-semibold text-foreground">{{ balance.remaining }} left of {{ balance.days_allowed }}</span>
                                    </div>
                                    <div v-if="balance.days_pending > 0" class="mt-1 text-xs text-orange-600">
                                        {{ balance.days_pending }}d pending approval
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                        <Card v-else>
                            <CardContent class="py-8 text-center text-sm text-muted-foreground">
                                No leave balances for {{ year }}. Contact HR to set up your leave entitlements.
                            </CardContent>
                        </Card>
                    </div>

                    <!-- Quick actions + Appraisal status -->
                    <div class="grid gap-4 lg:grid-cols-2">
                        <!-- Quick Actions -->
                        <Card>
                            <CardHeader>
                                <CardTitle class="text-base">Quick Actions</CardTitle>
                            </CardHeader>
                            <CardContent class="space-y-2">
                                <Button as-child class="w-full justify-between" variant="outline">
                                    <Link href="/hr/leave/create">
                                        Apply for Leave
                                        <ChevronRight class="size-4" />
                                    </Link>
                                </Button>
                                <Button as-child class="w-full justify-between" variant="outline">
                                    <Link href="/hr/leave">
                                        My Leave Applications
                                        <ChevronRight class="size-4" />
                                    </Link>
                                </Button>
                                <Button as-child class="w-full justify-between" variant="outline">
                                    <Link href="/hr/performance/my-appraisals">
                                        My Performance Appraisals
                                        <ChevronRight class="size-4" />
                                    </Link>
                                </Button>
                            </CardContent>
                        </Card>

                        <!-- Active Appraisal -->
                        <Card>
                            <CardHeader>
                                <CardTitle class="flex items-center gap-2 text-base">
                                    <Star class="size-4 text-indigo-500" />Active Appraisal
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div v-if="activeReview">
                                    <p class="font-medium">{{ activeReview.cycle?.name }}</p>
                                    <p class="text-xs text-muted-foreground mb-3">{{ activeReview.cycle?.year }}</p>
                                    <Badge :variant="statusVariant[activeReview.status] ?? 'secondary'" class="mb-3 capitalize">
                                        {{ activeReview.status }}
                                    </Badge>
                                    <p class="text-sm text-muted-foreground mb-3">
                                        {{ appraisalStatusLabel[activeReview.status] ?? activeReview.status }}
                                    </p>
                                    <Button as-child size="sm" class="w-full">
                                        <Link :href="`/hr/performance/reviews/${activeReview.id}`">
                                            {{ activeReview.status === 'pending' ? 'Start Self-Appraisal' : 'View Appraisal' }}
                                            <ChevronRight class="ml-1 size-4" />
                                        </Link>
                                    </Button>
                                </div>
                                <div v-else class="flex flex-col items-center gap-2 py-6 text-center">
                                    <CheckCircle class="size-8 text-muted-foreground" />
                                    <p class="text-sm text-muted-foreground">No active appraisal cycle at the moment.</p>
                                    <Button variant="outline" size="sm" as-child>
                                        <Link href="/hr/performance/my-appraisals">View Past Appraisals</Link>
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    <!-- Recent Leave -->
                    <Card>
                        <CardHeader>
                            <CardTitle class="flex items-center gap-2 text-base">
                                <Calendar class="size-4 text-blue-500" />My Recent Leave
                            </CardTitle>
                        </CardHeader>
                        <CardContent class="space-y-2">
                            <div v-for="leave in recentLeave" :key="leave.id"
                                class="flex items-center justify-between rounded-md border p-2 text-sm">
                                <div>
                                    <p class="font-medium">{{ leave.leaveType?.name }}</p>
                                    <p class="text-xs text-muted-foreground">{{ leave.start_date }} → {{ leave.end_date }} · {{ leave.days_requested }}d</p>
                                </div>
                                <Badge :variant="statusVariant[leave.status] ?? 'secondary'" class="text-xs capitalize">
                                    {{ leave.status }}
                                </Badge>
                            </div>
                            <div v-if="!recentLeave?.length" class="py-4 text-center text-sm text-muted-foreground">
                                No leave applications yet.
                            </div>
                            <Button variant="outline" size="sm" as-child class="w-full mt-2">
                                <Link href="/hr/leave">View All My Leave</Link>
                            </Button>
                        </CardContent>
                    </Card>
                </template>
            </template>

        </div>
    </AppLayout>
</template>
