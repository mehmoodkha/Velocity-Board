
import React from 'react';
import { X, Info, MousePointer2, Users, Layout, CheckCircle2, Zap } from 'lucide-react';

interface HelpModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const HelpModal: React.FC<HelpModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const sections = [
    {
      icon: Zap,
      title: "Quick Start",
      text: "Velocity Board is designed for speed. Create tasks in the left 'New Items' panel and drag them directly into the sprint board to activate them.",
      color: "text-blue-600",
      bg: "bg-blue-50"
    },
    {
      icon: Layout,
      title: "The Sprint Board",
      text: "Columns represent your workflow (To Do, In Progress, Review). Horizontal swimlanes help you visualize work distribution across the team.",
      color: "text-purple-600",
      bg: "bg-purple-50"
    },
    {
      icon: MousePointer2,
      title: "Interactions",
      text: "Drag cards to change status or reassign. Click any card to open the detail view where you can edit descriptions, story points, and PR links.",
      color: "text-orange-600",
      bg: "bg-orange-50"
    },
    {
      icon: Users,
      title: "Team Management",
      text: "Click the users icon in the sidebar to add, rename, or remove team members. Assignees update instantly across all active tasks.",
      color: "text-emerald-600",
      bg: "bg-emerald-50"
    }
  ];

  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh]">
        <div className="flex items-center justify-between p-6 border-b bg-slate-50/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-blue-200">
              <Info size={24} />
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-800 leading-tight">Velocity Board Guide</h2>
              <p className="text-sm text-slate-500 font-medium">Sprint Management & App Summary</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-slate-200 rounded-lg transition-colors text-slate-400">
            <X size={24} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-8">
          <div className="mb-8">
            <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-3">Overview</h3>
            <p className="text-slate-600 leading-relaxed bg-slate-50 p-4 rounded-xl border border-slate-100 italic">
              "Velocity Board is a high-performance, Jira-inspired sprint board built for agility. It streamlines the gap between backlog management and active execution with a fluid, drag-and-drop interface."
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {sections.map((section, idx) => (
              <div key={idx} className="flex gap-4">
                <div className={`flex-shrink-0 w-12 h-12 rounded-xl ${section.bg} ${section.color} flex items-center justify-center`}>
                  <section.icon size={24} />
                </div>
                <div className="space-y-1">
                  <h4 className="font-bold text-slate-800">{section.title}</h4>
                  <p className="text-sm text-slate-500 leading-relaxed">
                    {section.text}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-10 p-6 bg-slate-900 rounded-2xl text-white relative overflow-hidden">
            <div className="relative z-10 flex items-center justify-between">
              <div>
                <h4 className="font-bold text-lg mb-1">Ready to ship?</h4>
                <p className="text-slate-400 text-sm">Move items to 'Done' to archive them in the completion panel.</p>
              </div>
              <CheckCircle2 size={40} className="text-emerald-400 opacity-50" />
            </div>
            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 blur-3xl -mr-10 -mt-10 rounded-full" />
          </div>
        </div>

        <div className="p-6 border-t bg-slate-50/50 flex justify-center">
          <button
            onClick={onClose}
            className="px-8 py-2.5 bg-white border border-slate-200 text-slate-700 font-bold rounded-xl hover:bg-slate-50 hover:border-slate-300 transition-all shadow-sm"
          >
            Got it, thanks!
          </button>
        </div>
      </div>
    </div>
  );
};

export default HelpModal;
