// @deno-types="https://cdn.sheetjs.com/xlsx-latest/package/types/index.d.ts"
import * as XLSX from "https://cdn.sheetjs.com/xlsx-latest/package/xlsx.mjs";

/* load the codepage support library for extended support with older formats  */
import * as cptable from "https://cdn.sheetjs.com/xlsx-latest/package/dist/cpexcel.full.mjs";
XLSX.set_cptable(cptable);

import * as log from "https://deno.land/std@0.154.0/log/mod.ts";

type ExcelReaderOptions = {
  headerHeight?: number; // 表头占几行
};

type ExcelCell = string | number; // 单元格

type ExcelRow = ExcelCell[];

type ExcelSheet = {
  header: ExcelRow[]; // 表头
  data: ExcelRow[]; // 除表头以外的数据
};

export class ExcelReader {
  protected fileName: string;
  protected workbook: XLSX.WorkBook;

  constructor(fileName: string) {
    const workbook = XLSX.readFile(fileName);
    if (workbook.SheetNames.length == 0) {
      throw new Error("the workbook has no sheet");
    }

    this.workbook = workbook;
    this.fileName = fileName;
  }

  getSheetByIndex(index: number, options: ExcelReaderOptions = {}): ExcelSheet {
    const { headerHeight = 1 } = options;
    const sheetName = this.workbook.SheetNames[index];
    const worksheet = this.workbook.Sheets[sheetName];
    const aoa = XLSX.utils.sheet_to_json(worksheet, {
      header: 1,
      blankrows: false,
    });
    if (aoa.length == 0) {
      throw new Error("the worksheet has no row");
    }
    const header = aoa.slice(0, headerHeight) as ExcelRow[];
    const data = aoa.slice(headerHeight) as ExcelRow[];
    log.debug(
      `file: ${this.fileName} sheet: ${sheetName} head: ${
        JSON.stringify(header)
      } lines: ${data.length}`,
    );
    return { header, data };
  }
}
