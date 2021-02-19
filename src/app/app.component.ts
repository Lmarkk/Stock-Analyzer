import { Component, ViewChild, ViewChildren } from '@angular/core';
import { StockAnalysisService } from './services/stock-analysis.service';
import { CsvDataModel } from './interfaces/csv-data-model';
import { AnalysisComponentModel } from './interfaces/analysis-component-model';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html'
})
/**
 * Main component which listens to file uploads from the user and acts as a parent component to
 * components used to perform stock analyses.
 */
export class AppComponent {
  title = 'Stock Analyzer 2000';

  isLoaded: boolean = false;
  fileName: string = '';

  /**
   * .csv reader html element.
   */
  @ViewChild('csvReader') csvReader: any;
  /**
   * List of all child components used to perform stock analyses.
   */
  @ViewChildren('analysisComponent') components: AnalysisComponentModel[];

  constructor(public stockAnalysisService: StockAnalysisService) {}

  /**
   * Listener method for file uploads. Whenever the file input is interacted with, all child components used
   * for analyses are reset.
   *
   * The validity of the incoming .csv file is checked and parsed into an array which is passed to a further method.
   * @param $event file uploading event.
   */
  uploadListener($event: any): void {
    for(const component of this.components) {
      component.reset();
    }
    const files = $event.target.files;

    if(this.isValidCSVFile(files[0])) {
      const input = $event.target;
      const reader = new FileReader();
      reader.readAsText(input.files[0]);
      this.fileName = input.files[0].name;

      reader.onload = () => {
        const csvData = reader.result;
        const csvRecordsArray = (csvData as string).split(/\r\n|\n/);

        const headersRow = this.getHeaderArray(csvRecordsArray);

        this.stockAnalysisService.records = this.getDataRecordsArrayFromCSVFile(csvRecordsArray, headersRow.length);
      };

      reader.onerror = () => {
        alert('error occurred while reading file!');
      };

    } else {
      alert('Please import valid .csv file.');
      this.fileReset();
    }
  }

  /**
   * Checks validity of .csv file input.
   * @param file incoming file.
   * @return whether the input is a valid .csv file.
   */
  isValidCSVFile(file: any): boolean {
    if(file == null) {
      return false;
    } else {
      return file.name.endsWith('.csv');
    }
  }

  /**
   * Separates headers of .csv record into a string array.
   * @param csvRecordsArr incoming csv records array.
   * @return string array of csv headers.
   */
  getHeaderArray(csvRecordsArr: any): string[] {
    const headers = (csvRecordsArr[0] as string).split(',');
    const headerArray: string[] = [];
    for(const header of headers) {
      headerArray.push(header);
    }
    return headerArray;
  }

  /**
   * Method for resetting currently loaded csv records and visibility of filename and some ui elements.
   */
  fileReset(): void {
    this.csvReader.nativeElement.value = '';
    this.stockAnalysisService.records = [];
    this.isLoaded = false;
  }

  /**
   * Parses data from csv array into desired data format for easier handling later.
   * @param csvRecordsArray source data array.
   * @param headerLength number of headers in the .csv file.
   * @return formatted data array.
   */
  getDataRecordsArrayFromCSVFile(csvRecordsArray: any, headerLength: any) {
    const csvArr = [];

    for (let i = 1; i < csvRecordsArray.length; i++) {
      const currentRecord = (csvRecordsArray[i] as string).split(',');
      if (currentRecord.length === headerLength) {
        const date = new Date(currentRecord[0].trim());
        date.setHours( 0, 0, 0, 0 );
        const csvRecord: CsvDataModel = {
          date,
          closeLast: this.formatCurrencyString(currentRecord[1], '$'),
          volume: this.formatCurrencyString(currentRecord[2]),
          open: this.formatCurrencyString(currentRecord[3], '$'),
          high: this.formatCurrencyString(currentRecord[4], '$'),
          low: this.formatCurrencyString(currentRecord[5], '$')
        };
        csvArr.push(csvRecord);
      }
    }
    this.isLoaded = true;
    return csvArr;
  }

  /**
   * Utility method for parsing currency strings into numbers.
   * @param str string to parse.
   * @param symbol symbol to remove.
   * @return resulting number.
   */
  formatCurrencyString(str: string, symbol?: string): number {
    if(symbol) {
      return +str.replace(symbol, '').trim();
    } else {
      return +str.trim();
    }
  }
}
