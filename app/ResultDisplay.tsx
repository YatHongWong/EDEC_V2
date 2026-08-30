import { MaterialQuantities } from "@/src/lib/calculatorTypes.types";
import { MATERIAL_NAMES } from "@/src/lib/materialNamesMap";

type ResultDisplayProps = {
    missingMaterials: MaterialQuantities | null;
};

export default function ResultDisplay(props: ResultDisplayProps) {



    return (

        <div className="flex flex-row border shadow-md border-gray-700 h-full p-2 rounded-md">
            {!props.missingMaterials ? <p>N/A</p> : Object.keys(props.missingMaterials).length === 0 ? <p>All required materials are available.</p> :

                <ul className="overflow-y-scroll overflow-x-hidden h-full w-full divide-y divide-gray-700" role="list">
                    {Object.entries(props.missingMaterials).map(([material, quantity]) => (
                        <li className="py-1" key={material}>
                            {MATERIAL_NAMES[material] || material}: {quantity}
                        </li>
                    ))}
                </ul>
            }
        </div>
    )
}
