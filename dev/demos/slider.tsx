'use client';
import { useState } from 'react';
import { Slider } from '../../src';

export const Demo = () => {
  const [sliderVal, setSliderVal] = useState(40);

  return (
    <>
      <div className="max-w-sm space-y-2">
        <Slider value={sliderVal} onValueChange={setSliderVal} aria-label="Volume" />
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>0</span>
          <span>{sliderVal}</span>
          <span>100</span>
        </div>
      </div>
    </>
  );
};
