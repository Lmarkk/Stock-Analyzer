import { Injectable } from '@angular/core';
import { CsvDataModel } from '../interfaces/csv-data-model';
import { PriceChangesSmaModel } from '../interfaces/price-changes-sma-model';

@Injectable({ providedIn: 'root' })

/**
 * Service used to perform calculations on .csv imported by user.
 */
export class StockAnalysisService {
  /**
   * Default number of days for SMA analysis.
   */
  private smaDays: number = 5;

  /**
   * This variable holds the data extracted from the .csv file.
   */
  private csvRecords: CsvDataModel[] = [];

  set records(value: CsvDataModel[]) {
    this.csvRecords = value;
  }


  /**
   * Calculates the number of days in a row which had a higher closing price than the previous day.
   * The initial day of this trend is also factored in.
   *
   * First, the service's csv data array is filtered to only include the given date range. The resulting array
   * is then looped through and a variable is incremented to find the highest streak of increasing closing prices.
   *
   * If the result includes at least one day, another is added to account for the starting day of the trend.
   *
   * @param start The first day of the range inspected, inclusive.
   * @param end The last day of the range inspected, inclusive.
   * @return the number of days that follow an upward trend.
   */
  calculateUpwardDaysInARow(start: string, end: string): number {
    const [startDate, endDate] = this.formatDateStrings(start, end);
    if(startDate < endDate) {
      const csvData: CsvDataModel[] = this.csvRecords.filter((record) => {
        return record.date >= startDate && record.date <= endDate;
      }).sort((a, b) => a.date.getTime() - b.date.getTime());

      let currentInARow: number = 0;
      let highestInARow: number = 0;
      for(let i: number = 1; i < csvData.length; i++) {
        if(csvData[i].closeLast > csvData[i - 1].closeLast) {
          currentInARow++;
        } else {
          currentInARow = 0;
        }

        if(currentInARow > highestInARow) {
          highestInARow = currentInARow;
        }
      }

      if(highestInARow > 0) {
        highestInARow++;
      }
      return highestInARow;
    } else {
      alert('Make sure starting date is earlier than ending date!');
      return 0;
    }
  }

  /**
   * Filters the service's csv record array for the given date range. Sorts the resulting array by volume and
   * price change.
   *
   * @param start The first day of the range inspected, inclusive.
   * @param end The last day of the range inspected, inclusive.
   * @return array sorted by volumes and price changes.
   */
  calculateHighestVolumeAndPriceChanges(start: string, end: string): CsvDataModel[] {
    const [startDate, endDate] = this.formatDateStrings(start, end);
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
      if(filteredRecords.length === 0) {
        alert('Date range is not found within .csv file!');
        return [];
      }
    } else {
      alert('Make sure starting date is earlier ending date!');
    }
    return filteredRecords;
  }

  /**
   * Filters the service's csv record array for the given date range and adds extra days from the time before
   * the given range based on the SMA range.
   *
   * The modified record is iterated through and SMA is calculated for each date by taking previous dates in the
   * SMA range, adding their closing prices and dividing the result by the SMA range. The result is then subtracted
   * the opening price of the day in the index of the current iteration. The price difference is then divided by the
   * same opening price and the result multiplied by 100 to get the percentage value.
   *
   * @param start The first day of the range inspected, inclusive.
   * @param end The last day of the range inspected, inclusive.
   * @param smaDays the number of days to factor into SMA calculation.
   * @return array of dates and price change percentages.
   */
  calculateOpenPriceChangeViaSMA(start: string, end: string, smaDays: number = this.smaDays): PriceChangesSmaModel[] {
    const [startDate, endDate] = this.formatDateStrings(start, end);
    const priceChangeRecords: PriceChangesSmaModel[] = [];
    if(startDate < endDate) {

      const filteredRecords: CsvDataModel[] = this.csvRecords.filter((record) => {
        return record.date >= startDate && record.date <= endDate;
      }).sort((a, b) => a.date.getTime() - b.date.getTime());

      if(filteredRecords.length === 0) {
        alert('Date range is not found within .csv file!');
        return [];
      }

      let index = this.csvRecords.findIndex(record => record.date === filteredRecords[0].date) + 1;
      for(let i: number = 0; i < smaDays; i++) {
        if(this.csvRecords[index] == null) {
          alert('Starting date is too early for SMA analysis! Try a later date.');
          return [];
        }
        filteredRecords.push(this.csvRecords[index]);
        index++;
      }

      filteredRecords.sort((a, b) => a.date.getTime() - b.date.getTime());

      for(let i: number = smaDays; i < filteredRecords.length; i++) {
        let change: number = 0;
        for(let x: number = i - 1; x >= i - smaDays; x--) {
          change += filteredRecords[x].closeLast;
          console.log(filteredRecords[x].closeLast);
        }
        change = change / smaDays;
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

  /**
   * Utility method for creating Dates out of date strings received as parameters and standardizing them.
   * @param start starting date string.
   * @param end ending date string.
   * @return 2 Dates with standardized hours.
   */
  formatDateStrings(start: string, end: string): Date[] {
    const startDate: Date = new Date(start);
    startDate.setHours(0, 0, 0, 0);

    const endDate: Date = new Date(end);
    endDate.setHours(0, 0, 0, 0);

    return [startDate, endDate];
  }

}
