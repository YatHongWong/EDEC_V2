import { MaterialQuantities } from "@/src/lib/calculatorTypes.types";
import { MATERIAL_INFO, MaterialSymbol, MaterialType } from "@/src/lib/materialInfoMap";

type ResultDisplayProps = {
    missingMaterials: MaterialQuantities | null;
};

export default function ResultDisplay(props: ResultDisplayProps) {



    // Sort materials into categories based on their type 
    const rawMaterialsSet = new Set<MaterialSymbol>();
    const manufacturedMaterialsSet = new Set<MaterialSymbol>();
    const encodedMaterialsSet = new Set<MaterialSymbol>();

    if (props.missingMaterials) {
        Object.entries(props.missingMaterials).map(([material, quantity]) => {
            const materialInfo = MATERIAL_INFO[material.toLowerCase() as MaterialSymbol]
            if (materialInfo.type === "raw") {
                rawMaterialsSet.add(material as MaterialSymbol);
            } else if (materialInfo.type === "manufactured") {
                manufacturedMaterialsSet.add(material as MaterialSymbol);
            } else if (materialInfo.type === "encoded") {
                encodedMaterialsSet.add(material as MaterialSymbol);
            }
        })
    }

    return (

        <div className="flex flex-col border shadow-md border-gray-700 h-full rounded-md p-2">
            {!props.missingMaterials ? <p>N/A</p> : Object.keys(props.missingMaterials).length === 0 ? <p>All required materials are available.</p> :
                <>
                    {rawMaterialsSet.size > 0 ? <div>
                        <label htmlFor="raw-materials" className="text-lg">Raw</label>
                        <hr></hr>
                        <ul id="raw-materials" className="overflow-y-scroll overflow-x-hidden w-full" role="list">
                            {Array.from(rawMaterialsSet).map((material) => (
                                <li key={material}>{`${MATERIAL_INFO[material.toLowerCase() as MaterialSymbol].name} (Grade ${MATERIAL_INFO[material.toLowerCase() as MaterialSymbol].grade})`}: {props.missingMaterials?.[material]}</li>
                            ))}
                        </ul>
                    </div> : null}

                    {manufacturedMaterialsSet.size > 0 ? <div className="flex flex-col w-full">
                        <label htmlFor="manufactured-materials" className="text-lg bg-gray-900 w-full h-auto px-2">Manufactured</label>
                        <ul id="manufactured-materials" className="overflow-y-scroll overflow-x-hidden w-full mx-2" role="list">
                            {Array.from(manufacturedMaterialsSet).map((material) => (
                                <li key={material}>{`${MATERIAL_INFO[material.toLowerCase() as MaterialSymbol].name} (Grade ${MATERIAL_INFO[material.toLowerCase() as MaterialSymbol].grade})`}: {props.missingMaterials?.[material]}</li>
                            ))}
                        </ul>
                    </div> : null}

                    {encodedMaterialsSet.size > 0 ? <div>
                        <label htmlFor="encoded-materials" className="text-lg">Encoded</label>
                        <hr></hr>
                        <ul id="encoded-materials" className="overflow-y-scroll overflow-x-hidden w-full" role="list">
                            {Array.from(encodedMaterialsSet).map((material) => (
                                <li key={material}>{`${MATERIAL_INFO[material.toLowerCase() as MaterialSymbol].name} (Grade ${MATERIAL_INFO[material.toLowerCase() as MaterialSymbol].grade})`}: {props.missingMaterials?.[material]}</li>
                            ))}
                        </ul>
                    </div> : null}


                </>
            }
        </div>
    )
}
