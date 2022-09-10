import { assert } from "https://deno.land/std@0.154.0/testing/asserts.ts";
import { ExcelReader } from "./ExcelReader.ts";
import "./Log.ts";

Deno.test("ExcelReader", () => {
  const reader = new ExcelReader(
    "testfiles/试运行经销商折扣更新V1.0.xlsx",
  );
  assert(reader);
  const excel = reader.getSheetByIndex(0, { headerHeight: 2 });
  assert(excel);
  console.log(`header: ${JSON.stringify(excel.header, null, 2)}`);
  console.log(`total data lines: ${excel.data.length}`);
});

Deno.test("ExcelReader2", () => {
  const reader = new ExcelReader("testfiles/excel1.xlsx");
  const excel = reader.getSheetByIndex(0);
  console.log(`header: ${JSON.stringify(excel.header, null, 2)}`);
  console.log(`data: ${JSON.stringify(excel.data, null, 2)}`);
  assert(excel.header.length === 1);
  assert(typeof excel.header[0][2] === "number");
  assert(excel.data.length === 3);
  assert(typeof excel.data[0][2] === "number");
  assert(typeof excel.data[1][1] === "string");
});
