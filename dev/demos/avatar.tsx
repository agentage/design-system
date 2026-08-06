'use client';
import { Avatar, IconButton, IconContainer, Tooltip } from '../../src';
import { BotIcon, EditIcon, HeartIcon, InfoIcon, ServerIcon } from '../lib/icons';

export const Demo = () => (
  <>
    <div className="flex items-end gap-3">
      <Avatar name="John Doe" size="xs" />
      <Avatar name="Jane Smith" size="sm" />
      <Avatar name="Volodymyr Vreshch" size="md" />
      <Avatar name="Alice Wonder" size="lg" />
      <Avatar name="Charlie" size="xl" />
      <Avatar size="2xl" />
    </div>
    <div className="flex items-center gap-3 mt-3">
      <Tooltip content="Edit">
        <span>
          <IconButton icon={<EditIcon />} onClick={() => {}} title="Edit" />
        </span>
      </Tooltip>
      <Tooltip content="Info">
        <span>
          <IconButton icon={<InfoIcon />} onClick={() => {}} title="Info" />
        </span>
      </Tooltip>
      <IconContainer color="blue">
        <InfoIcon />
      </IconContainer>
      <IconContainer color="green">
        <EditIcon />
      </IconContainer>
      <IconContainer color="amber">
        <HeartIcon />
      </IconContainer>
      <IconContainer color="violet">
        <BotIcon />
      </IconContainer>
      <IconContainer color="rose">
        <HeartIcon />
      </IconContainer>
      <IconContainer color="cyan">
        <ServerIcon />
      </IconContainer>
    </div>
  </>
);
