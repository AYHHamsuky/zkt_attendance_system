import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../../../../wayfinder'
/**
* @see \App\Http\Controllers\HR\PerformanceReportController::index
* @see app/Http/Controllers/HR/PerformanceReportController.php:18
* @route '/hr/performance/reports'
*/
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/hr/performance/reports',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\HR\PerformanceReportController::index
* @see app/Http/Controllers/HR/PerformanceReportController.php:18
* @route '/hr/performance/reports'
*/
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\HR\PerformanceReportController::index
* @see app/Http/Controllers/HR/PerformanceReportController.php:18
* @route '/hr/performance/reports'
*/
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\HR\PerformanceReportController::index
* @see app/Http/Controllers/HR/PerformanceReportController.php:18
* @route '/hr/performance/reports'
*/
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\HR\PerformanceReportController::index
* @see app/Http/Controllers/HR/PerformanceReportController.php:18
* @route '/hr/performance/reports'
*/
const indexForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\HR\PerformanceReportController::index
* @see app/Http/Controllers/HR/PerformanceReportController.php:18
* @route '/hr/performance/reports'
*/
indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\HR\PerformanceReportController::index
* @see app/Http/Controllers/HR/PerformanceReportController.php:18
* @route '/hr/performance/reports'
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
* @see \App\Http\Controllers\HR\PerformanceReportController::exportMethod
* @see app/Http/Controllers/HR/PerformanceReportController.php:72
* @route '/hr/performance/reports/export'
*/
export const exportMethod = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: exportMethod.url(options),
    method: 'get',
})

exportMethod.definition = {
    methods: ["get","head"],
    url: '/hr/performance/reports/export',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\HR\PerformanceReportController::exportMethod
* @see app/Http/Controllers/HR/PerformanceReportController.php:72
* @route '/hr/performance/reports/export'
*/
exportMethod.url = (options?: RouteQueryOptions) => {
    return exportMethod.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\HR\PerformanceReportController::exportMethod
* @see app/Http/Controllers/HR/PerformanceReportController.php:72
* @route '/hr/performance/reports/export'
*/
exportMethod.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: exportMethod.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\HR\PerformanceReportController::exportMethod
* @see app/Http/Controllers/HR/PerformanceReportController.php:72
* @route '/hr/performance/reports/export'
*/
exportMethod.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: exportMethod.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\HR\PerformanceReportController::exportMethod
* @see app/Http/Controllers/HR/PerformanceReportController.php:72
* @route '/hr/performance/reports/export'
*/
const exportMethodForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: exportMethod.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\HR\PerformanceReportController::exportMethod
* @see app/Http/Controllers/HR/PerformanceReportController.php:72
* @route '/hr/performance/reports/export'
*/
exportMethodForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: exportMethod.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\HR\PerformanceReportController::exportMethod
* @see app/Http/Controllers/HR/PerformanceReportController.php:72
* @route '/hr/performance/reports/export'
*/
exportMethodForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: exportMethod.url({
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

exportMethod.form = exportMethodForm

const PerformanceReportController = { index, exportMethod, export: exportMethod }

export default PerformanceReportController