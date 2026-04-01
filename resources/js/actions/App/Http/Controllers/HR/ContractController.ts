import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../../../wayfinder'
/**
* @see \App\Http\Controllers\HR\ContractController::index
* @see app/Http/Controllers/HR/ContractController.php:15
* @route '/hr/contracts'
*/
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/hr/contracts',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\HR\ContractController::index
* @see app/Http/Controllers/HR/ContractController.php:15
* @route '/hr/contracts'
*/
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\HR\ContractController::index
* @see app/Http/Controllers/HR/ContractController.php:15
* @route '/hr/contracts'
*/
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\HR\ContractController::index
* @see app/Http/Controllers/HR/ContractController.php:15
* @route '/hr/contracts'
*/
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\HR\ContractController::index
* @see app/Http/Controllers/HR/ContractController.php:15
* @route '/hr/contracts'
*/
const indexForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\HR\ContractController::index
* @see app/Http/Controllers/HR/ContractController.php:15
* @route '/hr/contracts'
*/
indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\HR\ContractController::index
* @see app/Http/Controllers/HR/ContractController.php:15
* @route '/hr/contracts'
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
* @see \App\Http\Controllers\HR\ContractController::create
* @see app/Http/Controllers/HR/ContractController.php:40
* @route '/hr/contracts/create'
*/
export const create = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: create.url(options),
    method: 'get',
})

create.definition = {
    methods: ["get","head"],
    url: '/hr/contracts/create',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\HR\ContractController::create
* @see app/Http/Controllers/HR/ContractController.php:40
* @route '/hr/contracts/create'
*/
create.url = (options?: RouteQueryOptions) => {
    return create.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\HR\ContractController::create
* @see app/Http/Controllers/HR/ContractController.php:40
* @route '/hr/contracts/create'
*/
create.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: create.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\HR\ContractController::create
* @see app/Http/Controllers/HR/ContractController.php:40
* @route '/hr/contracts/create'
*/
create.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: create.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\HR\ContractController::create
* @see app/Http/Controllers/HR/ContractController.php:40
* @route '/hr/contracts/create'
*/
const createForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: create.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\HR\ContractController::create
* @see app/Http/Controllers/HR/ContractController.php:40
* @route '/hr/contracts/create'
*/
createForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: create.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\HR\ContractController::create
* @see app/Http/Controllers/HR/ContractController.php:40
* @route '/hr/contracts/create'
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
* @see \App\Http\Controllers\HR\ContractController::store
* @see app/Http/Controllers/HR/ContractController.php:52
* @route '/hr/contracts'
*/
export const store = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/hr/contracts',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\HR\ContractController::store
* @see app/Http/Controllers/HR/ContractController.php:52
* @route '/hr/contracts'
*/
store.url = (options?: RouteQueryOptions) => {
    return store.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\HR\ContractController::store
* @see app/Http/Controllers/HR/ContractController.php:52
* @route '/hr/contracts'
*/
store.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\HR\ContractController::store
* @see app/Http/Controllers/HR/ContractController.php:52
* @route '/hr/contracts'
*/
const storeForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: store.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\HR\ContractController::store
* @see app/Http/Controllers/HR/ContractController.php:52
* @route '/hr/contracts'
*/
storeForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: store.url(options),
    method: 'post',
})

store.form = storeForm

/**
* @see \App\Http\Controllers\HR\ContractController::show
* @see app/Http/Controllers/HR/ContractController.php:72
* @route '/hr/contracts/{contract}'
*/
export const show = (args: { contract: number | { id: number } } | [contract: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

show.definition = {
    methods: ["get","head"],
    url: '/hr/contracts/{contract}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\HR\ContractController::show
* @see app/Http/Controllers/HR/ContractController.php:72
* @route '/hr/contracts/{contract}'
*/
show.url = (args: { contract: number | { id: number } } | [contract: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { contract: args }
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
        args = { contract: args.id }
    }

    if (Array.isArray(args)) {
        args = {
            contract: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        contract: typeof args.contract === 'object'
        ? args.contract.id
        : args.contract,
    }

    return show.definition.url
            .replace('{contract}', parsedArgs.contract.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\HR\ContractController::show
* @see app/Http/Controllers/HR/ContractController.php:72
* @route '/hr/contracts/{contract}'
*/
show.get = (args: { contract: number | { id: number } } | [contract: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\HR\ContractController::show
* @see app/Http/Controllers/HR/ContractController.php:72
* @route '/hr/contracts/{contract}'
*/
show.head = (args: { contract: number | { id: number } } | [contract: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: show.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\HR\ContractController::show
* @see app/Http/Controllers/HR/ContractController.php:72
* @route '/hr/contracts/{contract}'
*/
const showForm = (args: { contract: number | { id: number } } | [contract: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: show.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\HR\ContractController::show
* @see app/Http/Controllers/HR/ContractController.php:72
* @route '/hr/contracts/{contract}'
*/
showForm.get = (args: { contract: number | { id: number } } | [contract: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: show.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\HR\ContractController::show
* @see app/Http/Controllers/HR/ContractController.php:72
* @route '/hr/contracts/{contract}'
*/
showForm.head = (args: { contract: number | { id: number } } | [contract: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
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
* @see \App\Http\Controllers\HR\ContractController::edit
* @see app/Http/Controllers/HR/ContractController.php:81
* @route '/hr/contracts/{contract}/edit'
*/
export const edit = (args: { contract: number | { id: number } } | [contract: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: edit.url(args, options),
    method: 'get',
})

edit.definition = {
    methods: ["get","head"],
    url: '/hr/contracts/{contract}/edit',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\HR\ContractController::edit
* @see app/Http/Controllers/HR/ContractController.php:81
* @route '/hr/contracts/{contract}/edit'
*/
edit.url = (args: { contract: number | { id: number } } | [contract: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { contract: args }
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
        args = { contract: args.id }
    }

    if (Array.isArray(args)) {
        args = {
            contract: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        contract: typeof args.contract === 'object'
        ? args.contract.id
        : args.contract,
    }

    return edit.definition.url
            .replace('{contract}', parsedArgs.contract.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\HR\ContractController::edit
* @see app/Http/Controllers/HR/ContractController.php:81
* @route '/hr/contracts/{contract}/edit'
*/
edit.get = (args: { contract: number | { id: number } } | [contract: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: edit.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\HR\ContractController::edit
* @see app/Http/Controllers/HR/ContractController.php:81
* @route '/hr/contracts/{contract}/edit'
*/
edit.head = (args: { contract: number | { id: number } } | [contract: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: edit.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\HR\ContractController::edit
* @see app/Http/Controllers/HR/ContractController.php:81
* @route '/hr/contracts/{contract}/edit'
*/
const editForm = (args: { contract: number | { id: number } } | [contract: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: edit.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\HR\ContractController::edit
* @see app/Http/Controllers/HR/ContractController.php:81
* @route '/hr/contracts/{contract}/edit'
*/
editForm.get = (args: { contract: number | { id: number } } | [contract: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: edit.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\HR\ContractController::edit
* @see app/Http/Controllers/HR/ContractController.php:81
* @route '/hr/contracts/{contract}/edit'
*/
editForm.head = (args: { contract: number | { id: number } } | [contract: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: edit.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

edit.form = editForm

/**
* @see \App\Http\Controllers\HR\ContractController::update
* @see app/Http/Controllers/HR/ContractController.php:94
* @route '/hr/contracts/{contract}'
*/
export const update = (args: { contract: number | { id: number } } | [contract: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

update.definition = {
    methods: ["put","patch"],
    url: '/hr/contracts/{contract}',
} satisfies RouteDefinition<["put","patch"]>

/**
* @see \App\Http\Controllers\HR\ContractController::update
* @see app/Http/Controllers/HR/ContractController.php:94
* @route '/hr/contracts/{contract}'
*/
update.url = (args: { contract: number | { id: number } } | [contract: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { contract: args }
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
        args = { contract: args.id }
    }

    if (Array.isArray(args)) {
        args = {
            contract: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        contract: typeof args.contract === 'object'
        ? args.contract.id
        : args.contract,
    }

    return update.definition.url
            .replace('{contract}', parsedArgs.contract.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\HR\ContractController::update
* @see app/Http/Controllers/HR/ContractController.php:94
* @route '/hr/contracts/{contract}'
*/
update.put = (args: { contract: number | { id: number } } | [contract: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

/**
* @see \App\Http\Controllers\HR\ContractController::update
* @see app/Http/Controllers/HR/ContractController.php:94
* @route '/hr/contracts/{contract}'
*/
update.patch = (args: { contract: number | { id: number } } | [contract: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: update.url(args, options),
    method: 'patch',
})

/**
* @see \App\Http\Controllers\HR\ContractController::update
* @see app/Http/Controllers/HR/ContractController.php:94
* @route '/hr/contracts/{contract}'
*/
const updateForm = (args: { contract: number | { id: number } } | [contract: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: update.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'PUT',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

/**
* @see \App\Http\Controllers\HR\ContractController::update
* @see app/Http/Controllers/HR/ContractController.php:94
* @route '/hr/contracts/{contract}'
*/
updateForm.put = (args: { contract: number | { id: number } } | [contract: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: update.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'PUT',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

/**
* @see \App\Http\Controllers\HR\ContractController::update
* @see app/Http/Controllers/HR/ContractController.php:94
* @route '/hr/contracts/{contract}'
*/
updateForm.patch = (args: { contract: number | { id: number } } | [contract: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
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
* @see \App\Http\Controllers\HR\ContractController::destroy
* @see app/Http/Controllers/HR/ContractController.php:111
* @route '/hr/contracts/{contract}'
*/
export const destroy = (args: { contract: number | { id: number } } | [contract: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

destroy.definition = {
    methods: ["delete"],
    url: '/hr/contracts/{contract}',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\HR\ContractController::destroy
* @see app/Http/Controllers/HR/ContractController.php:111
* @route '/hr/contracts/{contract}'
*/
destroy.url = (args: { contract: number | { id: number } } | [contract: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { contract: args }
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
        args = { contract: args.id }
    }

    if (Array.isArray(args)) {
        args = {
            contract: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        contract: typeof args.contract === 'object'
        ? args.contract.id
        : args.contract,
    }

    return destroy.definition.url
            .replace('{contract}', parsedArgs.contract.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\HR\ContractController::destroy
* @see app/Http/Controllers/HR/ContractController.php:111
* @route '/hr/contracts/{contract}'
*/
destroy.delete = (args: { contract: number | { id: number } } | [contract: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

/**
* @see \App\Http\Controllers\HR\ContractController::destroy
* @see app/Http/Controllers/HR/ContractController.php:111
* @route '/hr/contracts/{contract}'
*/
const destroyForm = (args: { contract: number | { id: number } } | [contract: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: destroy.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'DELETE',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

/**
* @see \App\Http\Controllers\HR\ContractController::destroy
* @see app/Http/Controllers/HR/ContractController.php:111
* @route '/hr/contracts/{contract}'
*/
destroyForm.delete = (args: { contract: number | { id: number } } | [contract: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: destroy.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'DELETE',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

destroy.form = destroyForm

const ContractController = { index, create, store, show, edit, update, destroy }

export default ContractController