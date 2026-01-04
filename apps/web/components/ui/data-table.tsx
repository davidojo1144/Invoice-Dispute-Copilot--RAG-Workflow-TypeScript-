'use client';

import React, { useMemo, useState } from 'react';
import { Table, THead, TBody, TR, TH, TD } from './table';
import { Button } from './button';

export type Column<T> = {
  key: keyof T | string;
  header: string;
  render?: (row: T) => React.ReactNode;
  width?: string;
};

export default function DataTable<T extends Record<string, any>>({
  data,
  columns,
  pageSize = 10,
  emptyMessage = 'No data'
}: {
  data: T[];
  columns: Column<T>[];
  pageSize?: number;
  emptyMessage?: string;
}) {
  const [page, setPage] = useState(1);
  const pages = Math.max(1, Math.ceil(data.length / pageSize));
  const pageData = useMemo(() => {
    const start = (page - 1) * pageSize;
    return data.slice(start, start + pageSize);
  }, [data, page, pageSize]);

  return (
    <div className="space-y-3">
      <Table>
        <THead>
          <TR>
            {columns.map((c, i) => (
              <TH key={i} style={{ width: c.width }}>{c.header}</TH>
            ))}
          </TR>
        </THead>
        <TBody>
          {pageData.map((row, i) => (
            <TR key={i}>
              {columns.map((c, j) => (
                <TD key={j}>
                  {c.render ? c.render(row) : String((row as any)[c.key])}
                </TD>
              ))}
            </TR>
          ))}
          {pageData.length === 0 && (
            <TR><TD colSpan={columns.length} className="text-center text-muted">{emptyMessage}</TD></TR>
          )}
        </TBody>
      </Table>
      <div className="flex items-center justify-between">
        <div className="text-sm text-muted">Page {page} of {pages}</div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1}>Prev</Button>
          <Button variant="outline" size="sm" onClick={() => setPage((p) => Math.min(pages, p + 1))} disabled={page === pages}>Next</Button>
        </div>
      </div>
    </div>
  );
}
