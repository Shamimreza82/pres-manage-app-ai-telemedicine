'use client';

import { useState } from 'react';
import { useAdminDoctors } from '@/features/dashboard/hooks';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { SearchBar } from '@/components/admin/DataTable';
import { Pagination } from '@/components/ui/pagination';

export default function AdminDoctorsPage() {
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const { data, isLoading } = useAdminDoctors({ page, limit: 10, search });

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">All Doctors</h1>
        <p className="text-sm text-muted-foreground mt-1">Manage registered doctors</p>
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
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Clinic</TableHead>
                  <TableHead>Plan</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Patients</TableHead>
                  <TableHead>Joined</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data?.data?.length === 0 ? (
                  <TableRow><TableCell colSpan={7} className="text-center text-muted-foreground py-8">No doctors found</TableCell></TableRow>
                ) : (
                  data?.data?.map((doc: any) => (
                    <TableRow key={doc.id}>
                      <TableCell className="font-medium">{doc.fullName}</TableCell>
                      <TableCell>{doc.user?.email}</TableCell>
                      <TableCell>{doc.clinicName}</TableCell>
                      <TableCell><Badge variant={doc.subscription?.plan === 'PREMIUM' ? 'success' : 'secondary'}>{doc.subscription?.plan || 'FREE'}</Badge></TableCell>
                      <TableCell><Badge variant={doc.user?.isActive ? 'success' : 'destructive'}>{doc.user?.isActive ? 'Active' : 'Inactive'}</Badge></TableCell>
                      <TableCell>{doc._count?.patients || 0}</TableCell>
                      <TableCell className="text-muted-foreground text-xs">{new Date(doc.createdAt).toLocaleDateString()}</TableCell>
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