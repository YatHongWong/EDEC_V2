import { MaterialQuantities } from "@/src/lib/calculatorTypes.types";

type ResultDisplayProps = {
    missingMaterials: MaterialQuantities | null;
};

export default function ResultDisplay(props: ResultDisplayProps) {

    if (!props.missingMaterials || Object.keys(props.missingMaterials).length === 0) {

        return <p> All required materials are available.</p>
    }
    return (
        <ul>
            {Object.entries(props.missingMaterials).map(([material, quantity]) => (
                <li key={material}>
                    {material}: {quantity}
                </li>
            ))}
        </ul>

    )


}
