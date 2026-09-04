import { expect, test } from 'vitest';
import { calculateResult } from "../../src/lib/calculateResult";
import { ParsedLogMaterials, MaterialQuantities } from '@/src/lib/calculatorTypes.types';

const emptyRequiredMaterials = {}
const emptyParsedLogMaterials = {}

const oneParsedMaterial: ParsedLogMaterials = {
    "raw": {
        "a": 1
    }
}

const oneRequiredMaterial: MaterialQuantities = {
    "a": 1
}

const invalidParsedLogMaterials: ParsedLogMaterials = {
    invalidKey: {
        "a": 1
    }
}

test('returns empty object when no materials are missing', () => {
    expect(calculateResult(oneParsedMaterial, oneRequiredMaterial)).toEqual({});
})

test('returns empty object when no required materials are provided', () => {
    expect(calculateResult(oneParsedMaterial, emptyRequiredMaterials)).toEqual({});
});

test('returns missing materials when one material is missing', () => {
    expect(calculateResult(emptyParsedLogMaterials, oneRequiredMaterial)).toEqual(oneRequiredMaterial);
})

test('ignores invalid keys in parsed log', () => {
    expect(calculateResult(invalidParsedLogMaterials, oneRequiredMaterial)).toEqual(oneRequiredMaterial);
})

test('returns ceil of missing materials when fractional quantities are involved', () => {
    expect(calculateResult(emptyParsedLogMaterials, { "a": 1.2, "b": 2.5 })).toEqual({ "a": 2, "b": 3 })
})