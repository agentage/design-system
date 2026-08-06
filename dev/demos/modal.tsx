'use client';
import { useState } from 'react';
import { Button, Combobox, FormField, Modal, ModalFooter, Textarea } from '../../src';

export const Demo = () => {
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <>
      <Button onClick={() => setModalOpen(true)}>Open Modal</Button>
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title="Create Run"
        description="Configure and start a new agent run."
      >
        <div className="space-y-3">
          <FormField label="Agent" required>
            <Combobox
              value=""
              onValueChange={() => {}}
              placeholder="Select agent..."
              options={[
                { value: 'code-review', label: 'Code Reviewer' },
                { value: 'test-gen', label: 'Test Generator' },
              ]}
            />
          </FormField>
          <FormField label="Task">
            <Textarea placeholder="What should the agent do?" rows={3} />
          </FormField>
        </div>
        <ModalFooter>
          <Button variant="ghost" onClick={() => setModalOpen(false)}>
            Cancel
          </Button>
          <Button onClick={() => setModalOpen(false)}>Start Run</Button>
        </ModalFooter>
      </Modal>
    </>
  );
};
