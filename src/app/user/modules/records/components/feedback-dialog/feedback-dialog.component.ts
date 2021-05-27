import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material';
import { CampusEventFeedback, InspiringLevelChoice, ProfitChoice, WillingnessLevelChoice } from 'src/app/shared/interfaces/campus-event-feedback';

@Component({
  selector: 'app-feedback-dialog',
  templateUrl: './feedback-dialog.component.html',
  styleUrls: ['./feedback-dialog.component.css']
})
export class FeedbackDialogComponent {
  // fixme: should request from backend.
  inspiringLevels: InspiringLevelChoice[] = [
    {
      level: 0,
      level_str: '有启发，帮助很大',
    },
    {
      level: 1,
      level_str: '启发帮助较大',
    },
    {
      level: 2,
      level_str: '启发帮助不大',
    }
  ];
  profits: ProfitChoice[] = [
    {
      profit: 0,
      profit_str: '对高等教育形势政策的理解得到更新',
    },
    {
      profit: 1,
      profit_str: '通过交流接触到一些适用的教育教学新理念',
    },
    {
      profit: 2,
      profit_str: '获得一些可以直接用在教学上的教学方式方法及教育技术',
    },
    {
      profit: 3,
      profit_str: '理清教师教学发展前景与规划',
    },
    {
      profit: 4,
      profit_str: '重新审视教师教书育人的重要使命',
    },
    {
      profit: 5,
      profit_str: '有其他收益',
    }
  ];
  willingnessLevels: WillingnessLevelChoice[] = [
    {
      level: 0,
      level_str: '非常愿意',
    },
    {
      level: 1,
      level_str: '一般',
    },
    {
      level: 2,
      level_str: '不愿意',
    }
  ];

  data: CampusEventFeedback = {
    profits: [],
  };

  constructor(
    public dialogRef: MatDialogRef<FeedbackDialogComponent>,
  ) {}

  onNoClick(): void {
    this.dialogRef.close();
  }

}
