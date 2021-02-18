import { Component, Input } from '@angular/core';
import { StockAnalysisService } from '../services/stock-analysis.service';
import { PriceChangesSmaModel } from '../interfaces/price-changes-sma-model';
import { AnalysisComponentModel } from '../interfaces/analysis-component-model';

@Component({
  selector: 'app-open-price-sma',
  templateUrl: './app-open-price-sma.component.html',
})
export class AppOpenPriceSmaComponent implements AnalysisComponentModel {

  @Input() stockAnalysisService: StockAnalysisService;
  priceChangeSMAList: PriceChangesSmaModel[] = [];

  calculateOpenPriceSMA(startDate: string, endDate: string): void {
    const start: Date = new Date(startDate);
    start.setHours(0, 0, 0, 0);

    const end: Date = new Date(endDate);
    end.setHours(0, 0, 0, 0);

    this.priceChangeSMAList = this.stockAnalysisService
      .calculateOpenPriceChangeViaSMA(start, end);
  }

  reset(): void {
    this.priceChangeSMAList = [];
  }
}
