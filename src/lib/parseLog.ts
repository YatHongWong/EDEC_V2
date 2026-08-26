import { MaterialQuantities, ParsedLogMaterials } from './calculatorTypes.types';

export async function parseLog(log: File): Promise<ParsedLogMaterials | null> {
    if (!log.name.endsWith('.log')) {
        return null;
    }

    try {
        const text = await log.text();
        const lines = text.split(/\r?\n/);

        // Try to find the line containing "materials"
        for (const line of lines) {
            const json = JSON.parse(line);
            if (json.event === "Materials") {
                console.log(json);
                const rawMaterialsArray = json.Raw;
                const manufacturedMaterialsArray = json.Manufactured;
                const encodedMaterialsArray = json.Encoded;

                return {
                    "raw": parseMaterialsArray(rawMaterialsArray),
                    "manufactured": parseMaterialsArray(manufacturedMaterialsArray),
                    "encoded": parseMaterialsArray(encodedMaterialsArray)
                };
            }
        }
    } catch (error) {
        return null;
    }
    
    return null;
}

function parseMaterialsArray(materialsArray: any[]): MaterialQuantities 
{
    let materialQuantities: MaterialQuantities = {};
    for (const entry of materialsArray) {
        const name = entry.Name.replace(/\s/g,'').toLowerCase();
        const quantity = entry.Count;
        materialQuantities[name] = quantity;
    }
    return materialQuantities;
}