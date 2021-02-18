import { Injectable } from '@angular/core';
import { CsvDataModel } from '../interfaces/csv-data-model';
import { PriceChangesSmaModel } from '../interfaces/price-changes-sma-model';

@Injectable({ providedIn: 'root' })

export class StockAnalysisService {

  private csvRecords: CsvDataModel[] = [];

  set records(value: CsvDataModel[]) {
    this.csvRecords = value;
  }

  calculateUpwardDaysInARow(startDate, endDate): number {
    if(startDate < endDate) {
      const csvData: CsvDataModel[] = this.csvRecords.filter((record) => {
        return record.date >= startDate && record.date <= endDate;
      }).sort((a, b) => a.date.getTime() - b.date.getTime());

      let currentInARow: number = 0;
      let highestInARow: number = 0;
      for(let i: number = 1; i < csvData.length; i++) {
        if(csvData[i].closeLast > csvData[i-1].closeLast) {
          currentInARow++;
        } else {
          currentInARow = 0;
        }

        if(currentInARow > highestInARow) {
          highestInARow = currentInARow;
        }
      }
      // This includes the first day into the upward trend.
      if(highestInARow > 0) {
        highestInARow++;
      }
      return highestInARow;
    } else {
      alert('Make sure starting date is earlier than ending date!');
      return 0;
    }
  }

  calculateHighestVolumeAndPriceChanges(startDate, endDate): CsvDataModel[] {
    let filteredRecords: CsvDataModel[] = [];
    if(startDate < endDate) {
      filteredRecords = this.csvRecords.filter((record) => {
        return record.date >= startDate && record.date <= endDate;
      }).sort((a, b) => {
        if(a.volume - b.volume === 0) {
          return (b.high - b.low) - (a.high - a.low);
        } else {
          return b.volume - a.volume;
        }
      });
    } else {
      alert('Make sure starting date is earlier ending date!');
    }
    return filteredRecords;
  }

  calculateOpenPriceChangeViaSMA(startDate, endDate): PriceChangesSmaModel[] {
    const priceChangeRecords: PriceChangesSmaModel[] = [];
    if(startDate < endDate) {

      const filteredRecords: CsvDataModel[] = this.csvRecords.filter((record) => {
        return record.date >= startDate && record.date <= endDate;
      });

      const range = filteredRecords.length;

      let startIndex = this.csvRecords.findIndex(record => record.date === filteredRecords[0].date) - 1;
      for(let i: number = 0; i < 5; i++) {
        filteredRecords.push(this.csvRecords[startIndex]);
        startIndex--;
      }

      for(let i: number = 0; i < range; i++) {
        let change: number = 0;
        for(let x: number = i; x < 5 + i; x++) {
          change += filteredRecords[x + 1].closeLast;
        }
        change = change / 5;
        priceChangeRecords.push({
          date: filteredRecords[i].date,
          priceChange: ((filteredRecords[i].open - change) / filteredRecords[i].open) * 100
        });
      }

      priceChangeRecords.sort((a, b) => {
        return b.priceChange - a.priceChange;
      });

    } else {
      alert('Make sure starting date is earlier ending date!');
    }

    return priceChangeRecords;
  }

}
