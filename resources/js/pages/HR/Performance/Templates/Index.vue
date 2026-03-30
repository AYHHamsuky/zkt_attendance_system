<script setup lang="ts">
import { Head, router, useForm } from '@inertiajs/vue3';
import AppLayout from '@/layouts/AppLayout.vue';
import Heading from '@/components/Heading.vue';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Separator } from '@/components/ui/separator';
import { Plus, FileSpreadsheet, Settings2, Trash2, Eye } from 'lucide-vue-next';
import { Link } from '@inertiajs/vue3';
import { ref } from 'vue';
import { type BreadcrumbItem } from '@/types';
import {
    index as templatesIndex,
    store as templatesStore,
    destroy as templatesDestroy,
} from '@/actions/App/Http/Controllers/HR/PerformanceTemplateController';

interface TemplateRow {
    id: number;
    name: string;
    position: string | null;
    description: string | null;
    is_active: boolean;
    items_count: number;
    total_weight: number;
    created_by: string | null;
    created_at: string;
}

const props = defineProps<{
    templates: TemplateRow[];
    positions: string[];
}>();

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'HR', href: '/hr' },
    { title: 'Performance', href: '/hr/performance/cycles' },
    { title: 'Appraisal Templates' },
];

// ── Create dialog ──────────────────────────────────────────────────────────
const createOpen = ref(false);
const createForm = useForm({ name: '', position: '', description: '' });

function submitCreate() {
    createForm.post(templatesStore().url, {
        onSuccess: () => { createOpen.value = false; createForm.reset(); },
    });
}

// ── Delete ─────────────────────────────────────────────────────────────────
function deleteTemplate(template: TemplateRow) {
    if (!confirm(`Delete template "${template.name}"? This cannot be undone.`)) return;
    router.delete(templatesDestroy(template.id).url, { preserveScroll: true });
}

function weightClass(total: number): string {
    if (total === 100) return 'text-green-600 dark:text-green-400';
    if (total > 100) return 'text-red-600 dark:text-red-400';
    return 'text-amber-600 dark:text-amber-400';
}
</script>

<template>
    <Head title="Appraisal Templates" />
    <AppLayout :breadcrumbs="breadcrumbs">
        <div class="px-4 py-6">
            <div class="flex flex-wrap items-start justify-between gap-3">
                <Heading
                    title="Appraisal Templates"
                    description="Define BSC-based appraisal templates per job position. Each template sets the objectives, KPIs, and weights used when sending appraisals."
                />
                <Button size="sm" @click="createOpen = true">
                    <Plus class="mr-1.5 size-4" />New Template
                </Button>
            </div>

            <Separator class="my-4" />

            <!-- Template grid -->
            <div v-if="templates.length" class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                <div
                    v-for="tmpl in templates"
                    :key="tmpl.id"
                    class="group relative rounded-lg border bg-card p-4 shadow-sm transition-shadow hover:shadow-md"
                    :class="!tmpl.is_active ? 'opacity-60' : ''"
                >
                    <!-- Header -->
                    <div class="flex items-start justify-between gap-2">
                        <div class="flex items-center gap-2 min-w-0">
                            <FileSpreadsheet class="size-5 shrink-0 text-blue-500" />
                            <h3 class="truncate font-semibold text-sm">{{ tmpl.name }}</h3>
                        </div>
                        <Badge :variant="tmpl.is_active ? 'default' : 'secondary'" class="shrink-0 text-[10px]">
                            {{ tmpl.is_active ? 'Active' : 'Inactive' }}
                        </Badge>
                    </div>

                    <!-- Position -->
                    <p class="mt-1.5 text-xs text-muted-foreground">
                        <span v-if="tmpl.position" class="font-medium text-foreground">{{ tmpl.position }}</span>
                        <span v-else class="italic">Generic (all positions)</span>
                    </p>

                    <!-- Description -->
                    <p v-if="tmpl.description" class="mt-1.5 text-xs text-muted-foreground line-clamp-2">{{ tmpl.description }}</p>

                    <!-- Stats -->
                    <div class="mt-3 flex items-center gap-4 text-xs">
                        <span class="text-muted-foreground">{{ tmpl.items_count }} objectives</span>
                        <span :class="weightClass(tmpl.total_weight)" class="font-medium">
                            {{ tmpl.total_weight }}% total
                        </span>
                    </div>

                    <!-- Footer -->
                    <div class="mt-3 flex items-center justify-between border-t pt-3">
                        <span class="text-[10px] text-muted-foreground">{{ tmpl.created_at }} · {{ tmpl.created_by ?? '—' }}</span>
                        <div class="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            <Button size="icon" variant="ghost" class="size-7" as-child title="View & Edit">
                                <Link :href="`/hr/performance/templates/${tmpl.id}`">
                                    <Settings2 class="size-3.5" />
                                </Link>
                            </Button>
                            <Button
                                size="icon"
                                variant="ghost"
                                class="size-7 text-destructive hover:text-destructive"
                                title="Delete"
                                @click="deleteTemplate(tmpl)"
                            >
                                <Trash2 class="size-3.5" />
                            </Button>
                        </div>
                    </div>
                </div>
            </div>

            <div v-else class="py-20 text-center text-muted-foreground">
                <FileSpreadsheet class="mx-auto mb-3 size-12 opacity-20" />
                <p class="text-sm">No templates yet. Create one to define BSC objectives for each position.</p>
                <Button class="mt-4" size="sm" @click="createOpen = true">
                    <Plus class="mr-1.5 size-4" />Create First Template
                </Button>
            </div>
        </div>
    </AppLayout>

    <!-- ── Create Dialog ── -->
    <Dialog v-model:open="createOpen">
        <DialogContent class="max-w-md">
            <DialogHeader><DialogTitle>New Appraisal Template</DialogTitle></DialogHeader>
            <form class="space-y-4" @submit.prevent="submitCreate">
                <div class="space-y-1.5">
                    <Label>Template Name <span class="text-destructive">*</span></Label>
                    <Input v-model="createForm.name" placeholder="e.g. Standard HR BSC Template" />
                    <p v-if="createForm.errors.name" class="text-xs text-destructive">{{ createForm.errors.name }}</p>
                </div>
                <div class="space-y-1.5">
                    <Label>Job Position</Label>
                    <Input v-model="createForm.position" list="positions-list" placeholder="Leave blank for generic default" />
                    <datalist id="positions-list">
                        <option v-for="pos in positions" :key="pos" :value="pos" />
                    </datalist>
                    <p class="text-xs text-muted-foreground">Leave blank = applies to all employees without a position-specific template.</p>
                </div>
                <div class="space-y-1.5">
                    <Label>Description</Label>
                    <Input v-model="createForm.description" placeholder="Optional description" />
                </div>
                <DialogFooter>
                    <Button type="button" variant="outline" @click="createOpen = false">Cancel</Button>
                    <Button type="submit" :disabled="createForm.processing">Create Template</Button>
                </DialogFooter>
            </form>
        </DialogContent>
    </Dialog>
</template>
