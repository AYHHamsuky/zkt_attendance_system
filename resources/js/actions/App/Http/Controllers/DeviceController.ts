import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../../wayfinder'
/**
* @see \App\Http\Controllers\DeviceController::index
* @see app/Http/Controllers/DeviceController.php:23
* @route '/devices'
*/
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/devices',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\DeviceController::index
* @see app/Http/Controllers/DeviceController.php:23
* @route '/devices'
*/
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\DeviceController::index
* @see app/Http/Controllers/DeviceController.php:23
* @route '/devices'
*/
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\DeviceController::index
* @see app/Http/Controllers/DeviceController.php:23
* @route '/devices'
*/
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\DeviceController::index
* @see app/Http/Controllers/DeviceController.php:23
* @route '/devices'
*/
const indexForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\DeviceController::index
* @see app/Http/Controllers/DeviceController.php:23
* @route '/devices'
*/
indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\DeviceController::index
* @see app/Http/Controllers/DeviceController.php:23
* @route '/devices'
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
* @see \App\Http\Controllers\DeviceController::create
* @see app/Http/Controllers/DeviceController.php:37
* @route '/devices/create'
*/
export const create = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: create.url(options),
    method: 'get',
})

create.definition = {
    methods: ["get","head"],
    url: '/devices/create',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\DeviceController::create
* @see app/Http/Controllers/DeviceController.php:37
* @route '/devices/create'
*/
create.url = (options?: RouteQueryOptions) => {
    return create.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\DeviceController::create
* @see app/Http/Controllers/DeviceController.php:37
* @route '/devices/create'
*/
create.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: create.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\DeviceController::create
* @see app/Http/Controllers/DeviceController.php:37
* @route '/devices/create'
*/
create.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: create.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\DeviceController::create
* @see app/Http/Controllers/DeviceController.php:37
* @route '/devices/create'
*/
const createForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: create.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\DeviceController::create
* @see app/Http/Controllers/DeviceController.php:37
* @route '/devices/create'
*/
createForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: create.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\DeviceController::create
* @see app/Http/Controllers/DeviceController.php:37
* @route '/devices/create'
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
* @see \App\Http\Controllers\DeviceController::store
* @see app/Http/Controllers/DeviceController.php:45
* @route '/devices'
*/
export const store = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/devices',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\DeviceController::store
* @see app/Http/Controllers/DeviceController.php:45
* @route '/devices'
*/
store.url = (options?: RouteQueryOptions) => {
    return store.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\DeviceController::store
* @see app/Http/Controllers/DeviceController.php:45
* @route '/devices'
*/
store.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\DeviceController::store
* @see app/Http/Controllers/DeviceController.php:45
* @route '/devices'
*/
const storeForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: store.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\DeviceController::store
* @see app/Http/Controllers/DeviceController.php:45
* @route '/devices'
*/
storeForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: store.url(options),
    method: 'post',
})

store.form = storeForm

/**
* @see \App\Http\Controllers\DeviceController::show
* @see app/Http/Controllers/DeviceController.php:73
* @route '/devices/{device}'
*/
export const show = (args: { device: number | { id: number } } | [device: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

show.definition = {
    methods: ["get","head"],
    url: '/devices/{device}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\DeviceController::show
* @see app/Http/Controllers/DeviceController.php:73
* @route '/devices/{device}'
*/
show.url = (args: { device: number | { id: number } } | [device: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { device: args }
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
        args = { device: args.id }
    }

    if (Array.isArray(args)) {
        args = {
            device: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        device: typeof args.device === 'object'
        ? args.device.id
        : args.device,
    }

    return show.definition.url
            .replace('{device}', parsedArgs.device.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\DeviceController::show
* @see app/Http/Controllers/DeviceController.php:73
* @route '/devices/{device}'
*/
show.get = (args: { device: number | { id: number } } | [device: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\DeviceController::show
* @see app/Http/Controllers/DeviceController.php:73
* @route '/devices/{device}'
*/
show.head = (args: { device: number | { id: number } } | [device: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: show.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\DeviceController::show
* @see app/Http/Controllers/DeviceController.php:73
* @route '/devices/{device}'
*/
const showForm = (args: { device: number | { id: number } } | [device: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: show.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\DeviceController::show
* @see app/Http/Controllers/DeviceController.php:73
* @route '/devices/{device}'
*/
showForm.get = (args: { device: number | { id: number } } | [device: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: show.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\DeviceController::show
* @see app/Http/Controllers/DeviceController.php:73
* @route '/devices/{device}'
*/
showForm.head = (args: { device: number | { id: number } } | [device: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
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
* @see \App\Http\Controllers\DeviceController::edit
* @see app/Http/Controllers/DeviceController.php:0
* @route '/devices/{device}/edit'
*/
export const edit = (args: { device: string | number } | [device: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: edit.url(args, options),
    method: 'get',
})

edit.definition = {
    methods: ["get","head"],
    url: '/devices/{device}/edit',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\DeviceController::edit
* @see app/Http/Controllers/DeviceController.php:0
* @route '/devices/{device}/edit'
*/
edit.url = (args: { device: string | number } | [device: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { device: args }
    }

    if (Array.isArray(args)) {
        args = {
            device: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        device: args.device,
    }

    return edit.definition.url
            .replace('{device}', parsedArgs.device.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\DeviceController::edit
* @see app/Http/Controllers/DeviceController.php:0
* @route '/devices/{device}/edit'
*/
edit.get = (args: { device: string | number } | [device: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: edit.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\DeviceController::edit
* @see app/Http/Controllers/DeviceController.php:0
* @route '/devices/{device}/edit'
*/
edit.head = (args: { device: string | number } | [device: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: edit.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\DeviceController::edit
* @see app/Http/Controllers/DeviceController.php:0
* @route '/devices/{device}/edit'
*/
const editForm = (args: { device: string | number } | [device: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: edit.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\DeviceController::edit
* @see app/Http/Controllers/DeviceController.php:0
* @route '/devices/{device}/edit'
*/
editForm.get = (args: { device: string | number } | [device: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: edit.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\DeviceController::edit
* @see app/Http/Controllers/DeviceController.php:0
* @route '/devices/{device}/edit'
*/
editForm.head = (args: { device: string | number } | [device: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
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
* @see \App\Http\Controllers\DeviceController::update
* @see app/Http/Controllers/DeviceController.php:87
* @route '/devices/{device}'
*/
export const update = (args: { device: number | { id: number } } | [device: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

update.definition = {
    methods: ["put","patch"],
    url: '/devices/{device}',
} satisfies RouteDefinition<["put","patch"]>

/**
* @see \App\Http\Controllers\DeviceController::update
* @see app/Http/Controllers/DeviceController.php:87
* @route '/devices/{device}'
*/
update.url = (args: { device: number | { id: number } } | [device: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { device: args }
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
        args = { device: args.id }
    }

    if (Array.isArray(args)) {
        args = {
            device: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        device: typeof args.device === 'object'
        ? args.device.id
        : args.device,
    }

    return update.definition.url
            .replace('{device}', parsedArgs.device.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\DeviceController::update
* @see app/Http/Controllers/DeviceController.php:87
* @route '/devices/{device}'
*/
update.put = (args: { device: number | { id: number } } | [device: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

/**
* @see \App\Http\Controllers\DeviceController::update
* @see app/Http/Controllers/DeviceController.php:87
* @route '/devices/{device}'
*/
update.patch = (args: { device: number | { id: number } } | [device: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: update.url(args, options),
    method: 'patch',
})

/**
* @see \App\Http\Controllers\DeviceController::update
* @see app/Http/Controllers/DeviceController.php:87
* @route '/devices/{device}'
*/
const updateForm = (args: { device: number | { id: number } } | [device: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: update.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'PUT',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

/**
* @see \App\Http\Controllers\DeviceController::update
* @see app/Http/Controllers/DeviceController.php:87
* @route '/devices/{device}'
*/
updateForm.put = (args: { device: number | { id: number } } | [device: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: update.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'PUT',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

/**
* @see \App\Http\Controllers\DeviceController::update
* @see app/Http/Controllers/DeviceController.php:87
* @route '/devices/{device}'
*/
updateForm.patch = (args: { device: number | { id: number } } | [device: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
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
* @see \App\Http\Controllers\DeviceController::destroy
* @see app/Http/Controllers/DeviceController.php:108
* @route '/devices/{device}'
*/
export const destroy = (args: { device: number | { id: number } } | [device: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

destroy.definition = {
    methods: ["delete"],
    url: '/devices/{device}',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\DeviceController::destroy
* @see app/Http/Controllers/DeviceController.php:108
* @route '/devices/{device}'
*/
destroy.url = (args: { device: number | { id: number } } | [device: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { device: args }
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
        args = { device: args.id }
    }

    if (Array.isArray(args)) {
        args = {
            device: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        device: typeof args.device === 'object'
        ? args.device.id
        : args.device,
    }

    return destroy.definition.url
            .replace('{device}', parsedArgs.device.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\DeviceController::destroy
* @see app/Http/Controllers/DeviceController.php:108
* @route '/devices/{device}'
*/
destroy.delete = (args: { device: number | { id: number } } | [device: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

/**
* @see \App\Http\Controllers\DeviceController::destroy
* @see app/Http/Controllers/DeviceController.php:108
* @route '/devices/{device}'
*/
const destroyForm = (args: { device: number | { id: number } } | [device: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: destroy.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'DELETE',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

/**
* @see \App\Http\Controllers\DeviceController::destroy
* @see app/Http/Controllers/DeviceController.php:108
* @route '/devices/{device}'
*/
destroyForm.delete = (args: { device: number | { id: number } } | [device: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
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
* @see \App\Http\Controllers\DeviceController::syncAllUsers
* @see app/Http/Controllers/DeviceController.php:204
* @route '/devices/sync-all-users'
*/
export const syncAllUsers = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: syncAllUsers.url(options),
    method: 'post',
})

syncAllUsers.definition = {
    methods: ["post"],
    url: '/devices/sync-all-users',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\DeviceController::syncAllUsers
* @see app/Http/Controllers/DeviceController.php:204
* @route '/devices/sync-all-users'
*/
syncAllUsers.url = (options?: RouteQueryOptions) => {
    return syncAllUsers.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\DeviceController::syncAllUsers
* @see app/Http/Controllers/DeviceController.php:204
* @route '/devices/sync-all-users'
*/
syncAllUsers.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: syncAllUsers.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\DeviceController::syncAllUsers
* @see app/Http/Controllers/DeviceController.php:204
* @route '/devices/sync-all-users'
*/
const syncAllUsersForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: syncAllUsers.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\DeviceController::syncAllUsers
* @see app/Http/Controllers/DeviceController.php:204
* @route '/devices/sync-all-users'
*/
syncAllUsersForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: syncAllUsers.url(options),
    method: 'post',
})

syncAllUsers.form = syncAllUsersForm

/**
* @see \App\Http\Controllers\DeviceController::ping
* @see app/Http/Controllers/DeviceController.php:119
* @route '/devices/{device}/ping'
*/
export const ping = (args: { device: number | { id: number } } | [device: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: ping.url(args, options),
    method: 'post',
})

ping.definition = {
    methods: ["post"],
    url: '/devices/{device}/ping',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\DeviceController::ping
* @see app/Http/Controllers/DeviceController.php:119
* @route '/devices/{device}/ping'
*/
ping.url = (args: { device: number | { id: number } } | [device: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { device: args }
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
        args = { device: args.id }
    }

    if (Array.isArray(args)) {
        args = {
            device: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        device: typeof args.device === 'object'
        ? args.device.id
        : args.device,
    }

    return ping.definition.url
            .replace('{device}', parsedArgs.device.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\DeviceController::ping
* @see app/Http/Controllers/DeviceController.php:119
* @route '/devices/{device}/ping'
*/
ping.post = (args: { device: number | { id: number } } | [device: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: ping.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\DeviceController::ping
* @see app/Http/Controllers/DeviceController.php:119
* @route '/devices/{device}/ping'
*/
const pingForm = (args: { device: number | { id: number } } | [device: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: ping.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\DeviceController::ping
* @see app/Http/Controllers/DeviceController.php:119
* @route '/devices/{device}/ping'
*/
pingForm.post = (args: { device: number | { id: number } } | [device: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: ping.url(args, options),
    method: 'post',
})

ping.form = pingForm

/**
* @see \App\Http\Controllers\DeviceController::syncUsers
* @see app/Http/Controllers/DeviceController.php:153
* @route '/devices/{device}/sync-users'
*/
export const syncUsers = (args: { device: number | { id: number } } | [device: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: syncUsers.url(args, options),
    method: 'post',
})

syncUsers.definition = {
    methods: ["post"],
    url: '/devices/{device}/sync-users',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\DeviceController::syncUsers
* @see app/Http/Controllers/DeviceController.php:153
* @route '/devices/{device}/sync-users'
*/
syncUsers.url = (args: { device: number | { id: number } } | [device: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { device: args }
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
        args = { device: args.id }
    }

    if (Array.isArray(args)) {
        args = {
            device: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        device: typeof args.device === 'object'
        ? args.device.id
        : args.device,
    }

    return syncUsers.definition.url
            .replace('{device}', parsedArgs.device.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\DeviceController::syncUsers
* @see app/Http/Controllers/DeviceController.php:153
* @route '/devices/{device}/sync-users'
*/
syncUsers.post = (args: { device: number | { id: number } } | [device: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: syncUsers.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\DeviceController::syncUsers
* @see app/Http/Controllers/DeviceController.php:153
* @route '/devices/{device}/sync-users'
*/
const syncUsersForm = (args: { device: number | { id: number } } | [device: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: syncUsers.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\DeviceController::syncUsers
* @see app/Http/Controllers/DeviceController.php:153
* @route '/devices/{device}/sync-users'
*/
syncUsersForm.post = (args: { device: number | { id: number } } | [device: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: syncUsers.url(args, options),
    method: 'post',
})

syncUsers.form = syncUsersForm

/**
* @see \App\Http\Controllers\DeviceController::syncAttendance
* @see app/Http/Controllers/DeviceController.php:231
* @route '/devices/{device}/sync-attendance'
*/
export const syncAttendance = (args: { device: number | { id: number } } | [device: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: syncAttendance.url(args, options),
    method: 'post',
})

syncAttendance.definition = {
    methods: ["post"],
    url: '/devices/{device}/sync-attendance',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\DeviceController::syncAttendance
* @see app/Http/Controllers/DeviceController.php:231
* @route '/devices/{device}/sync-attendance'
*/
syncAttendance.url = (args: { device: number | { id: number } } | [device: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { device: args }
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
        args = { device: args.id }
    }

    if (Array.isArray(args)) {
        args = {
            device: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        device: typeof args.device === 'object'
        ? args.device.id
        : args.device,
    }

    return syncAttendance.definition.url
            .replace('{device}', parsedArgs.device.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\DeviceController::syncAttendance
* @see app/Http/Controllers/DeviceController.php:231
* @route '/devices/{device}/sync-attendance'
*/
syncAttendance.post = (args: { device: number | { id: number } } | [device: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: syncAttendance.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\DeviceController::syncAttendance
* @see app/Http/Controllers/DeviceController.php:231
* @route '/devices/{device}/sync-attendance'
*/
const syncAttendanceForm = (args: { device: number | { id: number } } | [device: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: syncAttendance.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\DeviceController::syncAttendance
* @see app/Http/Controllers/DeviceController.php:231
* @route '/devices/{device}/sync-attendance'
*/
syncAttendanceForm.post = (args: { device: number | { id: number } } | [device: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: syncAttendance.url(args, options),
    method: 'post',
})

syncAttendance.form = syncAttendanceForm

/**
* @see \App\Http\Controllers\DeviceController::restart
* @see app/Http/Controllers/DeviceController.php:280
* @route '/devices/{device}/restart'
*/
export const restart = (args: { device: number | { id: number } } | [device: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: restart.url(args, options),
    method: 'post',
})

restart.definition = {
    methods: ["post"],
    url: '/devices/{device}/restart',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\DeviceController::restart
* @see app/Http/Controllers/DeviceController.php:280
* @route '/devices/{device}/restart'
*/
restart.url = (args: { device: number | { id: number } } | [device: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { device: args }
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
        args = { device: args.id }
    }

    if (Array.isArray(args)) {
        args = {
            device: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        device: typeof args.device === 'object'
        ? args.device.id
        : args.device,
    }

    return restart.definition.url
            .replace('{device}', parsedArgs.device.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\DeviceController::restart
* @see app/Http/Controllers/DeviceController.php:280
* @route '/devices/{device}/restart'
*/
restart.post = (args: { device: number | { id: number } } | [device: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: restart.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\DeviceController::restart
* @see app/Http/Controllers/DeviceController.php:280
* @route '/devices/{device}/restart'
*/
const restartForm = (args: { device: number | { id: number } } | [device: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: restart.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\DeviceController::restart
* @see app/Http/Controllers/DeviceController.php:280
* @route '/devices/{device}/restart'
*/
restartForm.post = (args: { device: number | { id: number } } | [device: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: restart.url(args, options),
    method: 'post',
})

restart.form = restartForm

const DeviceController = { index, create, store, show, edit, update, destroy, syncAllUsers, ping, syncUsers, syncAttendance, restart }

export default DeviceController