import { Component, Input } from '@angular/core';
import { StockAnalysisService } from '../services/stock-analysis.service';
import { AnalysisComponentModel } from '../interfaces/analysis-component-model';

@Component({
  selector: 'app-upward-trend',
  templateUrl: './app-upward-trend.component.html',
})
export class AppUpwardTrendComponent implements AnalysisComponentModel {

  @Input() stockAnalysisService: StockAnalysisService;
  upwardDaysInARow: number = 0;

  calculateUpward(startDate: string, endDate: string): void {
    const start: Date = new Date(startDate);
    start.setHours(0, 0, 0, 0);

    const end: Date = new Date(endDate);
    end.setHours(0, 0, 0, 0);

    this.upwardDaysInARow = this.stockAnalysisService
      .calculateUpwardDaysInARow(start, end);
  }

  reset(): void {
    this.upwardDaysInARow = 0;
  }
}
