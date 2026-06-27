'use client';

import { useParams } from 'next/navigation';
import Link from 'next/link';
import {
  ChevronRight,
  Loader2,
  Stethoscope,
  GraduationCap,
  MapPin,
  Phone,
  FileText,
  Building2,
  AlertCircle,
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { useDoctor } from '@/features/doctors/hooks';

export default function DoctorDetailPage() {
  const params = useParams();
  const id = params.id as string;
  const { data: doctor, isLoading, error } = useDoctor(id);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (error || !doctor) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="h-12 w-12 mx-auto text-muted-foreground/50 mb-4" />
          <h2 className="text-lg font-semibold mb-1">Doctor not found</h2>
          <p className="text-sm text-muted-foreground mb-4">
            The doctor you are looking for does not exist or has been removed.
          </p>
          <Link
            href="/"
            className="text-sm font-medium text-primary hover:underline"
          >
            Back to Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen pt-24 pb-16">
      <div className="mx-auto max-w-4xl px-6">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-8">
          <Link href="/" className="hover:text-foreground transition-colors">
            Home
          </Link>
          <ChevronRight className="h-4 w-4" />
          <span className="text-foreground font-medium">Doctors</span>
          <ChevronRight className="h-4 w-4" />
          <span className="text-foreground truncate max-w-[250px]">
            {doctor.fullName}
          </span>
        </nav>

        {/* Doctor Profile */}
        <Card>
          <CardContent className="p-6 md:p-8">
            <div className="flex flex-col sm:flex-row items-start gap-6">
              <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-2xl gradient-primary text-white text-3xl font-bold">
                {doctor.fullName.charAt(0)}
              </div>

              <div className="flex-1 min-w-0">
                <h1 className="text-2xl md:text-3xl font-bold tracking-tight">
                  {doctor.fullName}
                </h1>

                <div className="mt-4 space-y-2.5">
                  {doctor.degree.length > 0 && (
                    <InfoRow
                      icon={GraduationCap}
                      label="Degrees"
                      value={doctor.degree.join(', ')}
                    />
                  )}
                  {doctor.specialization.length > 0 && (
                    <InfoRow
                      icon={Stethoscope}
                      label="Specialization"
                      value={doctor.specialization.join(', ')}
                    />
                  )}
                  {doctor.bmdcRegNo && (
                    <InfoRow
                      icon={FileText}
                      label="BMDC Reg No"
                      value={doctor.bmdcRegNo}
                    />
                  )}
                  <InfoRow
                    icon={Building2}
                    label="Clinic"
                    value={doctor.clinicName}
                  />
                  <InfoRow
                    icon={MapPin}
                    label="Address"
                    value={doctor.clinicAddress}
                  />
                  <InfoRow
                    icon={Phone}
                    label="Phone"
                    value={doctor.phone}
                  />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}

const InfoRow = ({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ElementType;
  label: string;
  value: string;
}) => (
  <div className="flex items-start gap-3">
    <Icon className="h-4 w-4 mt-0.5 shrink-0 text-muted-foreground" />
    <div className="text-sm">
      <span className="text-muted-foreground mr-1.5">{label}:</span>
      <span>{value}</span>
    </div>
  </div>
);
