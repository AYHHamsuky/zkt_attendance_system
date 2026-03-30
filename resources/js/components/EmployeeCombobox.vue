<script setup lang="ts">
import { ref, watch } from 'vue';
import { Input } from '@/components/ui/input';

interface Employee {
    id: number;
    name: string;
    department: string | null;
    position?: string | null;
}

const props = defineProps<{
    modelValue: string | number | null;
    placeholder?: string;
    disabled?: boolean;
    initialEmployee?: { id: number; name: string } | null;
    excludeId?: number | null;
    department?: string | null;
}>();

const emit = defineEmits<{ 'update:modelValue': [value: string] }>();

const query = ref(props.initialEmployee?.name ?? '');
const results = ref<Employee[]>([]);
const open = ref(false);
const loading = ref(false);
let debounce: ReturnType<typeof setTimeout> | null = null;

watch(() => props.initialEmployee, (emp) => {
    if (emp) query.value = emp.name;
});

watch(() => props.modelValue, (val) => {
    if (!val) query.value = '';
});

function onInput(val: string | number) {
    const str = String(val);
    query.value = str;
    emit('update:modelValue', '');

    if (debounce) clearTimeout(debounce);

    if (str.trim().length < 1) {
        results.value = [];
        open.value = false;
        return;
    }

    debounce = setTimeout(async () => {
        loading.value = true;
        try {
            const exclude = props.excludeId ? `&exclude_id=${props.excludeId}` : '';
            const dept = props.department ? `&department=${encodeURIComponent(props.department)}` : '';
            const res = await fetch(`/hr/employees/search?q=${encodeURIComponent(str)}${exclude}${dept}`);
            results.value = await res.json();
            open.value = results.value.length > 0;
        } finally {
            loading.value = false;
        }
    }, 150);
}

function select(emp: Employee) {
    query.value = emp.name;
    emit('update:modelValue', String(emp.id));
    results.value = [];
    open.value = false;
}

function onBlur() {
    setTimeout(() => { open.value = false; }, 180);
}
</script>

<template>
    <div class="relative">
        <Input
            :model-value="query"
            :placeholder="placeholder ?? 'Type name to search...'"
            :disabled="disabled"
            autocomplete="off"
            @update:model-value="onInput"
            @blur="onBlur"
            @focus="results.length ? open = true : null"
        />
        <div
            v-if="open"
            class="absolute z-50 mt-1 w-full max-h-60 overflow-y-auto rounded-md border bg-background shadow-lg"
        >
            <p v-if="loading" class="px-3 py-2 text-sm text-muted-foreground">Searching…</p>
            <button
                v-for="emp in results"
                :key="emp.id"
                type="button"
                class="flex w-full flex-col px-3 py-2 text-left text-sm hover:bg-accent focus:bg-accent outline-none"
                @mousedown.prevent="select(emp)"
            >
                <span class="font-medium leading-tight">{{ emp.name }}</span>
                <span v-if="emp.department || emp.position" class="text-xs text-muted-foreground">
                    {{ [emp.position, emp.department].filter(Boolean).join(' · ') }}
                </span>
            </button>
        </div>
    </div>
</template>
