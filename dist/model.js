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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const ort = __importStar(require("onnxruntime-node"));
const fs = require("fs");
const onnx = require("onnx-proto"); // onnx-proto를 사용해 ONNX 모델 파싱
var NodeType;
(function (NodeType) {
    NodeType[NodeType["Node"] = 0] = "Node";
    NodeType[NodeType["SubGraph"] = 1] = "SubGraph";
})(NodeType || (NodeType = {}));
class Model {
    constructor(reader, runArgs) {
        const graph = Model.loadOnnxModel(reader, runArgs);
        this.graph = graph;
    }
    static loadOnnxModel(reader, runArgs) {
        return __awaiter(this, void 0, void 0, function* () {
            // TypeScript에서 ONNX 모델을 로드하는 코드 추가
            // onnxruntime-node 라이브러리를 사용
            // Create a new inference session and load model asynchronously from an array bufer.
            const session = yield ort.InferenceSession.create(reader);
            // ONNX 모델을 처리하고 ParsedNodes를 반환하는 로직 구현
        });
    }
    forward(modelInputs, runArgs, regionSettings) {
        // 모델의 Forward pass 수행
        // TypeScript에서 적절히 Tensor 데이터 타입을 사용하여 구현
    }
}
function loadOnnxModel(modelPath) {
    return __awaiter(this, void 0, void 0, function* () {
        const session = yield ort.InferenceSession.create(modelPath);
        console.log("ONNX model loaded:", session);
        return session;
    });
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
    static default() {
        // 기본 InferenceFact를 생성하는 로직을 구현합니다.
        return new InferenceFact();
    }
}
class GraphError extends Error {
    constructor(message) {
        super(message);
        this.name = "GraphError";
    }
}
GraphError.MissingBatchSize = new GraphError("Missing batch size");
function loadOnnxUsingTract(modelPath, runArgs) {
    return __awaiter(this, void 0, void 0, function* () {
        var _a, _b;
        // ONNX 모델을 로드합니다.
        const session = yield ort.InferenceSession.create(modelPath);
        // ONNX 파일을 직접 읽어서 입력 텐서의 형상 정보를 추출합니다.
        const modelBuffer = fs.readFileSync(modelPath);
        const model = onnx.ModelProto.decode(modelBuffer);
        const graph = model.graph;
        const variables = new Map(Object.entries(runArgs.variables));
        for (const input of graph.input) {
            const inputName = input.name;
            const tensorType = (_a = input.type) === null || _a === void 0 ? void 0 : _a.tensorType;
            if (tensorType) {
                let shapeDims = (_b = tensorType.shape) === null || _b === void 0 ? void 0 : _b.dim.map((dim) => {
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
        for (const [symbol, value] of Object.entries(runArgs.variables)) {
            symbolValues = symbolValues.with(symbol, value);
            console.debug(`set ${symbol} to ${value}`);
        }
        // 하드웨어에 따라 레이아웃이 달라지므로 모델을 최적화하지 않습니다.
        const typedModel = session; // 추가적인 변환 및 최적화 로직 구현 필요
        return [typedModel, symbolValues];
    });
}
//# sourceMappingURL=model.js.map