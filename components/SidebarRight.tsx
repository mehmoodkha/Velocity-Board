
import React, { useState } from 'react';
import { Task, Status, Assignee } from '../types';
import { CheckCircle2, ChevronDown, ChevronRight } from 'lucide-react';
import TaskCard from './TaskCard';

interface SidebarRightProps {
  tasks: Task[];
  assignees: Assignee[];
  onDrop: (e: React.DragEvent, status: Status) => void;
  onDragStart: (e: React.DragEvent, taskId: string) => void;
  onTaskClick?: (task: Task) => void;
}

const SidebarRight: React.FC<SidebarRightProps> = ({ tasks, assignees, onDrop, onDragStart, onTaskClick }) => {
  const [isExpanded, setIsExpanded] = useState(true);
  const [isOver, setIsOver] = useState(false);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsOver(true);
  };

  const handleDragLeave = () => {
    setIsOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    setIsOver(false);
    onDrop(e, 'DONE');
  };

  return (
    <div 
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      className={`w-72 flex-shrink-0 border-l border-slate-200 flex flex-col overflow-hidden transition-colors ${isOver ? 'bg-emerald-50' : 'bg-slate-50'}`}
    >
      <div className="p-4 border-b border-slate-200 flex items-center justify-between bg-white">
        <div className="flex items-center gap-2">
          <CheckCircle2 size={18} className="text-emerald-500" />
          <h2 className="font-semibold text-slate-700">Completed</h2>
          <span className="text-xs bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full font-medium">
            {tasks.length}
          </span>
        </div>
        <button 
          onClick={() => setIsExpanded(!isExpanded)}
          className="p-1 hover:bg-slate-200 rounded transition-colors"
        >
          {isExpanded ? <ChevronDown size={18} /> : <ChevronRight size={18} />}
        </button>
      </div>

      <div className={`flex-1 overflow-y-auto px-4 transition-all duration-300 ${isExpanded ? 'opacity-100' : 'opacity-0 h-0 pointer-events-none'}`}>
        {tasks.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center opacity-40">
            <CheckCircle2 size={48} strokeWidth={1} className="mb-2" />
            <p className="text-sm">No items completed yet</p>
          </div>
        ) : (
          <div className="py-4">
            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-4">Current Sprint</div>
            {tasks.map(task => (
              <TaskCard 
                key={task.id} 
                task={task} 
                assignees={assignees}
                isMuted 
                onDragStart={onDragStart}
                onClick={onTaskClick}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default SidebarRight;
