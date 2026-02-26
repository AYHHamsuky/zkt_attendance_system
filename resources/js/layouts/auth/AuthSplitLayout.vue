<script setup lang="ts">
import { Link } from '@inertiajs/vue3';
import { Fingerprint, Clock, Users, ShieldCheck } from 'lucide-vue-next';
import { home } from '@/routes';

defineProps<{
    title?: string;
    description?: string;
}>();
</script>

<template>
    <div
        class="relative grid h-dvh flex-col items-center justify-center px-8 sm:px-0 lg:max-w-none lg:grid-cols-2 lg:px-0"
    >
        <div
            class="relative hidden h-full flex-col bg-muted p-10 text-white lg:flex dark:border-r"
        >
            <div class="absolute inset-0 bg-zinc-900" />
            <Link
                :href="home()"
                class="relative z-20 flex items-center text-lg font-medium"
            >
                <div class="mr-3 flex h-9 w-9 items-center justify-center rounded-lg bg-primary">
                    <Fingerprint class="h-5 w-5 text-primary-foreground" />
                </div>
                Kaduna Electric
            </Link>
            <div class="relative z-20 mt-auto">
                <div class="mb-8 space-y-4">
                    <div class="flex items-center gap-3">
                        <Clock class="h-5 w-5 text-primary" />
                        <span class="text-sm text-zinc-300">Real-time attendance tracking</span>
                    </div>
                    <div class="flex items-center gap-3">
                        <Users class="h-5 w-5 text-primary" />
                        <span class="text-sm text-zinc-300">Employee & device management</span>
                    </div>
                    <div class="flex items-center gap-3">
                        <ShieldCheck class="h-5 w-5 text-primary" />
                        <span class="text-sm text-zinc-300">Secure biometric integration</span>
                    </div>
                </div>
                <blockquote class="space-y-2">
                    <p class="text-lg">&ldquo;Streamline your workforce attendance with biometric precision.&rdquo;</p>
                </blockquote>
            </div>
        </div>
        <div class="lg:p-8">
            <div
                class="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]"
            >
                <div class="flex flex-col space-y-2 text-center">
                    <h1 class="text-xl font-medium tracking-tight" v-if="title">
                        {{ title }}
                    </h1>
                    <p class="text-sm text-muted-foreground" v-if="description">
                        {{ description }}
                    </p>
                </div>
                <slot />
            </div>
        </div>
    </div>
</template>
