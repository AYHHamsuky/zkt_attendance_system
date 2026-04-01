<script setup lang="ts">
import { driver } from 'driver.js';
import 'driver.js/dist/driver.css';
import { ref, onMounted } from 'vue';
import { usePage } from '@inertiajs/vue3';
import { useOnboarding } from '@/composables/useOnboarding';
import { toursForRole } from '@/lib/onboarding-tours';

const page = usePage();
const { isFirstLogin, welcomeShown, markWelcomeShown, markStepCompleted, markCompleted } = useOnboarding();

const visible = ref(false);
const role = (page.props.auth?.user?.role as string) ?? 'user';

// Session-level guard: prevents re-showing if the user dismissed it this session,
// even if the async API call hasn't persisted to the DB yet when the next page loads.
const SESSION_KEY = 'onboarding_welcome_dismissed';

onMounted(() => {
    if (sessionStorage.getItem(SESSION_KEY) === 'true') return;
    if (isFirstLogin.value || !welcomeShown.value) {
        visible.value = true;
    }
});

async function onSkip(): Promise<void> {
    sessionStorage.setItem(SESSION_KEY, 'true');
    visible.value = false;
    await markWelcomeShown();
    await markCompleted();
}

async function onStartTour(): Promise<void> {
    sessionStorage.setItem(SESSION_KEY, 'true');
    visible.value = false;
    await markWelcomeShown();
    runMainTour();
}

function runMainTour(): void {
    const tours = toursForRole(role);
    const mainTour = tours.find((t) => t.id === 'main');
    if (!mainTour) {
        return;
    }

    const driverObj = driver({
        showProgress: true,
        animate: true,
        overlayColor: 'rgba(0,0,0,0.65)',
        progressText: 'Step {{current}} of {{total}}',
        nextBtnText: 'Next →',
        prevBtnText: '← Back',
        doneBtnText: 'Done',
        onDestroyStarted: async () => {
            await markStepCompleted('main');
            await markCompleted();
            driverObj.destroy();
        },
    });

    driverObj.setSteps(mainTour.steps);
    driverObj.drive();
}
</script>

<template>
    <Transition name="fade">
        <div
            v-if="visible"
            class="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 backdrop-blur-sm"
            aria-modal="true"
            role="dialog"
            aria-labelledby="onboarding-title"
        >
            <div class="relative mx-4 w-full max-w-xl rounded-2xl bg-white p-8 shadow-2xl dark:bg-zinc-900">
                <!-- Icon -->
                <div class="mb-6 flex justify-center">
                    <div class="flex h-16 w-16 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900/40">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            class="h-8 w-8 text-blue-600 dark:text-blue-400"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            stroke-width="2"
                        >
                            <path stroke-linecap="round" stroke-linejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                        </svg>
                    </div>
                </div>

                <h2
                    id="onboarding-title"
                    class="mb-1 text-center text-2xl font-bold text-zinc-900 dark:text-zinc-50"
                >
                    Welcome to the Kaduna Electric HR Portal
                </h2>

                <p class="text-center text-sm font-medium text-blue-600 dark:text-blue-400">
                    Your all-in-one Human Resources Management System
                </p>

                <p class="mt-4 text-center text-sm text-zinc-600 dark:text-zinc-300 leading-relaxed">
                    This platform gives you access to everything you need as a Kaduna Electric employee —
                    leave applications, performance appraisals, staff records, contracts, transfers,
                    documents, and more — all in one secure, easy-to-use system.
                </p>

                <!-- Feature highlights -->
                <div class="mt-5 grid grid-cols-2 gap-2 text-xs sm:grid-cols-3">
                    <div class="flex items-center gap-1.5 rounded-lg bg-zinc-50 px-3 py-2 dark:bg-zinc-800">
                        <span class="text-blue-500">📅</span>
                        <span class="text-zinc-600 dark:text-zinc-300">Leave Management</span>
                    </div>
                    <div class="flex items-center gap-1.5 rounded-lg bg-zinc-50 px-3 py-2 dark:bg-zinc-800">
                        <span class="text-blue-500">⭐</span>
                        <span class="text-zinc-600 dark:text-zinc-300">Performance Appraisal</span>
                    </div>
                    <div class="flex items-center gap-1.5 rounded-lg bg-zinc-50 px-3 py-2 dark:bg-zinc-800">
                        <span class="text-blue-500">👥</span>
                        <span class="text-zinc-600 dark:text-zinc-300">Staff Nominal Roll</span>
                    </div>
                    <div class="flex items-center gap-1.5 rounded-lg bg-zinc-50 px-3 py-2 dark:bg-zinc-800">
                        <span class="text-blue-500">📄</span>
                        <span class="text-zinc-600 dark:text-zinc-300">Contracts & Docs</span>
                    </div>
                    <div class="flex items-center gap-1.5 rounded-lg bg-zinc-50 px-3 py-2 dark:bg-zinc-800">
                        <span class="text-blue-500">🕐</span>
                        <span class="text-zinc-600 dark:text-zinc-300">Attendance Records</span>
                    </div>
                    <div class="flex items-center gap-1.5 rounded-lg bg-zinc-50 px-3 py-2 dark:bg-zinc-800">
                        <span class="text-blue-500">↔️</span>
                        <span class="text-zinc-600 dark:text-zinc-300">Transfers & HR Actions</span>
                    </div>
                </div>

                <p class="mt-5 text-center text-sm text-zinc-500 dark:text-zinc-400">
                    Would you like a quick guided tour of the system?
                </p>

                <!-- Progress dots -->
                <div class="mt-4 flex justify-center gap-2">
                    <span class="h-2 w-6 rounded-full bg-blue-600"></span>
                    <span class="h-2 w-2 rounded-full bg-zinc-200 dark:bg-zinc-700"></span>
                    <span class="h-2 w-2 rounded-full bg-zinc-200 dark:bg-zinc-700"></span>
                </div>

                <!-- Actions -->
                <div class="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-center">
                    <button
                        type="button"
                        class="w-full rounded-lg bg-blue-600 px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 sm:w-auto"
                        @click="onStartTour"
                    >
                        Start Guided Tour
                    </button>
                    <button
                        type="button"
                        class="w-full rounded-lg border border-zinc-200 px-6 py-2.5 text-sm font-medium text-zinc-600 transition hover:bg-zinc-50 focus:outline-none focus:ring-2 focus:ring-zinc-400 focus:ring-offset-2 dark:border-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-800 sm:w-auto"
                        @click="onSkip"
                    >
                        Skip for Now
                    </button>
                </div>

                <p class="mt-3 text-center text-xs text-zinc-400 dark:text-zinc-500">
                    You can restart the tour at any time using the <strong>?</strong> button in the top-right corner.
                </p>
            </div>
        </div>
    </Transition>
</template>

<style scoped>
.fade-enter-active,
.fade-leave-active {
    transition:
        opacity 0.25s ease,
        transform 0.25s ease;
}
.fade-enter-from,
.fade-leave-to {
    opacity: 0;
    transform: scale(0.96);
}
</style>
