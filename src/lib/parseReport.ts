import { MaterialQuantities } from './calculatorTypes.types';

export function parseReport(report: string): MaterialQuantities | null {
    try {
        console.log("running parseReport");
        const json = JSON.parse(report);
        console.log(json);
        if (json.options)
        {
            // Use this to check valid settings for the report
        }
        if (json.retrofits) {
            if (json.retrofits.length === 0) {
                return null;
            }   


            const materials = Object.fromEntries(
                Object.entries(json.retrofits[0].materials).map(([key, value]) => [key.toLowerCase(), value])
            ) as MaterialQuantities;
            console.log(materials);
            return materials;
            
        }
    } catch (error) {
        return null;
    }
    
    return null;
}