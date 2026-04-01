<script setup lang="ts">
import { Head } from '@inertiajs/vue3';
import AppLayout from '@/layouts/AppLayout.vue';
import { type BreadcrumbItem } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ClipboardList, ChevronRight, Clock, CheckCircle, Star } from 'lucide-vue-next';
import { useModuleTour } from '@/composables/useModuleTour';

useModuleTour('performance_mine');

interface Review {
    id: number;
    status: string;
    overall_score: string | null;
    notify_sent_at: string | null;
    submitted_at: string | null;
    acknowledged_at: string | null;
    cycle: { id: number; name: string; year: number; period_type: string };
    reviewer: { id: number; name: string };
}

const props = defineProps<{
    reviews: Review[];
    hasEmployee: boolean;
    employee?: { id: number; name: string; department: string | null; position: string | null };
}>();

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'HRIS', href: '/hr' },
    { title: 'My Appraisals' },
];

const statusVariant: Record<string, 'default' | 'secondary' | 'outline' | 'destructive'> = {
    pending: 'secondary',
    submitted: 'default',
    acknowledged: 'outline',
    finalized: 'default',
};

const statusLabel: Record<string, string> = {
    pending: 'Awaiting your self-appraisal',
    submitted: 'Submitted — awaiting manager review',
    acknowledged: 'Acknowledged by manager',
    finalized: 'Finalized',
};

const statusIcon: Record<string, string> = {
    pending: 'clock',
    submitted: 'chevron',
    acknowledged: 'check',
    finalized: 'star',
};

function formatDate(d: string | null): string {
    if (!d) return '';
    return new Date(d).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
}
</script>

<template>
    <Head title="My Appraisals" />
    <AppLayout :breadcrumbs="breadcrumbs">
        <div class="flex h-full flex-1 flex-col gap-6 p-4 md:p-6">

            <!-- Header -->
            <div data-tour="perf-mine-header">
                <h2 class="text-2xl font-bold">My Performance Appraisals</h2>
                <p v-if="employee" class="text-muted-foreground">
                    {{ employee.name }} · {{ employee.position ?? employee.department }}
                </p>
            </div>

            <!-- No employee record linked -->
            <Card v-if="!hasEmployee">
                <CardContent class="flex flex-col items-center gap-3 py-16">
                    <ClipboardList class="size-12 text-muted-foreground" />
                    <p class="text-lg font-medium">No employee record linked to your account</p>
                    <p class="text-sm text-muted-foreground text-center max-w-sm">
                        Your user account email does not match any employee record. Please contact HR to have your appraisal assigned.
                    </p>
                </CardContent>
            </Card>

            <!-- No appraisals yet -->
            <Card v-else-if="reviews.length === 0">
                <CardContent class="flex flex-col items-center gap-3 py-16">
                    <ClipboardList class="size-12 text-muted-foreground" />
                    <p class="text-lg font-medium">No appraisals assigned yet</p>
                    <p class="text-sm text-muted-foreground">
                        HR will assign your performance appraisal when the next cycle begins.
                    </p>
                </CardContent>
            </Card>

            <!-- Appraisal cards -->
            <div v-else class="grid gap-4 md:grid-cols-2 xl:grid-cols-3" data-tour="perf-reviews-grid">
                <Card
                    v-for="review in reviews"
                    :key="review.id"
                    class="flex flex-col hover:shadow-md transition-shadow"
                >
                    <CardHeader class="pb-2">
                        <div class="flex items-start justify-between gap-2">
                            <div>
                                <CardTitle class="text-base">{{ review.cycle.name }}</CardTitle>
                                <p class="text-xs text-muted-foreground capitalize">
                                    {{ review.cycle.period_type }} · {{ review.cycle.year }}
                                </p>
                            </div>
                            <Badge :variant="statusVariant[review.status] ?? 'secondary'" class="capitalize text-xs shrink-0">
                                {{ review.status }}
                            </Badge>
                        </div>
                    </CardHeader>
                    <CardContent class="flex flex-col flex-1 gap-3">
                        <p class="text-sm text-muted-foreground">
                            {{ statusLabel[review.status] ?? review.status }}
                        </p>

                        <!-- Progress steps -->
                        <div class="flex items-center gap-1 text-xs text-muted-foreground">
                            <div class="flex items-center gap-1" :class="review.status !== 'pending' ? 'text-green-600' : 'text-primary font-medium'">
                                <CheckCircle v-if="review.status !== 'pending'" class="size-3.5 text-green-600" />
                                <Clock v-else class="size-3.5" />
                                Self
                            </div>
                            <ChevronRight class="size-3" />
                            <div class="flex items-center gap-1" :class="['acknowledged', 'finalized'].includes(review.status) ? 'text-green-600' : review.status === 'submitted' ? 'text-primary font-medium' : ''">
                                <CheckCircle v-if="['acknowledged', 'finalized'].includes(review.status)" class="size-3.5 text-green-600" />
                                <Clock v-else-if="review.status === 'submitted'" class="size-3.5" />
                                Manager
                            </div>
                            <ChevronRight class="size-3" />
                            <div class="flex items-center gap-1" :class="review.status === 'finalized' ? 'text-green-600 font-medium' : ''">
                                <CheckCircle v-if="review.status === 'finalized'" class="size-3.5 text-green-600" />
                                Final
                            </div>
                        </div>

                        <!-- Score (if available) -->
                        <div v-if="review.overall_score" class="flex items-center gap-2">
                            <Star class="size-4 text-amber-500" />
                            <span class="font-semibold">{{ review.overall_score }}%</span>
                            <span class="text-xs text-muted-foreground">overall score</span>
                        </div>

                        <!-- Meta -->
                        <div class="text-xs text-muted-foreground space-y-0.5 mt-auto">
                            <p>Reviewer: {{ review.reviewer.name }}</p>
                            <p v-if="review.notify_sent_at">Notified: {{ formatDate(review.notify_sent_at) }}</p>
                            <p v-if="review.submitted_at">Submitted: {{ formatDate(review.submitted_at) }}</p>
                        </div>

                        <Button as-child class="w-full mt-1">
                            <a :href="`/hr/performance/reviews/${review.id}`">
                                {{ review.status === 'pending' ? 'Start Self-Appraisal' : 'View Appraisal' }}
                                <ChevronRight class="ml-1 size-4" />
                            </a>
                        </Button>
                    </CardContent>
                </Card>
            </div>

        </div>
    </AppLayout>
</template>
