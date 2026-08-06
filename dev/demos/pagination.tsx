'use client';
import { useState } from 'react';
import { Pagination } from '../../src';

export const Demo = () => {
  const [pageNum, setPageNum] = useState(1);

  return (
    <>
      <div className="flex items-center justify-between">
        <p className="text-xs text-muted-foreground">Page {pageNum} of 12 · 120 total runs</p>
        <Pagination page={pageNum} pageCount={12} onPageChange={setPageNum} />
      </div>
    </>
  );
};
