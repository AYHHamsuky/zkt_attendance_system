<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class OnboardingController extends Controller
{
    /** Return the current user's onboarding state. */
    public function status(Request $request): JsonResponse
    {
        $user = $request->user();
        $state = $user->onboarding_state ?? User::defaultOnboardingState();

        return response()->json([
            'is_first_login' => $user->isFirstLogin(),
            'state' => $state,
        ]);
    }

    /**
     * Update the current user's onboarding state.
     *
     * Accepted payload keys (all optional):
     *   - welcome_shown (bool)
     *   - completed (bool)
     *   - completed_steps (string[]) — replaces the whole array
     *   - add_step (string) — appends a single step
     *   - current_step (string|null)
     */
    public function update(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'welcome_shown' => 'sometimes|boolean',
            'completed' => 'sometimes|boolean',
            'completed_steps' => 'sometimes|array',
            'completed_steps.*' => 'string|max:100',
            'add_step' => 'sometimes|string|max:100',
            'current_step' => 'sometimes|nullable|string|max:100',
        ]);

        $user = $request->user();
        $state = $user->onboarding_state ?? User::defaultOnboardingState();

        if (isset($validated['welcome_shown'])) {
            $state['welcome_shown'] = $validated['welcome_shown'];
        }

        if (isset($validated['completed'])) {
            $state['completed'] = $validated['completed'];
        }

        if (isset($validated['completed_steps'])) {
            $state['completed_steps'] = $validated['completed_steps'];
        }

        if (isset($validated['add_step'])) {
            $steps = $state['completed_steps'] ?? [];
            if (! in_array($validated['add_step'], $steps)) {
                $steps[] = $validated['add_step'];
            }
            $state['completed_steps'] = $steps;
        }

        if (array_key_exists('current_step', $validated)) {
            $state['current_step'] = $validated['current_step'];
        }

        $user->update(['onboarding_state' => $state]);

        return response()->json(['state' => $state]);
    }
}
