"use strict";
// 예외 클래스를 정의합니다.
class TensorError extends Error {
    constructor(message) {
        super(message);
        this.name = "TensorError";
    }
    static SigBitTruncationError() {
        return new TensorError("Significant bit truncation error");
    }
}
/**
 * 주어진 부동 소수점 숫자를 고정 소수점 표현으로 양자화합니다.
 *
 * @param elem 양자화할 부동 소수점 숫자
 * @param shift 고정 소수점 표현에 사용되는 오프셋
 * @param scale 고정 소수점 표현에 사용되는 2의 지수승
 * @returns 양자화된 정수 표현
 * @throws TensorError 비트 손실이 발생하는 경우
 */
function quantizeFloat(elem, shift, scale) {
    const mult = scaleToMultiplier(scale);
    const maxValue = Math.round((Number.MAX_SAFE_INTEGER - shift) / mult);
    if (elem > maxValue) {
        throw TensorError.SigBitTruncationError();
    }
    const scaled = BigInt(Math.round(mult * elem + shift));
    return scaled;
}
/**
 * 주어진 스케일에 대해 2의 지수승 곱을 반환합니다.
 *
 * @param scale 고정 소수점 표현에 사용되는 2의 지수승
 * @returns 2^scale 값을 반환합니다.
 */
function scaleToMultiplier(scale) {
    return Math.pow(2, scale);
}
// 테스트용 예제
try {
    const elem = 0.5;
    const shift = 0.0;
    const scale = 10;
    const quantizedValue = quantizeFloat(elem, shift, scale);
    console.log(`Quantized value: ${quantizedValue}`);
}
catch (e) {
    console.error(e);
}
