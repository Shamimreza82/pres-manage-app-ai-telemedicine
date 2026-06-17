'use client';

import { useState } from 'react';
import Link from 'next/link';
import { toast } from 'sonner';
import { usePatients, useDeletePatient } from '@/features/patients/hooks';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Pagination } from '@/components/ui/pagination';
import { ConfirmDialog } from '@/components/ui/confirm-dialog';
import { Plus, Search, MoreHorizontal, Eye, Trash2, Users } from 'lucide-react';

const genderBadge = (g: string) => {
  const map: Record<string, string> = { MALE: 'badge-gradient-blue', FEMALE: 'badge-gradient-green', OTHER: 'badge-gradient-purple' };
  const labels: Record<string, string> = { MALE: 'Male', FEMALE: 'Female', OTHER: 'Other' };
  return <span className={map[g] || 'badge-gradient-blue'}>{labels[g] || g}</span>;
};

export default function PatientsPage() {
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [deleteTarget, setDeleteTarget] = useState<{ id: string; name: string } | null>(null);
  const [menuTarget, setMenuTarget] = useState<{ id: string; top: number; right: number } | null>(null);
  const params = { page: String(page), limit: '20', search };
  const { data, isLoading, isError } = usePatients(params);
  const deletePatient = useDeletePatient();

  if (isError) toast.error('Failed to load patients');

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Patients</h1>
          <p className="text-sm text-muted-foreground mt-1">Manage your patient records</p>
        </div>
        <Link href="/patients/new">
          <Button className="h-10 rounded-xl gradient-primary hover:opacity-90 text-white shadow-glow">
            <Plus className="h-4 w-4 mr-2" />
            Add Patient
          </Button>
        </Link>
      </div>

      <ConfirmDialog
        open={!!deleteTarget}
        onOpenChange={(v) => !v && setDeleteTarget(null)}
        title="Delete Patient"
        message={`Are you sure you want to delete "${deleteTarget?.name}"? All associated prescriptions and records will be removed.`}
        confirmLabel="Delete"
        variant="destructive"
        loading={deletePatient.isPending}
        onConfirm={() => deleteTarget && deletePatient.mutate(deleteTarget.id, { onSuccess: () => setDeleteTarget(null) })}
      />

      <Card className="premium-card">
        <div className="p-4 border-b border-gray-100 dark:border-gray-800/50">
          <div className="relative max-w-sm">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search patients..."
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1); }}
              className="pl-10 h-10 premium-input"
            />
          </div>
        </div>

        <CardContent className="p-0">
          {isLoading ? (
            <div className="p-6 space-y-3">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="h-14 bg-gray-100 dark:bg-gray-800/50 rounded-lg animate-pulse" />
              ))}
            </div>
          ) : data?.data.length === 0 ? (
            <div className="text-center py-16 px-6">
              <div className="w-16 h-16 rounded-2xl bg-gray-100 dark:bg-gray-800 flex items-center justify-center mx-auto mb-4">
                <Users className="h-8 w-8 text-muted-foreground" />
              </div>
              <p className="text-lg font-medium text-gray-900 dark:text-white mb-1">No patients yet</p>
              <p className="text-sm text-muted-foreground mb-4">Add your first patient to get started</p>
              <Link href="/patients/new">
                <Button variant="outline" className="rounded-xl">
                  <Plus className="h-4 w-4 mr-2" /> Add Patient
                </Button>
              </Link>
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="premium-table">
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Name</th>
                      <th>Age</th>
                      <th>Gender</th>
                      <th>Phone</th>
                      <th>Rx</th>
                      <th className="text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data?.data.map((patient, i) => (
                      <tr key={patient.id}>
                        <td className="font-mono text-xs text-muted-foreground">{patient.patientId}</td>
                        <td className="font-medium text-gray-900 dark:text-white">{patient.fullName}</td>
                        <td>{patient.age}</td>
                        <td>{genderBadge(patient.gender)}</td>
                        <td className="text-muted-foreground">{patient.phone || '-'}</td>
                        <td>
                          <span className="badge-gradient-blue">{patient._count?.prescriptions || 0}</span>
                        </td>
                        <td className="text-right">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={(e) => {
                              const rect = (e.target as HTMLElement).closest('button')!.getBoundingClientRect();
                              setMenuTarget(menuTarget?.id === patient.id ? null : { id: patient.id, top: rect.bottom + 4, right: window.innerWidth - rect.right });
                            }}
                          >
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

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

      {/* Actions Menu */}
      {menuTarget && data?.data && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setMenuTarget(null)} />
          <div
            className="fixed z-50 w-48 rounded-xl bg-white dark:bg-gray-950 border border-gray-100 dark:border-gray-800 shadow-strong py-1.5 animate-scale-in"
            style={{ top: menuTarget.top, right: menuTarget.right }}
          >
            {(() => {
              const patient = data.data.find((p: any) => p.id === menuTarget.id);
              if (!patient) return null;
              return (
                <>
                  <Link href={`/patients/${patient.id}`} onClick={() => setMenuTarget(null)}>
                    <button className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                      <Eye className="h-4 w-4 text-blue-500" /> View Details
                    </button>
                  </Link>
                  <div className="border-t border-gray-100 dark:border-gray-800 my-1" />
                  <button
                    onClick={() => { setDeleteTarget({ id: patient.id, name: patient.fullName }); setMenuTarget(null); }}
                    className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors"
                  >
                    <Trash2 className="h-4 w-4" /> Delete Patient
                  </button>
                </>
              );
            })()}
          </div>
        </>
      )}
    </div>
  );
}
