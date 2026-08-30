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

export default function Home() {
  const [file, setFile] = useState<File | null>(null);
  const [retrofitReport, setRetrofitReport] = useState<string | null>(null);
  const [parsedLog, setParsedLog] = useState<ParsedLogMaterials | null>(null);
  const [parsedReport, setParsedReport] = useState<MaterialQuantities | null>(null);
  const [calcResult, setCalcResult] = useState<MaterialQuantities | null>(null);

  useEffect(() => {
    setRetrofitReport('{"retrofitOptions":{"rebuy_max_discount":1,"rebuy_max_bpgrade":0,"eng_max_bpgrade":5,"eng_max_bproll":1,"eng_est_rolls":[0,1.5,2,3,4.5,9],"exp_filter":"all"},"retrofits":[{"target":"(Current Build)","baseline":"(Stock Ship)","ship":"TypeX_3","steps":[{"enabled":true,"module":"Int_Powerplant_Size6_Class1","index":0,"action":"sell","discount":0},{"enabled":true,"module":"Int_Powerplant_Size6_Class5","index":0,"action":"buy","discount":0},{"enabled":true,"module":"Int_Powerplant_Size6_Class5","index":0,"action":"engineer","blueprint":"PowerPlant_Armoured","grade":1,"progress":0.8,"rolls":1},{"enabled":true,"module":"Int_Powerplant_Size6_Class5","index":0,"action":"engineer","blueprint":"PowerPlant_Armoured","grade":2,"progress":0.8,"rolls":1.5},{"enabled":true,"module":"Int_Powerplant_Size6_Class5","index":0,"action":"engineer","blueprint":"PowerPlant_Armoured","grade":3,"progress":0.8,"rolls":2.5},{"enabled":true,"module":"Int_Powerplant_Size6_Class5","index":0,"action":"engineer","blueprint":"PowerPlant_Armoured","grade":4,"progress":0.8,"rolls":3.5},{"enabled":true,"module":"Int_Powerplant_Size6_Class5","index":0,"action":"engineer","blueprint":"PowerPlant_Armoured","grade":5,"progress":1,"rolls":9},{"enabled":true,"module":"Int_Powerplant_Size6_Class5","index":0,"action":"experimental","experimental":"special_powerplant_toughened"}],"cost":12810960,"materials":{"WornShieldEmitters":1,"Carbon":4,"ShieldEmitters":4,"HighDensityComposites":2.5,"Vanadium":6.5,"ShieldingSensors":3.5,"FedProprietaryComposites":4.5,"Tungsten":9,"CompoundShielding":9,"FedCoreComposites":9,"GridResistors":5}}]}')
    retrofitReport ? setParsedReport(parseReport(retrofitReport)) : null;
  }, []);

  useEffect(() => {
    if (retrofitReport) {
      const parsed = parseReport(retrofitReport);
      setParsedReport(parsed);
    }
  }, [retrofitReport]);


  useEffect(() => {
    if (parsedLog && parsedReport) {
      setCalcResult(calculateResult(parsedLog, parsedReport));
    }


  }, [parsedLog, parsedReport]);

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
    <main className="flex flex-row w-full h-full space-x-2">
      <div className="flex flex-col flex-1 min-w-0 max-w-full border-amber-500 border-2 p-2 rounded-md">
        <h1 className="text-2xl mb-2">Elite Dangerous Engineering Calculator</h1>

        <div className="flex flex-row items-center space-x-2">
          <p>Commander .log file:</p>

          <HelpButtonForLog />
        </div>
        <p className="text-sm text-gray-400 mb-2">Found in: %userprofile%\Saved Games\Frontier Developments\Elite Dangerous</p>

        <FileUpload file={file} setFile={setFile} parsedData={parsedLog} setParsedData={setParsedLog} />
        {
          file && !parsedLog ? <p className="text-red-500 text-sm">Invalid file. Please upload a valid .log file containing the "Materials" event.</p> : null
        }


        <label htmlFor="retrofit-report-textarea">EDSY retrofit report: </label>
        <textarea id="retrofit-report-textarea" className="bg-gray-700 p-1 w-full h-40 rounded-md resize-none placeholder-gray-400"
          placeholder="paste report here"
          onChange={(e) => setRetrofitReport(e.target.value)
          } />
        {retrofitReport && !parsedReport ? <p className="text-red-500 text-sm">Invalid retrofit report format</p> : null}

        <div className={`center h-6 w-full mx-auto mt-2 ${statusColor()}`}>
          <p className="text-white text-sm text-center"> {statusText()}</p>
        </div>
      </div>

      <div className="flex flex-col flex-1 min-w-0 max-w-full border-amber-500 border-2 p-2 rounded-md">

        <h1 className="text-2xl mb-2">Missing Materials</h1>
        <ResultDisplay missingMaterials={calcResult} />
      </div>

    </main>
  );
}
