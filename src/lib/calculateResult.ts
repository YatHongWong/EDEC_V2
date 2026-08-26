import {ParsedLogMaterials, MaterialQuantities} from './calculatorTypes.types';

export function calculateResult(ownedMaterials: ParsedLogMaterials, requiredMaterials: MaterialQuantities): MaterialQuantities {
    const missingMaterials: MaterialQuantities = {};
    const flattenedOwnedMaterials = flattenMaterials(ownedMaterials);

    for (const [material, requiredQuantity] of Object.entries(requiredMaterials)) {
        const ownedCount: number = flattenedOwnedMaterials[material] ?? 0;
        if (ownedCount < requiredQuantity) {
            missingMaterials[material] = requiredQuantity - ownedCount;
        }
    }

    return missingMaterials;
}

function flattenMaterials(ownedMaterials: ParsedLogMaterials): MaterialQuantities {
    return {...ownedMaterials.raw, ...ownedMaterials.manufactured, ...ownedMaterials.encoded};
}