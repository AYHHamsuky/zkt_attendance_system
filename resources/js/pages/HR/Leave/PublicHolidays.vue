<script setup lang="ts">
import { Head, router, useForm } from '@inertiajs/vue3';
import AppLayout from '@/layouts/AppLayout.vue';
import { type BreadcrumbItem } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import {
    Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle,
} from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Plus, Pencil, Trash2, Umbrella } from 'lucide-vue-next';
import { ref } from 'vue';

interface Holiday {
    id: number;
    name: string;
    date: string;
    description: string | null;
}

interface YearGroup {
    year: number;
    holidays: Holiday[];
}

defineProps<{
    byYear: YearGroup[];
}>();

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'HR Management', href: '/hr' },
    { title: 'Leave', href: '/hr/leave' },
    { title: 'Public Holidays' },
];

// ── Add dialog ────────────────────────────────────────────────────────────
const addOpen = ref(false);
const addForm = useForm({ name: '', date: '', description: '' });

function submitAdd() {
    addForm.post('/hr/public-holidays', {
        onSuccess: () => {
            addOpen.value = false;
            addForm.reset();
        },
    });
}

// ── Edit dialog ───────────────────────────────────────────────────────────
const editOpen = ref(false);
const editId = ref<number | null>(null);
const editForm = useForm({ name: '', date: '', description: '' });

function openEdit(holiday: Holiday) {
    editId.value = holiday.id;
    editForm.name = holiday.name;
    editForm.date = holiday.date;
    editForm.description = holiday.description ?? '';
    editOpen.value = true;
}

function submitEdit() {
    if (!editId.value) { return; }
    editForm.patch(`/hr/public-holidays/${editId.value}`, {
        onSuccess: () => {
            editOpen.value = false;
        },
    });
}

// ── Delete ─────────────────────────────────────────────────────────────
function deleteHoliday(id: number, name: string) {
    if (!confirm(`Remove "${name}" from public holidays?`)) { return; }
    router.delete(`/hr/public-holidays/${id}`, { preserveScroll: true });
}

function formatDate(d: string): string {
    return new Date(d + 'T00:00:00').toLocaleDateString('en-GB', {
        weekday: 'long', day: '2-digit', month: 'long', year: 'numeric',
    });
}
</script>

<template>
    <Head title="Public Holidays" />
    <AppLayout :breadcrumbs="breadcrumbs">
        <div class="flex h-full flex-1 flex-col gap-6 p-4 md:p-6">

            <!-- Header -->
            <div class="flex items-center justify-between">
                <div>
                    <h2 class="text-2xl font-bold tracking-tight">Public Holidays</h2>
                    <p class="text-muted-foreground">Holidays are excluded from leave day calculations.</p>
                </div>
                <Button @click="addOpen = true">
                    <Plus class="mr-2 size-4" />Add Holiday
                </Button>
            </div>

            <!-- Empty state -->
            <Card v-if="byYear.length === 0">
                <CardContent class="flex flex-col items-center gap-3 py-16">
                    <Umbrella class="size-12 text-muted-foreground" />
                    <p class="text-lg font-medium">No public holidays configured</p>
                    <p class="text-sm text-muted-foreground">Add public holidays to exclude them from leave day calculations.</p>
                    <Button @click="addOpen = true"><Plus class="mr-2 size-4" />Add First Holiday</Button>
                </CardContent>
            </Card>

            <!-- Grouped by year -->
            <Card v-for="group in byYear" :key="group.year">
                <CardHeader class="pb-2">
                    <CardTitle class="text-base">{{ group.year }}</CardTitle>
                </CardHeader>
                <CardContent class="p-0">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Name</TableHead>
                                <TableHead>Date</TableHead>
                                <TableHead>Description</TableHead>
                                <TableHead class="text-right w-24">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            <TableRow v-for="holiday in group.holidays" :key="holiday.id">
                                <TableCell class="font-medium">{{ holiday.name }}</TableCell>
                                <TableCell class="text-sm">{{ formatDate(holiday.date) }}</TableCell>
                                <TableCell class="text-sm text-muted-foreground">{{ holiday.description ?? '—' }}</TableCell>
                                <TableCell class="text-right">
                                    <div class="flex justify-end gap-1">
                                        <Button size="sm" variant="ghost" @click="openEdit(holiday)" title="Edit">
                                            <Pencil class="size-4" />
                                        </Button>
                                        <Button
                                            size="sm" variant="ghost"
                                            class="text-destructive hover:text-destructive"
                                            @click="deleteHoliday(holiday.id, holiday.name)"
                                            title="Remove"
                                        >
                                            <Trash2 class="size-4" />
                                        </Button>
                                    </div>
                                </TableCell>
                            </TableRow>
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>

        <!-- Add dialog -->
        <Dialog v-model:open="addOpen">
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Add Public Holiday</DialogTitle>
                </DialogHeader>
                <div class="space-y-4">
                    <div class="space-y-1.5">
                        <Label>Name <span class="text-destructive">*</span></Label>
                        <Input v-model="addForm.name" placeholder="e.g. Independence Day" />
                        <p v-if="addForm.errors.name" class="text-sm text-destructive">{{ addForm.errors.name }}</p>
                    </div>
                    <div class="space-y-1.5">
                        <Label>Date <span class="text-destructive">*</span></Label>
                        <Input v-model="addForm.date" type="date" />
                        <p v-if="addForm.errors.date" class="text-sm text-destructive">{{ addForm.errors.date }}</p>
                    </div>
                    <div class="space-y-1.5">
                        <Label>Description</Label>
                        <Textarea v-model="addForm.description" placeholder="Optional note…" rows="2" />
                    </div>
                </div>
                <DialogFooter>
                    <Button variant="outline" @click="addOpen = false">Cancel</Button>
                    <Button :disabled="addForm.processing" @click="submitAdd">Add Holiday</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>

        <!-- Edit dialog -->
        <Dialog v-model:open="editOpen">
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Edit Public Holiday</DialogTitle>
                </DialogHeader>
                <div class="space-y-4">
                    <div class="space-y-1.5">
                        <Label>Name <span class="text-destructive">*</span></Label>
                        <Input v-model="editForm.name" />
                        <p v-if="editForm.errors.name" class="text-sm text-destructive">{{ editForm.errors.name }}</p>
                    </div>
                    <div class="space-y-1.5">
                        <Label>Date <span class="text-destructive">*</span></Label>
                        <Input v-model="editForm.date" type="date" />
                        <p v-if="editForm.errors.date" class="text-sm text-destructive">{{ editForm.errors.date }}</p>
                    </div>
                    <div class="space-y-1.5">
                        <Label>Description</Label>
                        <Textarea v-model="editForm.description" rows="2" />
                    </div>
                </div>
                <DialogFooter>
                    <Button variant="outline" @click="editOpen = false">Cancel</Button>
                    <Button :disabled="editForm.processing" @click="submitEdit">Save Changes</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    </AppLayout>
</template>
