'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRecPrescriptions } from '@/features/receptionist/hooks';
import { downloadPrescriptionPDF } from '@/features/receptionist/api';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { SearchBar } from '@/components/admin/DataTable';
import { Pagination } from '@/components/ui/pagination';
import { FileText, User, Download, Eye, Calendar } from 'lucide-react';
import { formatDate } from '@/lib/utils';
import { toast } from 'sonner';

export default function RecPrescriptionsPage() {
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const params: any = { page, limit: '20', search };
  const { data, isLoading } = useRecPrescriptions(params);

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Prescriptions</h1>
          <p className="text-sm text-muted-foreground mt-1">View prescription records</p>
        </div>
        <div className="w-full max-w-sm">
          <SearchBar value={search} onChange={(v) => { setSearch(v); setPage(1); }} />
        </div>
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
                      <span className="text-sm">{rx.diagnosis || '\u2014'}</span>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1">
                        {rx.medicines?.slice(0, 2).map((m: any) => (
                          <Badge key={m.id} variant="outline" className="text-xs">{m.name}</Badge>
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
                        <Link href={`/dashboard/receptionist/prescriptions/${rx.id}`}>
                          <Button variant="ghost" size="sm">
                            <Eye className="h-3.5 w-3.5" />
                          </Button>
                        </Link>
                        <Button variant="ghost" size="sm" onClick={() => downloadPrescriptionPDF(rx.id)}>
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
