export type User = {
    id: number;
    name: string;
    email: string;
    role: string;
    avatar?: string;
    email_verified_at: string | null;
    created_at: string;
    updated_at: string;
    [key: string]: unknown;
};

export type OnboardingState = {
    completed: boolean;
    welcome_shown: boolean;
    completed_steps: string[];
    current_step: string | null;
};

export type Auth = {
    user: User;
    permissions: string[];
    onboarding: {
        is_first_login: boolean;
        state: OnboardingState;
    } | null;
};

export type TwoFactorConfigContent = {
    title: string;
    description: string;
    buttonText: string;
};
