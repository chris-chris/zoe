import * as fs from "fs";
import * as path from "path";
import { Visibility } from "./vars";

interface Tolerance {
  val: number;
}

interface Range {
  min: number;
  max: number;
}

enum CheckMode {
  SAFE = "safe",
  UNSAFE = "unsafe",
}

enum Commitments {
  KZG = "kzg",
  // Add other commitment schemes here
}

interface IRunArgs {
  tolerance: Tolerance;
  inputScale: number;
  paramScale: number;
  scaleRebaseMultiplier: number;
  lookupRange: Range;
  logrows: number;
  numInnerCols: number;
  variables: Array<[string, number]>;
  inputVisibility: Visibility;
  outputVisibility: Visibility;
  paramVisibility: Visibility;
  divRebasing: boolean;
  rebaseFracZeroConstants: boolean;
  checkMode: CheckMode;
  commitment?: Commitments | null;
}

export class RunArgs implements IRunArgs {
  tolerance: { val: number };
  inputScale: number;
  paramScale: number;
  scaleRebaseMultiplier: number;
  lookupRange: { min: number; max: number };
  logrows: number;
  numInnerCols: number;
  variables: Array<[string, number]>;
  inputVisibility: Visibility;
  outputVisibility: Visibility;
  paramVisibility: Visibility;
  divRebasing: boolean;
  rebaseFracZeroConstants: boolean;
  checkMode: CheckMode;
  commitment: null;
  constructor() {
    this.tolerance = { val: 0.0 };
    this.inputScale = 7;
    this.paramScale = 7;
    this.scaleRebaseMultiplier = 1;
    this.lookupRange = { min: -32768, max: 32768 };
    this.logrows = 17;
    this.numInnerCols = 2;
    this.variables = [["batch_size", 1]];
    this.inputVisibility = Visibility.Private;
    this.outputVisibility = Visibility.Public;
    this.paramVisibility = Visibility.Private;
    this.divRebasing = false;
    this.rebaseFracZeroConstants = false;
    this.checkMode = CheckMode.UNSAFE;
    this.commitment = null;
  }

  validate(): string | void {
    if (this.paramVisibility === Visibility.Public) {
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
    if (
      this.tolerance.val > 0.0 &&
      this.outputVisibility !== Visibility.Public
    ) {
      return "tolerance > 0.0 requires outputVisibility to be public";
    }
  }

  toJson(): string {
    return JSON.stringify(this);
  }

  static fromJson(argJson: string): RunArgs {
    const parsed = JSON.parse(argJson);
    const runArgs = new RunArgs();
    Object.assign(runArgs, parsed);
    return runArgs;
  }
}

// Example usage of parseKeyValue function
function parseKeyValue<T extends string | number, U extends string | number>(
  s: string
): [T, U] {
  const pos = s.indexOf("->");
  if (pos === -1) {
    throw new Error(`invalid x->y: no '->' found in '${s}'`);
  }
  const key = s.slice(0, pos).trim();
  const value = s.slice(pos + 2).trim();
  return [key as T, value as U];
}
