'use client';

import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { useRecPrescription } from '@/features/receptionist/hooks';
import { downloadPrescriptionPDF } from '@/features/receptionist/api';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  ArrowLeft, Download, User, Calendar, Heart, Thermometer,
  Wind, Activity, FileText, Stethoscope, Pill, Beaker,
  ClipboardList, MessageSquare, Utensils,
} from 'lucide-react';

export default function RecPrescriptionDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { data: rx, isLoading } = useRecPrescription(id);

  if (isLoading) {
    return (
      <div className="space-y-6 animate-fade-in">
        <div className="h-8 w-64 bg-gray-200 dark:bg-gray-800 rounded-lg animate-pulse" />
        <div className="h-96 bg-gray-200 dark:bg-gray-800 rounded-xl animate-pulse" />
        <div className="h-48 bg-gray-200 dark:bg-gray-800 rounded-xl animate-pulse" />
      </div>
    );
  }

  if (!rx) return <div className="text-center py-12 text-muted-foreground">Prescription not found</div>;

  const vitals = [
    { icon: Heart, label: 'BP', value: rx.bloodPressure || '-' },
    { icon: Activity, label: 'Pulse', value: rx.pulseRate ? `${rx.pulseRate} bpm` : '-' },
    { icon: Thermometer, label: 'Temp', value: rx.temperature ? `${rx.temperature}\u00B0F` : '-' },
    { icon: Wind, label: 'SpO2', value: rx.oxygenSaturation ? `${rx.oxygenSaturation}%` : '-' },
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/dashboard/receptionist/prescriptions">
            <Button variant="ghost" size="icon" className="rounded-xl">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Prescription</h1>
              <Badge variant="outline" className="font-mono">{rx.prescriptionNo}</Badge>
            </div>
            <p className="text-sm text-muted-foreground mt-1">
              <Calendar className="h-3.5 w-3.5 inline mr-1" />
              {new Date(rx.createdAt).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
            </p>
          </div>
        </div>
        <Button
          onClick={() => downloadPrescriptionPDF(rx.id)}
          className="rounded-xl gradient-primary text-white shadow-glow"
        >
          <Download className="h-4 w-4 mr-2" /> PDF
        </Button>
      </div>

      {/* Doctor & Patient Info */}
      <div className="grid gap-5 md:grid-cols-2">
        <Card className="premium-card">
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Stethoscope className="h-4 w-4 text-blue-600" /> Doctor
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-1 text-sm">
            <p className="font-medium text-gray-900 dark:text-white">{rx.doctor?.fullName}</p>
            <p className="text-muted-foreground">{rx.doctor?.degree} &middot; {rx.doctor?.specialization}</p>
            <p className="text-muted-foreground">{rx.doctor?.clinicName}</p>
            {rx.doctor?.phone && <p className="text-muted-foreground">{rx.doctor.phone}</p>}
          </CardContent>
        </Card>

        <Card className="premium-card">
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <User className="h-4 w-4 text-emerald-600" /> Patient
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-1 text-sm">
            <p className="font-medium text-gray-900 dark:text-white">{rx.patient?.fullName}</p>
            <p className="text-muted-foreground font-mono">{rx.patient?.patientId}</p>
            <p className="text-muted-foreground">{rx.patient?.age} years &middot; {rx.patient?.gender}</p>
          </CardContent>
        </Card>
      </div>

      {/* Vitals */}
      <Card className="premium-card">
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Activity className="h-4 w-4 text-purple-600" /> Vitals
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {vitals.map(({ icon: Icon, label, value }) => (
              <div key={label} className="flex items-center gap-3 p-3 rounded-xl bg-gray-50 dark:bg-gray-900/50">
                <div className="p-2 rounded-lg bg-purple-50 dark:bg-purple-950/30">
                  <Icon className="h-4 w-4 text-purple-600 dark:text-purple-400" />
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

      {/* Symptoms & Diagnosis */}
      <div className="grid gap-5 md:grid-cols-2">
        {rx.symptoms && (
          <Card className="premium-card">
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <MessageSquare className="h-4 w-4 text-amber-600" /> Symptoms
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-700 dark:text-gray-300">{rx.symptoms}</p>
            </CardContent>
          </Card>
        )}
        {rx.diagnosis && (
          <Card className="premium-card">
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <ClipboardList className="h-4 w-4 text-red-600" /> Diagnosis
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-700 dark:text-gray-300">{rx.diagnosis}</p>
              {rx.diagnosisNotes && (
                <p className="text-xs text-muted-foreground mt-2">{rx.diagnosisNotes}</p>
              )}
            </CardContent>
          </Card>
        )}
      </div>

      {/* Medicines */}
      {rx.medicines?.length > 0 && (
        <Card className="premium-card overflow-hidden">
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Pill className="h-4 w-4 text-blue-600" /> Medicines
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="premium-table">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Strength</th>
                    <th>Dosage</th>
                    <th>Frequency</th>
                    <th>Duration</th>
                    <th>Instructions</th>
                  </tr>
                </thead>
                <tbody>
                  {rx.medicines.map((m: any, i: number) => (
                    <tr key={m.id || i}>
                      <td className="font-medium text-gray-900 dark:text-white">{m.name}</td>
                      <td>{m.strength || '-'}</td>
                      <td>{m.dosage}</td>
                      <td>{m.frequency}</td>
                      <td>{m.duration}</td>
                      <td className="text-xs text-muted-foreground">{m.instructions || '-'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Investigations */}
      {rx.investigations?.length > 0 && (
        <Card className="premium-card">
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Beaker className="h-4 w-4 text-cyan-600" /> Investigations
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {rx.investigations.map((inv: any, i: number) => (
                <Badge key={inv.id || i} variant="secondary" className="rounded-lg text-sm px-3 py-1.5">
                  {inv.name}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Advice & Follow-up */}
      <div className="grid gap-5 md:grid-cols-2">
        {rx.advice && (
          <Card className="premium-card">
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <MessageSquare className="h-4 w-4 text-emerald-600" /> Advice
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-700 dark:text-gray-300">{rx.advice}</p>
            </CardContent>
          </Card>
        )}
        {rx.foodAdvice && (
          <Card className="premium-card">
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <Utensils className="h-4 w-4 text-orange-600" /> Food Advice
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-700 dark:text-gray-300">{rx.foodAdvice}</p>
            </CardContent>
          </Card>
        )}
      </div>

      {rx.followUpDate && (
        <Card className="premium-card">
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Calendar className="h-4 w-4 text-rose-600" /> Follow-up
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm font-medium text-gray-900 dark:text-white">
              {new Date(rx.followUpDate).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
