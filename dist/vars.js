"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Visibility = exports.VarVisibility = void 0;
class VarVisibility {
    input;
    params;
    output;
    constructor(input, params, output) {
        this.input = input;
        this.params = params;
        this.output = output;
    }
    static default() {
        return new VarVisibility(Visibility.Private, Visibility.Private, Visibility.Public);
    }
    static fromArgs(args) {
        const inputVis = args.inputVisibility;
        const paramsVis = args.paramVisibility;
        const outputVis = args.outputVisibility;
        if (paramsVis.isPublic()) {
            throw new GraphError("ParamsPublicVisibility");
        }
        if (!outputVis.isPublic() &&
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
            !inputVis.isPolycommit()) {
            throw new GraphError("Visibility");
        }
        return new VarVisibility(inputVis, paramsVis, outputVis);
    }
    toString() {
        return `(inputs: ${this.input}, params: ${this.params}, outputs: ${this.output})`;
    }
}
exports.VarVisibility = VarVisibility;
// Visibility Enum (assuming it's an enum or class in Rust)
class Visibility {
    static Public = new Visibility("Public");
    static Private = new Visibility("Private");
    static Fixed = new Visibility("Fixed");
    static Hashed = new Visibility("Hashed");
    static Polycommit = new Visibility("Polycommit");
    value;
    constructor(value) {
        this.value = value;
    }
    isPublic() {
        return this === Visibility.Public;
    }
    isFixed() {
        return this === Visibility.Fixed;
    }
    isHashed() {
        return this === Visibility.Hashed;
    }
    isPolycommit() {
        return this === Visibility.Polycommit;
    }
    toString() {
        return this.value;
    }
}
exports.Visibility = Visibility;
// GraphError class (based on the usage in the Rust code)
class GraphError extends Error {
    constructor(message) {
        super(message);
        this.name = "GraphError";
    }
    static ParamsPublicVisibility = new GraphError("ParamsPublicVisibility");
    static Visibility = new GraphError("Visibility");
}
