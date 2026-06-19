'use client';

import { useState } from 'react';
import { useMyProfile } from '@/features/mr/hooks';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { api } from '@/lib/axios';
import { toast } from 'sonner';
import { User, Mail, Phone, Building2, Briefcase, BadgeInfo, Pencil } from 'lucide-react';

const fields = [
  { key: 'fullName', label: 'Full Name', icon: User },
  { key: 'email', label: 'Email', icon: Mail },
  { key: 'phone', label: 'Phone', icon: Phone },
  { key: 'company', label: 'Company', icon: Building2 },
  { key: 'department', label: 'Department', icon: Briefcase },
  { key: 'designation', label: 'Designation', icon: BadgeInfo },
];

export default function MrProfilePage() {
  const { data: profile, isLoading, refetch } = useMyProfile();
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState<any>({});

  const openEdit = () => {
    setForm({
      fullName: profile?.fullName || '',
      phone: profile?.phone || '',
      company: profile?.company || '',
      department: profile?.department || '',
      designation: profile?.designation || '',
    });
    setEditing(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = Object.fromEntries(
        Object.entries(form).filter(([_, v]) => v !== '')
      );
      await api.put('/mr/my-profile', payload);
      toast.success('Profile updated');
      setEditing(false);
      refetch();
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6 animate-fade-in">
        <div className="h-32 bg-gray-200 dark:bg-gray-800 rounded-xl animate-pulse" />
        <div className="h-64 bg-gray-200 dark:bg-gray-800 rounded-xl animate-pulse" />
      </div>
    );
  }

  const initials = (profile?.fullName || '')
    .split(' ')
    .map((n: string) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  const getValue = (key: string) => {
    if (key === 'email') return profile?.user?.email;
    return profile?.[key];
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-full bg-gradient-to-br from-rose-500 to-rose-600 flex items-center justify-center text-white font-bold text-lg shadow-md">
            {initials}
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-900 dark:text-white">{profile?.fullName}</h1>
            <p className="text-sm text-muted-foreground">{profile?.company}{profile?.designation ? ` · ${profile.designation}` : ''}</p>
          </div>
        </div>
        <Button variant="outline" size="sm" onClick={openEdit}>
          <Pencil className="h-4 w-4 mr-2" />
          Edit
        </Button>
      </div>

      {/* Info Card */}
      <Card>
        <CardContent className="p-6">
          <div className="grid gap-6 sm:grid-cols-2">
            {fields.map(({ key, label, icon: Icon }) => (
              <div key={key} className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-rose-50 dark:bg-rose-950/30 flex items-center justify-center shrink-0">
                  <Icon className="h-4 w-4 text-rose-600 dark:text-rose-400" />
                </div>
                <div className="min-w-0">
                  <p className="text-xs text-muted-foreground">{label}</p>
                  <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                    {getValue(key) || '—'}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Edit Modal */}
      <Dialog open={editing} onOpenChange={setEditing}>
        <DialogContent className="rounded-2xl">
          <DialogHeader>
            <DialogTitle className="text-lg font-semibold">Edit Profile</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            {['fullName', 'phone', 'company', 'department', 'designation'].map((field) => (
              <div key={field} className="space-y-1.5">
                <Label className="text-sm font-medium capitalize">{field.replace(/([A-Z])/g, ' $1')}</Label>
                <Input
                  value={form[field] || ''}
                  onChange={(e) => setForm({ ...form, [field]: e.target.value })}
                  className="h-10 rounded-xl"
                />
              </div>
            ))}
            <div className="flex items-center gap-3 pt-2">
              <Button type="submit" disabled={saving} className="flex-1 rounded-xl bg-rose-600 hover:bg-rose-700 text-white">
                {saving ? 'Saving...' : 'Save Changes'}
              </Button>
              <Button type="button" variant="outline" onClick={() => setEditing(false)} className="flex-1 rounded-xl">
                Cancel
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
