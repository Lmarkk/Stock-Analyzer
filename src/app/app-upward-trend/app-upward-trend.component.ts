import { Component, Input } from '@angular/core';
import { StockAnalysisService } from '../services/stock-analysis.service';
import { AnalysisComponentModel } from '../interfaces/analysis-component-model';

@Component({
  selector: 'app-upward-trend',
  templateUrl: './app-upward-trend.component.html',
})
/**
 * Component which holds holds information and shows ui elements related to upward trend analysis.
 */
export class AppUpwardTrendComponent implements AnalysisComponentModel {

  @Input() stockAnalysisService: StockAnalysisService;
  upwardDaysInARow: number = 0;

  calculateUpward(startDate: string, endDate: string): void {
    this.upwardDaysInARow = this.stockAnalysisService
      .calculateUpwardDaysInARow(startDate, endDate);
  }

  reset(): void {
    this.upwardDaysInARow = 0;
  }
}
