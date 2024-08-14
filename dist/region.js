"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RegionSettings = void 0;
class RegionSettings {
    witnessGen;
    checkRange;
    constructor(witnessGen, checkRange) {
        this.witnessGen = witnessGen;
        this.checkRange = checkRange;
    }
    static allTrue() {
        return new RegionSettings(true, true);
    }
    static allFalse() {
        return new RegionSettings(false, false);
    }
}
exports.RegionSettings = RegionSettings;
