import { Department } from './department';
import { Program } from 'src/app/shared/interfaces/programs-option';

export interface DataGraphConfiguration {
  selectedStatisticsType?: number;
  selectedGroupType?: number;
  selectedStartYear?: number;
  selectedEndYear?: number;
  selectedDepartment?: Department;
  selectedProgram?: Program;
}
