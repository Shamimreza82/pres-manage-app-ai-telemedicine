'use client';

import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { api } from '@/lib/axios';
import { useDoctorPrescriptionById, useMyDoctors } from '@/features/mr/hooks';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Download, Calendar, User, Stethoscope, Activity, Thermometer, Heart, Droplets } from 'lucide-react';
import { formatDate } from '@/lib/utils';
import { toast } from 'sonner';

export default function PrescriptionDetailPage() {
  const { id: doctorId, prescriptionId } = useParams<{ id: string; prescriptionId: string }>();
  const router = useRouter();
  const { data: doctors } = useMyDoctors();
  const { data: rx, isLoading } = useDoctorPrescriptionById(doctorId, prescriptionId);

  const doctor = doctors?.find((d: any) => d.id === doctorId);

  const handleDownload = async () => {
    try {
      const response = await api.get(`/mr/doctors/${doctorId}/prescriptions/${prescriptionId}/pdf`, {
        responseType: 'blob',
      });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `prescription-${rx?.prescriptionNo || prescriptionId}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch {
      toast.error('Failed to download prescription');
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6 animate-fade-in max-w-4xl mx-auto">
        <div className="h-8 w-48 bg-gray-200 dark:bg-gray-800 rounded-lg animate-pulse" />
        <div className="h-96 bg-gray-200 dark:bg-gray-800 rounded-xl animate-pulse" />
      </div>
    );
  }

  if (!rx) {
    return (
      <div className="space-y-6 animate-fade-in max-w-4xl mx-auto">
        <div className="flex items-center gap-4">
          <button onClick={() => router.back()} className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
            <ArrowLeft className="h-5 w-5 text-muted-foreground" />
          </button>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Prescription Not Found</h1>
        </div>
      </div>
    );
  }

  const vitals = [
    { label: 'BP', value: rx.bloodPressure, icon: Heart },
    { label: 'Pulse', value: rx.pulseRate, icon: Activity },
    { label: 'Temp', value: rx.temperature, icon: Thermometer },
    { label: 'SpO2', value: rx.oxygenSaturation, icon: Droplets },
  ].filter((v) => v.value);

  return (
    <div className="space-y-6 animate-fade-in max-w-4xl mx-auto">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href={`/dashboard/mr/doctors/${doctorId}/prescriptions`} className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
            <ArrowLeft className="h-5 w-5 text-muted-foreground" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              Prescription #{rx.prescriptionNo}
            </h1>
            <p className="text-sm text-muted-foreground mt-1">
              {doctor?.fullName || 'Doctor'} &middot; {formatDate(rx.createdAt)}
            </p>
          </div>
        </div>
        <Button onClick={handleDownload} className="rounded-xl gradient-primary text-white shadow-glow">
          <Download className="h-4 w-4 mr-2" /> Download PDF
        </Button>
      </div>

      <div className="premium-card-static overflow-hidden">
        <div className="p-6 space-y-8">
          {/* Doctor Info */}
          <div className="flex items-start justify-between">
            <div>
              <h2 className="text-lg font-bold text-gray-900 dark:text-white">{rx.doctor?.fullName}</h2>
              <p className="text-sm text-muted-foreground">{rx.doctor?.degree}</p>
              <p className="text-sm text-muted-foreground">{rx.doctor?.specialization}</p>
              <p className="text-sm text-muted-foreground">BMDC: {rx.doctor?.bmdcRegNo}</p>
            </div>
            <div className="text-right">
              <p className="text-sm text-muted-foreground">{rx.doctor?.clinicName}</p>
              <p className="text-sm text-muted-foreground">{rx.doctor?.clinicAddress}</p>
              <p className="text-sm text-muted-foreground">{rx.doctor?.phone}</p>
            </div>
          </div>

          <div className="border-t border-gray-100 dark:border-gray-800" />

          {/* Patient Info */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">Patient Information</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <p className="text-xs text-muted-foreground">Name</p>
                <p className="text-sm font-medium text-gray-900 dark:text-white">{rx.patient?.fullName}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Patient ID</p>
                <p className="text-sm font-medium text-gray-900 dark:text-white">{rx.patient?.patientId}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Age / Gender</p>
                <p className="text-sm font-medium text-gray-900 dark:text-white">{rx.patient?.age} yrs / {rx.patient?.gender}</p>
              </div>
              {rx.patient?.weight && (
                <div>
                  <p className="text-xs text-muted-foreground">Weight</p>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">{rx.patient.weight} kg</p>
                </div>
              )}
            </div>
          </div>

          {/* Vitals */}
          {vitals.length > 0 && (
            <>
              <div className="border-t border-gray-100 dark:border-gray-800" />
              <div>
                <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">Vital Signs</h3>
                <div className="flex flex-wrap gap-4">
                  {vitals.map((v) => (
                    <div key={v.label} className="flex items-center gap-2 px-3 py-2 rounded-lg bg-gray-50 dark:bg-gray-900">
                      <v.icon className="h-4 w-4 text-teal-600" />
                      <div>
                        <p className="text-xs text-muted-foreground">{v.label}</p>
                        <p className="text-sm font-medium text-gray-900 dark:text-white">{v.value}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}

          {/* Diagnosis */}
          {(rx.chiefComplaint || rx.diagnosis) && (
            <>
              <div className="border-t border-gray-100 dark:border-gray-800" />
              <div className="grid md:grid-cols-2 gap-6">
                {rx.chiefComplaint && (
                  <div>
                    <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-2">Chief Complaint</h3>
                    <p className="text-sm text-gray-700 dark:text-gray-300">{rx.chiefComplaint}</p>
                  </div>
                )}
                {rx.diagnosis && (
                  <div>
                    <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-2">Diagnosis</h3>
                    <p className="text-sm text-gray-700 dark:text-gray-300">{rx.diagnosis}</p>
                    {rx.diagnosisNotes && (
                      <p className="text-sm text-muted-foreground mt-1 italic">{rx.diagnosisNotes}</p>
                    )}
                  </div>
                )}
              </div>
            </>
          )}

          {/* Medicines */}
          <div className="border-t border-gray-100 dark:border-gray-800" />
          <div>
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">Medicines</h3>
            <div className="overflow-hidden rounded-xl border border-gray-200 dark:border-gray-700">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-gray-50 dark:bg-gray-900">
                    <th className="px-4 py-2.5 text-left font-medium text-gray-700 dark:text-gray-300">Medicine</th>
                    <th className="px-4 py-2.5 text-left font-medium text-gray-700 dark:text-gray-300">Dosage</th>
                    <th className="px-4 py-2.5 text-left font-medium text-gray-700 dark:text-gray-300">Frequency</th>
                    <th className="px-4 py-2.5 text-left font-medium text-gray-700 dark:text-gray-300">Duration</th>
                    <th className="px-4 py-2.5 text-left font-medium text-gray-700 dark:text-gray-300">Instructions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                  {rx.medicines?.map((m: any, i: number) => (
                    <tr key={m.id || i} className="hover:bg-gray-50 dark:hover:bg-gray-900/50">
                      <td className="px-4 py-2.5 font-medium text-gray-900 dark:text-white">
                        {m.name}{m.strength ? ` ${m.strength}` : ''}
                      </td>
                      <td className="px-4 py-2.5 text-gray-700 dark:text-gray-300">{m.dosage}</td>
                      <td className="px-4 py-2.5 text-gray-700 dark:text-gray-300">{m.frequency}</td>
                      <td className="px-4 py-2.5 text-gray-700 dark:text-gray-300">{m.duration}</td>
                      <td className="px-4 py-2.5 text-muted-foreground">{m.instructions || '—'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Investigations */}
          {rx.investigations?.length > 0 && (
            <>
              <div className="border-t border-gray-100 dark:border-gray-800" />
              <div>
                <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">Investigations</h3>
                <div className="space-y-2">
                  {rx.investigations.map((inv: any) => (
                    <div key={inv.id} className="flex items-start gap-3 p-3 rounded-lg bg-gray-50 dark:bg-gray-900">
                      <Stethoscope className="h-4 w-4 text-teal-600 mt-0.5" />
                      <div>
                        <p className="text-sm font-medium text-gray-900 dark:text-white">{inv.name}</p>
                        {inv.notes && <p className="text-xs text-muted-foreground mt-0.5">{inv.notes}</p>}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}

          {/* Advice */}
          {(rx.advice || rx.foodAdvice) && (
            <>
              <div className="border-t border-gray-100 dark:border-gray-800" />
              <div className="grid md:grid-cols-2 gap-6">
                {rx.advice && (
                  <div>
                    <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-2">Advice</h3>
                    <p className="text-sm text-gray-700 dark:text-gray-300">{rx.advice}</p>
                  </div>
                )}
                {rx.foodAdvice && (
                  <div>
                    <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-2">Food Advice</h3>
                    <p className="text-sm text-gray-700 dark:text-gray-300">{rx.foodAdvice}</p>
                  </div>
                )}
              </div>
            </>
          )}

          {/* Follow-up */}
          {rx.followUpDate && (
            <>
              <div className="border-t border-gray-100 dark:border-gray-800" />
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-red-500" />
                <span className="text-sm font-medium text-red-600 dark:text-red-400">Follow-up:</span>
                <span className="text-sm text-gray-900 dark:text-white">
                  {formatDate(rx.followUpDate)}
                </span>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
