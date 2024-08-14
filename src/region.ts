export class RegionSettings {
  witnessGen: boolean;
  checkRange: boolean;

  constructor(witnessGen: boolean, checkRange: boolean) {
    this.witnessGen = witnessGen;
    this.checkRange = checkRange;
  }

  static allTrue(): RegionSettings {
    return new RegionSettings(true, true);
  }

  static allFalse(): RegionSettings {
    return new RegionSettings(false, false);
  }
}
