import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../../wayfinder'
/**
* @see \App\Http\Controllers\HR\PerformanceCycleController::toggleScores
* @see app/Http/Controllers/HR/PerformanceCycleController.php:226
* @route '/hr/performance/cycles/{cycle}/toggle-scores'
*/
export const toggleScores = (args: { cycle: number | { id: number } } | [cycle: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: toggleScores.url(args, options),
    method: 'post',
})

toggleScores.definition = {
    methods: ["post"],
    url: '/hr/performance/cycles/{cycle}/toggle-scores',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\HR\PerformanceCycleController::toggleScores
* @see app/Http/Controllers/HR/PerformanceCycleController.php:226
* @route '/hr/performance/cycles/{cycle}/toggle-scores'
*/
toggleScores.url = (args: { cycle: number | { id: number } } | [cycle: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { cycle: args }
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
        args = { cycle: args.id }
    }

    if (Array.isArray(args)) {
        args = {
            cycle: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        cycle: typeof args.cycle === 'object'
        ? args.cycle.id
        : args.cycle,
    }

    return toggleScores.definition.url
            .replace('{cycle}', parsedArgs.cycle.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\HR\PerformanceCycleController::toggleScores
* @see app/Http/Controllers/HR/PerformanceCycleController.php:226
* @route '/hr/performance/cycles/{cycle}/toggle-scores'
*/
toggleScores.post = (args: { cycle: number | { id: number } } | [cycle: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: toggleScores.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\HR\PerformanceCycleController::toggleScores
* @see app/Http/Controllers/HR/PerformanceCycleController.php:226
* @route '/hr/performance/cycles/{cycle}/toggle-scores'
*/
const toggleScoresForm = (args: { cycle: number | { id: number } } | [cycle: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: toggleScores.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\HR\PerformanceCycleController::toggleScores
* @see app/Http/Controllers/HR/PerformanceCycleController.php:226
* @route '/hr/performance/cycles/{cycle}/toggle-scores'
*/
toggleScoresForm.post = (args: { cycle: number | { id: number } } | [cycle: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: toggleScores.url(args, options),
    method: 'post',
})

toggleScores.form = toggleScoresForm

/**
* @see \App\Http\Controllers\HR\PerformanceCycleController::advancePhase
* @see app/Http/Controllers/HR/PerformanceCycleController.php:125
* @route '/hr/performance/cycles/{cycle}/advance-phase'
*/
export const advancePhase = (args: { cycle: number | { id: number } } | [cycle: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: advancePhase.url(args, options),
    method: 'post',
})

advancePhase.definition = {
    methods: ["post"],
    url: '/hr/performance/cycles/{cycle}/advance-phase',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\HR\PerformanceCycleController::advancePhase
* @see app/Http/Controllers/HR/PerformanceCycleController.php:125
* @route '/hr/performance/cycles/{cycle}/advance-phase'
*/
advancePhase.url = (args: { cycle: number | { id: number } } | [cycle: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { cycle: args }
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
        args = { cycle: args.id }
    }

    if (Array.isArray(args)) {
        args = {
            cycle: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        cycle: typeof args.cycle === 'object'
        ? args.cycle.id
        : args.cycle,
    }

    return advancePhase.definition.url
            .replace('{cycle}', parsedArgs.cycle.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\HR\PerformanceCycleController::advancePhase
* @see app/Http/Controllers/HR/PerformanceCycleController.php:125
* @route '/hr/performance/cycles/{cycle}/advance-phase'
*/
advancePhase.post = (args: { cycle: number | { id: number } } | [cycle: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: advancePhase.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\HR\PerformanceCycleController::advancePhase
* @see app/Http/Controllers/HR/PerformanceCycleController.php:125
* @route '/hr/performance/cycles/{cycle}/advance-phase'
*/
const advancePhaseForm = (args: { cycle: number | { id: number } } | [cycle: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: advancePhase.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\HR\PerformanceCycleController::advancePhase
* @see app/Http/Controllers/HR/PerformanceCycleController.php:125
* @route '/hr/performance/cycles/{cycle}/advance-phase'
*/
advancePhaseForm.post = (args: { cycle: number | { id: number } } | [cycle: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: advancePhase.url(args, options),
    method: 'post',
})

advancePhase.form = advancePhaseForm

/**
* @see \App\Http\Controllers\HR\PerformanceCycleController::extendDates
* @see app/Http/Controllers/HR/PerformanceCycleController.php:183
* @route '/hr/performance/cycles/{cycle}/extend-dates'
*/
export const extendDates = (args: { cycle: number | { id: number } } | [cycle: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: extendDates.url(args, options),
    method: 'post',
})

extendDates.definition = {
    methods: ["post"],
    url: '/hr/performance/cycles/{cycle}/extend-dates',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\HR\PerformanceCycleController::extendDates
* @see app/Http/Controllers/HR/PerformanceCycleController.php:183
* @route '/hr/performance/cycles/{cycle}/extend-dates'
*/
extendDates.url = (args: { cycle: number | { id: number } } | [cycle: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { cycle: args }
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
        args = { cycle: args.id }
    }

    if (Array.isArray(args)) {
        args = {
            cycle: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        cycle: typeof args.cycle === 'object'
        ? args.cycle.id
        : args.cycle,
    }

    return extendDates.definition.url
            .replace('{cycle}', parsedArgs.cycle.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\HR\PerformanceCycleController::extendDates
* @see app/Http/Controllers/HR/PerformanceCycleController.php:183
* @route '/hr/performance/cycles/{cycle}/extend-dates'
*/
extendDates.post = (args: { cycle: number | { id: number } } | [cycle: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: extendDates.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\HR\PerformanceCycleController::extendDates
* @see app/Http/Controllers/HR/PerformanceCycleController.php:183
* @route '/hr/performance/cycles/{cycle}/extend-dates'
*/
const extendDatesForm = (args: { cycle: number | { id: number } } | [cycle: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: extendDates.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\HR\PerformanceCycleController::extendDates
* @see app/Http/Controllers/HR/PerformanceCycleController.php:183
* @route '/hr/performance/cycles/{cycle}/extend-dates'
*/
extendDatesForm.post = (args: { cycle: number | { id: number } } | [cycle: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: extendDates.url(args, options),
    method: 'post',
})

extendDates.form = extendDatesForm

/**
* @see \App\Http\Controllers\HR\PerformanceCycleController::index
* @see app/Http/Controllers/HR/PerformanceCycleController.php:18
* @route '/hr/performance/cycles'
*/
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/hr/performance/cycles',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\HR\PerformanceCycleController::index
* @see app/Http/Controllers/HR/PerformanceCycleController.php:18
* @route '/hr/performance/cycles'
*/
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\HR\PerformanceCycleController::index
* @see app/Http/Controllers/HR/PerformanceCycleController.php:18
* @route '/hr/performance/cycles'
*/
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\HR\PerformanceCycleController::index
* @see app/Http/Controllers/HR/PerformanceCycleController.php:18
* @route '/hr/performance/cycles'
*/
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\HR\PerformanceCycleController::index
* @see app/Http/Controllers/HR/PerformanceCycleController.php:18
* @route '/hr/performance/cycles'
*/
const indexForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\HR\PerformanceCycleController::index
* @see app/Http/Controllers/HR/PerformanceCycleController.php:18
* @route '/hr/performance/cycles'
*/
indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\HR\PerformanceCycleController::index
* @see app/Http/Controllers/HR/PerformanceCycleController.php:18
* @route '/hr/performance/cycles'
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
* @see \App\Http\Controllers\HR\PerformanceCycleController::create
* @see app/Http/Controllers/HR/PerformanceCycleController.php:0
* @route '/hr/performance/cycles/create'
*/
export const create = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: create.url(options),
    method: 'get',
})

create.definition = {
    methods: ["get","head"],
    url: '/hr/performance/cycles/create',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\HR\PerformanceCycleController::create
* @see app/Http/Controllers/HR/PerformanceCycleController.php:0
* @route '/hr/performance/cycles/create'
*/
create.url = (options?: RouteQueryOptions) => {
    return create.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\HR\PerformanceCycleController::create
* @see app/Http/Controllers/HR/PerformanceCycleController.php:0
* @route '/hr/performance/cycles/create'
*/
create.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: create.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\HR\PerformanceCycleController::create
* @see app/Http/Controllers/HR/PerformanceCycleController.php:0
* @route '/hr/performance/cycles/create'
*/
create.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: create.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\HR\PerformanceCycleController::create
* @see app/Http/Controllers/HR/PerformanceCycleController.php:0
* @route '/hr/performance/cycles/create'
*/
const createForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: create.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\HR\PerformanceCycleController::create
* @see app/Http/Controllers/HR/PerformanceCycleController.php:0
* @route '/hr/performance/cycles/create'
*/
createForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: create.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\HR\PerformanceCycleController::create
* @see app/Http/Controllers/HR/PerformanceCycleController.php:0
* @route '/hr/performance/cycles/create'
*/
createForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: create.url({
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

create.form = createForm

/**
* @see \App\Http\Controllers\HR\PerformanceCycleController::store
* @see app/Http/Controllers/HR/PerformanceCycleController.php:29
* @route '/hr/performance/cycles'
*/
export const store = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/hr/performance/cycles',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\HR\PerformanceCycleController::store
* @see app/Http/Controllers/HR/PerformanceCycleController.php:29
* @route '/hr/performance/cycles'
*/
store.url = (options?: RouteQueryOptions) => {
    return store.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\HR\PerformanceCycleController::store
* @see app/Http/Controllers/HR/PerformanceCycleController.php:29
* @route '/hr/performance/cycles'
*/
store.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\HR\PerformanceCycleController::store
* @see app/Http/Controllers/HR/PerformanceCycleController.php:29
* @route '/hr/performance/cycles'
*/
const storeForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: store.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\HR\PerformanceCycleController::store
* @see app/Http/Controllers/HR/PerformanceCycleController.php:29
* @route '/hr/performance/cycles'
*/
storeForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: store.url(options),
    method: 'post',
})

store.form = storeForm

/**
* @see \App\Http\Controllers\HR\PerformanceCycleController::show
* @see app/Http/Controllers/HR/PerformanceCycleController.php:53
* @route '/hr/performance/cycles/{cycle}'
*/
export const show = (args: { cycle: number | { id: number } } | [cycle: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

show.definition = {
    methods: ["get","head"],
    url: '/hr/performance/cycles/{cycle}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\HR\PerformanceCycleController::show
* @see app/Http/Controllers/HR/PerformanceCycleController.php:53
* @route '/hr/performance/cycles/{cycle}'
*/
show.url = (args: { cycle: number | { id: number } } | [cycle: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { cycle: args }
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
        args = { cycle: args.id }
    }

    if (Array.isArray(args)) {
        args = {
            cycle: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        cycle: typeof args.cycle === 'object'
        ? args.cycle.id
        : args.cycle,
    }

    return show.definition.url
            .replace('{cycle}', parsedArgs.cycle.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\HR\PerformanceCycleController::show
* @see app/Http/Controllers/HR/PerformanceCycleController.php:53
* @route '/hr/performance/cycles/{cycle}'
*/
show.get = (args: { cycle: number | { id: number } } | [cycle: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\HR\PerformanceCycleController::show
* @see app/Http/Controllers/HR/PerformanceCycleController.php:53
* @route '/hr/performance/cycles/{cycle}'
*/
show.head = (args: { cycle: number | { id: number } } | [cycle: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: show.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\HR\PerformanceCycleController::show
* @see app/Http/Controllers/HR/PerformanceCycleController.php:53
* @route '/hr/performance/cycles/{cycle}'
*/
const showForm = (args: { cycle: number | { id: number } } | [cycle: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: show.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\HR\PerformanceCycleController::show
* @see app/Http/Controllers/HR/PerformanceCycleController.php:53
* @route '/hr/performance/cycles/{cycle}'
*/
showForm.get = (args: { cycle: number | { id: number } } | [cycle: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: show.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\HR\PerformanceCycleController::show
* @see app/Http/Controllers/HR/PerformanceCycleController.php:53
* @route '/hr/performance/cycles/{cycle}'
*/
showForm.head = (args: { cycle: number | { id: number } } | [cycle: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
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
* @see \App\Http\Controllers\HR\PerformanceCycleController::edit
* @see app/Http/Controllers/HR/PerformanceCycleController.php:0
* @route '/hr/performance/cycles/{cycle}/edit'
*/
export const edit = (args: { cycle: string | number } | [cycle: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: edit.url(args, options),
    method: 'get',
})

edit.definition = {
    methods: ["get","head"],
    url: '/hr/performance/cycles/{cycle}/edit',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\HR\PerformanceCycleController::edit
* @see app/Http/Controllers/HR/PerformanceCycleController.php:0
* @route '/hr/performance/cycles/{cycle}/edit'
*/
edit.url = (args: { cycle: string | number } | [cycle: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { cycle: args }
    }

    if (Array.isArray(args)) {
        args = {
            cycle: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        cycle: args.cycle,
    }

    return edit.definition.url
            .replace('{cycle}', parsedArgs.cycle.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\HR\PerformanceCycleController::edit
* @see app/Http/Controllers/HR/PerformanceCycleController.php:0
* @route '/hr/performance/cycles/{cycle}/edit'
*/
edit.get = (args: { cycle: string | number } | [cycle: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: edit.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\HR\PerformanceCycleController::edit
* @see app/Http/Controllers/HR/PerformanceCycleController.php:0
* @route '/hr/performance/cycles/{cycle}/edit'
*/
edit.head = (args: { cycle: string | number } | [cycle: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: edit.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\HR\PerformanceCycleController::edit
* @see app/Http/Controllers/HR/PerformanceCycleController.php:0
* @route '/hr/performance/cycles/{cycle}/edit'
*/
const editForm = (args: { cycle: string | number } | [cycle: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: edit.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\HR\PerformanceCycleController::edit
* @see app/Http/Controllers/HR/PerformanceCycleController.php:0
* @route '/hr/performance/cycles/{cycle}/edit'
*/
editForm.get = (args: { cycle: string | number } | [cycle: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: edit.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\HR\PerformanceCycleController::edit
* @see app/Http/Controllers/HR/PerformanceCycleController.php:0
* @route '/hr/performance/cycles/{cycle}/edit'
*/
editForm.head = (args: { cycle: string | number } | [cycle: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: edit.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

edit.form = editForm

/**
* @see \App\Http\Controllers\HR\PerformanceCycleController::update
* @see app/Http/Controllers/HR/PerformanceCycleController.php:101
* @route '/hr/performance/cycles/{cycle}'
*/
export const update = (args: { cycle: number | { id: number } } | [cycle: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

update.definition = {
    methods: ["put","patch"],
    url: '/hr/performance/cycles/{cycle}',
} satisfies RouteDefinition<["put","patch"]>

/**
* @see \App\Http\Controllers\HR\PerformanceCycleController::update
* @see app/Http/Controllers/HR/PerformanceCycleController.php:101
* @route '/hr/performance/cycles/{cycle}'
*/
update.url = (args: { cycle: number | { id: number } } | [cycle: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { cycle: args }
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
        args = { cycle: args.id }
    }

    if (Array.isArray(args)) {
        args = {
            cycle: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        cycle: typeof args.cycle === 'object'
        ? args.cycle.id
        : args.cycle,
    }

    return update.definition.url
            .replace('{cycle}', parsedArgs.cycle.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\HR\PerformanceCycleController::update
* @see app/Http/Controllers/HR/PerformanceCycleController.php:101
* @route '/hr/performance/cycles/{cycle}'
*/
update.put = (args: { cycle: number | { id: number } } | [cycle: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

/**
* @see \App\Http\Controllers\HR\PerformanceCycleController::update
* @see app/Http/Controllers/HR/PerformanceCycleController.php:101
* @route '/hr/performance/cycles/{cycle}'
*/
update.patch = (args: { cycle: number | { id: number } } | [cycle: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: update.url(args, options),
    method: 'patch',
})

/**
* @see \App\Http\Controllers\HR\PerformanceCycleController::update
* @see app/Http/Controllers/HR/PerformanceCycleController.php:101
* @route '/hr/performance/cycles/{cycle}'
*/
const updateForm = (args: { cycle: number | { id: number } } | [cycle: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: update.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'PUT',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

/**
* @see \App\Http\Controllers\HR\PerformanceCycleController::update
* @see app/Http/Controllers/HR/PerformanceCycleController.php:101
* @route '/hr/performance/cycles/{cycle}'
*/
updateForm.put = (args: { cycle: number | { id: number } } | [cycle: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: update.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'PUT',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

/**
* @see \App\Http\Controllers\HR\PerformanceCycleController::update
* @see app/Http/Controllers/HR/PerformanceCycleController.php:101
* @route '/hr/performance/cycles/{cycle}'
*/
updateForm.patch = (args: { cycle: number | { id: number } } | [cycle: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
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
* @see \App\Http\Controllers\HR\PerformanceCycleController::destroy
* @see app/Http/Controllers/HR/PerformanceCycleController.php:237
* @route '/hr/performance/cycles/{cycle}'
*/
export const destroy = (args: { cycle: number | { id: number } } | [cycle: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

destroy.definition = {
    methods: ["delete"],
    url: '/hr/performance/cycles/{cycle}',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\HR\PerformanceCycleController::destroy
* @see app/Http/Controllers/HR/PerformanceCycleController.php:237
* @route '/hr/performance/cycles/{cycle}'
*/
destroy.url = (args: { cycle: number | { id: number } } | [cycle: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { cycle: args }
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
        args = { cycle: args.id }
    }

    if (Array.isArray(args)) {
        args = {
            cycle: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        cycle: typeof args.cycle === 'object'
        ? args.cycle.id
        : args.cycle,
    }

    return destroy.definition.url
            .replace('{cycle}', parsedArgs.cycle.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\HR\PerformanceCycleController::destroy
* @see app/Http/Controllers/HR/PerformanceCycleController.php:237
* @route '/hr/performance/cycles/{cycle}'
*/
destroy.delete = (args: { cycle: number | { id: number } } | [cycle: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

/**
* @see \App\Http\Controllers\HR\PerformanceCycleController::destroy
* @see app/Http/Controllers/HR/PerformanceCycleController.php:237
* @route '/hr/performance/cycles/{cycle}'
*/
const destroyForm = (args: { cycle: number | { id: number } } | [cycle: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: destroy.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'DELETE',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

/**
* @see \App\Http\Controllers\HR\PerformanceCycleController::destroy
* @see app/Http/Controllers/HR/PerformanceCycleController.php:237
* @route '/hr/performance/cycles/{cycle}'
*/
destroyForm.delete = (args: { cycle: number | { id: number } } | [cycle: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: destroy.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'DELETE',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

destroy.form = destroyForm

const cycles = {
    toggleScores: Object.assign(toggleScores, toggleScores),
    advancePhase: Object.assign(advancePhase, advancePhase),
    extendDates: Object.assign(extendDates, extendDates),
    index: Object.assign(index, index),
    create: Object.assign(create, create),
    store: Object.assign(store, store),
    show: Object.assign(show, show),
    edit: Object.assign(edit, edit),
    update: Object.assign(update, update),
    destroy: Object.assign(destroy, destroy),
}

export default cycles