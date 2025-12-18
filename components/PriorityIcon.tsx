
import React from 'react';
import { Priority } from '../types';
import { PRIORITY_CONFIG } from '../constants';

interface PriorityIconProps {
  priority: Priority;
  size?: number;
}

const PriorityIcon: React.FC<PriorityIconProps> = ({ priority, size = 16 }) => {
  const config = PRIORITY_CONFIG[priority];
  const Icon = config.icon;

  return (
    <div title={`Priority: ${config.label}`} className={`${config.color}`}>
      <Icon size={size} strokeWidth={2.5} />
    </div>
  );
};

export default PriorityIcon;
