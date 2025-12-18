
import React from 'react';
import { Task, Assignee } from '../types';
import Avatar from './Avatar';
import PriorityIcon from './PriorityIcon';
import { ExternalLink } from 'lucide-react';

interface TaskCardProps {
  task: Task;
  assignees: Assignee[];
  isDragging?: boolean;
  isMuted?: boolean;
  onDragStart?: (e: React.DragEvent, taskId: string) => void;
  onClick?: (task: Task) => void;
}

const TaskCard: React.FC<TaskCardProps> = ({ task, assignees, isDragging, isMuted, onDragStart, onClick }) => {
  const assignee = assignees.find(a => a.id === task.assigneeId) || { 
    id: 'unknown', 
    name: 'Unassigned', 
    avatar: 'https://picsum.photos/seed/na/100' 
  };

  const handleDragStart = (e: React.DragEvent) => {
    if (onDragStart) {
      onDragStart(e, task.id);
    }
  };

  return (
    <div
      draggable={!isMuted}
      onDragStart={handleDragStart}
      onClick={() => onClick?.(task)}
      className={`
        group relative p-3.5 mb-2.5 rounded-xl border bg-white shadow-sm transition-all cursor-grab active:cursor-grabbing
        ${isDragging ? 'opacity-30 scale-95 border-blue-400 shadow-none' : 'hover:shadow-md hover:border-slate-300 hover:-translate-y-0.5'}
        ${isMuted ? 'bg-slate-50/80 border-slate-200 grayscale-[0.2]' : 'border-slate-200'}
      `}
    >
      <div className="flex flex-col gap-2.5">
        <div className="flex justify-between items-start gap-2">
          <h4 className={`text-sm font-semibold leading-snug antialiased flex-1 ${isMuted ? 'text-slate-400 line-through' : 'text-slate-900'}`}>
            {task.title}
          </h4>
          {task.prLink && (
            <ExternalLink size={14} className="text-blue-500 flex-shrink-0" />
          )}
        </div>
        
        <div className="flex items-center justify-between mt-1">
          <div className="flex items-center gap-2">
            <PriorityIcon priority={task.priority} />
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{task.id}</span>
          </div>

          <div className="flex items-center gap-2">
            {task.points > 0 && (
              <div className="px-2 py-0.5 rounded-md bg-slate-100 text-[10px] font-bold text-slate-600">
                {task.points}
              </div>
            )}
            <Avatar src={assignee.avatar} alt={assignee.name} size="xs" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default TaskCard;
