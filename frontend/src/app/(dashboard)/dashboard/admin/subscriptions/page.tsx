'use client';

import { useState } from 'react';
import { useAdminSubscriptions } from '@/features/dashboard/hooks';
import { useCancelSubscription, usePlans } from '@/features/plans/hooks';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ConfirmDialog } from '@/components/ui/confirm-dialog';
import { FilterSelect } from '@/components/ui/filter-select';
import { SearchBar } from '@/components/admin/DataTable';
import { Pagination } from '@/components/ui/pagination';
import { XCircle } from 'lucide-react';

const statusOptions = [
  { value: 'ACTIVE', label: 'Active' },
  { value: 'PENDING', label: 'Pending' },
  { value: 'EXPIRED', label: 'Expired' },
  { value: 'CANCELLED', label: 'Cancelled' },
];

export default function AdminSubscriptionsPage() {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [planFilter, setPlanFilter] = useState('');
  const [page, setPage] = useState(1);
  const [cancelId, setCancelId] = useState<string | null>(null);
  const { data: plans } = usePlans();
  const { data, isLoading } = useAdminSubscriptions({ page, limit: 10, search, status: statusFilter || undefined, planId: planFilter || undefined });

  const planOptions = (plans || []).map((p: any) => ({ value: p.id, label: p.name }));
  const cancelSub = useCancelSubscription();
  const cancelTarget = cancelId ? data?.data?.find((s: any) => s.id === cancelId) : null;

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">All Subscriptions</h1>
        <p className="text-sm text-muted-foreground mt-1">Manage doctor subscription plans</p>
      </div>
      <div className="flex items-center gap-3">
        <div className="flex-1"><SearchBar value={search} onChange={(v) => { setSearch(v); setPage(1); }} /></div>
        <FilterSelect value={planFilter} onChange={(v) => { setPlanFilter(v); setPage(1); }} options={planOptions} placeholder="All Plans" />
        <FilterSelect value={statusFilter} onChange={(v) => { setStatusFilter(v); setPage(1); }} options={statusOptions} placeholder="All Status" />
      </div>

      <ConfirmDialog
        open={!!cancelId}
        onOpenChange={(v) => !v && setCancelId(null)}
        title="Cancel Subscription"
        message={`Are you sure you want to cancel the ${cancelTarget?.plan?.name || 'current'} plan for ${cancelTarget?.doctor?.fullName}?`}
        confirmLabel="Cancel Subscription"
        variant="destructive"
        loading={cancelSub.isPending}
        onConfirm={() => cancelId && cancelSub.mutate(cancelId, { onSuccess: () => setCancelId(null) })}
      />

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
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data?.data?.length === 0 ? (
                  <TableRow><TableCell colSpan={9} className="text-center text-muted-foreground py-8">No subscriptions found</TableCell></TableRow>
                ) : (
                  data?.data?.map((sub: any) => (
                    <TableRow key={sub.id}>
                      <TableCell className="font-medium">{sub.doctor?.fullName}</TableCell>
                      <TableCell>{sub.doctor?.clinicName}</TableCell>
                      <TableCell><Badge variant={sub.plan?.name === 'Premium' ? 'success' : 'secondary'}>{sub.plan?.name || sub.planId}</Badge></TableCell>
                      <TableCell><Badge variant={sub.status === 'ACTIVE' ? 'success' : sub.status === 'EXPIRED' ? 'destructive' : 'warning'}>{sub.status}</Badge></TableCell>
                      <TableCell>{sub.patientLimit}</TableCell>
                      <TableCell>{sub.prescriptionLimit}</TableCell>
                      <TableCell className="text-xs text-muted-foreground">{new Date(sub.startDate).toLocaleDateString()}</TableCell>
                      <TableCell className="text-xs text-muted-foreground">{sub.endDate ? new Date(sub.endDate).toLocaleDateString() : '—'}</TableCell>
                      <TableCell className="text-right">
                        {sub.status === 'ACTIVE' && (
                          <Button size="sm" variant="ghost" onClick={() => setCancelId(sub.id)}>
                            <XCircle className="h-4 w-4 text-red-500" />
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