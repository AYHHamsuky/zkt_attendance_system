import { driver } from 'driver.js';
import 'driver.js/dist/driver.css';
import { onMounted } from 'vue';
import { usePage } from '@inertiajs/vue3';
import { useOnboarding } from '@/composables/useOnboarding';
import { ALL_TOURS, type TourId } from '@/lib/onboarding-tours';

/**
 * Auto-trigger a module tour when the user visits a page for the first time.
 * Call this in the `<script setup>` of any page component.
 *
 * @param tourId     The tour to run (must be defined in onboarding-tours.ts)
 * @param delayMs    How long to wait after mount before starting (default 600ms)
 */
export function useModuleTour(tourId: TourId, delayMs = 600): void {
    // Both usePage() and useOnboarding() are called here — inside component setup() context ✓
    const page = usePage();
    const { hasCompletedStep, markStepCompleted } = useOnboarding();

    onMounted(() => {
        // Read welcome_shown directly from Inertia page props — always current after navigation.
        // This avoids cross-instance state isolation: useOnboarding() creates a new localState
        // per call, so reading from page.props is the only reliable cross-component source.
        const welcomeShown = page.props.auth?.onboarding?.state?.welcome_shown ?? false;
        if (!welcomeShown) return;

        // Don't re-run if already completed
        if (hasCompletedStep(tourId)) return;

        const tour = ALL_TOURS.find((t) => t.id === tourId);
        if (!tour || tour.steps.length === 0) return;

        // Role gate: only show if the tour targets this user's role (or everyone)
        const role = (page.props.auth?.user?.role as string) ?? 'user';
        if (tour.roles.length > 0 && !tour.roles.includes(role)) return;

        setTimeout(() => {
            // markStepCompleted is captured above in component context — safe to use in setTimeout ✓
            const driverObj = driver({
                showProgress: true,
                animate: true,
                smoothScroll: true,
                overlayColor: 'rgba(0,0,0,0.65)',
                progressText: 'Step {{current}} of {{total}}',
                nextBtnText: 'Next →',
                prevBtnText: '← Back',
                doneBtnText: 'Done',
                onDestroyStarted: async () => {
                    await markStepCompleted(tourId);
                    driverObj.destroy();
                },
            });

            driverObj.setSteps(tour.steps);
            driverObj.drive();
        }, delayMs);
    });
}
