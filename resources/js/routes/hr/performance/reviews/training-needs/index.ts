import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../../../wayfinder'
/**
* @see \App\Http\Controllers\HR\PerformanceReviewController::store
* @see app/Http/Controllers/HR/PerformanceReviewController.php:905
* @route '/hr/performance/reviews/{review}/training-needs'
*/
export const store = (args: { review: number | { id: number } } | [review: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(args, options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/hr/performance/reviews/{review}/training-needs',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\HR\PerformanceReviewController::store
* @see app/Http/Controllers/HR/PerformanceReviewController.php:905
* @route '/hr/performance/reviews/{review}/training-needs'
*/
store.url = (args: { review: number | { id: number } } | [review: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { review: args }
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
        args = { review: args.id }
    }

    if (Array.isArray(args)) {
        args = {
            review: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        review: typeof args.review === 'object'
        ? args.review.id
        : args.review,
    }

    return store.definition.url
            .replace('{review}', parsedArgs.review.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\HR\PerformanceReviewController::store
* @see app/Http/Controllers/HR/PerformanceReviewController.php:905
* @route '/hr/performance/reviews/{review}/training-needs'
*/
store.post = (args: { review: number | { id: number } } | [review: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\HR\PerformanceReviewController::store
* @see app/Http/Controllers/HR/PerformanceReviewController.php:905
* @route '/hr/performance/reviews/{review}/training-needs'
*/
const storeForm = (args: { review: number | { id: number } } | [review: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: store.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\HR\PerformanceReviewController::store
* @see app/Http/Controllers/HR/PerformanceReviewController.php:905
* @route '/hr/performance/reviews/{review}/training-needs'
*/
storeForm.post = (args: { review: number | { id: number } } | [review: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: store.url(args, options),
    method: 'post',
})

store.form = storeForm

/**
* @see \App\Http\Controllers\HR\PerformanceReviewController::destroy
* @see app/Http/Controllers/HR/PerformanceReviewController.php:922
* @route '/hr/performance/reviews/{review}/training-needs/{trainingNeed}'
*/
export const destroy = (args: { review: number | { id: number }, trainingNeed: number | { id: number } } | [review: number | { id: number }, trainingNeed: number | { id: number } ], options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

destroy.definition = {
    methods: ["delete"],
    url: '/hr/performance/reviews/{review}/training-needs/{trainingNeed}',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\HR\PerformanceReviewController::destroy
* @see app/Http/Controllers/HR/PerformanceReviewController.php:922
* @route '/hr/performance/reviews/{review}/training-needs/{trainingNeed}'
*/
destroy.url = (args: { review: number | { id: number }, trainingNeed: number | { id: number } } | [review: number | { id: number }, trainingNeed: number | { id: number } ], options?: RouteQueryOptions) => {
    if (Array.isArray(args)) {
        args = {
            review: args[0],
            trainingNeed: args[1],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        review: typeof args.review === 'object'
        ? args.review.id
        : args.review,
        trainingNeed: typeof args.trainingNeed === 'object'
        ? args.trainingNeed.id
        : args.trainingNeed,
    }

    return destroy.definition.url
            .replace('{review}', parsedArgs.review.toString())
            .replace('{trainingNeed}', parsedArgs.trainingNeed.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\HR\PerformanceReviewController::destroy
* @see app/Http/Controllers/HR/PerformanceReviewController.php:922
* @route '/hr/performance/reviews/{review}/training-needs/{trainingNeed}'
*/
destroy.delete = (args: { review: number | { id: number }, trainingNeed: number | { id: number } } | [review: number | { id: number }, trainingNeed: number | { id: number } ], options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

/**
* @see \App\Http\Controllers\HR\PerformanceReviewController::destroy
* @see app/Http/Controllers/HR/PerformanceReviewController.php:922
* @route '/hr/performance/reviews/{review}/training-needs/{trainingNeed}'
*/
const destroyForm = (args: { review: number | { id: number }, trainingNeed: number | { id: number } } | [review: number | { id: number }, trainingNeed: number | { id: number } ], options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: destroy.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'DELETE',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

/**
* @see \App\Http\Controllers\HR\PerformanceReviewController::destroy
* @see app/Http/Controllers/HR/PerformanceReviewController.php:922
* @route '/hr/performance/reviews/{review}/training-needs/{trainingNeed}'
*/
destroyForm.delete = (args: { review: number | { id: number }, trainingNeed: number | { id: number } } | [review: number | { id: number }, trainingNeed: number | { id: number } ], options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: destroy.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'DELETE',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

destroy.form = destroyForm

const trainingNeeds = {
    store: Object.assign(store, store),
    destroy: Object.assign(destroy, destroy),
}

export default trainingNeeds