'use client';
import { useState } from 'react';
import { DatePicker } from '../../src';

export const Demo = () => {
  const [date, setDate] = useState<Date | undefined>();

  return (
    <>
      <div className="max-w-sm">
        <DatePicker value={date} onValueChange={setDate} />
        {date && (
          <p className="mt-2 text-xs text-muted-foreground">
            Selected: {date.toLocaleDateString()}
          </p>
        )}
      </div>
    </>
  );
};
