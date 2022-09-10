import { Context } from "./Context.ts";
import { Fetcher } from "./Fetcher.ts";

export type FieldText = string;
export type FieldNumber = number;
export type FieldSingleSelect = {
  name: string;
  value: string;
};
export type FieldMultiSelect = Array<FieldSingleSelect>;
export type FieldDate = string;
export type FieldMultiDate = Array<FieldDate>;
export type FieldArea = Array<string>;
export type FieldPicture = {
  url: string;
};
export type FieldPhoto = Array<FieldPicture>;
export type FieldOneAttachment = {
  fileName: string;
  size: number;
  ext: string;
  metadataSign: string;
  thumbnail: string;
  url: string;
  sourceName: string;
};
export type FieldAttachments = Array<FieldOneAttachment>;
export type FieldRichText = string;
export type FieldAutoNumber = string;
export type FieldOcr = Array<FieldPicture>;
export type FieldPosition = {
  longitude: number;
  latitude: number;
  province: string;
  city: string;
  county: string;
  locationName: string;
  detail: string;
};
export type FieldRecur = {
  startTime: string;
  endTime: string;
  recur: {
    recurType: "never" | "everyday" | "everyweek" | "every2week";
  };
  endRecur: {
    endType: "forever" | "count" | "until";
    count: number;
    until: string;
  };
};
export type FieldLookup = Array<DataObject>;
export type FieldLayerRelation = Array<DataObject>;
export type FieldMasterDetail = Array<DataObject>;
export type Field =
  | FieldText
  | FieldNumber
  | FieldSingleSelect
  | FieldMultiSelect
  | FieldDate
  | FieldMultiDate
  | FieldArea
  | FieldPhoto
  | FieldAttachments
  | FieldRichText
  | FieldAutoNumber
  | FieldOcr
  | FieldPosition
  | FieldRecur
  | FieldLookup
  | FieldLayerRelation
  | FieldMasterDetail;

type DataObjectListRequest = {
  form_code: string;
  record_ids?: number[];
  query_criteria?: Record<string, Field>;
  page?: number;
  num?: number;
};

type FormData = {
  record_id: string;
  form_code: string;
  row_data: Record<string, Field>;
};

type DataObjectListResponse = {
  form_data: Array<FormData>;
};

type DataObjectDetailRequest = {
  form_code: string;
  record_id: number;
};

export class DataObject {
  formCode?: string;
  recordId?: number;
  rowData?: Record<string, Field>;

  constructor(o: DataObject) {
    this.formCode = o.formCode;
    this.recordId = o.recordId;
    this.rowData = o.rowData;
  }

  static async list(
    ctx: Context,
    req: DataObjectListRequest,
  ): Promise<Array<DataObject> | undefined> {
    const fetcher = new Fetcher("/api/data/form/record/list");
    const data = await fetcher.fetchJson(ctx, req) as DataObjectListResponse;
    return data?.form_data?.map((x) =>
      new DataObject({
        formCode: x.form_code,
        recordId: parseInt(x.record_id),
        rowData: x.row_data,
      })
    );
  }

  static async detail(
    ctx: Context,
    req: DataObjectDetailRequest,
  ): Promise<DataObject | undefined> {
    const fetcher = new Fetcher("/api/data/form/record/detail");
    const data = await fetcher.fetchJson(ctx, req) as FormData;
    if (!data) {
      return undefined;
    }
    return new DataObject({
      formCode: data.form_code,
      recordId: parseInt(data.record_id),
      rowData: data.row_data,
    });
  }
}
