export class GraphError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "GraphError";
  }

  static InvalidLookupInputs() {
    return new GraphError("Invalid inputs for a lookup node");
  }

  static InvalidDims(nodeIndex: number, description: string) {
    return new GraphError(
      `Invalid dimensions used for node ${nodeIndex} (${description})`
    );
  }

  static WrongMethod(nodeIndex: number, description: string) {
    return new GraphError(
      `Wrong method was called to configure node ${nodeIndex} (${description})`
    );
  }

  static MissingNode(nodeIndex: number) {
    return new GraphError(
      `A requested node is missing in the graph: ${nodeIndex}`
    );
  }

  static OpMismatch(nodeIndex: number, description: string) {
    return new GraphError(
      `An unsupported method was called on node ${nodeIndex} (${description})`
    );
  }

  static UnsupportedDataType(nodeIndex: number, description: string) {
    return new GraphError(
      `Unsupported datatype in graph node ${nodeIndex} (${description})`
    );
  }

  static MissingParams(description: string) {
    return new GraphError(`A node is missing required params: ${description}`);
  }

  static MisformedParams(description: string) {
    return new GraphError(`A node has misformed params: ${description}`);
  }

  static Visibility() {
    return new GraphError(
      "There should be at least one set of public variables"
    );
  }

  static NonConstantDiv() {
    return new GraphError("ezkl currently only supports division by constants");
  }

  static NonConstantPower() {
    return new GraphError("ezkl currently only supports constant exponents");
  }

  static RescalingError(description: string) {
    return new GraphError(`Failed to rescale inputs for ${description}`);
  }

  static ReadWriteFileError(operation: string, path: string) {
    return new GraphError(`[io] (${operation}) ${path}`);
  }

  static ModelSerialize(description: string) {
    return new GraphError(`Failed to ser/deser model: ${description}`);
  }

  static PackingExponent() {
    return new GraphError(
      "Largest packing exponent exceeds max. Try reducing the scale"
    );
  }

  static InvalidInputTypes() {
    return new GraphError("Invalid input types");
  }

  static MissingResults() {
    return new GraphError("Missing results");
  }

  static TensorError(description: string) {
    return new GraphError(`[tensor] ${description}`);
  }

  static ParamsPublicVisibility() {
    return new GraphError(
      "Public visibility for params is deprecated, please use `fixed` instead"
    );
  }

  static SliceLengthMismatch(description: string) {
    return new GraphError(`Slice length mismatch: ${description}`);
  }

  static InvalidConversion(description: string) {
    return new GraphError(`Invalid conversion: ${description}`);
  }

  static CircuitError(description: string) {
    return new GraphError(`[circuit] ${description}`);
  }

  static Halo2Error(description: string) {
    return new GraphError(`[halo2] ${description}`);
  }

  static SystemTimeError(description: string) {
    return new GraphError(`[system time] ${description}`);
  }

  static MissingBatchSize() {
    return new GraphError(
      "Unknown dimension batch_size in model inputs, set batch_size in variables"
    );
  }

  static OnChainDataSource() {
    return new GraphError(
      "Cannot use on-chain data source as 1) output for on-chain test 2) as private data 3) as input when using wasm."
    );
  }

  static MissingDataSource() {
    return new GraphError("Missing data source");
  }

  static InvalidRunArgs(description: string) {
    return new GraphError(`Invalid RunArgs: ${description}`);
  }
}
