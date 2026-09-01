import { useState, useRef } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";

export default function RetrofitReportHelpButton() {

    const [helpPanelShown, setHelpPanelShown] = useState(false);

    const dialogRef = useRef<HTMLDialogElement>(null);

    const openDialog = () => { dialogRef.current?.showModal() };
    const closeDialog = () => { dialogRef.current?.close() };

    return (
        <div>
            <button className="bg-gray-200 border-2 rounded-sm border-gray-400 px-1 text-md hover:bg-gray-300 " onClick={openDialog}> Click for more info</button>
            <dialog ref={dialogRef} className="bg-black w-3/5 min-w-[60%] max-h-none h-full text-white backdrop:backdrop-blur-md m-auto" onClick={(e) => {
                // Close only if click targeted the dialog backdrop directly
                if (e.target === dialogRef.current) {
                    closeDialog();
                }
            }}>
                <div className="flex flex-col p-2 overflow-y-scroll">
                    <h1 className="text-2xl">How to Obtain the Retrofit Report in JSON Format</h1>
                    <p className="text-md">This guide assumes you have already outfitted your ship on <a href="https://edsy.org/index.html" className="text-blue-500 hover:underline">EDSY</a>.</p>
                    <h3 className="text-lg">1. Select the Analysis Tab</h3>
                    <Image className="w-full" src="/images/select_analysis.png" alt="Select The Analysis Tab" width={600} height={400}></Image>
                    <h3 className="text-lg">2. Copy my settings, then click "Generate retrofit report"</h3>
                    <p className="text-md">Set the following settings:</p>
                    <ul className="list-disc pl-5">
                        <li>Apply blueprints up to Grade 5, 100%</li>
                        <li>Rolls to complete each grade 1 2 3 4 5 (assumes max reputation with the engineers)</li>
                    </ul>
                    <Image className="w-full" src="/images/generate_report.png" alt="Click generate retrofit report after copying settings" width={600} height={400}></Image>
                    <h3 className="text-lg">3. Once the report is generated, click on "Export retrofit report ..." </h3>
                    <Image className="w-full" src="/images/export_report.png" alt="Click export retrofit report" width={600} height={400}></Image>
                    <h3 className="text-lg">4. Copy the report text in JSON format</h3>
                    <Image className="w-full" src="/images/copy_report.png" alt="Copy the report text in JSON format" width={600} height={400}></Image>
                    <h3 className="text-lg">5. Paste the report text into the "EDSY Retrofit Report" field on this website</h3>
                </div>

            </dialog>

        </div>


    )
}
