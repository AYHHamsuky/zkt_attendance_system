import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../../../wayfinder'
/**
* @see \App\Http\Controllers\HR\PerformanceReviewController::index
* @see app/Http/Controllers/HR/PerformanceReviewController.php:60
* @route '/hr/performance/reviews'
*/
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/hr/performance/reviews',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\HR\PerformanceReviewController::index
* @see app/Http/Controllers/HR/PerformanceReviewController.php:60
* @route '/hr/performance/reviews'
*/
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\HR\PerformanceReviewController::index
* @see app/Http/Controllers/HR/PerformanceReviewController.php:60
* @route '/hr/performance/reviews'
*/
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\HR\PerformanceReviewController::index
* @see app/Http/Controllers/HR/PerformanceReviewController.php:60
* @route '/hr/performance/reviews'
*/
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\HR\PerformanceReviewController::index
* @see app/Http/Controllers/HR/PerformanceReviewController.php:60
* @route '/hr/performance/reviews'
*/
const indexForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\HR\PerformanceReviewController::index
* @see app/Http/Controllers/HR/PerformanceReviewController.php:60
* @route '/hr/performance/reviews'
*/
indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\HR\PerformanceReviewController::index
* @see app/Http/Controllers/HR/PerformanceReviewController.php:60
* @route '/hr/performance/reviews'
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
* @see \App\Http\Controllers\HR\PerformanceReviewController::store
* @see app/Http/Controllers/HR/PerformanceReviewController.php:101
* @route '/hr/performance/reviews'
*/
export const store = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/hr/performance/reviews',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\HR\PerformanceReviewController::store
* @see app/Http/Controllers/HR/PerformanceReviewController.php:101
* @route '/hr/performance/reviews'
*/
store.url = (options?: RouteQueryOptions) => {
    return store.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\HR\PerformanceReviewController::store
* @see app/Http/Controllers/HR/PerformanceReviewController.php:101
* @route '/hr/performance/reviews'
*/
store.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\HR\PerformanceReviewController::store
* @see app/Http/Controllers/HR/PerformanceReviewController.php:101
* @route '/hr/performance/reviews'
*/
const storeForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: store.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\HR\PerformanceReviewController::store
* @see app/Http/Controllers/HR/PerformanceReviewController.php:101
* @route '/hr/performance/reviews'
*/
storeForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: store.url(options),
    method: 'post',
})

store.form = storeForm

/**
* @see \App\Http\Controllers\HR\PerformanceReviewController::bulkStore
* @see app/Http/Controllers/HR/PerformanceReviewController.php:144
* @route '/hr/performance/reviews/bulk'
*/
export const bulkStore = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: bulkStore.url(options),
    method: 'post',
})

bulkStore.definition = {
    methods: ["post"],
    url: '/hr/performance/reviews/bulk',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\HR\PerformanceReviewController::bulkStore
* @see app/Http/Controllers/HR/PerformanceReviewController.php:144
* @route '/hr/performance/reviews/bulk'
*/
bulkStore.url = (options?: RouteQueryOptions) => {
    return bulkStore.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\HR\PerformanceReviewController::bulkStore
* @see app/Http/Controllers/HR/PerformanceReviewController.php:144
* @route '/hr/performance/reviews/bulk'
*/
bulkStore.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: bulkStore.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\HR\PerformanceReviewController::bulkStore
* @see app/Http/Controllers/HR/PerformanceReviewController.php:144
* @route '/hr/performance/reviews/bulk'
*/
const bulkStoreForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: bulkStore.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\HR\PerformanceReviewController::bulkStore
* @see app/Http/Controllers/HR/PerformanceReviewController.php:144
* @route '/hr/performance/reviews/bulk'
*/
bulkStoreForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: bulkStore.url(options),
    method: 'post',
})

bulkStore.form = bulkStoreForm

/**
* @see \App\Http\Controllers\HR\PerformanceReviewController::sendBulkNotification
* @see app/Http/Controllers/HR/PerformanceReviewController.php:839
* @route '/hr/performance/reviews/send-bulk-notification'
*/
export const sendBulkNotification = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: sendBulkNotification.url(options),
    method: 'post',
})

sendBulkNotification.definition = {
    methods: ["post"],
    url: '/hr/performance/reviews/send-bulk-notification',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\HR\PerformanceReviewController::sendBulkNotification
* @see app/Http/Controllers/HR/PerformanceReviewController.php:839
* @route '/hr/performance/reviews/send-bulk-notification'
*/
sendBulkNotification.url = (options?: RouteQueryOptions) => {
    return sendBulkNotification.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\HR\PerformanceReviewController::sendBulkNotification
* @see app/Http/Controllers/HR/PerformanceReviewController.php:839
* @route '/hr/performance/reviews/send-bulk-notification'
*/
sendBulkNotification.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: sendBulkNotification.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\HR\PerformanceReviewController::sendBulkNotification
* @see app/Http/Controllers/HR/PerformanceReviewController.php:839
* @route '/hr/performance/reviews/send-bulk-notification'
*/
const sendBulkNotificationForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: sendBulkNotification.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\HR\PerformanceReviewController::sendBulkNotification
* @see app/Http/Controllers/HR/PerformanceReviewController.php:839
* @route '/hr/performance/reviews/send-bulk-notification'
*/
sendBulkNotificationForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: sendBulkNotification.url(options),
    method: 'post',
})

sendBulkNotification.form = sendBulkNotificationForm

/**
* @see \App\Http\Controllers\HR\PerformanceReviewController::myReviews
* @see app/Http/Controllers/HR/PerformanceReviewController.php:876
* @route '/hr/performance/my-appraisals'
*/
export const myReviews = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: myReviews.url(options),
    method: 'get',
})

myReviews.definition = {
    methods: ["get","head"],
    url: '/hr/performance/my-appraisals',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\HR\PerformanceReviewController::myReviews
* @see app/Http/Controllers/HR/PerformanceReviewController.php:876
* @route '/hr/performance/my-appraisals'
*/
myReviews.url = (options?: RouteQueryOptions) => {
    return myReviews.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\HR\PerformanceReviewController::myReviews
* @see app/Http/Controllers/HR/PerformanceReviewController.php:876
* @route '/hr/performance/my-appraisals'
*/
myReviews.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: myReviews.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\HR\PerformanceReviewController::myReviews
* @see app/Http/Controllers/HR/PerformanceReviewController.php:876
* @route '/hr/performance/my-appraisals'
*/
myReviews.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: myReviews.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\HR\PerformanceReviewController::myReviews
* @see app/Http/Controllers/HR/PerformanceReviewController.php:876
* @route '/hr/performance/my-appraisals'
*/
const myReviewsForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: myReviews.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\HR\PerformanceReviewController::myReviews
* @see app/Http/Controllers/HR/PerformanceReviewController.php:876
* @route '/hr/performance/my-appraisals'
*/
myReviewsForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: myReviews.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\HR\PerformanceReviewController::myReviews
* @see app/Http/Controllers/HR/PerformanceReviewController.php:876
* @route '/hr/performance/my-appraisals'
*/
myReviewsForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: myReviews.url({
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

myReviews.form = myReviewsForm

/**
* @see \App\Http\Controllers\HR\PerformanceReviewController::downloadPlanningCsvTemplate
* @see app/Http/Controllers/HR/PerformanceReviewController.php:944
* @route '/hr/performance/reviews/planning-csv-template'
*/
export const downloadPlanningCsvTemplate = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: downloadPlanningCsvTemplate.url(options),
    method: 'get',
})

downloadPlanningCsvTemplate.definition = {
    methods: ["get","head"],
    url: '/hr/performance/reviews/planning-csv-template',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\HR\PerformanceReviewController::downloadPlanningCsvTemplate
* @see app/Http/Controllers/HR/PerformanceReviewController.php:944
* @route '/hr/performance/reviews/planning-csv-template'
*/
downloadPlanningCsvTemplate.url = (options?: RouteQueryOptions) => {
    return downloadPlanningCsvTemplate.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\HR\PerformanceReviewController::downloadPlanningCsvTemplate
* @see app/Http/Controllers/HR/PerformanceReviewController.php:944
* @route '/hr/performance/reviews/planning-csv-template'
*/
downloadPlanningCsvTemplate.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: downloadPlanningCsvTemplate.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\HR\PerformanceReviewController::downloadPlanningCsvTemplate
* @see app/Http/Controllers/HR/PerformanceReviewController.php:944
* @route '/hr/performance/reviews/planning-csv-template'
*/
downloadPlanningCsvTemplate.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: downloadPlanningCsvTemplate.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\HR\PerformanceReviewController::downloadPlanningCsvTemplate
* @see app/Http/Controllers/HR/PerformanceReviewController.php:944
* @route '/hr/performance/reviews/planning-csv-template'
*/
const downloadPlanningCsvTemplateForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: downloadPlanningCsvTemplate.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\HR\PerformanceReviewController::downloadPlanningCsvTemplate
* @see app/Http/Controllers/HR/PerformanceReviewController.php:944
* @route '/hr/performance/reviews/planning-csv-template'
*/
downloadPlanningCsvTemplateForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: downloadPlanningCsvTemplate.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\HR\PerformanceReviewController::downloadPlanningCsvTemplate
* @see app/Http/Controllers/HR/PerformanceReviewController.php:944
* @route '/hr/performance/reviews/planning-csv-template'
*/
downloadPlanningCsvTemplateForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: downloadPlanningCsvTemplate.url({
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

downloadPlanningCsvTemplate.form = downloadPlanningCsvTemplateForm

/**
* @see \App\Http\Controllers\HR\PerformanceReviewController::show
* @see app/Http/Controllers/HR/PerformanceReviewController.php:327
* @route '/hr/performance/reviews/{review}'
*/
export const show = (args: { review: number | { id: number } } | [review: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

show.definition = {
    methods: ["get","head"],
    url: '/hr/performance/reviews/{review}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\HR\PerformanceReviewController::show
* @see app/Http/Controllers/HR/PerformanceReviewController.php:327
* @route '/hr/performance/reviews/{review}'
*/
show.url = (args: { review: number | { id: number } } | [review: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
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

    return show.definition.url
            .replace('{review}', parsedArgs.review.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\HR\PerformanceReviewController::show
* @see app/Http/Controllers/HR/PerformanceReviewController.php:327
* @route '/hr/performance/reviews/{review}'
*/
show.get = (args: { review: number | { id: number } } | [review: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\HR\PerformanceReviewController::show
* @see app/Http/Controllers/HR/PerformanceReviewController.php:327
* @route '/hr/performance/reviews/{review}'
*/
show.head = (args: { review: number | { id: number } } | [review: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: show.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\HR\PerformanceReviewController::show
* @see app/Http/Controllers/HR/PerformanceReviewController.php:327
* @route '/hr/performance/reviews/{review}'
*/
const showForm = (args: { review: number | { id: number } } | [review: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: show.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\HR\PerformanceReviewController::show
* @see app/Http/Controllers/HR/PerformanceReviewController.php:327
* @route '/hr/performance/reviews/{review}'
*/
showForm.get = (args: { review: number | { id: number } } | [review: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: show.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\HR\PerformanceReviewController::show
* @see app/Http/Controllers/HR/PerformanceReviewController.php:327
* @route '/hr/performance/reviews/{review}'
*/
showForm.head = (args: { review: number | { id: number } } | [review: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
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
* @see \App\Http\Controllers\HR\PerformanceReviewController::update
* @see app/Http/Controllers/HR/PerformanceReviewController.php:807
* @route '/hr/performance/reviews/{review}'
*/
export const update = (args: { review: number | { id: number } } | [review: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

update.definition = {
    methods: ["put"],
    url: '/hr/performance/reviews/{review}',
} satisfies RouteDefinition<["put"]>

/**
* @see \App\Http\Controllers\HR\PerformanceReviewController::update
* @see app/Http/Controllers/HR/PerformanceReviewController.php:807
* @route '/hr/performance/reviews/{review}'
*/
update.url = (args: { review: number | { id: number } } | [review: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
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

    return update.definition.url
            .replace('{review}', parsedArgs.review.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\HR\PerformanceReviewController::update
* @see app/Http/Controllers/HR/PerformanceReviewController.php:807
* @route '/hr/performance/reviews/{review}'
*/
update.put = (args: { review: number | { id: number } } | [review: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

/**
* @see \App\Http\Controllers\HR\PerformanceReviewController::update
* @see app/Http/Controllers/HR/PerformanceReviewController.php:807
* @route '/hr/performance/reviews/{review}'
*/
const updateForm = (args: { review: number | { id: number } } | [review: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: update.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'PUT',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

/**
* @see \App\Http\Controllers\HR\PerformanceReviewController::update
* @see app/Http/Controllers/HR/PerformanceReviewController.php:807
* @route '/hr/performance/reviews/{review}'
*/
updateForm.put = (args: { review: number | { id: number } } | [review: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: update.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'PUT',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

update.form = updateForm

/**
* @see \App\Http\Controllers\HR\PerformanceReviewController::saveSelf
* @see app/Http/Controllers/HR/PerformanceReviewController.php:381
* @route '/hr/performance/reviews/{review}/save-self'
*/
export const saveSelf = (args: { review: number | { id: number } } | [review: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: saveSelf.url(args, options),
    method: 'post',
})

saveSelf.definition = {
    methods: ["post"],
    url: '/hr/performance/reviews/{review}/save-self',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\HR\PerformanceReviewController::saveSelf
* @see app/Http/Controllers/HR/PerformanceReviewController.php:381
* @route '/hr/performance/reviews/{review}/save-self'
*/
saveSelf.url = (args: { review: number | { id: number } } | [review: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
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

    return saveSelf.definition.url
            .replace('{review}', parsedArgs.review.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\HR\PerformanceReviewController::saveSelf
* @see app/Http/Controllers/HR/PerformanceReviewController.php:381
* @route '/hr/performance/reviews/{review}/save-self'
*/
saveSelf.post = (args: { review: number | { id: number } } | [review: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: saveSelf.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\HR\PerformanceReviewController::saveSelf
* @see app/Http/Controllers/HR/PerformanceReviewController.php:381
* @route '/hr/performance/reviews/{review}/save-self'
*/
const saveSelfForm = (args: { review: number | { id: number } } | [review: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: saveSelf.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\HR\PerformanceReviewController::saveSelf
* @see app/Http/Controllers/HR/PerformanceReviewController.php:381
* @route '/hr/performance/reviews/{review}/save-self'
*/
saveSelfForm.post = (args: { review: number | { id: number } } | [review: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: saveSelf.url(args, options),
    method: 'post',
})

saveSelf.form = saveSelfForm

/**
* @see \App\Http\Controllers\HR\PerformanceReviewController::submit
* @see app/Http/Controllers/HR/PerformanceReviewController.php:660
* @route '/hr/performance/reviews/{review}/submit'
*/
export const submit = (args: { review: number | { id: number } } | [review: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: submit.url(args, options),
    method: 'post',
})

submit.definition = {
    methods: ["post"],
    url: '/hr/performance/reviews/{review}/submit',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\HR\PerformanceReviewController::submit
* @see app/Http/Controllers/HR/PerformanceReviewController.php:660
* @route '/hr/performance/reviews/{review}/submit'
*/
submit.url = (args: { review: number | { id: number } } | [review: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
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

    return submit.definition.url
            .replace('{review}', parsedArgs.review.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\HR\PerformanceReviewController::submit
* @see app/Http/Controllers/HR/PerformanceReviewController.php:660
* @route '/hr/performance/reviews/{review}/submit'
*/
submit.post = (args: { review: number | { id: number } } | [review: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: submit.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\HR\PerformanceReviewController::submit
* @see app/Http/Controllers/HR/PerformanceReviewController.php:660
* @route '/hr/performance/reviews/{review}/submit'
*/
const submitForm = (args: { review: number | { id: number } } | [review: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: submit.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\HR\PerformanceReviewController::submit
* @see app/Http/Controllers/HR/PerformanceReviewController.php:660
* @route '/hr/performance/reviews/{review}/submit'
*/
submitForm.post = (args: { review: number | { id: number } } | [review: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: submit.url(args, options),
    method: 'post',
})

submit.form = submitForm

/**
* @see \App\Http\Controllers\HR\PerformanceReviewController::saveManagerReview
* @see app/Http/Controllers/HR/PerformanceReviewController.php:672
* @route '/hr/performance/reviews/{review}/save-manager'
*/
export const saveManagerReview = (args: { review: number | { id: number } } | [review: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: saveManagerReview.url(args, options),
    method: 'post',
})

saveManagerReview.definition = {
    methods: ["post"],
    url: '/hr/performance/reviews/{review}/save-manager',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\HR\PerformanceReviewController::saveManagerReview
* @see app/Http/Controllers/HR/PerformanceReviewController.php:672
* @route '/hr/performance/reviews/{review}/save-manager'
*/
saveManagerReview.url = (args: { review: number | { id: number } } | [review: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
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

    return saveManagerReview.definition.url
            .replace('{review}', parsedArgs.review.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\HR\PerformanceReviewController::saveManagerReview
* @see app/Http/Controllers/HR/PerformanceReviewController.php:672
* @route '/hr/performance/reviews/{review}/save-manager'
*/
saveManagerReview.post = (args: { review: number | { id: number } } | [review: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: saveManagerReview.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\HR\PerformanceReviewController::saveManagerReview
* @see app/Http/Controllers/HR/PerformanceReviewController.php:672
* @route '/hr/performance/reviews/{review}/save-manager'
*/
const saveManagerReviewForm = (args: { review: number | { id: number } } | [review: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: saveManagerReview.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\HR\PerformanceReviewController::saveManagerReview
* @see app/Http/Controllers/HR/PerformanceReviewController.php:672
* @route '/hr/performance/reviews/{review}/save-manager'
*/
saveManagerReviewForm.post = (args: { review: number | { id: number } } | [review: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: saveManagerReview.url(args, options),
    method: 'post',
})

saveManagerReview.form = saveManagerReviewForm

/**
* @see \App\Http\Controllers\HR\PerformanceReviewController::acknowledge
* @see app/Http/Controllers/HR/PerformanceReviewController.php:710
* @route '/hr/performance/reviews/{review}/acknowledge'
*/
export const acknowledge = (args: { review: number | { id: number } } | [review: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: acknowledge.url(args, options),
    method: 'post',
})

acknowledge.definition = {
    methods: ["post"],
    url: '/hr/performance/reviews/{review}/acknowledge',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\HR\PerformanceReviewController::acknowledge
* @see app/Http/Controllers/HR/PerformanceReviewController.php:710
* @route '/hr/performance/reviews/{review}/acknowledge'
*/
acknowledge.url = (args: { review: number | { id: number } } | [review: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
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

    return acknowledge.definition.url
            .replace('{review}', parsedArgs.review.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\HR\PerformanceReviewController::acknowledge
* @see app/Http/Controllers/HR/PerformanceReviewController.php:710
* @route '/hr/performance/reviews/{review}/acknowledge'
*/
acknowledge.post = (args: { review: number | { id: number } } | [review: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: acknowledge.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\HR\PerformanceReviewController::acknowledge
* @see app/Http/Controllers/HR/PerformanceReviewController.php:710
* @route '/hr/performance/reviews/{review}/acknowledge'
*/
const acknowledgeForm = (args: { review: number | { id: number } } | [review: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: acknowledge.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\HR\PerformanceReviewController::acknowledge
* @see app/Http/Controllers/HR/PerformanceReviewController.php:710
* @route '/hr/performance/reviews/{review}/acknowledge'
*/
acknowledgeForm.post = (args: { review: number | { id: number } } | [review: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: acknowledge.url(args, options),
    method: 'post',
})

acknowledge.form = acknowledgeForm

/**
* @see \App\Http\Controllers\HR\PerformanceReviewController::finalize
* @see app/Http/Controllers/HR/PerformanceReviewController.php:734
* @route '/hr/performance/reviews/{review}/finalize'
*/
export const finalize = (args: { review: number | { id: number } } | [review: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: finalize.url(args, options),
    method: 'post',
})

finalize.definition = {
    methods: ["post"],
    url: '/hr/performance/reviews/{review}/finalize',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\HR\PerformanceReviewController::finalize
* @see app/Http/Controllers/HR/PerformanceReviewController.php:734
* @route '/hr/performance/reviews/{review}/finalize'
*/
finalize.url = (args: { review: number | { id: number } } | [review: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
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

    return finalize.definition.url
            .replace('{review}', parsedArgs.review.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\HR\PerformanceReviewController::finalize
* @see app/Http/Controllers/HR/PerformanceReviewController.php:734
* @route '/hr/performance/reviews/{review}/finalize'
*/
finalize.post = (args: { review: number | { id: number } } | [review: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: finalize.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\HR\PerformanceReviewController::finalize
* @see app/Http/Controllers/HR/PerformanceReviewController.php:734
* @route '/hr/performance/reviews/{review}/finalize'
*/
const finalizeForm = (args: { review: number | { id: number } } | [review: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: finalize.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\HR\PerformanceReviewController::finalize
* @see app/Http/Controllers/HR/PerformanceReviewController.php:734
* @route '/hr/performance/reviews/{review}/finalize'
*/
finalizeForm.post = (args: { review: number | { id: number } } | [review: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: finalize.url(args, options),
    method: 'post',
})

finalize.form = finalizeForm

/**
* @see \App\Http\Controllers\HR\PerformanceReviewController::sendNotification
* @see app/Http/Controllers/HR/PerformanceReviewController.php:820
* @route '/hr/performance/reviews/{review}/send-notification'
*/
export const sendNotification = (args: { review: number | { id: number } } | [review: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: sendNotification.url(args, options),
    method: 'post',
})

sendNotification.definition = {
    methods: ["post"],
    url: '/hr/performance/reviews/{review}/send-notification',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\HR\PerformanceReviewController::sendNotification
* @see app/Http/Controllers/HR/PerformanceReviewController.php:820
* @route '/hr/performance/reviews/{review}/send-notification'
*/
sendNotification.url = (args: { review: number | { id: number } } | [review: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
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

    return sendNotification.definition.url
            .replace('{review}', parsedArgs.review.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\HR\PerformanceReviewController::sendNotification
* @see app/Http/Controllers/HR/PerformanceReviewController.php:820
* @route '/hr/performance/reviews/{review}/send-notification'
*/
sendNotification.post = (args: { review: number | { id: number } } | [review: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: sendNotification.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\HR\PerformanceReviewController::sendNotification
* @see app/Http/Controllers/HR/PerformanceReviewController.php:820
* @route '/hr/performance/reviews/{review}/send-notification'
*/
const sendNotificationForm = (args: { review: number | { id: number } } | [review: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: sendNotification.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\HR\PerformanceReviewController::sendNotification
* @see app/Http/Controllers/HR/PerformanceReviewController.php:820
* @route '/hr/performance/reviews/{review}/send-notification'
*/
sendNotificationForm.post = (args: { review: number | { id: number } } | [review: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: sendNotification.url(args, options),
    method: 'post',
})

sendNotification.form = sendNotificationForm

/**
* @see \App\Http\Controllers\HR\PerformanceReviewController::destroy
* @see app/Http/Controllers/HR/PerformanceReviewController.php:931
* @route '/hr/performance/reviews/{review}'
*/
export const destroy = (args: { review: number | { id: number } } | [review: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

destroy.definition = {
    methods: ["delete"],
    url: '/hr/performance/reviews/{review}',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\HR\PerformanceReviewController::destroy
* @see app/Http/Controllers/HR/PerformanceReviewController.php:931
* @route '/hr/performance/reviews/{review}'
*/
destroy.url = (args: { review: number | { id: number } } | [review: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
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

    return destroy.definition.url
            .replace('{review}', parsedArgs.review.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\HR\PerformanceReviewController::destroy
* @see app/Http/Controllers/HR/PerformanceReviewController.php:931
* @route '/hr/performance/reviews/{review}'
*/
destroy.delete = (args: { review: number | { id: number } } | [review: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

/**
* @see \App\Http\Controllers\HR\PerformanceReviewController::destroy
* @see app/Http/Controllers/HR/PerformanceReviewController.php:931
* @route '/hr/performance/reviews/{review}'
*/
const destroyForm = (args: { review: number | { id: number } } | [review: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
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
* @see app/Http/Controllers/HR/PerformanceReviewController.php:931
* @route '/hr/performance/reviews/{review}'
*/
destroyForm.delete = (args: { review: number | { id: number } } | [review: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
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
* @see \App\Http\Controllers\HR\PerformanceReviewController::uploadPlanningCsv
* @see app/Http/Controllers/HR/PerformanceReviewController.php:981
* @route '/hr/performance/reviews/{review}/upload-csv'
*/
export const uploadPlanningCsv = (args: { review: number | { id: number } } | [review: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: uploadPlanningCsv.url(args, options),
    method: 'post',
})

uploadPlanningCsv.definition = {
    methods: ["post"],
    url: '/hr/performance/reviews/{review}/upload-csv',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\HR\PerformanceReviewController::uploadPlanningCsv
* @see app/Http/Controllers/HR/PerformanceReviewController.php:981
* @route '/hr/performance/reviews/{review}/upload-csv'
*/
uploadPlanningCsv.url = (args: { review: number | { id: number } } | [review: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
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

    return uploadPlanningCsv.definition.url
            .replace('{review}', parsedArgs.review.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\HR\PerformanceReviewController::uploadPlanningCsv
* @see app/Http/Controllers/HR/PerformanceReviewController.php:981
* @route '/hr/performance/reviews/{review}/upload-csv'
*/
uploadPlanningCsv.post = (args: { review: number | { id: number } } | [review: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: uploadPlanningCsv.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\HR\PerformanceReviewController::uploadPlanningCsv
* @see app/Http/Controllers/HR/PerformanceReviewController.php:981
* @route '/hr/performance/reviews/{review}/upload-csv'
*/
const uploadPlanningCsvForm = (args: { review: number | { id: number } } | [review: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: uploadPlanningCsv.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\HR\PerformanceReviewController::uploadPlanningCsv
* @see app/Http/Controllers/HR/PerformanceReviewController.php:981
* @route '/hr/performance/reviews/{review}/upload-csv'
*/
uploadPlanningCsvForm.post = (args: { review: number | { id: number } } | [review: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: uploadPlanningCsv.url(args, options),
    method: 'post',
})

uploadPlanningCsv.form = uploadPlanningCsvForm

/**
* @see \App\Http\Controllers\HR\PerformanceReviewController::storeTrainingNeed
* @see app/Http/Controllers/HR/PerformanceReviewController.php:905
* @route '/hr/performance/reviews/{review}/training-needs'
*/
export const storeTrainingNeed = (args: { review: number | { id: number } } | [review: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: storeTrainingNeed.url(args, options),
    method: 'post',
})

storeTrainingNeed.definition = {
    methods: ["post"],
    url: '/hr/performance/reviews/{review}/training-needs',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\HR\PerformanceReviewController::storeTrainingNeed
* @see app/Http/Controllers/HR/PerformanceReviewController.php:905
* @route '/hr/performance/reviews/{review}/training-needs'
*/
storeTrainingNeed.url = (args: { review: number | { id: number } } | [review: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
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

    return storeTrainingNeed.definition.url
            .replace('{review}', parsedArgs.review.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\HR\PerformanceReviewController::storeTrainingNeed
* @see app/Http/Controllers/HR/PerformanceReviewController.php:905
* @route '/hr/performance/reviews/{review}/training-needs'
*/
storeTrainingNeed.post = (args: { review: number | { id: number } } | [review: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: storeTrainingNeed.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\HR\PerformanceReviewController::storeTrainingNeed
* @see app/Http/Controllers/HR/PerformanceReviewController.php:905
* @route '/hr/performance/reviews/{review}/training-needs'
*/
const storeTrainingNeedForm = (args: { review: number | { id: number } } | [review: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: storeTrainingNeed.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\HR\PerformanceReviewController::storeTrainingNeed
* @see app/Http/Controllers/HR/PerformanceReviewController.php:905
* @route '/hr/performance/reviews/{review}/training-needs'
*/
storeTrainingNeedForm.post = (args: { review: number | { id: number } } | [review: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: storeTrainingNeed.url(args, options),
    method: 'post',
})

storeTrainingNeed.form = storeTrainingNeedForm

/**
* @see \App\Http\Controllers\HR\PerformanceReviewController::destroyTrainingNeed
* @see app/Http/Controllers/HR/PerformanceReviewController.php:922
* @route '/hr/performance/reviews/{review}/training-needs/{trainingNeed}'
*/
export const destroyTrainingNeed = (args: { review: number | { id: number }, trainingNeed: number | { id: number } } | [review: number | { id: number }, trainingNeed: number | { id: number } ], options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroyTrainingNeed.url(args, options),
    method: 'delete',
})

destroyTrainingNeed.definition = {
    methods: ["delete"],
    url: '/hr/performance/reviews/{review}/training-needs/{trainingNeed}',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\HR\PerformanceReviewController::destroyTrainingNeed
* @see app/Http/Controllers/HR/PerformanceReviewController.php:922
* @route '/hr/performance/reviews/{review}/training-needs/{trainingNeed}'
*/
destroyTrainingNeed.url = (args: { review: number | { id: number }, trainingNeed: number | { id: number } } | [review: number | { id: number }, trainingNeed: number | { id: number } ], options?: RouteQueryOptions) => {
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

    return destroyTrainingNeed.definition.url
            .replace('{review}', parsedArgs.review.toString())
            .replace('{trainingNeed}', parsedArgs.trainingNeed.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\HR\PerformanceReviewController::destroyTrainingNeed
* @see app/Http/Controllers/HR/PerformanceReviewController.php:922
* @route '/hr/performance/reviews/{review}/training-needs/{trainingNeed}'
*/
destroyTrainingNeed.delete = (args: { review: number | { id: number }, trainingNeed: number | { id: number } } | [review: number | { id: number }, trainingNeed: number | { id: number } ], options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroyTrainingNeed.url(args, options),
    method: 'delete',
})

/**
* @see \App\Http\Controllers\HR\PerformanceReviewController::destroyTrainingNeed
* @see app/Http/Controllers/HR/PerformanceReviewController.php:922
* @route '/hr/performance/reviews/{review}/training-needs/{trainingNeed}'
*/
const destroyTrainingNeedForm = (args: { review: number | { id: number }, trainingNeed: number | { id: number } } | [review: number | { id: number }, trainingNeed: number | { id: number } ], options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: destroyTrainingNeed.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'DELETE',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

/**
* @see \App\Http\Controllers\HR\PerformanceReviewController::destroyTrainingNeed
* @see app/Http/Controllers/HR/PerformanceReviewController.php:922
* @route '/hr/performance/reviews/{review}/training-needs/{trainingNeed}'
*/
destroyTrainingNeedForm.delete = (args: { review: number | { id: number }, trainingNeed: number | { id: number } } | [review: number | { id: number }, trainingNeed: number | { id: number } ], options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: destroyTrainingNeed.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'DELETE',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

destroyTrainingNeed.form = destroyTrainingNeedForm

/**
* @see \App\Http\Controllers\HR\PerformanceReviewController::agreeEmployee
* @see app/Http/Controllers/HR/PerformanceReviewController.php:501
* @route '/hr/performance/reviews/{review}/agree-employee'
*/
export const agreeEmployee = (args: { review: number | { id: number } } | [review: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: agreeEmployee.url(args, options),
    method: 'post',
})

agreeEmployee.definition = {
    methods: ["post"],
    url: '/hr/performance/reviews/{review}/agree-employee',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\HR\PerformanceReviewController::agreeEmployee
* @see app/Http/Controllers/HR/PerformanceReviewController.php:501
* @route '/hr/performance/reviews/{review}/agree-employee'
*/
agreeEmployee.url = (args: { review: number | { id: number } } | [review: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
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

    return agreeEmployee.definition.url
            .replace('{review}', parsedArgs.review.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\HR\PerformanceReviewController::agreeEmployee
* @see app/Http/Controllers/HR/PerformanceReviewController.php:501
* @route '/hr/performance/reviews/{review}/agree-employee'
*/
agreeEmployee.post = (args: { review: number | { id: number } } | [review: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: agreeEmployee.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\HR\PerformanceReviewController::agreeEmployee
* @see app/Http/Controllers/HR/PerformanceReviewController.php:501
* @route '/hr/performance/reviews/{review}/agree-employee'
*/
const agreeEmployeeForm = (args: { review: number | { id: number } } | [review: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: agreeEmployee.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\HR\PerformanceReviewController::agreeEmployee
* @see app/Http/Controllers/HR/PerformanceReviewController.php:501
* @route '/hr/performance/reviews/{review}/agree-employee'
*/
agreeEmployeeForm.post = (args: { review: number | { id: number } } | [review: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: agreeEmployee.url(args, options),
    method: 'post',
})

agreeEmployee.form = agreeEmployeeForm

/**
* @see \App\Http\Controllers\HR\PerformanceReviewController::agreeManager
* @see app/Http/Controllers/HR/PerformanceReviewController.php:555
* @route '/hr/performance/reviews/{review}/agree-manager'
*/
export const agreeManager = (args: { review: number | { id: number } } | [review: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: agreeManager.url(args, options),
    method: 'post',
})

agreeManager.definition = {
    methods: ["post"],
    url: '/hr/performance/reviews/{review}/agree-manager',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\HR\PerformanceReviewController::agreeManager
* @see app/Http/Controllers/HR/PerformanceReviewController.php:555
* @route '/hr/performance/reviews/{review}/agree-manager'
*/
agreeManager.url = (args: { review: number | { id: number } } | [review: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
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

    return agreeManager.definition.url
            .replace('{review}', parsedArgs.review.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\HR\PerformanceReviewController::agreeManager
* @see app/Http/Controllers/HR/PerformanceReviewController.php:555
* @route '/hr/performance/reviews/{review}/agree-manager'
*/
agreeManager.post = (args: { review: number | { id: number } } | [review: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: agreeManager.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\HR\PerformanceReviewController::agreeManager
* @see app/Http/Controllers/HR/PerformanceReviewController.php:555
* @route '/hr/performance/reviews/{review}/agree-manager'
*/
const agreeManagerForm = (args: { review: number | { id: number } } | [review: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: agreeManager.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\HR\PerformanceReviewController::agreeManager
* @see app/Http/Controllers/HR/PerformanceReviewController.php:555
* @route '/hr/performance/reviews/{review}/agree-manager'
*/
agreeManagerForm.post = (args: { review: number | { id: number } } | [review: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: agreeManager.url(args, options),
    method: 'post',
})

agreeManager.form = agreeManagerForm

/**
* @see \App\Http\Controllers\HR\PerformanceReviewController::hrApprove
* @see app/Http/Controllers/HR/PerformanceReviewController.php:596
* @route '/hr/performance/reviews/{review}/hr-approve'
*/
export const hrApprove = (args: { review: number | { id: number } } | [review: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: hrApprove.url(args, options),
    method: 'post',
})

hrApprove.definition = {
    methods: ["post"],
    url: '/hr/performance/reviews/{review}/hr-approve',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\HR\PerformanceReviewController::hrApprove
* @see app/Http/Controllers/HR/PerformanceReviewController.php:596
* @route '/hr/performance/reviews/{review}/hr-approve'
*/
hrApprove.url = (args: { review: number | { id: number } } | [review: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
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

    return hrApprove.definition.url
            .replace('{review}', parsedArgs.review.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\HR\PerformanceReviewController::hrApprove
* @see app/Http/Controllers/HR/PerformanceReviewController.php:596
* @route '/hr/performance/reviews/{review}/hr-approve'
*/
hrApprove.post = (args: { review: number | { id: number } } | [review: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: hrApprove.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\HR\PerformanceReviewController::hrApprove
* @see app/Http/Controllers/HR/PerformanceReviewController.php:596
* @route '/hr/performance/reviews/{review}/hr-approve'
*/
const hrApproveForm = (args: { review: number | { id: number } } | [review: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: hrApprove.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\HR\PerformanceReviewController::hrApprove
* @see app/Http/Controllers/HR/PerformanceReviewController.php:596
* @route '/hr/performance/reviews/{review}/hr-approve'
*/
hrApproveForm.post = (args: { review: number | { id: number } } | [review: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: hrApprove.url(args, options),
    method: 'post',
})

hrApprove.form = hrApproveForm

/**
* @see \App\Http\Controllers\HR\PerformanceReviewController::hrReject
* @see app/Http/Controllers/HR/PerformanceReviewController.php:625
* @route '/hr/performance/reviews/{review}/hr-reject'
*/
export const hrReject = (args: { review: number | { id: number } } | [review: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: hrReject.url(args, options),
    method: 'post',
})

hrReject.definition = {
    methods: ["post"],
    url: '/hr/performance/reviews/{review}/hr-reject',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\HR\PerformanceReviewController::hrReject
* @see app/Http/Controllers/HR/PerformanceReviewController.php:625
* @route '/hr/performance/reviews/{review}/hr-reject'
*/
hrReject.url = (args: { review: number | { id: number } } | [review: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
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

    return hrReject.definition.url
            .replace('{review}', parsedArgs.review.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\HR\PerformanceReviewController::hrReject
* @see app/Http/Controllers/HR/PerformanceReviewController.php:625
* @route '/hr/performance/reviews/{review}/hr-reject'
*/
hrReject.post = (args: { review: number | { id: number } } | [review: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: hrReject.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\HR\PerformanceReviewController::hrReject
* @see app/Http/Controllers/HR/PerformanceReviewController.php:625
* @route '/hr/performance/reviews/{review}/hr-reject'
*/
const hrRejectForm = (args: { review: number | { id: number } } | [review: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: hrReject.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\HR\PerformanceReviewController::hrReject
* @see app/Http/Controllers/HR/PerformanceReviewController.php:625
* @route '/hr/performance/reviews/{review}/hr-reject'
*/
hrRejectForm.post = (args: { review: number | { id: number } } | [review: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: hrReject.url(args, options),
    method: 'post',
})

hrReject.form = hrRejectForm

/**
* @see \App\Http\Controllers\HR\PerformanceReviewController::storeTrackingEntry
* @see app/Http/Controllers/HR/PerformanceReviewController.php:759
* @route '/hr/performance/reviews/{review}/tracking-entries'
*/
export const storeTrackingEntry = (args: { review: number | { id: number } } | [review: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: storeTrackingEntry.url(args, options),
    method: 'post',
})

storeTrackingEntry.definition = {
    methods: ["post"],
    url: '/hr/performance/reviews/{review}/tracking-entries',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\HR\PerformanceReviewController::storeTrackingEntry
* @see app/Http/Controllers/HR/PerformanceReviewController.php:759
* @route '/hr/performance/reviews/{review}/tracking-entries'
*/
storeTrackingEntry.url = (args: { review: number | { id: number } } | [review: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
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

    return storeTrackingEntry.definition.url
            .replace('{review}', parsedArgs.review.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\HR\PerformanceReviewController::storeTrackingEntry
* @see app/Http/Controllers/HR/PerformanceReviewController.php:759
* @route '/hr/performance/reviews/{review}/tracking-entries'
*/
storeTrackingEntry.post = (args: { review: number | { id: number } } | [review: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: storeTrackingEntry.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\HR\PerformanceReviewController::storeTrackingEntry
* @see app/Http/Controllers/HR/PerformanceReviewController.php:759
* @route '/hr/performance/reviews/{review}/tracking-entries'
*/
const storeTrackingEntryForm = (args: { review: number | { id: number } } | [review: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: storeTrackingEntry.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\HR\PerformanceReviewController::storeTrackingEntry
* @see app/Http/Controllers/HR/PerformanceReviewController.php:759
* @route '/hr/performance/reviews/{review}/tracking-entries'
*/
storeTrackingEntryForm.post = (args: { review: number | { id: number } } | [review: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: storeTrackingEntry.url(args, options),
    method: 'post',
})

storeTrackingEntry.form = storeTrackingEntryForm

/**
* @see \App\Http\Controllers\HR\PerformanceReviewController::destroyTrackingEntry
* @see app/Http/Controllers/HR/PerformanceReviewController.php:790
* @route '/hr/performance/reviews/{review}/tracking-entries/{trackingEntry}'
*/
export const destroyTrackingEntry = (args: { review: number | { id: number }, trackingEntry: number | { id: number } } | [review: number | { id: number }, trackingEntry: number | { id: number } ], options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroyTrackingEntry.url(args, options),
    method: 'delete',
})

destroyTrackingEntry.definition = {
    methods: ["delete"],
    url: '/hr/performance/reviews/{review}/tracking-entries/{trackingEntry}',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\HR\PerformanceReviewController::destroyTrackingEntry
* @see app/Http/Controllers/HR/PerformanceReviewController.php:790
* @route '/hr/performance/reviews/{review}/tracking-entries/{trackingEntry}'
*/
destroyTrackingEntry.url = (args: { review: number | { id: number }, trackingEntry: number | { id: number } } | [review: number | { id: number }, trackingEntry: number | { id: number } ], options?: RouteQueryOptions) => {
    if (Array.isArray(args)) {
        args = {
            review: args[0],
            trackingEntry: args[1],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        review: typeof args.review === 'object'
        ? args.review.id
        : args.review,
        trackingEntry: typeof args.trackingEntry === 'object'
        ? args.trackingEntry.id
        : args.trackingEntry,
    }

    return destroyTrackingEntry.definition.url
            .replace('{review}', parsedArgs.review.toString())
            .replace('{trackingEntry}', parsedArgs.trackingEntry.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\HR\PerformanceReviewController::destroyTrackingEntry
* @see app/Http/Controllers/HR/PerformanceReviewController.php:790
* @route '/hr/performance/reviews/{review}/tracking-entries/{trackingEntry}'
*/
destroyTrackingEntry.delete = (args: { review: number | { id: number }, trackingEntry: number | { id: number } } | [review: number | { id: number }, trackingEntry: number | { id: number } ], options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroyTrackingEntry.url(args, options),
    method: 'delete',
})

/**
* @see \App\Http\Controllers\HR\PerformanceReviewController::destroyTrackingEntry
* @see app/Http/Controllers/HR/PerformanceReviewController.php:790
* @route '/hr/performance/reviews/{review}/tracking-entries/{trackingEntry}'
*/
const destroyTrackingEntryForm = (args: { review: number | { id: number }, trackingEntry: number | { id: number } } | [review: number | { id: number }, trackingEntry: number | { id: number } ], options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: destroyTrackingEntry.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'DELETE',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

/**
* @see \App\Http\Controllers\HR\PerformanceReviewController::destroyTrackingEntry
* @see app/Http/Controllers/HR/PerformanceReviewController.php:790
* @route '/hr/performance/reviews/{review}/tracking-entries/{trackingEntry}'
*/
destroyTrackingEntryForm.delete = (args: { review: number | { id: number }, trackingEntry: number | { id: number } } | [review: number | { id: number }, trackingEntry: number | { id: number } ], options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: destroyTrackingEntry.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'DELETE',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

destroyTrackingEntry.form = destroyTrackingEntryForm

const PerformanceReviewController = { index, store, bulkStore, sendBulkNotification, myReviews, downloadPlanningCsvTemplate, show, update, saveSelf, submit, saveManagerReview, acknowledge, finalize, sendNotification, destroy, uploadPlanningCsv, storeTrainingNeed, destroyTrainingNeed, agreeEmployee, agreeManager, hrApprove, hrReject, storeTrackingEntry, destroyTrackingEntry }

export default PerformanceReviewController