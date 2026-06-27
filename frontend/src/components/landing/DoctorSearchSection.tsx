'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Search, Loader2, Stethoscope, MapPin, GraduationCap } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Card } from '@/components/ui/card';
import { useDoctorSearch } from '@/features/doctors/hooks';
import { useDebouncedValue } from '@/hooks/useDebounce';
import { DEGREES, SPECIALIZATIONS } from '@/lib/constants';
import type { Doctor } from '@/types';

export const DoctorSearchSection = () => {
  const router = useRouter();
  const [query, setQuery] = useState('');
  const [degree, setDegree] = useState('__all__');
  const [specialization, setSpecialization] = useState('__all__');
  const [showFilters, setShowFilters] = useState(false);

  const debouncedQuery = useDebouncedValue(query, 400);
  const degreeFilter = degree === '__all__' ? undefined : degree;
  const specFilter = specialization === '__all__' ? undefined : specialization;
  const hasFilters = debouncedQuery || degreeFilter || specFilter;

  const { data, isLoading } = useDoctorSearch(
    {
      q: debouncedQuery || undefined,
      degree: degreeFilter,
      specialization: specFilter,
      limit: 10,
    },
    !!hasFilters,
  );

  const doctors = data?.data ?? [];

  const handleSearch = () => {
    setShowFilters(true);
  };

  return (
    <section className="relative pb-20 md:pb-28">
      <div className="mx-auto max-w-4xl px-6">
        <div className="rounded-2xl border bg-card shadow-soft p-6 md:p-8">
          <h2 className="text-xl font-semibold mb-1">Find a Doctor</h2>
          <p className="text-sm text-muted-foreground mb-5">
            Search by name, degree, or specialization to find the right doctor for you.
          </p>

          <div className="flex flex-col gap-3">
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by doctor name or clinic..."
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Button onClick={handleSearch} className="shrink-0 gap-2">
                <Search className="h-4 w-4" />
                Search
              </Button>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <Select value={degree} onValueChange={setDegree}>
                <SelectTrigger className="flex-1">
                  <SelectValue placeholder="Any degree" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="__all__">Any degree</SelectItem>
                  {DEGREES.map((d) => (
                    <SelectItem key={d.value} value={d.value}>{d.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={specialization} onValueChange={setSpecialization}>
                <SelectTrigger className="flex-1">
                  <SelectValue placeholder="Any specialization" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="__all__">Any specialization</SelectItem>
                  {SPECIALIZATIONS.map((s) => (
                    <SelectItem key={s.value} value={s.value}>{s.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {hasFilters && (
            <div className="mt-6">
              {isLoading ? (
                <div className="flex items-center justify-center py-12">
                  <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                </div>
              ) : doctors.length === 0 ? (
                <div className="text-center py-12">
                  <Stethoscope className="h-10 w-10 mx-auto text-muted-foreground/50 mb-3" />
                  <p className="text-muted-foreground">No doctors found. Try adjusting your search.</p>
                </div>
              ) : (
                <div className="space-y-3">
                  <p className="text-sm text-muted-foreground">{data?.total ?? 0} doctor(s) found</p>
                  {doctors.map((doctor) => (
                    <DoctorCard
                      key={doctor.id}
                      doctor={doctor}
                      onClick={() => router.push(`/doctors/${doctor.id}`)}
                    />
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

const DoctorCard = ({ doctor, onClick }: { doctor: Doctor; onClick: () => void }) => (
  <Card
    className="p-4 cursor-pointer hover:shadow-md hover:border-primary/30 transition-all"
    onClick={onClick}
  >
    <div className="flex items-start gap-4">
      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl gradient-primary text-white text-lg font-bold">
        {doctor.fullName.charAt(0)}
      </div>
      <div className="flex-1 min-w-0">
        <h3 className="font-semibold text-sm truncate">{doctor.fullName}</h3>
        {doctor.degree.length > 0 && (
          <p className="text-xs text-muted-foreground flex items-center gap-1.5 mt-0.5">
            <GraduationCap className="h-3 w-3 shrink-0" />
            {doctor.degree.join(', ')}
          </p>
        )}
        {doctor.specialization.length > 0 && (
          <p className="text-xs text-muted-foreground flex items-center gap-1.5 mt-0.5">
            <Stethoscope className="h-3 w-3 shrink-0" />
            {doctor.specialization.join(', ')}
          </p>
        )}
        <p className="text-xs text-muted-foreground flex items-center gap-1.5 mt-0.5">
          <MapPin className="h-3 w-3 shrink-0" />
          {doctor.clinicName}
        </p>
      </div>
    </div>
  </Card>
);
