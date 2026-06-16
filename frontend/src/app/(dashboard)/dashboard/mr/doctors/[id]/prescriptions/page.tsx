'use client';

import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { api } from '@/lib/axios';
import { useDoctorPrescriptions, useMyDoctors } from '@/features/mr/hooks';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { SearchBar } from '@/components/admin/DataTable';
import { Pagination } from '@/components/ui/pagination';
import { ArrowLeft, FileText, Calendar, User, Download, Eye } from 'lucide-react';
import { formatDate } from '@/lib/utils';
import { toast } from 'sonner';

export default function DoctorPrescriptionsPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [datePreset, setDatePreset] = useState<'all' | 'today' | 'custom'>('all');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const { data: doctors } = useMyDoctors();

  const todayStr = new Date().toISOString().split('T')[0];
  const params: any = { page, search };
  if (datePreset === 'today') {
    params.dateFrom = todayStr;
    params.dateTo = todayStr;
  } else if (datePreset === 'custom' && dateFrom) {
    params.dateFrom = dateFrom;
    if (dateTo) params.dateTo = dateTo;
  }

  const { data, isLoading } = useDoctorPrescriptions(id, params);

  const doctor = doctors?.data?.find((d: any) => d.id === id);

  const handleDatePreset = (preset: 'all' | 'today' | 'custom') => {
    setDatePreset(preset);
    setPage(1);
    if (preset !== 'custom') { setDateFrom(''); setDateTo(''); }
  };

  const handleDownload = async (rxId: string) => {
    try {
      const response = await api.get(`/mr/doctors/${id}/prescriptions/${rxId}/pdf`, {
        responseType: 'blob',
      });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `prescription.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch {
      toast.error('Failed to download prescription');
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center gap-4">
        <Link href="/dashboard/mr" className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
          <ArrowLeft className="h-5 w-5 text-muted-foreground" />
        </Link>
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              {doctor?.fullName || 'Doctor'}
            </h1>
            {doctor?.degree && (
              <span className="text-sm text-muted-foreground">{doctor.degree}</span>
            )}
          </div>
          <p className="text-sm text-muted-foreground mt-1">
            {doctor?.clinicName} &middot; Prescriptions
          </p>
        </div>
      </div>

      <div className="flex items-center gap-3 flex-wrap">
        <div className="flex-1"><SearchBar value={search} onChange={(v) => { setSearch(v); setPage(1); }} /></div>
        <div className="flex items-center gap-1.5 bg-gray-100 dark:bg-gray-800 rounded-lg p-1">
          {(['all', 'today', 'custom'] as const).map((preset) => (
            <button
              key={preset}
              onClick={() => handleDatePreset(preset)}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
                datePreset === preset
                  ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm'
                  : 'text-muted-foreground hover:text-gray-900 dark:hover:text-white'
              }`}
            >
              {preset === 'all' ? 'All' : preset === 'today' ? 'Today' : 'Custom'}
            </button>
          ))}
        </div>
        {datePreset === 'custom' && (
          <div className="flex items-center gap-2">
            <input type="date" value={dateFrom} onChange={(e) => { setDateFrom(e.target.value); setPage(1); }} className="premium-input h-9 px-3 text-xs" />
            <span className="text-xs text-muted-foreground">to</span>
            <input type="date" value={dateTo} onChange={(e) => { setDateTo(e.target.value); setPage(1); }} className="premium-input h-9 px-3 text-xs" />
          </div>
        )}
      </div>

      {isLoading ? (
        <div className="space-y-3">{[1, 2, 3].map(i => <div key={i} className="h-12 bg-gray-200 dark:bg-gray-800 rounded-lg animate-pulse" />)}</div>
      ) : (
        <div className="premium-card-static overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Rx No</TableHead>
                <TableHead>Patient</TableHead>
                <TableHead>Diagnosis</TableHead>
                <TableHead>Medicines</TableHead>
                <TableHead>Date</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data?.data?.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center text-muted-foreground py-8">
                    <FileText className="h-8 w-8 mx-auto mb-2 opacity-50" />
                    No prescriptions found
                  </TableCell>
                </TableRow>
              ) : (
                data?.data?.map((rx: any) => (
                  <TableRow key={rx.id}>
                    <TableCell className="font-mono text-xs font-medium">{rx.prescriptionNo}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <User className="h-4 w-4 text-muted-foreground" />
                        <span>{rx.patient?.fullName}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className="text-sm">{rx.diagnosis || '—'}</span>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1">
                        {rx.medicines?.slice(0, 2).map((m: any) => (
                          <Badge key={m.id} variant="outline" className="text-xs">
                            {m.name}
                          </Badge>
                        ))}
                        {rx.medicines?.length > 2 && (
                          <Badge variant="secondary" className="text-xs">+{rx.medicines.length - 2}</Badge>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="text-xs text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {formatDate(rx.createdAt)}
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => router.push(`/dashboard/mr/doctors/${id}/prescriptions/${rx.id}`)}
                        >
                          <Eye className="h-3.5 w-3.5" />
                        </Button>
                        <Button variant="ghost" size="sm" onClick={() => handleDownload(rx.id)}>
                          <Download className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
          <div className="px-4 py-3 border-t border-gray-100 dark:border-gray-800/50">
            <Pagination page={page} totalPages={data?.totalPages || 1} total={data?.total} onPageChange={setPage} />
          </div>
        </div>
      )}
    </div>
  );
}
