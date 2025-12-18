
import React, { useState } from 'react';
import { Task, Status, Assignee, UserRole } from '../types';
import { Plus, Inbox, CalendarPlus } from 'lucide-react';
import TaskCard from './TaskCard';

interface SidebarLeftProps {
  tasks: Task[];
  assignees: Assignee[];
  userRole?: UserRole;
  onAddTask: () => void;
  onCreateSprint?: () => void;
  onDragStart: (e: React.DragEvent, taskId: string) => void;
  onDrop: (e: React.DragEvent, status: Status) => void;
  onTaskClick?: (task: Task) => void;
}

const SidebarLeft: React.FC<SidebarLeftProps> = ({ 
  tasks, 
  assignees, 
  userRole,
  onAddTask, 
  onCreateSprint,
  onDragStart, 
  onDrop, 
  onTaskClick 
}) => {
  const [isOver, setIsOver] = useState(false);
  const isAdmin = userRole === 'ADMIN';

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsOver(true);
  };

  const handleDragLeave = () => {
    setIsOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    setIsOver(false);
    onDrop(e, 'BACKLOG');
  };

  return (
    <div 
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      className={`w-72 flex-shrink-0 bg-white border-r border-slate-200 flex flex-col overflow-hidden transition-colors ${isOver ? 'bg-blue-50/50' : ''}`}
    >
      <div className="p-4 border-b border-slate-200 flex items-center justify-between bg-slate-50/50">
        <div className="flex items-center gap-2">
          <Inbox size={18} className="text-slate-400" />
          <h2 className="font-semibold text-slate-700">New Items</h2>
          <span className="text-xs bg-slate-200 text-slate-600 px-2 py-0.5 rounded-full font-medium">
            {tasks.length}
          </span>
        </div>
      </div>
      
      <div className="p-4 space-y-2">
        <button
          onClick={onAddTask}
          className="w-full flex items-center justify-center gap-2 py-2 px-4 bg-white border-2 border-dashed border-slate-300 rounded-lg text-slate-500 hover:border-blue-400 hover:text-blue-500 hover:bg-blue-50 transition-all font-medium text-sm group"
        >
          <Plus size={18} className="transition-transform group-hover:rotate-90" />
          Create New Item
        </button>
        
        {isAdmin && (
          <button
            onClick={onCreateSprint}
            className="w-full flex items-center justify-center gap-2 py-2 px-4 bg-indigo-50 border border-indigo-100 rounded-lg text-indigo-600 hover:bg-indigo-600 hover:text-white transition-all font-bold text-xs"
          >
            <CalendarPlus size={16} />
            Create Sprint
          </button>
        )}
      </div>

      <div className="flex-1 overflow-y-auto px-4 pb-4">
        {tasks.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center opacity-40">
            <Inbox size={48} strokeWidth={1} className="mb-2" />
            <p className="text-sm">Inbox is empty</p>
          </div>
        ) : (
          tasks.map(task => (
            <TaskCard 
              key={task.id} 
              task={task} 
              assignees={assignees} 
              onDragStart={onDragStart} 
              onClick={onTaskClick} 
            />
          ))
        )}
      </div>
    </div>
  );
};

export default SidebarLeft;
