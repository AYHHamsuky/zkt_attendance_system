import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../../../../wayfinder'
/**
* @see \App\Http\Controllers\HR\HrDashboardController::__invoke
* @see app/Http/Controllers/HR/HrDashboardController.php:20
* @route '/dashboard'
*/
const HrDashboardController = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: HrDashboardController.url(options),
    method: 'get',
})

HrDashboardController.definition = {
    methods: ["get","head"],
    url: '/dashboard',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\HR\HrDashboardController::__invoke
* @see app/Http/Controllers/HR/HrDashboardController.php:20
* @route '/dashboard'
*/
HrDashboardController.url = (options?: RouteQueryOptions) => {
    return HrDashboardController.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\HR\HrDashboardController::__invoke
* @see app/Http/Controllers/HR/HrDashboardController.php:20
* @route '/dashboard'
*/
HrDashboardController.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: HrDashboardController.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\HR\HrDashboardController::__invoke
* @see app/Http/Controllers/HR/HrDashboardController.php:20
* @route '/dashboard'
*/
HrDashboardController.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: HrDashboardController.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\HR\HrDashboardController::__invoke
* @see app/Http/Controllers/HR/HrDashboardController.php:20
* @route '/dashboard'
*/
const HrDashboardControllerForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: HrDashboardController.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\HR\HrDashboardController::__invoke
* @see app/Http/Controllers/HR/HrDashboardController.php:20
* @route '/dashboard'
*/
HrDashboardControllerForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: HrDashboardController.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\HR\HrDashboardController::__invoke
* @see app/Http/Controllers/HR/HrDashboardController.php:20
* @route '/dashboard'
*/
HrDashboardControllerForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: HrDashboardController.url({
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

HrDashboardController.form = HrDashboardControllerForm

export default HrDashboardController