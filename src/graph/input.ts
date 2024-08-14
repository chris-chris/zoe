import * as fs from "fs";
import { Field, Scalar } from "o1js";
import { InputType, InputTypeUtil } from "../circuit/ops/mod";
import { feltToIntegerRep, integerRepToFelt } from "../fieldutils";

type Decimals = number;
type Call = string;
type RPCUrl = string;

export enum FileSourceInnerType {
  Float = "Float",
  Bool = "Bool",
  Field = "Field",
}

export class FileSourceInner {
  type: FileSourceInnerType;
  value: number | boolean | Field;

  constructor(type: FileSourceInnerType, value: number | boolean | Field) {
    this.type = type;
    this.value = value;
  }

  static newFloat(f: number): FileSourceInner {
    return new FileSourceInner(FileSourceInnerType.Float, f);
  }

  static newField(f: Field): FileSourceInner {
    return new FileSourceInner(FileSourceInnerType.Field, f);
  }

  static newBool(b: boolean): FileSourceInner {
    return new FileSourceInner(FileSourceInnerType.Bool, b);
  }

  isFloat(): boolean {
    return this.type === FileSourceInnerType.Float;
  }

  isBool(): boolean {
    return this.type === FileSourceInnerType.Bool;
  }

  isField(): boolean {
    return this.type === FileSourceInnerType.Field;
  }

  asType(inputType: InputTypeUtil) {
    if (this.isFloat()) {
      InputTypeUtil.roundtrip(InputType.F16, this.value as number);
    } else if (this.isBool()) {
      if (!(inputType instanceof InputTypeUtil)) {
        throw new Error("Invalid input type");
      }
    }
  }

  toField(scale: number): Field {
    if (this.isFloat()) {
      return integerRepToFelt(
        quantizeFloat(this.value as number, 0.0, scale)
      ) as unknown as Field;
    } else if (this.isBool()) {
      return this.value ? Field(1) : Field(0);
    } else if (this.isField()) {
      return this.value as Field;
    }
    throw new Error("Invalid FileSourceInner type");
  }

  toFloat(): number {
    if (this.isFloat()) {
      return this.value as number;
    } else if (this.isBool()) {
      return this.value ? 1.0 : 0.0;
    } else if (this.isField()) {
      return feltToIntegerRep(
        Scalar.from(this.value as number)
      ) as unknown as number;
    }
    throw new Error("Invalid FileSourceInner type");
  }
}

export type FileSource = FileSourceInner[][];

export class OnChainSource {
  calls: CallsToAccount[];
  rpc: RPCUrl;

  constructor(calls: CallsToAccount[], rpc: RPCUrl) {
    this.calls = calls;
    this.rpc = rpc;
  }

  static new(calls: CallsToAccount[], rpc: RPCUrl): OnChainSource {
    return new OnChainSource(calls, rpc);
  }
}

export class PostgresSource {
  host: RPCUrl;
  user: string;
  password: string;
  query: string;
  dbname: string;
  port: string;

  constructor(
    host: RPCUrl,
    port: string,
    user: string,
    query: string,
    dbname: string,
    password: string
  ) {
    this.host = host;
    this.user = user;
    this.password = password;
    this.query = query;
    this.dbname = dbname;
    this.port = port;
  }

  static new(
    host: RPCUrl,
    port: string,
    user: string,
    query: string,
    dbname: string,
    password: string
  ): PostgresSource {
    return new PostgresSource(host, port, user, query, dbname, password);
  }

  async fetch(): Promise<number[][]> {
    const config = this.password
      ? `host=${this.host} user=${this.user} dbname=${this.dbname} port=${this.port} password=${this.password}`
      : `host=${this.host} user=${this.user} dbname=${this.dbname} port=${this.port}`;

    // const client = await Client.connect(config);
    const res: number[] = [];
    // const rows = await client.query(this.query);
    // rows.forEach((row) => {
    //   row.forEach((field) => {
    //     res.push(field);
    //   });
    // });
    return [res];
  }

  async fetchAndFormatAsFile(): Promise<FileSource> {
    const data = await this.fetch();
    return data.map((row) => row.map((item) => FileSourceInner.newFloat(item)));
  }
}

export class CallsToAccount {
  callData: Array<[Call, Decimals]>;
  address: string;

  constructor(callData: Array<[Call, Decimals]>, address: string) {
    this.callData = callData;
    this.address = address;
  }
}

export enum DataSourceType {
  File = "File",
  OnChain = "OnChain",
  DB = "DB",
}

export class DataSource {
  type: DataSourceType;
  source: FileSource | OnChainSource | PostgresSource;

  constructor(
    type: DataSourceType,
    source: FileSource | OnChainSource | PostgresSource
  ) {
    this.type = type;
    this.source = source;
  }

  static fromFile(data: FileSource): DataSource {
    return new DataSource(DataSourceType.File, data);
  }

  static fromOnChain(data: OnChainSource): DataSource {
    return new DataSource(DataSourceType.OnChain, data);
  }

  static fromDB(data: PostgresSource): DataSource {
    return new DataSource(DataSourceType.DB, data);
  }
}

export class GraphData {
  inputData: DataSource;
  outputData?: DataSource;

  constructor(inputData: DataSource, outputData?: DataSource) {
    this.inputData = inputData;
    this.outputData = outputData;
  }

  static new(inputData: DataSource): GraphData {
    return new GraphData(inputData);
  }

  static fromPath(filePath: string): GraphData {
    const data = fs.readFileSync(filePath, "utf8");
    const parsed = JSON.parse(data);
    return new GraphData(
      DataSource.fromFile(parsed.input_data),
      parsed.output_data
    );
  }

  save(filePath: string): void {
    const data = JSON.stringify(this);
    fs.writeFileSync(filePath, data);
  }

  async splitIntoBatches(inputShapes: number[][]): Promise<GraphData[]> {
    const data = (this.inputData.source as FileSource).map((d, i) => {
      const shape = inputShapes[i];
      const batchSize = shape.reduce((a, b) => a * b, 1);
      if (d.length % batchSize !== 0) {
        throw new Error(
          "Calibration data length must be evenly divisible by the original input size"
        );
      }
      const batches = [];
      for (let j = 0; j < d.length; j += batchSize) {
        batches.push(d.slice(j, j + batchSize));
      }
      return batches;
    });

    const batchCount = data[0].length;
    const graphDataBatches: GraphData[] = [];

    for (let i = 0; i < batchCount; i++) {
      const batch = data.map((d) => d[i]);
      graphDataBatches.push(new GraphData(DataSource.fromFile(batch)));
    }

    return graphDataBatches;
  }
}
