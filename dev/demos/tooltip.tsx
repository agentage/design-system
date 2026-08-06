'use client';
import { Button, Tooltip } from '../../src';

export const Demo = () => (
  <>
    <div className="flex gap-4">
      <Tooltip content="Edit this item">
        <Button variant="outline" size="sm">
          Top
        </Button>
      </Tooltip>
      <Tooltip content="More info" side="bottom">
        <Button variant="outline" size="sm">
          Bottom
        </Button>
      </Tooltip>
      <Tooltip content="Navigate" side="left">
        <Button variant="outline" size="sm">
          Left
        </Button>
      </Tooltip>
      <Tooltip content="Navigate" side="right">
        <Button variant="outline" size="sm">
          Right
        </Button>
      </Tooltip>
    </div>
  </>
);
