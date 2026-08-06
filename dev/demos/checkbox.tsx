'use client';
import { useState } from 'react';
import { Checkbox, Switch } from '../../src';

export const Demo = () => {
  const [checked, setChecked] = useState(false);
  const [switchOn, setSwitchOn] = useState(false);

  return (
    <>
      <div className="space-y-3">
        <div className="flex items-center gap-8">
          <label className="flex items-center gap-2 text-sm cursor-pointer">
            <Checkbox checked={checked} onCheckedChange={setChecked} />
            Accept terms
          </label>
          <label className="flex items-center gap-2 text-sm cursor-pointer">
            <Checkbox checked={true} onCheckedChange={() => {}} />
            Checked
          </label>
          <label className="flex items-center gap-2 text-sm">
            <Checkbox disabled />
            Disabled
          </label>
        </div>
        <div className="flex items-center gap-8">
          <label className="flex items-center gap-2 text-sm cursor-pointer">
            <Switch checked={switchOn} onCheckedChange={setSwitchOn} />
            Notifications
          </label>
          <label className="flex items-center gap-2 text-sm cursor-pointer">
            <Switch checked={true} onCheckedChange={() => {}} />
            Active
          </label>
          <label className="flex items-center gap-2 text-sm">
            <Switch disabled />
            Disabled
          </label>
        </div>
      </div>
    </>
  );
};
