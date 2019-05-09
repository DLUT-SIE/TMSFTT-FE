import { Component, OnInit } from '@angular/core';
import { DataGraphOption } from 'src/app/shared/interfaces/data-graph-option';
import { DataGraphConfiguration } from 'src/app/shared/interfaces/data-graph-configuration';

@Component({
  selector: 'app-data-graph',
  templateUrl: './data-graph.component.html',
  styleUrls: ['./data-graph.component.css']
})
export class DataGraphComponent implements OnInit {

  graphOptions: DataGraphConfiguration;
  hidePieGraph: boolean;
  graphTypeName: string;
  selectedDepartmentName: string;

  constructor() { }

  ngOnInit() {
  }

  getOptions(options: DataGraphOption) {
    this.graphOptions = options.option;
    this.hidePieGraph = options.isCoverageGraph;
    this.graphTypeName = options.graphTypeName;
    this.selectedDepartmentName = options.selectedDepartmentName;
  }
}
