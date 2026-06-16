'use client';

import { useState } from 'react';
import { useAdminSubscriptions } from '@/features/dashboard/hooks';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { SearchBar } from '@/components/admin/DataTable';
import { Pagination } from '@/components/ui/pagination';

export default function AdminSubscriptionsPage() {
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const { data, isLoading } = useAdminSubscriptions({ page, limit: 10, search });

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">All Subscriptions</h1>
        <p className="text-sm text-muted-foreground mt-1">Manage doctor subscription plans</p>
      </div>
      <SearchBar value={search} onChange={(v) => { setSearch(v); setPage(1); }} />
      {isLoading ? (
        <div className="space-y-3">{[1, 2, 3].map(i => <div key={i} className="h-12 bg-gray-200 dark:bg-gray-800 rounded-lg animate-pulse" />)}</div>
      ) : (
        <>
          <div className="premium-card-static overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Doctor</TableHead>
                  <TableHead>Clinic</TableHead>
                  <TableHead>Plan</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Patient Limit</TableHead>
                  <TableHead>Rx Limit</TableHead>
                  <TableHead>Start Date</TableHead>
                  <TableHead>End Date</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data?.data?.length === 0 ? (
                  <TableRow><TableCell colSpan={8} className="text-center text-muted-foreground py-8">No subscriptions found</TableCell></TableRow>
                ) : (
                  data?.data?.map((sub: any) => (
                    <TableRow key={sub.id}>
                      <TableCell className="font-medium">{sub.doctor?.fullName}</TableCell>
                      <TableCell>{sub.doctor?.clinicName}</TableCell>
                      <TableCell><Badge variant={sub.plan === 'PREMIUM' ? 'success' : 'secondary'}>{sub.plan}</Badge></TableCell>
                      <TableCell><Badge variant={sub.status === 'ACTIVE' ? 'success' : sub.status === 'EXPIRED' ? 'destructive' : 'warning'}>{sub.status}</Badge></TableCell>
                      <TableCell>{sub.patientLimit}</TableCell>
                      <TableCell>{sub.prescriptionLimit}</TableCell>
                      <TableCell className="text-xs text-muted-foreground">{new Date(sub.startDate).toLocaleDateString()}</TableCell>
                      <TableCell className="text-xs text-muted-foreground">{sub.endDate ? new Date(sub.endDate).toLocaleDateString() : '—'}</TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
            <div className="px-4 py-3 border-t border-gray-100 dark:border-gray-800/50">
              <Pagination page={page} totalPages={data?.totalPages || 1} total={data?.total} onPageChange={setPage} />
            </div>
          </div>
        </>
      )}
    </div>
  );
}