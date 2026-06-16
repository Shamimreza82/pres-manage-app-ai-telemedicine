'use client';

import { useState } from 'react';
import { useAdminLogs } from '@/features/dashboard/hooks';
import { Badge } from '@/components/ui/badge';
import { SearchBar } from '@/components/admin/DataTable';
import { Pagination } from '@/components/ui/pagination';

const actionColors: Record<string, 'default' | 'secondary' | 'success' | 'warning' | 'destructive'> = {
  LOGIN: 'default',
  LOGOUT: 'secondary',
  CREATE: 'success',
  UPDATE: 'warning',
  DELETE: 'destructive',
};

export default function AdminLogsPage() {
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const { data, isLoading } = useAdminLogs({ page, limit: 20, search });

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Activity Logs</h1>
        <p className="text-sm text-muted-foreground mt-1">Track system activity</p>
      </div>
      <SearchBar value={search} onChange={(v) => { setSearch(v); setPage(1); }} />
      {isLoading ? (
        <div className="space-y-3">
          {[1, 2, 3, 4, 5].map(i => <div key={i} className="h-16 bg-gray-200 dark:bg-gray-800 rounded-lg animate-pulse" />)}
        </div>
      ) : !data?.data?.length ? (
        <div className="premium-card-static p-8 text-center text-muted-foreground">No logs found</div>
      ) : (
        <>
          <div className="premium-card-static overflow-hidden">
            <div className="divide-y divide-gray-100 dark:divide-gray-800">
              {data.data.map((log: any) => (
                <div key={log.id} className="flex items-start gap-4 p-4 hover:bg-gray-50/50 dark:hover:bg-gray-800/30 transition-colors">
                  <div className="w-2 h-2 rounded-full mt-2 shrink-0 bg-blue-400" />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-sm font-medium text-gray-900 dark:text-white">{log.user?.email || 'Unknown'}</span>
                      <Badge variant={actionColors[log.action] || 'default'} className="text-[10px] px-1.5 py-0">{log.action}</Badge>
                      <span className="text-sm text-muted-foreground">{log.entity}</span>
                      {log.entityId && <span className="text-xs text-muted-foreground font-mono">#{log.entityId.slice(0, 8)}</span>}
                    </div>
                    {log.details && Object.keys(log.details).length > 0 && (
                      <p className="text-xs text-muted-foreground mt-1">{JSON.stringify(log.details)}</p>
                    )}
                  </div>
                  <span className="text-xs text-muted-foreground shrink-0 whitespace-nowrap">
                    {new Date(log.createdAt).toLocaleString()}
                  </span>
                </div>
              ))}
            </div>
            <div className="px-4 py-3 border-t border-gray-100 dark:border-gray-800/50">
              <Pagination page={page} totalPages={data?.totalPages || 1} total={data?.total} onPageChange={setPage} />
            </div>
          </div>
        </>
      )}
    </div>
  );
}