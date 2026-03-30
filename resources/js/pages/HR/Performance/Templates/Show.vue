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
import { Plus, Pencil, Trash2, Save, AlertTriangle } from 'lucide-vue-next';
import { ref, computed } from 'vue';
import { type BreadcrumbItem } from '@/types';
import {
    update as updateTemplate,
    destroy as destroyTemplate,
    storeItem,
    updateItem,
    destroyItem,
} from '@/actions/App/Http/Controllers/HR/PerformanceTemplateController';

interface TemplateInfo {
    id: number;
    name: string;
    position: string | null;
    description: string | null;
    is_active: boolean;
    total_weight: number;
    created_by: string | null;
}

interface TemplateItem {
    id: number;
    bsc_category: string;
    serial: number;
    objective: string;
    kpi: string | null;
    weight: number;
    target: string | null;
    sort_order: number;
}

const props = defineProps<{
    template: TemplateInfo;
    items: TemplateItem[];
    bsc_categories: string[];
    score_labels: Record<string, string>;
}>();

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'HR', href: '/hr' },
    { title: 'Performance', href: '/hr/performance/cycles' },
    { title: 'Templates', href: '/hr/performance/templates' },
    { title: props.template.name },
];

// ── Edit template metadata ─────────────────────────────────────────────────
const editMetaOpen = ref(false);
const metaForm = useForm({
    name: props.template.name,
    position: props.template.position ?? '',
    description: props.template.description ?? '',
    is_active: props.template.is_active,
});

function submitMeta() {
    metaForm.patch(updateTemplate(props.template.id).url, {
        onSuccess: () => { editMetaOpen.value = false; },
    });
}

// ── Add item ───────────────────────────────────────────────────────────────
const addItemOpen = ref(false);
const addForm = useForm({
    bsc_category: props.bsc_categories[0] ?? '',
    serial: 1,
    objective: '',
    kpi: '',
    weight: 0,
    target: '',
});

function submitAdd() {
    addForm.post(storeItem(props.template.id).url, {
        onSuccess: () => { addItemOpen.value = false; addForm.reset(); addForm.bsc_category = props.bsc_categories[0] ?? ''; },
    });
}

// ── Edit item ──────────────────────────────────────────────────────────────
const editItemOpen = ref(false);
const editingItem = ref<TemplateItem | null>(null);
const editForm = useForm({
    bsc_category: '',
    serial: 1,
    objective: '',
    kpi: '',
    weight: 0,
    target: '',
});

function openEditItem(item: TemplateItem) {
    editingItem.value = item;
    editForm.bsc_category = item.bsc_category;
    editForm.serial = item.serial;
    editForm.objective = item.objective;
    editForm.kpi = item.kpi ?? '';
    editForm.weight = item.weight;
    editForm.target = item.target ?? '';
    editItemOpen.value = true;
}

function submitEdit() {
    if (!editingItem.value) return;
    editForm.patch(updateItem(props.template.id, editingItem.value.id).url, {
        onSuccess: () => { editItemOpen.value = false; },
    });
}

// ── Delete item ────────────────────────────────────────────────────────────
function deleteItem(item: TemplateItem) {
    if (!confirm(`Remove objective "${item.objective}"?`)) return;
    router.delete(destroyItem(props.template.id, item.id).url, { preserveScroll: true });
}

// ── Total weight ───────────────────────────────────────────────────────────
const totalWeight = computed(() => props.items.reduce((sum, i) => sum + i.weight, 0));

// Group items by BSC category for display
const groupedItems = computed(() => {
    const groups: Record<string, TemplateItem[]> = {};
    for (const item of props.items) {
        if (!groups[item.bsc_category]) groups[item.bsc_category] = [];
        groups[item.bsc_category].push(item);
    }
    return groups;
});

const weightStatusClass = computed(() => {
    if (totalWeight.value === 100) return 'text-green-600 dark:text-green-400 font-bold';
    if (totalWeight.value > 100) return 'text-red-600 dark:text-red-400 font-bold';
    return 'text-amber-600 dark:text-amber-400 font-bold';
});
</script>

<template>
    <Head :title="`Template: ${template.name}`" />
    <AppLayout :breadcrumbs="breadcrumbs">
        <div class="px-4 py-6 space-y-6">

            <!-- Header -->
            <div class="flex flex-wrap items-start justify-between gap-3">
                <div>
                    <div class="flex items-center gap-2 flex-wrap">
                        <h1 class="text-xl font-bold">{{ template.name }}</h1>
                        <Badge :variant="template.is_active ? 'default' : 'secondary'">
                            {{ template.is_active ? 'Active' : 'Inactive' }}
                        </Badge>
                        <Badge v-if="template.position" variant="outline">{{ template.position }}</Badge>
                        <Badge v-else variant="outline" class="text-muted-foreground">Generic (all positions)</Badge>
                    </div>
                    <p v-if="template.description" class="mt-1 text-sm text-muted-foreground">{{ template.description }}</p>
                    <p class="mt-1 text-xs text-muted-foreground">Created by {{ template.created_by ?? '—' }}</p>
                </div>
                <div class="flex gap-2">
                    <Button variant="outline" size="sm" @click="editMetaOpen = true">
                        <Pencil class="mr-1.5 size-4" />Edit Info
                    </Button>
                    <Button size="sm" @click="addItemOpen = true">
                        <Plus class="mr-1.5 size-4" />Add Objective
                    </Button>
                </div>
            </div>

            <!-- Weight warning -->
            <div v-if="totalWeight !== 100" class="flex items-center gap-2 rounded-md border border-amber-300 bg-amber-50 px-4 py-2.5 text-sm text-amber-700 dark:border-amber-700 dark:bg-amber-900/20 dark:text-amber-400">
                <AlertTriangle class="size-4 shrink-0" />
                Total weight is <strong class="ml-1">{{ totalWeight }}%</strong>. All objectives should sum to exactly 100%.
            </div>

            <!-- Score rating legend -->
            <div class="flex flex-wrap gap-3 rounded-lg border bg-muted/20 px-4 py-3 text-xs">
                <span class="font-semibold text-muted-foreground">Rating Scale:</span>
                <span v-for="(label, score) in score_labels" :key="score" class="rounded bg-muted px-2 py-0.5">
                    <strong>{{ score }}</strong> — {{ label }}
                </span>
            </div>

            <!-- BSC Table (Excel-style) -->
            <div class="overflow-x-auto rounded-lg border shadow-sm">
                <table class="w-full text-sm">
                    <thead class="border-b bg-primary text-primary-foreground">
                        <tr>
                            <th class="px-3 py-2.5 text-left text-xs font-bold uppercase tracking-wide w-32">BSC</th>
                            <th class="px-3 py-2.5 text-center text-xs font-bold uppercase tracking-wide w-12">S/N</th>
                            <th class="px-3 py-2.5 text-left text-xs font-bold uppercase tracking-wide">Objectives</th>
                            <th class="px-3 py-2.5 text-left text-xs font-bold uppercase tracking-wide">KPIs</th>
                            <th class="px-3 py-2.5 text-center text-xs font-bold uppercase tracking-wide w-20">Weight (%)</th>
                            <th class="px-3 py-2.5 text-center text-xs font-bold uppercase tracking-wide w-24">Target</th>
                            <th class="px-3 py-2.5 text-center text-xs font-bold uppercase tracking-wide w-20">Actions</th>
                        </tr>
                    </thead>
                    <tbody class="divide-y">
                        <template v-for="(catItems, category) in groupedItems" :key="category">
                            <tr
                                v-for="(item, idx) in catItems"
                                :key="item.id"
                                class="hover:bg-muted/30 transition-colors"
                            >
                                <!-- BSC category (merged visually) -->
                                <td class="px-3 py-2.5 align-middle">
                                    <span
                                        v-if="idx === 0"
                                        class="inline-block rounded-sm bg-primary/10 px-2 py-0.5 text-xs font-semibold text-primary"
                                    >{{ category }}</span>
                                </td>
                                <!-- S/N -->
                                <td class="px-3 py-2.5 text-center text-xs text-muted-foreground">{{ item.serial }}</td>
                                <!-- Objective -->
                                <td class="px-3 py-2.5">
                                    <p class="font-medium">{{ item.objective }}</p>
                                </td>
                                <!-- KPI -->
                                <td class="px-3 py-2.5 text-xs text-muted-foreground max-w-xs">
                                    {{ item.kpi ?? '—' }}
                                </td>
                                <!-- Weight -->
                                <td class="px-3 py-2.5 text-center">
                                    <span class="font-semibold">{{ item.weight }}%</span>
                                </td>
                                <!-- Target -->
                                <td class="px-3 py-2.5 text-center text-xs">{{ item.target ?? '—' }}</td>
                                <!-- Actions -->
                                <td class="px-3 py-2.5 text-center">
                                    <div class="flex items-center justify-center gap-1">
                                        <Button size="icon" variant="ghost" class="size-7" @click="openEditItem(item)">
                                            <Pencil class="size-3.5" />
                                        </Button>
                                        <Button
                                            size="icon" variant="ghost"
                                            class="size-7 text-destructive hover:text-destructive"
                                            @click="deleteItem(item)"
                                        >
                                            <Trash2 class="size-3.5" />
                                        </Button>
                                    </div>
                                </td>
                            </tr>
                        </template>

                        <!-- Empty state -->
                        <tr v-if="items.length === 0">
                            <td colspan="7" class="py-16 text-center text-sm text-muted-foreground">
                                No objectives yet. Click "Add Objective" to define the BSC objectives for this template.
                            </td>
                        </tr>

                        <!-- Totals row -->
                        <tr v-if="items.length > 0" class="border-t-2 bg-muted/30 font-semibold">
                            <td colspan="4" class="px-3 py-2 text-right text-xs uppercase tracking-wide text-muted-foreground">Total Weight</td>
                            <td class="px-3 py-2 text-center text-sm" :class="weightStatusClass">{{ totalWeight }}%</td>
                            <td colspan="2" class="px-3 py-2"></td>
                        </tr>
                    </tbody>
                </table>
            </div>

        </div>
    </AppLayout>

    <!-- ── Edit Template Metadata Dialog ── -->
    <Dialog v-model:open="editMetaOpen">
        <DialogContent class="max-w-md">
            <DialogHeader><DialogTitle>Edit Template Info</DialogTitle></DialogHeader>
            <form class="space-y-4" @submit.prevent="submitMeta">
                <div class="space-y-1.5">
                    <Label>Name <span class="text-destructive">*</span></Label>
                    <Input v-model="metaForm.name" />
                    <p v-if="metaForm.errors.name" class="text-xs text-destructive">{{ metaForm.errors.name }}</p>
                </div>
                <div class="space-y-1.5">
                    <Label>Job Position</Label>
                    <Input v-model="metaForm.position" placeholder="Leave blank for generic" />
                </div>
                <div class="space-y-1.5">
                    <Label>Description</Label>
                    <Input v-model="metaForm.description" />
                </div>
                <div class="flex items-center gap-2">
                    <input type="checkbox" id="is-active" v-model="metaForm.is_active" class="rounded" />
                    <Label for="is-active">Active (available for appraisals)</Label>
                </div>
                <DialogFooter>
                    <Button type="button" variant="outline" @click="editMetaOpen = false">Cancel</Button>
                    <Button type="submit" :disabled="metaForm.processing">
                        <Save class="mr-1.5 size-4" />Save Changes
                    </Button>
                </DialogFooter>
            </form>
        </DialogContent>
    </Dialog>

    <!-- ── Add Objective Dialog ── -->
    <Dialog v-model:open="addItemOpen">
        <DialogContent class="max-w-lg">
            <DialogHeader><DialogTitle>Add Objective</DialogTitle></DialogHeader>
            <form class="space-y-3" @submit.prevent="submitAdd">
                <div class="grid grid-cols-2 gap-3">
                    <div class="space-y-1.5">
                        <Label>BSC Category <span class="text-destructive">*</span></Label>
                        <Select :model-value="addForm.bsc_category" @update:model-value="v => addForm.bsc_category = String(v)">
                            <SelectTrigger><SelectValue /></SelectTrigger>
                            <SelectContent>
                                <SelectItem v-for="cat in bsc_categories" :key="cat" :value="cat">{{ cat }}</SelectItem>
                            </SelectContent>
                        </Select>
                        <p v-if="addForm.errors.bsc_category" class="text-xs text-destructive">{{ addForm.errors.bsc_category }}</p>
                    </div>
                    <div class="space-y-1.5">
                        <Label>S/N <span class="text-destructive">*</span></Label>
                        <Input v-model.number="addForm.serial" type="number" min="1" />
                        <p v-if="addForm.errors.serial" class="text-xs text-destructive">{{ addForm.errors.serial }}</p>
                    </div>
                </div>
                <div class="space-y-1.5">
                    <Label>Objective <span class="text-destructive">*</span></Label>
                    <Input v-model="addForm.objective" placeholder="e.g. Attrition rate" />
                    <p v-if="addForm.errors.objective" class="text-xs text-destructive">{{ addForm.errors.objective }}</p>
                </div>
                <div class="space-y-1.5">
                    <Label>KPI</Label>
                    <Input v-model="addForm.kpi" placeholder="e.g. % Reduction rate from Previous year" />
                </div>
                <div class="grid grid-cols-2 gap-3">
                    <div class="space-y-1.5">
                        <Label>Weight (%) <span class="text-destructive">*</span></Label>
                        <Input v-model.number="addForm.weight" type="number" min="0" max="100" step="0.5" />
                        <p v-if="addForm.errors.weight" class="text-xs text-destructive">{{ addForm.errors.weight }}</p>
                    </div>
                    <div class="space-y-1.5">
                        <Label>Target</Label>
                        <Input v-model="addForm.target" placeholder="e.g. 90%" />
                    </div>
                </div>
                <DialogFooter>
                    <Button type="button" variant="outline" @click="addItemOpen = false">Cancel</Button>
                    <Button type="submit" :disabled="addForm.processing">
                        <Plus class="mr-1.5 size-4" />Add Objective
                    </Button>
                </DialogFooter>
            </form>
        </DialogContent>
    </Dialog>

    <!-- ── Edit Objective Dialog ── -->
    <Dialog v-model:open="editItemOpen">
        <DialogContent class="max-w-lg">
            <DialogHeader><DialogTitle>Edit Objective</DialogTitle></DialogHeader>
            <form class="space-y-3" @submit.prevent="submitEdit">
                <div class="grid grid-cols-2 gap-3">
                    <div class="space-y-1.5">
                        <Label>BSC Category <span class="text-destructive">*</span></Label>
                        <Select :model-value="editForm.bsc_category" @update:model-value="v => editForm.bsc_category = String(v)">
                            <SelectTrigger><SelectValue /></SelectTrigger>
                            <SelectContent>
                                <SelectItem v-for="cat in bsc_categories" :key="cat" :value="cat">{{ cat }}</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <div class="space-y-1.5">
                        <Label>S/N <span class="text-destructive">*</span></Label>
                        <Input v-model.number="editForm.serial" type="number" min="1" />
                    </div>
                </div>
                <div class="space-y-1.5">
                    <Label>Objective <span class="text-destructive">*</span></Label>
                    <Input v-model="editForm.objective" />
                </div>
                <div class="space-y-1.5">
                    <Label>KPI</Label>
                    <Input v-model="editForm.kpi" />
                </div>
                <div class="grid grid-cols-2 gap-3">
                    <div class="space-y-1.5">
                        <Label>Weight (%) <span class="text-destructive">*</span></Label>
                        <Input v-model.number="editForm.weight" type="number" min="0" max="100" step="0.5" />
                    </div>
                    <div class="space-y-1.5">
                        <Label>Target</Label>
                        <Input v-model="editForm.target" />
                    </div>
                </div>
                <DialogFooter>
                    <Button type="button" variant="outline" @click="editItemOpen = false">Cancel</Button>
                    <Button type="submit" :disabled="editForm.processing">
                        <Save class="mr-1.5 size-4" />Save Changes
                    </Button>
                </DialogFooter>
            </form>
        </DialogContent>
    </Dialog>
</template>
