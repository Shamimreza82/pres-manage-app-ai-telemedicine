'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { api } from '@/lib/axios';
import { useQueryClient } from '@tanstack/react-query';
import { patientKeys } from '../hooks';
import { useAdminDoctors } from '@/features/dashboard/hooks';
import { toast } from 'sonner';

const BLOOD_GROUPS = [
  { value: 'A_POSITIVE', label: 'A+' },
  { value: 'A_NEGATIVE', label: 'A-' },
  { value: 'B_POSITIVE', label: 'B+' },
  { value: 'B_NEGATIVE', label: 'B-' },
  { value: 'AB_POSITIVE', label: 'AB+' },
  { value: 'AB_NEGATIVE', label: 'AB-' },
  { value: 'O_POSITIVE', label: 'O+' },
  { value: 'O_NEGATIVE', label: 'O-' },
];

interface PatientFormProps {
  onSuccess?: () => void;
  initialData?: Record<string, any>;
}

export const PatientForm = ({ onSuccess, initialData }: PatientFormProps) => {
  const qc = useQueryClient();
  const { data: doctors } = useAdminDoctors({ limit: 200 });
  const isEdit = !!initialData;
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const [form, setForm] = useState({
    fullName: '',
    age: '',
    gender: '',
    bloodGroup: '',
    weight: '',
    height: '',
    phone: '',
    emergencyContact: '',
    address: '',
    medicalHistory: '',
    allergies: '',
    previousDiseases: '',
    doctorId: '',
  });

  useEffect(() => {
    if (initialData) {
      setForm({
        fullName: initialData.fullName || '',
        age: initialData.age?.toString() || '',
        gender: initialData.gender || '',
        bloodGroup: initialData.bloodGroup || '',
        weight: initialData.weight?.toString() || '',
        height: initialData.height?.toString() || '',
        phone: initialData.phone || '',
        emergencyContact: initialData.emergencyContact || '',
        address: initialData.address || '',
        medicalHistory: initialData.medicalHistory || '',
        allergies: initialData.allergies || '',
        previousDiseases: initialData.previousDiseases || '',
        doctorId: initialData.doctorId || '',
      });
    }
  }, []);

  const set = (field: string, value: string) => {
    setForm(prev => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors(prev => { const n = { ...prev }; delete n[field]; return n; });
  };

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!form.fullName || form.fullName.length < 2) errs.fullName = 'Name must be at least 2 characters';
    if (!form.age || isNaN(Number(form.age)) || Number(form.age) < 1) errs.age = 'Age must be a positive number';
    if (!form.gender) errs.gender = 'Gender is required';
    if (!form.phone || form.phone.length < 5) errs.phone = 'Phone number is required (min 5 characters)';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const onSubmit = async () => {
    if (!validate()) return;
    setSaving(true);
    try {
      const payload: Record<string, any> = {};
      for (const key of Object.keys(form)) {
        const val = form[key as keyof typeof form];
        if (val !== '') {
          if (key === 'age' || key === 'weight' || key === 'height') {
            payload[key] = Number(val);
          } else {
            payload[key] = val;
          }
        }
      }
      if (isEdit && initialData?.id) {
        await api.put(`/patients/${initialData.id}`, payload);
        qc.invalidateQueries({ queryKey: patientKeys.all });
        qc.invalidateQueries({ queryKey: patientKeys.detail(initialData.id) });
        toast.success('Patient updated');
      } else {
        await api.post('/patients', payload);
        qc.invalidateQueries({ queryKey: patientKeys.all });
        toast.success('Patient created');
      }
      onSuccess?.();
    } catch (e: any) {
      console.error(e);
      toast.error(e.response?.data?.message || 'Failed to save patient');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="animate-fade-in">
      <Card>
        <CardContent className="pt-6">
          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Full Name <span className="text-red-500">*</span></Label>
                <Input value={form.fullName} onChange={e => set('fullName', e.target.value)} />
                {errors.fullName && <p className="text-xs text-red-500">{errors.fullName}</p>}
              </div>
              <div className="space-y-2">
                <Label>Age <span className="text-red-500">*</span></Label>
                <Input type="number" value={form.age} onChange={e => set('age', e.target.value)} />
                {errors.age && <p className="text-xs text-red-500">{errors.age}</p>}
              </div>
              <div className="space-y-2">
                <Label>Gender <span className="text-red-500">*</span></Label>
                <Select value={form.gender} onValueChange={v => set('gender', v)}>
                  <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="MALE">Male</SelectItem>
                    <SelectItem value="FEMALE">Female</SelectItem>
                    <SelectItem value="OTHER">Other</SelectItem>
                  </SelectContent>
                </Select>
                {errors.gender && <p className="text-xs text-red-500">{errors.gender}</p>}
              </div>
              <div className="space-y-2">
                <Label>Blood Group</Label>
                <Select value={form.bloodGroup} onValueChange={v => set('bloodGroup', v)}>
                  <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
                  <SelectContent>
                    {BLOOD_GROUPS.map((bg) => (
                      <SelectItem key={bg.value} value={bg.value}>{bg.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Weight (kg)</Label>
                <Input type="number" step="0.1" value={form.weight} onChange={e => set('weight', e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label>Height (cm)</Label>
                <Input type="number" step="0.1" value={form.height} onChange={e => set('height', e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label>Phone <span className="text-red-500">*</span></Label>
                <Input value={form.phone} onChange={e => set('phone', e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label>Emergency Contact</Label>
                <Input value={form.emergencyContact} onChange={e => set('emergencyContact', e.target.value)} />
              </div>
            </div>

            {isEdit && doctors?.data && (
              <div className="space-y-2">
                <Label>Assigned Doctor</Label>
                <Select value={form.doctorId} onValueChange={v => set('doctorId', v)}>
                  <SelectTrigger><SelectValue placeholder="Select doctor" /></SelectTrigger>
                  <SelectContent>
                    {doctors.data.map((d: any) => (
                      <SelectItem key={d.id} value={d.id}>{d.fullName} — {d.clinicName}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            <div className="space-y-2">
              <Label>Address</Label>
              <Textarea value={form.address} onChange={e => set('address', e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label>Medical History</Label>
              <Textarea value={form.medicalHistory} onChange={e => set('medicalHistory', e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label>Allergies</Label>
              <Textarea value={form.allergies} onChange={e => set('allergies', e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label>Previous Diseases</Label>
              <Textarea value={form.previousDiseases} onChange={e => set('previousDiseases', e.target.value)} />
            </div>

            <Button onClick={onSubmit} disabled={saving} className="w-full">
              {saving ? 'Saving...' : isEdit ? 'Update Patient' : 'Save Patient'}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
