import { PrismaClient, UserRole } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  const hashedPassword = await bcrypt.hash('admin123', 12);

  const admin = await prisma.user.upsert({
    where: { email: 'admin@presmanage.com' },
    update: {},
    create: {
      email: 'admin@presmanage.com',
      password: hashedPassword,
      role: 'SUPER_ADMIN',
      isVerified: true,
      isActive: true,
    },
  });

  console.log('Super admin created:', admin.email);

  const doctorPassword = await bcrypt.hash('doctor123', 12);
  const doctorUser = await prisma.user.upsert({
    where: { email: 'doctor@example.com' },
    update: {},
    create: {
      email: 'doctor@example.com',
      password: doctorPassword,
      role: 'DOCTOR',
      isVerified: true,
      isActive: true,
      doctor: {
        create: {
          fullName: 'Dr. John Doe',
          degree: 'MBBS, FCPS (Medicine)',
          specialization: 'Cardiology',
          bmdcRegNo: 'BMDC-12345',
          clinicName: 'WellCare Medical Center',
          clinicAddress: '123 Healthcare Avenue, Dhaka',
          phone: '+8801700000000',
          isProfileComplete: true,
        },
      },
    },
    include: { doctor: true },
  });

  if (doctorUser.doctor) {
    await prisma.subscription.upsert({
      where: { doctorId: doctorUser.doctor.id },
      update: {},
      create: {
        doctorId: doctorUser.doctor.id,
        plan: 'FREE',
        status: 'ACTIVE',
        patientLimit: 50,
        prescriptionLimit: 100,
      },
    });
  }

  console.log('Doctor created:', doctorUser.email);

  const patient = await prisma.patient.create({
    data: {
      patientId: 'PAT-000001',
      doctorId: doctorUser.doctor!.id,
      fullName: 'Jane Smith',
      age: 35,
      gender: 'FEMALE',
      bloodGroup: 'A_POSITIVE',
      weight: 65,
      height: 165,
      phone: '+8801700000001',
      address: '456 Patient Road, Dhaka',
    },
  });

  console.log('Patient created:', patient.fullName);

  const rx = await prisma.prescription.create({
    data: {
      prescriptionNo: 'RX-20240101-A1B2',
      doctorId: doctorUser.doctor!.id,
      patientId: patient.id,
      symptoms: 'Fever, headache, body ache for 3 days',
      chiefComplaint: 'High fever with chills',
      diagnosis: 'Viral Fever',
      diagnosisNotes: 'Keep hydrated and monitor temperature',
      bloodPressure: '120/80',
      pulseRate: '78/min',
      temperature: '101.2°F',
      oxygenSaturation: '98%',
      advice: 'Take adequate rest. Drink plenty of fluids.',
      foodAdvice: 'Light and easily digestible food. Avoid oily food.',
      followUpDate: new Date('2024-02-01'),
      medicines: {
        create: [
          {
            name: 'Napa',
            strength: '500mg',
            dosage: '1+0+1',
            frequency: 'After meal',
            duration: '5 Days',
            instructions: 'Take with warm water',
          },
          {
            name: 'Azithromycin',
            strength: '500mg',
            dosage: '1+0+0',
            frequency: 'After meal',
            duration: '3 Days',
            instructions: 'Complete the course',
          },
        ],
      },
      investigations: {
        create: [
          { name: 'CBC (Complete Blood Count)', notes: 'Check WBC count' },
          { name: 'Blood Sugar Fasting', notes: '' },
        ],
      },
    },
  });

  console.log('Prescription created:', rx.prescriptionNo);
  console.log('Seeding complete!');
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
