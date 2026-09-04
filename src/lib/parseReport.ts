import { MaterialQuantities } from './calculatorTypes.types';
import { ParseResult } from './parseTypes.types';

export function parseReport(report: string): ParseResult<MaterialQuantities | null>{
    try {
        console.log("running parseReport");
        const json = JSON.parse(report);
        console.log(json);
        if (json.options) {
            // Use this to check valid settings for the report
            // If we want to enforce it
        }
        if (json.retrofits) {
            if (json.retrofits.length === 0) {
                return {success: true, data: null, message: "No materials needed for this retrofit."};
            }

            const materials = Object.fromEntries(
                Object.entries(json.retrofits[0].materials).map(([key, value]) => [key.toLowerCase(), value])
            ) as MaterialQuantities;
            return { success: true, data: materials, message: "" };
        }
        return {success: false, message: "Invalid report format. No retrofits found."};
    } catch (error) {
        return { success: false, message: "Error parsing report." };
    }
}