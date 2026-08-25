"use client";

import { ParsedData } from "@/src/lib/calculatorTypes.types";
import { parseLog } from "@/src/lib/parseLog";

type FileUploadProps = {
    setFile: React.Dispatch<React.SetStateAction<File | null>>;
    setParsedData: React.Dispatch<React.SetStateAction<ParsedData | null>>;
};

export default function FileUpload(props: FileUploadProps) {
    function handleFileDrop(e: React.DragEvent<HTMLDivElement>) {
        e.preventDefault();

        const droppedFile = e.dataTransfer.files[0];

        if (!droppedFile) {
            return;
        }

        props.setFile(droppedFile);
        const parsedData = parseLog(droppedFile);
        props.setParsedData(parsedData);
    }

    function handleFileSelect(e: React.ChangeEvent<HTMLInputElement>) {
        const selectedFile = e.target.files?.[0];

        if (!selectedFile) {
            return;
        }

        props.setFile(selectedFile);
        const parsedData = parseLog(selectedFile);
        props.setParsedData(parsedData);
    }

    return (
        <div className="flex w-3xs h-3xs bg-white color-black"
            onDragOver={(e) => e.preventDefault()}
            onDrop={handleFileDrop}
        >
            <label htmlFor="file-input" className="flex flex-col items-center justify-center w-full h-full cursor-pointer color-black">
                <p>Drag and drop a file here, or click to select a file</p>
            </label>
            <input id="file-input" type="file" className="w-full h-full opacity-0 cursor-pointer"
                onChange={handleFileSelect} />

        </div>
    )
}