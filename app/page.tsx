"use client";
import { useState } from "react";
import FileUpload from "./FileUpload";
import { parseLog } from "@/src/lib/parseLog";
import { ParsedData } from "@/src/lib/calculatorTypes.types";

export default function Home() {
  const [file, setFile] = useState<File | null>(null);
  const [retrofitReport, setRetrofitReport] = useState<String | null>(null);
  const [parsedData, setParsedData] = useState<ParsedData | null>(null);
  const [validRetrofitReport, setValidRetrofitReport] = useState<boolean>(true);


  return (
    <main className="flex flex-row w-full h-full">
      <div className="flex flex-col">
      <h1>Elite Dangerous Engineering Calculator</h1>
      <FileUpload setFile={setFile} setParsedData={setParsedData} />
      <p>Selected file: {file?.name}</p>

      <input type="text" placeholder="retrofit report" onChange={(e) => setRetrofitReport(e.target.value)} />
      <p>Retrofit Report: {retrofitReport}</p>
      </div>

      <div className="flex flex-col">
        <button></button>
  
      </div>

    </main>
  );
}
