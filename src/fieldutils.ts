import { Field, Scalar } from "o1js";

type IntegerRep = bigint;

// Converts an IntegerRep (i128 equivalent) to a Scalar field element.
export function integerRepToFelt(x: IntegerRep): Scalar {
  if (x >= 0) {
    return Scalar.from(x); // Create Scalar directly from BigInt
  } else {
    return Scalar.from(0).sub(Scalar.from(-x));
  }
}

// Converts a Scalar field element to a floating-point number (f64 equivalent).
export function feltToF64(x: Scalar): number {
  const maxIntRep = BigInt(Number.MAX_SAFE_INTEGER);
  if (x > Scalar.from(maxIntRep)) {
    const negValue = Scalar.from(0).sub(x).toBigInt();
    return -Number(negValue);
  } else {
    return Number(x.toBigInt());
  }
}

// Converts a Scalar field element to an IntegerRep (i128 equivalent).
export function feltToIntegerRep(x: Scalar): IntegerRep {
  const maxIntRep = BigInt(Number.MAX_SAFE_INTEGER);
  if (x > Scalar.from(maxIntRep)) {
    const negValue = Scalar.from(0).sub(x).toBigInt();
    return -negValue;
  } else {
    return x.toBigInt();
  }
}

// Example usage and test cases
function testConv() {
  const res1 = integerRepToFelt(BigInt(-15));
  console.assert(res1 == Scalar.from(-15), "Test 1 Failed");

  const res2 = integerRepToFelt(BigInt(2 ** 17));
  console.assert(res2 == Scalar.from(BigInt(131072)), "Test 2 Failed");

  const res3 = integerRepToFelt(BigInt(-15));
  console.assert(res3 == Scalar.from(-15), "Test 3 Failed");

  const res4 = integerRepToFelt(BigInt(2 ** 17));
  console.assert(res4 == Scalar.from(131072), "Test 4 Failed");
}

export function feltToIntegerRepTest() {
  const range = 2 ** 16;
  for (let x = -range; x < range; x++) {
    const fieldX = integerRepToFelt(BigInt(x));
    const xBack = feltToIntegerRep(fieldX);
    console.assert(BigInt(x) === xBack, `Mismatch for x = ${x}: ${xBack}`);
  }
}

// Run the test cases
testConv();
feltToIntegerRepTest();
