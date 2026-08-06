'use client';
import { useState } from 'react';
import { RadioGroup, RadioGroupItem } from '../../src';

export const Demo = () => {
  const [radio, setRadio] = useState('option1');

  return (
    <>
      <RadioGroup value={radio} onValueChange={setRadio}>
        <RadioGroupItem value="option1">Default option</RadioGroupItem>
        <RadioGroupItem value="option2">Alternative option</RadioGroupItem>
        <RadioGroupItem value="option3" disabled>
          Disabled option
        </RadioGroupItem>
      </RadioGroup>
    </>
  );
};
