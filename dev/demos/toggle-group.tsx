'use client';
import { useState } from 'react';
import { ToggleGroup } from '../../src';

export const Demo = () => {
  const [toggleVal, setToggleVal] = useState('dark');

  return (
    <>
      <ToggleGroup
        value={toggleVal}
        onChange={setToggleVal}
        options={[
          { value: 'light', label: 'Light' },
          { value: 'dark', label: 'Dark' },
          { value: 'system', label: 'System' },
        ]}
        columns={3}
      />
    </>
  );
};
