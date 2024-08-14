export class VarVisibility {
  input: Visibility;
  params: Visibility;
  output: Visibility;

  constructor(input: Visibility, params: Visibility, output: Visibility) {
    this.input = input;
    this.params = params;
    this.output = output;
  }

  static default(): VarVisibility {
    return new VarVisibility(
      Visibility.Private,
      Visibility.Private,
      Visibility.Public
    );
  }

  static fromArgs(args: RunArgs): VarVisibility {
    const inputVis = args.inputVisibility;
    const paramsVis = args.paramVisibility;
    const outputVis = args.outputVisibility;

    if (paramsVis.isPublic()) {
      throw new GraphError("ParamsPublicVisibility");
    }

    if (
      !outputVis.isPublic() &&
      !paramsVis.isPublic() &&
      !inputVis.isPublic() &&
      !outputVis.isFixed() &&
      !paramsVis.isFixed() &&
      !inputVis.isFixed() &&
      !outputVis.isHashed() &&
      !paramsVis.isHashed() &&
      !inputVis.isHashed() &&
      !outputVis.isPolycommit() &&
      !paramsVis.isPolycommit() &&
      !inputVis.isPolycommit()
    ) {
      throw new GraphError("Visibility");
    }

    return new VarVisibility(inputVis, paramsVis, outputVis);
  }

  toString(): string {
    return `(inputs: ${this.input}, params: ${this.params}, outputs: ${this.output})`;
  }
}

// Visibility Enum (assuming it's an enum or class in Rust)
export class Visibility {
  static Public = new Visibility("Public");
  static Private = new Visibility("Private");
  static Fixed = new Visibility("Fixed");
  static Hashed = new Visibility("Hashed");
  static Polycommit = new Visibility("Polycommit");

  private value: string;

  private constructor(value: string) {
    this.value = value;
  }

  isPublic(): boolean {
    return this === Visibility.Public;
  }

  isFixed(): boolean {
    return this === Visibility.Fixed;
  }

  isHashed(): boolean {
    return this === Visibility.Hashed;
  }

  isPolycommit(): boolean {
    return this === Visibility.Polycommit;
  }

  toString(): string {
    return this.value;
  }
}

// RunArgs interface (based on the usage in the Rust code)
interface RunArgs {
  inputVisibility: Visibility;
  paramVisibility: Visibility;
  outputVisibility: Visibility;
}

// GraphError class (based on the usage in the Rust code)
class GraphError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "GraphError";
  }

  static ParamsPublicVisibility = new GraphError("ParamsPublicVisibility");
  static Visibility = new GraphError("Visibility");
}
