"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InputTypeUtil = exports.InputType = void 0;
const o1js_1 = require("o1js");
// Custom error class for CircuitError
class CircuitError extends Error {
    constructor(message) {
        super(message);
        this.name = "CircuitError";
    }
    static UnsupportedOp() {
        return new CircuitError("Unsupported operation");
    }
}
// Placeholder function for quantize_tensor
function quantizeTensor(values, scale, visibility // Adjust the type as needed
) {
    // Implement quantization logic here
    return values.map((val) => o1js_1.Scalar.from(val * Math.pow(2, scale)));
}
// Placeholder for RegionCtx and ValTensor
class RegionCtx {
}
class ValTensor {
}
// InputType Enum
var InputType;
(function (InputType) {
    InputType[InputType["Bool"] = 0] = "Bool";
    InputType[InputType["F16"] = 1] = "F16";
    InputType[InputType["F32"] = 2] = "F32";
    InputType[InputType["F64"] = 3] = "F64";
    InputType[InputType["Int"] = 4] = "Int";
    InputType[InputType["TDim"] = 5] = "TDim";
})(InputType || (exports.InputType = InputType = {}));
// Implement InputType methods
class InputTypeUtil {
    static isInteger(type) {
        return [InputType.Int, InputType.TDim, InputType.Bool].includes(type);
    }
    static roundtrip(type, input) {
        switch (type) {
            case InputType.Bool:
                let booleanInput = Number(input);
                if (booleanInput !== 0 && booleanInput !== 1) {
                    throw new Error("Invalid boolean input");
                }
                return booleanInput;
            case InputType.F16:
            case InputType.F32:
                return Number(input);
            case InputType.F64:
                return Number(input);
            case InputType.Int:
            case InputType.TDim:
                return Math.round(Number(input));
            default:
                throw new Error("Unknown input type");
        }
    }
}
exports.InputTypeUtil = InputTypeUtil;
// Input Class
class Input {
    scale;
    datumType;
    constructor(scale, datumType) {
        this.scale = scale;
        this.datumType = datumType;
    }
    outScale(_) {
        return this.scale;
    }
    asString() {
        return "Input";
    }
    layout(config, region, values) {
        const value = values[0];
        // Implement the layout logic
        return value;
    }
    isInput() {
        return true;
    }
    cloneDyn() {
        return new Input(this.scale, this.datumType);
    }
}
// Unknown operation class
class Unknown {
    outScale(_) {
        return 0;
    }
    asString() {
        return "Unknown";
    }
    layout(_, __, ___) {
        throw CircuitError.UnsupportedOp();
    }
    cloneDyn() {
        return new Unknown();
    }
}
// Constant class
class Constant {
    quantizedValues;
    rawValues;
    preAssignedVal;
    constructor(quantizedValues, rawValues) {
        this.quantizedValues = quantizedValues;
        this.rawValues = rawValues;
        this.preAssignedVal = null;
    }
    rebaseScale(newScale) {
        this.quantizedValues = quantizeTensor(this.rawValues, newScale, {});
    }
    emptyRawValue() {
        this.rawValues = [];
    }
    preAssign(val) {
        this.preAssignedVal = val;
    }
    asString() {
        return `CONST (scale=${this.quantizedValues})`;
    }
    layout(config, region, _) {
        const value = this.preAssignedVal || this.quantizedValues;
        // Implement the layout logic
        return value;
    }
    cloneDyn() {
        return new Constant(this.quantizedValues, this.rawValues);
    }
    outScale(_) {
        return 0; // Adjust based on your logic
    }
    isConstant() {
        return true;
    }
}
