<script setup lang="ts">
import { Link, usePage } from '@inertiajs/vue3';
import Heading from '@/components/Heading.vue';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { useCurrentUrl } from '@/composables/useCurrentUrl';
import { toUrl } from '@/lib/utils';
import { type NavItem } from '@/types';
import { edit as editAppearance } from '@/routes/appearance';
import { edit as editProfile } from '@/routes/profile';
import { show } from '@/routes/two-factor';
import { edit as editPassword } from '@/routes/user-password';
import { computed } from 'vue';

const page = usePage<{ auth: { user: { role: string }; permissions: string[] } }>();
const isAdmin = computed(() => ['admin', 'super_admin'].includes(page.props.auth?.user?.role));
const isSuperAdmin = computed(() => page.props.auth?.user?.role === 'super_admin');

const personalNavItems: NavItem[] = [
    { title: 'Profile', href: editProfile() },
    { title: 'Password', href: editPassword() },
    { title: 'Two-Factor Auth', href: show() },
    { title: 'Appearance', href: editAppearance() },
];

const { isCurrentUrl } = useCurrentUrl();
</script>

<template>
    <div class="px-4 py-6">
        <Heading title="Settings" description="Manage your profile and account settings" />

        <div class="flex flex-col lg:flex-row lg:space-x-12">
            <aside class="w-full max-w-xl lg:w-52" data-tour="settings-nav">
                <nav class="flex flex-col space-y-1 space-x-0" aria-label="Settings">
                    <Button
                        v-for="item in personalNavItems"
                        :key="toUrl(item.href)"
                        variant="ghost"
                        :class="['w-full justify-start', { 'bg-muted': isCurrentUrl(item.href) }]"
                        as-child
                    >
                        <Link :href="item.href">
                            <component :is="item.icon" class="h-4 w-4" />
                            {{ item.title }}
                        </Link>
                    </Button>

                    <template v-if="isAdmin">
                        <div class="px-2 pb-1 pt-4">
                            <p class="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Administration</p>
                        </div>
                        <Button
                            variant="ghost"
                            :class="['w-full justify-start', { 'bg-muted': isCurrentUrl('/settings/users') }]"
                            as-child
                        >
                            <Link href="/settings/users">Users</Link>
                        </Button>
                        <Button
                            v-if="isSuperAdmin"
                            variant="ghost"
                            :class="['w-full justify-start', { 'bg-muted': isCurrentUrl('/settings/access') }]"
                            as-child
                        >
                            <Link href="/settings/access">Access Control</Link>
                        </Button>
                    </template>
                </nav>
            </aside>

            <Separator class="my-6 lg:hidden" />

            <div class="flex-1 md:max-w-2xl">
                <section class="max-w-xl space-y-12">
                    <slot />
                </section>
            </div>
        </div>
    </div>
</template>
