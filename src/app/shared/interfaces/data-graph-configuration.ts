import { Department } from './department';

export interface DataGraphConfiguration {
  selectedStatisticsType?: number;
  selectedGroupType?: number;
  selectedStartYear?: number;
  selectedEndYear?: number;
  selectedDepartment?: Department;
}
