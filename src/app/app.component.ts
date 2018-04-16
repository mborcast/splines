import { Component } from '@angular/core';
import { DecimalPipe } from '@angular/common';

import { CubicSpline } from './CubicSplines/CubicSpline';
import { Dual } from './CubicSplines/Dual';
import readXlsxFile from 'read-excel-file'

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'app';
  canInterpolate: boolean = false;

  cubicSpline: CubicSpline;
  inputData: Array<Dual> = [];
  pointsData: Array<number> = [];
  interpolatedData: Dual[] = [];

  colors = [{
  }];
  chartOptions = {
    responsive: true,
    elements: {
      line: {
          tension: 0, // disables bezier curves
      }
    }
  };

  inputChartData: Array<any> = [];
  inputChartLabels: Array<any> = [];
  inputChart = [
    {
      data: this.inputChartData,
      backgroundColor: 'rgba(0,0,0,0)',
      borderColor: 'rgba(0,190,140,0.6)',
      pointBackgroundColor: 'rgba(0,190,140,1)',
      label: 'Input Data'
    },
  ];

  interpolationChartData: Array<any> = [];
  interpolationChart = [
    {
      data: this.interpolationChartData,
      backgroundColor: 'rgba(0,0,0,0)',
      borderColor: 'rgba(123,0,255,0.4)',
      pointBackgroundColor: 'rgba(123,0,255,0.6)',
      label: 'Interpolated Data'
    }
  ];

  constructor() {
  }
  onInputFileSet(event) {
    const files = event.srcElement.files;
    const schema = {
      'x': {
        prop: 'x',
        type: Number,
        required: true
      },
      'y': {
        prop: 'y',
        type: Number,
        required: true
      }
    }
    readXlsxFile(files[0], { schema }).then(
      (data) => {
        this.inputData.splice(0, this.inputData.length);
        this.inputData = data['rows'];
        this.canInterpolate = (this.pointsData.length > 0 && this.inputData.length > 0);
      }
    )
  }
  onPointsFileSet(event) {
    const files = event.srcElement.files;
    const schema = {
      'points': {
        prop: 'x',
        type: Number,
        required: true
      }
    }
    readXlsxFile(files[0], { schema }).then(
      (data) => {

        for (let point of data['rows']) {
          this.pointsData.push(point.x);
        }
        this.canInterpolate = (this.pointsData.length > 0 && this.inputData.length > 0);
      }
    )
  }

  resetInterpolationChart() {
    this.interpolationChartData.splice(0, this.interpolationChartData.length);
    this.pointsData.splice(0, this.pointsData.length);
  }
  resetInputChart() {
    this.inputChartData.splice(0, this.inputChartData.length);
    this.pointsData.splice(0, this.pointsData.length);
  }

  start() {
    this.cubicSpline = new CubicSpline();
    for (let point of this.inputData) {
      this.cubicSpline.addDual(point.x, point.y);
    }
    this.interpolatedData = this.cubicSpline.interpolate(this.pointsData);
    for (let point of this.interpolatedData) {
      this.interpolationChartData.push({x: point.x, y: point.y});
    }
    for (let point of this.inputData) {
      this.inputChartData.push({x: point.x, y: point.y});
      this.inputChartLabels.push(point.x);
    }
  }

}
