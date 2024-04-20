import type { MetaFunction } from "@remix-run/node";
import { Link } from "@remix-run/react";
import { useState, useLayoutEffect } from "react";
import { PatientSoundResponse } from "~/interfaces/app_interfaces";
import * as appConstants from "~/constants/app_constants";

export const meta: MetaFunction = () => [{ title: "Patients | Stats" }];

export default function Stats() {
  const [responses, setResponses] = useState<PatientSoundResponse[]>([])
  const [yesResponses, setYesResponses] = useState<PatientSoundResponse[]>([]);
  const [noResponses, setNoResponses] = useState<PatientSoundResponse[]>([]);
  const [patientArray, setPatientArray] = useState<String[]>([]);
  const [soundArray, setSoundArray] = useState<String[]>([]);

  useLayoutEffect(() => {
    const patientResponses = window.localStorage.getItem("responses");
    if (patientResponses) {
        const responseJson = JSON.parse(patientResponses);
        setResponses(responseJson);
        setYesResponses(responseJson.filter((res: { response: string; }) => res.response === appConstants.DID_RESPOND))
        setNoResponses(responseJson.filter((res: { response: string; }) => res.response === appConstants.DID_NOT_RESPOND))
    
        const patientArr = [];
        const soundArr = [];
        for (const r of responseJson) {
          patientArr.push(r.patient);
          soundArr.push(r.sound);
        }
        const patientSet = new Set(patientArr);
        const soundSet = new Set(soundArr);
        setPatientArray(Array.from(patientSet));
        setSoundArray(Array.from(soundSet));
      }
  }, []);

  return (
    <main className="w-full min-h-full relative p-10 bg-light-gray flex-col flex items-center justify-center">
        <div className="w-full relative flex-col flex items-center justify-center gap-4">
        <h1 className="font-normal font-sans text-xl text-dark-orange">Patient Statistics</h1>
        <div className="w-full lg:w-1/2 flex gap-4 text-light-gray text-base font-medium font-sans items-center justify-center">
        <Link to="../" className="flex-grow bg-dark-orange hover:bg-dark-orange/80 p-4 rounded-lg shadow-lg text-center">Home</Link>
        </div>
        <div className="w-full lg:w-1/2 flex gap-4 text-light-gray text-base font-medium font-sans items-stretch justify-between">
            <div className="bg-light-blue p-4 rounded-lg shadow-lg flex-1">
              <p>Patients Responded: {yesResponses.length}</p>
              {yesResponses.length> 0 &&
              <>
              <div className="py-2 my-2 border-y-2 border-light-gray">
                {patientArray.map((p) => (
                  <>
                  {yesResponses.filter(r => r.patient === p).length>0 &&   
                    <p>
                      Patient {p}: {yesResponses.filter(r => r.patient === p).length} times
                    </p>
                  }
                  </>
                ))}
              </div>
              {soundArray.map((s) => (
                <>
                {yesResponses.filter(r => r.sound === s).length>0 &&
                <p>
                  Sound {s}: {yesResponses.filter(r => r.sound === s).length} times
                </p>
                }
                </>
              ))}
              </>
              }
              </div>
            <div className="bg-light-blue p-4 rounded-lg shadow-lg flex-1">
              <p>Patients Did Not Respond: {noResponses.length}</p>
              {noResponses.length> 0 &&
              <>
              <div className="py-2 my-2 border-y-2 border-light-gray">
              {patientArray.map((p) => (
                <>
                {noResponses.filter(r => r.patient === p).length>0 &&   
                  <p>
                    Patient {p}: {noResponses.filter(r => r.patient === p).length} times
                  </p>
                }
                </>
              ))}
              </div>
              {soundArray.map((s) => (
                <>
                {noResponses.filter(r => r.sound === s).length>0 &&
                <p>
                  Sound {s}: {noResponses.filter(r => r.sound === s).length} times
                </p>
                }
                </>
              ))}
              </>
              }
            </div>
        </div>
        {responses.map((response, i) => (
          <div
          key={i}
          className="text-dark-blue text-base font-medium font-sans
          bg-dark-orange w-full lg:w-1/2 p-4 rounded-lg flex items-center justify-center shadow-lg
          "
          >
           Patient {response.patient}, Sound {response.sound}: {response.response}
          </div>
        ))}
        </div>
        
    </main>
  );
}