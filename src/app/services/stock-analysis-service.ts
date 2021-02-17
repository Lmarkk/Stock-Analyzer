import { Injectable } from "@angular/core";
import { CsvDataModel } from "../interfaces/csv-data-model";

@Injectable({ providedIn: 'root' })

export class StockAnalysisService {

  calculateBullishDaysInARow(startDate, endDate, records: CsvDataModel[]): number {
    const start: Date = new Date(startDate);
    const end: Date = new Date(endDate);
    if(start < end) {
      let csvData: CsvDataModel[] = records.filter((record) => {
        if(record.date >= start && record.date <= end) {
          return true;
        } else {
          return false;
        }
      }).sort((a, b) => a.date.getTime() - b.date.getTime());
      console.log(csvData);
      let currentDaysInARow: number = 0;
      let highestInARow: number = 0;
      for(let i: number = 1; i < csvData.length; i++) {
        if(csvData[i].closeLast > csvData[i-1].closeLast) {
          currentDaysInARow++;
        } else {
          currentDaysInARow = 0;
        }

        if(currentDaysInARow > highestInARow) {
          highestInARow = currentDaysInARow;
        }
      }
      console.log(highestInARow);
      return highestInARow;
    } else {
      alert('Make sure starting date is earlier than ending date!');
      return 0;
    }
  }

  CalculateHighestVolumeAndPricechanges(startDate, endDate, records: CsvDataModel[]): CsvDataModel[] {
    const start: Date = new Date(startDate);
    const end: Date = new Date(endDate);
    let filteredRecords: CsvDataModel[] = [];
    if(start < end) {
      filteredRecords = records.filter((record) => {
        if(record.date >= start && record.date <= end) {
          return true;
        } else {
          return false;
        }
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
}
