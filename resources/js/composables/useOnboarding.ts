import { computed, ref } from 'vue';
import { usePage } from '@inertiajs/vue3';
import type { OnboardingState } from '@/types';

/**
 * Composable that manages the onboarding tour state.
 *
 * State is authoritative from the server (shared via Inertia page props),
 * but we keep a local reactive copy that is synced after each API call
 * to avoid full-page reloads.
 */
export function useOnboarding() {
    const page = usePage();

    const serverOnboarding = computed(() => page.props.auth?.onboarding ?? null);

    // Local mutable copy — starts from Inertia shared props
    const localState = ref<OnboardingState>(
        serverOnboarding.value?.state ?? {
            completed: false,
            welcome_shown: false,
            completed_steps: [],
            current_step: null,
        },
    );

    const isFirstLogin = computed(() => serverOnboarding.value?.is_first_login ?? false);
    const isCompleted = computed(() => localState.value.completed);
    const welcomeShown = computed(() => localState.value.welcome_shown);
    const completedSteps = computed(() => localState.value.completed_steps);

    function hasCompletedStep(step: string): boolean {
        return completedSteps.value.includes(step);
    }

    async function patchState(payload: Partial<OnboardingState> & { add_step?: string }): Promise<void> {
        try {
            const response = await fetch('/api/onboarding/update', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-XSRF-TOKEN': getCsrfToken(),
                    Accept: 'application/json',
                },
                body: JSON.stringify(payload),
            });

            if (response.ok) {
                const data = await response.json();
                localState.value = data.state;
            }
        } catch {
            // Non-fatal — onboarding state sync is best-effort
        }
    }

    async function markWelcomeShown(): Promise<void> {
        localState.value.welcome_shown = true;
        await patchState({ welcome_shown: true });
    }

    async function markStepCompleted(step: string): Promise<void> {
        if (!completedSteps.value.includes(step)) {
            localState.value.completed_steps = [...completedSteps.value, step];
        }
        await patchState({ add_step: step });
    }

    async function markCompleted(): Promise<void> {
        localState.value.completed = true;
        await patchState({ completed: true });
    }

    async function setCurrentStep(step: string | null): Promise<void> {
        localState.value.current_step = step;
        await patchState({ current_step: step });
    }

    return {
        isFirstLogin,
        isCompleted,
        welcomeShown,
        completedSteps,
        localState,
        hasCompletedStep,
        markWelcomeShown,
        markStepCompleted,
        markCompleted,
        setCurrentStep,
    };
}

function getCsrfToken(): string {
    const match = document.cookie.match(/XSRF-TOKEN=([^;]+)/);
    return match ? decodeURIComponent(match[1]) : '';
}
