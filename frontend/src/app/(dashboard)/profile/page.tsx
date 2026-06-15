'use client';

import { useState, useEffect } from 'react';
import { api } from '@/lib/axios';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Camera, Upload } from 'lucide-react';

export default function ProfilePage() {
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    api.get('/doctors/profile').then((r) => setProfile(r.data.data)).catch(() => toast.error('Failed to load profile')).finally(() => setLoading(false));
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await api.put('/doctors/profile', profile);
      toast.success('Profile updated');
    } catch (err: any) { toast.error(err.response?.data?.message || 'Failed') }
    finally { setSaving(false) }
  };

  const handleUpload = async (field: string, file: File | null) => {
    if (!file) return;
    const fd = new FormData();
    fd.append(field, file);
    try {
      const { data } = await api.post(`/doctors/upload-${field}`, fd);
      setProfile((p: any) => ({ ...p, ...data.data }));
      toast.success('File uploaded');
    } catch { toast.error('Upload failed') }
  };

  if (loading) return <div className="space-y-4">{[1, 2, 3].map((i) => <div key={i} className="h-24 bg-muted rounded animate-pulse" />)}</div>;

  const update = (field: string, value: string) => setProfile((p: any) => ({ ...p, [field]: value }));

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold">Clinic Profile</h1>
      <Card>
        <CardHeader><CardTitle>Doctor Information</CardTitle></CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Full Name</Label>
                <Input value={profile?.fullName || ''} onChange={(e) => update('fullName', e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label>Phone</Label>
                <Input value={profile?.phone || ''} onChange={(e) => update('phone', e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label>Degree</Label>
                <Input value={profile?.degree || ''} onChange={(e) => update('degree', e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label>Specialization</Label>
                <Input value={profile?.specialization || ''} onChange={(e) => update('specialization', e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label>BMDC Reg No</Label>
                <Input value={profile?.bmdcRegNo || ''} onChange={(e) => update('bmdcRegNo', e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label>Clinic Name</Label>
                <Input value={profile?.clinicName || ''} onChange={(e) => update('clinicName', e.target.value)} />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Clinic Address</Label>
              <Textarea value={profile?.clinicAddress || ''} onChange={(e) => update('clinicAddress', e.target.value)} />
            </div>

            <div className="grid grid-cols-2 gap-6 pt-4">
              <div className="border-2 border-dashed rounded-lg p-4 text-center">
                {profile?.signatureImg ? <img src={`http://localhost:5000/uploads/${profile.signatureImg}`} alt="Sig" className="h-16 mx-auto mb-2 object-contain" /> : <Camera className="h-8 w-8 mx-auto text-muted-foreground mb-2" />}
                <Label htmlFor="sig" className="cursor-pointer text-sm text-primary flex items-center justify-center gap-2">
                  <Upload className="h-4 w-4" /> Upload Signature
                </Label>
                <input id="sig" type="file" accept="image/*" className="hidden" onChange={(e) => handleUpload('signature', e.target.files?.[0] || null)} />
              </div>
              <div className="border-2 border-dashed rounded-lg p-4 text-center">
                {profile?.clinicLogo ? <img src={`http://localhost:5000/uploads/${profile.clinicLogo}`} alt="Logo" className="h-16 mx-auto mb-2 object-contain" /> : <Camera className="h-8 w-8 mx-auto text-muted-foreground mb-2" />}
                <Label htmlFor="logo" className="cursor-pointer text-sm text-primary flex items-center justify-center gap-2">
                  <Upload className="h-4 w-4" /> Upload Logo
                </Label>
                <input id="logo" type="file" accept="image/*" className="hidden" onChange={(e) => handleUpload('logo', e.target.files?.[0] || null)} />
              </div>
            </div>

            <Button type="submit" disabled={saving} className="w-full">{saving ? 'Saving...' : 'Save Profile'}</Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
