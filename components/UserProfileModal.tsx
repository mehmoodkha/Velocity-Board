
import React from 'react';
import { X, Trophy, History, CheckCircle2, LogOut, ChevronRight } from 'lucide-react';
import { Assignee, Task } from '../types';
import Avatar from './Avatar';
import { PRIORITY_CONFIG } from '../constants';

interface UserProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: Assignee | null;
  tasks: Task[];
  onLogout: () => void;
}

const UserProfileModal: React.FC<UserProfileModalProps> = ({ isOpen, onClose, user, tasks, onLogout }) => {
  if (!isOpen || !user) return null;

  const userTasks = tasks.filter(t => t.assigneeId === user.id);
  const completedTasks = userTasks.filter(t => t.status === 'DONE');
  const pastItems = completedTasks.sort((a, b) => b.updatedAt - a.updatedAt);
  const totalPoints = completedTasks.reduce((sum, t) => sum + t.points, 0);

  return (
    <div className="fixed inset-0 z-[90] flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden flex flex-col max-h-[90vh]">
        {/* Profile Header */}
        <div className="relative p-8 bg-slate-900 text-white overflow-hidden">
          <div className="absolute top-0 right-0 p-4 z-20">
            <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-xl transition-colors">
              <X size={24} />
            </button>
          </div>
          
          <div className="relative z-10 flex items-center gap-6">
            <Avatar src={user.avatar} alt={user.name} size="lg" className="w-24 h-24 border-4 border-white/10 shadow-2xl" />
            <div>
              <h2 className="text-2xl font-bold mb-1">{user.name}</h2>
              <p className="text-slate-400 text-sm font-medium uppercase tracking-widest">Engineering Team</p>
              <div className="mt-4 flex gap-4">
                <div className="bg-white/10 px-3 py-1.5 rounded-lg border border-white/5">
                  <span className="block text-[10px] font-bold text-slate-500 uppercase">Velocity</span>
                  <span className="text-lg font-bold text-emerald-400">{totalPoints} pts</span>
                </div>
                <div className="bg-white/10 px-3 py-1.5 rounded-lg border border-white/5">
                  <span className="block text-[10px] font-bold text-slate-500 uppercase">Completed</span>
                  <span className="text-lg font-bold text-blue-400">{completedTasks.length}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Background decoration */}
          <div className="absolute top-[-50%] right-[-10%] w-64 h-64 bg-blue-500/20 blur-[100px] rounded-full" />
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-8 bg-slate-50">
          <div className="flex items-center gap-2 mb-6">
            <History size={18} className="text-slate-400" />
            <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest">Past Completed Items</h3>
          </div>

          {pastItems.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-2xl border-2 border-dashed border-slate-200">
              <History size={48} strokeWidth={1} className="mx-auto text-slate-300 mb-2" />
              <p className="text-slate-500 font-medium">No history found</p>
            </div>
          ) : (
            <div className="space-y-3">
              {pastItems.map(task => (
                <div key={task.id} className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm hover:border-blue-300 transition-all flex items-center justify-between group cursor-default">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center flex-shrink-0">
                      <CheckCircle2 size={20} />
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-800 text-sm group-hover:text-blue-600 transition-colors line-clamp-1">{task.title}</h4>
                      <div className="flex items-center gap-3 mt-1">
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{task.id}</span>
                        <div className="w-1 h-1 rounded-full bg-slate-300" />
                        <span className="text-[10px] font-bold text-slate-500">{new Date(task.updatedAt).toLocaleDateString()}</span>
                        <div className="w-1 h-1 rounded-full bg-slate-300" />
                        <span className="text-[10px] font-bold text-blue-600">{task.points} pts</span>
                      </div>
                    </div>
                  </div>
                  <ChevronRight size={16} className="text-slate-300 group-hover:text-blue-500 transition-colors" />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-6 border-t bg-white flex justify-between items-center">
          <button
            onClick={onLogout}
            className="flex items-center gap-2 px-4 py-2 text-sm font-bold text-red-500 hover:bg-red-50 rounded-xl transition-all"
          >
            <LogOut size={18} /> Sign Out
          </button>
          <button
            onClick={onClose}
            className="px-8 py-2.5 bg-slate-900 text-white font-bold rounded-xl hover:bg-slate-800 transition-all shadow-lg shadow-slate-200"
          >
            Close Profile
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserProfileModal;
