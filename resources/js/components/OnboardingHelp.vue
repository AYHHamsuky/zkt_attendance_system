<script setup lang="ts">
import { driver } from 'driver.js';
import 'driver.js/dist/driver.css';
import { ref } from 'vue';
import { router, usePage } from '@inertiajs/vue3';
import { useOnboarding } from '@/composables/useOnboarding';
import { toursForRole, ALL_TOURS, type RoleTour, type TourId } from '@/lib/onboarding-tours';

const page = usePage();
const { markStepCompleted } = useOnboarding();

const menuOpen = ref(false);
const role = (page.props.auth?.user?.role as string) ?? 'user';
const availableTours = toursForRole(role);

/** Tours for regular employees (no role gate) */
const employeeTours = availableTours.filter((t) => t.id !== 'main' && t.roles.length === 0);

/** Tours only visible to HR/admin */
const hrTours = availableTours.filter((t) => t.roles.length > 0);

function toggleMenu(): void {
    menuOpen.value = !menuOpen.value;
}

function closeMenu(): void {
    menuOpen.value = false;
}

function launchTour(tour: RoleTour): void {
    // If we're not on the right page, navigate there first then launch
    const currentPath = window.location.pathname;
    if (tour.path && currentPath !== tour.path) {
        closeMenu();
        router.visit(tour.path, {
            onSuccess: () => setTimeout(() => runTour(tour), 700),
        });
        return;
    }

    closeMenu();
    runTour(tour);
}

function runTour(tour: RoleTour): void {
    if (tour.steps.length === 0) return;

    const driverObj = driver({
        showProgress: true,
        animate: true,
        overlayColor: 'rgba(0,0,0,0.65)',
        progressText: 'Step {{current}} of {{total}}',
        nextBtnText: 'Next →',
        prevBtnText: '← Back',
        doneBtnText: 'Done',
        onDestroyStarted: async () => {
            await markStepCompleted(tour.id);
            driverObj.destroy();
        },
    });

    driverObj.setSteps(tour.steps);
    driverObj.drive();
}

async function restartFullTour(): Promise<void> {
    closeMenu();
    const mainTour = availableTours.find((t) => t.id === 'main');
    if (mainTour) {
        runTour(mainTour);
    }
}

const tourIcons: Record<TourId, string> = {
    main: '🗺️',
    leave_overview: '📅',
    leave_apply: '✍️',
    performance_mine: '⭐',
    performance_review: '📋',
    profile_update: '👤',
    nominal_roll: '👥',
    hr_leave_management: '🗂️',
    hr_performance_management: '📊',
    hr_contracts: '📄',
    hr_documents: '🗂️',
};
</script>

<template>
    <div class="relative" data-tour="help-button">
        <!-- ? trigger button -->
        <button
            type="button"
            class="flex h-8 w-8 items-center justify-center rounded-full border border-zinc-200 bg-white text-zinc-600 transition hover:bg-zinc-50 hover:text-zinc-900 focus:outline-none focus:ring-2 focus:ring-zinc-400 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-700 dark:hover:text-zinc-100"
            title="Help & Tutorials"
            aria-label="Help and tutorials"
            @click="toggleMenu"
        >
            <span class="text-sm font-bold leading-none">?</span>
        </button>

        <!-- Dropdown -->
        <Transition name="dropdown">
            <div
                v-if="menuOpen"
                class="absolute right-0 top-10 z-50 w-72 rounded-xl border border-zinc-200 bg-white py-2 shadow-xl dark:border-zinc-700 dark:bg-zinc-900"
                @click.stop
            >
                <!-- Header -->
                <div class="border-b border-zinc-100 px-4 pb-2 dark:border-zinc-800">
                    <p class="text-xs font-semibold uppercase tracking-wide text-zinc-400 dark:text-zinc-500">
                        Help & Tutorials
                    </p>
                </div>

                <!-- Restart full tour -->
                <button
                    type="button"
                    class="flex w-full items-center gap-2.5 px-4 py-2.5 text-left text-sm text-zinc-700 transition hover:bg-zinc-50 dark:text-zinc-300 dark:hover:bg-zinc-800"
                    @click="restartFullTour"
                >
                    <span class="text-base leading-none">🗺️</span>
                    <div>
                        <p class="font-medium">System Overview</p>
                        <p class="text-xs text-zinc-400">Restart the full navigation tour</p>
                    </div>
                </button>

                <div class="my-1 border-t border-zinc-100 dark:border-zinc-800"></div>

                <!-- Employee tours -->
                <p class="px-4 pb-1 pt-1.5 text-[10px] font-semibold uppercase tracking-wider text-zinc-400 dark:text-zinc-500">
                    Your Modules
                </p>

                <button
                    v-for="tour in employeeTours"
                    :key="tour.id"
                    type="button"
                    class="flex w-full items-start gap-2.5 px-4 py-2 text-left text-sm text-zinc-700 transition hover:bg-zinc-50 dark:text-zinc-300 dark:hover:bg-zinc-800"
                    @click="launchTour(tour)"
                >
                    <span class="mt-0.5 text-base leading-none">{{ tourIcons[tour.id] ?? '▶️' }}</span>
                    <div>
                        <p class="font-medium leading-snug">{{ tour.label }}</p>
                        <p class="text-xs text-zinc-400 leading-snug">{{ tour.description }}</p>
                    </div>
                </button>

                <!-- HR / Admin tours (only shown to relevant roles) -->
                <template v-if="hrTours.length > 0">
                    <div class="my-1 border-t border-zinc-100 dark:border-zinc-800"></div>

                    <p class="px-4 pb-1 pt-1.5 text-[10px] font-semibold uppercase tracking-wider text-zinc-400 dark:text-zinc-500">
                        HR Management
                    </p>

                    <button
                        v-for="tour in hrTours"
                        :key="tour.id"
                        type="button"
                        class="flex w-full items-start gap-2.5 px-4 py-2 text-left text-sm text-zinc-700 transition hover:bg-zinc-50 dark:text-zinc-300 dark:hover:bg-zinc-800"
                        @click="launchTour(tour)"
                    >
                        <span class="mt-0.5 text-base leading-none">{{ tourIcons[tour.id] ?? '▶️' }}</span>
                        <div>
                            <p class="font-medium leading-snug">{{ tour.label }}</p>
                            <p class="text-xs text-zinc-400 leading-snug">{{ tour.description }}</p>
                        </div>
                    </button>
                </template>

                <!-- Footer note -->
                <div class="border-t border-zinc-100 px-4 pt-2 pb-1 dark:border-zinc-800">
                    <p class="text-[10px] text-zinc-400 dark:text-zinc-500">
                        Tutorials navigate to the relevant page automatically.
                    </p>
                </div>
            </div>
        </Transition>

        <!-- Click-outside -->
        <div v-if="menuOpen" class="fixed inset-0 z-40" @click="closeMenu"></div>
    </div>
</template>

<style scoped>
.dropdown-enter-active,
.dropdown-leave-active {
    transition:
        opacity 0.15s ease,
        transform 0.15s ease;
}
.dropdown-enter-from,
.dropdown-leave-to {
    opacity: 0;
    transform: translateY(-6px) scale(0.97);
}
</style>
