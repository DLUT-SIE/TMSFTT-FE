import { DataGraphConfiguration } from './data-graph-configuration'

export interface DataGraphOption {
    option?: DataGraphConfiguration;
    isCoverageGraph?: boolean;
    graphTypeName?: string;
    selectedDepartmentName?: string;
}
