'use client';

import { useState } from 'react';
import { useAdminDoctors, useClearDoctorMrAssignments } from '@/features/dashboard/hooks';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { SearchBar } from '@/components/admin/DataTable';
import { Pagination } from '@/components/ui/pagination';
import { ConfirmDialog } from '@/components/ui/confirm-dialog';
import { UserX } from 'lucide-react';

export default function AdminDoctorsPage() {
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [clearDoctorId, setClearDoctorId] = useState<string | null>(null);
  const { data, isLoading } = useAdminDoctors({ page, limit: 10, search });
  const clearMr = useClearDoctorMrAssignments();

  const selectedDoctor = data?.data?.find((d: any) => d.id === clearDoctorId);

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">All Doctors</h1>
        <p className="text-sm text-muted-foreground mt-1">Manage registered doctors</p>
      </div>

      <ConfirmDialog
        open={!!clearDoctorId}
        onOpenChange={(v) => !v && setClearDoctorId(null)}
        title="Clear MR Assignments"
        message={`Are you sure you want to remove all MR assignments for ${selectedDoctor?.fullName || 'this doctor'}? This will unassign all medical representatives from this doctor.`}
        confirmLabel="Clear All"
        variant="destructive"
        loading={clearMr.isPending}
        onConfirm={() => clearDoctorId && clearMr.mutate(clearDoctorId, { onSuccess: () => setClearDoctorId(null) })}
      />

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
                  <TableHead>Assigned MRs</TableHead>
                  <TableHead>Plan</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Patients</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data?.data?.length === 0 ? (
                  <TableRow><TableCell colSpan={8} className="text-center text-muted-foreground py-8">No doctors found</TableCell></TableRow>
                ) : (
                  data?.data?.map((doc: any) => {
                    const mrs = doc.mrAssignments || [];
                    return (
                      <TableRow key={doc.id}>
                        <TableCell className="font-medium">{doc.fullName}</TableCell>
                        <TableCell>{doc.user?.email}</TableCell>
                        <TableCell>{doc.clinicName}</TableCell>
                        <TableCell>
                          {mrs.length === 0 ? (
                            <span className="text-xs text-muted-foreground">None</span>
                          ) : (
                            <Badge variant="secondary">{mrs.length} MR{mrs.length > 1 ? 's' : ''}</Badge>
                          )}
                        </TableCell>
                        <TableCell><Badge variant={doc.subscription?.plan === 'PREMIUM' ? 'success' : 'secondary'}>{doc.subscription?.plan || 'FREE'}</Badge></TableCell>
                        <TableCell><Badge variant={doc.user?.isActive ? 'success' : 'destructive'}>{doc.user?.isActive ? 'Active' : 'Inactive'}</Badge></TableCell>
                        <TableCell>{doc._count?.patients || 0}</TableCell>
                        <TableCell>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-red-500 hover:text-red-600"
                            disabled={mrs.length === 0 || clearMr.isPending}
                            onClick={() => setClearDoctorId(doc.id)}
                          >
                            <UserX className="h-3.5 w-3.5 mr-1" /> Clear MR
                          </Button>
                        </TableCell>
                      </TableRow>
                    );
                  })
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