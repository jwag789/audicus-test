import { json } from "@remix-run/node";
import type { MetaFunction } from "@remix-run/node";
import { Link, useLoaderData } from "@remix-run/react";
import { getPatients } from "~/models/patient.server";

export const meta: MetaFunction = () => [{ title: "Patients | Patient List" }];

export const loader = async () => {
  return json({ patients: await getPatients() });
};

export default function Index() {
  const { patients } = useLoaderData<typeof loader>();
  return (
    <main className="w-full relative p-10 bg-light-gray flex-col flex items-center justify-center">
        <div className="w-full relative flex-col flex items-center justify-center gap-4">
          <h1 className="font-normal font-sans text-xl text-dark-orange">List of Patients</h1>
          {patients.map((patient) => (
            <Link
            key={patient.id}
            to={`patients/${patient.name}`}
            className="text-dark-blue text-base font-medium font-sans
            bg-light-blue hover:bg-light-blue/80 w-full md:w-1/2 p-4 rounded-lg flex items-center justify-center shadow-lg
            "
            >
              Patient {patient.name}
            </Link>
          ))}
          <Link to="stats" className="w-full md:w-1/2 text-light-gray flex-grow bg-dark-orange hover:bg-dark-orange/80 p-4 rounded-lg shadow-lg text-center">Stats Page</Link>
        </div>
    </main>
  );
}
