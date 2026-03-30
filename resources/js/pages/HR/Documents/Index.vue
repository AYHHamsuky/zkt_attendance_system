<script setup lang="ts">
import { Head, router, useForm } from '@inertiajs/vue3';
import AppLayout from '@/layouts/AppLayout.vue';
import { type BreadcrumbItem } from '@/types';
import { Card, CardContent } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
    Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter,
} from '@/components/ui/dialog';
import { Plus, Download, Trash2, FolderOpen, AlertTriangle } from 'lucide-vue-next';
import { ref, watch } from 'vue';
import { debounce } from '@/lib/debounce';

interface Document {
    id: number;
    title: string;
    document_type: string;
    file_name: string;
    file_size: number;
    mime_type: string;
    expires_at: string | null;
    created_at: string;
    employee: { id: number; name: string };
    uploadedBy: { name: string };
}

interface Employee { id: number; name: string }

interface PaginatedData {
    data: Document[];
    current_page: number;
    last_page: number;
    total: number;
    links: Array<{ url: string | null; label: string; active: boolean }>;
}

const props = defineProps<{
    documents: PaginatedData;
    employees: Employee[];
    filters: { employee_id?: string; document_type?: string; expiring?: string };
}>();

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'HR Management', href: '/hr' },
    { title: 'Documents' },
];

const employeeId = ref(props.filters.employee_id ?? '');
const documentType = ref(props.filters.document_type ?? '');

const applyFilters = debounce(() => {
    router.get('/hr/documents', {
        employee_id: employeeId.value || undefined,
        document_type: documentType.value || undefined,
    }, { preserveState: true, replace: true });
}, 300);

watch([employeeId, documentType], () => applyFilters());

// Upload
const uploadDialogOpen = ref(false);
const uploadForm = useForm({
    employee_id: '',
    title: '',
    document_type: 'certificate',
    file: null as File | null,
    expires_at: '',
});

function onFileChange(e: Event) {
    const target = e.target as HTMLInputElement;
    uploadForm.file = target.files?.[0] ?? null;
}

function submitUpload() {
    uploadForm.post('/hr/documents', {
        forceFormData: true,
        onSuccess: () => { uploadDialogOpen.value = false; uploadForm.reset(); },
    });
}

function deleteDoc(id: number, name: string) {
    if (confirm(`Delete "${name}"?`)) {
        router.delete(`/hr/documents/${id}`);
    }
}

function isExpiringSoon(expiresAt: string | null): boolean {
    if (!expiresAt) { return false; }
    const diff = new Date(expiresAt).getTime() - Date.now();
    return diff > 0 && diff < 30 * 24 * 60 * 60 * 1000;
}

function formatBytes(bytes: number): string {
    if (bytes >= 1048576) { return `${(bytes / 1048576).toFixed(1)} MB`; }
    return `${(bytes / 1024).toFixed(0)} KB`;
}
</script>

<template>
    <Head title="Employee Documents" />
    <AppLayout :breadcrumbs="breadcrumbs">
        <div class="flex h-full flex-1 flex-col gap-4 p-4 md:p-6">
            <div class="flex items-center justify-between">
                <div>
                    <h2 class="text-2xl font-bold">Employee Documents</h2>
                    <p class="text-muted-foreground">{{ documents.total }} documents</p>
                </div>
                <Button @click="uploadDialogOpen = true"><Plus class="mr-2 size-4" />Upload Document</Button>
            </div>

            <div class="flex flex-wrap gap-3">
                <Select :model-value="employeeId || 'all'" @update:model-value="v => employeeId = String(v) === 'all' ? '' : String(v)">
                    <SelectTrigger class="w-[200px]"><SelectValue placeholder="Filter by employee" /></SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">All Employees</SelectItem>
                        <SelectItem v-for="emp in employees" :key="emp.id" :value="String(emp.id)">{{ emp.name }}</SelectItem>
                    </SelectContent>
                </Select>
                <Select :model-value="documentType || 'all'" @update:model-value="v => documentType = String(v) === 'all' ? '' : String(v)">
                    <SelectTrigger class="w-[180px]"><SelectValue placeholder="Document type" /></SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">All Types</SelectItem>
                        <SelectItem value="certificate">Certificate</SelectItem>
                        <SelectItem value="national_id">National ID</SelectItem>
                        <SelectItem value="contract">Contract</SelectItem>
                        <SelectItem value="appointment_letter">Appointment Letter</SelectItem>
                        <SelectItem value="passport">Passport</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            <Card>
                <CardContent class="p-0">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Title</TableHead>
                                <TableHead>Employee</TableHead>
                                <TableHead>Type</TableHead>
                                <TableHead>Size</TableHead>
                                <TableHead>Expires</TableHead>
                                <TableHead>Uploaded</TableHead>
                                <TableHead class="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            <TableRow v-for="doc in documents.data" :key="doc.id">
                                <TableCell>
                                    <div class="flex items-center gap-2">
                                        <span class="font-medium">{{ doc.title }}</span>
                                        <AlertTriangle v-if="isExpiringSoon(doc.expires_at)" class="size-4 text-orange-500" />
                                    </div>
                                    <p class="text-xs text-muted-foreground">{{ doc.file_name }}</p>
                                </TableCell>
                                <TableCell>{{ doc.employee.name }}</TableCell>
                                <TableCell>
                                    <Badge variant="secondary" class="capitalize text-xs">{{ doc.document_type.replace('_', ' ') }}</Badge>
                                </TableCell>
                                <TableCell class="text-sm">{{ formatBytes(doc.file_size) }}</TableCell>
                                <TableCell>
                                    <span v-if="doc.expires_at" :class="isExpiringSoon(doc.expires_at) ? 'text-orange-600 font-medium' : ''">
                                        {{ doc.expires_at }}
                                    </span>
                                    <span v-else class="text-muted-foreground">—</span>
                                </TableCell>
                                <TableCell class="text-sm text-muted-foreground">{{ doc.uploadedBy.name }}</TableCell>
                                <TableCell class="text-right">
                                    <div class="flex justify-end gap-1">
                                        <Button size="sm" variant="ghost" as-child>
                                            <a :href="`/hr/documents/${doc.id}/download`" download><Download class="size-4" /></a>
                                        </Button>
                                        <Button size="sm" variant="ghost" class="text-destructive" @click="deleteDoc(doc.id, doc.title)">
                                            <Trash2 class="size-4" />
                                        </Button>
                                    </div>
                                </TableCell>
                            </TableRow>
                            <TableRow v-if="documents.data.length === 0">
                                <TableCell colspan="7" class="py-8 text-center text-muted-foreground">
                                    <FolderOpen class="size-8 mx-auto mb-2 opacity-50" />
                                    No documents found.
                                </TableCell>
                            </TableRow>
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>

            <div v-if="documents.last_page > 1" class="flex items-center justify-center gap-1">
                <template v-for="link in documents.links" :key="link.label">
                    <Button v-if="link.url" size="sm" :variant="link.active ? 'default' : 'outline'" as-child>
                        <a :href="link.url" v-html="link.label" />
                    </Button>
                    <Button v-else size="sm" variant="outline" disabled v-html="link.label" />
                </template>
            </div>
        </div>

        <!-- Upload Dialog -->
        <Dialog v-model:open="uploadDialogOpen">
            <DialogContent class="max-w-md">
                <DialogHeader><DialogTitle>Upload Document</DialogTitle></DialogHeader>
                <form class="space-y-4" @submit.prevent="submitUpload">
                    <div class="space-y-1.5">
                        <Label>Employee</Label>
                        <Select :model-value="uploadForm.employee_id || ''" @update:model-value="v => uploadForm.employee_id = String(v)">
                            <SelectTrigger><SelectValue placeholder="Select employee" /></SelectTrigger>
                            <SelectContent>
                                <SelectItem v-for="emp in employees" :key="emp.id" :value="String(emp.id)">{{ emp.name }}</SelectItem>
                            </SelectContent>
                        </Select>
                        <p v-if="uploadForm.errors.employee_id" class="text-sm text-destructive">{{ uploadForm.errors.employee_id }}</p>
                    </div>
                    <div class="space-y-1.5">
                        <Label>Title</Label>
                        <Input v-model="uploadForm.title" placeholder="Document title" />
                        <p v-if="uploadForm.errors.title" class="text-sm text-destructive">{{ uploadForm.errors.title }}</p>
                    </div>
                    <div class="space-y-1.5">
                        <Label>Document Type</Label>
                        <Select :model-value="uploadForm.document_type" @update:model-value="v => uploadForm.document_type = String(v)">
                            <SelectTrigger><SelectValue /></SelectTrigger>
                            <SelectContent>
                                <SelectItem value="certificate">Certificate</SelectItem>
                                <SelectItem value="national_id">National ID</SelectItem>
                                <SelectItem value="contract">Contract</SelectItem>
                                <SelectItem value="appointment_letter">Appointment Letter</SelectItem>
                                <SelectItem value="passport">Passport</SelectItem>
                                <SelectItem value="other">Other</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <div class="space-y-1.5">
                        <Label>File</Label>
                        <Input type="file" accept=".pdf,.jpg,.jpeg,.png,.doc,.docx" @change="onFileChange" />
                        <p v-if="uploadForm.errors.file" class="text-sm text-destructive">{{ uploadForm.errors.file }}</p>
                    </div>
                    <div class="space-y-1.5">
                        <Label>Expiry Date <span class="text-muted-foreground text-xs">(optional)</span></Label>
                        <Input v-model="uploadForm.expires_at" type="date" />
                    </div>
                    <DialogFooter>
                        <Button type="button" variant="outline" @click="uploadDialogOpen = false">Cancel</Button>
                        <Button type="submit" :disabled="uploadForm.processing">Upload</Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    </AppLayout>
</template>
