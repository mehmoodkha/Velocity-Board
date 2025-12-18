
import React, { useState } from 'react';
import { X } from 'lucide-react';
import { Priority, Assignee } from '../types';

interface CreateTaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  assignees: Assignee[];
  onSubmit: (task: { title: string; assigneeId: string; priority: Priority; points: number }) => void;
}

const CreateTaskModal: React.FC<CreateTaskModalProps> = ({ isOpen, onClose, assignees, onSubmit }) => {
  const [title, setTitle] = useState('');
  const [assigneeId, setAssigneeId] = useState(assignees[0]?.id || '');
  const [priority, setPriority] = useState<Priority>('MEDIUM');
  const [points, setPoints] = useState(3);

  // Sync assignee if the list changes or initially empty
  React.useEffect(() => {
    if (assignees.length > 0 && !assigneeId) {
      setAssigneeId(assignees[0].id);
    }
  }, [assignees, assigneeId]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    onSubmit({ title, assigneeId, priority, points });
    setTitle('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-md overflow-hidden">
        <div className="flex items-center justify-between p-4 border-b bg-slate-50/50">
          <h2 className="text-lg font-bold text-slate-800">Create New Item</h2>
          <button onClick={onClose} className="p-1 hover:bg-slate-100 rounded-lg transition-colors">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Title</label>
            <textarea
              required
              autoFocus
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:bg-white focus:border-transparent outline-none resize-none transition-all text-slate-900"
              placeholder="What needs to be done?"
              rows={3}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Assignee</label>
              <select
                value={assigneeId}
                onChange={(e) => setAssigneeId(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:bg-white outline-none transition-all text-slate-900"
              >
                {assignees.map(a => (
                  <option key={a.id} value={a.id}>{a.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Priority</label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value as Priority)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:bg-white outline-none transition-all text-slate-900"
              >
                <option value="LOW">Low</option>
                <option value="MEDIUM">Medium</option>
                <option value="HIGH">High</option>
                <option value="CRITICAL">Critical</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Story Points</label>
            <div className="flex gap-2">
              {[1, 2, 3, 5, 8, 13].map(p => (
                <button
                  key={p}
                  type="button"
                  onClick={() => setPoints(p)}
                  className={`flex-1 py-1.5 text-xs font-bold border rounded-lg transition-all ${points === p ? 'bg-blue-600 border-blue-600 text-white shadow-md' : 'bg-slate-50 border-slate-200 hover:border-slate-400 text-slate-600'}`}
                >
                  {p}
                </button>
              ))}
            </div>
          </div>

          <div className="pt-4 flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 font-bold text-slate-600 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 py-2.5 font-bold text-white bg-blue-600 rounded-lg hover:bg-blue-700 shadow-lg shadow-blue-200 transition-all flex items-center justify-center gap-2"
            >
              Create Item
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateTaskModal;
