"use client";

import { ParsedLogMaterials } from "@/src/lib/calculatorTypes.types";
import { parseLog } from "@/src/lib/parseLog";
import { EmptyFolderIcon, FilledFolderIcon } from "@/src/components/Icons";
import { useState } from "react";

type FileUploadProps = {
    file: File | null;
    setFile: React.Dispatch<React.SetStateAction<File | null>>;
    parsedData: ParsedLogMaterials | null;
    setParsedData: React.Dispatch<React.SetStateAction<ParsedLogMaterials | null>>;
};

export default function FileUpload(props: FileUploadProps) {

    const [showHiddenInput, setShowHiddenInput] = useState(false);

    async function handleFileDrop(e: React.DragEvent<HTMLDivElement>) {
        e.preventDefault();

        const droppedFile = e.dataTransfer.files[0];

        if (!droppedFile) {
            return;
        }

        props.setFile(droppedFile);
        const parsedData = await parseLog(droppedFile);
        props.setParsedData(parsedData);
        setShowHiddenInput(false);
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

    function showHiddenFileInput(e: React.DragEvent<HTMLDivElement>) {
        e.preventDefault();
        setShowHiddenInput(true);

    }

    return (
        <div className="relative" onDragOver={showHiddenFileInput} onDragLeave={() => setShowHiddenInput(false)}>

            <div className="group hover:bg-gray-800 flex flex-col w-48 h-24 bg-white mb-2 rounded-md"
                onDragOver={(e) => e.preventDefault()}
                onDrop={handleFileDrop}
            >
                <label htmlFor="file-input" className="flex flex-col items-center justify-center text-center w-full h-full min-h-0 max-h-full text-black cursor-pointer overflow-hidden group-hover:text-gray-200">
                    {
                        props.file ?
                            <FilledFolderIcon /> : <EmptyFolderIcon />
                    }
                    <p className="text-sm"> {props.file ? `${props.file.name}` : "Drag & drop file here, or click to select a file"}</p>
                </label>
                <input id="file-input" type="file" className="hidden"
                    onChange={handleFileSelect} />

            </div>



            <div className={`flex items-center justify-center fixed top-0 left-0 w-full h-full bg-gray-200/30 transition-opacity duration-500 ${showHiddenInput ? "opacity-100 backdrop-blur-md pointer-events-auto" : "opacity-0 pointer-events-none"}`} onDrop={handleFileDrop}>
                    <h1 className="text-9xl font-thin text-center"> Drop your file here </h1>
            </div>


        </div>
    )
}