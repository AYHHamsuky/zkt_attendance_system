import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../../../wayfinder'
/**
* @see \App\Http\Controllers\Settings\UserManagementController::index
* @see app/Http/Controllers/Settings/UserManagementController.php:23
* @route '/settings/users'
*/
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/settings/users',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Settings\UserManagementController::index
* @see app/Http/Controllers/Settings/UserManagementController.php:23
* @route '/settings/users'
*/
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Settings\UserManagementController::index
* @see app/Http/Controllers/Settings/UserManagementController.php:23
* @route '/settings/users'
*/
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Settings\UserManagementController::index
* @see app/Http/Controllers/Settings/UserManagementController.php:23
* @route '/settings/users'
*/
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Settings\UserManagementController::index
* @see app/Http/Controllers/Settings/UserManagementController.php:23
* @route '/settings/users'
*/
const indexForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Settings\UserManagementController::index
* @see app/Http/Controllers/Settings/UserManagementController.php:23
* @route '/settings/users'
*/
indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Settings\UserManagementController::index
* @see app/Http/Controllers/Settings/UserManagementController.php:23
* @route '/settings/users'
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
* @see \App\Http\Controllers\Settings\UserManagementController::store
* @see app/Http/Controllers/Settings/UserManagementController.php:110
* @route '/settings/users'
*/
export const store = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/settings/users',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Settings\UserManagementController::store
* @see app/Http/Controllers/Settings/UserManagementController.php:110
* @route '/settings/users'
*/
store.url = (options?: RouteQueryOptions) => {
    return store.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Settings\UserManagementController::store
* @see app/Http/Controllers/Settings/UserManagementController.php:110
* @route '/settings/users'
*/
store.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Settings\UserManagementController::store
* @see app/Http/Controllers/Settings/UserManagementController.php:110
* @route '/settings/users'
*/
const storeForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: store.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Settings\UserManagementController::store
* @see app/Http/Controllers/Settings/UserManagementController.php:110
* @route '/settings/users'
*/
storeForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: store.url(options),
    method: 'post',
})

store.form = storeForm

/**
* @see \App\Http\Controllers\Settings\UserManagementController::importFromEmployees
* @see app/Http/Controllers/Settings/UserManagementController.php:201
* @route '/settings/users/import'
*/
export const importFromEmployees = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: importFromEmployees.url(options),
    method: 'post',
})

importFromEmployees.definition = {
    methods: ["post"],
    url: '/settings/users/import',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Settings\UserManagementController::importFromEmployees
* @see app/Http/Controllers/Settings/UserManagementController.php:201
* @route '/settings/users/import'
*/
importFromEmployees.url = (options?: RouteQueryOptions) => {
    return importFromEmployees.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Settings\UserManagementController::importFromEmployees
* @see app/Http/Controllers/Settings/UserManagementController.php:201
* @route '/settings/users/import'
*/
importFromEmployees.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: importFromEmployees.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Settings\UserManagementController::importFromEmployees
* @see app/Http/Controllers/Settings/UserManagementController.php:201
* @route '/settings/users/import'
*/
const importFromEmployeesForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: importFromEmployees.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Settings\UserManagementController::importFromEmployees
* @see app/Http/Controllers/Settings/UserManagementController.php:201
* @route '/settings/users/import'
*/
importFromEmployeesForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: importFromEmployees.url(options),
    method: 'post',
})

importFromEmployees.form = importFromEmployeesForm

/**
* @see \App\Http\Controllers\Settings\UserManagementController::updateRole
* @see app/Http/Controllers/Settings/UserManagementController.php:130
* @route '/settings/users/{user}/role'
*/
export const updateRole = (args: { user: number | { id: number } } | [user: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: updateRole.url(args, options),
    method: 'patch',
})

updateRole.definition = {
    methods: ["patch"],
    url: '/settings/users/{user}/role',
} satisfies RouteDefinition<["patch"]>

/**
* @see \App\Http\Controllers\Settings\UserManagementController::updateRole
* @see app/Http/Controllers/Settings/UserManagementController.php:130
* @route '/settings/users/{user}/role'
*/
updateRole.url = (args: { user: number | { id: number } } | [user: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { user: args }
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
        args = { user: args.id }
    }

    if (Array.isArray(args)) {
        args = {
            user: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        user: typeof args.user === 'object'
        ? args.user.id
        : args.user,
    }

    return updateRole.definition.url
            .replace('{user}', parsedArgs.user.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Settings\UserManagementController::updateRole
* @see app/Http/Controllers/Settings/UserManagementController.php:130
* @route '/settings/users/{user}/role'
*/
updateRole.patch = (args: { user: number | { id: number } } | [user: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: updateRole.url(args, options),
    method: 'patch',
})

/**
* @see \App\Http\Controllers\Settings\UserManagementController::updateRole
* @see app/Http/Controllers/Settings/UserManagementController.php:130
* @route '/settings/users/{user}/role'
*/
const updateRoleForm = (args: { user: number | { id: number } } | [user: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: updateRole.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'PATCH',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Settings\UserManagementController::updateRole
* @see app/Http/Controllers/Settings/UserManagementController.php:130
* @route '/settings/users/{user}/role'
*/
updateRoleForm.patch = (args: { user: number | { id: number } } | [user: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: updateRole.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'PATCH',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

updateRole.form = updateRoleForm

/**
* @see \App\Http\Controllers\Settings\UserManagementController::linkEmployee
* @see app/Http/Controllers/Settings/UserManagementController.php:182
* @route '/settings/users/{user}/link-employee'
*/
export const linkEmployee = (args: { user: number | { id: number } } | [user: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: linkEmployee.url(args, options),
    method: 'patch',
})

linkEmployee.definition = {
    methods: ["patch"],
    url: '/settings/users/{user}/link-employee',
} satisfies RouteDefinition<["patch"]>

/**
* @see \App\Http\Controllers\Settings\UserManagementController::linkEmployee
* @see app/Http/Controllers/Settings/UserManagementController.php:182
* @route '/settings/users/{user}/link-employee'
*/
linkEmployee.url = (args: { user: number | { id: number } } | [user: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { user: args }
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
        args = { user: args.id }
    }

    if (Array.isArray(args)) {
        args = {
            user: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        user: typeof args.user === 'object'
        ? args.user.id
        : args.user,
    }

    return linkEmployee.definition.url
            .replace('{user}', parsedArgs.user.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Settings\UserManagementController::linkEmployee
* @see app/Http/Controllers/Settings/UserManagementController.php:182
* @route '/settings/users/{user}/link-employee'
*/
linkEmployee.patch = (args: { user: number | { id: number } } | [user: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: linkEmployee.url(args, options),
    method: 'patch',
})

/**
* @see \App\Http\Controllers\Settings\UserManagementController::linkEmployee
* @see app/Http/Controllers/Settings/UserManagementController.php:182
* @route '/settings/users/{user}/link-employee'
*/
const linkEmployeeForm = (args: { user: number | { id: number } } | [user: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: linkEmployee.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'PATCH',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Settings\UserManagementController::linkEmployee
* @see app/Http/Controllers/Settings/UserManagementController.php:182
* @route '/settings/users/{user}/link-employee'
*/
linkEmployeeForm.patch = (args: { user: number | { id: number } } | [user: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: linkEmployee.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'PATCH',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

linkEmployee.form = linkEmployeeForm

/**
* @see \App\Http\Controllers\Settings\UserManagementController::resetPassword
* @see app/Http/Controllers/Settings/UserManagementController.php:146
* @route '/settings/users/{user}/reset-password'
*/
export const resetPassword = (args: { user: number | { id: number } } | [user: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: resetPassword.url(args, options),
    method: 'post',
})

resetPassword.definition = {
    methods: ["post"],
    url: '/settings/users/{user}/reset-password',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Settings\UserManagementController::resetPassword
* @see app/Http/Controllers/Settings/UserManagementController.php:146
* @route '/settings/users/{user}/reset-password'
*/
resetPassword.url = (args: { user: number | { id: number } } | [user: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { user: args }
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
        args = { user: args.id }
    }

    if (Array.isArray(args)) {
        args = {
            user: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        user: typeof args.user === 'object'
        ? args.user.id
        : args.user,
    }

    return resetPassword.definition.url
            .replace('{user}', parsedArgs.user.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Settings\UserManagementController::resetPassword
* @see app/Http/Controllers/Settings/UserManagementController.php:146
* @route '/settings/users/{user}/reset-password'
*/
resetPassword.post = (args: { user: number | { id: number } } | [user: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: resetPassword.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Settings\UserManagementController::resetPassword
* @see app/Http/Controllers/Settings/UserManagementController.php:146
* @route '/settings/users/{user}/reset-password'
*/
const resetPasswordForm = (args: { user: number | { id: number } } | [user: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: resetPassword.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Settings\UserManagementController::resetPassword
* @see app/Http/Controllers/Settings/UserManagementController.php:146
* @route '/settings/users/{user}/reset-password'
*/
resetPasswordForm.post = (args: { user: number | { id: number } } | [user: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: resetPassword.url(args, options),
    method: 'post',
})

resetPassword.form = resetPasswordForm

/**
* @see \App\Http\Controllers\Settings\UserManagementController::destroy
* @see app/Http/Controllers/Settings/UserManagementController.php:158
* @route '/settings/users/{user}'
*/
export const destroy = (args: { user: number | { id: number } } | [user: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

destroy.definition = {
    methods: ["delete"],
    url: '/settings/users/{user}',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\Settings\UserManagementController::destroy
* @see app/Http/Controllers/Settings/UserManagementController.php:158
* @route '/settings/users/{user}'
*/
destroy.url = (args: { user: number | { id: number } } | [user: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { user: args }
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
        args = { user: args.id }
    }

    if (Array.isArray(args)) {
        args = {
            user: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        user: typeof args.user === 'object'
        ? args.user.id
        : args.user,
    }

    return destroy.definition.url
            .replace('{user}', parsedArgs.user.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Settings\UserManagementController::destroy
* @see app/Http/Controllers/Settings/UserManagementController.php:158
* @route '/settings/users/{user}'
*/
destroy.delete = (args: { user: number | { id: number } } | [user: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

/**
* @see \App\Http\Controllers\Settings\UserManagementController::destroy
* @see app/Http/Controllers/Settings/UserManagementController.php:158
* @route '/settings/users/{user}'
*/
const destroyForm = (args: { user: number | { id: number } } | [user: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: destroy.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'DELETE',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Settings\UserManagementController::destroy
* @see app/Http/Controllers/Settings/UserManagementController.php:158
* @route '/settings/users/{user}'
*/
destroyForm.delete = (args: { user: number | { id: number } } | [user: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
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
* @see \App\Http\Controllers\Settings\UserManagementController::resetOnboarding
* @see app/Http/Controllers/Settings/UserManagementController.php:174
* @route '/settings/users/{user}/reset-onboarding'
*/
export const resetOnboarding = (args: { user: number | { id: number } } | [user: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: resetOnboarding.url(args, options),
    method: 'post',
})

resetOnboarding.definition = {
    methods: ["post"],
    url: '/settings/users/{user}/reset-onboarding',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Settings\UserManagementController::resetOnboarding
* @see app/Http/Controllers/Settings/UserManagementController.php:174
* @route '/settings/users/{user}/reset-onboarding'
*/
resetOnboarding.url = (args: { user: number | { id: number } } | [user: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { user: args }
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
        args = { user: args.id }
    }

    if (Array.isArray(args)) {
        args = {
            user: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        user: typeof args.user === 'object'
        ? args.user.id
        : args.user,
    }

    return resetOnboarding.definition.url
            .replace('{user}', parsedArgs.user.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Settings\UserManagementController::resetOnboarding
* @see app/Http/Controllers/Settings/UserManagementController.php:174
* @route '/settings/users/{user}/reset-onboarding'
*/
resetOnboarding.post = (args: { user: number | { id: number } } | [user: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: resetOnboarding.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Settings\UserManagementController::resetOnboarding
* @see app/Http/Controllers/Settings/UserManagementController.php:174
* @route '/settings/users/{user}/reset-onboarding'
*/
const resetOnboardingForm = (args: { user: number | { id: number } } | [user: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: resetOnboarding.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Settings\UserManagementController::resetOnboarding
* @see app/Http/Controllers/Settings/UserManagementController.php:174
* @route '/settings/users/{user}/reset-onboarding'
*/
resetOnboardingForm.post = (args: { user: number | { id: number } } | [user: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: resetOnboarding.url(args, options),
    method: 'post',
})

resetOnboarding.form = resetOnboardingForm

const UserManagementController = { index, store, importFromEmployees, updateRole, linkEmployee, resetPassword, destroy, resetOnboarding }

export default UserManagementController