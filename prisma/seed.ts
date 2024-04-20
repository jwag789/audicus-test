import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function seed() {
  const patientA = await prisma.patient.create({data: {name: 'A'}});
  const patientB = await prisma.patient.create({data: {name: 'B'}});
  const patientC = await prisma.patient.create({data: {name: 'C'}});
  const patientD = await prisma.patient.create({data: {name: 'D'}});
  const patientE = await prisma.patient.create({data: {name: 'E'}});
  const patientF = await prisma.patient.create({data: {name: 'F'}});
  const patientG = await prisma.patient.create({data: {name: 'G'}});
  const patientH = await prisma.patient.create({data: {name: 'H'}});
  const patientI = await prisma.patient.create({data: {name: 'I'}});
  const patientJ = await prisma.patient.create({data: {name: 'J'}});

  const listPatients = [patientA, patientB, patientC, patientD,
    patientE, patientF, patientG, patientH, patientI, patientJ
  ]
  const listSounds = [{name: '01'}, {name: '02'}, {name: '03'}, 
    {name: '04'}, {name: '05'}, {name: '06'}, 
    {name: '07'}, {name: '08'}, {name: '09'}, 
    {name: '10'}, {name: '11'}, {name: '12'}
  ]
  for (let patient of listPatients) {
    for (let sound of listSounds) {
      await prisma.sound.create({
        data: {
          name: sound.name,
          patientId: patient.id
        }
      });
    }
  }

  console.log(`Database has been seeded. 🌱`);
}

seed()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
