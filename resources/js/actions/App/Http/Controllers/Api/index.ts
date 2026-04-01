import HealthController from './HealthController'
import DevicePushController from './DevicePushController'

const Api = {
    HealthController: Object.assign(HealthController, HealthController),
    DevicePushController: Object.assign(DevicePushController, DevicePushController),
}

export default Api