'use client';

import { useState } from 'react';
import { useAdminUsers, useToggleUserStatus } from '@/features/dashboard/hooks';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { SearchBar } from '@/components/admin/DataTable';
import { Pagination } from '@/components/ui/pagination';
import { ConfirmDialog } from '@/components/ui/confirm-dialog';

export default function AdminUsersPage() {
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const { data, isLoading } = useAdminUsers({ page, limit: 10, search });
  const toggleStatus = useToggleUserStatus();
  const [toggleTarget, setToggleTarget] = useState<{ id: string; email: string; isActive: boolean } | null>(null);

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">All Users</h1>
        <p className="text-sm text-muted-foreground mt-1">Manage platform users</p>
      </div>

      <ConfirmDialog
        open={!!toggleTarget}
        onOpenChange={(v) => { if (!v) setToggleTarget(null); }}
        title={toggleTarget?.isActive ? 'Deactivate User' : 'Activate User'}
        message={`Are you sure you want to ${toggleTarget?.isActive ? 'deactivate' : 'activate'} "${toggleTarget?.email}"? ${toggleTarget?.isActive ? 'They will not be able to log in.' : ''}`}
        confirmLabel={toggleTarget?.isActive ? 'Deactivate' : 'Activate'}
        variant={toggleTarget?.isActive ? 'destructive' : 'default'}
        loading={toggleStatus.isPending}
        onConfirm={() => {
          if (toggleTarget) {
            toggleStatus.mutate(toggleTarget.id, { onSuccess: () => setToggleTarget(null) });
          }
        }}
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
                  <TableHead>Email</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Verified</TableHead>
                  <TableHead>Doctor Profile</TableHead>
                  <TableHead>Joined</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data?.data?.length === 0 ? (
                  <TableRow><TableCell colSpan={7} className="text-center text-muted-foreground py-8">No users found</TableCell></TableRow>
                ) : (
                  data?.data?.map((user: any) => (
                    <TableRow key={user.id}>
                      <TableCell className="font-medium">{user.email}</TableCell>
                      <TableCell><Badge variant={user.role === 'SUPER_ADMIN' ? 'warning' : user.role === 'DOCTOR' ? 'success' : 'secondary'}>{user.role.replace('_', ' ')}</Badge></TableCell>
                      <TableCell><Badge variant={user.isActive ? 'success' : 'destructive'}>{user.isActive ? 'Active' : 'Inactive'}</Badge></TableCell>
                      <TableCell><Badge variant={user.isVerified ? 'success' : 'secondary'}>{user.isVerified ? 'Yes' : 'No'}</Badge></TableCell>
                      <TableCell>{user.doctor?.fullName || '—'}</TableCell>
                      <TableCell className="text-muted-foreground text-xs">{new Date(user.createdAt).toLocaleDateString()}</TableCell>
                      <TableCell className="text-right">
                        {user.role !== 'SUPER_ADMIN' && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setToggleTarget({ id: user.id, email: user.email, isActive: user.isActive })}
                          >
                            {user.isActive ? 'Deactivate' : 'Activate'}
                          </Button>
                        )}
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
        </>
      )}
    </div>
  );
}