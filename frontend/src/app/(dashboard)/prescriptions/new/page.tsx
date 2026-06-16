'use client';

import { Suspense, useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { api } from '@/lib/axios';
import { useCreatePrescription } from '@/features/prescriptions/hooks';
import { prescriptionSchema } from '@/features/prescriptions/schema';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowLeft, Plus, Trash2 } from 'lucide-react';
import { toast } from 'sonner';

import { cn } from '@/lib/utils';
import { z } from 'zod';

type FormData = z.infer<typeof prescriptionSchema>;

const emptyMedicine = { name: '', strength: '', dosage: '', frequency: '', duration: '', instructions: '' };

function NewPrescriptionForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const create = useCreatePrescription();

  const {
    register,
    control,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(prescriptionSchema),
    defaultValues: {
      patientId: searchParams.get('patientId') || '',
      symptoms: '', chiefComplaint: '', diagnosis: '', diagnosisNotes: '',
      bloodPressure: '', pulseRate: '', temperature: '', oxygenSaturation: '',
      advice: '', foodAdvice: '', followUpDate: '',
      medicines: [emptyMedicine],
      investigations: [],
    },
  });

  const { fields: medFields, append: addMed, remove: removeMed } = useFieldArray({ control, name: 'medicines' });
  const { fields: invFields, append: addInv, remove: removeInv } = useFieldArray({ control, name: 'investigations' });

  const [patients, setPatients] = useState<any[]>([]);
  useEffect(() => {
    api.get('/patients?limit=100').then((r) => setPatients(r.data.data)).catch(() => {});
  }, []);

  const onSubmit = async (data: FormData) => {
    try {
      await create.mutateAsync({
        ...data,
        followUpDate: data.followUpDate || undefined,
        investigations: data.investigations?.filter((i) => i.name),
      });
      toast.success('Prescription created');
      router.push('/prescriptions');
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to create prescription');
    }
  };

  const FieldError = ({ field }: { field: keyof FormData }) => {
    const msg = errors[field]?.message;
    return msg ? <p className="text-xs text-red-500 mt-1">{msg as string}</p> : null;
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/prescriptions"><Button variant="ghost" size="icon"><ArrowLeft className="h-5 w-5" /></Button></Link>
        <h1 className="text-2xl font-bold">New Prescription</h1>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <Card>
          <CardHeader><CardTitle>Patient & Vitals</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Patient <span className="text-red-500">*</span></Label>
              <Select value={watch('patientId')} onValueChange={(v) => setValue('patientId', v, { shouldValidate: true })}>
                <SelectTrigger className={cn(errors.patientId && 'border-red-500 ring-red-500/20')}>
                  <SelectValue placeholder="Select patient" />
                </SelectTrigger>
                <SelectContent>
                  {patients.map((p: any) => (
                    <SelectItem key={p.id} value={p.id}>{p.fullName} ({p.patientId})</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FieldError field="patientId" />
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="space-y-1"><Label className="text-xs">BP</Label><Input placeholder="120/80" {...register('bloodPressure')} className={cn(errors.bloodPressure && 'border-red-500')} /></div>
              <div className="space-y-1"><Label className="text-xs">Pulse</Label><Input placeholder="72/min" {...register('pulseRate')} className={cn(errors.pulseRate && 'border-red-500')} /></div>
              <div className="space-y-1"><Label className="text-xs">Temp</Label><Input placeholder="98.6°F" {...register('temperature')} className={cn(errors.temperature && 'border-red-500')} /></div>
              <div className="space-y-1"><Label className="text-xs">SpO2</Label><Input placeholder="98%" {...register('oxygenSaturation')} className={cn(errors.oxygenSaturation && 'border-red-500')} /></div>
            </div>
            <div className="space-y-1"><Label>Symptoms</Label><Textarea {...register('symptoms')} /></div>
            <div className="space-y-1"><Label>Chief Complaint</Label><Textarea {...register('chiefComplaint')} /></div>
            <div className="space-y-1"><Label>Diagnosis</Label><Input {...register('diagnosis')} className={cn(errors.diagnosis && 'border-red-500')} /></div>
            <div className="space-y-1"><Label>Notes</Label><Textarea {...register('diagnosisNotes')} /></div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Medicines <span className="text-red-500">*</span></CardTitle>
            <Button type="button" variant="outline" size="sm" onClick={() => addMed(emptyMedicine)}><Plus className="h-4 w-4 mr-1" /> Add</Button>
          </CardHeader>
          <CardContent className="space-y-3">
            {errors.medicines && !Array.isArray(errors.medicines) && (
              <p className="text-xs text-red-500">{errors.medicines.message as string}</p>
            )}
            {medFields.map((field, i) => (
                <div key={field.id} className="p-4 border rounded-lg space-y-3 relative">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Medicine #{i + 1}</span>
                    {medFields.length > 1 && (
                      <Button type="button" variant="ghost" size="sm" onClick={() => removeMed(i)}><Trash2 className="h-4 w-4 text-red-500" /></Button>
                    )}
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    <div className="space-y-1">
                      <Label className="text-xs">Name <span className="text-red-500">*</span></Label>
                      <Input {...register(`medicines.${i}.name`)} placeholder="Napa" className={cn(errors.medicines?.[i]?.name && 'border-red-500')} />
                      {errors.medicines?.[i]?.name && <p className="text-xs text-red-500">{errors.medicines[i]?.name?.message}</p>}
                    </div>
                    <div className="space-y-1"><Label className="text-xs">Strength</Label><Input {...register(`medicines.${i}.strength`)} placeholder="500mg" /></div>
                    <div className="space-y-1">
                      <Label className="text-xs">Dosage <span className="text-red-500">*</span></Label>
                      <Input {...register(`medicines.${i}.dosage`)} placeholder="1+0+1" className={cn(errors.medicines?.[i]?.dosage && 'border-red-500')} />
                      {errors.medicines?.[i]?.dosage && <p className="text-xs text-red-500">{errors.medicines[i]?.dosage?.message}</p>}
                    </div>
                    <div className="space-y-1">
                      <Label className="text-xs">Frequency <span className="text-red-500">*</span></Label>
                      <Input {...register(`medicines.${i}.frequency`)} placeholder="After meal" className={cn(errors.medicines?.[i]?.frequency && 'border-red-500')} />
                      {errors.medicines?.[i]?.frequency && <p className="text-xs text-red-500">{errors.medicines[i]?.frequency?.message}</p>}
                    </div>
                    <div className="space-y-1">
                      <Label className="text-xs">Duration <span className="text-red-500">*</span></Label>
                      <Input {...register(`medicines.${i}.duration`)} placeholder="7 Days" className={cn(errors.medicines?.[i]?.duration && 'border-red-500')} />
                      {errors.medicines?.[i]?.duration && <p className="text-xs text-red-500">{errors.medicines[i]?.duration?.message}</p>}
                    </div>
                    <div className="space-y-1"><Label className="text-xs">Instructions</Label><Input {...register(`medicines.${i}.instructions`)} placeholder="With water" /></div>
                  </div>
                </div>
              ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Investigations</CardTitle>
            <Button type="button" variant="outline" size="sm" onClick={() => addInv({ name: '', notes: '' })}><Plus className="h-4 w-4 mr-1" /> Add</Button>
          </CardHeader>
          <CardContent className="space-y-2">
            {invFields.map((field, i) => (
              <div key={field.id} className="flex gap-2 items-start">
                <div className="flex-1 space-y-1">
                  <Input {...register(`investigations.${i}.name`)} placeholder="CBC, X-Ray, MRI..." className={cn(errors.investigations?.[i]?.name && 'border-red-500')} />
                  {errors.investigations?.[i]?.name && <p className="text-xs text-red-500">{errors.investigations[i]?.name?.message}</p>}
                </div>
                <div className="flex-1 space-y-1">
                  <Input {...register(`investigations.${i}.notes`)} placeholder="Notes" />
                </div>
                <Button type="button" variant="ghost" size="icon" onClick={() => removeInv(i)} className="shrink-0 mt-0"><Trash2 className="h-4 w-4 text-red-500" /></Button>
              </div>
            ))}
            {invFields.length === 0 && <p className="text-sm text-muted-foreground">No investigations added.</p>}
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>Advice & Follow-up</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-1"><Label>Advice</Label><Textarea {...register('advice')} /></div>
            <div className="space-y-1"><Label>Food Advice</Label><Textarea {...register('foodAdvice')} /></div>
            <div className="space-y-1"><Label>Follow-up Date</Label><Input type="date" {...register('followUpDate')} /></div>
          </CardContent>
        </Card>

        <div className="flex gap-4">
          <Button type="submit" disabled={create.isPending} size="lg">
            {create.isPending ? 'Creating...' : 'Create Prescription'}
          </Button>
          <Link href="/prescriptions"><Button type="button" variant="outline" size="lg">Cancel</Button></Link>
        </div>
      </form>
    </div>
  );
}

export default function Page() {
  return (
    <Suspense fallback={<div className="flex justify-center py-12"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" /></div>}>
      <NewPrescriptionForm />
    </Suspense>
  );
}