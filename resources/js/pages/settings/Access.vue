<script setup lang="ts">
import { Head, router } from '@inertiajs/vue3';
import AppLayout from '@/layouts/AppLayout.vue';
import SettingsLayout from '@/layouts/settings/Layout.vue';
import Heading from '@/components/Heading.vue';
import { type BreadcrumbItem } from '@/types';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Lock, ShieldCheck, Info } from 'lucide-vue-next';
import { ref } from 'vue';

interface PermissionItem {
    key: string;
    label: string;
    always_granted: boolean;
    super_admin_only: boolean;
    granted: Record<string, boolean>;
}

interface PermissionGroup {
    name: string;
    items: PermissionItem[];
}

const props = defineProps<{
    groups: PermissionGroup[];
    roles: string[];
}>();

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Settings', href: '/settings/profile' },
    { title: 'Access Control' },
];

const toggling = ref<string | null>(null); // "role:permission" being saved

function toggle(role: string, permission: string, currentlyGranted: boolean) {
    const key = `${role}:${permission}`;
    if (toggling.value === key) return;
    toggling.value = key;

    router.post('/settings/access/toggle', {
        role,
        permission,
        granted: !currentlyGranted,
    }, {
        preserveState: false,
        onFinish: () => { toggling.value = null; },
    });
}

const roleLabels: Record<string, string> = {
    admin: 'Admin',
    hr: 'HR',
    user: 'User',
};

const roleColors: Record<string, string> = {
    admin: 'text-red-600 dark:text-red-400',
    hr: 'text-blue-600 dark:text-blue-400',
    user: 'text-slate-600 dark:text-slate-400',
};
</script>

<template>
    <Head title="Access Control" />
    <AppLayout :breadcrumbs="breadcrumbs">
        <SettingsLayout>
            <Heading
                variant="small"
                title="Access Control"
                description="Configure which menus and features each role can access. Super Admin always has full access."
            />

            <!-- Legend -->
            <div class="flex flex-wrap items-start gap-4 rounded-lg border bg-muted/30 p-4 text-sm">
                <div class="flex items-center gap-2">
                    <div class="size-5 rounded border-2 border-primary bg-primary" />
                    <span>Granted</span>
                </div>
                <div class="flex items-center gap-2">
                    <div class="size-5 rounded border-2 border-muted-foreground/30 bg-background" />
                    <span>Not granted</span>
                </div>
                <div class="flex items-center gap-2">
                    <Lock class="size-4 text-amber-500" />
                    <span>Always granted — cannot be revoked</span>
                </div>
                <div class="flex items-center gap-2">
                    <ShieldCheck class="size-4 text-purple-500" />
                    <span>Super Admin exclusive</span>
                </div>
                <div class="ml-auto flex items-center gap-1.5 text-xs text-muted-foreground">
                    <Info class="size-3.5" />
                    Click a checkbox to toggle access. Changes apply immediately.
                </div>
            </div>

            <!-- Role headers (sticky) -->
            <div class="overflow-x-auto">
                <table class="w-full text-sm">
                    <!-- Header -->
                    <thead>
                        <tr class="border-b">
                            <th class="w-64 py-3 pr-4 text-left text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                                Feature / Menu
                            </th>
                            <!-- Super Admin column (always full) -->
                            <th class="w-28 py-3 text-center">
                                <div class="flex flex-col items-center gap-1">
                                    <Badge variant="destructive" class="text-xs">Super Admin</Badge>
                                    <span class="text-[10px] text-muted-foreground">Full access</span>
                                </div>
                            </th>
                            <!-- Configurable role columns -->
                            <th v-for="role in roles" :key="role" class="w-24 py-3 text-center">
                                <div class="flex flex-col items-center gap-1">
                                    <span class="font-semibold" :class="roleColors[role]">{{ roleLabels[role] ?? role }}</span>
                                    <span class="text-[10px] text-muted-foreground">configurable</span>
                                </div>
                            </th>
                        </tr>
                    </thead>

                    <tbody>
                        <template v-for="group in groups" :key="group.name">
                            <!-- Group header row -->
                            <tr class="border-b bg-muted/20">
                                <td :colspan="2 + roles.length" class="py-2 pl-2 text-xs font-bold uppercase tracking-wider text-muted-foreground">
                                    {{ group.name }}
                                </td>
                            </tr>

                            <!-- Permission rows -->
                            <tr
                                v-for="item in group.items"
                                :key="item.key"
                                class="border-b transition-colors hover:bg-muted/30"
                            >
                                <!-- Feature label -->
                                <td class="py-2.5 pr-4">
                                    <div class="flex items-center gap-2">
                                        <span>{{ item.label }}</span>
                                        <Lock v-if="item.always_granted" class="size-3.5 shrink-0 text-amber-500" title="Always granted to all users" />
                                        <ShieldCheck v-if="item.super_admin_only" class="size-3.5 shrink-0 text-purple-500" title="Super Admin only" />
                                    </div>
                                    <p class="mt-0.5 font-mono text-[10px] text-muted-foreground/60">{{ item.key }}</p>
                                </td>

                                <!-- Super admin cell (always ticked, locked) -->
                                <td class="py-2.5 text-center">
                                    <div class="flex justify-center">
                                        <div class="size-5 rounded border-2 border-primary bg-primary flex items-center justify-center">
                                            <svg class="size-3 text-white" fill="none" viewBox="0 0 12 12">
                                                <path d="M2 6l3 3 5-5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                                            </svg>
                                        </div>
                                    </div>
                                </td>

                                <!-- Role toggle cells -->
                                <td v-for="role in roles" :key="role" class="py-2.5 text-center">
                                    <div class="flex justify-center">
                                        <!-- Locked (always granted or super_admin_only) -->
                                        <template v-if="item.always_granted || item.super_admin_only">
                                            <div
                                                class="size-5 rounded border-2 flex items-center justify-center"
                                                :class="item.always_granted ? 'border-amber-400 bg-amber-50 dark:bg-amber-900/20' : 'border-muted-foreground/30 bg-muted/20'"
                                                :title="item.always_granted ? 'Always granted' : 'Super Admin only'"
                                            >
                                                <Lock v-if="item.always_granted" class="size-2.5 text-amber-500" />
                                                <ShieldCheck v-else class="size-2.5 text-muted-foreground/40" />
                                            </div>
                                        </template>

                                        <!-- Togglable checkbox -->
                                        <template v-else>
                                            <button
                                                type="button"
                                                class="size-5 rounded border-2 flex items-center justify-center transition-all focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-1"
                                                :class="[
                                                    item.granted[role]
                                                        ? 'border-primary bg-primary'
                                                        : 'border-muted-foreground/30 bg-background hover:border-primary/60',
                                                    toggling === `${role}:${item.key}` ? 'opacity-50 cursor-wait' : 'cursor-pointer',
                                                ]"
                                                :disabled="toggling === `${role}:${item.key}`"
                                                :aria-checked="item.granted[role]"
                                                role="checkbox"
                                                @click="toggle(role, item.key, item.granted[role])"
                                            >
                                                <svg v-if="item.granted[role]" class="size-3 text-white" fill="none" viewBox="0 0 12 12">
                                                    <path d="M2 6l3 3 5-5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                                                </svg>
                                            </button>
                                        </template>
                                    </div>
                                </td>
                            </tr>
                        </template>
                    </tbody>
                </table>
            </div>

            <Separator />

            <!-- Role summary cards -->
            <div class="grid gap-4 sm:grid-cols-3">
                <div v-for="role in roles" :key="role" class="rounded-lg border p-4">
                    <div class="mb-3 flex items-center gap-2">
                        <span class="font-semibold capitalize" :class="roleColors[role]">{{ roleLabels[role] ?? role }}</span>
                        <span class="text-xs text-muted-foreground">
                            {{
                                groups.flatMap(g => g.items).filter(i =>
                                    !i.super_admin_only && (i.always_granted || i.granted[role])
                                ).length
                            }} permissions
                        </span>
                    </div>
                    <div class="space-y-1">
                        <div
                            v-for="item in groups.flatMap(g => g.items).filter(i => !i.super_admin_only && (i.always_granted || i.granted[role]))"
                            :key="item.key"
                            class="flex items-center gap-1.5 text-xs"
                        >
                            <div class="size-1.5 rounded-full bg-primary" />
                            <span>{{ item.label }}</span>
                            <Lock v-if="item.always_granted" class="size-2.5 text-amber-400" />
                        </div>
                    </div>
                </div>
            </div>

        </SettingsLayout>
    </AppLayout>
</template>
