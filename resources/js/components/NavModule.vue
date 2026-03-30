<script setup lang="ts">
import { ref, computed } from 'vue';
import { Link, usePage } from '@inertiajs/vue3';
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
import { useCurrentUrl } from '@/composables/useCurrentUrl';
import { toUrl } from '@/lib/utils';
import { type NavItem } from '@/types';

/**
 * A sidebar module section that renders:
 *  - flat nav links (items)
 *  - collapsible sub-groups (groups)
 * all under a single labelled SidebarGroup.
 *
 * When collapsible=true the entire module collapses/expands on label click.
 * Designed to be reused for any module:
 *   Platform · Human Resources · Document Management · Accounting · …
 */

interface NavGroup {
    title: string;
    icon?: any;
    items: NavItem[];
}

const props = withDefaults(defineProps<{
    label: string;
    items?: NavItem[];
    groups?: NavGroup[];
    collapsible?: boolean;
}>(), {
    collapsible: false,
});

const { isCurrentUrl } = useCurrentUrl();
const page = usePage();

function isActive(href: NavItem['href']): boolean {
    const url = toUrl(href);
    if (!url) return false;
    const pathname = new URL(page.url, window?.location.origin).pathname;
    return url === pathname;
}

function isGroupActive(group: NavGroup): boolean {
    return group.items.some((item) => isActive(item.href));
}

// Auto-open module if any item inside it is currently active
const hasActiveItem = computed(() => {
    const flatActive = (props.items ?? []).some((item) => isCurrentUrl(item.href));
    const groupActive = (props.groups ?? []).some((g) => isGroupActive(g));
    return flatActive || groupActive;
});

// Module-level open state (used when collapsible=true)
const moduleOpen = ref(hasActiveItem.value);

// Sub-group open states
const subGroupOpen = ref<Record<string, boolean>>(
    Object.fromEntries((props.groups ?? []).map((g) => [g.title, isGroupActive(g)])),
);
</script>

<template>
    <SidebarGroup class="px-2 py-0">

        <!-- ── Collapsible module: label acts as toggle ─────────────────── -->
        <template v-if="collapsible">
            <Collapsible v-model:open="moduleOpen">
                <CollapsibleTrigger as-child>
                    <SidebarGroupLabel
                        class="flex cursor-pointer select-none items-center justify-between
                               hover:text-sidebar-foreground"
                    >
                        {{ label }}
                        <ChevronRight
                            class="size-3.5 shrink-0 transition-transform duration-200"
                            :class="{ 'rotate-90': moduleOpen }"
                        />
                    </SidebarGroupLabel>
                </CollapsibleTrigger>

                <CollapsibleContent>
                    <SidebarMenu>
                        <!-- Flat links -->
                        <SidebarMenuItem v-for="item in items" :key="item.title">
                            <SidebarMenuButton
                                as-child
                                :is-active="isCurrentUrl(item.href)"
                                :tooltip="item.title"
                            >
                                <Link :href="item.href">
                                    <component :is="item.icon" />
                                    <span>{{ item.title }}</span>
                                </Link>
                            </SidebarMenuButton>
                        </SidebarMenuItem>

                        <!-- Collapsible sub-groups -->
                        <Collapsible
                            v-for="group in groups"
                            :key="group.title"
                            as-child
                            :default-open="isGroupActive(group)"
                            v-model:open="subGroupOpen[group.title]"
                        >
                            <SidebarMenuItem>
                                <CollapsibleTrigger as-child>
                                    <SidebarMenuButton :tooltip="group.title">
                                        <component :is="group.icon" v-if="group.icon" />
                                        <span>{{ group.title }}</span>
                                        <ChevronRight
                                            class="ml-auto transition-transform duration-200"
                                            :class="{ 'rotate-90': subGroupOpen[group.title] }"
                                        />
                                    </SidebarMenuButton>
                                </CollapsibleTrigger>
                                <CollapsibleContent>
                                    <SidebarMenuSub>
                                        <SidebarMenuSubItem
                                            v-for="item in group.items"
                                            :key="item.title"
                                        >
                                            <SidebarMenuSubButton
                                                as-child
                                                :is-active="isActive(item.href)"
                                            >
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
                </CollapsibleContent>
            </Collapsible>
        </template>

        <!-- ── Always-visible module: label is a static heading ─────────── -->
        <template v-else>
            <SidebarGroupLabel>{{ label }}</SidebarGroupLabel>
            <SidebarMenu>
                <!-- Flat links -->
                <SidebarMenuItem v-for="item in items" :key="item.title">
                    <SidebarMenuButton
                        as-child
                        :is-active="isCurrentUrl(item.href)"
                        :tooltip="item.title"
                    >
                        <Link :href="item.href">
                            <component :is="item.icon" />
                            <span>{{ item.title }}</span>
                        </Link>
                    </SidebarMenuButton>
                </SidebarMenuItem>

                <!-- Collapsible sub-groups -->
                <Collapsible
                    v-for="group in groups"
                    :key="group.title"
                    as-child
                    :default-open="isGroupActive(group)"
                    v-model:open="subGroupOpen[group.title]"
                >
                    <SidebarMenuItem>
                        <CollapsibleTrigger as-child>
                            <SidebarMenuButton :tooltip="group.title">
                                <component :is="group.icon" v-if="group.icon" />
                                <span>{{ group.title }}</span>
                                <ChevronRight
                                    class="ml-auto transition-transform duration-200"
                                    :class="{ 'rotate-90': subGroupOpen[group.title] }"
                                />
                            </SidebarMenuButton>
                        </CollapsibleTrigger>
                        <CollapsibleContent>
                            <SidebarMenuSub>
                                <SidebarMenuSubItem
                                    v-for="item in group.items"
                                    :key="item.title"
                                >
                                    <SidebarMenuSubButton
                                        as-child
                                        :is-active="isActive(item.href)"
                                    >
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
        </template>

    </SidebarGroup>
</template>
