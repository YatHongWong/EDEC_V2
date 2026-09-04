import { MaterialQuantities, ParsedLogMaterials } from './calculatorTypes.types';
import { ParseResult } from './parseTypes.types';

export async function parseLog(log: File): Promise<ParseResult<ParsedLogMaterials | null>> {
    if (!log.name.endsWith('.log')) {
        return { success: false, message: "Invalid file type. Please upload a .log file." };
    }

    try {
        const text = await log.text();
        const lines = text.split(/\r?\n/);

        // Try to find the line containing "materials"
        for (const line of lines) {  
            const json = JSON.parse(line);
            if (json.event === "Materials") {
                const rawMaterialsArray = json.Raw;
                const manufacturedMaterialsArray = json.Manufactured;
                const encodedMaterialsArray = json.Encoded;

                const returnData: ParsedLogMaterials = {
                    raw: parseMaterialsArray(rawMaterialsArray),
                    manufactured: parseMaterialsArray(manufacturedMaterialsArray),
                    encoded: parseMaterialsArray(encodedMaterialsArray)
                };

                if (json.timestamp) {
                    const eventTime = new Date(json.timestamp);
                    if (Date.now() - eventTime.getTime() > 7 * 24 * 60 * 60 * 1000) {
                        return { success: true, data: returnData, message: "This log file is older than 7 days. If it's the latest, please ignore this message." };
                    }
                }
                return {
                    success: true,
                    data: returnData,
                    message: ""
                };
            }
        }
        return { success: false, message: "No 'Materials' event found in the log file." };
    } catch (error) {
        return { success: false, message: "Error parsing log file." };
    }
}

function parseMaterialsArray(materialsArray: any[]): MaterialQuantities {
    let materialQuantities: MaterialQuantities = {};
    for (const entry of materialsArray) {
        const name = entry.Name.replace(/\s/g, '').toLowerCase();
        const quantity = entry.Count;
        materialQuantities[name] = quantity;
    }
    return materialQuantities;
}