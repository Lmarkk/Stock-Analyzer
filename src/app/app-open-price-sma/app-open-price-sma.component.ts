import { Component, Input } from '@angular/core';
import { StockAnalysisService } from '../services/stock-analysis.service';
import { PriceChangesSmaModel } from '../interfaces/price-changes-sma-model';
import { AnalysisComponentModel } from '../interfaces/analysis-component-model';

@Component({
  selector: 'app-open-price-sma',
  templateUrl: './app-open-price-sma.component.html',
  styleUrls: ['./app-open-price-sma.component.css']
})
/**
 * Component which holds holds information and shows ui elements related to SMA price comparisons.
 */
export class AppOpenPriceSmaComponent implements AnalysisComponentModel {

  @Input() stockAnalysisService: StockAnalysisService;
  priceChangeSMAList: PriceChangesSmaModel[] = [];

  calculateOpenPriceSMA(startDate: string, endDate: string): void {
    this.priceChangeSMAList = this.stockAnalysisService
      .calculateOpenPriceChangeViaSMA(startDate, endDate);
  }

  reset(): void {
    this.priceChangeSMAList = [];
  }
}
