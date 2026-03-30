<script setup lang="ts">
import { computed } from 'vue';
import { Link, usePage } from '@inertiajs/vue3';
import {
    BookOpen,
    Server,
    Users,
    ClipboardList,
    BarChart3,
    Briefcase,
    FileText,
    Calendar,
    FolderOpen,
    ArrowLeftRight,
    DoorOpen,
    Star,
    ClipboardCheck,
    Settings,
    Umbrella,
} from 'lucide-vue-next';
import NavCollapsible from '@/components/NavCollapsible.vue';
import NavFooter from '@/components/NavFooter.vue';
import NavModule from '@/components/NavModule.vue';
import NavUser from '@/components/NavUser.vue';
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from '@/components/ui/sidebar';
import { type NavItem } from '@/types';
import AppLogo from './AppLogo.vue';
import { dashboard } from '@/routes';

interface PageProps {
    auth: {
        user: { role: string } | null;
        permissions: string[];
    };
}

const page = usePage<PageProps>();
const permissions = computed(() => page.props.auth?.permissions ?? []);

function can(permission: string): boolean {
    return permissions.value.includes(permission);
}

// ── Human Resources module — flat items ───────────────────────────────────
const hrItems = computed<NavItem[]>(() => [
    can('hr.dashboard')    && { title: 'HR Dashboard', href: dashboard(),        icon: Briefcase },
    can('hr.nominal_roll') && { title: 'Staff List', href: '/hr/nominal-roll', icon: Users },
    can('hr.contracts')    && { title: 'Contracts',    href: '/hr/contracts',     icon: FileText },
    can('hr.leave.apply')     && { title: 'Leave',           href: '/hr/leave',          icon: Calendar },
    can('hr.public_holidays') && { title: 'Public Holidays', href: '/hr/public-holidays', icon: Umbrella },
    can('hr.documents')       && { title: 'Documents',       href: '/hr/documents',       icon: FolderOpen },
    can('hr.transfers')    && { title: 'Transfers',    href: '/hr/transfers',     icon: ArrowLeftRight },
    can('hr.resignations') && { title: 'Resignations', href: '/hr/resignations',  icon: DoorOpen },
].filter(Boolean) as NavItem[]);

// ── Human Resources — Attendance collapsible sub-group ────────────────────
const attendanceSubItems = computed<NavItem[]>(() => [
    can('platform.devices')    && { title: 'Devices',    href: '/devices',          icon: Server },
    can('platform.employees')  && { title: 'Employees',  href: '/employees',         icon: Users },
    can('platform.attendance') && { title: 'Attendance', href: '/attendance',        icon: ClipboardList },
    can('platform.reports')    && { title: 'Reports',    href: '/attendance/report', icon: BarChart3 },
].filter(Boolean) as NavItem[]);

// ── Human Resources — Performance collapsible sub-group ───────────────────
const performanceSubItems = computed<NavItem[]>(() => [
    can('performance.cycles')     && { title: 'Cycles & Reviews',   href: '/hr/performance/cycles',        icon: Star },
    can('performance.reports')    && { title: 'Reports & Analysis', href: '/hr/performance/reports',       icon: BarChart3 },
    can('performance.appraisals') && { title: 'My Appraisals',      href: '/hr/performance/my-appraisals', icon: ClipboardCheck },
].filter(Boolean) as NavItem[]);

const hrGroups = computed(() => [
    ...(attendanceSubItems.value.length > 0
        ? [{ title: 'Attendance', icon: ClipboardList, items: attendanceSubItems.value }]
        : []),
    ...(performanceSubItems.value.length > 0
        ? [{ title: 'Performance', icon: Star, items: performanceSubItems.value }]
        : []),
]);

const showHrModule = computed(() => hrItems.value.length > 0 || hrGroups.value.length > 0);

// ── Administration (Settings) collapsible ─────────────────────────────────
const settingsItems = computed<NavItem[]>(() => [
    can('settings.users')  && { title: 'Users',          href: '/settings/users',  icon: Users },
    can('settings.access') && { title: 'Access Control', href: '/settings/access', icon: Settings },
].filter(Boolean) as NavItem[]);

const settingsGroups = computed(() =>
    settingsItems.value.length > 0
        ? [{ title: 'Settings', icon: Settings, items: settingsItems.value }]
        : [],
);

const footerNavItems: NavItem[] = [
    {
        title: 'Documentation',
        href: 'https://laravel.com/docs/starter-kits#vue',
        icon: BookOpen,
    },
];
</script>

<template>
    <Sidebar collapsible="icon" variant="inset">
        <SidebarHeader>
            <SidebarMenu>
                <SidebarMenuItem>
                    <SidebarMenuButton size="lg" as-child>
                        <Link :href="dashboard()">
                            <AppLogo />
                        </Link>
                    </SidebarMenuButton>
                </SidebarMenuItem>
            </SidebarMenu>
        </SidebarHeader>

        <SidebarContent>
            <!-- Human Resources: collapsible module
                 Flat: HR Dashboard, Nominal Roll, Contracts, Leave, Documents, Transfers, Resignations
                 ▶ Attendance sub-group: Dashboard, Devices, Employees, Attendance, Reports
                 ▶ Performance sub-group: Cycles, Reports, My Appraisals -->
            <NavModule
                v-if="showHrModule"
                label="Human Resources"
                :items="hrItems"
                :groups="hrGroups"
                :collapsible="true"
            />

            <!--
                Future modules go here, e.g.:
                <NavModule label="Document Management" :items="dmsItems" />
                <NavModule label="Accounting" :items="accountingItems" :groups="accountingGroups" />
            -->

            <!-- Administration: Users, Access Control -->
            <NavCollapsible v-if="settingsGroups.length" :groups="settingsGroups" label="Administration" />
        </SidebarContent>

        <SidebarFooter>
            <NavFooter :items="footerNavItems" />
            <NavUser />
        </SidebarFooter>
    </Sidebar>
    <slot />
</template>
