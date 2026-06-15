'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePrescriptions, useDeletePrescription } from '@/features/prescriptions/hooks';
import { downloadPrescriptionPDF } from '@/features/prescriptions/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Pagination } from '@/components/ui/pagination';
import { Plus, Search, Eye, Download } from 'lucide-react';

export default function PrescriptionsPage() {
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const params = { page: String(page), limit: '20', search };
  const { data, isLoading } = usePrescriptions(params);
  const deleteRx = useDeletePrescription();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Prescriptions</h1>
        <Link href="/prescriptions/new">
          <Button><Plus className="h-4 w-4 mr-2" />New Prescription</Button>
        </Link>
      </div>

      <Card>
        <CardHeader>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Search by Rx no or patient..." value={search} onChange={(e) => { setSearch(e.target.value); setPage(1); }} className="pl-10" />
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-2">{[1, 2, 3, 4].map((i) => <div key={i} className="h-12 bg-muted rounded animate-pulse" />)}</div>
          ) : data?.data.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <p className="text-lg mb-2">No prescriptions yet</p>
              <Link href="/prescriptions/new"><Button variant="outline">Create your first prescription</Button></Link>
            </div>
          ) : (
            <>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Rx No</TableHead>
                    <TableHead>Patient</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Diagnosis</TableHead>
                    <TableHead>Medicines</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {data?.data.map((rx: any) => (
                    <TableRow key={rx.id}>
                      <TableCell className="font-mono text-xs">{rx.prescriptionNo}</TableCell>
                      <TableCell className="font-medium">{rx.patient?.fullName}</TableCell>
                      <TableCell>{new Date(rx.createdAt).toLocaleDateString()}</TableCell>
                      <TableCell className="max-w-[150px] truncate">{rx.diagnosis || '-'}</TableCell>
                      <TableCell>{rx.medicines?.length || 0}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-1">
                          <Link href={`/prescriptions/${rx.id}`}>
                            <Button variant="ghost" size="icon"><Eye className="h-4 w-4" /></Button>
                          </Link>
                          <Button variant="ghost" size="icon" onClick={() => downloadPrescriptionPDF(rx.id)}>
                            <Download className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              <div className="px-4 py-3 border-t border-gray-100 dark:border-gray-800/50">
                <Pagination
                  page={page}
                  totalPages={data?.totalPages || 1}
                  total={data?.total}
                  onPageChange={setPage}
                />
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
