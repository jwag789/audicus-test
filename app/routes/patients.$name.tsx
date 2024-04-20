import type { LoaderFunctionArgs, MetaFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { Link, useLoaderData } from "@remix-run/react";
import { getPatient, getPatients } from "~/models/patient.server";
import { getSounds } from "~/models/sound.server";
import invariant from "tiny-invariant";
import { useState, useEffect } from "react";
import { Dialog } from 'primereact/dialog';
import { PatientSoundResponse } from "~/interfaces/app_interfaces";

export const meta: MetaFunction = () => [{ title: "Patients | Sound List" }];

export const loader = async ({
  params,
}: LoaderFunctionArgs) => {
  const patients = await getPatients();

  invariant(params.name, "name not found");
  const patient = await getPatient(params.name);
  if (!patient) {
    throw new Response("Not Found", { status: 404 });
  }

  const patientId = patient.id;
  const patientIndex = patients.map(p => p.name).indexOf(patient.name);
  const indexFirst = patientIndex === 0 ? true : false;
  const indexLast = patientIndex === patients.length-1 ? true : false;
  const sounds = await getSounds({patientId})

  return json(
    { patient, sounds, indexFirst, indexLast }
  );
};

export default function PatientName() {
  const { patient, sounds, indexFirst, indexLast } = useLoaderData<typeof loader>();
  const [status, setStatus] = useState(0);
  const [respond, setRespond] = useState("");
  const [visible, setVisible] = useState(false);
  const [soundResponses, setSoundResponses] = useState<PatientSoundResponse[]>([]);

  const playSound = (name: string) => {
    let audio = new Audio(`/Patient_${patient.name}_Sound_${name}.mp3`)
    audio.play();

    fetch(`https://corsproxy.io/?https://jungle.audicus.com/v1/coding_test/patient_response/${patient.name}/${name}`)
        .then(response => {
          setStatus(response.status);
          return response.text();
        })
        .then(data => {
          setRespond(data);
          setVisible(true);
          const responses = soundResponses;
          responses.push({sound: name, patient: patient.name, response: data});
          setSoundResponses(responses);
          const localResponses = window.localStorage.getItem("responses");
          if (localResponses) {
            const localParsed = JSON.parse(localResponses);
            if (!localParsed.some((parsed: { sound: string; patient: string; }) => parsed.sound === name && parsed.patient === patient.name)) {
              localParsed.push({sound: name, patient: patient.name, response: data});
              window.localStorage.setItem("responses", JSON.stringify(localParsed))
            }
          } else {
            window.localStorage.setItem("responses", JSON.stringify(responses))
          }
          
        })
        .catch(error => console.error('Error:', error));
  }

  useEffect(() => {
    setSoundResponses([])
  }, [patient]);


  return (
    <main className="w-full relative p-10 min-h-screen bg-light-gray flex-col flex items-center justify-center">
        {visible && <div className="fixed inset-0 bg-black/30" aria-hidden="true" />}
        <Dialog className="text-lg text-dark-blue rounded-lg shadow-lg font-serif bg-white z-50 p-6 flex justify-content align-items" header="Patient Information" visible={visible} style={{ width: '50vw' }} onHide={() => setVisible(false)}>
          {status>0 && <p>Status Code: {status}</p>}
          {respond.length>0 && <p>{respond}</p>}
        </Dialog>
        <div className="w-full relative min-h-screen flex-col flex items-center justify-center gap-4">
        <h1 className="font-normal font-sans text-xl text-dark-orange">Patient {patient.name}'s Sounds</h1>
        <div className="w-full md:w-1/2 flex gap-4 text-light-gray text-base font-medium font-sans items-center justify-center">
        {
          !indexFirst &&
          <Link to={`../patients/${String.fromCharCode(patient.name.charCodeAt(0) - 1)}`}
            className="bg-dark-orange hover:bg-dark-orange/80 p-4 rounded-lg shadow-lg"
          >Back</Link>
        }
        <Link to="../" className="flex-grow bg-dark-orange hover:bg-dark-orange/80 p-4 rounded-lg shadow-lg text-center">Home</Link>
        { !indexLast &&
          <Link to={`../patients/${String.fromCharCode(patient.name.charCodeAt(0) + 1)}`}
            className="bg-dark-orange hover:bg-dark-orange/80 p-4 rounded-lg shadow-lg"
          >Next</Link>
        }
        </div>
        {sounds.map((sound) => (
          <div
          key={sound.id}
          onClick={() => playSound(sound.name)}
          className="cursor-pointer text-dark-blue text-base font-medium font-sans
          bg-light-blue hover:bg-light-blue/80 w-full md:w-1/2 p-4 rounded-lg flex items-center justify-center shadow-lg
          "
          >
            Sound {sound.name}
          </div>
        ))}
        {soundResponses.map((soundResponse, i) => (
          <div
          key={i}
          className="text-dark-blue text-base font-medium font-sans
          bg-dark-orange w-full md:w-1/2 p-4 rounded-lg flex items-center justify-center shadow-lg
          "
          >
           Sound {soundResponse.sound}: {soundResponse.response}
          </div>
        ))}
        </div>
        
    </main>
  );
}