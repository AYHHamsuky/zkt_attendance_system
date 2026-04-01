import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../wayfinder'
/**
* @see \App\Http\Controllers\HR\NominalRollController::index
* @see app/Http/Controllers/HR/NominalRollController.php:18
* @route '/hr/nominal-roll'
*/
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/hr/nominal-roll',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\HR\NominalRollController::index
* @see app/Http/Controllers/HR/NominalRollController.php:18
* @route '/hr/nominal-roll'
*/
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\HR\NominalRollController::index
* @see app/Http/Controllers/HR/NominalRollController.php:18
* @route '/hr/nominal-roll'
*/
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\HR\NominalRollController::index
* @see app/Http/Controllers/HR/NominalRollController.php:18
* @route '/hr/nominal-roll'
*/
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\HR\NominalRollController::index
* @see app/Http/Controllers/HR/NominalRollController.php:18
* @route '/hr/nominal-roll'
*/
const indexForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\HR\NominalRollController::index
* @see app/Http/Controllers/HR/NominalRollController.php:18
* @route '/hr/nominal-roll'
*/
indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\HR\NominalRollController::index
* @see app/Http/Controllers/HR/NominalRollController.php:18
* @route '/hr/nominal-roll'
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
* @see \App\Http\Controllers\HR\NominalRollController::create
* @see app/Http/Controllers/HR/NominalRollController.php:84
* @route '/hr/nominal-roll/create'
*/
export const create = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: create.url(options),
    method: 'get',
})

create.definition = {
    methods: ["get","head"],
    url: '/hr/nominal-roll/create',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\HR\NominalRollController::create
* @see app/Http/Controllers/HR/NominalRollController.php:84
* @route '/hr/nominal-roll/create'
*/
create.url = (options?: RouteQueryOptions) => {
    return create.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\HR\NominalRollController::create
* @see app/Http/Controllers/HR/NominalRollController.php:84
* @route '/hr/nominal-roll/create'
*/
create.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: create.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\HR\NominalRollController::create
* @see app/Http/Controllers/HR/NominalRollController.php:84
* @route '/hr/nominal-roll/create'
*/
create.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: create.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\HR\NominalRollController::create
* @see app/Http/Controllers/HR/NominalRollController.php:84
* @route '/hr/nominal-roll/create'
*/
const createForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: create.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\HR\NominalRollController::create
* @see app/Http/Controllers/HR/NominalRollController.php:84
* @route '/hr/nominal-roll/create'
*/
createForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: create.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\HR\NominalRollController::create
* @see app/Http/Controllers/HR/NominalRollController.php:84
* @route '/hr/nominal-roll/create'
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
* @see \App\Http\Controllers\HR\NominalRollController::store
* @see app/Http/Controllers/HR/NominalRollController.php:98
* @route '/hr/nominal-roll'
*/
export const store = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/hr/nominal-roll',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\HR\NominalRollController::store
* @see app/Http/Controllers/HR/NominalRollController.php:98
* @route '/hr/nominal-roll'
*/
store.url = (options?: RouteQueryOptions) => {
    return store.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\HR\NominalRollController::store
* @see app/Http/Controllers/HR/NominalRollController.php:98
* @route '/hr/nominal-roll'
*/
store.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\HR\NominalRollController::store
* @see app/Http/Controllers/HR/NominalRollController.php:98
* @route '/hr/nominal-roll'
*/
const storeForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: store.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\HR\NominalRollController::store
* @see app/Http/Controllers/HR/NominalRollController.php:98
* @route '/hr/nominal-roll'
*/
storeForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: store.url(options),
    method: 'post',
})

store.form = storeForm

/**
* @see \App\Http\Controllers\HR\NominalRollController::importMethod
* @see app/Http/Controllers/HR/NominalRollController.php:176
* @route '/hr/nominal-roll/import'
*/
export const importMethod = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: importMethod.url(options),
    method: 'post',
})

importMethod.definition = {
    methods: ["post"],
    url: '/hr/nominal-roll/import',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\HR\NominalRollController::importMethod
* @see app/Http/Controllers/HR/NominalRollController.php:176
* @route '/hr/nominal-roll/import'
*/
importMethod.url = (options?: RouteQueryOptions) => {
    return importMethod.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\HR\NominalRollController::importMethod
* @see app/Http/Controllers/HR/NominalRollController.php:176
* @route '/hr/nominal-roll/import'
*/
importMethod.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: importMethod.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\HR\NominalRollController::importMethod
* @see app/Http/Controllers/HR/NominalRollController.php:176
* @route '/hr/nominal-roll/import'
*/
const importMethodForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: importMethod.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\HR\NominalRollController::importMethod
* @see app/Http/Controllers/HR/NominalRollController.php:176
* @route '/hr/nominal-roll/import'
*/
importMethodForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: importMethod.url(options),
    method: 'post',
})

importMethod.form = importMethodForm

/**
* @see \App\Http\Controllers\HR\NominalRollController::csvTemplate
* @see app/Http/Controllers/HR/NominalRollController.php:279
* @route '/hr/nominal-roll/csv-template'
*/
export const csvTemplate = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: csvTemplate.url(options),
    method: 'get',
})

csvTemplate.definition = {
    methods: ["get","head"],
    url: '/hr/nominal-roll/csv-template',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\HR\NominalRollController::csvTemplate
* @see app/Http/Controllers/HR/NominalRollController.php:279
* @route '/hr/nominal-roll/csv-template'
*/
csvTemplate.url = (options?: RouteQueryOptions) => {
    return csvTemplate.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\HR\NominalRollController::csvTemplate
* @see app/Http/Controllers/HR/NominalRollController.php:279
* @route '/hr/nominal-roll/csv-template'
*/
csvTemplate.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: csvTemplate.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\HR\NominalRollController::csvTemplate
* @see app/Http/Controllers/HR/NominalRollController.php:279
* @route '/hr/nominal-roll/csv-template'
*/
csvTemplate.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: csvTemplate.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\HR\NominalRollController::csvTemplate
* @see app/Http/Controllers/HR/NominalRollController.php:279
* @route '/hr/nominal-roll/csv-template'
*/
const csvTemplateForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: csvTemplate.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\HR\NominalRollController::csvTemplate
* @see app/Http/Controllers/HR/NominalRollController.php:279
* @route '/hr/nominal-roll/csv-template'
*/
csvTemplateForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: csvTemplate.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\HR\NominalRollController::csvTemplate
* @see app/Http/Controllers/HR/NominalRollController.php:279
* @route '/hr/nominal-roll/csv-template'
*/
csvTemplateForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: csvTemplate.url({
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

csvTemplate.form = csvTemplateForm

/**
* @see \App\Http\Controllers\HR\NominalRollController::orgChart
* @see app/Http/Controllers/HR/NominalRollController.php:362
* @route '/hr/nominal-roll/org-chart'
*/
export const orgChart = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: orgChart.url(options),
    method: 'get',
})

orgChart.definition = {
    methods: ["get","head"],
    url: '/hr/nominal-roll/org-chart',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\HR\NominalRollController::orgChart
* @see app/Http/Controllers/HR/NominalRollController.php:362
* @route '/hr/nominal-roll/org-chart'
*/
orgChart.url = (options?: RouteQueryOptions) => {
    return orgChart.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\HR\NominalRollController::orgChart
* @see app/Http/Controllers/HR/NominalRollController.php:362
* @route '/hr/nominal-roll/org-chart'
*/
orgChart.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: orgChart.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\HR\NominalRollController::orgChart
* @see app/Http/Controllers/HR/NominalRollController.php:362
* @route '/hr/nominal-roll/org-chart'
*/
orgChart.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: orgChart.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\HR\NominalRollController::orgChart
* @see app/Http/Controllers/HR/NominalRollController.php:362
* @route '/hr/nominal-roll/org-chart'
*/
const orgChartForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: orgChart.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\HR\NominalRollController::orgChart
* @see app/Http/Controllers/HR/NominalRollController.php:362
* @route '/hr/nominal-roll/org-chart'
*/
orgChartForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: orgChart.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\HR\NominalRollController::orgChart
* @see app/Http/Controllers/HR/NominalRollController.php:362
* @route '/hr/nominal-roll/org-chart'
*/
orgChartForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: orgChart.url({
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

orgChart.form = orgChartForm

/**
* @see \App\Http\Controllers\HR\NominalRollController::show
* @see app/Http/Controllers/HR/NominalRollController.php:309
* @route '/hr/nominal-roll/{employee}'
*/
export const show = (args: { employee: number | { id: number } } | [employee: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

show.definition = {
    methods: ["get","head"],
    url: '/hr/nominal-roll/{employee}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\HR\NominalRollController::show
* @see app/Http/Controllers/HR/NominalRollController.php:309
* @route '/hr/nominal-roll/{employee}'
*/
show.url = (args: { employee: number | { id: number } } | [employee: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { employee: args }
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
        args = { employee: args.id }
    }

    if (Array.isArray(args)) {
        args = {
            employee: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        employee: typeof args.employee === 'object'
        ? args.employee.id
        : args.employee,
    }

    return show.definition.url
            .replace('{employee}', parsedArgs.employee.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\HR\NominalRollController::show
* @see app/Http/Controllers/HR/NominalRollController.php:309
* @route '/hr/nominal-roll/{employee}'
*/
show.get = (args: { employee: number | { id: number } } | [employee: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\HR\NominalRollController::show
* @see app/Http/Controllers/HR/NominalRollController.php:309
* @route '/hr/nominal-roll/{employee}'
*/
show.head = (args: { employee: number | { id: number } } | [employee: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: show.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\HR\NominalRollController::show
* @see app/Http/Controllers/HR/NominalRollController.php:309
* @route '/hr/nominal-roll/{employee}'
*/
const showForm = (args: { employee: number | { id: number } } | [employee: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: show.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\HR\NominalRollController::show
* @see app/Http/Controllers/HR/NominalRollController.php:309
* @route '/hr/nominal-roll/{employee}'
*/
showForm.get = (args: { employee: number | { id: number } } | [employee: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: show.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\HR\NominalRollController::show
* @see app/Http/Controllers/HR/NominalRollController.php:309
* @route '/hr/nominal-roll/{employee}'
*/
showForm.head = (args: { employee: number | { id: number } } | [employee: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
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
* @see \App\Http\Controllers\HR\NominalRollController::update
* @see app/Http/Controllers/HR/NominalRollController.php:418
* @route '/hr/nominal-roll/{employee}'
*/
export const update = (args: { employee: number | { id: number } } | [employee: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: update.url(args, options),
    method: 'patch',
})

update.definition = {
    methods: ["patch"],
    url: '/hr/nominal-roll/{employee}',
} satisfies RouteDefinition<["patch"]>

/**
* @see \App\Http\Controllers\HR\NominalRollController::update
* @see app/Http/Controllers/HR/NominalRollController.php:418
* @route '/hr/nominal-roll/{employee}'
*/
update.url = (args: { employee: number | { id: number } } | [employee: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { employee: args }
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
        args = { employee: args.id }
    }

    if (Array.isArray(args)) {
        args = {
            employee: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        employee: typeof args.employee === 'object'
        ? args.employee.id
        : args.employee,
    }

    return update.definition.url
            .replace('{employee}', parsedArgs.employee.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\HR\NominalRollController::update
* @see app/Http/Controllers/HR/NominalRollController.php:418
* @route '/hr/nominal-roll/{employee}'
*/
update.patch = (args: { employee: number | { id: number } } | [employee: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: update.url(args, options),
    method: 'patch',
})

/**
* @see \App\Http\Controllers\HR\NominalRollController::update
* @see app/Http/Controllers/HR/NominalRollController.php:418
* @route '/hr/nominal-roll/{employee}'
*/
const updateForm = (args: { employee: number | { id: number } } | [employee: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: update.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'PATCH',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

/**
* @see \App\Http\Controllers\HR\NominalRollController::update
* @see app/Http/Controllers/HR/NominalRollController.php:418
* @route '/hr/nominal-roll/{employee}'
*/
updateForm.patch = (args: { employee: number | { id: number } } | [employee: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
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
* @see \App\Http\Controllers\HR\NominalRollController::photo
* @see app/Http/Controllers/HR/NominalRollController.php:346
* @route '/hr/nominal-roll/{employee}/photo'
*/
export const photo = (args: { employee: number | { id: number } } | [employee: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: photo.url(args, options),
    method: 'post',
})

photo.definition = {
    methods: ["post"],
    url: '/hr/nominal-roll/{employee}/photo',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\HR\NominalRollController::photo
* @see app/Http/Controllers/HR/NominalRollController.php:346
* @route '/hr/nominal-roll/{employee}/photo'
*/
photo.url = (args: { employee: number | { id: number } } | [employee: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { employee: args }
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
        args = { employee: args.id }
    }

    if (Array.isArray(args)) {
        args = {
            employee: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        employee: typeof args.employee === 'object'
        ? args.employee.id
        : args.employee,
    }

    return photo.definition.url
            .replace('{employee}', parsedArgs.employee.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\HR\NominalRollController::photo
* @see app/Http/Controllers/HR/NominalRollController.php:346
* @route '/hr/nominal-roll/{employee}/photo'
*/
photo.post = (args: { employee: number | { id: number } } | [employee: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: photo.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\HR\NominalRollController::photo
* @see app/Http/Controllers/HR/NominalRollController.php:346
* @route '/hr/nominal-roll/{employee}/photo'
*/
const photoForm = (args: { employee: number | { id: number } } | [employee: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: photo.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\HR\NominalRollController::photo
* @see app/Http/Controllers/HR/NominalRollController.php:346
* @route '/hr/nominal-roll/{employee}/photo'
*/
photoForm.post = (args: { employee: number | { id: number } } | [employee: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: photo.url(args, options),
    method: 'post',
})

photo.form = photoForm

const nominalRoll = {
    index: Object.assign(index, index),
    create: Object.assign(create, create),
    store: Object.assign(store, store),
    import: Object.assign(importMethod, importMethod),
    csvTemplate: Object.assign(csvTemplate, csvTemplate),
    orgChart: Object.assign(orgChart, orgChart),
    show: Object.assign(show, show),
    update: Object.assign(update, update),
    photo: Object.assign(photo, photo),
}

export default nominalRoll