<script setup lang="ts">
import { Link } from '@inertiajs/vue3';
import { home } from '@/routes';

defineProps<{
    title?: string;
    description?: string;
}>();
</script>

<template>
    <div class="flex min-h-svh">

        <!-- ── LEFT PANEL: KE Branding ── -->
        <aside class="relative hidden overflow-hidden lg:flex lg:w-[420px] xl:w-[480px] shrink-0 flex-col bg-green-900">
            <!-- Decorative blobs -->
            <div class="pointer-events-none absolute -top-32 -left-32 h-72 w-72 rounded-full bg-green-800/60" />
            <div class="pointer-events-none absolute top-1/3 -right-20 h-96 w-96 rounded-full bg-green-800/40" />
            <div class="pointer-events-none absolute -bottom-24 left-1/4 h-64 w-64 rounded-full bg-green-700/30" />
            <div class="pointer-events-none absolute bottom-1/4 -left-12 h-48 w-48 rounded-full bg-green-600/20" />

            <!-- Content -->
            <div class="relative z-10 flex flex-1 flex-col items-center justify-center px-12 py-12">
                <!-- Logo (white monochrome on dark bg) -->
                <Link :href="home()" class="mb-10 block">
                    <img
                        src="/logo.png"
                        alt="Kaduna Electric"
                        class="h-16 w-auto brightness-0 invert"
                    />
                </Link>

                <!-- Divider -->
                <div class="mb-8 h-px w-16 bg-green-600" />

                <!-- Headline -->
                <h1 class="text-center text-3xl font-bold leading-tight text-white">
                    Attendance &<br />Human Resources Information System
                </h1>
                <p class="mt-4 text-center text-sm leading-relaxed text-green-300">
                    Manage your workforce, track attendance,<br />and drive performance — all in one place.
                </p>

                <!-- Feature pills -->
                <div class="mt-10 flex flex-col gap-3 w-full max-w-xs">
                    <div class="flex items-center gap-3 rounded-xl bg-white/10 px-4 py-3">
                        <span class="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-green-600 text-white text-sm font-bold">✓</span>
                        <p class="text-sm text-white">ZKTeco Biometric Integration</p>
                    </div>
                    <div class="flex items-center gap-3 rounded-xl bg-white/10 px-4 py-3">
                        <span class="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-green-600 text-white text-sm font-bold">✓</span>
                        <p class="text-sm text-white">Full HR & Leave Management</p>
                    </div>
                    <div class="flex items-center gap-3 rounded-xl bg-white/10 px-4 py-3">
                        <span class="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-green-600 text-white text-sm font-bold">✓</span>
                        <p class="text-sm text-white">Performance Appraisal System</p>
                    </div>
                </div>
            </div>

            <!-- Footer -->
            <div class="relative z-10 pb-8 text-center">
                <p class="text-xs text-green-500">
                    © {{ new Date().getFullYear() }} Kaduna Electric Distribution Company
                </p>
            </div>
        </aside>

        <!-- ── RIGHT PANEL: Form ── -->
        <main class="flex flex-1 flex-col items-center justify-center bg-gray-50 px-6 py-10 dark:bg-gray-950">
            <!-- Mobile logo -->
            <div class="mb-8 flex flex-col items-center gap-3 lg:hidden">
                <Link :href="home()">
                    <img
                        src="/logo.png"
                        alt="Kaduna Electric"
                        class="h-12 w-auto dark:brightness-0 dark:invert"
                    />
                </Link>
            </div>

            <!-- Card -->
            <div class="w-full max-w-sm">
                <div class="rounded-2xl border border-gray-200 bg-white px-8 py-10 shadow-sm dark:border-gray-800 dark:bg-gray-900">
                    <!-- Header -->
                    <div class="mb-8 text-center">
                        <!-- Desktop: show logo above title inside card -->
                        <div class="mb-5 hidden lg:flex justify-center">
                            <div class="flex h-12 w-12 items-center justify-center rounded-xl bg-green-700">
                                <img
                                    src="/logo.png"
                                    alt="KE"
                                    class="h-7 w-auto brightness-0 invert"
                                />
                            </div>
                        </div>
                        <h1 class="text-xl font-bold tracking-tight text-gray-900 dark:text-white">
                            {{ title }}
                        </h1>
                        <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
                            {{ description }}
                        </p>
                    </div>

                    <slot />
                </div>

                <p class="mt-6 text-center text-xs text-gray-400 dark:text-gray-600">
                    Kaduna Electric Distribution Company · HRMIS
                </p>
            </div>
        </main>
    </div>
</template>
