import { Component, Input } from '@angular/core';
import { StockAnalysisService } from '../services/stock-analysis.service';
import { CsvDataModel } from '../interfaces/csv-data-model';
import { AnalysisComponentModel } from '../interfaces/analysis-component-model';

@Component({
  selector: 'app-volume-price-change',
  templateUrl: './app-volume-price-change.component.html',
  styleUrls: ['./app-volume-price-change.component.css']
})
/**
 * Component which holds holds information and shows ui elements related to volume and price change
 * listing of stocks.
 */
export class AppVolumePriceChangeComponent implements AnalysisComponentModel {

  @Input() stockAnalysisService: StockAnalysisService;
  volumesAndPricesList: CsvDataModel[] = [];

  calculateVolumePriceChanges(startDate: string, endDate: string): void {
    this.volumesAndPricesList = this.stockAnalysisService
      .calculateHighestVolumeAndPriceChanges(startDate, endDate);
  }

  reset(): void {
    this.volumesAndPricesList = [];
  }
}
