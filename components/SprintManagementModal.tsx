
import React, { useState } from 'react';
import { X, Calendar, Plus, Edit2, Check, Trash2, Trophy, Clock, Play, History, ShieldAlert } from 'lucide-react';
import { Sprint, UserRole, SprintStatus } from '../types';

interface SprintManagementModalProps {
  isOpen: boolean;
  onClose: () => void;
  sprints: Sprint[];
  userRole: UserRole;
  onAddSprint: (sprint: Omit<Sprint, 'id'>) => void;
  onUpdateSprint: (id: string, updates: Partial<Sprint>) => void;
  onDeleteSprint: (id: string) => void;
}

const SprintManagementModal: React.FC<SprintManagementModalProps> = ({
  isOpen,
  onClose,
  sprints,
  userRole,
  onAddSprint,
  onUpdateSprint,
  onDeleteSprint,
}) => {
  const isAdmin = userRole === 'ADMIN';
  const [isCreating, setIsCreating] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  // Form State
  const [name, setName] = useState('');
  const [goal, setGoal] = useState('');
  const [startDate, setStartDate] = useState(new Date().toISOString().split('T')[0]);
  const [endDate, setEndDate] = useState(new Date(Date.now() + 14 * 86400000).toISOString().split('T')[0]);
  const [status, setStatus] = useState<SprintStatus>('FUTURE');

  if (!isOpen) return null;

  const resetForm = () => {
    setName('');
    setGoal('');
    setStartDate(new Date().toISOString().split('T')[0]);
    setEndDate(new Date(Date.now() + 14 * 86400000).toISOString().split('T')[0]);
    setStatus('FUTURE');
    setIsCreating(false);
    setEditingId(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const sprintData = {
      name,
      goal,
      startDate: new Date(startDate).getTime(),
      endDate: new Date(endDate).getTime(),
      status,
    };

    if (editingId) {
      onUpdateSprint(editingId, sprintData);
    } else {
      onAddSprint(sprintData);
    }
    resetForm();
  };

  const startEdit = (sprint: Sprint) => {
    setEditingId(sprint.id);
    setName(sprint.name);
    setGoal(sprint.goal);
    setStartDate(new Date(sprint.startDate).toISOString().split('T')[0]);
    setEndDate(new Date(sprint.endDate).toISOString().split('T')[0]);
    setStatus(sprint.status);
    setIsCreating(true);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-3xl overflow-hidden flex flex-col max-h-[90vh]">
        <div className="flex items-center justify-between p-6 border-b bg-slate-50/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-indigo-200">
              <Calendar size={20} />
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-800">Sprint Management</h2>
              <p className="text-xs text-slate-500 font-medium tracking-tight uppercase">Release Cycles & Timelines</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-slate-200 rounded-lg transition-colors text-slate-400">
            <X size={24} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
          {isAdmin && (
            <div className="mb-8">
              {!isCreating ? (
                <button
                  onClick={() => setIsCreating(true)}
                  className="w-full py-4 border-2 border-dashed border-slate-200 rounded-2xl flex items-center justify-center gap-2 text-slate-500 font-bold hover:border-indigo-400 hover:text-indigo-600 hover:bg-indigo-50 transition-all"
                >
                  <Plus size={20} /> Plan New Sprint
                </button>
              ) : (
                <form onSubmit={handleSubmit} className="bg-slate-50 border border-slate-200 p-6 rounded-2xl space-y-4 shadow-sm animate-in fade-in slide-in-from-top-4">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-bold text-slate-700">{editingId ? 'Edit Sprint' : 'Create New Sprint'}</h3>
                    <button type="button" onClick={resetForm} className="text-xs font-bold text-slate-400 hover:text-slate-600">Cancel</button>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-1">Sprint Name</label>
                      <input
                        required
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="e.g. Q4 Cleanup"
                        className="w-full px-4 py-2 bg-white border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-1">Status</label>
                      <select
                        value={status}
                        onChange={(e) => setStatus(e.target.value as SprintStatus)}
                        className="w-full px-4 py-2 bg-white border border-slate-200 rounded-xl text-sm font-semibold outline-none focus:ring-2 focus:ring-indigo-500"
                      >
                        <option value="FUTURE">Future (Planning)</option>
                        <option value="ACTIVE">Active (Current)</option>
                        <option value="PAST">Past (Archived)</option>
                      </select>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-1">Sprint Goal</label>
                    <textarea
                      value={goal}
                      onChange={(e) => setGoal(e.target.value)}
                      placeholder="What is the objective of this sprint?"
                      rows={2}
                      className="w-full px-4 py-2 bg-white border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 outline-none transition-all resize-none"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-1">Start Date</label>
                      <input
                        type="date"
                        value={startDate}
                        onChange={(e) => setStartDate(e.target.value)}
                        className="w-full px-4 py-2 bg-white border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-1">End Date</label>
                      <input
                        type="date"
                        value={endDate}
                        onChange={(e) => setEndDate(e.target.value)}
                        className="w-full px-4 py-2 bg-white border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100 flex items-center justify-center gap-2"
                  >
                    {editingId ? <Check size={18} /> : <Plus size={18} />}
                    {editingId ? 'Save Sprint Changes' : 'Plan Sprint'}
                  </button>
                </form>
              )}
            </div>
          )}

          {!isAdmin && (
            <div className="p-4 bg-amber-50 rounded-2xl border border-amber-100 flex items-center gap-3 text-amber-700 text-sm font-medium mb-6">
              <ShieldAlert size={18} />
              Sprint modifications are restricted to Administrators.
            </div>
          )}

          <div className="space-y-4">
            <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest px-1">Existing Sprints</h3>
            <div className="grid grid-cols-1 gap-3">
              {sprints.sort((a, b) => b.startDate - a.startDate).map(s => (
                <div key={s.id} className="p-5 border border-slate-200 rounded-2xl bg-white hover:border-indigo-300 transition-all group">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-4">
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${
                        s.status === 'ACTIVE' ? 'bg-blue-100 text-blue-600' : 
                        s.status === 'PAST' ? 'bg-slate-100 text-slate-500' : 'bg-emerald-100 text-emerald-600'
                      }`}>
                        {s.status === 'ACTIVE' ? <Play size={24} /> : s.status === 'PAST' ? <History size={24} /> : <Clock size={24} />}
                      </div>
                      <div>
                        <div className="flex items-center gap-3 mb-1">
                          <h4 className="font-bold text-slate-800 text-lg leading-tight">{s.name}</h4>
                          <span className={`px-2 py-0.5 rounded text-[8px] font-black uppercase tracking-tighter ${
                            s.status === 'ACTIVE' ? 'bg-blue-600 text-white' : 
                            s.status === 'PAST' ? 'bg-slate-400 text-white' : 'bg-emerald-600 text-white'
                          }`}>
                            {s.status}
                          </span>
                        </div>
                        <p className="text-sm text-slate-500 line-clamp-1 mb-2 italic">"{s.goal}"</p>
                        <div className="flex items-center gap-4 text-xs font-bold text-slate-400">
                          <span className="flex items-center gap-1"><Calendar size={12} /> {new Date(s.startDate).toLocaleDateString()} - {new Date(s.endDate).toLocaleDateString()}</span>
                        </div>
                      </div>
                    </div>
                    
                    {isAdmin && (
                      <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={() => startEdit(s)}
                          className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                        >
                          <Edit2 size={18} />
                        </button>
                        <button
                          onClick={() => { if(confirm('Delete this sprint? Tasks will be unassigned from it.')) onDeleteSprint(s.id); }}
                          className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="p-6 border-t bg-slate-50/50 flex justify-center">
          <button
            onClick={onClose}
            className="px-8 py-2.5 bg-white border border-slate-200 text-slate-700 font-bold rounded-xl hover:bg-slate-50 transition-all shadow-sm"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};

export default SprintManagementModal;
