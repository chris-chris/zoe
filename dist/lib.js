"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RunArgs = void 0;
const vars_1 = require("./vars");
var CheckMode;
(function (CheckMode) {
    CheckMode["SAFE"] = "safe";
    CheckMode["UNSAFE"] = "unsafe";
})(CheckMode || (CheckMode = {}));
var Commitments;
(function (Commitments) {
    Commitments["KZG"] = "kzg";
    // Add other commitment schemes here
})(Commitments || (Commitments = {}));
class RunArgs {
    tolerance;
    inputScale;
    paramScale;
    scaleRebaseMultiplier;
    lookupRange;
    logrows;
    numInnerCols;
    variables;
    inputVisibility;
    outputVisibility;
    paramVisibility;
    divRebasing;
    rebaseFracZeroConstants;
    checkMode;
    commitment;
    constructor() {
        this.tolerance = { val: 0.0 };
        this.inputScale = 7;
        this.paramScale = 7;
        this.scaleRebaseMultiplier = 1;
        this.lookupRange = { min: -32768, max: 32768 };
        this.logrows = 17;
        this.numInnerCols = 2;
        this.variables = [["batch_size", 1]];
        this.inputVisibility = vars_1.Visibility.Private;
        this.outputVisibility = vars_1.Visibility.Public;
        this.paramVisibility = vars_1.Visibility.Private;
        this.divRebasing = false;
        this.rebaseFracZeroConstants = false;
        this.checkMode = CheckMode.UNSAFE;
        this.commitment = null;
    }
    validate() {
        if (this.paramVisibility === vars_1.Visibility.Public) {
            return "params cannot be public instances, you are probably trying to use `fixed` or `kzgcommit`";
        }
        if (this.scaleRebaseMultiplier < 1) {
            return "scaleRebaseMultiplier must be >= 1";
        }
        if (this.lookupRange.min > this.lookupRange.max) {
            return "lookupRange min is greater than max";
        }
        if (this.logrows < 1) {
            return "logrows must be >= 1";
        }
        if (this.numInnerCols < 1) {
            return "numInnerCols must be >= 1";
        }
        if (this.tolerance.val > 0.0 &&
            this.outputVisibility !== vars_1.Visibility.Public) {
            return "tolerance > 0.0 requires outputVisibility to be public";
        }
    }
    toJson() {
        return JSON.stringify(this);
    }
    static fromJson(argJson) {
        const parsed = JSON.parse(argJson);
        const runArgs = new RunArgs();
        Object.assign(runArgs, parsed);
        return runArgs;
    }
}
exports.RunArgs = RunArgs;
// Example usage of parseKeyValue function
function parseKeyValue(s) {
    const pos = s.indexOf("->");
    if (pos === -1) {
        throw new Error(`invalid x->y: no '->' found in '${s}'`);
    }
    const key = s.slice(0, pos).trim();
    const value = s.slice(pos + 2).trim();
    return [key, value];
}
