import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../wayfinder'
/**
* @see \App\Http\Controllers\HR\LeaveController::daysPreview
* @see app/Http/Controllers/HR/LeaveController.php:138
* @route '/hr/leave/days-preview'
*/
export const daysPreview = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: daysPreview.url(options),
    method: 'get',
})

daysPreview.definition = {
    methods: ["get","head"],
    url: '/hr/leave/days-preview',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\HR\LeaveController::daysPreview
* @see app/Http/Controllers/HR/LeaveController.php:138
* @route '/hr/leave/days-preview'
*/
daysPreview.url = (options?: RouteQueryOptions) => {
    return daysPreview.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\HR\LeaveController::daysPreview
* @see app/Http/Controllers/HR/LeaveController.php:138
* @route '/hr/leave/days-preview'
*/
daysPreview.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: daysPreview.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\HR\LeaveController::daysPreview
* @see app/Http/Controllers/HR/LeaveController.php:138
* @route '/hr/leave/days-preview'
*/
daysPreview.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: daysPreview.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\HR\LeaveController::daysPreview
* @see app/Http/Controllers/HR/LeaveController.php:138
* @route '/hr/leave/days-preview'
*/
const daysPreviewForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: daysPreview.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\HR\LeaveController::daysPreview
* @see app/Http/Controllers/HR/LeaveController.php:138
* @route '/hr/leave/days-preview'
*/
daysPreviewForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: daysPreview.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\HR\LeaveController::daysPreview
* @see app/Http/Controllers/HR/LeaveController.php:138
* @route '/hr/leave/days-preview'
*/
daysPreviewForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: daysPreview.url({
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

daysPreview.form = daysPreviewForm

/**
* @see \App\Http\Controllers\HR\LeaveController::index
* @see app/Http/Controllers/HR/LeaveController.php:28
* @route '/hr/leave'
*/
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/hr/leave',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\HR\LeaveController::index
* @see app/Http/Controllers/HR/LeaveController.php:28
* @route '/hr/leave'
*/
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\HR\LeaveController::index
* @see app/Http/Controllers/HR/LeaveController.php:28
* @route '/hr/leave'
*/
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\HR\LeaveController::index
* @see app/Http/Controllers/HR/LeaveController.php:28
* @route '/hr/leave'
*/
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\HR\LeaveController::index
* @see app/Http/Controllers/HR/LeaveController.php:28
* @route '/hr/leave'
*/
const indexForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\HR\LeaveController::index
* @see app/Http/Controllers/HR/LeaveController.php:28
* @route '/hr/leave'
*/
indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\HR\LeaveController::index
* @see app/Http/Controllers/HR/LeaveController.php:28
* @route '/hr/leave'
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
* @see \App\Http\Controllers\HR\LeaveController::create
* @see app/Http/Controllers/HR/LeaveController.php:86
* @route '/hr/leave/create'
*/
export const create = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: create.url(options),
    method: 'get',
})

create.definition = {
    methods: ["get","head"],
    url: '/hr/leave/create',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\HR\LeaveController::create
* @see app/Http/Controllers/HR/LeaveController.php:86
* @route '/hr/leave/create'
*/
create.url = (options?: RouteQueryOptions) => {
    return create.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\HR\LeaveController::create
* @see app/Http/Controllers/HR/LeaveController.php:86
* @route '/hr/leave/create'
*/
create.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: create.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\HR\LeaveController::create
* @see app/Http/Controllers/HR/LeaveController.php:86
* @route '/hr/leave/create'
*/
create.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: create.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\HR\LeaveController::create
* @see app/Http/Controllers/HR/LeaveController.php:86
* @route '/hr/leave/create'
*/
const createForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: create.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\HR\LeaveController::create
* @see app/Http/Controllers/HR/LeaveController.php:86
* @route '/hr/leave/create'
*/
createForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: create.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\HR\LeaveController::create
* @see app/Http/Controllers/HR/LeaveController.php:86
* @route '/hr/leave/create'
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
* @see \App\Http\Controllers\HR\LeaveController::store
* @see app/Http/Controllers/HR/LeaveController.php:184
* @route '/hr/leave'
*/
export const store = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/hr/leave',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\HR\LeaveController::store
* @see app/Http/Controllers/HR/LeaveController.php:184
* @route '/hr/leave'
*/
store.url = (options?: RouteQueryOptions) => {
    return store.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\HR\LeaveController::store
* @see app/Http/Controllers/HR/LeaveController.php:184
* @route '/hr/leave'
*/
store.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\HR\LeaveController::store
* @see app/Http/Controllers/HR/LeaveController.php:184
* @route '/hr/leave'
*/
const storeForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: store.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\HR\LeaveController::store
* @see app/Http/Controllers/HR/LeaveController.php:184
* @route '/hr/leave'
*/
storeForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: store.url(options),
    method: 'post',
})

store.form = storeForm

/**
* @see \App\Http\Controllers\HR\LeaveController::show
* @see app/Http/Controllers/HR/LeaveController.php:286
* @route '/hr/leave/{leaveApplication}'
*/
export const show = (args: { leaveApplication: number | { id: number } } | [leaveApplication: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

show.definition = {
    methods: ["get","head"],
    url: '/hr/leave/{leaveApplication}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\HR\LeaveController::show
* @see app/Http/Controllers/HR/LeaveController.php:286
* @route '/hr/leave/{leaveApplication}'
*/
show.url = (args: { leaveApplication: number | { id: number } } | [leaveApplication: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { leaveApplication: args }
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
        args = { leaveApplication: args.id }
    }

    if (Array.isArray(args)) {
        args = {
            leaveApplication: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        leaveApplication: typeof args.leaveApplication === 'object'
        ? args.leaveApplication.id
        : args.leaveApplication,
    }

    return show.definition.url
            .replace('{leaveApplication}', parsedArgs.leaveApplication.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\HR\LeaveController::show
* @see app/Http/Controllers/HR/LeaveController.php:286
* @route '/hr/leave/{leaveApplication}'
*/
show.get = (args: { leaveApplication: number | { id: number } } | [leaveApplication: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\HR\LeaveController::show
* @see app/Http/Controllers/HR/LeaveController.php:286
* @route '/hr/leave/{leaveApplication}'
*/
show.head = (args: { leaveApplication: number | { id: number } } | [leaveApplication: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: show.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\HR\LeaveController::show
* @see app/Http/Controllers/HR/LeaveController.php:286
* @route '/hr/leave/{leaveApplication}'
*/
const showForm = (args: { leaveApplication: number | { id: number } } | [leaveApplication: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: show.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\HR\LeaveController::show
* @see app/Http/Controllers/HR/LeaveController.php:286
* @route '/hr/leave/{leaveApplication}'
*/
showForm.get = (args: { leaveApplication: number | { id: number } } | [leaveApplication: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: show.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\HR\LeaveController::show
* @see app/Http/Controllers/HR/LeaveController.php:286
* @route '/hr/leave/{leaveApplication}'
*/
showForm.head = (args: { leaveApplication: number | { id: number } } | [leaveApplication: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
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
* @see \App\Http\Controllers\HR\LeaveController::edit
* @see app/Http/Controllers/HR/LeaveController.php:0
* @route '/hr/leave/{leaveApplication}/edit'
*/
export const edit = (args: { leaveApplication: string | number } | [leaveApplication: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: edit.url(args, options),
    method: 'get',
})

edit.definition = {
    methods: ["get","head"],
    url: '/hr/leave/{leaveApplication}/edit',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\HR\LeaveController::edit
* @see app/Http/Controllers/HR/LeaveController.php:0
* @route '/hr/leave/{leaveApplication}/edit'
*/
edit.url = (args: { leaveApplication: string | number } | [leaveApplication: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { leaveApplication: args }
    }

    if (Array.isArray(args)) {
        args = {
            leaveApplication: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        leaveApplication: args.leaveApplication,
    }

    return edit.definition.url
            .replace('{leaveApplication}', parsedArgs.leaveApplication.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\HR\LeaveController::edit
* @see app/Http/Controllers/HR/LeaveController.php:0
* @route '/hr/leave/{leaveApplication}/edit'
*/
edit.get = (args: { leaveApplication: string | number } | [leaveApplication: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: edit.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\HR\LeaveController::edit
* @see app/Http/Controllers/HR/LeaveController.php:0
* @route '/hr/leave/{leaveApplication}/edit'
*/
edit.head = (args: { leaveApplication: string | number } | [leaveApplication: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: edit.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\HR\LeaveController::edit
* @see app/Http/Controllers/HR/LeaveController.php:0
* @route '/hr/leave/{leaveApplication}/edit'
*/
const editForm = (args: { leaveApplication: string | number } | [leaveApplication: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: edit.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\HR\LeaveController::edit
* @see app/Http/Controllers/HR/LeaveController.php:0
* @route '/hr/leave/{leaveApplication}/edit'
*/
editForm.get = (args: { leaveApplication: string | number } | [leaveApplication: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: edit.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\HR\LeaveController::edit
* @see app/Http/Controllers/HR/LeaveController.php:0
* @route '/hr/leave/{leaveApplication}/edit'
*/
editForm.head = (args: { leaveApplication: string | number } | [leaveApplication: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
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
* @see \App\Http\Controllers\HR\LeaveController::update
* @see app/Http/Controllers/HR/LeaveController.php:0
* @route '/hr/leave/{leaveApplication}'
*/
export const update = (args: { leaveApplication: string | number } | [leaveApplication: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

update.definition = {
    methods: ["put","patch"],
    url: '/hr/leave/{leaveApplication}',
} satisfies RouteDefinition<["put","patch"]>

/**
* @see \App\Http\Controllers\HR\LeaveController::update
* @see app/Http/Controllers/HR/LeaveController.php:0
* @route '/hr/leave/{leaveApplication}'
*/
update.url = (args: { leaveApplication: string | number } | [leaveApplication: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { leaveApplication: args }
    }

    if (Array.isArray(args)) {
        args = {
            leaveApplication: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        leaveApplication: args.leaveApplication,
    }

    return update.definition.url
            .replace('{leaveApplication}', parsedArgs.leaveApplication.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\HR\LeaveController::update
* @see app/Http/Controllers/HR/LeaveController.php:0
* @route '/hr/leave/{leaveApplication}'
*/
update.put = (args: { leaveApplication: string | number } | [leaveApplication: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

/**
* @see \App\Http\Controllers\HR\LeaveController::update
* @see app/Http/Controllers/HR/LeaveController.php:0
* @route '/hr/leave/{leaveApplication}'
*/
update.patch = (args: { leaveApplication: string | number } | [leaveApplication: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: update.url(args, options),
    method: 'patch',
})

/**
* @see \App\Http\Controllers\HR\LeaveController::update
* @see app/Http/Controllers/HR/LeaveController.php:0
* @route '/hr/leave/{leaveApplication}'
*/
const updateForm = (args: { leaveApplication: string | number } | [leaveApplication: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: update.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'PUT',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

/**
* @see \App\Http\Controllers\HR\LeaveController::update
* @see app/Http/Controllers/HR/LeaveController.php:0
* @route '/hr/leave/{leaveApplication}'
*/
updateForm.put = (args: { leaveApplication: string | number } | [leaveApplication: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: update.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'PUT',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

/**
* @see \App\Http\Controllers\HR\LeaveController::update
* @see app/Http/Controllers/HR/LeaveController.php:0
* @route '/hr/leave/{leaveApplication}'
*/
updateForm.patch = (args: { leaveApplication: string | number } | [leaveApplication: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
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
* @see \App\Http\Controllers\HR\LeaveController::destroy
* @see app/Http/Controllers/HR/LeaveController.php:487
* @route '/hr/leave/{leaveApplication}'
*/
export const destroy = (args: { leaveApplication: number | { id: number } } | [leaveApplication: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

destroy.definition = {
    methods: ["delete"],
    url: '/hr/leave/{leaveApplication}',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\HR\LeaveController::destroy
* @see app/Http/Controllers/HR/LeaveController.php:487
* @route '/hr/leave/{leaveApplication}'
*/
destroy.url = (args: { leaveApplication: number | { id: number } } | [leaveApplication: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { leaveApplication: args }
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
        args = { leaveApplication: args.id }
    }

    if (Array.isArray(args)) {
        args = {
            leaveApplication: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        leaveApplication: typeof args.leaveApplication === 'object'
        ? args.leaveApplication.id
        : args.leaveApplication,
    }

    return destroy.definition.url
            .replace('{leaveApplication}', parsedArgs.leaveApplication.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\HR\LeaveController::destroy
* @see app/Http/Controllers/HR/LeaveController.php:487
* @route '/hr/leave/{leaveApplication}'
*/
destroy.delete = (args: { leaveApplication: number | { id: number } } | [leaveApplication: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

/**
* @see \App\Http\Controllers\HR\LeaveController::destroy
* @see app/Http/Controllers/HR/LeaveController.php:487
* @route '/hr/leave/{leaveApplication}'
*/
const destroyForm = (args: { leaveApplication: number | { id: number } } | [leaveApplication: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: destroy.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'DELETE',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

/**
* @see \App\Http\Controllers\HR\LeaveController::destroy
* @see app/Http/Controllers/HR/LeaveController.php:487
* @route '/hr/leave/{leaveApplication}'
*/
destroyForm.delete = (args: { leaveApplication: number | { id: number } } | [leaveApplication: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
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
* @see \App\Http\Controllers\HR\LeaveController::lmApprove
* @see app/Http/Controllers/HR/LeaveController.php:338
* @route '/hr/leave/{leaveApplication}/lm-approve'
*/
export const lmApprove = (args: { leaveApplication: number | { id: number } } | [leaveApplication: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: lmApprove.url(args, options),
    method: 'post',
})

lmApprove.definition = {
    methods: ["post"],
    url: '/hr/leave/{leaveApplication}/lm-approve',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\HR\LeaveController::lmApprove
* @see app/Http/Controllers/HR/LeaveController.php:338
* @route '/hr/leave/{leaveApplication}/lm-approve'
*/
lmApprove.url = (args: { leaveApplication: number | { id: number } } | [leaveApplication: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { leaveApplication: args }
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
        args = { leaveApplication: args.id }
    }

    if (Array.isArray(args)) {
        args = {
            leaveApplication: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        leaveApplication: typeof args.leaveApplication === 'object'
        ? args.leaveApplication.id
        : args.leaveApplication,
    }

    return lmApprove.definition.url
            .replace('{leaveApplication}', parsedArgs.leaveApplication.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\HR\LeaveController::lmApprove
* @see app/Http/Controllers/HR/LeaveController.php:338
* @route '/hr/leave/{leaveApplication}/lm-approve'
*/
lmApprove.post = (args: { leaveApplication: number | { id: number } } | [leaveApplication: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: lmApprove.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\HR\LeaveController::lmApprove
* @see app/Http/Controllers/HR/LeaveController.php:338
* @route '/hr/leave/{leaveApplication}/lm-approve'
*/
const lmApproveForm = (args: { leaveApplication: number | { id: number } } | [leaveApplication: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: lmApprove.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\HR\LeaveController::lmApprove
* @see app/Http/Controllers/HR/LeaveController.php:338
* @route '/hr/leave/{leaveApplication}/lm-approve'
*/
lmApproveForm.post = (args: { leaveApplication: number | { id: number } } | [leaveApplication: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: lmApprove.url(args, options),
    method: 'post',
})

lmApprove.form = lmApproveForm

/**
* @see \App\Http\Controllers\HR\LeaveController::lmReject
* @see app/Http/Controllers/HR/LeaveController.php:366
* @route '/hr/leave/{leaveApplication}/lm-reject'
*/
export const lmReject = (args: { leaveApplication: number | { id: number } } | [leaveApplication: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: lmReject.url(args, options),
    method: 'post',
})

lmReject.definition = {
    methods: ["post"],
    url: '/hr/leave/{leaveApplication}/lm-reject',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\HR\LeaveController::lmReject
* @see app/Http/Controllers/HR/LeaveController.php:366
* @route '/hr/leave/{leaveApplication}/lm-reject'
*/
lmReject.url = (args: { leaveApplication: number | { id: number } } | [leaveApplication: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { leaveApplication: args }
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
        args = { leaveApplication: args.id }
    }

    if (Array.isArray(args)) {
        args = {
            leaveApplication: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        leaveApplication: typeof args.leaveApplication === 'object'
        ? args.leaveApplication.id
        : args.leaveApplication,
    }

    return lmReject.definition.url
            .replace('{leaveApplication}', parsedArgs.leaveApplication.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\HR\LeaveController::lmReject
* @see app/Http/Controllers/HR/LeaveController.php:366
* @route '/hr/leave/{leaveApplication}/lm-reject'
*/
lmReject.post = (args: { leaveApplication: number | { id: number } } | [leaveApplication: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: lmReject.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\HR\LeaveController::lmReject
* @see app/Http/Controllers/HR/LeaveController.php:366
* @route '/hr/leave/{leaveApplication}/lm-reject'
*/
const lmRejectForm = (args: { leaveApplication: number | { id: number } } | [leaveApplication: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: lmReject.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\HR\LeaveController::lmReject
* @see app/Http/Controllers/HR/LeaveController.php:366
* @route '/hr/leave/{leaveApplication}/lm-reject'
*/
lmRejectForm.post = (args: { leaveApplication: number | { id: number } } | [leaveApplication: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: lmReject.url(args, options),
    method: 'post',
})

lmReject.form = lmRejectForm

/**
* @see \App\Http\Controllers\HR\LeaveController::approve
* @see app/Http/Controllers/HR/LeaveController.php:400
* @route '/hr/leave/{leaveApplication}/approve'
*/
export const approve = (args: { leaveApplication: number | { id: number } } | [leaveApplication: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: approve.url(args, options),
    method: 'post',
})

approve.definition = {
    methods: ["post"],
    url: '/hr/leave/{leaveApplication}/approve',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\HR\LeaveController::approve
* @see app/Http/Controllers/HR/LeaveController.php:400
* @route '/hr/leave/{leaveApplication}/approve'
*/
approve.url = (args: { leaveApplication: number | { id: number } } | [leaveApplication: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { leaveApplication: args }
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
        args = { leaveApplication: args.id }
    }

    if (Array.isArray(args)) {
        args = {
            leaveApplication: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        leaveApplication: typeof args.leaveApplication === 'object'
        ? args.leaveApplication.id
        : args.leaveApplication,
    }

    return approve.definition.url
            .replace('{leaveApplication}', parsedArgs.leaveApplication.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\HR\LeaveController::approve
* @see app/Http/Controllers/HR/LeaveController.php:400
* @route '/hr/leave/{leaveApplication}/approve'
*/
approve.post = (args: { leaveApplication: number | { id: number } } | [leaveApplication: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: approve.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\HR\LeaveController::approve
* @see app/Http/Controllers/HR/LeaveController.php:400
* @route '/hr/leave/{leaveApplication}/approve'
*/
const approveForm = (args: { leaveApplication: number | { id: number } } | [leaveApplication: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: approve.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\HR\LeaveController::approve
* @see app/Http/Controllers/HR/LeaveController.php:400
* @route '/hr/leave/{leaveApplication}/approve'
*/
approveForm.post = (args: { leaveApplication: number | { id: number } } | [leaveApplication: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: approve.url(args, options),
    method: 'post',
})

approve.form = approveForm

/**
* @see \App\Http\Controllers\HR\LeaveController::reject
* @see app/Http/Controllers/HR/LeaveController.php:448
* @route '/hr/leave/{leaveApplication}/reject'
*/
export const reject = (args: { leaveApplication: number | { id: number } } | [leaveApplication: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: reject.url(args, options),
    method: 'post',
})

reject.definition = {
    methods: ["post"],
    url: '/hr/leave/{leaveApplication}/reject',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\HR\LeaveController::reject
* @see app/Http/Controllers/HR/LeaveController.php:448
* @route '/hr/leave/{leaveApplication}/reject'
*/
reject.url = (args: { leaveApplication: number | { id: number } } | [leaveApplication: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { leaveApplication: args }
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
        args = { leaveApplication: args.id }
    }

    if (Array.isArray(args)) {
        args = {
            leaveApplication: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        leaveApplication: typeof args.leaveApplication === 'object'
        ? args.leaveApplication.id
        : args.leaveApplication,
    }

    return reject.definition.url
            .replace('{leaveApplication}', parsedArgs.leaveApplication.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\HR\LeaveController::reject
* @see app/Http/Controllers/HR/LeaveController.php:448
* @route '/hr/leave/{leaveApplication}/reject'
*/
reject.post = (args: { leaveApplication: number | { id: number } } | [leaveApplication: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: reject.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\HR\LeaveController::reject
* @see app/Http/Controllers/HR/LeaveController.php:448
* @route '/hr/leave/{leaveApplication}/reject'
*/
const rejectForm = (args: { leaveApplication: number | { id: number } } | [leaveApplication: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: reject.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\HR\LeaveController::reject
* @see app/Http/Controllers/HR/LeaveController.php:448
* @route '/hr/leave/{leaveApplication}/reject'
*/
rejectForm.post = (args: { leaveApplication: number | { id: number } } | [leaveApplication: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: reject.url(args, options),
    method: 'post',
})

reject.form = rejectForm

/**
* @see \App\Http\Controllers\HR\LeaveController::document
* @see app/Http/Controllers/HR/LeaveController.php:326
* @route '/hr/leave/{leaveApplication}/document'
*/
export const document = (args: { leaveApplication: number | { id: number } } | [leaveApplication: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: document.url(args, options),
    method: 'get',
})

document.definition = {
    methods: ["get","head"],
    url: '/hr/leave/{leaveApplication}/document',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\HR\LeaveController::document
* @see app/Http/Controllers/HR/LeaveController.php:326
* @route '/hr/leave/{leaveApplication}/document'
*/
document.url = (args: { leaveApplication: number | { id: number } } | [leaveApplication: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { leaveApplication: args }
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
        args = { leaveApplication: args.id }
    }

    if (Array.isArray(args)) {
        args = {
            leaveApplication: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        leaveApplication: typeof args.leaveApplication === 'object'
        ? args.leaveApplication.id
        : args.leaveApplication,
    }

    return document.definition.url
            .replace('{leaveApplication}', parsedArgs.leaveApplication.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\HR\LeaveController::document
* @see app/Http/Controllers/HR/LeaveController.php:326
* @route '/hr/leave/{leaveApplication}/document'
*/
document.get = (args: { leaveApplication: number | { id: number } } | [leaveApplication: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: document.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\HR\LeaveController::document
* @see app/Http/Controllers/HR/LeaveController.php:326
* @route '/hr/leave/{leaveApplication}/document'
*/
document.head = (args: { leaveApplication: number | { id: number } } | [leaveApplication: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: document.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\HR\LeaveController::document
* @see app/Http/Controllers/HR/LeaveController.php:326
* @route '/hr/leave/{leaveApplication}/document'
*/
const documentForm = (args: { leaveApplication: number | { id: number } } | [leaveApplication: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: document.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\HR\LeaveController::document
* @see app/Http/Controllers/HR/LeaveController.php:326
* @route '/hr/leave/{leaveApplication}/document'
*/
documentForm.get = (args: { leaveApplication: number | { id: number } } | [leaveApplication: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: document.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\HR\LeaveController::document
* @see app/Http/Controllers/HR/LeaveController.php:326
* @route '/hr/leave/{leaveApplication}/document'
*/
documentForm.head = (args: { leaveApplication: number | { id: number } } | [leaveApplication: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: document.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

document.form = documentForm

const leave = {
    daysPreview: Object.assign(daysPreview, daysPreview),
    index: Object.assign(index, index),
    create: Object.assign(create, create),
    store: Object.assign(store, store),
    show: Object.assign(show, show),
    edit: Object.assign(edit, edit),
    update: Object.assign(update, update),
    destroy: Object.assign(destroy, destroy),
    lmApprove: Object.assign(lmApprove, lmApprove),
    lmReject: Object.assign(lmReject, lmReject),
    approve: Object.assign(approve, approve),
    reject: Object.assign(reject, reject),
    document: Object.assign(document, document),
}

export default leave