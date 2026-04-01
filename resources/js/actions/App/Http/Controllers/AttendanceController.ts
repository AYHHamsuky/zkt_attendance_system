import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../../../wayfinder'
/**
* @see \App\Http\Controllers\AttendanceController::index
* @see app/Http/Controllers/AttendanceController.php:24
* @route '/attendance'
*/
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/attendance',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\AttendanceController::index
* @see app/Http/Controllers/AttendanceController.php:24
* @route '/attendance'
*/
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\AttendanceController::index
* @see app/Http/Controllers/AttendanceController.php:24
* @route '/attendance'
*/
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\AttendanceController::index
* @see app/Http/Controllers/AttendanceController.php:24
* @route '/attendance'
*/
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\AttendanceController::index
* @see app/Http/Controllers/AttendanceController.php:24
* @route '/attendance'
*/
const indexForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\AttendanceController::index
* @see app/Http/Controllers/AttendanceController.php:24
* @route '/attendance'
*/
indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\AttendanceController::index
* @see app/Http/Controllers/AttendanceController.php:24
* @route '/attendance'
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
* @see \App\Http\Controllers\AttendanceController::exportMethod
* @see app/Http/Controllers/AttendanceController.php:275
* @route '/attendance/export'
*/
export const exportMethod = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: exportMethod.url(options),
    method: 'get',
})

exportMethod.definition = {
    methods: ["get","head"],
    url: '/attendance/export',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\AttendanceController::exportMethod
* @see app/Http/Controllers/AttendanceController.php:275
* @route '/attendance/export'
*/
exportMethod.url = (options?: RouteQueryOptions) => {
    return exportMethod.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\AttendanceController::exportMethod
* @see app/Http/Controllers/AttendanceController.php:275
* @route '/attendance/export'
*/
exportMethod.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: exportMethod.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\AttendanceController::exportMethod
* @see app/Http/Controllers/AttendanceController.php:275
* @route '/attendance/export'
*/
exportMethod.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: exportMethod.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\AttendanceController::exportMethod
* @see app/Http/Controllers/AttendanceController.php:275
* @route '/attendance/export'
*/
const exportMethodForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: exportMethod.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\AttendanceController::exportMethod
* @see app/Http/Controllers/AttendanceController.php:275
* @route '/attendance/export'
*/
exportMethodForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: exportMethod.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\AttendanceController::exportMethod
* @see app/Http/Controllers/AttendanceController.php:275
* @route '/attendance/export'
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

/**
* @see \App\Http\Controllers\AttendanceController::report
* @see app/Http/Controllers/AttendanceController.php:215
* @route '/attendance/report'
*/
export const report = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: report.url(options),
    method: 'get',
})

report.definition = {
    methods: ["get","head"],
    url: '/attendance/report',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\AttendanceController::report
* @see app/Http/Controllers/AttendanceController.php:215
* @route '/attendance/report'
*/
report.url = (options?: RouteQueryOptions) => {
    return report.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\AttendanceController::report
* @see app/Http/Controllers/AttendanceController.php:215
* @route '/attendance/report'
*/
report.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: report.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\AttendanceController::report
* @see app/Http/Controllers/AttendanceController.php:215
* @route '/attendance/report'
*/
report.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: report.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\AttendanceController::report
* @see app/Http/Controllers/AttendanceController.php:215
* @route '/attendance/report'
*/
const reportForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: report.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\AttendanceController::report
* @see app/Http/Controllers/AttendanceController.php:215
* @route '/attendance/report'
*/
reportForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: report.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\AttendanceController::report
* @see app/Http/Controllers/AttendanceController.php:215
* @route '/attendance/report'
*/
reportForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: report.url({
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

report.form = reportForm

/**
* @see \App\Http\Controllers\AttendanceController::manualClock
* @see app/Http/Controllers/AttendanceController.php:536
* @route '/attendance/manual-clock'
*/
export const manualClock = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: manualClock.url(options),
    method: 'post',
})

manualClock.definition = {
    methods: ["post"],
    url: '/attendance/manual-clock',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\AttendanceController::manualClock
* @see app/Http/Controllers/AttendanceController.php:536
* @route '/attendance/manual-clock'
*/
manualClock.url = (options?: RouteQueryOptions) => {
    return manualClock.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\AttendanceController::manualClock
* @see app/Http/Controllers/AttendanceController.php:536
* @route '/attendance/manual-clock'
*/
manualClock.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: manualClock.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\AttendanceController::manualClock
* @see app/Http/Controllers/AttendanceController.php:536
* @route '/attendance/manual-clock'
*/
const manualClockForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: manualClock.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\AttendanceController::manualClock
* @see app/Http/Controllers/AttendanceController.php:536
* @route '/attendance/manual-clock'
*/
manualClockForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: manualClock.url(options),
    method: 'post',
})

manualClock.form = manualClockForm

const AttendanceController = { index, exportMethod, report, manualClock, export: exportMethod }

export default AttendanceController