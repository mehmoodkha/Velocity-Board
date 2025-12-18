
import React, { useState, useMemo, useEffect } from 'react';
import { 
  Users, 
  Flag, 
  Calendar, 
  Settings, 
  Search, 
  Filter, 
  MoreHorizontal,
  Zap,
  HelpCircle,
  ChevronDown,
  History,
  Play,
  Settings2
} from 'lucide-react';
import { Task, Status, Priority, GroupBy, SwimlaneData, Assignee, Sprint } from './types';
import { INITIAL_TASKS, STATUS_CONFIG, ASSIGNEES, PRIORITY_CONFIG, INITIAL_SPRINTS } from './constants';
import SidebarLeft from './components/SidebarLeft';
import SidebarRight from './components/SidebarRight';
import TaskCard from './components/TaskCard';
import CreateTaskModal from './components/CreateTaskModal';
import TaskDetailModal from './components/TaskDetailModal';
import TeamManagementModal from './components/TeamManagementModal';
import SprintManagementModal from './components/SprintManagementModal';
import HelpModal from './components/HelpModal';
import MilestonesModal from './components/MilestonesModal';
import CalendarModal from './components/CalendarModal';
import AuthModal from './components/AuthModal';
import UserProfileModal from './components/UserProfileModal';
import Avatar from './components/Avatar';

const COLUMNS: Status[] = ['TODO', 'IN_PROGRESS', 'REVIEW', 'DONE'];

const App: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>(INITIAL_TASKS);
  const [assignees, setAssignees] = useState<Assignee[]>(ASSIGNEES);
  const [sprints, setSprints] = useState<Sprint[]>(INITIAL_SPRINTS);
  const [activeSprintId, setActiveSprintId] = useState<string>(
    INITIAL_SPRINTS.find(s => s.status === 'ACTIVE')?.id || INITIAL_SPRINTS[0].id
  );
  
  const [groupBy, setGroupBy] = useState<GroupBy>('ASSIGNEE');
  const [currentUser, setCurrentUser] = useState<Assignee | null>(null);
  
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isTeamModalOpen, setIsTeamModalOpen] = useState(false);
  const [isSprintModalOpen, setIsSprintModalOpen] = useState(false);
  const [isHelpModalOpen, setIsHelpModalOpen] = useState(false);
  const [isMilestonesModalOpen, setIsMilestonesModalOpen] = useState(false);
  const [isCalendarModalOpen, setIsCalendarModalOpen] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(true);
  const [isSprintSelectOpen, setIsSprintSelectOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  
  const [searchQuery, setSearchQuery] = useState('');
  const [draggedTaskId, setDraggedTaskId] = useState<string | null>(null);
  const [activeDropZone, setActiveDropZone] = useState<{status: Status, swimlaneId: string} | null>(null);

  useEffect(() => {
    const savedUser = localStorage.getItem('velocity_user');
    if (savedUser) {
      try {
        const user = JSON.parse(savedUser);
        setCurrentUser(user);
        setIsAuthModalOpen(false);
      } catch (e) {
        localStorage.removeItem('velocity_user');
      }
    }
  }, []);

  const currentSprint = useMemo(() => 
    sprints.find(s => s.id === activeSprintId) || sprints[0]
  , [sprints, activeSprintId]);

  const handleLogin = (user: Assignee) => {
    setCurrentUser(user);
    setIsAuthModalOpen(false);
    localStorage.setItem('velocity_user', JSON.stringify(user));
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setIsAuthModalOpen(true);
    setIsProfileModalOpen(false);
    localStorage.removeItem('velocity_user');
  };

  const filteredTasks = useMemo(() => {
    return tasks.filter(t => 
      t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.id.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [tasks, searchQuery]);

  const backlogTasks = filteredTasks.filter(t => t.status === 'BACKLOG' || !t.sprintId);
  const boardTasks = filteredTasks.filter(t => t.sprintId === activeSprintId && t.status !== 'DONE' && t.status !== 'BACKLOG');
  const completedTasks = filteredTasks.filter(t => t.sprintId === activeSprintId && t.status === 'DONE');

  const swimlanes: SwimlaneData[] = useMemo(() => {
    if (groupBy === 'ASSIGNEE') {
      return assignees.map(a => ({ id: a.id, label: a.name }));
    } else {
      return (Object.keys(PRIORITY_CONFIG) as Priority[]).reverse().map(p => ({ 
        id: p, 
        label: PRIORITY_CONFIG[p].label 
      }));
    }
  }, [groupBy, assignees]);

  // Sprint Handlers
  const handleAddSprint = (sprintData: Omit<Sprint, 'id'>) => {
    const newSprint: Sprint = {
      id: `sprint-${Date.now()}`,
      ...sprintData
    };
    setSprints(prev => [...prev, newSprint]);
  };

  const handleUpdateSprint = (id: string, updates: Partial<Sprint>) => {
    setSprints(prev => prev.map(s => s.id === id ? { ...s, ...updates } : s));
  };

  const handleDeleteSprint = (id: string) => {
    setSprints(prev => prev.filter(s => s.id !== id));
    if (activeSprintId === id) {
      const remaining = sprints.filter(s => s.id !== id);
      if (remaining.length > 0) setActiveSprintId(remaining[0].id);
    }
    setTasks(prev => prev.map(t => t.sprintId === id ? { ...t, sprintId: undefined, status: 'BACKLOG' } : t));
  };

  // Task Handlers
  const handleAddTask = (taskData: { title: string; assigneeId: string; priority: Priority; points: number }) => {
    const newTask: Task = {
      id: `T-${100 + tasks.length + 1}`,
      status: 'BACKLOG',
      updatedAt: Date.now(),
      ...taskData
    };
    setTasks([...tasks, newTask]);
  };

  const handleUpdateTask = (taskId: string, updates: Partial<Task>) => {
    setTasks(prev => prev.map(t => t.id === taskId ? { ...t, ...updates } : t));
  };

  const handleDeleteTask = (taskId: string) => {
    setTasks(prev => prev.filter(t => t.id !== taskId));
  };

  const handleAddAssignee = (name: string, password: string, role: 'ADMIN' | 'USER') => {
    if (currentUser?.role !== 'ADMIN') return;
    const newAssignee: Assignee = {
      id: `u-${Date.now()}`,
      name,
      avatar: `https://picsum.photos/seed/${name}/100`,
      password,
      role
    };
    setAssignees([...assignees, newAssignee]);
  };

  const handleUpdateAssignee = (id: string, updates: { name?: string; password?: string }) => {
    if (currentUser?.role !== 'ADMIN' && currentUser?.id !== id) return;
    
    setAssignees(prev => prev.map(a => {
      if (a.id === id) {
        const updated = { ...a, ...updates };
        if (updates.name) {
          updated.avatar = `https://picsum.photos/seed/${updates.name}/100`;
        }
        return updated;
      }
      return a;
    }));

    if (currentUser?.id === id) {
      const updatedUser = { ...currentUser, ...updates };
      if (updates.name) {
        updatedUser.avatar = `https://picsum.photos/seed/${updates.name}/100`;
      }
      setCurrentUser(updatedUser);
      localStorage.setItem('velocity_user', JSON.stringify(updatedUser));
    }
  };

  const handleDeleteAssignee = (id: string) => {
    if (currentUser?.role !== 'ADMIN') return;
    setAssignees(prev => prev.filter(a => a.id !== id));
    if (currentUser?.id === id) handleLogout();
  };

  const handleDragStart = (e: React.DragEvent, taskId: string) => {
    setDraggedTaskId(taskId);
    e.dataTransfer.setData('taskId', taskId);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e: React.DragEvent, status: Status, swimlaneId: string) => {
    e.preventDefault();
    setActiveDropZone({ status, swimlaneId });
  };

  const handleDragLeave = () => {
    setActiveDropZone(null);
  };

  const handleDrop = (e: React.DragEvent, status: Status, swimlaneId?: string) => {
    e.preventDefault();
    setActiveDropZone(null);
    const taskId = e.dataTransfer.getData('taskId') || draggedTaskId;
    if (!taskId) return;

    setTasks(prev => prev.map(t => {
      if (t.id === taskId) {
        const updates: Partial<Task> = { status, updatedAt: Date.now() };
        
        if (status !== 'BACKLOG') {
          updates.sprintId = activeSprintId;
        } else {
          updates.sprintId = undefined;
        }

        if (swimlaneId) {
          if (groupBy === 'ASSIGNEE') updates.assigneeId = swimlaneId;
          else updates.priority = swimlaneId as Priority;
        }
        return { ...t, ...updates };
      }
      return t;
    }));
    setDraggedTaskId(null);
  };

  const openTaskDetail = (task: Task) => {
    setSelectedTask(task);
  };

  return (
    <div className="flex h-screen w-full bg-slate-50 select-none overflow-hidden font-sans">
      {/* Navigation Rail */}
      <div className="w-16 flex-shrink-0 bg-slate-900 flex flex-col items-center py-6 gap-6 text-slate-400">
        <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white font-bold shadow-lg shadow-blue-500/20 mb-2">
          V
        </div>
        <div className="flex flex-col gap-4">
          <div className="p-2 bg-slate-800 rounded-lg text-white cursor-pointer hover:bg-slate-700 transition-colors" title="Sprint Overview">
            <Zap size={22} />
          </div>
          <div 
            className="p-2 hover:bg-slate-800 rounded-lg cursor-pointer transition-colors"
            onClick={() => setIsTeamModalOpen(true)}
            title="Team & User Management"
          >
            <Users size={22} />
          </div>
          <div 
            className="p-2 hover:bg-slate-800 rounded-lg cursor-pointer transition-colors"
            onClick={() => setIsSprintModalOpen(true)}
            title="Sprints & Release Management"
          >
            <Calendar size={22} />
          </div>
          <div 
            className="p-2 hover:bg-slate-800 rounded-lg cursor-pointer transition-colors"
            onClick={() => setIsMilestonesModalOpen(true)}
            title="Project Milestones"
          >
            <Flag size={22} />
          </div>
        </div>
        <div className="mt-auto flex flex-col gap-4">
          <div 
            className="p-2 hover:bg-slate-800 rounded-lg cursor-pointer transition-colors"
            onClick={() => setIsHelpModalOpen(true)}
            title="App Info & Help"
          >
            <HelpCircle size={22} />
          </div>
          <div className="p-2 hover:bg-slate-800 rounded-lg cursor-pointer transition-colors" title="Settings"><Settings size={22} /></div>
          
          <button 
            onClick={() => setIsProfileModalOpen(true)}
            className="transition-transform hover:scale-110 active:scale-95"
            title="View Profile & History"
          >
            <Avatar 
              src={currentUser?.avatar || "https://picsum.photos/seed/na/100"} 
              alt={currentUser?.name || "User"} 
              size="md" 
              className={currentUser ? (currentUser.role === 'ADMIN' ? "border-orange-500 border-2" : "border-blue-500 border-2") : ""}
            />
          </button>
        </div>
      </div>

      {/* Main Backlog (Left) */}
      <SidebarLeft 
        tasks={backlogTasks} 
        assignees={assignees}
        onAddTask={() => setIsCreateModalOpen(true)}
        onDragStart={handleDragStart}
        onDrop={(e, status) => handleDrop(e, status)}
        onTaskClick={openTaskDetail}
      />

      {/* Main Board Area */}
      <div className="flex-1 flex flex-col min-w-0 bg-white">
        {/* Sprint Header */}
        <header className="p-6 border-b border-slate-200 bg-white z-30">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <nav className="text-xs font-medium text-slate-400 flex items-center gap-2">
                <span>Projects</span> / <span>Velocity 2.0</span> / <span>Board</span>
              </nav>
              <div className="h-4 w-px bg-slate-200 mx-1" />
              
              {/* Sprint Switcher */}
              <div className="relative">
                <button 
                  onClick={() => setIsSprintSelectOpen(!isSprintSelectOpen)}
                  className="flex items-center gap-2 px-3 py-1.5 bg-slate-100 rounded-lg hover:bg-slate-200 transition-all group"
                >
                  {currentSprint.status === 'PAST' ? <History size={16} className="text-slate-400" /> : <Play size={16} className="text-blue-500" />}
                  <span className="text-sm font-bold text-slate-700">{currentSprint.name}</span>
                  <ChevronDown size={14} className={`text-slate-400 transition-transform ${isSprintSelectOpen ? 'rotate-180' : ''}`} />
                </button>

                {isSprintSelectOpen && (
                  <>
                    <div className="fixed inset-0 z-40" onClick={() => setIsSprintSelectOpen(false)} />
                    <div className="absolute top-full left-0 mt-2 w-72 bg-white border border-slate-200 rounded-xl shadow-2xl z-50 overflow-hidden">
                      <div className="p-2 border-b bg-slate-50 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Select Sprint</div>
                      <div className="max-h-64 overflow-y-auto custom-scrollbar">
                        {sprints.map(s => (
                          <button
                            key={s.id}
                            onClick={() => {
                              setActiveSprintId(s.id);
                              setIsSprintSelectOpen(false);
                            }}
                            className={`w-full text-left p-3 hover:bg-slate-50 flex items-center justify-between border-b last:border-none ${activeSprintId === s.id ? 'bg-blue-50/50' : ''}`}
                          >
                            <div>
                              <p className={`text-sm font-bold ${activeSprintId === s.id ? 'text-blue-600' : 'text-slate-700'}`}>{s.name}</p>
                              <p className="text-[10px] text-slate-400 font-medium">
                                {new Date(s.startDate).toLocaleDateString()} - {new Date(s.endDate).toLocaleDateString()}
                              </p>
                            </div>
                            <span className={`px-2 py-0.5 rounded text-[8px] font-black uppercase tracking-tighter ${
                              s.status === 'ACTIVE' ? 'bg-blue-100 text-blue-600' : 
                              s.status === 'PAST' ? 'bg-slate-100 text-slate-500' : 'bg-emerald-100 text-emerald-600'
                            }`}>
                              {s.status}
                            </span>
                          </button>
                        ))}
                      </div>
                      <button 
                        onClick={() => {
                          setIsSprintSelectOpen(false);
                          setIsSprintModalOpen(true);
                        }}
                        className="w-full py-3 bg-slate-50 text-indigo-600 text-xs font-bold flex items-center justify-center gap-2 hover:bg-indigo-50 transition-colors"
                      >
                        <Settings2 size={14} /> Manage Sprints
                      </button>
                    </div>
                  </>
                )}
              </div>
            </div>

            <div className="flex items-center gap-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                <input 
                  type="text" 
                  placeholder="Search issues..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9 pr-4 py-1.5 bg-slate-100 border-none rounded-full text-sm w-48 focus:w-64 focus:ring-2 focus:ring-blue-500 transition-all outline-none"
                />
              </div>
              <button className="p-2 hover:bg-slate-100 rounded-lg text-slate-600"><Filter size={20} /></button>
              <button className="p-2 hover:bg-slate-100 rounded-lg text-slate-600"><MoreHorizontal size={20} /></button>
            </div>
          </div>

          <div className="flex items-end justify-between">
            <div>
              <div className="flex items-center gap-3 mb-1">
                <h1 className="text-2xl font-bold text-slate-900 tracking-tight">{currentSprint.name}</h1>
                <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                  currentSprint.status === 'ACTIVE' ? 'bg-blue-100 text-blue-700' : 
                  currentSprint.status === 'PAST' ? 'bg-slate-200 text-slate-600' : 'bg-emerald-100 text-emerald-700'
                }`}>
                  {currentSprint.status}
                </span>
              </div>
              <p className="text-sm text-slate-500 max-w-2xl leading-relaxed">
                <span className="font-semibold text-slate-400 mr-2">Goal:</span>
                {currentSprint.goal}
              </p>
            </div>
            
            <div className="flex items-center gap-4 bg-slate-50 p-2 rounded-lg border">
              <div className="flex flex-col items-center px-3 border-r border-slate-200">
                <span className="text-[10px] font-bold text-slate-400 uppercase">Dates</span>
                <span className="text-sm font-semibold">
                  {new Date(currentSprint.startDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - {new Date(currentSprint.endDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                </span>
              </div>
              <div className="flex flex-col items-center px-3">
                <span className="text-[10px] font-bold text-slate-400 uppercase">Status</span>
                <span className={`text-sm font-semibold ${currentSprint.status === 'ACTIVE' ? 'text-orange-600' : 'text-slate-500'}`}>
                  {currentSprint.status === 'ACTIVE' ? 'In Progress' : currentSprint.status === 'PAST' ? 'Closed' : 'Upcoming'}
                </span>
              </div>
            </div>
          </div>

          <div className="mt-6 flex items-center gap-4 border-t pt-4">
            <div className="flex items-center gap-2 bg-slate-100 p-1 rounded-lg">
              <button 
                onClick={() => setGroupBy('ASSIGNEE')}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-xs font-bold transition-all ${groupBy === 'ASSIGNEE' ? 'bg-white shadow text-slate-900' : 'text-slate-500 hover:text-slate-700'}`}
              >
                <Users size={14} /> Group by Assignee
              </button>
              <button 
                onClick={() => setGroupBy('PRIORITY')}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-xs font-bold transition-all ${groupBy === 'PRIORITY' ? 'bg-white shadow text-slate-900' : 'text-slate-500 hover:text-slate-700'}`}
              >
                <Flag size={14} /> Group by Priority
              </button>
            </div>
          </div>
        </header>

        {/* Board Surface */}
        <div className="flex-1 overflow-x-auto bg-slate-50/50">
          <div className="inline-flex min-w-full h-full">
            <div className="flex flex-col flex-1">
              <div className="flex sticky top-0 bg-slate-50/80 backdrop-blur-sm z-20 pt-4 px-4 border-b border-slate-200">
                <div className="w-48 flex-shrink-0" />
                {COLUMNS.map(status => {
                  const config = STATUS_CONFIG[status];
                  return (
                    <div key={status} className="flex-1 min-w-[280px] px-3 pb-3">
                      <div className="flex items-center gap-2 mb-2">
                        <config.icon className={config.color} size={16} />
                        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                          {config.label}
                        </h3>
                        <span className="ml-auto text-[10px] bg-slate-200 text-slate-600 px-1.5 py-0.5 rounded-full font-bold">
                          {tasks.filter(t => t.sprintId === activeSprintId && t.status === status).length}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="flex-1 overflow-y-auto px-4 pb-20">
                {swimlanes.map(lane => (
                  <div key={lane.id} className="flex border-b border-slate-100 last:border-none">
                    <div className="w-48 flex-shrink-0 sticky left-0 py-6 pr-4 bg-transparent z-10 flex items-start gap-3">
                      <div className="w-1 h-10 bg-blue-100 rounded-full mt-1" />
                      <div className="flex flex-col">
                        <span className="text-sm font-bold text-slate-800 line-clamp-2 leading-tight">{lane.label}</span>
                        <span className="text-[10px] font-bold text-slate-400 uppercase mt-1">
                          {tasks.filter(t => t.sprintId === activeSprintId && t.status !== 'DONE' && t.status !== 'BACKLOG' && (groupBy === 'ASSIGNEE' ? t.assigneeId === lane.id : t.priority === lane.id)).length} Issues
                        </span>
                      </div>
                    </div>

                    {COLUMNS.map(status => {
                      const tasksInCell = tasks.filter(t => 
                        t.sprintId === activeSprintId &&
                        t.status === status && 
                        (groupBy === 'ASSIGNEE' ? t.assigneeId === lane.id : t.priority === lane.id)
                      );
                      
                      const isActive = activeDropZone?.status === status && activeDropZone?.swimlaneId === lane.id;

                      return (
                        <div 
                          key={status} 
                          onDragOver={(e) => handleDragOver(e, status, lane.id)}
                          onDragLeave={handleDragLeave}
                          onDrop={(e) => handleDrop(e, status, lane.id)}
                          className={`flex-1 min-w-[280px] p-3 transition-colors ${isActive ? 'bg-blue-50/60' : 'hover:bg-slate-100/30'}`}
                        >
                          {tasksInCell.length === 0 ? (
                            <div className={`h-full min-h-[120px] border-2 border-dashed rounded-2xl transition-all flex items-center justify-center ${isActive ? 'border-blue-400 bg-blue-100/30' : 'border-transparent'}`}>
                              <span className={`text-[10px] font-bold uppercase text-slate-400 tracking-widest ${isActive ? 'opacity-100' : 'opacity-0'}`}>Release to move</span>
                            </div>
                          ) : (
                            tasksInCell.map(task => (
                              <TaskCard 
                                key={task.id} 
                                task={task} 
                                assignees={assignees}
                                onDragStart={handleDragStart} 
                                onClick={openTaskDetail}
                                isDragging={draggedTaskId === task.id}
                              />
                            ))
                          )}
                        </div>
                      );
                    })}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      <SidebarRight 
        tasks={completedTasks} 
        assignees={assignees}
        onDrop={handleDrop}
        onDragStart={handleDragStart}
        onTaskClick={openTaskDetail}
      />

      {/* Modals */}
      <AuthModal 
        isOpen={isAuthModalOpen} 
        assignees={assignees} 
        onSelectUser={handleLogin} 
      />

      <UserProfileModal
        isOpen={isProfileModalOpen}
        onClose={() => setIsProfileModalOpen(false)}
        user={currentUser}
        tasks={tasks}
        onLogout={handleLogout}
      />

      <CreateTaskModal 
        isOpen={isCreateModalOpen} 
        onClose={() => setIsCreateModalOpen(false)} 
        assignees={assignees}
        onSubmit={handleAddTask} 
      />

      <TaskDetailModal
        task={selectedTask}
        isOpen={!!selectedTask}
        onClose={() => setSelectedTask(null)}
        assignees={assignees}
        onUpdate={handleUpdateTask}
        onDelete={handleDeleteTask}
      />

      <TeamManagementModal
        isOpen={isTeamModalOpen}
        onClose={() => setIsTeamModalOpen(false)}
        assignees={assignees}
        currentUser={currentUser}
        onAdd={handleAddAssignee}
        onUpdate={handleUpdateAssignee}
        onDelete={handleDeleteAssignee}
      />

      <SprintManagementModal
        isOpen={isSprintModalOpen}
        onClose={() => setIsSprintModalOpen(false)}
        sprints={sprints}
        userRole={currentUser?.role || 'USER'}
        onAddSprint={handleAddSprint}
        onUpdateSprint={handleUpdateSprint}
        onDeleteSprint={handleDeleteSprint}
      />

      <HelpModal
        isOpen={isHelpModalOpen}
        onClose={() => setIsHelpModalOpen(false)}
      />

      <MilestonesModal
        isOpen={isMilestonesModalOpen}
        onClose={() => setIsMilestonesModalOpen(false)}
      />

      <CalendarModal
        isOpen={isCalendarModalOpen}
        onClose={() => setIsCalendarModalOpen(false)}
      />
    </div>
  );
};

export default App;
