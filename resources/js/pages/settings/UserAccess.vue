<script setup lang="ts">
import { Head, router, usePage } from '@inertiajs/vue3';
import AppLayout from '@/layouts/AppLayout.vue';
import SettingsLayout from '@/layouts/settings/Layout.vue';
import Heading from '@/components/Heading.vue';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Lock, ShieldCheck, UserCircle, Search } from 'lucide-vue-next';
import { ref, computed } from 'vue';
import { type BreadcrumbItem } from '@/types';
import { index as userAccessIndex, toggle as toggleRoute } from '@/actions/App/Http/Controllers/Settings/UserAccessController';

interface TargetUser {
    id: number;
    name: string;
    email: string;
    role: string;
}

interface PermissionItem {
    serial: number;
    key: string;
    label: string;
    module: string;
    always_granted: boolean;
    super_admin_only: boolean;
    locked: boolean;
    from_role: boolean;
    source: 'always' | 'super_admin_only' | 'role' | 'custom_grant' | 'custom_revoke' | 'none';
    granted: boolean;
}

const props = defineProps<{
    targetUser: TargetUser;
    items: PermissionItem[];
}>();

const page = usePage<{ auth: { user: { role: string } } }>();
const viewerRole = computed(() => page.props.auth?.user?.role ?? '');
const isSuperAdmin = computed(() => viewerRole.value === 'super_admin');
// Both admin and super_admin can toggle (locked items are still non-interactive)
const canManageAccess = computed(() => viewerRole.value === 'admin' || viewerRole.value === 'super_admin');

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Settings', href: '/settings/profile' },
    { title: 'Users', href: '/settings/users' },
    { title: props.targetUser.name },
    { title: 'Access Rights' },
];

// ── Filters ────────────────────────────────────────────────────────────────
const searchQuery = ref('');
const moduleFilter = ref('_all');

const modules = computed(() => {
    const unique = [...new Set(props.items.map(i => i.module))];
    return unique;
});

const filteredItems = computed(() => {
    const q = searchQuery.value.toLowerCase();
    return props.items.filter(item => {
        const matchSearch = !q || item.label.toLowerCase().includes(q) || item.key.toLowerCase().includes(q);
        const matchModule = moduleFilter.value === '_all' || item.module === moduleFilter.value;
        return matchSearch && matchModule;
    });
});

// ── Toggle ─────────────────────────────────────────────────────────────────
const toggling = ref<string | null>(null);

function toggle(item: PermissionItem) {
    if (!canManageAccess.value || item.locked) return;
    if (toggling.value === item.key) return;
    toggling.value = item.key;

    router.post(toggleRoute(props.targetUser.id).url, {
        permission: item.key,
        granted: !item.granted,
    }, {
        preserveState: false,
        onFinish: () => { toggling.value = null; },
    });
}

// ── Role badge ─────────────────────────────────────────────────────────────
const roleColors: Record<string, string> = {
    super_admin: 'text-amber-600 dark:text-amber-400',
    admin: 'text-red-600 dark:text-red-400',
    hr: 'text-blue-600 dark:text-blue-400',
    user: 'text-slate-600 dark:text-slate-400',
};
const roleLabels: Record<string, string> = {
    super_admin: 'Super Admin',
    admin: 'Admin',
    hr: 'HR',
    user: 'User',
};

// ── Source label/color ─────────────────────────────────────────────────────
const sourceConfig: Record<string, { label: string; class: string }> = {
    always:          { label: 'Always',       class: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400' },
    super_admin_only: { label: 'SA Only',      class: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400' },
    role:            { label: 'Role',          class: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' },
    custom_grant:    { label: 'Custom Grant',  class: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400' },
    custom_revoke:   { label: 'Custom Revoke', class: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400' },
    none:            { label: 'Not Granted',   class: 'bg-muted text-muted-foreground' },
};

// Counts
const grantedCount = computed(() => props.items.filter(i => i.granted).length);
const customCount = computed(() => props.items.filter(i => i.source === 'custom_grant' || i.source === 'custom_revoke').length);
</script>

<template>
    <Head :title="`Access Rights — ${targetUser.name}`" />
    <AppLayout :breadcrumbs="breadcrumbs">
        <SettingsLayout>
            <!-- User info header -->
            <div class="flex items-start gap-4 rounded-lg border bg-muted/30 p-4">
                <div
                    class="flex size-12 shrink-0 items-center justify-center rounded-full text-sm font-bold text-white"
                    :class="targetUser.role === 'super_admin' ? 'bg-amber-500' : targetUser.role === 'admin' ? 'bg-red-500' : targetUser.role === 'hr' ? 'bg-blue-500' : 'bg-slate-400'"
                >
                    {{ targetUser.name.split(' ').slice(0, 2).map((w: string) => w[0]).join('').toUpperCase() }}
                </div>
                <div class="flex-1 min-w-0">
                    <div class="flex flex-wrap items-center gap-2">
                        <h2 class="text-base font-semibold">{{ targetUser.name }}</h2>
                        <Badge
                            :class="['capitalize text-xs', roleColors[targetUser.role]]"
                            variant="outline"
                        >
                            {{ roleLabels[targetUser.role] ?? targetUser.role }}
                        </Badge>
                    </div>
                    <p class="mt-0.5 text-sm text-muted-foreground">{{ targetUser.email }}</p>
                    <div class="mt-2 flex flex-wrap gap-3 text-xs text-muted-foreground">
                        <span><strong class="text-foreground">{{ grantedCount }}</strong> permissions granted</span>
                        <span v-if="customCount > 0">
                            · <strong class="text-blue-600 dark:text-blue-400">{{ customCount }}</strong> individual override(s)
                        </span>
                    </div>
                </div>
                <UserCircle class="size-5 shrink-0 text-muted-foreground/40" />
            </div>

            <Heading
                variant="small"
                title="Access Rights"
                description="Permissions this user has. Inherited from their role, or customised individually."
            />

            <!-- Legend -->
            <div class="flex flex-wrap gap-3 text-xs">
                <div v-for="(cfg, key) in sourceConfig" :key="key" class="flex items-center gap-1.5">
                    <span class="rounded px-1.5 py-0.5 font-medium" :class="cfg.class">{{ cfg.label }}</span>
                </div>
                <div class="flex items-center gap-1.5">
                    <Lock class="size-3.5 text-amber-500" />
                    <span class="text-muted-foreground">Locked — cannot be changed</span>
                </div>
            </div>

            <Separator />

            <!-- Filters -->
            <div class="flex flex-wrap items-center gap-2">
                <div class="relative flex-1 min-w-44">
                    <Search class="absolute left-2.5 top-2.5 size-3.5 text-muted-foreground" />
                    <Input v-model="searchQuery" placeholder="Search permissions…" class="h-8 pl-8 text-sm" />
                </div>
                <Select :model-value="moduleFilter" @update:model-value="v => moduleFilter = String(v)">
                    <SelectTrigger class="h-8 w-44 text-sm">
                        <SelectValue placeholder="All Modules" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="_all">All Modules</SelectItem>
                        <SelectItem v-for="mod in modules" :key="mod" :value="mod">{{ mod }}</SelectItem>
                    </SelectContent>
                </Select>
                <span class="text-xs text-muted-foreground ml-auto">{{ filteredItems.length }} permission(s)</span>
            </div>

            <!-- Odoo-style Access Rights table -->
            <div class="overflow-x-auto rounded-md border">
                <table class="w-full text-sm">
                    <thead class="border-b bg-muted/40 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                        <tr>
                            <th class="w-10 px-3 py-2.5 text-center">#</th>
                            <th class="px-3 py-2.5 text-left">Name</th>
                            <th class="hidden px-3 py-2.5 text-left md:table-cell">Module</th>
                            <th class="hidden px-3 py-2.5 text-left sm:table-cell">Source</th>
                            <th class="w-20 px-3 py-2.5 text-center">Access</th>
                        </tr>
                    </thead>
                    <tbody class="divide-y">
                        <tr
                            v-for="item in filteredItems"
                            :key="item.key"
                            class="transition-colors hover:bg-muted/30"
                            :class="item.source === 'custom_grant' ? 'bg-blue-50/40 dark:bg-blue-900/10' : item.source === 'custom_revoke' ? 'bg-red-50/40 dark:bg-red-900/10' : ''"
                        >
                            <!-- S/N -->
                            <td class="px-3 py-2.5 text-center text-xs text-muted-foreground">{{ item.serial }}</td>

                            <!-- Name -->
                            <td class="px-3 py-2.5">
                                <div class="flex items-center gap-2">
                                    <span class="font-medium">{{ item.label }}</span>
                                    <Lock v-if="item.always_granted" class="size-3 shrink-0 text-amber-500" title="Always granted" />
                                    <ShieldCheck v-if="item.super_admin_only" class="size-3 shrink-0 text-purple-500" title="Super Admin only" />
                                </div>
                                <p class="mt-0.5 font-mono text-[10px] text-muted-foreground/60">{{ item.key }}</p>
                            </td>

                            <!-- Module -->
                            <td class="hidden px-3 py-2.5 md:table-cell">
                                <span class="text-xs text-muted-foreground">{{ item.module }}</span>
                            </td>

                            <!-- Source badge -->
                            <td class="hidden px-3 py-2.5 sm:table-cell">
                                <span
                                    class="inline-block rounded px-1.5 py-0.5 text-[10px] font-medium"
                                    :class="sourceConfig[item.source]?.class ?? ''"
                                >
                                    {{ sourceConfig[item.source]?.label ?? item.source }}
                                </span>
                            </td>

                            <!-- Access toggle -->
                            <td class="px-3 py-2.5 text-center">
                                <div class="flex justify-center">
                                    <!-- Locked cell -->
                                    <template v-if="item.locked">
                                        <div
                                            class="size-5 rounded border-2 flex items-center justify-center"
                                            :class="item.granted ? 'border-primary bg-primary' : 'border-muted-foreground/30 bg-muted/20'"
                                            title="Locked"
                                        >
                                            <svg v-if="item.granted" class="size-3 text-white" fill="none" viewBox="0 0 12 12">
                                                <path d="M2 6l3 3 5-5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                                            </svg>
                                            <Lock v-else class="size-2.5 text-muted-foreground/40" />
                                        </div>
                                    </template>

                                    <!-- Togglable (super admin only) -->
                                    <template v-else>
                                        <button
                                            type="button"
                                            class="size-5 rounded border-2 flex items-center justify-center transition-all focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-1"
                                            :class="[
                                                item.granted
                                                    ? 'border-primary bg-primary'
                                                    : 'border-muted-foreground/30 bg-background',
                                                !canManageAccess
                                                    ? 'cursor-not-allowed opacity-60'
                                                    : toggling === item.key
                                                        ? 'cursor-wait opacity-50'
                                                        : 'cursor-pointer hover:border-primary/60',
                                            ]"
                                            :disabled="!canManageAccess || toggling === item.key"
                                            :aria-checked="item.granted"
                                            role="checkbox"
                                            :title="canManageAccess ? (item.granted ? 'Click to revoke' : 'Click to grant') : 'You do not have permission to change access rights'"
                                            @click="toggle(item)"
                                        >
                                            <svg v-if="item.granted" class="size-3 text-white" fill="none" viewBox="0 0 12 12">
                                                <path d="M2 6l3 3 5-5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                                            </svg>
                                        </button>
                                    </template>
                                </div>
                            </td>
                        </tr>

                        <tr v-if="filteredItems.length === 0">
                            <td colspan="5" class="py-12 text-center text-sm text-muted-foreground">
                                No permissions match your filter.
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>

        </SettingsLayout>
    </AppLayout>
</template>
