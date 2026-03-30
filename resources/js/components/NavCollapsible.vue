<script setup lang="ts">
import { Link, usePage } from '@inertiajs/vue3';
import { ref, computed } from 'vue';
import { ChevronRight } from 'lucide-vue-next';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import {
    SidebarGroup,
    SidebarGroupLabel,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarMenuSub,
    SidebarMenuSubButton,
    SidebarMenuSubItem,
} from '@/components/ui/sidebar';
import { type NavItem } from '@/types';
import { toUrl } from '@/lib/utils';

interface NavGroup {
    title: string;
    icon?: any;
    items: NavItem[];
}

const props = withDefaults(defineProps<{
    groups: NavGroup[];
    label?: string;
}>(), {
    label: 'Platform',
});

const page = usePage();

function isActive(href: NavItem['href']): boolean {
    const url = toUrl(href);
    if (!url) return false;
    const pathname = new URL(page.url, window?.location.origin).pathname;
    return url === pathname;
}

function isGroupActive(group: NavGroup): boolean {
    return group.items.some(item => isActive(item.href));
}

// Each group tracks its own open state; starts open if any child is active
const openStates = ref<Record<string, boolean>>(
    Object.fromEntries(props.groups.map(g => [g.title, isGroupActive(g)]))
);
</script>

<template>
    <SidebarGroup class="px-2 py-0">
        <SidebarGroupLabel>{{ label }}</SidebarGroupLabel>
        <SidebarMenu>
            <Collapsible
                v-for="group in groups"
                :key="group.title"
                as-child
                :default-open="isGroupActive(group)"
                v-model:open="openStates[group.title]"
            >
                <SidebarMenuItem>
                    <!-- Collapsible trigger row -->
                    <CollapsibleTrigger as-child>
                        <SidebarMenuButton :tooltip="group.title">
                            <component :is="group.icon" v-if="group.icon" />
                            <span>{{ group.title }}</span>
                            <ChevronRight
                                class="ml-auto transition-transform duration-200"
                                :class="{ 'rotate-90': openStates[group.title] }"
                            />
                        </SidebarMenuButton>
                    </CollapsibleTrigger>

                    <!-- Sub-items -->
                    <CollapsibleContent>
                        <SidebarMenuSub>
                            <SidebarMenuSubItem v-for="item in group.items" :key="item.title">
                                <SidebarMenuSubButton as-child :is-active="isActive(item.href)">
                                    <Link :href="item.href">
                                        <component :is="item.icon" v-if="item.icon" />
                                        <span>{{ item.title }}</span>
                                    </Link>
                                </SidebarMenuSubButton>
                            </SidebarMenuSubItem>
                        </SidebarMenuSub>
                    </CollapsibleContent>
                </SidebarMenuItem>
            </Collapsible>
        </SidebarMenu>
    </SidebarGroup>
</template>
