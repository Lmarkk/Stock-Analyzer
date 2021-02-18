import { Component, ViewChild, ViewChildren } from '@angular/core';
import { StockAnalysisService } from './services/stock-analysis.service';
import { CsvDataModel } from './interfaces/csv-data-model';
import { AnalysisComponentModel } from './interfaces/analysis-component-model';


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

  constructor(public stockAnalysisService: StockAnalysisService) {}

  uploadListener($event: any): void {

    let files = $event.target.files;

    if(this.isValidCSVFile(files[0])) {
      const input = $event.target;
      const reader = new FileReader();
      reader.readAsText(input.files[0]);
      this.fileName = input.files[0].name;

      reader.onload = () => {
        const csvData = reader.result;
        const csvRecordsArray = (csvData as string).split(/\r\n|\n/);

        const headersRow = this.getHeaderArray(csvRecordsArray);

        this.records = this.getDataRecordsArrayFromCSVFile(csvRecordsArray, headersRow.length);
      };

      reader.onerror = () => {
        alert('error occurred while reading file!');
      };

    } else {
      alert('Please import valid .csv file.');
      this.fileReset();
    }
  }

  isValidCSVFile(file: any) {
    return file.name.endsWith(".csv");
  }

  getHeaderArray(csvRecordsArr: any) {
    const headers = (csvRecordsArr[0] as string).split(',');
    const headerArray = [];
    for(const header of headers) {
      headerArray.push(header);
    }
    return headerArray;
  }

  fileReset() {
    this.csvReader.nativeElement.value = '';
    this.stockAnalysisService.records = [];
    this.isLoaded = false;
  }

  getDataRecordsArrayFromCSVFile(csvRecordsArray: any, headerLength: any) {
    const csvArr = [];

    for (let i = 1; i < csvRecordsArray.length; i++) {
      const currentRecord = (csvRecordsArray[i] as string).split(',');
      if (currentRecord.length === headerLength) {
        const date = new Date(currentRecord[0].trim());
        date.setHours( 0, 0, 0, 0 );
        const csvRecord: CsvDataModel = {
          date,
          closeLast: +currentRecord[1].replace('$', '').trim(),
          volume: +currentRecord[2].trim(),
          open: currentRecord[3].trim(),
          high: +currentRecord[4].replace('$', '').trim(),
          low: +currentRecord[5].replace('$', '').trim()
        };
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
