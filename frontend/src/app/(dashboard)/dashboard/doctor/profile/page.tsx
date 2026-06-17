'use client';

import { useState, useEffect } from 'react';
import { api } from '@/lib/axios';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import {
  User, Mail, Phone, Award, Stethoscope, Building2, MapPin,
  FileText, Clock, CheckCircle, XCircle, Plus, X, Pencil,
  Save, Image as ImageIcon, Calendar,
} from 'lucide-react';

const DAYS = ['Saturday', 'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];

type Profile = Record<string, any>;
type Section = 'personal' | 'professional' | 'clinic' | null;

export default function DoctorProfilePage() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editingSection, setEditingSection] = useState<Section>(null);
  const [form, setForm] = useState<Profile>({});

  useEffect(() => {
    api.get('/doctors/profile').then((r) => {
      const p = r.data.data;
      let schedule = p.chamberSchedule;
      if (!schedule || typeof schedule === 'string') {
        try { schedule = JSON.parse(schedule || '[]'); } catch { schedule = []; }
      }
      setProfile({ ...p, chamberSchedule: schedule });
      initForm({ ...p, chamberSchedule: schedule });
    }).catch(() => toast.error('Failed to load profile')).finally(() => setLoading(false));
  }, []);

  const initForm = (p: Profile) => {
    setForm({
      fullName: p.fullName || '',
      phone: p.phone || '',
      degree: p.degree || '',
      specialization: p.specialization || '',
      bmdcRegNo: p.bmdcRegNo || '',
      clinicName: p.clinicName || '',
      clinicAddress: p.clinicAddress || '',
      chamberSchedule: p.chamberSchedule || [],
    });
  };

  const openSection = (section: Section) => {
    if (profile) initForm(profile);
    setEditingSection(section);
  };

  const cancelEdit = () => {
    if (profile) initForm(profile);
    setEditingSection(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const { data } = await api.put('/doctors/profile', form);
      let schedule = data.data.chamberSchedule;
      if (!schedule || typeof schedule === 'string') {
        try { schedule = JSON.parse(schedule || '[]'); } catch { schedule = []; }
      }
      setProfile({ ...data.data, chamberSchedule: schedule });
      setEditingSection(null);
      toast.success('Profile updated');
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  const handleUpload = async (field: string, file: File | null) => {
    if (!file) return;
    const fd = new FormData();
    fd.append(field, file);
    try {
      const { data } = await api.post(`/doctors/upload-${field}`, fd);
      setProfile((p: any) => ({ ...p, ...data.data }));
      toast.success('File uploaded');
    } catch {
      toast.error('Upload failed');
    }
  };

  const updateSchedule = (idx: number, field: string, value: string) => {
    const s = [...(form.chamberSchedule || [])];
    s[idx] = { ...s[idx], [field]: value };
    setForm((f: any) => ({ ...f, chamberSchedule: s }));
  };

  const addSlot = () => {
    setForm((f: any) => ({ ...f, chamberSchedule: [...(f.chamberSchedule || []), { day: '', startTime: '', endTime: '' }] }));
  };

  const removeSlot = (idx: number) => {
    setForm((f: any) => ({ ...f, chamberSchedule: (f.chamberSchedule || []).filter((_: any, i: number) => i !== idx) }));
  };

  if (loading) {
    return (
      <div className="space-y-6 animate-fade-in">
        <div className="h-40 bg-gray-200 dark:bg-gray-800 rounded-2xl animate-pulse" />
        <div className="grid gap-6 md:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-52 bg-gray-200 dark:bg-gray-800 rounded-xl animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  const initials = (profile?.fullName || '')
    .split(' ')
    .map((n: string) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Profile Header */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-900 p-6 sm:p-8">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PHBhdGggZD0iTTM2IDM0djItSDI0di0yaDEyek0zNiAyNHYySDI0di0yaDEyeiIvPjwvZz48L2c+PC9zdmc+')] opacity-30" />
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/2" />
        <div className="relative flex flex-col sm:flex-row items-start sm:items-center gap-5">
          <div className="w-20 h-20 rounded-2xl bg-white/20 backdrop-blur-sm shadow-lg flex items-center justify-center shrink-0 border border-white/30">
            <span className="text-2xl font-bold text-white">{initials}</span>
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex flex-col sm:flex-row sm:items-center gap-3">
              <h1 className="text-2xl font-bold text-white truncate">{profile?.fullName || 'Doctor'}</h1>
              <div className="flex items-center gap-2 flex-wrap">
                {profile?.isVerified !== undefined && (
                  <Badge className={profile.isVerified ? 'bg-emerald-500/20 text-emerald-200 border-emerald-500/30' : 'bg-amber-500/20 text-amber-200 border-amber-500/30'}>
                    {profile.isVerified ? <CheckCircle className="h-3 w-3 mr-1" /> : <XCircle className="h-3 w-3 mr-1" />}
                    {profile.isVerified ? 'Verified' : 'Unverified'}
                  </Badge>
                )}
                <Badge variant="outline" className="border-white/20 text-white/80 capitalize">
                  {profile?.status?.toLowerCase() || 'Active'}
                </Badge>
              </div>
            </div>
            <p className="text-blue-100 mt-1 flex items-center gap-2">
              <Stethoscope className="h-4 w-4 shrink-0" />
              {profile?.specialization || 'General Practitioner'}
              {profile?.degree && <span className="hidden sm:inline">· {profile.degree}</span>}
            </p>
          </div>
          <Button
            variant="secondary"
            size="sm"
            className="bg-white/15 text-white hover:bg-white/25 border border-white/20 shadow-lg backdrop-blur-sm shrink-0"
            onClick={() => openSection('personal')}
          >
            <Pencil className="h-4 w-4 mr-2" />
            Edit Profile
          </Button>
        </div>
      </div>

      {/* Info Cards Grid */}
      <div className="grid gap-6 md:grid-cols-3">
        {/* Personal Information */}
        <Card className="premium-card-static overflow-hidden group">
          <div className="h-1.5 bg-gradient-to-r from-blue-500 to-blue-600" />
          <CardContent className="p-5">
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 shadow-glow flex items-center justify-center">
                  <User className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white text-sm">Personal</h3>
                  <p className="text-xs text-muted-foreground">Contact details</p>
                </div>
              </div>
              <button
                onClick={() => openSection('personal')}
                className="p-2 rounded-lg text-muted-foreground hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-950/30 transition-all opacity-0 group-hover:opacity-100"
              >
                <Pencil className="h-4 w-4" />
              </button>
            </div>
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-blue-50 dark:bg-blue-950/30 flex items-center justify-center shrink-0">
                  <Mail className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                </div>
                <div className="min-w-0">
                  <p className="text-xs text-muted-foreground">Email</p>
                  <p className="text-sm font-medium text-gray-900 dark:text-white truncate">{profile?.user?.email || '—'}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-blue-50 dark:bg-blue-950/30 flex items-center justify-center shrink-0">
                  <Phone className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                </div>
                <div className="min-w-0">
                  <p className="text-xs text-muted-foreground">Phone</p>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">{profile?.phone || '—'}</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Professional Details */}
        <Card className="premium-card-static overflow-hidden group">
          <div className="h-1.5 bg-gradient-to-r from-purple-500 to-purple-600" />
          <CardContent className="p-5">
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-purple-600 shadow-glow flex items-center justify-center">
                  <Award className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white text-sm">Professional</h3>
                  <p className="text-xs text-muted-foreground">Credentials & expertise</p>
                </div>
              </div>
              <button
                onClick={() => openSection('professional')}
                className="p-2 rounded-lg text-muted-foreground hover:text-purple-600 hover:bg-purple-50 dark:hover:bg-purple-950/30 transition-all opacity-0 group-hover:opacity-100"
              >
                <Pencil className="h-4 w-4" />
              </button>
            </div>
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-purple-50 dark:bg-purple-950/30 flex items-center justify-center shrink-0">
                  <Award className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                </div>
                <div className="min-w-0">
                  <p className="text-xs text-muted-foreground">Degree</p>
                  <p className="text-sm font-medium text-gray-900 dark:text-white truncate">{profile?.degree || '—'}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-purple-50 dark:bg-purple-950/30 flex items-center justify-center shrink-0">
                  <Stethoscope className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                </div>
                <div className="min-w-0">
                  <p className="text-xs text-muted-foreground">Specialization</p>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">{profile?.specialization || '—'}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-purple-50 dark:bg-purple-950/30 flex items-center justify-center shrink-0">
                  <FileText className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                </div>
                <div className="min-w-0">
                  <p className="text-xs text-muted-foreground">BMDC Reg No</p>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">{profile?.bmdcRegNo || '—'}</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Clinic & Chamber */}
        <Card className="premium-card-static overflow-hidden group">
          <div className="h-1.5 bg-gradient-to-r from-amber-500 to-orange-600" />
          <CardContent className="p-5">
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 shadow-glow flex items-center justify-center">
                  <Building2 className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white text-sm">Clinic</h3>
                  <p className="text-xs text-muted-foreground">Practice location</p>
                </div>
              </div>
              <button
                onClick={() => openSection('clinic')}
                className="p-2 rounded-lg text-muted-foreground hover:text-amber-600 hover:bg-amber-50 dark:hover:bg-amber-950/30 transition-all opacity-0 group-hover:opacity-100"
              >
                <Pencil className="h-4 w-4" />
              </button>
            </div>
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-amber-50 dark:bg-amber-950/30 flex items-center justify-center shrink-0">
                  <Building2 className="h-4 w-4 text-amber-600 dark:text-amber-400" />
                </div>
                <div className="min-w-0">
                  <p className="text-xs text-muted-foreground">Clinic Name</p>
                  <p className="text-sm font-medium text-gray-900 dark:text-white truncate">{profile?.clinicName || '—'}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-amber-50 dark:bg-amber-950/30 flex items-center justify-center shrink-0">
                  <MapPin className="h-4 w-4 text-amber-600 dark:text-amber-400" />
                </div>
                <div className="min-w-0">
                  <p className="text-xs text-muted-foreground">Chamber Address</p>
                  <p className="text-sm font-medium text-gray-900 dark:text-white truncate">{profile?.clinicAddress || '—'}</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Bottom Row: Schedule + Uploads */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Chamber Schedule */}
        <Card className="premium-card-static overflow-hidden">
          <div className="h-1.5 bg-gradient-to-r from-emerald-500 to-emerald-600" />
          <CardContent className="p-5">
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-600 shadow-glow flex items-center justify-center">
                  <Clock className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white text-sm">Chamber Schedule</h3>
                  <p className="text-xs text-muted-foreground">Weekly availability</p>
                </div>
              </div>
              <Button variant="outline" size="sm" onClick={addSlot} className="shrink-0">
                <Plus className="h-4 w-4 mr-1" /> Add
              </Button>
            </div>
            {profile?.chamberSchedule && profile.chamberSchedule.length > 0 ? (
              <div className="space-y-2">
                {profile.chamberSchedule.map((slot: any, idx: number) => (
                  <div key={idx} className="flex items-center justify-between p-3 rounded-xl bg-gray-50 dark:bg-gray-800/50 group/slot">
                    <div className="flex items-center gap-3">
                      <Calendar className="h-4 w-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                      <div>
                        <p className="text-sm font-medium text-gray-900 dark:text-white">{slot.day}</p>
                        <p className="text-xs text-muted-foreground">{slot.startTime} — {slot.endTime}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="hidden group-hover/slot:flex items-center gap-1">
                        <Badge variant="outline" className="text-xs px-2 py-0">{slot.startTime} - {slot.endTime}</Badge>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <Clock className="h-10 w-10 mx-auto text-muted-foreground/50 mb-3" />
                <p className="text-sm text-muted-foreground">No schedule set</p>
                <p className="text-xs text-muted-foreground/60 mt-1">Add your weekly chamber hours above</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Signature & Logo Upload */}
        <Card className="premium-card-static overflow-hidden">
          <div className="h-1.5 bg-gradient-to-r from-rose-500 to-rose-600" />
          <CardContent className="p-5">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-rose-500 to-rose-600 shadow-glow flex items-center justify-center">
                <ImageIcon className="h-5 w-5 text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white text-sm">Brand Assets</h3>
                <p className="text-xs text-muted-foreground">Signature & clinic logo</p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="relative group/upload">
                <div className="aspect-[3/2] rounded-xl border-2 border-dashed border-gray-200 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-900/50 flex flex-col items-center justify-center gap-2 overflow-hidden transition-all hover:border-rose-300 dark:hover:border-rose-700 hover:bg-rose-50/30 dark:hover:bg-rose-950/20">
                  {profile?.signatureImg ? (
                    <>
                      <img src={`http://localhost:5000/uploads/${profile.signatureImg}`} alt="Signature" className="h-full w-full object-contain p-3" />
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover/upload:opacity-100 transition-opacity flex items-center justify-center">
                        <Label htmlFor="sig" className="cursor-pointer text-xs text-white bg-white/20 backdrop-blur-sm px-3 py-1.5 rounded-lg hover:bg-white/30 transition-colors">
                          Change
                        </Label>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="w-10 h-10 rounded-full bg-rose-100 dark:bg-rose-950/40 flex items-center justify-center">
                        <svg className="h-5 w-5 text-rose-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
                      </div>
                      <Label htmlFor="sig" className="cursor-pointer text-xs font-medium text-rose-600 dark:text-rose-400 hover:text-rose-700 transition-colors">
                        Upload Signature
                      </Label>
                      <p className="text-[10px] text-muted-foreground">PNG or JPG</p>
                    </>
                  )}
                </div>
                <input id="sig" type="file" accept="image/*" className="hidden" onChange={(e) => handleUpload('signature', e.target.files?.[0] || null)} />
                <p className="text-xs text-center text-muted-foreground mt-2">Signature</p>
              </div>

              <div className="relative group/upload">
                <div className="aspect-[3/2] rounded-xl border-2 border-dashed border-gray-200 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-900/50 flex flex-col items-center justify-center gap-2 overflow-hidden transition-all hover:border-rose-300 dark:hover:border-rose-700 hover:bg-rose-50/30 dark:hover:bg-rose-950/20">
                  {profile?.clinicLogo ? (
                    <>
                      <img src={`http://localhost:5000/uploads/${profile.clinicLogo}`} alt="Logo" className="h-full w-full object-contain p-3" />
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover/upload:opacity-100 transition-opacity flex items-center justify-center">
                        <Label htmlFor="logo" className="cursor-pointer text-xs text-white bg-white/20 backdrop-blur-sm px-3 py-1.5 rounded-lg hover:bg-white/30 transition-colors">
                          Change
                        </Label>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="w-10 h-10 rounded-full bg-rose-100 dark:bg-rose-950/40 flex items-center justify-center">
                        <svg className="h-5 w-5 text-rose-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                      </div>
                      <Label htmlFor="logo" className="cursor-pointer text-xs font-medium text-rose-600 dark:text-rose-400 hover:text-rose-700 transition-colors">
                        Upload Logo
                      </Label>
                      <p className="text-[10px] text-muted-foreground">PNG or JPG</p>
                    </>
                  )}
                </div>
                <input id="logo" type="file" accept="image/*" className="hidden" onChange={(e) => handleUpload('logo', e.target.files?.[0] || null)} />
                <p className="text-xs text-center text-muted-foreground mt-2">Clinic Logo</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Edit Section Dialog */}
      {editingSection && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm animate-fade-in p-4" onClick={cancelEdit}>
          <Card className="w-full max-w-xl premium-card-static animate-scale-in max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-lg font-bold text-gray-900 dark:text-white">
                    {editingSection === 'personal' && 'Edit Personal Information'}
                    {editingSection === 'professional' && 'Edit Professional Details'}
                    {editingSection === 'clinic' && 'Edit Clinic Information'}
                  </h2>
                  <p className="text-sm text-muted-foreground mt-0.5">
                    {editingSection === 'personal' && 'Update your contact details'}
                    {editingSection === 'professional' && 'Update your credentials'}
                    {editingSection === 'clinic' && 'Update your practice information'}
                  </p>
                </div>
                <button onClick={cancelEdit} className="p-2 rounded-lg text-muted-foreground hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
                  <X className="h-5 w-5" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                {editingSection === 'personal' && (
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label className="text-sm font-medium">Full Name</Label>
                      <Input value={form.fullName} onChange={(e) => setForm({ ...form, fullName: e.target.value })} className="h-11 premium-input" placeholder="Dr. John Doe" />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-sm font-medium">Phone</Label>
                      <Input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} className="h-11 premium-input" placeholder="+880 1XXX-XXXXXX" />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-sm font-medium">Email</Label>
                      <Input value={profile?.user?.email || ''} disabled className="h-11 premium-input bg-gray-50 dark:bg-gray-800/50 cursor-not-allowed" />
                      <p className="text-xs text-muted-foreground">Email cannot be changed</p>
                    </div>
                  </div>
                )}

                {editingSection === 'professional' && (
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label className="text-sm font-medium">Degree</Label>
                        <Input value={form.degree} onChange={(e) => setForm({ ...form, degree: e.target.value })} className="h-11 premium-input" placeholder="MBBS, FCPS" />
                      </div>
                      <div className="space-y-2">
                        <Label className="text-sm font-medium">Specialization</Label>
                        <Input value={form.specialization} onChange={(e) => setForm({ ...form, specialization: e.target.value })} className="h-11 premium-input" placeholder="Cardiology" />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label className="text-sm font-medium">BMDC Reg No</Label>
                      <Input value={form.bmdcRegNo} onChange={(e) => setForm({ ...form, bmdcRegNo: e.target.value })} className="h-11 premium-input" placeholder="A-12345" />
                    </div>
                  </div>
                )}

                {editingSection === 'clinic' && (
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label className="text-sm font-medium">Clinic Name</Label>
                      <Input value={form.clinicName} onChange={(e) => setForm({ ...form, clinicName: e.target.value })} className="h-11 premium-input" placeholder="City Medical Center" />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-sm font-medium">Chamber Address</Label>
                      <textarea
                        value={form.clinicAddress}
                        onChange={(e) => setForm({ ...form, clinicAddress: e.target.value })}
                        className="premium-input w-full rounded-xl border border-input bg-white dark:bg-gray-900 px-3 py-2.5 text-sm resize-none"
                        rows={3}
                        placeholder="123, Main Street, Dhaka"
                      />
                    </div>
                    <div className="pt-2 border-t border-gray-100 dark:border-gray-800/50">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2">
                          <Clock className="h-4 w-4 text-muted-foreground" />
                          <h4 className="text-sm font-semibold text-gray-900 dark:text-white">Chamber Schedule</h4>
                        </div>
                        <Button type="button" variant="outline" size="sm" onClick={addSlot}>
                          <Plus className="h-3.5 w-3.5 mr-1" /> Add Slot
                        </Button>
                      </div>
                      <div className="space-y-2.5">
                        {(form.chamberSchedule || []).map((slot: any, idx: number) => (
                          <div key={idx} className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-2.5 p-3 rounded-xl bg-gray-50 dark:bg-gray-800/50">
                            <select
                              value={slot.day}
                              onChange={(e) => updateSchedule(idx, 'day', e.target.value)}
                              className="premium-input h-9 px-2.5 text-sm bg-white dark:bg-gray-900 sm:flex-1 rounded-lg"
                            >
                              <option value="">Select day</option>
                              {DAYS.map((d) => <option key={d} value={d}>{d}</option>)}
                            </select>
                            <div className="flex items-center gap-2">
                              <input
                                type="time"
                                value={slot.startTime}
                                onChange={(e) => updateSchedule(idx, 'startTime', e.target.value)}
                                className="premium-input h-9 px-2.5 text-sm flex-1 rounded-lg"
                              />
                              <span className="text-xs text-muted-foreground shrink-0">to</span>
                              <input
                                type="time"
                                value={slot.endTime}
                                onChange={(e) => updateSchedule(idx, 'endTime', e.target.value)}
                                className="premium-input h-9 px-2.5 text-sm flex-1 rounded-lg"
                              />
                            </div>
                            <button type="button" onClick={() => removeSlot(idx)} className="text-red-500 hover:text-red-600 p-1.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors shrink-0">
                              <X className="h-4 w-4" />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                <div className="flex items-center gap-3 pt-2">
                  <Button type="submit" disabled={saving} className="h-11 flex-1 gradient-primary text-white shadow-glow hover:opacity-90">
                    <Save className="h-4 w-4 mr-2" />
                    {saving ? 'Saving...' : 'Save Changes'}
                  </Button>
                  <Button type="button" variant="outline" onClick={cancelEdit} className="h-11">
                    Cancel
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
