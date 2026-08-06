'use client';
import {
  FormField,
  Input,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Textarea,
} from '../../src';

export const Demo = () => (
  <>
    <div className="grid grid-cols-2 gap-4 max-w-lg">
      <FormField label="Name" required>
        <Input placeholder="Enter name..." />
      </FormField>
      <FormField label="Email" error="Invalid email address">
        <Input error placeholder="user@..." />
      </FormField>
      <FormField label="Role" className="col-span-2">
        <Select>
          <SelectTrigger aria-label="Role">
            <SelectValue placeholder="Select role..." />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="admin">Admin</SelectItem>
            <SelectItem value="user">User</SelectItem>
          </SelectContent>
        </Select>
      </FormField>
      <FormField label="Bio" hint="Max 200 characters" className="col-span-2">
        <Textarea placeholder="Tell us about yourself..." rows={3} />
      </FormField>
    </div>
  </>
);
