import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../../../wayfinder'
/**
* @see \App\Http\Controllers\HR\ResignationController::index
* @see app/Http/Controllers/HR/ResignationController.php:15
* @route '/hr/resignations'
*/
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/hr/resignations',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\HR\ResignationController::index
* @see app/Http/Controllers/HR/ResignationController.php:15
* @route '/hr/resignations'
*/
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\HR\ResignationController::index
* @see app/Http/Controllers/HR/ResignationController.php:15
* @route '/hr/resignations'
*/
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\HR\ResignationController::index
* @see app/Http/Controllers/HR/ResignationController.php:15
* @route '/hr/resignations'
*/
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\HR\ResignationController::index
* @see app/Http/Controllers/HR/ResignationController.php:15
* @route '/hr/resignations'
*/
const indexForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\HR\ResignationController::index
* @see app/Http/Controllers/HR/ResignationController.php:15
* @route '/hr/resignations'
*/
indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\HR\ResignationController::index
* @see app/Http/Controllers/HR/ResignationController.php:15
* @route '/hr/resignations'
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
* @see \App\Http\Controllers\HR\ResignationController::create
* @see app/Http/Controllers/HR/ResignationController.php:36
* @route '/hr/resignations/create'
*/
export const create = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: create.url(options),
    method: 'get',
})

create.definition = {
    methods: ["get","head"],
    url: '/hr/resignations/create',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\HR\ResignationController::create
* @see app/Http/Controllers/HR/ResignationController.php:36
* @route '/hr/resignations/create'
*/
create.url = (options?: RouteQueryOptions) => {
    return create.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\HR\ResignationController::create
* @see app/Http/Controllers/HR/ResignationController.php:36
* @route '/hr/resignations/create'
*/
create.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: create.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\HR\ResignationController::create
* @see app/Http/Controllers/HR/ResignationController.php:36
* @route '/hr/resignations/create'
*/
create.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: create.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\HR\ResignationController::create
* @see app/Http/Controllers/HR/ResignationController.php:36
* @route '/hr/resignations/create'
*/
const createForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: create.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\HR\ResignationController::create
* @see app/Http/Controllers/HR/ResignationController.php:36
* @route '/hr/resignations/create'
*/
createForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: create.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\HR\ResignationController::create
* @see app/Http/Controllers/HR/ResignationController.php:36
* @route '/hr/resignations/create'
*/
createForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: create.url({
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

create.form = createForm

/**
* @see \App\Http\Controllers\HR\ResignationController::store
* @see app/Http/Controllers/HR/ResignationController.php:48
* @route '/hr/resignations'
*/
export const store = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/hr/resignations',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\HR\ResignationController::store
* @see app/Http/Controllers/HR/ResignationController.php:48
* @route '/hr/resignations'
*/
store.url = (options?: RouteQueryOptions) => {
    return store.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\HR\ResignationController::store
* @see app/Http/Controllers/HR/ResignationController.php:48
* @route '/hr/resignations'
*/
store.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\HR\ResignationController::store
* @see app/Http/Controllers/HR/ResignationController.php:48
* @route '/hr/resignations'
*/
const storeForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: store.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\HR\ResignationController::store
* @see app/Http/Controllers/HR/ResignationController.php:48
* @route '/hr/resignations'
*/
storeForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: store.url(options),
    method: 'post',
})

store.form = storeForm

/**
* @see \App\Http\Controllers\HR\ResignationController::show
* @see app/Http/Controllers/HR/ResignationController.php:66
* @route '/hr/resignations/{resignation}'
*/
export const show = (args: { resignation: number | { id: number } } | [resignation: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

show.definition = {
    methods: ["get","head"],
    url: '/hr/resignations/{resignation}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\HR\ResignationController::show
* @see app/Http/Controllers/HR/ResignationController.php:66
* @route '/hr/resignations/{resignation}'
*/
show.url = (args: { resignation: number | { id: number } } | [resignation: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { resignation: args }
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
        args = { resignation: args.id }
    }

    if (Array.isArray(args)) {
        args = {
            resignation: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        resignation: typeof args.resignation === 'object'
        ? args.resignation.id
        : args.resignation,
    }

    return show.definition.url
            .replace('{resignation}', parsedArgs.resignation.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\HR\ResignationController::show
* @see app/Http/Controllers/HR/ResignationController.php:66
* @route '/hr/resignations/{resignation}'
*/
show.get = (args: { resignation: number | { id: number } } | [resignation: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\HR\ResignationController::show
* @see app/Http/Controllers/HR/ResignationController.php:66
* @route '/hr/resignations/{resignation}'
*/
show.head = (args: { resignation: number | { id: number } } | [resignation: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: show.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\HR\ResignationController::show
* @see app/Http/Controllers/HR/ResignationController.php:66
* @route '/hr/resignations/{resignation}'
*/
const showForm = (args: { resignation: number | { id: number } } | [resignation: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: show.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\HR\ResignationController::show
* @see app/Http/Controllers/HR/ResignationController.php:66
* @route '/hr/resignations/{resignation}'
*/
showForm.get = (args: { resignation: number | { id: number } } | [resignation: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: show.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\HR\ResignationController::show
* @see app/Http/Controllers/HR/ResignationController.php:66
* @route '/hr/resignations/{resignation}'
*/
showForm.head = (args: { resignation: number | { id: number } } | [resignation: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
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
* @see \App\Http\Controllers\HR\ResignationController::destroy
* @see app/Http/Controllers/HR/ResignationController.php:111
* @route '/hr/resignations/{resignation}'
*/
export const destroy = (args: { resignation: number | { id: number } } | [resignation: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

destroy.definition = {
    methods: ["delete"],
    url: '/hr/resignations/{resignation}',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\HR\ResignationController::destroy
* @see app/Http/Controllers/HR/ResignationController.php:111
* @route '/hr/resignations/{resignation}'
*/
destroy.url = (args: { resignation: number | { id: number } } | [resignation: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { resignation: args }
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
        args = { resignation: args.id }
    }

    if (Array.isArray(args)) {
        args = {
            resignation: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        resignation: typeof args.resignation === 'object'
        ? args.resignation.id
        : args.resignation,
    }

    return destroy.definition.url
            .replace('{resignation}', parsedArgs.resignation.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\HR\ResignationController::destroy
* @see app/Http/Controllers/HR/ResignationController.php:111
* @route '/hr/resignations/{resignation}'
*/
destroy.delete = (args: { resignation: number | { id: number } } | [resignation: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

/**
* @see \App\Http\Controllers\HR\ResignationController::destroy
* @see app/Http/Controllers/HR/ResignationController.php:111
* @route '/hr/resignations/{resignation}'
*/
const destroyForm = (args: { resignation: number | { id: number } } | [resignation: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: destroy.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'DELETE',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

/**
* @see \App\Http\Controllers\HR\ResignationController::destroy
* @see app/Http/Controllers/HR/ResignationController.php:111
* @route '/hr/resignations/{resignation}'
*/
destroyForm.delete = (args: { resignation: number | { id: number } } | [resignation: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
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
* @see \App\Http\Controllers\HR\ResignationController::accept
* @see app/Http/Controllers/HR/ResignationController.php:75
* @route '/hr/resignations/{resignation}/accept'
*/
export const accept = (args: { resignation: number | { id: number } } | [resignation: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: accept.url(args, options),
    method: 'post',
})

accept.definition = {
    methods: ["post"],
    url: '/hr/resignations/{resignation}/accept',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\HR\ResignationController::accept
* @see app/Http/Controllers/HR/ResignationController.php:75
* @route '/hr/resignations/{resignation}/accept'
*/
accept.url = (args: { resignation: number | { id: number } } | [resignation: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { resignation: args }
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
        args = { resignation: args.id }
    }

    if (Array.isArray(args)) {
        args = {
            resignation: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        resignation: typeof args.resignation === 'object'
        ? args.resignation.id
        : args.resignation,
    }

    return accept.definition.url
            .replace('{resignation}', parsedArgs.resignation.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\HR\ResignationController::accept
* @see app/Http/Controllers/HR/ResignationController.php:75
* @route '/hr/resignations/{resignation}/accept'
*/
accept.post = (args: { resignation: number | { id: number } } | [resignation: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: accept.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\HR\ResignationController::accept
* @see app/Http/Controllers/HR/ResignationController.php:75
* @route '/hr/resignations/{resignation}/accept'
*/
const acceptForm = (args: { resignation: number | { id: number } } | [resignation: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: accept.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\HR\ResignationController::accept
* @see app/Http/Controllers/HR/ResignationController.php:75
* @route '/hr/resignations/{resignation}/accept'
*/
acceptForm.post = (args: { resignation: number | { id: number } } | [resignation: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: accept.url(args, options),
    method: 'post',
})

accept.form = acceptForm

/**
* @see \App\Http\Controllers\HR\ResignationController::updateChecklist
* @see app/Http/Controllers/HR/ResignationController.php:90
* @route '/hr/resignations/{resignation}/checklist'
*/
export const updateChecklist = (args: { resignation: number | { id: number } } | [resignation: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: updateChecklist.url(args, options),
    method: 'post',
})

updateChecklist.definition = {
    methods: ["post"],
    url: '/hr/resignations/{resignation}/checklist',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\HR\ResignationController::updateChecklist
* @see app/Http/Controllers/HR/ResignationController.php:90
* @route '/hr/resignations/{resignation}/checklist'
*/
updateChecklist.url = (args: { resignation: number | { id: number } } | [resignation: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { resignation: args }
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
        args = { resignation: args.id }
    }

    if (Array.isArray(args)) {
        args = {
            resignation: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        resignation: typeof args.resignation === 'object'
        ? args.resignation.id
        : args.resignation,
    }

    return updateChecklist.definition.url
            .replace('{resignation}', parsedArgs.resignation.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\HR\ResignationController::updateChecklist
* @see app/Http/Controllers/HR/ResignationController.php:90
* @route '/hr/resignations/{resignation}/checklist'
*/
updateChecklist.post = (args: { resignation: number | { id: number } } | [resignation: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: updateChecklist.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\HR\ResignationController::updateChecklist
* @see app/Http/Controllers/HR/ResignationController.php:90
* @route '/hr/resignations/{resignation}/checklist'
*/
const updateChecklistForm = (args: { resignation: number | { id: number } } | [resignation: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: updateChecklist.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\HR\ResignationController::updateChecklist
* @see app/Http/Controllers/HR/ResignationController.php:90
* @route '/hr/resignations/{resignation}/checklist'
*/
updateChecklistForm.post = (args: { resignation: number | { id: number } } | [resignation: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: updateChecklist.url(args, options),
    method: 'post',
})

updateChecklist.form = updateChecklistForm

const ResignationController = { index, create, store, show, destroy, accept, updateChecklist }

export default ResignationController