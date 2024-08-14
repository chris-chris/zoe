import * as ort from "onnxruntime-node";
import { VarVisibility, Visibility } from "./vars";
import { RegionSettings } from "./region";
import { RunArgs } from "./lib";

const fs = require("fs");
const onnx = require("onnx-proto"); // onnx-proto를 사용해 ONNX 모델 파싱

interface ParsedNodes {
  nodes: Map<number, NodeType>;
  inputs: number[];
  outputs: Array<[number, number]>;
}

enum NodeType {
  Node,
  SubGraph,
}

interface ModelConfig {
  // TypeScript에서는 구체적인 필드 타입과 정의를 추가해야 합니다.
}

interface ForwardResult {
  outputs: ort.Tensor[];
  maxLookupInputs: number;
  minLookupInputs: number;
  maxRangeSize: number;
}

interface GraphError extends Error {
  // 필요한 필드 추가
}

async function loadOnnxModel(modelPath: string): Promise<ort.InferenceSession> {
  const session = await ort.InferenceSession.create(modelPath);
  console.log("ONNX model loaded:", session);
  return session;
}

interface GraphError extends Error {
  // GraphError에 필요한 필드와 메서드를 정의합니다.
}

interface GraphError extends Error {
  // GraphError에 필요한 필드와 메서드를 정의합니다.
}

type TractResult = [any, SymbolValues]; // Placeholder, 실제 타입 정의가 필요합니다.

class SymbolValues {
  static default(): SymbolValues {
    return new SymbolValues();
  }

  with(symbol: string, value: number): SymbolValues {
    // 심볼 값에 대한 로직을 구현합니다.
    return this;
  }
}

class InferenceFact {
  shape!: { dims: () => any[]; setDim: (index: number, value: any) => void };

  static default(): InferenceFact {
    // 기본 InferenceFact를 생성하는 로직을 구현합니다.
    return new InferenceFact();
  }
}

class GraphError extends Error {
  static MissingBatchSize: GraphError = new GraphError("Missing batch size");

  constructor(message: string) {
    super(message);
    this.name = "GraphError";
  }
}

interface GraphError extends Error {
  // 필요한 필드와 메서드를 정의합니다.
}

interface GraphSettings {
  runArgs: RunArgs;
  modelInstanceShapes: any[]; // 필요한 타입으로 변경
  moduleSizes: any; // 필요한 타입으로 변경
  numRows: number;
  totalAssignments: number;
  requiredLookups: Set<any>; // 필요한 타입으로 변경
  requiredRangeChecks: Set<any>; // 필요한 타입으로 변경
  modelOutputScales: any[]; // 필요한 타입으로 변경
  modelInputScales: any[]; // 필요한 타입으로 변경
  numDynamicLookups: number;
  totalDynamicColSize: number;
  numShuffles: number;
  totalShuffleColSize: number;
  totalConstSize: number;
  checkMode: any; // 필요한 타입으로 변경
  version: string;
  numBlindingFactors: number | null;
  timestamp: number | null;
}

async function loadOnnxUsingTract(
  modelPath: string,
  runArgs: RunArgs
): Promise<TractResult> {
  // ONNX 모델을 로드합니다.
  const session = await ort.InferenceSession.create(modelPath);

  // ONNX 파일을 직접 읽어서 입력 텐서의 형상 정보를 추출합니다.
  const modelBuffer = fs.readFileSync(modelPath);
  const model = onnx.ModelProto.decode(modelBuffer);

  const graph = model.graph;
  // runArgs.variables는 Array<[string, number]> 형식이어야 합니다
  const variables: Map<string, number> = new Map(runArgs.variables);

  for (const input of graph.input) {
    const inputName = input.name;
    const tensorType = input.type?.tensorType;

    if (tensorType) {
      let shapeDims = tensorType.shape?.dim.map(
        (dim: { dimValue: undefined; dimParam: undefined }) => {
          if (dim.dimValue !== undefined) {
            return dim.dimValue;
          } else if (dim.dimParam !== undefined) {
            const batchSize = variables.get("batch_size");
            if (!batchSize) {
              throw GraphError.MissingBatchSize;
            }
            return batchSize;
          } else {
            throw new Error("Unexpected dimension format");
          }
        }
      );

      console.log(`Input name: ${inputName}, Shape: ${shapeDims}`);
    }
  }

  // 출력 정보를 설정 (필요한 경우 추가 로직 구현)
  let symbolValues = SymbolValues.default();
  for (const [symbol, value] of runArgs.variables) {
    // Object.entries를 직접 사용할 필요 없음
    symbolValues = symbolValues.with(symbol, value);
    console.debug(`set ${symbol} to ${value}`);
  }

  // 하드웨어에 따라 레이아웃이 달라지므로 모델을 최적화하지 않습니다.
  const typedModel = session; // 추가적인 변환 및 최적화 로직 구현 필요

  return [typedModel, symbolValues];
}

// ForwardResult 클래스 정의
class ForwardResult {
  outputs: ort.Tensor[];
  maxLookupInputs: number;
  minLookupInputs: number;
  maxRangeSize: number;

  constructor(res: any) {
    this.outputs = res.outputs;
    this.maxLookupInputs = res.maxLookupInputs;
    this.minLookupInputs = res.minLookupInputs;
    this.maxRangeSize = res.maxRangeSize;
  }
}

class Model {
  graph: any; // ParsedNodes 등의 타입으로 변경 필요
  visibility: any; // VarVisibility 등의 타입으로 변경 필요

  constructor(graph: any, visibility: any) {
    this.graph = graph;
    this.visibility = visibility;
  }

  static async create(reader: Buffer, runArgs: RunArgs): Promise<Model> {
    const visibility = VarVisibility.fromArgs(runArgs); // 구현 필요

    const graph = await Model.loadOnnxModel(reader, runArgs, visibility);
    const model = new Model(graph, visibility);

    // console.debug(`\n ${model.tableNodes()}`);  // 구현 필요

    return model;
  }

  save(filePath: string): void {
    const writer = fs.createWriteStream(filePath);
    writer.write(JSON.stringify(this)); // `bincode::serialize_into` 대신 JSON 사용
    writer.end();
  }

  static load(filePath: string): Model {
    const data = fs.readFileSync(filePath);
    const model = JSON.parse(data.toString()); // `bincode::deserialize` 대신 JSON 사용
    return new Model(model.graph, model.visibility);
  }

  async genParams(runArgs: RunArgs, checkMode: any): Promise<GraphSettings> {
    const instanceShapes = this.instanceShapes();

    console.debug(`Model has ${instanceShapes.length} instances`);

    const inputs: ort.Tensor[] = await Promise.all(
      this.graph.inputShapes().map(async (shape: any) => {
        const len = shape.reduce((a: number, b: number) => a * b, 1);
        const tensorData = new Array(len).fill(0).map(() => {
          if (!this.visibility.input.isFixed()) {
            return Math.random(); // Value.unknown() 대신
          } else {
            return Math.random(); // Fp.random() 대신
          }
        });
        return new ort.Tensor("float32", tensorData, shape);
      })
    );

    const res = await this.dummyLayout(
      runArgs,
      inputs,
      RegionSettings.allFalse()
    );

    return {
      runArgs: runArgs,
      modelInstanceShapes: instanceShapes,
      moduleSizes: {}, // 기본값 사용
      numRows: res.numRows,
      totalAssignments: res.linearCoord,
      requiredLookups: new Set(res.lookupOps),
      requiredRangeChecks: new Set(res.rangeChecks),
      modelOutputScales: this.graph.getOutputScales(),
      modelInputScales: this.graph.getInputScales(),
      numDynamicLookups: res.numDynamicLookups,
      totalDynamicColSize: res.dynamicLookupColCoord,
      numShuffles: res.numShuffles,
      totalShuffleColSize: res.shuffleColCoord,
      totalConstSize: res.totalConstSize,
      checkMode: checkMode,
      version: "1.0.0", // CARGO_PKG_VERSION 대체
      numBlindingFactors: null,
      timestamp: Date.now(),
    };
  }

  async forward(
    modelInputs: ort.Tensor[],
    runArgs: RunArgs,
    regionSettings: any
  ): Promise<ForwardResult> {
    const valtensorInputs = modelInputs.map(
      (input) => new ort.Tensor("float32", input.data, input.dims)
    );
    const res = await this.dummyLayout(
      runArgs,
      valtensorInputs,
      regionSettings
    );
    return new ForwardResult(res);
  }

  private async dummyLayout(
    runArgs: RunArgs,
    inputs: ort.Tensor[],
    regionSettings: any
  ): Promise<any> {
    // dummy layout 구현 필요
    return {};
  }

  private instanceShapes(): any[] {
    // instanceShapes 구현 필요
    return [];
  }

  private static async loadOnnxModel(
    reader: Buffer,
    runArgs: RunArgs,
    visibility: any
  ): Promise<any> {
    // loadOnnxModel 구현 필요
    return {};
  }
}
