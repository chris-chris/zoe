"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const ort = __importStar(require("onnxruntime-node"));
const vars_1 = require("./vars");
const region_1 = require("./region");
const fs = require("fs");
const onnx = require("onnx-proto"); // onnx-proto를 사용해 ONNX 모델 파싱
var NodeType;
(function (NodeType) {
    NodeType[NodeType["Node"] = 0] = "Node";
    NodeType[NodeType["SubGraph"] = 1] = "SubGraph";
})(NodeType || (NodeType = {}));
async function loadOnnxModel(modelPath) {
    const session = await ort.InferenceSession.create(modelPath);
    console.log("ONNX model loaded:", session);
    return session;
}
class SymbolValues {
    static default() {
        return new SymbolValues();
    }
    with(symbol, value) {
        // 심볼 값에 대한 로직을 구현합니다.
        return this;
    }
}
class InferenceFact {
    shape;
    static default() {
        // 기본 InferenceFact를 생성하는 로직을 구현합니다.
        return new InferenceFact();
    }
}
class GraphError extends Error {
    static MissingBatchSize = new GraphError("Missing batch size");
    constructor(message) {
        super(message);
        this.name = "GraphError";
    }
}
async function loadOnnxUsingTract(modelPath, runArgs) {
    // ONNX 모델을 로드합니다.
    const session = await ort.InferenceSession.create(modelPath);
    // ONNX 파일을 직접 읽어서 입력 텐서의 형상 정보를 추출합니다.
    const modelBuffer = fs.readFileSync(modelPath);
    const model = onnx.ModelProto.decode(modelBuffer);
    const graph = model.graph;
    // runArgs.variables는 Array<[string, number]> 형식이어야 합니다
    const variables = new Map(runArgs.variables);
    for (const input of graph.input) {
        const inputName = input.name;
        const tensorType = input.type?.tensorType;
        if (tensorType) {
            let shapeDims = tensorType.shape?.dim.map((dim) => {
                if (dim.dimValue !== undefined) {
                    return dim.dimValue;
                }
                else if (dim.dimParam !== undefined) {
                    const batchSize = variables.get("batch_size");
                    if (!batchSize) {
                        throw GraphError.MissingBatchSize;
                    }
                    return batchSize;
                }
                else {
                    throw new Error("Unexpected dimension format");
                }
            });
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
    outputs;
    maxLookupInputs;
    minLookupInputs;
    maxRangeSize;
    constructor(res) {
        this.outputs = res.outputs;
        this.maxLookupInputs = res.maxLookupInputs;
        this.minLookupInputs = res.minLookupInputs;
        this.maxRangeSize = res.maxRangeSize;
    }
}
class Model {
    graph; // ParsedNodes 등의 타입으로 변경 필요
    visibility; // VarVisibility 등의 타입으로 변경 필요
    constructor(graph, visibility) {
        this.graph = graph;
        this.visibility = visibility;
    }
    static async create(reader, runArgs) {
        const visibility = vars_1.VarVisibility.fromArgs(runArgs); // 구현 필요
        const graph = await Model.loadOnnxModel(reader, runArgs, visibility);
        const model = new Model(graph, visibility);
        // console.debug(`\n ${model.tableNodes()}`);  // 구현 필요
        return model;
    }
    save(filePath) {
        const writer = fs.createWriteStream(filePath);
        writer.write(JSON.stringify(this)); // `bincode::serialize_into` 대신 JSON 사용
        writer.end();
    }
    static load(filePath) {
        const data = fs.readFileSync(filePath);
        const model = JSON.parse(data.toString()); // `bincode::deserialize` 대신 JSON 사용
        return new Model(model.graph, model.visibility);
    }
    async genParams(runArgs, checkMode) {
        const instanceShapes = this.instanceShapes();
        console.debug(`Model has ${instanceShapes.length} instances`);
        const inputs = await Promise.all(this.graph.inputShapes().map(async (shape) => {
            const len = shape.reduce((a, b) => a * b, 1);
            const tensorData = new Array(len).fill(0).map(() => {
                if (!this.visibility.input.isFixed()) {
                    return Math.random(); // Value.unknown() 대신
                }
                else {
                    return Math.random(); // Fp.random() 대신
                }
            });
            return new ort.Tensor("float32", tensorData, shape);
        }));
        const res = await this.dummyLayout(runArgs, inputs, region_1.RegionSettings.allFalse());
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
    async forward(modelInputs, runArgs, regionSettings) {
        const valtensorInputs = modelInputs.map((input) => new ort.Tensor("float32", input.data, input.dims));
        const res = await this.dummyLayout(runArgs, valtensorInputs, regionSettings);
        return new ForwardResult(res);
    }
    async dummyLayout(runArgs, inputs, regionSettings) {
        // dummy layout 구현 필요
        return {};
    }
    instanceShapes() {
        // instanceShapes 구현 필요
        return [];
    }
    static async loadOnnxModel(reader, runArgs, visibility) {
        // loadOnnxModel 구현 필요
        return {};
    }
}
