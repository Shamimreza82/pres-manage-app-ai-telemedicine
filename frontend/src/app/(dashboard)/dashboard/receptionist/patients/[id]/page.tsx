'use client';

import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { useRecPatient } from '@/features/receptionist/hooks';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Pencil, Phone, MapPin, Calendar, Weight, Ruler, Droplets, User } from 'lucide-react';

export default function RecPatientDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const { data: patient, isLoading } = useRecPatient(id);

  if (isLoading) {
    return (
      <div className="space-y-6 animate-fade-in">
        <div className="h-8 w-64 bg-gray-200 dark:bg-gray-800 rounded-lg animate-pulse" />
        <div className="grid gap-6 md:grid-cols-2">
          <div className="h-64 bg-gray-200 dark:bg-gray-800 rounded-xl animate-pulse" />
          <div className="h-64 bg-gray-200 dark:bg-gray-800 rounded-xl animate-pulse" />
        </div>
      </div>
    );
  }

  if (!patient) return <div className="text-center py-12 text-muted-foreground">Patient not found</div>;

  const infoCards = [
    { icon: Calendar, label: 'Age', value: `${patient.age} years` },
    { icon: Droplets, label: 'Blood Group', value: patient.bloodGroup?.replace('_', ' ') || '-' },
    { icon: Weight, label: 'Weight', value: patient.weight ? `${patient.weight} kg` : '-' },
    { icon: Ruler, label: 'Height', value: patient.height ? `${patient.height} cm` : '-' },
    { icon: Phone, label: 'Phone', value: patient.phone || '-' },
    { icon: MapPin, label: 'Address', value: patient.address || '-' },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => router.push('/dashboard/receptionist/patients')} className="rounded-xl">
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl gradient-primary shadow-glow flex items-center justify-center text-white font-bold text-lg">
                {patient.fullName.charAt(0)}
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{patient.fullName}</h1>
                <p className="text-sm text-muted-foreground font-mono">{patient.patientId}</p>
              </div>
            </div>
          </div>
        </div>
        <Link href={`/dashboard/receptionist/patients/${patient.id}/edit`}>
          <Button variant="outline" className="h-10 rounded-xl">
            <Pencil className="h-4 w-4 mr-2" /> Edit Patient
          </Button>
        </Link>
      </div>

      {/* Info Grid */}
      <Card className="premium-card">
        <CardHeader><CardTitle className="text-base flex items-center gap-2"><User className="h-4 w-4" /> Patient Information</CardTitle></CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            {infoCards.map(({ icon: Icon, label, value }) => (
              <div key={label} className="flex items-center gap-3 p-3 rounded-xl bg-gray-50 dark:bg-gray-900/50">
                <div className="p-2 rounded-lg bg-blue-50 dark:bg-blue-950/30">
                  <Icon className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">{label}</p>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">{value}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Medical History */}
      <Card className="premium-card">
        <CardHeader><CardTitle className="text-base">Medical History</CardTitle></CardHeader>
        <CardContent className="space-y-3">
          {patient.medicalHistory ? (
            <div>
              <p className="text-xs text-muted-foreground mb-1">History</p>
              <p className="text-sm">{patient.medicalHistory}</p>
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">No medical history recorded</p>
          )}
          {patient.allergies && (
            <div>
              <p className="text-xs text-muted-foreground mb-1">Allergies</p>
              <Badge variant="destructive" className="rounded-lg">{patient.allergies}</Badge>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
