import HrDashboardController from './HrDashboardController'
import NominalRollController from './NominalRollController'
import ContractController from './ContractController'
import LeaveTypeController from './LeaveTypeController'
import PublicHolidayController from './PublicHolidayController'
import LeaveController from './LeaveController'
import DocumentController from './DocumentController'
import TransferController from './TransferController'
import ResignationController from './ResignationController'
import PerformanceReportController from './PerformanceReportController'
import PerformanceTemplateController from './PerformanceTemplateController'
import PerformanceCycleController from './PerformanceCycleController'
import PerformanceReviewController from './PerformanceReviewController'

const HR = {
    HrDashboardController: Object.assign(HrDashboardController, HrDashboardController),
    NominalRollController: Object.assign(NominalRollController, NominalRollController),
    ContractController: Object.assign(ContractController, ContractController),
    LeaveTypeController: Object.assign(LeaveTypeController, LeaveTypeController),
    PublicHolidayController: Object.assign(PublicHolidayController, PublicHolidayController),
    LeaveController: Object.assign(LeaveController, LeaveController),
    DocumentController: Object.assign(DocumentController, DocumentController),
    TransferController: Object.assign(TransferController, TransferController),
    ResignationController: Object.assign(ResignationController, ResignationController),
    PerformanceReportController: Object.assign(PerformanceReportController, PerformanceReportController),
    PerformanceTemplateController: Object.assign(PerformanceTemplateController, PerformanceTemplateController),
    PerformanceCycleController: Object.assign(PerformanceCycleController, PerformanceCycleController),
    PerformanceReviewController: Object.assign(PerformanceReviewController, PerformanceReviewController),
}

export default HR