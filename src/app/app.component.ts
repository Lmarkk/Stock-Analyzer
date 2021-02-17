import { Component, OnInit, ViewChild } from '@angular/core';
import { StockAnalysisService } from "./services/stock-analysis-service";
import { CsvDataModel } from "./interfaces/csv-data-model";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'Stock Analyzer 2000';

  records: CsvDataModel[] = [];
  isLoaded: boolean = false;
  fileName: string = '';

  bullishDaysInARow: number = 0;
  volumesAndPricesList: CsvDataModel[] = [];

  @ViewChild('csvReader') csvReader: any;

  constructor(private stockAnalysisService: StockAnalysisService) {}

  uploadListener($event: any): void {

    let files = $event.target.files;

    if (this.isValidCSVFile(files[0])) {

      let input = $event.target;
      let reader = new FileReader();
      reader.readAsText(input.files[0]);
      this.fileName = input.files[0].name;

      reader.onload = () => {
        let csvData = reader.result;
        let csvRecordsArray = (<string>csvData).split(/\r\n|\n/);

        let headersRow = this.getHeaderArray(csvRecordsArray);

        this.records = this.getDataRecordsArrayFromCSVFile(csvRecordsArray, headersRow.length);
      };

      reader.onerror = function () {
        console.log('error is occured while reading file!');
      };

    } else {
      alert("Please import valid .csv file.");
      this.fileReset();
    }
  }

  isValidCSVFile(file: any) {
    return file.name.endsWith(".csv");
  }

  getHeaderArray(csvRecordsArr: any) {
    let headers = (<string>csvRecordsArr[0]).split(',');
    let headerArray = [];
    for (let j = 0; j < headers.length; j++) {
      headerArray.push(headers[j]);
    }
    return headerArray;
  }

  fileReset() {
    this.csvReader.nativeElement.value = "";
    this.records = [];
    this.isLoaded = false;
  }

  getDataRecordsArrayFromCSVFile(csvRecordsArray: any, headerLength: any) {
    let csvArr = [];

    for (let i = 1; i < csvRecordsArray.length; i++) {
      let currentRecord = (<string>csvRecordsArray[i]).split(',');
      if (currentRecord.length == headerLength) {
        let date = new Date(currentRecord[0].trim());
        date.setHours( 0,0,0,0 );
        let csvRecord: CsvDataModel = {
          date: date,
          closeLast: +currentRecord[1].replace('$', '').trim(),
          volume: +currentRecord[2].trim(),
          open: currentRecord[3].trim(),
          high: +currentRecord[4].replace('$', '').trim(),
          low: +currentRecord[5].replace('$', '').trim()
        }
        csvArr.push(csvRecord);
      }
    }
    this.isLoaded = true;
    return csvArr;
  }

  calculateBullish(startDate, endDate) {
    let start: Date = new Date(startDate);
    start.setHours(0, 0, 0, 0);

    let end: Date = new Date(endDate);
    end.setHours(0, 0, 0, 0);

    this.bullishDaysInARow = this.stockAnalysisService
      .calculateBullishDaysInARow(start, end, this.records);
  }

  calculateVolumePriceChanges(startDate, endDate) {
    let start: Date = new Date(startDate);
    start.setHours(0, 0, 0, 0);

    let end: Date = new Date(endDate);
    end.setHours(0, 0, 0, 0);

    this.volumesAndPricesList = this.stockAnalysisService
      .CalculateHighestVolumeAndPricechanges(startDate, endDate, this.records);
  }

}
