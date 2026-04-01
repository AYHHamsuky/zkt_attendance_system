import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../../../wayfinder'
/**
* @see \App\Http\Controllers\OnboardingController::status
* @see app/Http/Controllers/OnboardingController.php:12
* @route '/api/onboarding/status'
*/
export const status = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: status.url(options),
    method: 'get',
})

status.definition = {
    methods: ["get","head"],
    url: '/api/onboarding/status',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\OnboardingController::status
* @see app/Http/Controllers/OnboardingController.php:12
* @route '/api/onboarding/status'
*/
status.url = (options?: RouteQueryOptions) => {
    return status.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\OnboardingController::status
* @see app/Http/Controllers/OnboardingController.php:12
* @route '/api/onboarding/status'
*/
status.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: status.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\OnboardingController::status
* @see app/Http/Controllers/OnboardingController.php:12
* @route '/api/onboarding/status'
*/
status.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: status.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\OnboardingController::status
* @see app/Http/Controllers/OnboardingController.php:12
* @route '/api/onboarding/status'
*/
const statusForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: status.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\OnboardingController::status
* @see app/Http/Controllers/OnboardingController.php:12
* @route '/api/onboarding/status'
*/
statusForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: status.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\OnboardingController::status
* @see app/Http/Controllers/OnboardingController.php:12
* @route '/api/onboarding/status'
*/
statusForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: status.url({
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

status.form = statusForm

/**
* @see \App\Http\Controllers\OnboardingController::update
* @see app/Http/Controllers/OnboardingController.php:33
* @route '/api/onboarding/update'
*/
export const update = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: update.url(options),
    method: 'post',
})

update.definition = {
    methods: ["post"],
    url: '/api/onboarding/update',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\OnboardingController::update
* @see app/Http/Controllers/OnboardingController.php:33
* @route '/api/onboarding/update'
*/
update.url = (options?: RouteQueryOptions) => {
    return update.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\OnboardingController::update
* @see app/Http/Controllers/OnboardingController.php:33
* @route '/api/onboarding/update'
*/
update.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: update.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\OnboardingController::update
* @see app/Http/Controllers/OnboardingController.php:33
* @route '/api/onboarding/update'
*/
const updateForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: update.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\OnboardingController::update
* @see app/Http/Controllers/OnboardingController.php:33
* @route '/api/onboarding/update'
*/
updateForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: update.url(options),
    method: 'post',
})

update.form = updateForm

const OnboardingController = { status, update }

export default OnboardingController