'use client';

import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAdminUser } from '@/features/dashboard/hooks';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Mail, Shield, Calendar, Clock, CheckCircle, XCircle, User, Building2, Stethoscope, FileText, Pill, Syringe, CreditCard, Activity } from 'lucide-react';

export default function AdminUserDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const { data: user, isLoading } = useAdminUser(id);

  if (isLoading) {
    return (
      <div className="space-y-6 animate-fade-in">
        <div className="h-8 w-64 bg-gray-200 dark:bg-gray-800 rounded-lg animate-pulse" />
        <div className="grid gap-6 md:grid-cols-2">
          <div className="h-64 bg-gray-200 dark:bg-gray-800 rounded-xl animate-pulse" />
          <div className="h-64 bg-gray-200 dark:bg-gray-800 rounded-xl animate-pulse" />
        </div>
      </div>
    );
  }

  if (!user) return <div className="text-center py-12 text-muted-foreground">User not found</div>;

  const roleVariant: Record<string, 'warning' | 'success' | 'secondary' | 'default'> = {
    SUPER_ADMIN: 'warning',
    DOCTOR: 'success',
    RECEPTIONIST: 'secondary',
    MEDICAL_REPRESENTATIVE: 'default',
  };

  const formatDate = (d: string) =>
    d ? new Date(d).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }) : '—';

  const infoCards = [
    { icon: Mail, label: 'Email', value: user.email },
    { icon: Shield, label: 'Role', value: user.role.replace('_', ' ') },
    { icon: CheckCircle, label: 'Status', value: user.isActive ? 'Active' : 'Inactive' },
    { icon: CheckCircle, label: 'Verified', value: user.isVerified ? 'Yes' : 'No' },
    { icon: Calendar, label: 'Joined', value: formatDate(user.createdAt) },
    { icon: Clock, label: 'Last Updated', value: formatDate(user.updatedAt) },
    { icon: Activity, label: 'Audit Logs', value: user._count?.auditLogs ?? 0 },
    { icon: Activity, label: 'Notifications', value: user._count?.notifications ?? 0 },
  ];

  const hasDoctor = !!user.doctor;
  const doc = user.doctor;
  const sub = doc?.subscription;

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => router.push('/dashboard/admin/users')} className="rounded-xl">
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 shadow-glow flex items-center justify-center text-white font-bold text-lg">
              {user.email.charAt(0).toUpperCase()}
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{user.email}</h1>
              <div className="flex items-center gap-2 mt-0.5">
                <Badge variant={roleVariant[user.role] || 'secondary'}>{user.role.replace('_', ' ')}</Badge>
                <Badge variant={user.isActive ? 'success' : 'destructive'}>{user.isActive ? 'Active' : 'Inactive'}</Badge>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* User Information */}
      <Card className="premium-card">
        <CardHeader><CardTitle className="text-base">User Information</CardTitle></CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {infoCards.map(({ icon: Icon, label, value }) => (
              <div key={label} className="flex items-center gap-3 p-3 rounded-xl bg-gray-50 dark:bg-gray-900/50">
                <div className="p-2 rounded-lg bg-blue-50 dark:bg-blue-950/30">
                  <Icon className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">{label}</p>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">{String(value)}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Doctor Information (if role is DOCTOR) */}
      {hasDoctor && (
        <>
          <Card className="premium-card">
            <CardHeader><CardTitle className="text-base flex items-center gap-2"><Stethoscope className="h-4 w-4" /> Doctor Profile</CardTitle></CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                <div className="flex items-center gap-3 p-3 rounded-xl bg-gray-50 dark:bg-gray-900/50">
                  <div className="p-2 rounded-lg bg-purple-50 dark:bg-purple-950/30"><User className="h-4 w-4 text-purple-600 dark:text-purple-400" /></div>
                  <div><p className="text-xs text-muted-foreground">Full Name</p><p className="text-sm font-medium text-gray-900 dark:text-white">{doc.fullName || '—'}</p></div>
                </div>
                <div className="flex items-center gap-3 p-3 rounded-xl bg-gray-50 dark:bg-gray-900/50">
                  <div className="p-2 rounded-lg bg-purple-50 dark:bg-purple-950/30"><Building2 className="h-4 w-4 text-purple-600 dark:text-purple-400" /></div>
                  <div><p className="text-xs text-muted-foreground">Degree</p><p className="text-sm font-medium text-gray-900 dark:text-white">{doc.degree || '—'}</p></div>
                </div>
                <div className="flex items-center gap-3 p-3 rounded-xl bg-gray-50 dark:bg-gray-900/50">
                  <div className="p-2 rounded-lg bg-purple-50 dark:bg-purple-950/30"><Stethoscope className="h-4 w-4 text-purple-600 dark:text-purple-400" /></div>
                  <div><p className="text-xs text-muted-foreground">Specialization</p><p className="text-sm font-medium text-gray-900 dark:text-white">{doc.specialization || '—'}</p></div>
                </div>
                <div className="flex items-center gap-3 p-3 rounded-xl bg-gray-50 dark:bg-gray-900/50">
                  <div className="p-2 rounded-lg bg-purple-50 dark:bg-purple-950/30"><Badge variant="outline" className="h-4 w-4 text-xs">BMDC</Badge></div>
                  <div><p className="text-xs text-muted-foreground">BMDC Reg No</p><p className="text-sm font-medium text-gray-900 dark:text-white">{doc.bmdcRegNo || '—'}</p></div>
                </div>
                <div className="flex items-center gap-3 p-3 rounded-xl bg-gray-50 dark:bg-gray-900/50">
                  <div className="p-2 rounded-lg bg-purple-50 dark:bg-purple-950/30"><Building2 className="h-4 w-4 text-purple-600 dark:text-purple-400" /></div>
                  <div><p className="text-xs text-muted-foreground">Clinic</p><p className="text-sm font-medium text-gray-900 dark:text-white">{doc.clinicName || '—'}</p></div>
                </div>
                <div className="flex items-center gap-3 p-3 rounded-xl bg-gray-50 dark:bg-gray-900/50">
                  <div className="p-2 rounded-lg bg-purple-50 dark:bg-purple-950/30"><Mail className="h-4 w-4 text-purple-600 dark:text-purple-400" /></div>
                  <div><p className="text-xs text-muted-foreground">Phone</p><p className="text-sm font-medium text-gray-900 dark:text-white">{doc.phone || '—'}</p></div>
                </div>
              </div>
              {doc.clinicAddress && (
                <div className="mt-3 p-3 rounded-xl bg-gray-50 dark:bg-gray-900/50">
                  <p className="text-xs text-muted-foreground">Clinic Address</p>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">{doc.clinicAddress}</p>
                </div>
              )}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-3">
                <div className="p-3 rounded-xl bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20 text-center">
                  <FileText className="h-5 w-5 mx-auto mb-1 text-blue-600 dark:text-blue-400" />
                  <p className="text-lg font-bold text-gray-900 dark:text-white">{doc._count?.patients ?? 0}</p>
                  <p className="text-xs text-muted-foreground">Patients</p>
                </div>
                <div className="p-3 rounded-xl bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-950/20 dark:to-teal-950/20 text-center">
                  <Pill className="h-5 w-5 mx-auto mb-1 text-emerald-600 dark:text-emerald-400" />
                  <p className="text-lg font-bold text-gray-900 dark:text-white">{doc._count?.prescriptions ?? 0}</p>
                  <p className="text-xs text-muted-foreground">Prescriptions</p>
                </div>
                <div className="p-3 rounded-xl bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-950/20 dark:to-orange-950/20 text-center">
                  <Syringe className="h-5 w-5 mx-auto mb-1 text-amber-600 dark:text-amber-400" />
                  <p className="text-lg font-bold text-gray-900 dark:text-white">{doc._count?.appointments ?? 0}</p>
                  <p className="text-xs text-muted-foreground">Appointments</p>
                </div>
              </div>
              {!doc.isProfileComplete && (
                <div className="mt-3 p-3 rounded-xl bg-yellow-50 dark:bg-yellow-950/20 border border-yellow-200 dark:border-yellow-800/50 text-sm text-yellow-700 dark:text-yellow-400">
                  Profile is incomplete
                </div>
              )}
            </CardContent>
          </Card>

          {/* Subscription Information */}
          <Card className="premium-card">
            <CardHeader><CardTitle className="text-base flex items-center gap-2"><CreditCard className="h-4 w-4" /> Subscription</CardTitle></CardHeader>
            <CardContent>
              {sub ? (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                    <div className="p-3 rounded-xl bg-gray-50 dark:bg-gray-900/50">
                      <p className="text-xs text-muted-foreground">Plan</p>
                      <p className="text-sm font-medium text-gray-900 dark:text-white">{sub.plan?.name || '—'}</p>
                    </div>
                    <div className="p-3 rounded-xl bg-gray-50 dark:bg-gray-900/50">
                      <p className="text-xs text-muted-foreground">Status</p>
                      <Badge variant={sub.status === 'ACTIVE' ? 'success' : sub.status === 'PENDING' ? 'warning' : 'destructive'} className="mt-0.5">{sub.status}</Badge>
                    </div>
                    <div className="p-3 rounded-xl bg-gray-50 dark:bg-gray-900/50">
                      <p className="text-xs text-muted-foreground">Patient Limit</p>
                      <p className="text-sm font-medium text-gray-900 dark:text-white">{sub.patientLimit ?? '—'}</p>
                    </div>
                    <div className="p-3 rounded-xl bg-gray-50 dark:bg-gray-900/50">
                      <p className="text-xs text-muted-foreground">Prescription Limit</p>
                      <p className="text-sm font-medium text-gray-900 dark:text-white">{sub.prescriptionLimit ?? '—'}</p>
                    </div>
                    <div className="p-3 rounded-xl bg-gray-50 dark:bg-gray-900/50">
                      <p className="text-xs text-muted-foreground">Start Date</p>
                      <p className="text-sm font-medium text-gray-900 dark:text-white">{sub.startDate ? formatDate(sub.startDate) : '—'}</p>
                    </div>
                    <div className="p-3 rounded-xl bg-gray-50 dark:bg-gray-900/50">
                      <p className="text-xs text-muted-foreground">End Date</p>
                      <p className="text-sm font-medium text-gray-900 dark:text-white">{sub.endDate ? formatDate(sub.endDate) : '—'}</p>
                    </div>
                  </div>

                  {sub.payments && sub.payments.length > 0 && (
                    <div>
                      <p className="text-sm font-medium text-gray-900 dark:text-white mb-2">Payment History</p>
                      <div className="overflow-x-auto">
                        <table className="premium-table">
                          <thead>
                            <tr>
                              <th>Transaction ID</th>
                              <th>Amount</th>
                              <th>Method</th>
                              <th>Status</th>
                              <th>Date</th>
                            </tr>
                          </thead>
                          <tbody>
                            {sub.payments.map((p: any) => (
                              <tr key={p.id}>
                                <td className="font-mono text-xs">{p.transactionId || '—'}</td>
                                <td>{p.amount ? `${p.amount} ${p.currency || 'BDT'}` : '—'}</td>
                                <td>{p.paymentMethod || '—'}</td>
                                <td><Badge variant={p.status === 'COMPLETED' ? 'success' : p.status === 'PENDING' ? 'warning' : 'destructive'}>{p.status}</Badge></td>
                                <td className="text-xs text-muted-foreground">{formatDate(p.createdAt)}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">No active subscription</p>
              )}
            </CardContent>
          </Card>
        </>
      )}

      {/* MR / Receptionist info */}
      {user.role === 'MEDICAL_REPRESENTATIVE' && user.mr && (
        <Card className="premium-card">
          <CardHeader><CardTitle className="text-base flex items-center gap-2"><User className="h-4 w-4" /> Medical Representative Details</CardTitle></CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              <div className="p-3 rounded-xl bg-gray-50 dark:bg-gray-900/50">
                <p className="text-xs text-muted-foreground">Full Name</p>
                <p className="text-sm font-medium text-gray-900 dark:text-white">{user.mr.fullName || '—'}</p>
              </div>
              <div className="p-3 rounded-xl bg-gray-50 dark:bg-gray-900/50">
                <p className="text-xs text-muted-foreground">Phone</p>
                <p className="text-sm font-medium text-gray-900 dark:text-white">{user.mr.phone || '—'}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {user.role === 'RECEPTIONIST' && user.receptionist && (
        <Card className="premium-card">
          <CardHeader><CardTitle className="text-base flex items-center gap-2"><User className="h-4 w-4" /> Receptionist Details</CardTitle></CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              <div className="p-3 rounded-xl bg-gray-50 dark:bg-gray-900/50">
                <p className="text-xs text-muted-foreground">Full Name</p>
                <p className="text-sm font-medium text-gray-900 dark:text-white">{user.receptionist.fullName || '—'}</p>
              </div>
              <div className="p-3 rounded-xl bg-gray-50 dark:bg-gray-900/50">
                <p className="text-xs text-muted-foreground">Phone</p>
                <p className="text-sm font-medium text-gray-900 dark:text-white">{user.receptionist.phone || '—'}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Quick Links */}
      {hasDoctor && (
        <div className="flex gap-3">
          <Link href={`/dashboard/admin/doctors`}>
            <Button variant="outline" className="rounded-lg">View All Doctors</Button>
          </Link>
          <Link href={`/dashboard/admin/subscriptions`}>
            <Button variant="outline" className="rounded-lg">View Subscriptions</Button>
          </Link>
        </div>
      )}
    </div>
  );
}
