import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../wayfinder'
/**
* @see \App\Http\Controllers\HR\TransferController::index
* @see app/Http/Controllers/HR/TransferController.php:15
* @route '/hr/transfers'
*/
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/hr/transfers',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\HR\TransferController::index
* @see app/Http/Controllers/HR/TransferController.php:15
* @route '/hr/transfers'
*/
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\HR\TransferController::index
* @see app/Http/Controllers/HR/TransferController.php:15
* @route '/hr/transfers'
*/
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\HR\TransferController::index
* @see app/Http/Controllers/HR/TransferController.php:15
* @route '/hr/transfers'
*/
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\HR\TransferController::index
* @see app/Http/Controllers/HR/TransferController.php:15
* @route '/hr/transfers'
*/
const indexForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\HR\TransferController::index
* @see app/Http/Controllers/HR/TransferController.php:15
* @route '/hr/transfers'
*/
indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\HR\TransferController::index
* @see app/Http/Controllers/HR/TransferController.php:15
* @route '/hr/transfers'
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
* @see \App\Http\Controllers\HR\TransferController::create
* @see app/Http/Controllers/HR/TransferController.php:36
* @route '/hr/transfers/create'
*/
export const create = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: create.url(options),
    method: 'get',
})

create.definition = {
    methods: ["get","head"],
    url: '/hr/transfers/create',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\HR\TransferController::create
* @see app/Http/Controllers/HR/TransferController.php:36
* @route '/hr/transfers/create'
*/
create.url = (options?: RouteQueryOptions) => {
    return create.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\HR\TransferController::create
* @see app/Http/Controllers/HR/TransferController.php:36
* @route '/hr/transfers/create'
*/
create.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: create.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\HR\TransferController::create
* @see app/Http/Controllers/HR/TransferController.php:36
* @route '/hr/transfers/create'
*/
create.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: create.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\HR\TransferController::create
* @see app/Http/Controllers/HR/TransferController.php:36
* @route '/hr/transfers/create'
*/
const createForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: create.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\HR\TransferController::create
* @see app/Http/Controllers/HR/TransferController.php:36
* @route '/hr/transfers/create'
*/
createForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: create.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\HR\TransferController::create
* @see app/Http/Controllers/HR/TransferController.php:36
* @route '/hr/transfers/create'
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
* @see \App\Http\Controllers\HR\TransferController::store
* @see app/Http/Controllers/HR/TransferController.php:53
* @route '/hr/transfers'
*/
export const store = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/hr/transfers',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\HR\TransferController::store
* @see app/Http/Controllers/HR/TransferController.php:53
* @route '/hr/transfers'
*/
store.url = (options?: RouteQueryOptions) => {
    return store.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\HR\TransferController::store
* @see app/Http/Controllers/HR/TransferController.php:53
* @route '/hr/transfers'
*/
store.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\HR\TransferController::store
* @see app/Http/Controllers/HR/TransferController.php:53
* @route '/hr/transfers'
*/
const storeForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: store.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\HR\TransferController::store
* @see app/Http/Controllers/HR/TransferController.php:53
* @route '/hr/transfers'
*/
storeForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: store.url(options),
    method: 'post',
})

store.form = storeForm

/**
* @see \App\Http\Controllers\HR\TransferController::show
* @see app/Http/Controllers/HR/TransferController.php:80
* @route '/hr/transfers/{transfer}'
*/
export const show = (args: { transfer: number | { id: number } } | [transfer: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

show.definition = {
    methods: ["get","head"],
    url: '/hr/transfers/{transfer}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\HR\TransferController::show
* @see app/Http/Controllers/HR/TransferController.php:80
* @route '/hr/transfers/{transfer}'
*/
show.url = (args: { transfer: number | { id: number } } | [transfer: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { transfer: args }
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
        args = { transfer: args.id }
    }

    if (Array.isArray(args)) {
        args = {
            transfer: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        transfer: typeof args.transfer === 'object'
        ? args.transfer.id
        : args.transfer,
    }

    return show.definition.url
            .replace('{transfer}', parsedArgs.transfer.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\HR\TransferController::show
* @see app/Http/Controllers/HR/TransferController.php:80
* @route '/hr/transfers/{transfer}'
*/
show.get = (args: { transfer: number | { id: number } } | [transfer: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\HR\TransferController::show
* @see app/Http/Controllers/HR/TransferController.php:80
* @route '/hr/transfers/{transfer}'
*/
show.head = (args: { transfer: number | { id: number } } | [transfer: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: show.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\HR\TransferController::show
* @see app/Http/Controllers/HR/TransferController.php:80
* @route '/hr/transfers/{transfer}'
*/
const showForm = (args: { transfer: number | { id: number } } | [transfer: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: show.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\HR\TransferController::show
* @see app/Http/Controllers/HR/TransferController.php:80
* @route '/hr/transfers/{transfer}'
*/
showForm.get = (args: { transfer: number | { id: number } } | [transfer: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: show.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\HR\TransferController::show
* @see app/Http/Controllers/HR/TransferController.php:80
* @route '/hr/transfers/{transfer}'
*/
showForm.head = (args: { transfer: number | { id: number } } | [transfer: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
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
* @see \App\Http\Controllers\HR\TransferController::destroy
* @see app/Http/Controllers/HR/TransferController.php:134
* @route '/hr/transfers/{transfer}'
*/
export const destroy = (args: { transfer: number | { id: number } } | [transfer: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

destroy.definition = {
    methods: ["delete"],
    url: '/hr/transfers/{transfer}',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\HR\TransferController::destroy
* @see app/Http/Controllers/HR/TransferController.php:134
* @route '/hr/transfers/{transfer}'
*/
destroy.url = (args: { transfer: number | { id: number } } | [transfer: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { transfer: args }
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
        args = { transfer: args.id }
    }

    if (Array.isArray(args)) {
        args = {
            transfer: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        transfer: typeof args.transfer === 'object'
        ? args.transfer.id
        : args.transfer,
    }

    return destroy.definition.url
            .replace('{transfer}', parsedArgs.transfer.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\HR\TransferController::destroy
* @see app/Http/Controllers/HR/TransferController.php:134
* @route '/hr/transfers/{transfer}'
*/
destroy.delete = (args: { transfer: number | { id: number } } | [transfer: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

/**
* @see \App\Http\Controllers\HR\TransferController::destroy
* @see app/Http/Controllers/HR/TransferController.php:134
* @route '/hr/transfers/{transfer}'
*/
const destroyForm = (args: { transfer: number | { id: number } } | [transfer: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: destroy.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'DELETE',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

/**
* @see \App\Http\Controllers\HR\TransferController::destroy
* @see app/Http/Controllers/HR/TransferController.php:134
* @route '/hr/transfers/{transfer}'
*/
destroyForm.delete = (args: { transfer: number | { id: number } } | [transfer: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
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
* @see \App\Http\Controllers\HR\TransferController::approve
* @see app/Http/Controllers/HR/TransferController.php:89
* @route '/hr/transfers/{transfer}/approve'
*/
export const approve = (args: { transfer: number | { id: number } } | [transfer: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: approve.url(args, options),
    method: 'post',
})

approve.definition = {
    methods: ["post"],
    url: '/hr/transfers/{transfer}/approve',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\HR\TransferController::approve
* @see app/Http/Controllers/HR/TransferController.php:89
* @route '/hr/transfers/{transfer}/approve'
*/
approve.url = (args: { transfer: number | { id: number } } | [transfer: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { transfer: args }
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
        args = { transfer: args.id }
    }

    if (Array.isArray(args)) {
        args = {
            transfer: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        transfer: typeof args.transfer === 'object'
        ? args.transfer.id
        : args.transfer,
    }

    return approve.definition.url
            .replace('{transfer}', parsedArgs.transfer.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\HR\TransferController::approve
* @see app/Http/Controllers/HR/TransferController.php:89
* @route '/hr/transfers/{transfer}/approve'
*/
approve.post = (args: { transfer: number | { id: number } } | [transfer: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: approve.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\HR\TransferController::approve
* @see app/Http/Controllers/HR/TransferController.php:89
* @route '/hr/transfers/{transfer}/approve'
*/
const approveForm = (args: { transfer: number | { id: number } } | [transfer: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: approve.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\HR\TransferController::approve
* @see app/Http/Controllers/HR/TransferController.php:89
* @route '/hr/transfers/{transfer}/approve'
*/
approveForm.post = (args: { transfer: number | { id: number } } | [transfer: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: approve.url(args, options),
    method: 'post',
})

approve.form = approveForm

/**
* @see \App\Http\Controllers\HR\TransferController::reject
* @see app/Http/Controllers/HR/TransferController.php:104
* @route '/hr/transfers/{transfer}/reject'
*/
export const reject = (args: { transfer: number | { id: number } } | [transfer: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: reject.url(args, options),
    method: 'post',
})

reject.definition = {
    methods: ["post"],
    url: '/hr/transfers/{transfer}/reject',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\HR\TransferController::reject
* @see app/Http/Controllers/HR/TransferController.php:104
* @route '/hr/transfers/{transfer}/reject'
*/
reject.url = (args: { transfer: number | { id: number } } | [transfer: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { transfer: args }
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
        args = { transfer: args.id }
    }

    if (Array.isArray(args)) {
        args = {
            transfer: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        transfer: typeof args.transfer === 'object'
        ? args.transfer.id
        : args.transfer,
    }

    return reject.definition.url
            .replace('{transfer}', parsedArgs.transfer.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\HR\TransferController::reject
* @see app/Http/Controllers/HR/TransferController.php:104
* @route '/hr/transfers/{transfer}/reject'
*/
reject.post = (args: { transfer: number | { id: number } } | [transfer: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: reject.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\HR\TransferController::reject
* @see app/Http/Controllers/HR/TransferController.php:104
* @route '/hr/transfers/{transfer}/reject'
*/
const rejectForm = (args: { transfer: number | { id: number } } | [transfer: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: reject.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\HR\TransferController::reject
* @see app/Http/Controllers/HR/TransferController.php:104
* @route '/hr/transfers/{transfer}/reject'
*/
rejectForm.post = (args: { transfer: number | { id: number } } | [transfer: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: reject.url(args, options),
    method: 'post',
})

reject.form = rejectForm

/**
* @see \App\Http\Controllers\HR\TransferController::complete
* @see app/Http/Controllers/HR/TransferController.php:115
* @route '/hr/transfers/{transfer}/complete'
*/
export const complete = (args: { transfer: number | { id: number } } | [transfer: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: complete.url(args, options),
    method: 'post',
})

complete.definition = {
    methods: ["post"],
    url: '/hr/transfers/{transfer}/complete',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\HR\TransferController::complete
* @see app/Http/Controllers/HR/TransferController.php:115
* @route '/hr/transfers/{transfer}/complete'
*/
complete.url = (args: { transfer: number | { id: number } } | [transfer: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { transfer: args }
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
        args = { transfer: args.id }
    }

    if (Array.isArray(args)) {
        args = {
            transfer: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        transfer: typeof args.transfer === 'object'
        ? args.transfer.id
        : args.transfer,
    }

    return complete.definition.url
            .replace('{transfer}', parsedArgs.transfer.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\HR\TransferController::complete
* @see app/Http/Controllers/HR/TransferController.php:115
* @route '/hr/transfers/{transfer}/complete'
*/
complete.post = (args: { transfer: number | { id: number } } | [transfer: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: complete.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\HR\TransferController::complete
* @see app/Http/Controllers/HR/TransferController.php:115
* @route '/hr/transfers/{transfer}/complete'
*/
const completeForm = (args: { transfer: number | { id: number } } | [transfer: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: complete.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\HR\TransferController::complete
* @see app/Http/Controllers/HR/TransferController.php:115
* @route '/hr/transfers/{transfer}/complete'
*/
completeForm.post = (args: { transfer: number | { id: number } } | [transfer: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: complete.url(args, options),
    method: 'post',
})

complete.form = completeForm

const transfers = {
    index: Object.assign(index, index),
    create: Object.assign(create, create),
    store: Object.assign(store, store),
    show: Object.assign(show, show),
    destroy: Object.assign(destroy, destroy),
    approve: Object.assign(approve, approve),
    reject: Object.assign(reject, reject),
    complete: Object.assign(complete, complete),
}

export default transfers