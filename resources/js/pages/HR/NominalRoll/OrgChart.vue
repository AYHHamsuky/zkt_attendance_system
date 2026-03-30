<script setup lang="ts">
import AppLayout from '@/layouts/AppLayout.vue'
import { Head, router } from '@inertiajs/vue3'
import { Users, ChevronDown, ChevronRight, Home, User } from 'lucide-vue-next'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { ref } from 'vue'

interface OrgEmployee {
    id: number
    name: string
    position: string | null
    department: string | null
    job_grade: string | null
    photo_url: string | null
    direct_reports_count: number
}

const props = defineProps<{
    focal: OrgEmployee | null
    roots: OrgEmployee[]
    directReports: OrgEmployee[]
    ancestors: OrgEmployee[]
    departments: string[]
}>()

const selectedDept = ref('')

function navigate(employeeId: number) {
    router.get('/hr/nominal-roll/org-chart', { employee_id: employeeId }, { preserveScroll: true })
}

function filterByDept() {
    if (!selectedDept.value) { return }
    router.get('/hr/nominal-roll', { department: selectedDept.value })
}

function goToTop() {
    router.get('/hr/nominal-roll/org-chart')
}

function initials(name: string) {
    return name.split(' ').slice(0, 2).map(w => w[0]).join('').toUpperCase()
}

const avatarColors = [
    'bg-blue-500', 'bg-purple-500', 'bg-green-500', 'bg-orange-500',
    'bg-pink-500', 'bg-teal-500', 'bg-indigo-500', 'bg-red-500',
]

function avatarColor(name: string) {
    const idx = name.charCodeAt(0) % avatarColors.length
    return avatarColors[idx]
}
</script>

<template>
    <Head title="Organisation Chart" />
    <AppLayout>
        <div class="space-y-6 p-6">
            <!-- Header -->
            <div class="flex items-center justify-between">
                <div>
                    <h1 class="text-2xl font-bold">Organisation Chart</h1>
                    <p class="text-muted-foreground text-sm">Click any card to drill down into the hierarchy</p>
                </div>
                <div class="flex items-center gap-3">
                    <Select v-model="selectedDept" @update:modelValue="filterByDept">
                        <SelectTrigger class="w-52">
                            <SelectValue placeholder="Jump to department…" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem v-for="dept in departments" :key="dept" :value="dept">
                                {{ dept }}
                            </SelectItem>
                        </SelectContent>
                    </Select>
                    <Button variant="outline" @click="goToTop">
                        <Home class="mr-2 h-4 w-4" />
                        Top Level
                    </Button>
                    <Button variant="outline" href="/hr/nominal-roll" as="a">
                        <Users class="mr-2 h-4 w-4" />
                        Staff List
                    </Button>
                </div>
            </div>

            <!-- ── TOP-LEVEL VIEW (no focal selected) ── -->
            <template v-if="!focal">
                <div class="text-center">
                    <p class="text-muted-foreground text-sm mb-4">
                        Showing {{ roots.length }} top-level employees. Click any card to view their direct reports.
                    </p>
                </div>
                <div class="flex flex-wrap justify-center gap-4">
                    <div
                        v-for="root in roots"
                        :key="root.id"
                        class="flex flex-col items-center"
                    >
                        <Card
                            class="w-52 cursor-pointer transition-shadow hover:shadow-md hover:border-primary/50"
                            @click="navigate(root.id)"
                        >
                            <CardContent class="p-3">
                                <div class="flex flex-col items-center gap-2 text-center">
                                    <div class="h-12 w-12 rounded-full overflow-hidden">
                                        <img
                                            v-if="root.photo_url"
                                            :src="root.photo_url"
                                            :alt="root.name"
                                            class="h-full w-full object-cover"
                                        />
                                        <div
                                            v-else
                                            :class="[avatarColor(root.name), 'flex h-full w-full items-center justify-center text-white text-sm font-bold']"
                                        >
                                            {{ initials(root.name) }}
                                        </div>
                                    </div>
                                    <div>
                                        <p class="font-medium text-sm leading-tight">{{ root.name }}</p>
                                        <p class="text-muted-foreground text-xs mt-0.5 line-clamp-1">{{ root.position ?? '—' }}</p>
                                        <p v-if="root.department" class="text-muted-foreground text-xs line-clamp-1">{{ root.department }}</p>
                                    </div>
                                    <Badge v-if="root.job_grade" variant="outline" class="text-xs">
                                        {{ root.job_grade }}
                                    </Badge>
                                    <div
                                        v-if="root.direct_reports_count > 0"
                                        class="flex items-center gap-1 text-primary text-xs font-medium"
                                    >
                                        <ChevronDown class="h-3 w-3" />
                                        <span>{{ root.direct_reports_count }} below</span>
                                    </div>
                                    <span v-else class="text-muted-foreground text-xs">No reports</span>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </template>

            <!-- ── DRILL-DOWN VIEW (focal selected) ── -->
            <template v-else>
                <!-- Ancestor chain (breadcrumb style) -->
                <div v-if="ancestors.length" class="flex flex-wrap items-center gap-2">
                    <button class="flex items-center gap-1" @click="goToTop">
                        <span class="text-primary hover:underline cursor-pointer text-sm font-medium">Top Level</span>
                    </button>
                    <ChevronRight class="h-4 w-4 text-muted-foreground" />
                    <button
                        v-for="(ancestor, i) in ancestors"
                        :key="ancestor.id"
                        class="flex items-center gap-1"
                        @click="navigate(ancestor.id)"
                    >
                        <span class="text-primary hover:underline cursor-pointer text-sm font-medium">
                            {{ ancestor.name }}
                        </span>
                        <ChevronRight v-if="i < ancestors.length - 1" class="h-4 w-4 text-muted-foreground" />
                    </button>
                    <ChevronRight class="h-4 w-4 text-muted-foreground" />
                    <span class="text-sm font-semibold">{{ focal.name }}</span>
                </div>

                <!-- Focal employee (centre card) -->
                <div class="flex justify-center">
                    <Card class="border-primary w-72 border-2 shadow-md">
                        <CardContent class="p-4">
                            <div class="flex flex-col items-center gap-3 text-center">
                                <div class="h-16 w-16 rounded-full overflow-hidden ring-2 ring-primary/30">
                                    <img
                                        v-if="focal.photo_url"
                                        :src="focal.photo_url"
                                        :alt="focal.name"
                                        class="h-full w-full object-cover"
                                    />
                                    <div
                                        v-else
                                        :class="[avatarColor(focal.name), 'flex h-full w-full items-center justify-center text-white text-xl font-bold']"
                                    >
                                        {{ initials(focal.name) }}
                                    </div>
                                </div>
                                <div>
                                    <p class="font-semibold text-base leading-tight">{{ focal.name }}</p>
                                    <p class="text-muted-foreground text-sm">{{ focal.position ?? '—' }}</p>
                                    <p class="text-muted-foreground text-xs mt-0.5">{{ focal.department }}</p>
                                </div>
                                <Badge v-if="focal.job_grade" variant="secondary" class="text-xs">
                                    {{ focal.job_grade }}
                                </Badge>
                                <div class="flex items-center gap-1 text-muted-foreground text-xs">
                                    <Users class="h-3 w-3" />
                                    <span>{{ focal.direct_reports_count }} direct report{{ focal.direct_reports_count !== 1 ? 's' : '' }}</span>
                                </div>
                                <div class="flex gap-2 mt-1">
                                    <Button size="sm" variant="outline" :href="`/hr/nominal-roll/${focal.id}`" as="a">
                                        <User class="mr-1 h-3 w-3" />
                                        Profile
                                    </Button>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                <!-- Connector -->
                <div v-if="directReports.length" class="flex justify-center">
                    <div class="w-0.5 h-8 bg-border" />
                </div>

                <!-- Direct reports grid -->
                <div v-if="directReports.length">
                    <h2 class="text-muted-foreground mb-4 text-center text-sm font-medium uppercase tracking-wide">
                        Direct Reports ({{ directReports.length }})
                    </h2>

                    <!-- Horizontal connector bar -->
                    <div v-if="directReports.length > 1" class="relative flex justify-center mb-0">
                        <div
                            class="h-0.5 bg-border absolute top-0"
                            :style="{ width: Math.min(directReports.length * 220, 1200) + 'px' }"
                        />
                    </div>

                    <div class="flex flex-wrap justify-center gap-4 pt-4">
                        <div
                            v-for="report in directReports"
                            :key="report.id"
                            class="flex flex-col items-center"
                        >
                            <!-- Vertical connector to card -->
                            <div class="w-0.5 h-4 bg-border" />

                            <Card
                                class="w-52 cursor-pointer transition-shadow hover:shadow-md hover:border-primary/50"
                                @click="navigate(report.id)"
                            >
                                <CardContent class="p-3">
                                    <div class="flex flex-col items-center gap-2 text-center">
                                        <div class="h-12 w-12 rounded-full overflow-hidden">
                                            <img
                                                v-if="report.photo_url"
                                                :src="report.photo_url"
                                                :alt="report.name"
                                                class="h-full w-full object-cover"
                                            />
                                            <div
                                                v-else
                                                :class="[avatarColor(report.name), 'flex h-full w-full items-center justify-center text-white text-sm font-bold']"
                                            >
                                                {{ initials(report.name) }}
                                            </div>
                                        </div>
                                        <div>
                                            <p class="font-medium text-sm leading-tight">{{ report.name }}</p>
                                            <p class="text-muted-foreground text-xs mt-0.5 line-clamp-1">{{ report.position ?? '—' }}</p>
                                        </div>
                                        <Badge v-if="report.job_grade" variant="outline" class="text-xs">
                                            {{ report.job_grade }}
                                        </Badge>
                                        <div
                                            v-if="report.direct_reports_count > 0"
                                            class="flex items-center gap-1 text-primary text-xs font-medium"
                                        >
                                            <ChevronDown class="h-3 w-3" />
                                            <span>{{ report.direct_reports_count }} below</span>
                                        </div>
                                        <span v-else class="text-muted-foreground text-xs">No reports</span>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </div>

                <div v-else class="text-center py-8 text-muted-foreground text-sm">
                    This employee has no direct reports.
                </div>
            </template>
        </div>
    </AppLayout>
</template>
