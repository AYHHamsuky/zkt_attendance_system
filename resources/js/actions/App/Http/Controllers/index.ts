import OnboardingController from './OnboardingController'
import Api from './Api'
import HR from './HR'
import DeviceController from './DeviceController'
import EmployeeController from './EmployeeController'
import AttendanceController from './AttendanceController'
import Settings from './Settings'

const Controllers = {
    OnboardingController: Object.assign(OnboardingController, OnboardingController),
    Api: Object.assign(Api, Api),
    HR: Object.assign(HR, HR),
    DeviceController: Object.assign(DeviceController, DeviceController),
    EmployeeController: Object.assign(EmployeeController, EmployeeController),
    AttendanceController: Object.assign(AttendanceController, AttendanceController),
    Settings: Object.assign(Settings, Settings),
}

export default Controllers