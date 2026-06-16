'use client';

import { useState } from 'react';
import { useRecAppointments, useCreateRecAppointment, useUpdateRecAppointment } from '@/features/receptionist/hooks';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { Pagination } from '@/components/ui/pagination';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, Calendar } from 'lucide-react';
import { toast } from 'sonner';
import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/axios';

const statusStyles: Record<string, string> = {
  SCHEDULED: 'badge-gradient-blue',
  COMPLETED: 'badge-gradient-green',
  CANCELLED: 'badge-gradient-purple',
  NO_SHOW: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300',
};

export default function RecAppointmentsPage() {
  const [page, setPage] = useState(1);
  const [open, setOpen] = useState(false);
  const [newApt, setNewApt] = useState({ patientId: '', date: '', time: '', notes: '' });

  const params = { page: String(page), limit: '15' };
  const { data, isLoading, refetch } = useRecAppointments(params);
  const createApt = useCreateRecAppointment();
  const updateApt = useUpdateRecAppointment();

  const { data: patients } = useQuery({
    queryKey: ['rec-patients-for-apt'],
    queryFn: () => api.get('/receptionist/patients', { params: { limit: '100' } }).then((r) => r.data.data),
  });

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createApt.mutateAsync(newApt);
      setOpen(false);
      setNewApt({ patientId: '', date: '', time: '', notes: '' });
    } catch {
      // handled by hook
    }
  };

  const updateStatus = (id: string, status: string) => {
    updateApt.mutate({ id, data: { status } });
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Appointments</h1>
          <p className="text-sm text-muted-foreground mt-1">Manage the schedule</p>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button className="h-10 rounded-xl gradient-primary hover:opacity-90 text-white shadow-glow">
              <Plus className="h-4 w-4 mr-2" />New Appointment
            </Button>
          </DialogTrigger>
          <DialogContent className="rounded-2xl">
            <DialogHeader>
              <DialogTitle className="text-lg font-semibold">Schedule Appointment</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleCreate} className="space-y-4">
              <div className="space-y-2">
                <Label>Patient</Label>
                <Select value={newApt.patientId} onValueChange={(v) => setNewApt({ ...newApt, patientId: v })}>
                  <SelectTrigger className="rounded-xl"><SelectValue placeholder="Select patient" /></SelectTrigger>
                  <SelectContent>
                    {patients?.map((p: any) => (
                      <SelectItem key={p.id} value={p.id}>{p.fullName}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Date</Label>
                  <Input type="date" value={newApt.date} onChange={(e) => setNewApt({ ...newApt, date: e.target.value })} required className="rounded-xl" />
                </div>
                <div className="space-y-2">
                  <Label>Time</Label>
                  <Input type="time" value={newApt.time} onChange={(e) => setNewApt({ ...newApt, time: e.target.value })} required className="rounded-xl" />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Notes</Label>
                <Input value={newApt.notes} onChange={(e) => setNewApt({ ...newApt, notes: e.target.value })} className="rounded-xl" />
              </div>
              <Button type="submit" disabled={createApt.isPending} className="w-full rounded-xl gradient-primary text-white">
                {createApt.isPending ? 'Scheduling...' : 'Schedule'}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Card className="premium-card overflow-hidden">
        <CardContent className="p-0">
          {isLoading ? (
            <div className="p-6 space-y-3">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="h-14 bg-gray-100 dark:bg-gray-800/50 rounded-lg animate-pulse" />
              ))}
            </div>
          ) : data?.data.length === 0 ? (
            <div className="text-center py-16 px-6">
              <div className="w-16 h-16 rounded-2xl bg-gray-100 dark:bg-gray-800 flex items-center justify-center mx-auto mb-4">
                <Calendar className="h-8 w-8 text-muted-foreground" />
              </div>
              <p className="text-lg font-medium text-gray-900 dark:text-white mb-1">No appointments</p>
              <p className="text-sm text-muted-foreground mb-4">Schedule the first appointment</p>
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="premium-table">
                  <thead>
                    <tr>
                      <th>Patient</th>
                      <th>Date</th>
                      <th>Time</th>
                      <th>Status</th>
                      <th>Notes</th>
                      <th className="text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data?.data.map((apt) => (
                      <tr key={apt.id}>
                        <td className="font-medium text-gray-900 dark:text-white">{apt.patient?.fullName}</td>
                        <td>{new Date(apt.date).toLocaleDateString()}</td>
                        <td className="font-mono text-sm">{apt.time}</td>
                        <td><span className={statusStyles[apt.status] || 'badge-gradient-blue'}>{apt.status}</span></td>
                        <td className="text-muted-foreground max-w-[120px] truncate">{apt.notes || '-'}</td>
                        <td className="text-right">
                          {apt.status === 'SCHEDULED' && (
                            <div className="flex justify-end gap-1">
                              <Button variant="ghost" size="sm" onClick={() => updateStatus(apt.id, 'COMPLETED')} className="text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50 dark:hover:bg-emerald-950/30 rounded-lg text-xs">
                                Complete
                              </Button>
                              <Button variant="ghost" size="sm" onClick={() => updateStatus(apt.id, 'CANCELLED')} className="text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30 rounded-lg text-xs">
                                Cancel
                              </Button>
                            </div>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="px-4 py-3 border-t border-gray-100 dark:border-gray-800/50">
                <Pagination page={page} totalPages={data?.totalPages || 1} total={data?.total} onPageChange={setPage} />
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
