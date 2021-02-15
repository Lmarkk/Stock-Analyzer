import {Component, OnInit, ViewChild} from '@angular/core';
// import { StockDataService } from "./stock-data.service";
import { CsvDataModel } from "./interfaces/csv-data-model";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'Stock Analyzer 2000';

  public records: CsvDataModel[] = [];
  private isLoaded: boolean = false;
  @ViewChild('csvReader') csvReader: any;

  uploadListener($event: any): void {

    let files = $event.target.files;

    if (this.isValidCSVFile(files[0])) {

      let input = $event.target;
      let reader = new FileReader();
      reader.readAsText(input.files[0]);

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
        let csvRecord: CsvDataModel = {
          date: currentRecord[0].trim(),
          closeLast: currentRecord[1].trim(),
          volume: currentRecord[2].trim(),
          open: currentRecord[3].trim(),
          high: currentRecord[4].trim(),
          low: currentRecord[5].trim()
        }
        csvArr.push(csvRecord);
      }
    }
    this.isLoaded = true;
    return csvArr;
  }

  // constructor(private stockDataService: StockDataService) {}

  // ngOnInit() {
  //   console.log(this.stockDataService.getData());
  // }

}
