import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../../wayfinder'
import items from './items'
/**
* @see \App\Http\Controllers\HR\PerformanceTemplateController::index
* @see app/Http/Controllers/HR/PerformanceTemplateController.php:19
* @route '/hr/performance/templates'
*/
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/hr/performance/templates',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\HR\PerformanceTemplateController::index
* @see app/Http/Controllers/HR/PerformanceTemplateController.php:19
* @route '/hr/performance/templates'
*/
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\HR\PerformanceTemplateController::index
* @see app/Http/Controllers/HR/PerformanceTemplateController.php:19
* @route '/hr/performance/templates'
*/
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\HR\PerformanceTemplateController::index
* @see app/Http/Controllers/HR/PerformanceTemplateController.php:19
* @route '/hr/performance/templates'
*/
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\HR\PerformanceTemplateController::index
* @see app/Http/Controllers/HR/PerformanceTemplateController.php:19
* @route '/hr/performance/templates'
*/
const indexForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\HR\PerformanceTemplateController::index
* @see app/Http/Controllers/HR/PerformanceTemplateController.php:19
* @route '/hr/performance/templates'
*/
indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\HR\PerformanceTemplateController::index
* @see app/Http/Controllers/HR/PerformanceTemplateController.php:19
* @route '/hr/performance/templates'
*/
indexForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: index.url({
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

index.form = indexForm

/**
* @see \App\Http\Controllers\HR\PerformanceTemplateController::store
* @see app/Http/Controllers/HR/PerformanceTemplateController.php:49
* @route '/hr/performance/templates'
*/
export const store = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/hr/performance/templates',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\HR\PerformanceTemplateController::store
* @see app/Http/Controllers/HR/PerformanceTemplateController.php:49
* @route '/hr/performance/templates'
*/
store.url = (options?: RouteQueryOptions) => {
    return store.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\HR\PerformanceTemplateController::store
* @see app/Http/Controllers/HR/PerformanceTemplateController.php:49
* @route '/hr/performance/templates'
*/
store.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\HR\PerformanceTemplateController::store
* @see app/Http/Controllers/HR/PerformanceTemplateController.php:49
* @route '/hr/performance/templates'
*/
const storeForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: store.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\HR\PerformanceTemplateController::store
* @see app/Http/Controllers/HR/PerformanceTemplateController.php:49
* @route '/hr/performance/templates'
*/
storeForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: store.url(options),
    method: 'post',
})

store.form = storeForm

/**
* @see \App\Http\Controllers\HR\PerformanceTemplateController::sample
* @see app/Http/Controllers/HR/PerformanceTemplateController.php:167
* @route '/hr/performance/templates/downloads/sample'
*/
export const sample = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: sample.url(options),
    method: 'get',
})

sample.definition = {
    methods: ["get","head"],
    url: '/hr/performance/templates/downloads/sample',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\HR\PerformanceTemplateController::sample
* @see app/Http/Controllers/HR/PerformanceTemplateController.php:167
* @route '/hr/performance/templates/downloads/sample'
*/
sample.url = (options?: RouteQueryOptions) => {
    return sample.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\HR\PerformanceTemplateController::sample
* @see app/Http/Controllers/HR/PerformanceTemplateController.php:167
* @route '/hr/performance/templates/downloads/sample'
*/
sample.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: sample.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\HR\PerformanceTemplateController::sample
* @see app/Http/Controllers/HR/PerformanceTemplateController.php:167
* @route '/hr/performance/templates/downloads/sample'
*/
sample.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: sample.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\HR\PerformanceTemplateController::sample
* @see app/Http/Controllers/HR/PerformanceTemplateController.php:167
* @route '/hr/performance/templates/downloads/sample'
*/
const sampleForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: sample.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\HR\PerformanceTemplateController::sample
* @see app/Http/Controllers/HR/PerformanceTemplateController.php:167
* @route '/hr/performance/templates/downloads/sample'
*/
sampleForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: sample.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\HR\PerformanceTemplateController::sample
* @see app/Http/Controllers/HR/PerformanceTemplateController.php:167
* @route '/hr/performance/templates/downloads/sample'
*/
sampleForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: sample.url({
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

sample.form = sampleForm

/**
* @see \App\Http\Controllers\HR\PerformanceTemplateController::template
* @see app/Http/Controllers/HR/PerformanceTemplateController.php:176
* @route '/hr/performance/templates/downloads/blank'
*/
export const template = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: template.url(options),
    method: 'get',
})

template.definition = {
    methods: ["get","head"],
    url: '/hr/performance/templates/downloads/blank',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\HR\PerformanceTemplateController::template
* @see app/Http/Controllers/HR/PerformanceTemplateController.php:176
* @route '/hr/performance/templates/downloads/blank'
*/
template.url = (options?: RouteQueryOptions) => {
    return template.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\HR\PerformanceTemplateController::template
* @see app/Http/Controllers/HR/PerformanceTemplateController.php:176
* @route '/hr/performance/templates/downloads/blank'
*/
template.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: template.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\HR\PerformanceTemplateController::template
* @see app/Http/Controllers/HR/PerformanceTemplateController.php:176
* @route '/hr/performance/templates/downloads/blank'
*/
template.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: template.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\HR\PerformanceTemplateController::template
* @see app/Http/Controllers/HR/PerformanceTemplateController.php:176
* @route '/hr/performance/templates/downloads/blank'
*/
const templateForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: template.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\HR\PerformanceTemplateController::template
* @see app/Http/Controllers/HR/PerformanceTemplateController.php:176
* @route '/hr/performance/templates/downloads/blank'
*/
templateForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: template.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\HR\PerformanceTemplateController::template
* @see app/Http/Controllers/HR/PerformanceTemplateController.php:176
* @route '/hr/performance/templates/downloads/blank'
*/
templateForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: template.url({
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

template.form = templateForm

/**
* @see \App\Http\Controllers\HR\PerformanceTemplateController::bulk
* @see app/Http/Controllers/HR/PerformanceTemplateController.php:220
* @route '/hr/performance/templates/downloads/bulk'
*/
export const bulk = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: bulk.url(options),
    method: 'get',
})

bulk.definition = {
    methods: ["get","head"],
    url: '/hr/performance/templates/downloads/bulk',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\HR\PerformanceTemplateController::bulk
* @see app/Http/Controllers/HR/PerformanceTemplateController.php:220
* @route '/hr/performance/templates/downloads/bulk'
*/
bulk.url = (options?: RouteQueryOptions) => {
    return bulk.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\HR\PerformanceTemplateController::bulk
* @see app/Http/Controllers/HR/PerformanceTemplateController.php:220
* @route '/hr/performance/templates/downloads/bulk'
*/
bulk.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: bulk.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\HR\PerformanceTemplateController::bulk
* @see app/Http/Controllers/HR/PerformanceTemplateController.php:220
* @route '/hr/performance/templates/downloads/bulk'
*/
bulk.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: bulk.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\HR\PerformanceTemplateController::bulk
* @see app/Http/Controllers/HR/PerformanceTemplateController.php:220
* @route '/hr/performance/templates/downloads/bulk'
*/
const bulkForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: bulk.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\HR\PerformanceTemplateController::bulk
* @see app/Http/Controllers/HR/PerformanceTemplateController.php:220
* @route '/hr/performance/templates/downloads/bulk'
*/
bulkForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: bulk.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\HR\PerformanceTemplateController::bulk
* @see app/Http/Controllers/HR/PerformanceTemplateController.php:220
* @route '/hr/performance/templates/downloads/bulk'
*/
bulkForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: bulk.url({
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

bulk.form = bulkForm

/**
* @see \App\Http\Controllers\HR\PerformanceTemplateController::show
* @see app/Http/Controllers/HR/PerformanceTemplateController.php:67
* @route '/hr/performance/templates/{template}'
*/
export const show = (args: { template: number | { id: number } } | [template: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

show.definition = {
    methods: ["get","head"],
    url: '/hr/performance/templates/{template}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\HR\PerformanceTemplateController::show
* @see app/Http/Controllers/HR/PerformanceTemplateController.php:67
* @route '/hr/performance/templates/{template}'
*/
show.url = (args: { template: number | { id: number } } | [template: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { template: args }
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
        args = { template: args.id }
    }

    if (Array.isArray(args)) {
        args = {
            template: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        template: typeof args.template === 'object'
        ? args.template.id
        : args.template,
    }

    return show.definition.url
            .replace('{template}', parsedArgs.template.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\HR\PerformanceTemplateController::show
* @see app/Http/Controllers/HR/PerformanceTemplateController.php:67
* @route '/hr/performance/templates/{template}'
*/
show.get = (args: { template: number | { id: number } } | [template: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\HR\PerformanceTemplateController::show
* @see app/Http/Controllers/HR/PerformanceTemplateController.php:67
* @route '/hr/performance/templates/{template}'
*/
show.head = (args: { template: number | { id: number } } | [template: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: show.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\HR\PerformanceTemplateController::show
* @see app/Http/Controllers/HR/PerformanceTemplateController.php:67
* @route '/hr/performance/templates/{template}'
*/
const showForm = (args: { template: number | { id: number } } | [template: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: show.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\HR\PerformanceTemplateController::show
* @see app/Http/Controllers/HR/PerformanceTemplateController.php:67
* @route '/hr/performance/templates/{template}'
*/
showForm.get = (args: { template: number | { id: number } } | [template: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: show.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\HR\PerformanceTemplateController::show
* @see app/Http/Controllers/HR/PerformanceTemplateController.php:67
* @route '/hr/performance/templates/{template}'
*/
showForm.head = (args: { template: number | { id: number } } | [template: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: show.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

show.form = showForm

/**
* @see \App\Http\Controllers\HR\PerformanceTemplateController::update
* @see app/Http/Controllers/HR/PerformanceTemplateController.php:98
* @route '/hr/performance/templates/{template}'
*/
export const update = (args: { template: number | { id: number } } | [template: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: update.url(args, options),
    method: 'patch',
})

update.definition = {
    methods: ["patch"],
    url: '/hr/performance/templates/{template}',
} satisfies RouteDefinition<["patch"]>

/**
* @see \App\Http\Controllers\HR\PerformanceTemplateController::update
* @see app/Http/Controllers/HR/PerformanceTemplateController.php:98
* @route '/hr/performance/templates/{template}'
*/
update.url = (args: { template: number | { id: number } } | [template: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { template: args }
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
        args = { template: args.id }
    }

    if (Array.isArray(args)) {
        args = {
            template: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        template: typeof args.template === 'object'
        ? args.template.id
        : args.template,
    }

    return update.definition.url
            .replace('{template}', parsedArgs.template.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\HR\PerformanceTemplateController::update
* @see app/Http/Controllers/HR/PerformanceTemplateController.php:98
* @route '/hr/performance/templates/{template}'
*/
update.patch = (args: { template: number | { id: number } } | [template: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: update.url(args, options),
    method: 'patch',
})

/**
* @see \App\Http\Controllers\HR\PerformanceTemplateController::update
* @see app/Http/Controllers/HR/PerformanceTemplateController.php:98
* @route '/hr/performance/templates/{template}'
*/
const updateForm = (args: { template: number | { id: number } } | [template: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: update.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'PATCH',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

/**
* @see \App\Http\Controllers\HR\PerformanceTemplateController::update
* @see app/Http/Controllers/HR/PerformanceTemplateController.php:98
* @route '/hr/performance/templates/{template}'
*/
updateForm.patch = (args: { template: number | { id: number } } | [template: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: update.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'PATCH',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

update.form = updateForm

/**
* @see \App\Http\Controllers\HR\PerformanceTemplateController::destroy
* @see app/Http/Controllers/HR/PerformanceTemplateController.php:112
* @route '/hr/performance/templates/{template}'
*/
export const destroy = (args: { template: number | { id: number } } | [template: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

destroy.definition = {
    methods: ["delete"],
    url: '/hr/performance/templates/{template}',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\HR\PerformanceTemplateController::destroy
* @see app/Http/Controllers/HR/PerformanceTemplateController.php:112
* @route '/hr/performance/templates/{template}'
*/
destroy.url = (args: { template: number | { id: number } } | [template: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { template: args }
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
        args = { template: args.id }
    }

    if (Array.isArray(args)) {
        args = {
            template: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        template: typeof args.template === 'object'
        ? args.template.id
        : args.template,
    }

    return destroy.definition.url
            .replace('{template}', parsedArgs.template.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\HR\PerformanceTemplateController::destroy
* @see app/Http/Controllers/HR/PerformanceTemplateController.php:112
* @route '/hr/performance/templates/{template}'
*/
destroy.delete = (args: { template: number | { id: number } } | [template: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

/**
* @see \App\Http\Controllers\HR\PerformanceTemplateController::destroy
* @see app/Http/Controllers/HR/PerformanceTemplateController.php:112
* @route '/hr/performance/templates/{template}'
*/
const destroyForm = (args: { template: number | { id: number } } | [template: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: destroy.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'DELETE',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

/**
* @see \App\Http\Controllers\HR\PerformanceTemplateController::destroy
* @see app/Http/Controllers/HR/PerformanceTemplateController.php:112
* @route '/hr/performance/templates/{template}'
*/
destroyForm.delete = (args: { template: number | { id: number } } | [template: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: destroy.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'DELETE',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

destroy.form = destroyForm

/**
* @see \App\Http\Controllers\HR\PerformanceTemplateController::employee
* @see app/Http/Controllers/HR/PerformanceTemplateController.php:185
* @route '/hr/performance/templates/{employee}/download'
*/
export const employee = (args: { employee: number | { id: number } } | [employee: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: employee.url(args, options),
    method: 'get',
})

employee.definition = {
    methods: ["get","head"],
    url: '/hr/performance/templates/{employee}/download',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\HR\PerformanceTemplateController::employee
* @see app/Http/Controllers/HR/PerformanceTemplateController.php:185
* @route '/hr/performance/templates/{employee}/download'
*/
employee.url = (args: { employee: number | { id: number } } | [employee: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { employee: args }
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
        args = { employee: args.id }
    }

    if (Array.isArray(args)) {
        args = {
            employee: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        employee: typeof args.employee === 'object'
        ? args.employee.id
        : args.employee,
    }

    return employee.definition.url
            .replace('{employee}', parsedArgs.employee.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\HR\PerformanceTemplateController::employee
* @see app/Http/Controllers/HR/PerformanceTemplateController.php:185
* @route '/hr/performance/templates/{employee}/download'
*/
employee.get = (args: { employee: number | { id: number } } | [employee: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: employee.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\HR\PerformanceTemplateController::employee
* @see app/Http/Controllers/HR/PerformanceTemplateController.php:185
* @route '/hr/performance/templates/{employee}/download'
*/
employee.head = (args: { employee: number | { id: number } } | [employee: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: employee.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\HR\PerformanceTemplateController::employee
* @see app/Http/Controllers/HR/PerformanceTemplateController.php:185
* @route '/hr/performance/templates/{employee}/download'
*/
const employeeForm = (args: { employee: number | { id: number } } | [employee: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: employee.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\HR\PerformanceTemplateController::employee
* @see app/Http/Controllers/HR/PerformanceTemplateController.php:185
* @route '/hr/performance/templates/{employee}/download'
*/
employeeForm.get = (args: { employee: number | { id: number } } | [employee: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: employee.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\HR\PerformanceTemplateController::employee
* @see app/Http/Controllers/HR/PerformanceTemplateController.php:185
* @route '/hr/performance/templates/{employee}/download'
*/
employeeForm.head = (args: { employee: number | { id: number } } | [employee: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: employee.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

employee.form = employeeForm

const templates = {
    index: Object.assign(index, index),
    store: Object.assign(store, store),
    sample: Object.assign(sample, sample),
    template: Object.assign(template, template),
    bulk: Object.assign(bulk, bulk),
    show: Object.assign(show, show),
    update: Object.assign(update, update),
    destroy: Object.assign(destroy, destroy),
    items: Object.assign(items, items),
    employee: Object.assign(employee, employee),
}

export default templates