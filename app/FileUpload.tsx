"use client";

import { ParsedLogMaterials } from "@/src/lib/calculatorTypes.types";
import { parseLog } from "@/src/lib/parseLog";

type FileUploadProps = {
    file: File | null;
    setFile: React.Dispatch<React.SetStateAction<File | null>>;
    parsedData: ParsedLogMaterials | null;
    setParsedData: React.Dispatch<React.SetStateAction<ParsedLogMaterials | null>>;
};

export default function FileUpload(props: FileUploadProps) {
    async function handleFileDrop(e: React.DragEvent<HTMLDivElement>) {
        e.preventDefault();

        const droppedFile = e.dataTransfer.files[0];

        if (!droppedFile) {
            return;
        }

        props.setFile(droppedFile);
        const parsedData = await parseLog(droppedFile);
        props.setParsedData(parsedData);
    }

    async function handleFileSelect(e: React.ChangeEvent<HTMLInputElement>) {
        const selectedFile = e.target.files?.[0];

        if (!selectedFile) {
            return;
        }

        props.setFile(selectedFile);
        const parsedData = await parseLog(selectedFile);
        props.setParsedData(parsedData);
    }

    return (
        <>

            <div className="flex flex-col w-48 h-24 bg-white mb-2"
                onDragOver={(e) => e.preventDefault()}
                onDrop={handleFileDrop}
            >
                <label htmlFor="file-input" className="flex flex-col items-center justify-center text-center w-full h-full min-h-0 max-h-full text-black cursor-pointer overflow-hidden">
                    <div className="mb-3 text-3xl">📂</div>
                    <p className="text-sm"> {props.file ? `Selected file: ${props.file.name}` : "Drag and drop a file here, or click to select a file"}</p>
                </label>
                <input id="file-input" type="file" className="hidden"
                    onChange={handleFileSelect} />

            </div>
        </>
    )
}