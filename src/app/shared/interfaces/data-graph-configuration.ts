import { Department } from './department';
import { Program } from 'src/app/shared/interfaces/programs-option';

export interface DataGraphConfiguration {
  selectedStatisticsType?: number;
  selectedGroupType?: number;
  startTime?: Date;
  endTime?: Date;
  selectedDepartment?: Department;
  selectedProgram?: Program;
}
