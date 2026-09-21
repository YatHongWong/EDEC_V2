"use client";
import { useState } from "react";
import FileUpload from "./FileUpload";
import { parseLog } from "@/src/lib/parseLog";
import { ParsedLogMaterials, MaterialQuantities } from "@/src/lib/calculatorTypes.types";
import { useEffect } from "react";
import { parseReport } from "@/src/lib/parseReport";
import { calculateResult } from "@/src/lib/calculateResult";
import ResultDisplay from "./ResultDisplay";
import HelpButtonForLog from "./HelpForLog";
import CopyPathButton from "./CopyPathButton";
import InfoBox from "./InfoBox";
import RetrofitReportHelpButton from "./RetrofitReportHelpButton";
import ErrorMessage from "./ErrorMessage";
import { ParseResult } from "@/src/lib/parseTypes.types";

export default function Home() {
  const [file, setFile] = useState<File | null>(null);
  const [retrofitReport, setRetrofitReport] = useState<string | null>(null);
  const [parsedLog, setParsedLog] = useState<ParsedLogMaterials | null>(null);
  const [parsedReport, setParsedReport] = useState<MaterialQuantities | null>(null);
  const [calcResult, setCalcResult] = useState<MaterialQuantities | null>(null);
  const [logErrorMessage, setLogErrorMessage] = useState<string>("");
  const [reportErrorMessage, setReportErrorMessage] = useState<string>("");

  useEffect(() => {
    if (retrofitReport) {
      updateParsedReportAndMessage(retrofitReport);
    }
  }, [retrofitReport]);

  useEffect(() => {
    if (parsedLog && parsedReport) {
      setCalcResult(calculateResult(parsedLog, parsedReport));
    }
  }, [parsedLog, parsedReport, logErrorMessage, reportErrorMessage]);

  function updateParsedReportAndMessage(report: string) {
    const parseResult: ParseResult<MaterialQuantities | null> = parseReport(report);
    if (parseResult.success) {
      setParsedReport(parseResult.data);
    } else {
      setParsedReport(null);
    }
    setReportErrorMessage(parseResult.message);
  }

  function statusColor() {
    if (parsedLog && parsedReport) {
      return "bg-green-500";
    } else if (!parsedLog && !parsedReport) {
      return "bg-red-500";
    } else {
      return "bg-orange-500";
    }
  }

  function statusText() {
    if (parsedLog && parsedReport) {
      return "Ready";
    } else if (!parsedLog && !parsedReport) {
      return "Missing valid log file and retrofit report";
    } else if (!parsedLog) {
      return "Missing valid log file";
    } else if (!parsedReport) {
      return "Missing valid retrofit report";
    }
  }

  return (
    <main className="flex flex-col md:flex-row md:flex-wrap w-full h-full gap-2">
      <div className="flex flex-col flex-1 min-w-96 max-w-full border-amber-500 border-2 p-2 rounded-md">
        <h1 className="text-2xl mb-2">Elite Dangerous Engineering Calculator</h1>

        <div className="flex flex-row items-center space-x-2">
          <h2 className="text-lg">Commander Log File</h2>

          <HelpButtonForLog />
        </div>

        <div className="relative items-center space-x-1">
          <InfoBox content={
            <>
              <p>Found in: <strong>%userprofile%\Saved Games\Frontier Developments\Elite Dangerous</strong> <CopyPathButton path="%userprofile%\Saved Games\Frontier Developments\Elite Dangerous" /></p>

              <p> Use the <strong>latest</strong> .log file that includes <br />
                <code className="font-mono text-xs border border-slate-500 break-all rounded-sm p-1"> {'{ "timestamp":"2026-XX-XXTXX:XX:09Z", "event":"Materials", ...'} </code></p>

            </>} />


        </div>

        <FileUpload file={file} setFile={setFile} parsedData={parsedLog} setParsedData={setParsedLog} setLogErrorMessage={setLogErrorMessage} />


        <ErrorMessage message={logErrorMessage} />

        <label htmlFor="retrofit-report-textarea" className="text-lg">EDSY Retrofit Report </label>

        <InfoBox content=

          {<><p>
            Use the following settings when generating the report: <br />
            Apply blueprints up to <strong>grade 5</strong> <strong>100%</strong> <br />
            Rolls to complete each grade <strong>1 2 3 4 5</strong> <span className="text-xs text-gray-700">(Assuming max reputation)</span>

          </p>

            <RetrofitReportHelpButton /></>
          } />
        <textarea id="retrofit-report-textarea" className="bg-gray-700 p-1 w-full h-40 rounded-md resize-none placeholder-gray-400"
          placeholder="paste report here"
          onChange={(e) => setRetrofitReport(e.target.value)
          } />
        <ErrorMessage message={reportErrorMessage} />

        <div className={`center h-6 w-full mx-auto ${statusColor()}`}>
          <p className="text-white text-sm text-center"> {statusText()}</p>
        </div>
      </div>

      <div className="flex flex-col flex-1 min-w-96 max-w-full border-amber-500 border-2 p-2 rounded-md">

        <h1 className="text-2xl mb-2">Missing Materials</h1>
        <ResultDisplay missingMaterials={calcResult} />
      </div>

    </main>
  );
}
