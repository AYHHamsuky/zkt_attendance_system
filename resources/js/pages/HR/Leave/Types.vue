<script setup lang="ts">
import { Head, useForm, router } from '@inertiajs/vue3';
import AppLayout from '@/layouts/AppLayout.vue';
import { type BreadcrumbItem } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import {
    Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter,
} from '@/components/ui/dialog';
import { Plus, Pencil, Trash2 } from 'lucide-vue-next';
import { ref } from 'vue';

interface LeaveType {
    id: number;
    name: string;
    days_allowed_per_year: number;
    is_paid: boolean;
    gender_restriction: string | null;
    requires_approval: boolean;
    requires_reliever: boolean;
    requires_document: boolean;
    document_label: string | null;
    description: string | null;
    hr_email: string | null;
    applications_count: number;
}

const props = defineProps<{ leaveTypes: LeaveType[] }>();

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'HRIS', href: '/hr' },
    { title: 'Leave', href: '/hr/leave' },
    { title: 'Leave Types' },
];

const dialogOpen = ref(false);
const editingType = ref<LeaveType | null>(null);

const form = useForm({
    name: '',
    days_allowed_per_year: 21,
    is_paid: true,
    gender_restriction: '',
    requires_approval: true,
    requires_reliever: false,
    requires_document: false,
    document_label: '',
    description: '',
    hr_email: '',
});

function openCreate() {
    editingType.value = null;
    form.reset();
    dialogOpen.value = true;
}

function openEdit(lt: LeaveType) {
    editingType.value = lt;
    form.name = lt.name;
    form.days_allowed_per_year = lt.days_allowed_per_year;
    form.is_paid = lt.is_paid;
    form.gender_restriction = lt.gender_restriction ?? '';
    form.requires_approval = lt.requires_approval;
    form.requires_reliever = lt.requires_reliever;
    form.requires_document = lt.requires_document;
    form.document_label = lt.document_label ?? '';
    form.description = lt.description ?? '';
    form.hr_email = lt.hr_email ?? '';
    dialogOpen.value = true;
}

function submit() {
    if (editingType.value) {
        form.patch(`/hr/leave-types/${editingType.value.id}`, {
            onSuccess: () => { dialogOpen.value = false; },
        });
    } else {
        form.post('/hr/leave-types', {
            onSuccess: () => { dialogOpen.value = false; form.reset(); },
        });
    }
}

function deleteType(lt: LeaveType) {
    if (confirm(`Delete "${lt.name}"? This will also remove associated leave balance records.`)) {
        router.delete(`/hr/leave-types/${lt.id}`);
    }
}
</script>

<template>
    <Head title="Leave Types" />
    <AppLayout :breadcrumbs="breadcrumbs">
        <div class="flex h-full flex-1 flex-col gap-4 p-4 md:p-6">
            <div class="flex items-center justify-between">
                <div>
                    <h2 class="text-2xl font-bold">Leave Types</h2>
                    <p class="text-muted-foreground">Configure available leave categories.</p>
                </div>
                <Button @click="openCreate"><Plus class="mr-2 size-4" />Add Leave Type</Button>
            </div>

            <Card>
                <CardContent class="p-0">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Name</TableHead>
                                <TableHead>Days/Year</TableHead>
                                <TableHead>Gender</TableHead>
                                <TableHead>Approval</TableHead>
                                <TableHead>Applications</TableHead>
                                <TableHead class="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            <TableRow v-for="lt in leaveTypes" :key="lt.id">
                                <TableCell class="font-medium">{{ lt.name }}</TableCell>
                                <TableCell>{{ lt.days_allowed_per_year }}</TableCell>
                                <TableCell class="capitalize">{{ lt.gender_restriction ?? 'All' }}</TableCell>
                                <TableCell>{{ lt.requires_approval ? 'Required' : 'Auto' }}</TableCell>
                                <TableCell>{{ lt.applications_count }}</TableCell>
                                <TableCell class="text-right">
                                    <div class="flex justify-end gap-1">
                                        <Button size="sm" variant="ghost" @click="openEdit(lt)"><Pencil class="size-4" /></Button>
                                        <Button size="sm" variant="ghost" class="text-destructive" @click="deleteType(lt)"><Trash2 class="size-4" /></Button>
                                    </div>
                                </TableCell>
                            </TableRow>
                            <TableRow v-if="leaveTypes.length === 0">
                                <TableCell colspan="7" class="py-8 text-center text-muted-foreground">No leave types configured yet.</TableCell>
                            </TableRow>
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>

        <Dialog v-model:open="dialogOpen">
            <DialogContent class="max-w-md">
                <DialogHeader>
                    <DialogTitle>{{ editingType ? 'Edit Leave Type' : 'New Leave Type' }}</DialogTitle>
                </DialogHeader>
                <form class="space-y-4" @submit.prevent="submit">
                    <div class="space-y-1.5">
                        <Label>Name</Label>
                        <Input v-model="form.name" placeholder="e.g. Annual Leave" />
                        <p v-if="form.errors.name" class="text-sm text-destructive">{{ form.errors.name }}</p>
                    </div>
                    <div class="grid grid-cols-2 gap-3">
                        <div class="space-y-1.5">
                            <Label>Days per Year</Label>
                            <Input v-model.number="form.days_allowed_per_year" type="number" min="1" max="365" />
                        </div>
                        <div class="space-y-1.5">
                            <Label>Gender Restriction</Label>
                            <Select :model-value="form.gender_restriction || ''" @update:model-value="v => form.gender_restriction = String(v) === 'all' ? '' : String(v)">
                                <SelectTrigger><SelectValue placeholder="All Genders" /></SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All Genders</SelectItem>
                                    <SelectItem value="male">Male Only</SelectItem>
                                    <SelectItem value="female">Female Only</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                    <div class="flex flex-wrap gap-x-6 gap-y-2">
                        <label class="flex items-center gap-2 text-sm">
                            <input type="checkbox" v-model="form.requires_approval" class="size-4" />
                            Requires Approval
                        </label>
                        <label class="flex items-center gap-2 text-sm">
                            <input type="checkbox" v-model="form.requires_reliever" class="size-4" />
                            Reliever Required
                        </label>
                        <label class="flex items-center gap-2 text-sm">
                            <input type="checkbox" v-model="form.requires_document" class="size-4" />
                            Document Required
                        </label>
                    </div>
                    <div v-if="form.requires_document" class="space-y-1.5">
                        <Label>Document Label <span class="text-xs text-muted-foreground">(shown on the form)</span></Label>
                        <Input v-model="form.document_label" placeholder="e.g. Medical Certificate" />
                    </div>
                    <div class="space-y-1.5">
                        <Label>Description</Label>
                        <Textarea v-model="form.description" rows="2" />
                    </div>
                    <div class="space-y-1.5">
                        <Label>HR Officer Email</Label>
                        <Input v-model="form.hr_email" type="email" placeholder="hr@example.com" />
                        <p class="text-xs text-muted-foreground">Receives notifications when Line Manager approves a leave of this type.</p>
                        <p v-if="form.errors.hr_email" class="text-sm text-destructive">{{ form.errors.hr_email }}</p>
                    </div>
                    <DialogFooter>
                        <Button type="button" variant="outline" @click="dialogOpen = false">Cancel</Button>
                        <Button type="submit" :disabled="form.processing">Save</Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    </AppLayout>
</template>
