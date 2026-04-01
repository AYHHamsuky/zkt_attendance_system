import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../../wayfinder'
import reports3613d0 from './reports'
import templates from './templates'
import cycles from './cycles'
import reviews from './reviews'
/**
* @see \App\Http\Controllers\HR\PerformanceReportController::reports
* @see app/Http/Controllers/HR/PerformanceReportController.php:18
* @route '/hr/performance/reports'
*/
export const reports = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: reports.url(options),
    method: 'get',
})

reports.definition = {
    methods: ["get","head"],
    url: '/hr/performance/reports',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\HR\PerformanceReportController::reports
* @see app/Http/Controllers/HR/PerformanceReportController.php:18
* @route '/hr/performance/reports'
*/
reports.url = (options?: RouteQueryOptions) => {
    return reports.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\HR\PerformanceReportController::reports
* @see app/Http/Controllers/HR/PerformanceReportController.php:18
* @route '/hr/performance/reports'
*/
reports.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: reports.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\HR\PerformanceReportController::reports
* @see app/Http/Controllers/HR/PerformanceReportController.php:18
* @route '/hr/performance/reports'
*/
reports.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: reports.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\HR\PerformanceReportController::reports
* @see app/Http/Controllers/HR/PerformanceReportController.php:18
* @route '/hr/performance/reports'
*/
const reportsForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: reports.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\HR\PerformanceReportController::reports
* @see app/Http/Controllers/HR/PerformanceReportController.php:18
* @route '/hr/performance/reports'
*/
reportsForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: reports.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\HR\PerformanceReportController::reports
* @see app/Http/Controllers/HR/PerformanceReportController.php:18
* @route '/hr/performance/reports'
*/
reportsForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: reports.url({
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

reports.form = reportsForm

/**
* @see \App\Http\Controllers\HR\PerformanceReviewController::myAppraisals
* @see app/Http/Controllers/HR/PerformanceReviewController.php:876
* @route '/hr/performance/my-appraisals'
*/
export const myAppraisals = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: myAppraisals.url(options),
    method: 'get',
})

myAppraisals.definition = {
    methods: ["get","head"],
    url: '/hr/performance/my-appraisals',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\HR\PerformanceReviewController::myAppraisals
* @see app/Http/Controllers/HR/PerformanceReviewController.php:876
* @route '/hr/performance/my-appraisals'
*/
myAppraisals.url = (options?: RouteQueryOptions) => {
    return myAppraisals.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\HR\PerformanceReviewController::myAppraisals
* @see app/Http/Controllers/HR/PerformanceReviewController.php:876
* @route '/hr/performance/my-appraisals'
*/
myAppraisals.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: myAppraisals.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\HR\PerformanceReviewController::myAppraisals
* @see app/Http/Controllers/HR/PerformanceReviewController.php:876
* @route '/hr/performance/my-appraisals'
*/
myAppraisals.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: myAppraisals.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\HR\PerformanceReviewController::myAppraisals
* @see app/Http/Controllers/HR/PerformanceReviewController.php:876
* @route '/hr/performance/my-appraisals'
*/
const myAppraisalsForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: myAppraisals.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\HR\PerformanceReviewController::myAppraisals
* @see app/Http/Controllers/HR/PerformanceReviewController.php:876
* @route '/hr/performance/my-appraisals'
*/
myAppraisalsForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: myAppraisals.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\HR\PerformanceReviewController::myAppraisals
* @see app/Http/Controllers/HR/PerformanceReviewController.php:876
* @route '/hr/performance/my-appraisals'
*/
myAppraisalsForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: myAppraisals.url({
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

myAppraisals.form = myAppraisalsForm

const performance = {
    reports: Object.assign(reports, reports3613d0),
    templates: Object.assign(templates, templates),
    cycles: Object.assign(cycles, cycles),
    reviews: Object.assign(reviews, reviews),
    myAppraisals: Object.assign(myAppraisals, myAppraisals),
}

export default performance