<script setup lang="ts">
import { Head, Link, router, useForm } from '@inertiajs/vue3';
import AppLayout from '@/layouts/AppLayout.vue';
import { type BreadcrumbItem } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Separator } from '@/components/ui/separator';
import { Plus, Eye, Star, Download, FileSpreadsheet, Users } from 'lucide-vue-next';
import { ref, computed } from 'vue';
import { usePage } from '@inertiajs/vue3';

interface Cycle {
    id: number;
    name: string;
    year: number;
    period_type: string;
    start_date: string;
    end_date: string;
    status: string;
    reviews_count: number;
}

const props = defineProps<{
    cycles: Cycle[];
    departments: string[];
}>();

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'HR Management', href: '/hr' },
    { title: 'Performance' },
];

const isAdmin = computed(() => {
    const role = (usePage().props.auth as { user: { role: string } }).user?.role;
    return role === 'admin' || role === 'super_admin' || role === 'hr';
});

const dialogOpen = ref(false);
const bulkDept = ref('');

const form = useForm({
    name: '',
    year: new Date().getFullYear(),
    period_type: 'annual',
    start_date: '',
    end_date: '',
    phase1_open_date: '',
    phase1_close_date: '',
    phase2_open_date: '',
    phase2_close_date: '',
    phase3_open_date: '',
    phase3_close_date: '',
});

function submit() {
    form.post('/hr/performance/cycles', {
        onSuccess: () => { dialogOpen.value = false; form.reset(); },
    });
}

const statusVariant: Record<string, 'default' | 'secondary' | 'outline'> = {
    draft: 'secondary', active: 'default', completed: 'outline',
};

function deleteCycle(id: number) {
    if (confirm('Delete this performance cycle?')) {
        router.delete(`/hr/performance/cycles/${id}`);
    }
}

function bulkDownloadUrl() {
    const base = '/hr/performance/templates/bulk';
    return bulkDept.value ? `${base}?department=${encodeURIComponent(bulkDept.value)}` : base;
}
</script>

<template>
    <Head title="Performance Management" />
    <AppLayout :breadcrumbs="breadcrumbs">
        <div class="flex h-full flex-1 flex-col gap-4 p-4 md:p-6">
            <div class="flex items-center justify-between">
                <div>
                    <h2 class="text-2xl font-bold">Performance Management</h2>
                    <p class="text-muted-foreground">{{ cycles.length }} appraisal cycles</p>
                </div>
                <div v-if="isAdmin" class="flex gap-2">
                    <Button as-child variant="outline">
                        <Link href="/hr/performance/reviews">View All Reviews</Link>
                    </Button>
                    <Button @click="dialogOpen = true"><Plus class="mr-2 size-4" />New Cycle</Button>
                </div>
            </div>

            <!-- ── Template Downloads Panel (admin/hr only) ── -->
            <Card v-if="isAdmin">
                <CardHeader class="pb-3">
                    <CardTitle class="flex items-center gap-2 text-base">
                        <FileSpreadsheet class="h-4 w-4 text-primary" />
                        Performance Appraisal Templates
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                        <!-- Sample download -->
                        <div class="rounded-lg border bg-muted/30 p-4">
                            <div class="mb-2 flex items-center gap-2">
                                <FileSpreadsheet class="h-4 w-4 text-blue-600" />
                                <span class="text-sm font-semibold">Sample Template</span>
                            </div>
                            <p class="mb-3 text-xs text-muted-foreground">
                                Full form with scoring guide, ratings scale, and descriptions — for manager reference.
                            </p>
                            <Button size="sm" variant="outline" class="w-full" as-child>
                                <a href="/hr/performance/templates/sample" download>
                                    <Download class="mr-2 h-3.5 w-3.5" />
                                    Download Sample
                                </a>
                            </Button>
                        </div>

                        <!-- Blank template download -->
                        <div class="rounded-lg border bg-muted/30 p-4">
                            <div class="mb-2 flex items-center gap-2">
                                <FileSpreadsheet class="h-4 w-4 text-green-600" />
                                <span class="text-sm font-semibold">Blank Template</span>
                            </div>
                            <p class="mb-3 text-xs text-muted-foreground">
                                Clean form with only Objectives, KPIs, Targets and Remark — for direct reports to fill in.
                            </p>
                            <Button size="sm" variant="outline" class="w-full" as-child>
                                <a href="/hr/performance/templates/template" download>
                                    <Download class="mr-2 h-3.5 w-3.5" />
                                    Download Template
                                </a>
                            </Button>
                        </div>

                        <!-- Bulk personalized download -->
                        <div class="rounded-lg border bg-muted/30 p-4">
                            <div class="mb-2 flex items-center gap-2">
                                <Users class="h-4 w-4 text-orange-600" />
                                <span class="text-sm font-semibold">Bulk Personalized</span>
                            </div>
                            <p class="mb-2 text-xs text-muted-foreground">
                                Generate pre-filled templates for all employees (ZIP). Filter by department or download all.
                            </p>
                            <Select :model-value="bulkDept || '_all'" @update:model-value="v => bulkDept = String(v) === '_all' ? '' : String(v)">
                                <SelectTrigger class="mb-2 h-8 text-xs">
                                    <SelectValue placeholder="All Departments" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="_all">All Departments</SelectItem>
                                    <SelectItem v-for="dept in departments" :key="dept" :value="dept">{{ dept }}</SelectItem>
                                </SelectContent>
                            </Select>
                            <Button size="sm" variant="outline" class="w-full" as-child>
                                <a :href="bulkDownloadUrl()" download>
                                    <Download class="mr-2 h-3.5 w-3.5" />
                                    Download ZIP
                                </a>
                            </Button>
                        </div>
                    </div>

                    <Separator class="my-4" />

                    <p class="text-xs text-muted-foreground">
                        To download a pre-filled template for a specific employee, visit their
                        <Link href="/hr/nominal-roll" class="text-primary underline">Nominal Roll</Link>
                        profile and use the "Download Template" button.
                    </p>
                </CardContent>
            </Card>

            <!-- ── Cycles Grid ── -->
            <div class="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                <Card v-for="cycle in cycles" :key="cycle.id" class="relative">
                    <CardHeader class="pb-2">
                        <div class="flex items-start justify-between">
                            <CardTitle class="text-base">{{ cycle.name }}</CardTitle>
                            <Badge :variant="statusVariant[cycle.status] ?? 'secondary'" class="capitalize text-xs">{{ cycle.status }}</Badge>
                        </div>
                        <p class="text-sm text-muted-foreground capitalize">{{ cycle.period_type }} · {{ cycle.year }}</p>
                    </CardHeader>
                    <CardContent>
                        <div class="text-sm space-y-1 mb-3">
                            <p>{{ cycle.start_date }} → {{ cycle.end_date }}</p>
                            <p v-if="isAdmin" class="text-muted-foreground">{{ cycle.reviews_count }} reviews</p>
                        </div>
                        <div class="flex gap-2">
                            <Button size="sm" as-child class="flex-1">
                                <Link v-if="isAdmin" :href="`/hr/performance/cycles/${cycle.id}`">
                                    <Eye class="mr-1 size-3" />View Reviews
                                </Link>
                                <Link v-else href="/hr/performance/my-appraisals">
                                    <Eye class="mr-1 size-3" />My Appraisal
                                </Link>
                            </Button>
                        </div>
                    </CardContent>
                </Card>

                <div v-if="cycles.length === 0" class="md:col-span-2 lg:col-span-3 py-16 text-center text-muted-foreground">
                    <Star class="size-12 mx-auto mb-3 opacity-30" />
                    <p>No performance cycles yet. Create one to start appraisals.</p>
                </div>
            </div>
        </div>

        <!-- Create Cycle Dialog -->
        <Dialog v-model:open="dialogOpen">
            <DialogContent class="max-w-md">
                <DialogHeader><DialogTitle>New Performance Cycle</DialogTitle></DialogHeader>
                <form class="space-y-4" @submit.prevent="submit">
                    <div class="space-y-1.5">
                        <Label>Cycle Name</Label>
                        <Input v-model="form.name" placeholder="e.g. Annual Appraisal 2025" />
                        <p v-if="form.errors.name" class="text-sm text-destructive">{{ form.errors.name }}</p>
                    </div>
                    <div class="grid grid-cols-2 gap-3">
                        <div class="space-y-1.5">
                            <Label>Year</Label>
                            <Input v-model.number="form.year" type="number" min="2000" max="2100" />
                        </div>
                        <div class="space-y-1.5">
                            <Label>Period Type</Label>
                            <Select :model-value="form.period_type" @update:model-value="v => form.period_type = String(v)">
                                <SelectTrigger><SelectValue /></SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="quarterly">Quarterly</SelectItem>
                                    <SelectItem value="biannual">Biannual</SelectItem>
                                    <SelectItem value="annual">Annual</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div class="space-y-1.5">
                            <Label>Start Date</Label>
                            <Input v-model="form.start_date" type="date" />
                        </div>
                        <div class="space-y-1.5">
                            <Label>End Date</Label>
                            <Input v-model="form.end_date" type="date" />
                        </div>
                    </div>
                    <!-- Phase Dates (optional) -->
                    <div class="space-y-2 border rounded-lg p-3 bg-gray-50">
                        <p class="text-xs font-semibold text-gray-600 uppercase">Phase Dates (Optional)</p>
                        <div class="grid grid-cols-2 gap-2 text-xs">
                            <div class="space-y-1">
                                <label class="text-gray-500">Phase 1 Open</label>
                                <Input v-model="form.phase1_open_date" type="date" class="h-7 text-xs" />
                            </div>
                            <div class="space-y-1">
                                <label class="text-gray-500">Phase 1 Close</label>
                                <Input v-model="form.phase1_close_date" type="date" class="h-7 text-xs" />
                            </div>
                            <div class="space-y-1">
                                <label class="text-gray-500">Phase 2 Open</label>
                                <Input v-model="form.phase2_open_date" type="date" class="h-7 text-xs" />
                            </div>
                            <div class="space-y-1">
                                <label class="text-gray-500">Phase 2 Close</label>
                                <Input v-model="form.phase2_close_date" type="date" class="h-7 text-xs" />
                            </div>
                            <div class="space-y-1">
                                <label class="text-gray-500">Phase 3 Open</label>
                                <Input v-model="form.phase3_open_date" type="date" class="h-7 text-xs" />
                            </div>
                            <div class="space-y-1">
                                <label class="text-gray-500">Phase 3 Close</label>
                                <Input v-model="form.phase3_close_date" type="date" class="h-7 text-xs" />
                            </div>
                        </div>
                    </div>
                    <DialogFooter>
                        <Button type="button" variant="outline" @click="dialogOpen = false">Cancel</Button>
                        <Button type="submit" :disabled="form.processing">Create Cycle</Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    </AppLayout>
</template>
