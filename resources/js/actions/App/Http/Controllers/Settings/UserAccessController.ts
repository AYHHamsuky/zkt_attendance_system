import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../../../wayfinder'
/**
* @see \App\Http\Controllers\Settings\UserAccessController::index
* @see app/Http/Controllers/Settings/UserAccessController.php:18
* @route '/settings/users/{user}/access'
*/
export const index = (args: { user: number | { id: number } } | [user: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(args, options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/settings/users/{user}/access',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Settings\UserAccessController::index
* @see app/Http/Controllers/Settings/UserAccessController.php:18
* @route '/settings/users/{user}/access'
*/
index.url = (args: { user: number | { id: number } } | [user: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { user: args }
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
        args = { user: args.id }
    }

    if (Array.isArray(args)) {
        args = {
            user: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        user: typeof args.user === 'object'
        ? args.user.id
        : args.user,
    }

    return index.definition.url
            .replace('{user}', parsedArgs.user.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Settings\UserAccessController::index
* @see app/Http/Controllers/Settings/UserAccessController.php:18
* @route '/settings/users/{user}/access'
*/
index.get = (args: { user: number | { id: number } } | [user: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Settings\UserAccessController::index
* @see app/Http/Controllers/Settings/UserAccessController.php:18
* @route '/settings/users/{user}/access'
*/
index.head = (args: { user: number | { id: number } } | [user: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Settings\UserAccessController::index
* @see app/Http/Controllers/Settings/UserAccessController.php:18
* @route '/settings/users/{user}/access'
*/
const indexForm = (args: { user: number | { id: number } } | [user: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: index.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Settings\UserAccessController::index
* @see app/Http/Controllers/Settings/UserAccessController.php:18
* @route '/settings/users/{user}/access'
*/
indexForm.get = (args: { user: number | { id: number } } | [user: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: index.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Settings\UserAccessController::index
* @see app/Http/Controllers/Settings/UserAccessController.php:18
* @route '/settings/users/{user}/access'
*/
indexForm.head = (args: { user: number | { id: number } } | [user: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: index.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

index.form = indexForm

/**
* @see \App\Http\Controllers\Settings\UserAccessController::toggle
* @see app/Http/Controllers/Settings/UserAccessController.php:94
* @route '/settings/users/{user}/access/toggle'
*/
export const toggle = (args: { user: number | { id: number } } | [user: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: toggle.url(args, options),
    method: 'post',
})

toggle.definition = {
    methods: ["post"],
    url: '/settings/users/{user}/access/toggle',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Settings\UserAccessController::toggle
* @see app/Http/Controllers/Settings/UserAccessController.php:94
* @route '/settings/users/{user}/access/toggle'
*/
toggle.url = (args: { user: number | { id: number } } | [user: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { user: args }
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
        args = { user: args.id }
    }

    if (Array.isArray(args)) {
        args = {
            user: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        user: typeof args.user === 'object'
        ? args.user.id
        : args.user,
    }

    return toggle.definition.url
            .replace('{user}', parsedArgs.user.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Settings\UserAccessController::toggle
* @see app/Http/Controllers/Settings/UserAccessController.php:94
* @route '/settings/users/{user}/access/toggle'
*/
toggle.post = (args: { user: number | { id: number } } | [user: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: toggle.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Settings\UserAccessController::toggle
* @see app/Http/Controllers/Settings/UserAccessController.php:94
* @route '/settings/users/{user}/access/toggle'
*/
const toggleForm = (args: { user: number | { id: number } } | [user: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: toggle.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Settings\UserAccessController::toggle
* @see app/Http/Controllers/Settings/UserAccessController.php:94
* @route '/settings/users/{user}/access/toggle'
*/
toggleForm.post = (args: { user: number | { id: number } } | [user: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: toggle.url(args, options),
    method: 'post',
})

toggle.form = toggleForm

const UserAccessController = { index, toggle }

export default UserAccessController