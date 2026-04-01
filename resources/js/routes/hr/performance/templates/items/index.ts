import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../../../wayfinder'
/**
* @see \App\Http\Controllers\HR\PerformanceTemplateController::store
* @see app/Http/Controllers/HR/PerformanceTemplateController.php:122
* @route '/hr/performance/templates/{template}/items'
*/
export const store = (args: { template: number | { id: number } } | [template: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(args, options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/hr/performance/templates/{template}/items',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\HR\PerformanceTemplateController::store
* @see app/Http/Controllers/HR/PerformanceTemplateController.php:122
* @route '/hr/performance/templates/{template}/items'
*/
store.url = (args: { template: number | { id: number } } | [template: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
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

    return store.definition.url
            .replace('{template}', parsedArgs.template.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\HR\PerformanceTemplateController::store
* @see app/Http/Controllers/HR/PerformanceTemplateController.php:122
* @route '/hr/performance/templates/{template}/items'
*/
store.post = (args: { template: number | { id: number } } | [template: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\HR\PerformanceTemplateController::store
* @see app/Http/Controllers/HR/PerformanceTemplateController.php:122
* @route '/hr/performance/templates/{template}/items'
*/
const storeForm = (args: { template: number | { id: number } } | [template: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: store.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\HR\PerformanceTemplateController::store
* @see app/Http/Controllers/HR/PerformanceTemplateController.php:122
* @route '/hr/performance/templates/{template}/items'
*/
storeForm.post = (args: { template: number | { id: number } } | [template: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: store.url(args, options),
    method: 'post',
})

store.form = storeForm

/**
* @see \App\Http\Controllers\HR\PerformanceTemplateController::update
* @see app/Http/Controllers/HR/PerformanceTemplateController.php:139
* @route '/hr/performance/templates/{template}/items/{item}'
*/
export const update = (args: { template: number | { id: number }, item: number | { id: number } } | [template: number | { id: number }, item: number | { id: number } ], options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: update.url(args, options),
    method: 'patch',
})

update.definition = {
    methods: ["patch"],
    url: '/hr/performance/templates/{template}/items/{item}',
} satisfies RouteDefinition<["patch"]>

/**
* @see \App\Http\Controllers\HR\PerformanceTemplateController::update
* @see app/Http/Controllers/HR/PerformanceTemplateController.php:139
* @route '/hr/performance/templates/{template}/items/{item}'
*/
update.url = (args: { template: number | { id: number }, item: number | { id: number } } | [template: number | { id: number }, item: number | { id: number } ], options?: RouteQueryOptions) => {
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

    return update.definition.url
            .replace('{template}', parsedArgs.template.toString())
            .replace('{item}', parsedArgs.item.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\HR\PerformanceTemplateController::update
* @see app/Http/Controllers/HR/PerformanceTemplateController.php:139
* @route '/hr/performance/templates/{template}/items/{item}'
*/
update.patch = (args: { template: number | { id: number }, item: number | { id: number } } | [template: number | { id: number }, item: number | { id: number } ], options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: update.url(args, options),
    method: 'patch',
})

/**
* @see \App\Http\Controllers\HR\PerformanceTemplateController::update
* @see app/Http/Controllers/HR/PerformanceTemplateController.php:139
* @route '/hr/performance/templates/{template}/items/{item}'
*/
const updateForm = (args: { template: number | { id: number }, item: number | { id: number } } | [template: number | { id: number }, item: number | { id: number } ], options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
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
* @see app/Http/Controllers/HR/PerformanceTemplateController.php:139
* @route '/hr/performance/templates/{template}/items/{item}'
*/
updateForm.patch = (args: { template: number | { id: number }, item: number | { id: number } } | [template: number | { id: number }, item: number | { id: number } ], options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
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
* @see app/Http/Controllers/HR/PerformanceTemplateController.php:157
* @route '/hr/performance/templates/{template}/items/{item}'
*/
export const destroy = (args: { template: number | { id: number }, item: number | { id: number } } | [template: number | { id: number }, item: number | { id: number } ], options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

destroy.definition = {
    methods: ["delete"],
    url: '/hr/performance/templates/{template}/items/{item}',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\HR\PerformanceTemplateController::destroy
* @see app/Http/Controllers/HR/PerformanceTemplateController.php:157
* @route '/hr/performance/templates/{template}/items/{item}'
*/
destroy.url = (args: { template: number | { id: number }, item: number | { id: number } } | [template: number | { id: number }, item: number | { id: number } ], options?: RouteQueryOptions) => {
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

    return destroy.definition.url
            .replace('{template}', parsedArgs.template.toString())
            .replace('{item}', parsedArgs.item.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\HR\PerformanceTemplateController::destroy
* @see app/Http/Controllers/HR/PerformanceTemplateController.php:157
* @route '/hr/performance/templates/{template}/items/{item}'
*/
destroy.delete = (args: { template: number | { id: number }, item: number | { id: number } } | [template: number | { id: number }, item: number | { id: number } ], options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

/**
* @see \App\Http\Controllers\HR\PerformanceTemplateController::destroy
* @see app/Http/Controllers/HR/PerformanceTemplateController.php:157
* @route '/hr/performance/templates/{template}/items/{item}'
*/
const destroyForm = (args: { template: number | { id: number }, item: number | { id: number } } | [template: number | { id: number }, item: number | { id: number } ], options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
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
* @see app/Http/Controllers/HR/PerformanceTemplateController.php:157
* @route '/hr/performance/templates/{template}/items/{item}'
*/
destroyForm.delete = (args: { template: number | { id: number }, item: number | { id: number } } | [template: number | { id: number }, item: number | { id: number } ], options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: destroy.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'DELETE',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

destroy.form = destroyForm

const items = {
    store: Object.assign(store, store),
    update: Object.assign(update, update),
    destroy: Object.assign(destroy, destroy),
}

export default items