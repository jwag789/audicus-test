import { prisma } from "~/db.server";

type Patient = {
    id: string;
    name: string;
  };
  
  export async function getPatients(): Promise<Array<Patient>> {
    return prisma.patient.findMany();
  }

  export async function getPatient(name: string) {
    return prisma.patient.findUnique({ where: { name } });
  }