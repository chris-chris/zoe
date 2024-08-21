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
const protobuf = __importStar(require("protobufjs"));
const fs = __importStar(require("fs"));
async function loadOnnxModel(modelPath) {
    const root = await protobuf.load("examples/onnx.proto"); // onnx.proto 파일을 직접 다운로드 받아야 할 수도 있음
    const ModelProto = root.lookupType("onnx.ModelProto");
    const modelBuffer = fs.readFileSync(modelPath);
    const model = ModelProto.decode(modelBuffer);
    return model;
}
function findInitializerByName(initializers, name) {
    return initializers.find((init) => init.name === name);
}
function parseRawData(tensor) {
    if (tensor.rawData && tensor.dataType === 1) {
        // dataType 1은 float32를 의미합니다.
        const buffer = tensor.rawData;
        // 버퍼가 4바이트 경계에서 시작되지 않는 경우, 데이터를 복사하여 정렬된 버퍼 생성
        if (buffer.byteOffset % 4 !== 0) {
            console.warn(`Warning: byteOffset (${buffer.byteOffset}) is not a multiple of 4, copying data to ensure alignment.`);
            // 새로운 ArrayBuffer를 생성하고 데이터를 복사
            const alignedBuffer = new ArrayBuffer(buffer.byteLength);
            const view = new Uint8Array(alignedBuffer);
            view.set(new Uint8Array(buffer.buffer, buffer.byteOffset, buffer.byteLength));
            return new Float32Array(alignedBuffer);
        }
        // 4바이트 경계에 있는 경우, 기존 버퍼 사용
        return new Float32Array(buffer.buffer, buffer.byteOffset, buffer.byteLength / 4);
    }
    return null;
}
function inspectOnnxModel(model) {
    const graph = model.graph;
    const initializers = graph.initializer;
    console.log(`모델 이름: ${graph.name}`);
    console.log(`총 레이어 수: ${graph.node.length}`);
    graph.node.forEach((node, index) => {
        console.log(`\n레이어 ${index + 1}:`);
        console.log(`  이름: ${node.name}`);
        console.log(`  타입: ${node.opType}`);
        console.log(`  입력: ${node.input}`);
        console.log(`  출력: ${node.output}`);
        console.log(node.rawData);
        // 각 레이어의 파라미터(가중치, 바이어스 등)를 확인
        node.input.forEach((inputName) => {
            const initializer = findInitializerByName(initializers, inputName);
            // console.log(`    initializer: ${initializer}`);
            if (initializer) {
                const tensorData = parseRawData(initializer);
                // const tensorData = parseRawData(initializer);
                console.log(`  파라미터: ${inputName}`);
                console.log(`    데이터 타입: ${initializer.dataType}`);
                console.log(`    형태: ${initializer.dims}`);
                console.log(initializer);
                if (tensorData) {
                    console.log(`    값: ${tensorData}`);
                }
                else {
                    console.log(`    값을 파싱할 수 없습니다.`);
                }
            }
        });
    });
}
(async () => {
    const modelPath = "examples/models/linear_regression/linear_regression.onnx";
    const model = await loadOnnxModel(modelPath);
    inspectOnnxModel(model);
})();
