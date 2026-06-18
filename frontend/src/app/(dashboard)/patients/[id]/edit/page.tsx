'use client';

import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { usePatient } from '@/features/patients/hooks';
import { PatientForm } from '@/features/patients/components/PatientForm';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Loader2 } from 'lucide-react';

export default function EditPatientPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const { data: patient, isLoading } = usePatient(id);

  if (isLoading) {
    return (
      <div className="max-w-2xl mx-auto flex items-center justify-center py-20">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!patient) {
    return <div className="text-center py-12 text-muted-foreground">Patient not found</div>;
  }

  const initialData = {
    fullName: patient.fullName,
    age: patient.age,
    gender: patient.gender,
    bloodGroup: patient.bloodGroup,
    weight: patient.weight,
    height: patient.height,
    phone: patient.phone,
    address: patient.address,
    medicalHistory: patient.medicalHistory,
    allergies: patient.allergies,
    previousDiseases: patient.previousDiseases,
    emergencyContact: patient.emergencyContact,
    doctorId: patient.doctorId,
    id: patient.id,
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/patients">
          <Button variant="ghost" size="icon"><ArrowLeft className="h-5 w-5" /></Button>
        </Link>
        <div>
          <h1 className="text-2xl font-bold">Edit Patient</h1>
          <p className="text-sm text-muted-foreground font-mono">{patient.patientId}</p>
        </div>
      </div>
      <PatientForm initialData={initialData} onSuccess={() => router.push('/patients')} />
    </div>
  );
}
