
import React, { useState } from 'react';
import { LogIn, UserPlus, Zap, Lock, ShieldAlert } from 'lucide-react';
import { Assignee } from '../types';
import Avatar from './Avatar';

interface AuthModalProps {
  isOpen: boolean;
  assignees: Assignee[];
  onSelectUser: (user: Assignee) => void;
}

const AuthModal: React.FC<AuthModalProps> = ({ isOpen, assignees, onSelectUser }) => {
  const [selectedUser, setSelectedUser] = useState<Assignee | null>(null);
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedUser) return;
    
    if (selectedUser.password === password) {
      onSelectUser(selectedUser);
      setPassword('');
      setError('');
    } else {
      setError('Invalid password. Please try again.');
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900 overflow-hidden">
      {/* Background Decorative Elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden opacity-20 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-500 blur-[120px] rounded-full" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-500 blur-[120px] rounded-full" />
      </div>

      <div className="relative w-full max-w-md p-8 bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl shadow-2xl flex flex-col items-center">
        <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center text-white shadow-xl shadow-blue-500/20 mb-6">
          <Zap size={32} />
        </div>
        
        <h1 className="text-3xl font-bold text-white mb-2 text-center">Velocity Board</h1>
        <p className="text-slate-400 text-center mb-8">Secure login required to access the sprint board.</p>

        {!selectedUser ? (
          <div className="w-full space-y-3 max-h-[40vh] overflow-y-auto px-2 custom-scrollbar">
            {assignees.filter(u => u.id !== 'unassigned').map((user) => (
              <button
                key={user.id}
                onClick={() => setSelectedUser(user)}
                className="w-full flex items-center gap-4 p-4 bg-white/5 border border-white/10 rounded-2xl hover:bg-white/10 hover:border-white/20 transition-all group text-left"
              >
                <Avatar src={user.avatar} alt={user.name} size="lg" className="border-white/20" />
                <div className="flex flex-col items-start">
                  <span className="text-white font-bold group-hover:text-blue-400 transition-colors">{user.name}</span>
                  <span className="text-slate-500 text-[10px] font-bold uppercase tracking-widest">{user.role}</span>
                </div>
                <LogIn size={18} className="ml-auto text-slate-500 opacity-0 group-hover:opacity-100 transition-all transform translate-x-2 group-hover:translate-x-0" />
              </button>
            ))}
          </div>
        ) : (
          <form onSubmit={handleLogin} className="w-full space-y-6">
            <div className="flex items-center gap-4 p-4 bg-white/5 border border-white/10 rounded-2xl">
               <Avatar src={selectedUser.avatar} alt={selectedUser.name} size="md" />
               <div className="flex-1">
                 <p className="text-white font-bold leading-none">{selectedUser.name}</p>
                 <button 
                  type="button" 
                  onClick={() => {setSelectedUser(null); setPassword(''); setError('');}} 
                  className="text-blue-400 text-[10px] font-bold uppercase mt-1 hover:underline"
                 >
                   Change User
                 </button>
               </div>
               {/* Moved title to a wrapping span to fix TypeScript error on ShieldAlert icon */}
               {selectedUser.role === 'ADMIN' && (
                 <span title="Administrator">
                   <ShieldAlert size={16} className="text-orange-400" />
                 </span>
               )}
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-1">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                <input
                  type="password"
                  autoFocus
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white/10 transition-all"
                  placeholder="Enter password"
                />
              </div>
              {error && <p className="text-red-400 text-xs font-medium px-1 flex items-center gap-1"><ShieldAlert size={12} /> {error}</p>}
            </div>

            <button
              type="submit"
              className="w-full py-3.5 bg-blue-600 text-white rounded-xl font-bold shadow-lg shadow-blue-500/20 hover:bg-blue-700 transition-all flex items-center justify-center gap-2"
            >
              <LogIn size={18} /> Login to Dashboard
            </button>
          </form>
        )}

        <button className="mt-8 flex items-center gap-2 text-slate-400 hover:text-white transition-colors text-sm font-bold">
          <UserPlus size={16} /> New User? Contact Admin
        </button>
      </div>
    </div>
  );
};

export default AuthModal;
