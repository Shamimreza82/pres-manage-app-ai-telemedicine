'use client';

import { useState } from 'react';
import { useMyReceptionists, useCreateReceptionistByDoctor, useDeleteReceptionistByDoctor } from '@/features/receptionist/hooks';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { SearchBar } from '@/components/admin/DataTable';
import { Pagination } from '@/components/ui/pagination';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { ConfirmDialog } from '@/components/ui/confirm-dialog';
import { Plus, Trash2, UserRound, Mail, Phone } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

const createRecSchema = z.object({
  fullName: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  phone: z.string().min(5, 'Phone number is required'),
});

type CreateRecForm = z.infer<typeof createRecSchema>;

export default function DoctorReceptionistsPage() {
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [createOpen, setCreateOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const { data, isLoading } = useMyReceptionists({ page, limit: 10, search });
  const createRec = useCreateReceptionistByDoctor();
  const deleteRec = useDeleteReceptionistByDoctor();

  const { register, handleSubmit, reset, formState: { errors } } = useForm<CreateRecForm>({
    resolver: zodResolver(createRecSchema),
  });

  const onSubmit = (formData: CreateRecForm) => {
    createRec.mutate(formData, {
      onSuccess: () => {
        setCreateOpen(false);
        reset();
      },
    });
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Receptionists</h1>
          <p className="text-sm text-muted-foreground mt-1">Manage your clinic receptionists</p>
        </div>
        <Dialog open={createOpen} onOpenChange={setCreateOpen}>
          <DialogTrigger asChild>
            <Button className="rounded-xl gradient-primary text-white shadow-glow">
              <Plus className="h-4 w-4 mr-2" /> Add Receptionist
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create Receptionist</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="space-y-2">
                <Label>Full Name</Label>
                <div className="relative">
                  <UserRound className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input className="pl-10" placeholder="Receptionist name" {...register('fullName')} />
                </div>
                {errors.fullName && <p className="text-xs text-red-500">{errors.fullName.message}</p>}
              </div>
              <div className="space-y-2">
                <Label>Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input className="pl-10" type="email" placeholder="rec@clinic.com" {...register('email')} />
                </div>
                {errors.email && <p className="text-xs text-red-500">{errors.email.message}</p>}
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Password</Label>
                  <Input type="password" placeholder="Min 6 chars" {...register('password')} />
                  {errors.password && <p className="text-xs text-red-500">{errors.password.message}</p>}
                </div>
                <div className="space-y-2">
                  <Label>Phone</Label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input className="pl-10" placeholder="+88017..." {...register('phone')} />
                  </div>
                  {errors.phone && <p className="text-xs text-red-500">{errors.phone.message}</p>}
                </div>
              </div>
              <Button type="submit" className="w-full gradient-primary text-white" disabled={createRec.isPending}>
                {createRec.isPending ? 'Creating...' : 'Create Receptionist'}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <ConfirmDialog
        open={!!deleteId}
        onOpenChange={(v) => !v && setDeleteId(null)}
        title="Delete Receptionist"
        message="Are you sure you want to delete this receptionist? This action cannot be undone."
        confirmLabel="Delete"
        variant="destructive"
        loading={deleteRec.isPending}
        onConfirm={() => deleteId && deleteRec.mutate(deleteId, { onSuccess: () => setDeleteId(null) })}
      />

      <SearchBar value={search} onChange={(v) => { setSearch(v); setPage(1); }} />

      {isLoading ? (
        <div className="space-y-3">{[1, 2, 3].map(i => <div key={i} className="h-12 bg-gray-200 dark:bg-gray-800 rounded-lg animate-pulse" />)}</div>
      ) : (
        <div className="premium-card-static overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Phone</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Created</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data?.data?.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center text-muted-foreground py-8">
                    <UserRound className="h-8 w-8 mx-auto mb-2 opacity-50" />
                    No receptionists found
                  </TableCell>
                </TableRow>
              ) : (
                data?.data?.map((rec: any) => (
                  <TableRow key={rec.id}>
                    <TableCell className="font-medium">{rec.fullName}</TableCell>
                    <TableCell>{rec.user?.email}</TableCell>
                    <TableCell>{rec.phone}</TableCell>
                    <TableCell>
                      <Badge variant={rec.user?.isActive ? 'success' : 'destructive'}>
                        {rec.user?.isActive ? 'Active' : 'Inactive'}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-muted-foreground text-sm">
                      {rec.createdAt ? new Date(rec.createdAt).toLocaleDateString() : '-'}
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-red-500 hover:text-red-600"
                        onClick={() => setDeleteId(rec.id)}
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
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
