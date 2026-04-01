import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../../../wayfinder'
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
* @see \App\Http\Controllers\HR\PerformanceTemplateController::downloadSample
* @see app/Http/Controllers/HR/PerformanceTemplateController.php:167
* @route '/hr/performance/templates/downloads/sample'
*/
export const downloadSample = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: downloadSample.url(options),
    method: 'get',
})

downloadSample.definition = {
    methods: ["get","head"],
    url: '/hr/performance/templates/downloads/sample',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\HR\PerformanceTemplateController::downloadSample
* @see app/Http/Controllers/HR/PerformanceTemplateController.php:167
* @route '/hr/performance/templates/downloads/sample'
*/
downloadSample.url = (options?: RouteQueryOptions) => {
    return downloadSample.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\HR\PerformanceTemplateController::downloadSample
* @see app/Http/Controllers/HR/PerformanceTemplateController.php:167
* @route '/hr/performance/templates/downloads/sample'
*/
downloadSample.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: downloadSample.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\HR\PerformanceTemplateController::downloadSample
* @see app/Http/Controllers/HR/PerformanceTemplateController.php:167
* @route '/hr/performance/templates/downloads/sample'
*/
downloadSample.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: downloadSample.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\HR\PerformanceTemplateController::downloadSample
* @see app/Http/Controllers/HR/PerformanceTemplateController.php:167
* @route '/hr/performance/templates/downloads/sample'
*/
const downloadSampleForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: downloadSample.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\HR\PerformanceTemplateController::downloadSample
* @see app/Http/Controllers/HR/PerformanceTemplateController.php:167
* @route '/hr/performance/templates/downloads/sample'
*/
downloadSampleForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: downloadSample.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\HR\PerformanceTemplateController::downloadSample
* @see app/Http/Controllers/HR/PerformanceTemplateController.php:167
* @route '/hr/performance/templates/downloads/sample'
*/
downloadSampleForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: downloadSample.url({
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

downloadSample.form = downloadSampleForm

/**
* @see \App\Http\Controllers\HR\PerformanceTemplateController::downloadTemplate
* @see app/Http/Controllers/HR/PerformanceTemplateController.php:176
* @route '/hr/performance/templates/downloads/blank'
*/
export const downloadTemplate = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: downloadTemplate.url(options),
    method: 'get',
})

downloadTemplate.definition = {
    methods: ["get","head"],
    url: '/hr/performance/templates/downloads/blank',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\HR\PerformanceTemplateController::downloadTemplate
* @see app/Http/Controllers/HR/PerformanceTemplateController.php:176
* @route '/hr/performance/templates/downloads/blank'
*/
downloadTemplate.url = (options?: RouteQueryOptions) => {
    return downloadTemplate.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\HR\PerformanceTemplateController::downloadTemplate
* @see app/Http/Controllers/HR/PerformanceTemplateController.php:176
* @route '/hr/performance/templates/downloads/blank'
*/
downloadTemplate.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: downloadTemplate.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\HR\PerformanceTemplateController::downloadTemplate
* @see app/Http/Controllers/HR/PerformanceTemplateController.php:176
* @route '/hr/performance/templates/downloads/blank'
*/
downloadTemplate.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: downloadTemplate.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\HR\PerformanceTemplateController::downloadTemplate
* @see app/Http/Controllers/HR/PerformanceTemplateController.php:176
* @route '/hr/performance/templates/downloads/blank'
*/
const downloadTemplateForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: downloadTemplate.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\HR\PerformanceTemplateController::downloadTemplate
* @see app/Http/Controllers/HR/PerformanceTemplateController.php:176
* @route '/hr/performance/templates/downloads/blank'
*/
downloadTemplateForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: downloadTemplate.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\HR\PerformanceTemplateController::downloadTemplate
* @see app/Http/Controllers/HR/PerformanceTemplateController.php:176
* @route '/hr/performance/templates/downloads/blank'
*/
downloadTemplateForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: downloadTemplate.url({
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

downloadTemplate.form = downloadTemplateForm

/**
* @see \App\Http\Controllers\HR\PerformanceTemplateController::downloadBulk
* @see app/Http/Controllers/HR/PerformanceTemplateController.php:220
* @route '/hr/performance/templates/downloads/bulk'
*/
export const downloadBulk = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: downloadBulk.url(options),
    method: 'get',
})

downloadBulk.definition = {
    methods: ["get","head"],
    url: '/hr/performance/templates/downloads/bulk',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\HR\PerformanceTemplateController::downloadBulk
* @see app/Http/Controllers/HR/PerformanceTemplateController.php:220
* @route '/hr/performance/templates/downloads/bulk'
*/
downloadBulk.url = (options?: RouteQueryOptions) => {
    return downloadBulk.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\HR\PerformanceTemplateController::downloadBulk
* @see app/Http/Controllers/HR/PerformanceTemplateController.php:220
* @route '/hr/performance/templates/downloads/bulk'
*/
downloadBulk.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: downloadBulk.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\HR\PerformanceTemplateController::downloadBulk
* @see app/Http/Controllers/HR/PerformanceTemplateController.php:220
* @route '/hr/performance/templates/downloads/bulk'
*/
downloadBulk.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: downloadBulk.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\HR\PerformanceTemplateController::downloadBulk
* @see app/Http/Controllers/HR/PerformanceTemplateController.php:220
* @route '/hr/performance/templates/downloads/bulk'
*/
const downloadBulkForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: downloadBulk.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\HR\PerformanceTemplateController::downloadBulk
* @see app/Http/Controllers/HR/PerformanceTemplateController.php:220
* @route '/hr/performance/templates/downloads/bulk'
*/
downloadBulkForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: downloadBulk.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\HR\PerformanceTemplateController::downloadBulk
* @see app/Http/Controllers/HR/PerformanceTemplateController.php:220
* @route '/hr/performance/templates/downloads/bulk'
*/
downloadBulkForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: downloadBulk.url({
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

downloadBulk.form = downloadBulkForm

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
* @see \App\Http\Controllers\HR\PerformanceTemplateController::storeItem
* @see app/Http/Controllers/HR/PerformanceTemplateController.php:122
* @route '/hr/performance/templates/{template}/items'
*/
export const storeItem = (args: { template: number | { id: number } } | [template: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: storeItem.url(args, options),
    method: 'post',
})

storeItem.definition = {
    methods: ["post"],
    url: '/hr/performance/templates/{template}/items',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\HR\PerformanceTemplateController::storeItem
* @see app/Http/Controllers/HR/PerformanceTemplateController.php:122
* @route '/hr/performance/templates/{template}/items'
*/
storeItem.url = (args: { template: number | { id: number } } | [template: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
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

    return storeItem.definition.url
            .replace('{template}', parsedArgs.template.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\HR\PerformanceTemplateController::storeItem
* @see app/Http/Controllers/HR/PerformanceTemplateController.php:122
* @route '/hr/performance/templates/{template}/items'
*/
storeItem.post = (args: { template: number | { id: number } } | [template: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: storeItem.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\HR\PerformanceTemplateController::storeItem
* @see app/Http/Controllers/HR/PerformanceTemplateController.php:122
* @route '/hr/performance/templates/{template}/items'
*/
const storeItemForm = (args: { template: number | { id: number } } | [template: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: storeItem.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\HR\PerformanceTemplateController::storeItem
* @see app/Http/Controllers/HR/PerformanceTemplateController.php:122
* @route '/hr/performance/templates/{template}/items'
*/
storeItemForm.post = (args: { template: number | { id: number } } | [template: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: storeItem.url(args, options),
    method: 'post',
})

storeItem.form = storeItemForm

/**
* @see \App\Http\Controllers\HR\PerformanceTemplateController::updateItem
* @see app/Http/Controllers/HR/PerformanceTemplateController.php:139
* @route '/hr/performance/templates/{template}/items/{item}'
*/
export const updateItem = (args: { template: number | { id: number }, item: number | { id: number } } | [template: number | { id: number }, item: number | { id: number } ], options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: updateItem.url(args, options),
    method: 'patch',
})

updateItem.definition = {
    methods: ["patch"],
    url: '/hr/performance/templates/{template}/items/{item}',
} satisfies RouteDefinition<["patch"]>

/**
* @see \App\Http\Controllers\HR\PerformanceTemplateController::updateItem
* @see app/Http/Controllers/HR/PerformanceTemplateController.php:139
* @route '/hr/performance/templates/{template}/items/{item}'
*/
updateItem.url = (args: { template: number | { id: number }, item: number | { id: number } } | [template: number | { id: number }, item: number | { id: number } ], options?: RouteQueryOptions) => {
    if (Array.isArray(args)) {
        args = {
            template: args[0],
            item: args[1],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        template: typeof args.template === 'object'
        ? args.template.id
        : args.template,
        item: typeof args.item === 'object'
        ? args.item.id
        : args.item,
    }

    return updateItem.definition.url
            .replace('{template}', parsedArgs.template.toString())
            .replace('{item}', parsedArgs.item.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\HR\PerformanceTemplateController::updateItem
* @see app/Http/Controllers/HR/PerformanceTemplateController.php:139
* @route '/hr/performance/templates/{template}/items/{item}'
*/
updateItem.patch = (args: { template: number | { id: number }, item: number | { id: number } } | [template: number | { id: number }, item: number | { id: number } ], options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: updateItem.url(args, options),
    method: 'patch',
})

/**
* @see \App\Http\Controllers\HR\PerformanceTemplateController::updateItem
* @see app/Http/Controllers/HR/PerformanceTemplateController.php:139
* @route '/hr/performance/templates/{template}/items/{item}'
*/
const updateItemForm = (args: { template: number | { id: number }, item: number | { id: number } } | [template: number | { id: number }, item: number | { id: number } ], options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: updateItem.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'PATCH',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

/**
* @see \App\Http\Controllers\HR\PerformanceTemplateController::updateItem
* @see app/Http/Controllers/HR/PerformanceTemplateController.php:139
* @route '/hr/performance/templates/{template}/items/{item}'
*/
updateItemForm.patch = (args: { template: number | { id: number }, item: number | { id: number } } | [template: number | { id: number }, item: number | { id: number } ], options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: updateItem.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'PATCH',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

updateItem.form = updateItemForm

/**
* @see \App\Http\Controllers\HR\PerformanceTemplateController::destroyItem
* @see app/Http/Controllers/HR/PerformanceTemplateController.php:157
* @route '/hr/performance/templates/{template}/items/{item}'
*/
export const destroyItem = (args: { template: number | { id: number }, item: number | { id: number } } | [template: number | { id: number }, item: number | { id: number } ], options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroyItem.url(args, options),
    method: 'delete',
})

destroyItem.definition = {
    methods: ["delete"],
    url: '/hr/performance/templates/{template}/items/{item}',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\HR\PerformanceTemplateController::destroyItem
* @see app/Http/Controllers/HR/PerformanceTemplateController.php:157
* @route '/hr/performance/templates/{template}/items/{item}'
*/
destroyItem.url = (args: { template: number | { id: number }, item: number | { id: number } } | [template: number | { id: number }, item: number | { id: number } ], options?: RouteQueryOptions) => {
    if (Array.isArray(args)) {
        args = {
            template: args[0],
            item: args[1],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        template: typeof args.template === 'object'
        ? args.template.id
        : args.template,
        item: typeof args.item === 'object'
        ? args.item.id
        : args.item,
    }

    return destroyItem.definition.url
            .replace('{template}', parsedArgs.template.toString())
            .replace('{item}', parsedArgs.item.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\HR\PerformanceTemplateController::destroyItem
* @see app/Http/Controllers/HR/PerformanceTemplateController.php:157
* @route '/hr/performance/templates/{template}/items/{item}'
*/
destroyItem.delete = (args: { template: number | { id: number }, item: number | { id: number } } | [template: number | { id: number }, item: number | { id: number } ], options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroyItem.url(args, options),
    method: 'delete',
})

/**
* @see \App\Http\Controllers\HR\PerformanceTemplateController::destroyItem
* @see app/Http/Controllers/HR/PerformanceTemplateController.php:157
* @route '/hr/performance/templates/{template}/items/{item}'
*/
const destroyItemForm = (args: { template: number | { id: number }, item: number | { id: number } } | [template: number | { id: number }, item: number | { id: number } ], options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: destroyItem.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'DELETE',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

/**
* @see \App\Http\Controllers\HR\PerformanceTemplateController::destroyItem
* @see app/Http/Controllers/HR/PerformanceTemplateController.php:157
* @route '/hr/performance/templates/{template}/items/{item}'
*/
destroyItemForm.delete = (args: { template: number | { id: number }, item: number | { id: number } } | [template: number | { id: number }, item: number | { id: number } ], options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: destroyItem.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'DELETE',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

destroyItem.form = destroyItemForm

/**
* @see \App\Http\Controllers\HR\PerformanceTemplateController::downloadForEmployee
* @see app/Http/Controllers/HR/PerformanceTemplateController.php:185
* @route '/hr/performance/templates/{employee}/download'
*/
export const downloadForEmployee = (args: { employee: number | { id: number } } | [employee: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: downloadForEmployee.url(args, options),
    method: 'get',
})

downloadForEmployee.definition = {
    methods: ["get","head"],
    url: '/hr/performance/templates/{employee}/download',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\HR\PerformanceTemplateController::downloadForEmployee
* @see app/Http/Controllers/HR/PerformanceTemplateController.php:185
* @route '/hr/performance/templates/{employee}/download'
*/
downloadForEmployee.url = (args: { employee: number | { id: number } } | [employee: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
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

    return downloadForEmployee.definition.url
            .replace('{employee}', parsedArgs.employee.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\HR\PerformanceTemplateController::downloadForEmployee
* @see app/Http/Controllers/HR/PerformanceTemplateController.php:185
* @route '/hr/performance/templates/{employee}/download'
*/
downloadForEmployee.get = (args: { employee: number | { id: number } } | [employee: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: downloadForEmployee.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\HR\PerformanceTemplateController::downloadForEmployee
* @see app/Http/Controllers/HR/PerformanceTemplateController.php:185
* @route '/hr/performance/templates/{employee}/download'
*/
downloadForEmployee.head = (args: { employee: number | { id: number } } | [employee: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: downloadForEmployee.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\HR\PerformanceTemplateController::downloadForEmployee
* @see app/Http/Controllers/HR/PerformanceTemplateController.php:185
* @route '/hr/performance/templates/{employee}/download'
*/
const downloadForEmployeeForm = (args: { employee: number | { id: number } } | [employee: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: downloadForEmployee.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\HR\PerformanceTemplateController::downloadForEmployee
* @see app/Http/Controllers/HR/PerformanceTemplateController.php:185
* @route '/hr/performance/templates/{employee}/download'
*/
downloadForEmployeeForm.get = (args: { employee: number | { id: number } } | [employee: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: downloadForEmployee.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\HR\PerformanceTemplateController::downloadForEmployee
* @see app/Http/Controllers/HR/PerformanceTemplateController.php:185
* @route '/hr/performance/templates/{employee}/download'
*/
downloadForEmployeeForm.head = (args: { employee: number | { id: number } } | [employee: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: downloadForEmployee.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

downloadForEmployee.form = downloadForEmployeeForm

const PerformanceTemplateController = { index, store, downloadSample, downloadTemplate, downloadBulk, show, update, destroy, storeItem, updateItem, destroyItem, downloadForEmployee }

export default PerformanceTemplateController