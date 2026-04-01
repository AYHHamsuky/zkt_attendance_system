import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../../wayfinder'
/**
* @see \App\Http\Controllers\Settings\AccessControlController::index
* @see app/Http/Controllers/Settings/AccessControlController.php:15
* @route '/settings/access'
*/
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/settings/access',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Settings\AccessControlController::index
* @see app/Http/Controllers/Settings/AccessControlController.php:15
* @route '/settings/access'
*/
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Settings\AccessControlController::index
* @see app/Http/Controllers/Settings/AccessControlController.php:15
* @route '/settings/access'
*/
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Settings\AccessControlController::index
* @see app/Http/Controllers/Settings/AccessControlController.php:15
* @route '/settings/access'
*/
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Settings\AccessControlController::index
* @see app/Http/Controllers/Settings/AccessControlController.php:15
* @route '/settings/access'
*/
const indexForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Settings\AccessControlController::index
* @see app/Http/Controllers/Settings/AccessControlController.php:15
* @route '/settings/access'
*/
indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Settings\AccessControlController::index
* @see app/Http/Controllers/Settings/AccessControlController.php:15
* @route '/settings/access'
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
* @see \App\Http\Controllers\Settings\AccessControlController::toggle
* @see app/Http/Controllers/Settings/AccessControlController.php:60
* @route '/settings/access/toggle'
*/
export const toggle = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: toggle.url(options),
    method: 'post',
})

toggle.definition = {
    methods: ["post"],
    url: '/settings/access/toggle',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Settings\AccessControlController::toggle
* @see app/Http/Controllers/Settings/AccessControlController.php:60
* @route '/settings/access/toggle'
*/
toggle.url = (options?: RouteQueryOptions) => {
    return toggle.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Settings\AccessControlController::toggle
* @see app/Http/Controllers/Settings/AccessControlController.php:60
* @route '/settings/access/toggle'
*/
toggle.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: toggle.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Settings\AccessControlController::toggle
* @see app/Http/Controllers/Settings/AccessControlController.php:60
* @route '/settings/access/toggle'
*/
const toggleForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: toggle.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Settings\AccessControlController::toggle
* @see app/Http/Controllers/Settings/AccessControlController.php:60
* @route '/settings/access/toggle'
*/
toggleForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: toggle.url(options),
    method: 'post',
})

toggle.form = toggleForm

const access = {
    index: Object.assign(index, index),
    toggle: Object.assign(toggle, toggle),
}

export default access