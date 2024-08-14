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
exports.GraphData = exports.DataSource = exports.DataSourceType = exports.CallsToAccount = exports.PostgresSource = exports.OnChainSource = exports.FileSourceInner = exports.FileSourceInnerType = void 0;
const fs = __importStar(require("fs"));
const o1js_1 = require("o1js");
const mod_1 = require("../circuit/ops/mod");
const fieldutils_1 = require("../fieldutils");
var FileSourceInnerType;
(function (FileSourceInnerType) {
    FileSourceInnerType["Float"] = "Float";
    FileSourceInnerType["Bool"] = "Bool";
    FileSourceInnerType["Field"] = "Field";
})(FileSourceInnerType || (exports.FileSourceInnerType = FileSourceInnerType = {}));
class FileSourceInner {
    type;
    value;
    constructor(type, value) {
        this.type = type;
        this.value = value;
    }
    static newFloat(f) {
        return new FileSourceInner(FileSourceInnerType.Float, f);
    }
    static newField(f) {
        return new FileSourceInner(FileSourceInnerType.Field, f);
    }
    static newBool(b) {
        return new FileSourceInner(FileSourceInnerType.Bool, b);
    }
    isFloat() {
        return this.type === FileSourceInnerType.Float;
    }
    isBool() {
        return this.type === FileSourceInnerType.Bool;
    }
    isField() {
        return this.type === FileSourceInnerType.Field;
    }
    asType(inputType) {
        if (this.isFloat()) {
            mod_1.InputTypeUtil.roundtrip(mod_1.InputType.F16, this.value);
        }
        else if (this.isBool()) {
            if (!(inputType instanceof mod_1.InputTypeUtil)) {
                throw new Error("Invalid input type");
            }
        }
    }
    toField(scale) {
        if (this.isFloat()) {
            return (0, fieldutils_1.integerRepToFelt)(quantizeFloat(this.value, 0.0, scale));
        }
        else if (this.isBool()) {
            return this.value ? (0, o1js_1.Field)(1) : (0, o1js_1.Field)(0);
        }
        else if (this.isField()) {
            return this.value;
        }
        throw new Error("Invalid FileSourceInner type");
    }
    toFloat() {
        if (this.isFloat()) {
            return this.value;
        }
        else if (this.isBool()) {
            return this.value ? 1.0 : 0.0;
        }
        else if (this.isField()) {
            return (0, fieldutils_1.feltToIntegerRep)(o1js_1.Scalar.from(this.value));
        }
        throw new Error("Invalid FileSourceInner type");
    }
}
exports.FileSourceInner = FileSourceInner;
class OnChainSource {
    calls;
    rpc;
    constructor(calls, rpc) {
        this.calls = calls;
        this.rpc = rpc;
    }
    static new(calls, rpc) {
        return new OnChainSource(calls, rpc);
    }
}
exports.OnChainSource = OnChainSource;
class PostgresSource {
    host;
    user;
    password;
    query;
    dbname;
    port;
    constructor(host, port, user, query, dbname, password) {
        this.host = host;
        this.user = user;
        this.password = password;
        this.query = query;
        this.dbname = dbname;
        this.port = port;
    }
    static new(host, port, user, query, dbname, password) {
        return new PostgresSource(host, port, user, query, dbname, password);
    }
    async fetch() {
        const config = this.password
            ? `host=${this.host} user=${this.user} dbname=${this.dbname} port=${this.port} password=${this.password}`
            : `host=${this.host} user=${this.user} dbname=${this.dbname} port=${this.port}`;
        // const client = await Client.connect(config);
        const res = [];
        // const rows = await client.query(this.query);
        // rows.forEach((row) => {
        //   row.forEach((field) => {
        //     res.push(field);
        //   });
        // });
        return [res];
    }
    async fetchAndFormatAsFile() {
        const data = await this.fetch();
        return data.map((row) => row.map((item) => FileSourceInner.newFloat(item)));
    }
}
exports.PostgresSource = PostgresSource;
class CallsToAccount {
    callData;
    address;
    constructor(callData, address) {
        this.callData = callData;
        this.address = address;
    }
}
exports.CallsToAccount = CallsToAccount;
var DataSourceType;
(function (DataSourceType) {
    DataSourceType["File"] = "File";
    DataSourceType["OnChain"] = "OnChain";
    DataSourceType["DB"] = "DB";
})(DataSourceType || (exports.DataSourceType = DataSourceType = {}));
class DataSource {
    type;
    source;
    constructor(type, source) {
        this.type = type;
        this.source = source;
    }
    static fromFile(data) {
        return new DataSource(DataSourceType.File, data);
    }
    static fromOnChain(data) {
        return new DataSource(DataSourceType.OnChain, data);
    }
    static fromDB(data) {
        return new DataSource(DataSourceType.DB, data);
    }
}
exports.DataSource = DataSource;
class GraphData {
    inputData;
    outputData;
    constructor(inputData, outputData) {
        this.inputData = inputData;
        this.outputData = outputData;
    }
    static new(inputData) {
        return new GraphData(inputData);
    }
    static fromPath(filePath) {
        const data = fs.readFileSync(filePath, "utf8");
        const parsed = JSON.parse(data);
        return new GraphData(DataSource.fromFile(parsed.input_data), parsed.output_data);
    }
    save(filePath) {
        const data = JSON.stringify(this);
        fs.writeFileSync(filePath, data);
    }
    async splitIntoBatches(inputShapes) {
        const data = this.inputData.source.map((d, i) => {
            const shape = inputShapes[i];
            const batchSize = shape.reduce((a, b) => a * b, 1);
            if (d.length % batchSize !== 0) {
                throw new Error("Calibration data length must be evenly divisible by the original input size");
            }
            const batches = [];
            for (let j = 0; j < d.length; j += batchSize) {
                batches.push(d.slice(j, j + batchSize));
            }
            return batches;
        });
        const batchCount = data[0].length;
        const graphDataBatches = [];
        for (let i = 0; i < batchCount; i++) {
            const batch = data.map((d) => d[i]);
            graphDataBatches.push(new GraphData(DataSource.fromFile(batch)));
        }
        return graphDataBatches;
    }
}
exports.GraphData = GraphData;
