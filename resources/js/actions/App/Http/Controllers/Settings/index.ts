import ProfileController from './ProfileController'
import PasswordController from './PasswordController'
import TwoFactorAuthenticationController from './TwoFactorAuthenticationController'
import AccessControlController from './AccessControlController'
import UserManagementController from './UserManagementController'
import UserAccessController from './UserAccessController'

const Settings = {
    ProfileController: Object.assign(ProfileController, ProfileController),
    PasswordController: Object.assign(PasswordController, PasswordController),
    TwoFactorAuthenticationController: Object.assign(TwoFactorAuthenticationController, TwoFactorAuthenticationController),
    AccessControlController: Object.assign(AccessControlController, AccessControlController),
    UserManagementController: Object.assign(UserManagementController, UserManagementController),
    UserAccessController: Object.assign(UserAccessController, UserAccessController),
}

export default Settings