import type { Patient, Sound } from "@prisma/client";

import { prisma } from "~/db.server";

export function getSounds({ patientId }: { patientId: Patient["id"] }) {
  return prisma.sound.findMany({
    where: { patientId },
    select: { id: true, name: true },
    orderBy: { name: "asc" },
  });
}