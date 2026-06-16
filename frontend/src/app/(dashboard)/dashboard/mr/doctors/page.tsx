'use client';

import { useState } from 'react';
import { useMyDoctors } from '@/features/mr/hooks';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { SearchBar } from '@/components/admin/DataTable';
import { FileText, Stethoscope, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function MrDoctorsPage() {
  const [search, setSearch] = useState('');
  const { data: doctors, isLoading } = useMyDoctors();

  const filtered = (doctors || []).filter(
    (doc: any) =>
      doc.fullName?.toLowerCase().includes(search.toLowerCase()) ||
      doc.specialization?.toLowerCase().includes(search.toLowerCase()) ||
      doc.clinicName?.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center gap-4">
        <Link href="/dashboard/mr" className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
          <ArrowLeft className="h-5 w-5 text-muted-foreground" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Assigned Doctors</h1>
          <p className="text-sm text-muted-foreground mt-1">View all doctors assigned to you</p>
        </div>
      </div>

      <SearchBar value={search} onChange={setSearch} />

      {isLoading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-12 bg-gray-200 dark:bg-gray-800 rounded-lg animate-pulse" />
          ))}
        </div>
      ) : !filtered.length ? (
        <div className="premium-card-static p-12 text-center">
          <Stethoscope className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">No Doctors Assigned</h3>
          <p className="text-sm text-muted-foreground">
            {search ? 'No doctors match your search.' : "You haven&apos;t been assigned to any doctors yet."}
          </p>
        </div>
      ) : (
        <div className="premium-card-static overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Specialization</TableHead>
                <TableHead>Clinic</TableHead>
                <TableHead>BMDC Reg No</TableHead>
                <TableHead>Patients</TableHead>
                <TableHead>Prescriptions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((doc: any) => (
                <TableRow
                  key={doc.id}
                  className="cursor-pointer hover:bg-muted/50"
                  onClick={() => window.location.href = `/dashboard/mr/doctors/${doc.id}/prescriptions`}
                >
                  <TableCell className="font-medium">
                    <Link href={`/dashboard/mr/doctors/${doc.id}/prescriptions`} className="hover:text-teal-600 dark:hover:text-teal-400 transition-colors">
                      {doc.fullName}
                    </Link>
                  </TableCell>
                  <TableCell>{doc.specialization || '—'}</TableCell>
                  <TableCell>{doc.clinicName || '—'}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className="font-mono text-xs">
                      {doc.bmdcRegNo || '—'}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs text-muted-foreground">{doc._count?.patients || 0}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1.5">
                      <FileText className="h-3.5 w-3.5 text-muted-foreground" />
                      <span className="text-xs text-muted-foreground">{doc._count?.prescriptions || 0}</span>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <div className="px-4 py-3 border-t border-gray-100 dark:border-gray-800/50 text-xs text-muted-foreground">
            Showing {filtered.length} doctor{filtered.length !== 1 ? 's' : ''}
          </div>
        </div>
      )}
    </div>
  );
}
