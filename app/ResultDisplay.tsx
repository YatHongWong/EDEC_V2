import { MaterialQuantities } from "@/src/lib/calculatorTypes.types";
import { MATERIAL_NAMES } from "@/src/lib/materialNamesMap";

type ResultDisplayProps = {
    missingMaterials: MaterialQuantities | null;
};

export default function ResultDisplay(props: ResultDisplayProps) {

    if (!props.missingMaterials || Object.keys(props.missingMaterials).length === 0) {

        return <p> All required materials are available.</p>
    }
    return (
        <ul className="overflow-y-scroll overflow-x-hidden h-full v-full">
            {Object.entries(props.missingMaterials).map(([material, quantity]) => (
                <li key={material}>
                    {MATERIAL_NAMES[material] || material}: {quantity}
                </li>
            ))}
        </ul>

    )


}
