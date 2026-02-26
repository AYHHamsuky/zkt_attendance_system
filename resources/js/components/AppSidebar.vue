<script setup lang="ts">
import { computed } from 'vue';
import { Link, usePage } from '@inertiajs/vue3';
import { BookOpen, LayoutGrid, Server, Users, ClipboardList, BarChart3 } from 'lucide-vue-next';
import NavFooter from '@/components/NavFooter.vue';
import NavMain from '@/components/NavMain.vue';
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

const page = usePage<{ auth: { user: { role: string } | null } }>();
const isAdmin = computed(() => page.props.auth?.user?.role === 'admin');

const allNavItems: NavItem[] = [
    {
        title: 'Dashboard',
        href: dashboard(),
        icon: LayoutGrid,
    },
    {
        title: 'Devices',
        href: '/devices',
        icon: Server,
        adminOnly: true,
    },
    {
        title: 'Employees',
        href: '/employees',
        icon: Users,
    },
    {
        title: 'Attendance',
        href: '/attendance',
        icon: ClipboardList,
    },
    {
        title: 'Reports',
        href: '/attendance/report',
        icon: BarChart3,
    },
];

const mainNavItems = computed(() =>
    allNavItems.filter((item) => !(item as any).adminOnly || isAdmin.value)
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
            <NavMain :items="mainNavItems" />
        </SidebarContent>

        <SidebarFooter>
            <NavFooter :items="footerNavItems" />
            <NavUser />
        </SidebarFooter>
    </Sidebar>
    <slot />
</template>
