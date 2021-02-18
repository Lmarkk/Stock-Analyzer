import { Component, Input } from '@angular/core';
import { StockAnalysisService } from '../services/stock-analysis.service';
import { CsvDataModel } from '../interfaces/csv-data-model';
import { AnalysisComponentModel } from '../interfaces/analysis-component-model';

@Component({
  selector: 'app-volume-price-change',
  templateUrl: './app-volume-price-change.component.html',
})
export class AppVolumePriceChangeComponent implements AnalysisComponentModel {

  @Input() stockAnalysisService: StockAnalysisService;
  volumesAndPricesList: CsvDataModel[] = [];

  calculateVolumePriceChanges(startDate: string, endDate: string): void {
    const start: Date = new Date(startDate);
    start.setHours(0, 0, 0, 0);

    const end: Date = new Date(endDate);
    end.setHours(0, 0, 0, 0);

    this.volumesAndPricesList = this.stockAnalysisService
      .calculateHighestVolumeAndPriceChanges(start, end);
  }

  reset(): void {
    this.volumesAndPricesList = [];
  }
}
