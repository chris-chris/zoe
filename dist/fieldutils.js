"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.integerRepToFelt = integerRepToFelt;
exports.feltToF64 = feltToF64;
exports.feltToIntegerRep = feltToIntegerRep;
exports.feltToIntegerRepTest = feltToIntegerRepTest;
const o1js_1 = require("o1js");
// Converts an IntegerRep (i128 equivalent) to a Scalar field element.
function integerRepToFelt(x) {
    if (x >= 0) {
        return o1js_1.Scalar.from(x); // Create Scalar directly from BigInt
    }
    else {
        return o1js_1.Scalar.from(0).sub(o1js_1.Scalar.from(-x));
    }
}
// Converts a Scalar field element to a floating-point number (f64 equivalent).
function feltToF64(x) {
    const maxIntRep = BigInt(Number.MAX_SAFE_INTEGER);
    if (x > o1js_1.Scalar.from(maxIntRep)) {
        const negValue = o1js_1.Scalar.from(0).sub(x).toBigInt();
        return -Number(negValue);
    }
    else {
        return Number(x.toBigInt());
    }
}
// Converts a Scalar field element to an IntegerRep (i128 equivalent).
function feltToIntegerRep(x) {
    const maxIntRep = BigInt(Number.MAX_SAFE_INTEGER);
    if (x > o1js_1.Scalar.from(maxIntRep)) {
        const negValue = o1js_1.Scalar.from(0).sub(x).toBigInt();
        return -negValue;
    }
    else {
        return x.toBigInt();
    }
}
// Example usage and test cases
function testConv() {
    const res1 = integerRepToFelt(BigInt(-15));
    console.assert(res1 == o1js_1.Scalar.from(-15), "Test 1 Failed");
    const res2 = integerRepToFelt(BigInt(Math.pow(2, 17)));
    console.assert(res2 == o1js_1.Scalar.from(BigInt(131072)), "Test 2 Failed");
    const res3 = integerRepToFelt(BigInt(-15));
    console.assert(res3 == o1js_1.Scalar.from(-15), "Test 3 Failed");
    const res4 = integerRepToFelt(BigInt(Math.pow(2, 17)));
    console.assert(res4 == o1js_1.Scalar.from(131072), "Test 4 Failed");
}
function feltToIntegerRepTest() {
    const range = Math.pow(2, 16);
    for (let x = -range; x < range; x++) {
        const fieldX = integerRepToFelt(BigInt(x));
        const xBack = feltToIntegerRep(fieldX);
        console.assert(BigInt(x) === xBack, `Mismatch for x = ${x}: ${xBack}`);
    }
}
// Run the test cases
testConv();
feltToIntegerRepTest();
//# sourceMappingURL=%08fieldutils.js.map