
import React from 'react';
import { X, Flag, CheckCircle2, Circle, Clock, ChevronRight } from 'lucide-react';

interface MilestonesModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const MilestonesModal: React.FC<MilestonesModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const milestones = [
    { id: 1, title: 'Auth0 Integration', date: 'Oct 28, 2024', status: 'COMPLETED', progress: 100 },
    { id: 2, title: 'Beta Testing Phase', date: 'Nov 12, 2024', status: 'IN_PROGRESS', progress: 45 },
    { id: 3, title: 'Q4 Final Release', date: 'Dec 15, 2024', status: 'TODO', progress: 0 },
    { id: 4, title: 'Infrastructure Migration', date: 'Jan 20, 2025', status: 'TODO', progress: 0 },
  ];

  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden flex flex-col max-h-[85vh]">
        <div className="flex items-center justify-between p-5 border-b bg-slate-50/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-orange-500 rounded-xl flex items-center justify-center text-white shadow-lg shadow-orange-200">
              <Flag size={20} />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-800">Project Milestones</h2>
              <p className="text-xs text-slate-500 font-medium tracking-tight uppercase">Velocity 2.0 Roadmap</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-slate-200 rounded-lg transition-colors text-slate-400">
            <X size={20} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {milestones.map((m) => (
            <div key={m.id} className="group p-4 rounded-2xl border border-slate-100 bg-white hover:border-orange-200 hover:shadow-md transition-all cursor-default">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  {m.status === 'COMPLETED' ? (
                    <CheckCircle2 size={18} className="text-emerald-500" />
                  ) : m.status === 'IN_PROGRESS' ? (
                    <Clock size={18} className="text-orange-500" />
                  ) : (
                    <Circle size={18} className="text-slate-300" />
                  )}
                  <div>
                    <h3 className="font-bold text-slate-800 text-sm">{m.title}</h3>
                    <p className="text-xs text-slate-400 font-medium">{m.date}</p>
                  </div>
                </div>
                <ChevronRight size={16} className="text-slate-300 group-hover:text-orange-400 transition-colors" />
              </div>
              
              <div className="space-y-1.5">
                <div className="flex justify-between text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  <span>Progress</span>
                  <span>{m.progress}%</span>
                </div>
                <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                  <div 
                    className={`h-full transition-all duration-1000 ${m.status === 'COMPLETED' ? 'bg-emerald-500' : 'bg-orange-500'}`}
                    style={{ width: `${m.progress}%` }}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="p-4 border-t bg-slate-50/50">
          <button
            onClick={onClose}
            className="w-full py-2.5 bg-white border border-slate-200 text-slate-700 text-sm font-bold rounded-xl hover:bg-slate-50 transition-all shadow-sm"
          >
            Close View
          </button>
        </div>
      </div>
    </div>
  );
};

export default MilestonesModal;
