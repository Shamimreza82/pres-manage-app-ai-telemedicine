'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { api } from '@/lib/axios';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { Pagination } from '@/components/ui/pagination';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, Calendar, Search, X, Filter, MoreHorizontal, CheckCircle, XCircle, User, AlertTriangle, Clock } from 'lucide-react';

const statusStyles: Record<string, string> = {
  SCHEDULED: 'badge-gradient-blue',
  COMPLETED: 'badge-gradient-green',
  CANCELLED: 'badge-gradient-purple',
  NO_SHOW: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300',
};

export default function AppointmentsPage() {
  const router = useRouter();
  const [appointments, setAppointments] = useState<any[]>([]);
  const [patients, setPatients] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [open, setOpen] = useState(false);
  const [newApt, setNewApt] = useState({ patientId: '', date: '', time: '', notes: '' });
  const [patientSearch, setPatientSearch] = useState('');
  const [showPatientResults, setShowPatientResults] = useState(false);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [showDateFilter, setShowDateFilter] = useState(false);
  const [doctorSchedule, setDoctorSchedule] = useState<any[]>([]);
  const [editingApt, setEditingApt] = useState<any | null>(null);
  const [editForm, setEditForm] = useState({ patientId: '', date: '', time: '', notes: '' });
  const [menuTarget, setMenuTarget] = useState<{ id: string; top: number; right: number } | null>(null);

  const DAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

  const fmtTime = (t: string) => {
    if (!t) return '';
    const [h, m] = t.split(':');
    const hh = Number(h);
    return `${hh % 12 || 12}:${m} ${hh < 12 ? 'AM' : 'PM'}`;
  };

  const getSlotForDate = (dateStr: string) => {
    if (!dateStr) return null;
    const dayName = DAYS[new Date(dateStr).getDay()];
    return doctorSchedule.find((s: any) => s.day === dayName) || null;
  };

  const isTimeInSlot = (dateStr: string, time: string) => {
    const slot = getSlotForDate(dateStr);
    if (!slot) return false;
    return time >= slot.startTime && time <= slot.endTime;
  };

  const getAvailabilityMsg = (dateStr: string, time: string) => {
    if (!dateStr) return null;
    const slot = getSlotForDate(dateStr);
    if (!slot) return { type: 'closed' as const, msg: 'Doctor is not available on this day' };
    if (!time) return { type: 'info' as const, msg: `Available: ${fmtTime(slot.startTime)} — ${fmtTime(slot.endTime)}` };
    if (!isTimeInSlot(dateStr, time)) return { type: 'warning' as const, msg: `Doctor is unavailable at this time. Available: ${fmtTime(slot.startTime)} — ${fmtTime(slot.endTime)}` };
    return null;
  };

  const buildParams = (p: number) => {
    const params: Record<string, string> = { page: String(p), limit: '15' };
    if (search) params.search = search;
    if (statusFilter !== 'ALL') params.status = statusFilter;
    if (dateFrom) params.dateFrom = dateFrom;
    if (dateTo) params.dateTo = dateTo;
    return params;
  };

  const load = async (p: number) => {
    setLoading(true);
    try {
      const { data } = await api.get('/appointments', { params: buildParams(p) });
      setAppointments(data.data);
      setTotalPages(data.totalPages);
      setTotal(data.total);
      setPage(data.page);
    } catch {
      toast.error('Failed to load appointments');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(page) }, [page, search, statusFilter, dateFrom, dateTo]);

  const clearFilters = () => {
    setSearch('');
    setDateFrom('');
    setDateTo('');
    setStatusFilter('ALL');
    setPage(1);
  };

  const hasFilters = search || dateFrom || dateTo || statusFilter !== 'ALL';

  const openCreate = async () => {
    setOpen(true);
    setNewApt({ patientId: '', date: '', time: '', notes: '' });
    setPatientSearch('');
    try {
      const [patRes, docRes] = await Promise.all([
        api.get('/patients', { params: { limit: 100 } }),
        api.get('/doctors/profile'),
      ]);
      setPatients(patRes.data.data);
      let s = docRes.data.data.chamberSchedule;
      if (!s || typeof s === 'string') {
        try { s = JSON.parse(s || '[]'); } catch { s = []; }
      }
      setDoctorSchedule(s);
    } catch (e) { console.error(e); }
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post('/appointments', newApt);
      toast.success('Appointment scheduled');
      setOpen(false);
      setNewApt({ patientId: '', date: '', time: '', notes: '' });
      load(1);
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed');
    }
  };

  const updateStatus = async (id: string, status: string) => {
    try {
      await api.patch(`/appointments/${id}`, { status });
      load(page);
      toast.success(`Appointment ${status.toLowerCase()}`);
    } catch (e) { console.error(e); }
  };

  const openEdit = async (apt: any) => {
    setEditingApt(apt);
    setEditForm({
      patientId: apt.patientId || apt.patient?.id || '',
      date: apt.date ? apt.date.split('T')[0] : '',
      time: apt.time || '',
      notes: apt.notes || '',
    });
    if (patients.length === 0) {
      try {
        const { data } = await api.get('/patients', { params: { limit: 100 } });
        setPatients(data.data);
      } catch (e) { console.error(e); }
    }
  };

  const handleEditSave = async () => {
    if (!editingApt) return;
    try {
      await api.patch(`/appointments/${editingApt.id}`, {
        patientId: editForm.patientId,
        date: editForm.date,
        time: editForm.time,
        notes: editForm.notes,
      });
      toast.success('Appointment updated');
      setEditingApt(null);
      load(page);
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed');
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Appointments</h1>
          <p className="text-sm text-muted-foreground mt-1">Manage your schedule</p>
        </div>
        <div className="flex items-center gap-2">
          <Button onClick={() => router.push('/appointments/schedule')} variant="outline" className="h-10 rounded-xl border-gray-200 dark:border-gray-700">
            <Calendar className="h-4 w-4 mr-2" />Doctor Schedule
          </Button>
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button onClick={openCreate} className="h-10 rounded-xl gradient-primary hover:opacity-90 text-white shadow-glow">
                <Plus className="h-4 w-4 mr-2" />New Appointment
              </Button>
            </DialogTrigger>
          <DialogContent className="rounded-2xl">
            <DialogHeader>
              <DialogTitle className="text-lg font-semibold">Schedule Appointment</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleCreate} className="space-y-4">
              <div className="space-y-2">
                <Label>Patient <span className="text-red-500">*</span></Label>
                <div className="relative">
                  <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <input
                    placeholder="Search Patient..."
                    value={newApt.patientId ? patients.find(p => p.id === newApt.patientId)?.fullName || patientSearch : patientSearch}
                    onChange={(e) => { setPatientSearch(e.target.value); setShowPatientResults(true); if (newApt.patientId) setNewApt({ ...newApt, patientId: '' }); }}
                    onFocus={() => setShowPatientResults(true)}
                    className="w-full h-10 pl-10 pr-4 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-950 text-sm focus:ring-2 focus:ring-teal-500/30 focus:outline-none placeholder:text-gray-400"
                  />
                  {newApt.patientId && (
                    <button onClick={() => { setNewApt({ ...newApt, patientId: '' }); setPatientSearch(''); }} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                      <X className="h-4 w-4" />
                    </button>
                  )}
                  {showPatientResults && (
                    <>
                      <div className="fixed inset-0 z-10" onClick={() => setShowPatientResults(false)} />
                      <div className="absolute top-full mt-1 left-0 right-0 z-20 max-h-56 overflow-y-auto rounded-xl bg-white dark:bg-gray-950 border border-gray-100 dark:border-gray-800 shadow-xl animate-fade-in">
                        {patients.filter((p) =>
                          !patientSearch ||
                          p.fullName?.toLowerCase().includes(patientSearch.toLowerCase()) ||
                          p.patientId?.toLowerCase().includes(patientSearch.toLowerCase()) ||
                          (p.phone && p.phone.includes(patientSearch))
                        ).length === 0 ? (
                          <p className="text-sm text-gray-400 text-center py-4">No patients found</p>
                        ) : (
                          patients.filter((p) =>
                            !patientSearch ||
                            p.fullName?.toLowerCase().includes(patientSearch.toLowerCase()) ||
                            p.patientId?.toLowerCase().includes(patientSearch.toLowerCase()) ||
                            (p.phone && p.phone.includes(patientSearch))
                          ).map((p) => (
                            <button
                              key={p.id}
                              type="button"
                              onClick={() => { setNewApt({ ...newApt, patientId: p.id }); setPatientSearch(p.fullName); setShowPatientResults(false); }}
                              className="w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors text-left"
                            >
                              <User className="h-4 w-4 text-muted-foreground shrink-0" />
                              <div className="min-w-0 flex-1">
                                <p className="text-sm font-medium text-gray-900 dark:text-white truncate">{p.fullName}</p>
                                <p className="text-xs text-muted-foreground truncate">{p.patientId}{p.phone ? ` · ${p.phone}` : ''}</p>
                              </div>
                            </button>
                          ))
                        )}
                      </div>
                    </>
                  )}
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Date <span className="text-red-500">*</span></Label>
                  <Input type="date" value={newApt.date} onChange={(e) => setNewApt({ ...newApt, date: e.target.value })} required className="rounded-xl" />
                </div>
                <div className="space-y-2">
                  <Label>Time <span className="text-red-500">*</span></Label>
                  <Input type="time" value={newApt.time} onChange={(e) => setNewApt({ ...newApt, time: e.target.value })} required className="rounded-xl" />
                </div>
              </div>
              {(() => {
                const msg = getAvailabilityMsg(newApt.date, newApt.time);
                if (!msg) return null;
                return (
                  <div className={`flex items-start gap-2.5 p-3 rounded-xl text-sm ${
                    msg.type === 'closed' ? 'bg-red-50 dark:bg-red-950/20 text-red-700 dark:text-red-400 border border-red-100 dark:border-red-800' :
                    msg.type === 'warning' ? 'bg-amber-50 dark:bg-amber-950/20 text-amber-700 dark:text-amber-400 border border-amber-100 dark:border-amber-800' :
                    'bg-blue-50 dark:bg-blue-950/20 text-blue-700 dark:text-blue-400 border border-blue-100 dark:border-blue-800'
                  }`}>
                    <AlertTriangle className={`h-4 w-4 shrink-0 mt-0.5 ${
                      msg.type === 'closed' ? 'text-red-500' :
                      msg.type === 'warning' ? 'text-amber-500' :
                      'text-blue-500'
                    }`} />
                    <span className="text-xs font-medium">{msg.msg}</span>
                  </div>
                );
              })()}
              <div className="space-y-2">
                <Label>Notes</Label>
                <Input value={newApt.notes} onChange={(e) => setNewApt({ ...newApt, notes: e.target.value })} className="rounded-xl" />
              </div>
              <Button type="submit" disabled={!!(newApt.date && newApt.time && !isTimeInSlot(newApt.date, newApt.time))} className="w-full rounded-xl gradient-primary text-white">Schedule</Button>
            </form>
          </DialogContent>
        </Dialog>

        {/* Edit Appointment Dialog */}
        <Dialog open={!!editingApt} onOpenChange={(v) => { if (!v) setEditingApt(null); }}>
          <DialogContent className="rounded-2xl">
            <DialogHeader>
              <DialogTitle className="text-lg font-semibold">Edit Appointment</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Patient <span className="text-red-500">*</span></Label>
                <select
                  value={editForm.patientId}
                  onChange={(e) => setEditForm({ ...editForm, patientId: e.target.value })}
                  className="w-full h-10 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-950 px-3 text-sm focus:ring-2 focus:ring-teal-500/30 focus:outline-none"
                >
                  <option value="">Select patient</option>
                  {patients.map((p: any) => (
                    <option key={p.id} value={p.id}>{p.fullName} ({p.patientId})</option>
                  ))}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Date <span className="text-red-500">*</span></Label>
                  <Input type="date" value={editForm.date} onChange={(e) => setEditForm({ ...editForm, date: e.target.value })} required className="rounded-xl" />
                </div>
                <div className="space-y-2">
                  <Label>Time <span className="text-red-500">*</span></Label>
                  <Input type="time" value={editForm.time} onChange={(e) => setEditForm({ ...editForm, time: e.target.value })} required className="rounded-xl" />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Notes</Label>
                <Input value={editForm.notes} onChange={(e) => setEditForm({ ...editForm, notes: e.target.value })} className="rounded-xl" />
              </div>
              <div className="flex gap-2">
                <Button variant="outline" onClick={() => setEditingApt(null)} className="flex-1 rounded-xl">Cancel</Button>
                <Button onClick={handleEditSave} className="flex-1 rounded-xl gradient-primary text-white">Save</Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
        </div>
      </div>

      {/* Search & Filters */}
      <div className="flex items-start gap-3 flex-wrap">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by name, phone or ID..."
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            className="pl-10 h-10 premium-input"
          />
          {search && (
            <button onClick={() => setSearch('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              const today = new Date().toISOString().split('T')[0];
              setDateFrom(today);
              setDateTo(today);
              setPage(1);
            }}
            className={`h-10 px-4 rounded-xl text-sm font-medium border flex items-center gap-2 transition-all ${
              dateFrom && dateFrom === dateTo && dateFrom === new Date().toISOString().split('T')[0]
                ? 'bg-teal-50 dark:bg-teal-950/30 border-teal-300 dark:border-teal-700 text-teal-700 dark:text-teal-300'
                : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-950 text-gray-600 dark:text-gray-400 hover:border-amber-300 dark:hover:border-amber-700'
            }`}
          >
            <Calendar className="h-4 w-4" />
            Today
          </button>
          <div className="relative">
            <button
              onClick={() => setShowDateFilter(!showDateFilter)}
              className="h-10 px-4 rounded-xl text-sm font-medium border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-950 text-gray-600 dark:text-gray-400 hover:border-amber-300 dark:hover:border-amber-700 flex items-center gap-2 transition-all"
            >
              <Filter className="h-4 w-4" />
              {dateFrom || dateTo ? 'Date: Set' : 'Date Filter'}
            </button>
            {showDateFilter && (
              <div className="absolute top-full mt-2 right-0 z-30 p-4 rounded-xl bg-white dark:bg-gray-950 border border-gray-100 dark:border-gray-800 shadow-strong animate-scale-in">
                <div className="flex items-center gap-3">
                  <div className="space-y-1">
                    <Label className="text-xs text-muted-foreground">From</Label>
                    <Input type="date" value={dateFrom} onChange={(e) => { setDateFrom(e.target.value); setPage(1); }} className="h-9 premium-input text-sm w-36" />
                  </div>
                  <span className="text-muted-foreground mt-5">—</span>
                  <div className="space-y-1">
                    <Label className="text-xs text-muted-foreground">To</Label>
                    <Input type="date" value={dateTo} onChange={(e) => { setDateTo(e.target.value); setPage(1); }} className="h-9 premium-input text-sm w-36" />
                  </div>
                </div>
              </div>
            )}
          </div>
          <Select value={statusFilter} onValueChange={(v) => { setStatusFilter(v); setPage(1); }}>
            <SelectTrigger className="w-36 h-10 rounded-xl text-sm">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">All Status</SelectItem>
              <SelectItem value="SCHEDULED">Scheduled</SelectItem>
              <SelectItem value="COMPLETED">Completed</SelectItem>
              <SelectItem value="CANCELLED">Cancelled</SelectItem>
              <SelectItem value="NO_SHOW">No Show</SelectItem>
            </SelectContent>
          </Select>
          {hasFilters && (
            <Button variant="ghost" size="sm" onClick={clearFilters} className="h-10 shrink-0 text-muted-foreground">
              <X className="h-4 w-4 mr-1" /> Clear
            </Button>
          )}
        </div>
      </div>

      <Card className="premium-card overflow-hidden">
        <CardContent className="p-0">
          {loading ? (
            <div className="p-6 space-y-3">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="h-14 bg-gray-100 dark:bg-gray-800/50 rounded-lg animate-pulse" />
              ))}
            </div>
          ) : appointments.length === 0 ? (
            <div className="text-center py-16 px-6">
              <div className="w-16 h-16 rounded-2xl bg-gray-100 dark:bg-gray-800 flex items-center justify-center mx-auto mb-4">
                <Calendar className="h-8 w-8 text-muted-foreground" />
              </div>
              <p className="text-lg font-medium text-gray-900 dark:text-white mb-1">
                {hasFilters ? 'No matching appointments' : 'No appointments'}
              </p>
              <p className="text-sm text-muted-foreground mb-4">
                {hasFilters ? 'Try adjusting your search or filters' : 'Schedule your first appointment'}
              </p>
              {hasFilters ? (
                <Button variant="outline" onClick={clearFilters}>Clear Filters</Button>
              ) : (
                <Button variant="outline" onClick={() => openCreate()}>Schedule Appointment</Button>
              )}
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="premium-table">
                  <thead>
                    <tr>
                      <th className="text-center">#</th>
                      <th>Patient</th>
                      <th>Patient ID</th>
                      <th>Phone</th>
                      <th>Date</th>
                      <th>Time</th>
                      <th>Status</th>
                      <th>Notes</th>
                      <th className="text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {appointments.map((apt: any, i: number) => (
                      <tr key={apt.id} className="group">
                        <td className="text-center font-bold text-gray-700 dark:text-gray-300 text-sm">{apt.serialNo || '—'}</td>
                        <td className="font-medium text-gray-900 dark:text-white">{apt.patient?.fullName}</td>
                        <td className="font-mono text-xs text-muted-foreground">{apt.patient?.patientId || '—'}</td>
                        <td className="text-muted-foreground">{apt.patient?.phone || '—'}</td>
                        <td>{new Date(apt.date).toLocaleDateString()}</td>
                        <td className="font-mono text-sm">{(() => { const [h, m] = apt.time.split(':'); const hh = Number(h); return `${hh % 12 || 12}:${m} ${hh < 12 ? 'AM' : 'PM'}`; })()}</td>
                        <td>
                          <span className={statusStyles[apt.status]}>{apt.status}</span>
                        </td>
                        <td className="text-muted-foreground max-w-[120px] truncate">{apt.notes || '-'}</td>
                        <td className="text-right">
                          <div className="inline-block">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
                                setMenuTarget(menuTarget?.id === apt.id ? null : { id: apt.id, top: rect.bottom + 4, right: window.innerWidth - rect.right });
                              }}
                              className="p-1.5 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                            >
                              <MoreHorizontal className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="px-4 py-3 border-t border-gray-100 dark:border-gray-800/50">
                <Pagination page={page} totalPages={totalPages} total={total} onPageChange={setPage} />
              </div>
            </>
          )}
        </CardContent>
      </Card>

      {/* Actions Dropdown */}
      {menuTarget && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setMenuTarget(null)} />
          <div
            className="fixed z-50 w-44 rounded-xl bg-white dark:bg-gray-950 border border-gray-100 dark:border-gray-800 shadow-strong py-1.5 animate-scale-in"
            style={{ top: menuTarget.top, right: menuTarget.right }}
          >
              {(() => {
                const apt = appointments.find((a: any) => a.id === menuTarget.id);
                if (!apt) return null;
                return (
                  <>
                    <div className="px-4 py-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider border-b border-gray-100 dark:border-gray-800 mb-1">
                      Change Status
                    </div>
                    {apt.status !== 'COMPLETED' && (
                      <button onClick={() => { updateStatus(apt.id, 'COMPLETED'); setMenuTarget(null); }} className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                        <CheckCircle className="h-4 w-4 text-emerald-500" /> Mark Completed
                      </button>
                    )}
                    {apt.status !== 'CANCELLED' && (
                      <button onClick={() => { updateStatus(apt.id, 'CANCELLED'); setMenuTarget(null); }} className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                        <XCircle className="h-4 w-4 text-red-500" /> Cancel Appointment
                      </button>
                    )}
                    {apt.status !== 'NO_SHOW' && (
                      <button onClick={() => { updateStatus(apt.id, 'NO_SHOW'); setMenuTarget(null); }} className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                        <XCircle className="h-4 w-4 text-amber-500" /> Mark No Show
                      </button>
                    )}
                    <div className="border-t border-gray-100 dark:border-gray-800 mt-1 pt-1">
                      <button onClick={() => { openEdit(apt); setMenuTarget(null); }} className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                        <svg className="w-4 h-4 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                        Edit Appointment
                      </button>
                    </div>
                  </>
                );
              })()}
          </div>
        </>
      )}
    </div>
  );
}
