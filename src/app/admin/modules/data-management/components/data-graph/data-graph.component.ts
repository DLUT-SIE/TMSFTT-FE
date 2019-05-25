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
  isCoverageGraph: boolean;
  graphTypeName: string;

  constructor() { }

  ngOnInit() {
  }

  getOptions(options: DataGraphOption) {
    this.graphOptions = options.option;
    this.isCoverageGraph = options.isCoverageGraph;
    this.graphTypeName = options.graphTypeName;
  }
}
