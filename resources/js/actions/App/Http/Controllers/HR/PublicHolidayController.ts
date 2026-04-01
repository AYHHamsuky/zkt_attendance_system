import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../../../wayfinder'
/**
* @see \App\Http\Controllers\HR\PublicHolidayController::index
* @see app/Http/Controllers/HR/PublicHolidayController.php:14
* @route '/hr/public-holidays'
*/
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/hr/public-holidays',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\HR\PublicHolidayController::index
* @see app/Http/Controllers/HR/PublicHolidayController.php:14
* @route '/hr/public-holidays'
*/
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\HR\PublicHolidayController::index
* @see app/Http/Controllers/HR/PublicHolidayController.php:14
* @route '/hr/public-holidays'
*/
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\HR\PublicHolidayController::index
* @see app/Http/Controllers/HR/PublicHolidayController.php:14
* @route '/hr/public-holidays'
*/
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\HR\PublicHolidayController::index
* @see app/Http/Controllers/HR/PublicHolidayController.php:14
* @route '/hr/public-holidays'
*/
const indexForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\HR\PublicHolidayController::index
* @see app/Http/Controllers/HR/PublicHolidayController.php:14
* @route '/hr/public-holidays'
*/
indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\HR\PublicHolidayController::index
* @see app/Http/Controllers/HR/PublicHolidayController.php:14
* @route '/hr/public-holidays'
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
* @see \App\Http\Controllers\HR\PublicHolidayController::store
* @see app/Http/Controllers/HR/PublicHolidayController.php:31
* @route '/hr/public-holidays'
*/
export const store = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/hr/public-holidays',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\HR\PublicHolidayController::store
* @see app/Http/Controllers/HR/PublicHolidayController.php:31
* @route '/hr/public-holidays'
*/
store.url = (options?: RouteQueryOptions) => {
    return store.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\HR\PublicHolidayController::store
* @see app/Http/Controllers/HR/PublicHolidayController.php:31
* @route '/hr/public-holidays'
*/
store.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\HR\PublicHolidayController::store
* @see app/Http/Controllers/HR/PublicHolidayController.php:31
* @route '/hr/public-holidays'
*/
const storeForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: store.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\HR\PublicHolidayController::store
* @see app/Http/Controllers/HR/PublicHolidayController.php:31
* @route '/hr/public-holidays'
*/
storeForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: store.url(options),
    method: 'post',
})

store.form = storeForm

/**
* @see \App\Http\Controllers\HR\PublicHolidayController::update
* @see app/Http/Controllers/HR/PublicHolidayController.php:46
* @route '/hr/public-holidays/{publicHoliday}'
*/
export const update = (args: { publicHoliday: number | { id: number } } | [publicHoliday: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: update.url(args, options),
    method: 'patch',
})

update.definition = {
    methods: ["patch"],
    url: '/hr/public-holidays/{publicHoliday}',
} satisfies RouteDefinition<["patch"]>

/**
* @see \App\Http\Controllers\HR\PublicHolidayController::update
* @see app/Http/Controllers/HR/PublicHolidayController.php:46
* @route '/hr/public-holidays/{publicHoliday}'
*/
update.url = (args: { publicHoliday: number | { id: number } } | [publicHoliday: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { publicHoliday: args }
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
        args = { publicHoliday: args.id }
    }

    if (Array.isArray(args)) {
        args = {
            publicHoliday: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        publicHoliday: typeof args.publicHoliday === 'object'
        ? args.publicHoliday.id
        : args.publicHoliday,
    }

    return update.definition.url
            .replace('{publicHoliday}', parsedArgs.publicHoliday.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\HR\PublicHolidayController::update
* @see app/Http/Controllers/HR/PublicHolidayController.php:46
* @route '/hr/public-holidays/{publicHoliday}'
*/
update.patch = (args: { publicHoliday: number | { id: number } } | [publicHoliday: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: update.url(args, options),
    method: 'patch',
})

/**
* @see \App\Http\Controllers\HR\PublicHolidayController::update
* @see app/Http/Controllers/HR/PublicHolidayController.php:46
* @route '/hr/public-holidays/{publicHoliday}'
*/
const updateForm = (args: { publicHoliday: number | { id: number } } | [publicHoliday: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: update.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'PATCH',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

/**
* @see \App\Http\Controllers\HR\PublicHolidayController::update
* @see app/Http/Controllers/HR/PublicHolidayController.php:46
* @route '/hr/public-holidays/{publicHoliday}'
*/
updateForm.patch = (args: { publicHoliday: number | { id: number } } | [publicHoliday: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
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
* @see \App\Http\Controllers\HR\PublicHolidayController::destroy
* @see app/Http/Controllers/HR/PublicHolidayController.php:61
* @route '/hr/public-holidays/{publicHoliday}'
*/
export const destroy = (args: { publicHoliday: number | { id: number } } | [publicHoliday: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

destroy.definition = {
    methods: ["delete"],
    url: '/hr/public-holidays/{publicHoliday}',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\HR\PublicHolidayController::destroy
* @see app/Http/Controllers/HR/PublicHolidayController.php:61
* @route '/hr/public-holidays/{publicHoliday}'
*/
destroy.url = (args: { publicHoliday: number | { id: number } } | [publicHoliday: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { publicHoliday: args }
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
        args = { publicHoliday: args.id }
    }

    if (Array.isArray(args)) {
        args = {
            publicHoliday: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        publicHoliday: typeof args.publicHoliday === 'object'
        ? args.publicHoliday.id
        : args.publicHoliday,
    }

    return destroy.definition.url
            .replace('{publicHoliday}', parsedArgs.publicHoliday.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\HR\PublicHolidayController::destroy
* @see app/Http/Controllers/HR/PublicHolidayController.php:61
* @route '/hr/public-holidays/{publicHoliday}'
*/
destroy.delete = (args: { publicHoliday: number | { id: number } } | [publicHoliday: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

/**
* @see \App\Http\Controllers\HR\PublicHolidayController::destroy
* @see app/Http/Controllers/HR/PublicHolidayController.php:61
* @route '/hr/public-holidays/{publicHoliday}'
*/
const destroyForm = (args: { publicHoliday: number | { id: number } } | [publicHoliday: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: destroy.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'DELETE',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

/**
* @see \App\Http\Controllers\HR\PublicHolidayController::destroy
* @see app/Http/Controllers/HR/PublicHolidayController.php:61
* @route '/hr/public-holidays/{publicHoliday}'
*/
destroyForm.delete = (args: { publicHoliday: number | { id: number } } | [publicHoliday: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: destroy.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'DELETE',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

destroy.form = destroyForm

const PublicHolidayController = { index, store, update, destroy }

export default PublicHolidayController