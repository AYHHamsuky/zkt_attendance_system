<script setup lang="ts">
import { Head, Link } from '@inertiajs/vue3';
import { dashboard, login, register } from '@/routes';
import { Fingerprint, Clock, Users, ShieldCheck, ArrowRight, Server } from 'lucide-vue-next';
import { Button } from '@/components/ui/button';

withDefaults(
    defineProps<{
        canRegister: boolean;
    }>(),
    {
        canRegister: true,
    },
);
</script>

<template>
    <Head title="ZKTeco Attendance System" />
    <div class="flex min-h-screen flex-col bg-background">
        <!-- Header -->
        <header class="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div class="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
                <div class="flex items-center gap-3">
                    <div class="flex h-9 w-9 items-center justify-center rounded-lg bg-primary">
                        <Fingerprint class="h-5 w-5 text-primary-foreground" />
                    </div>
                    <span class="text-lg font-semibold">ZKTeco Attendance</span>
                </div>
                <nav class="flex items-center gap-3">
                    <Link
                        v-if="$page.props.auth.user"
                        :href="dashboard()"
                    >
                        <Button variant="default" size="sm">
                            Dashboard
                            <ArrowRight class="ml-1 h-4 w-4" />
                        </Button>
                    </Link>
                    <template v-else>
                        <Link :href="login()">
                            <Button variant="ghost" size="sm">Log in</Button>
                        </Link>
                        <Link v-if="canRegister" :href="register()">
                            <Button variant="default" size="sm">Get Started</Button>
                        </Link>
                    </template>
                </nav>
            </div>
        </header>

        <!-- Hero -->
        <section class="mx-auto flex max-w-7xl flex-1 flex-col items-center justify-center px-4 py-16 text-center sm:px-6 lg:px-8">
            <div class="mb-6 inline-flex items-center gap-2 rounded-full border bg-muted/50 px-4 py-1.5 text-sm text-muted-foreground">
                <Server class="h-3.5 w-3.5" />
                Biometric Device Management
            </div>
            <h1 class="max-w-3xl text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
                Smart Attendance <br />
                <span class="text-primary">Management System</span>
            </h1>
            <p class="mt-6 max-w-2xl text-lg text-muted-foreground">
                Connect and manage your ZKTeco IN01 biometric devices. Sync employees, track attendance in real-time, and generate comprehensive reports — all from one dashboard.
            </p>
            <div class="mt-10 flex items-center gap-4">
                <Link v-if="$page.props.auth.user" :href="dashboard()">
                    <Button size="lg">
                        Go to Dashboard
                        <ArrowRight class="ml-2 h-4 w-4" />
                    </Button>
                </Link>
                <template v-else>
                    <Link :href="login()">
                        <Button size="lg">
                            Get Started
                            <ArrowRight class="ml-2 h-4 w-4" />
                        </Button>
                    </Link>
                    <Link v-if="canRegister" :href="register()">
                        <Button variant="outline" size="lg">Create Account</Button>
                    </Link>
                </template>
            </div>
        </section>

        <!-- Features -->
        <section class="border-t bg-muted/30 py-16">
            <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div class="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
                    <div class="flex flex-col items-center rounded-xl border bg-background p-6 text-center shadow-sm">
                        <div class="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                            <Fingerprint class="h-6 w-6 text-primary" />
                        </div>
                        <h3 class="mb-2 font-semibold">Biometric Sync</h3>
                        <p class="text-sm text-muted-foreground">Sync fingerprints & user data directly from ZKTeco IN01 devices</p>
                    </div>
                    <div class="flex flex-col items-center rounded-xl border bg-background p-6 text-center shadow-sm">
                        <div class="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                            <Clock class="h-6 w-6 text-primary" />
                        </div>
                        <h3 class="mb-2 font-semibold">Real-time Tracking</h3>
                        <p class="text-sm text-muted-foreground">Monitor check-in & check-out events as they happen in real-time</p>
                    </div>
                    <div class="flex flex-col items-center rounded-xl border bg-background p-6 text-center shadow-sm">
                        <div class="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                            <Users class="h-6 w-6 text-primary" />
                        </div>
                        <h3 class="mb-2 font-semibold">Employee Management</h3>
                        <p class="text-sm text-muted-foreground">Manage employees, departments, and access roles with ease</p>
                    </div>
                    <div class="flex flex-col items-center rounded-xl border bg-background p-6 text-center shadow-sm">
                        <div class="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                            <ShieldCheck class="h-6 w-6 text-primary" />
                        </div>
                        <h3 class="mb-2 font-semibold">Secure & Reliable</h3>
                        <p class="text-sm text-muted-foreground">Enterprise-grade security with encrypted device communication</p>
                    </div>
                </div>
            </div>
        </section>

        <!-- Footer -->
        <footer class="border-t py-6">
            <div class="mx-auto max-w-7xl px-4 text-center text-sm text-muted-foreground sm:px-6 lg:px-8">
                &copy; {{ new Date().getFullYear() }} ZKTeco Attendance System. All rights reserved.
            </div>
        </footer>
    </div>
</template>
