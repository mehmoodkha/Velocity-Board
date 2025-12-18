
import React, { useState } from 'react';
import { X, UserPlus, Trash2, Check, Edit2, ShieldCheck, ShieldAlert, Lock, Eye, EyeOff } from 'lucide-react';
import { Assignee } from '../types';
import Avatar from './Avatar';

interface TeamManagementModalProps {
  isOpen: boolean;
  onClose: () => void;
  assignees: Assignee[];
  currentUser: Assignee | null;
  onAdd: (name: string, password: string, role: 'ADMIN' | 'USER') => void;
  onUpdate: (id: string, updates: { name?: string; password?: string }) => void;
  onDelete: (id: string) => void;
}

const TeamManagementModal: React.FC<TeamManagementModalProps> = ({
  isOpen,
  onClose,
  assignees,
  currentUser,
  onAdd,
  onUpdate,
  onDelete,
}) => {
  const [newName, setNewName] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [newRole, setNewRole] = useState<'ADMIN' | 'USER'>('USER');
  const [showNewPassword, setShowNewPassword] = useState(false);
  
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState('');
  const [editPassword, setEditPassword] = useState('');
  const [showEditPassword, setShowEditPassword] = useState(false);

  const isAdmin = currentUser?.role === 'ADMIN';

  if (!isOpen) return null;

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (newName.trim() && newPassword.trim()) {
      onAdd(newName.trim(), newPassword.trim(), newRole);
      setNewName('');
      setNewPassword('');
      setShowNewPassword(false);
    }
  };

  const startEditing = (user: Assignee) => {
    if (!isAdmin) return;
    setEditingId(user.id);
    setEditName(user.name);
    setEditPassword(user.password || '');
    setShowEditPassword(false);
  };

  const saveEdit = (id: string) => {
    onUpdate(id, { name: editName, password: editPassword });
    setEditingId(null);
  };

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden flex flex-col max-h-[85vh]">
        <div className="flex items-center justify-between p-4 border-b bg-slate-50/50">
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-bold text-slate-800">Team Management</h2>
            {isAdmin && <span className="px-2 py-0.5 bg-orange-100 text-orange-600 text-[10px] font-bold rounded uppercase">Admin Access</span>}
          </div>
          <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-lg transition-colors">
            <X size={20} />
          </button>
        </div>

        {isAdmin ? (
          <div className="p-5 bg-slate-50 border-b">
            <form onSubmit={handleAdd} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-1">Full Name</label>
                  <input
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    placeholder="Enter name..."
                    className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none transition-all text-slate-900"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-1">Role</label>
                  <select 
                    value={newRole}
                    onChange={(e) => setNewRole(e.target.value as 'ADMIN' | 'USER')}
                    className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm font-semibold outline-none"
                  >
                    <option value="USER">Standard User</option>
                    <option value="ADMIN">Administrator</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-1">Password</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
                  <input
                    type={showNewPassword ? "text" : "password"}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Set user password..."
                    className="w-full pl-9 pr-10 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none transition-all text-slate-900"
                  />
                  <button 
                    type="button"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                  >
                    {showNewPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={!newName.trim() || !newPassword.trim()}
                className="w-full py-2.5 bg-blue-600 text-white rounded-lg text-sm font-bold hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2 shadow-lg shadow-blue-100"
              >
                <UserPlus size={16} /> Add Team Member
              </button>
            </form>
          </div>
        ) : (
          <div className="p-4 bg-blue-50/50 text-blue-600 text-xs font-medium flex gap-2 items-center">
            <ShieldAlert size={16} />
            Only Administrators can add or remove users.
          </div>
        )}

        <div className="flex-1 overflow-y-auto p-2 custom-scrollbar">
          {assignees.filter(u => u.id !== 'unassigned').map((user) => (
            <div
              key={user.id}
              className={`flex flex-col p-3 hover:bg-slate-50 rounded-xl transition-all group border border-transparent ${editingId === user.id ? 'bg-slate-50 border-slate-100' : ''}`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3 flex-1">
                  <Avatar src={user.avatar} alt={user.name} size="md" />
                  {editingId === user.id ? (
                    <div className="flex flex-col gap-2 flex-1 pr-4">
                      <div className="space-y-1">
                        <label className="text-[9px] font-bold text-slate-400 uppercase">Edit Name</label>
                        <input
                          autoFocus
                          value={editName}
                          onChange={(e) => setEditName(e.target.value)}
                          className="w-full px-2 py-1 bg-white border border-slate-200 rounded text-sm outline-none focus:ring-2 focus:ring-blue-500 text-slate-900"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[9px] font-bold text-slate-400 uppercase">Edit Password</label>
                        <div className="relative">
                          <input
                            type={showEditPassword ? "text" : "password"}
                            value={editPassword}
                            onChange={(e) => setEditPassword(e.target.value)}
                            className="w-full px-2 py-1 pr-8 bg-white border border-slate-200 rounded text-sm outline-none focus:ring-2 focus:ring-blue-500 text-slate-900"
                          />
                          <button 
                            type="button"
                            onClick={() => setShowEditPassword(!showEditPassword)}
                            className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400"
                          >
                            {showEditPassword ? <EyeOff size={14} /> : <Eye size={14} />}
                          </button>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="flex flex-col">
                      <span className="text-sm font-bold text-slate-700">{user.name}</span>
                      <div className="flex items-center gap-1">
                        {user.role === 'ADMIN' ? (
                          <span className="text-[9px] font-bold text-orange-500 uppercase flex items-center gap-0.5"><ShieldCheck size={10} /> Admin</span>
                        ) : (
                          <span className="text-[9px] font-bold text-slate-400 uppercase">Standard User</span>
                        )}
                        {user.id === currentUser?.id && <span className="text-[9px] font-bold text-blue-500 uppercase ml-1">(You)</span>}
                      </div>
                    </div>
                  )}
                </div>

                <div className="flex items-center gap-1">
                  {editingId === user.id ? (
                    <div className="flex gap-1">
                      <button onClick={() => saveEdit(user.id)} className="p-1.5 bg-emerald-100 text-emerald-700 hover:bg-emerald-200 rounded-lg transition-colors">
                        <Check size={18} />
                      </button>
                      <button onClick={() => setEditingId(null)} className="p-1.5 bg-slate-200 text-slate-600 hover:bg-slate-300 rounded-lg transition-colors">
                        <X size={18} />
                      </button>
                    </div>
                  ) : (
                    isAdmin && (
                      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={() => startEditing(user)}
                          className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors"
                          title="Edit User Info"
                        >
                          <Edit2 size={16} />
                        </button>
                        <button
                          onClick={() => onDelete(user.id)}
                          disabled={assignees.length <= 1 || user.id === currentUser?.id}
                          className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded disabled:opacity-0 transition-colors"
                          title="Remove User"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    )
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="p-4 border-t text-center bg-slate-50/50">
          <button
            onClick={onClose}
            className="w-full py-2 text-sm font-bold text-slate-600 hover:bg-slate-200 rounded-lg transition-all"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default TeamManagementModal;
