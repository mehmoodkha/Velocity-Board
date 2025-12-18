
import React from 'react';
import { Priority, Status, Assignee, Task, Sprint } from './types';
import { 
  AlertCircle, 
  ArrowDown, 
  ArrowUp, 
  CheckCircle2, 
  Circle, 
  Clock, 
  HelpCircle,
  LucideIcon
} from 'lucide-react';

const decodeVal = (s: string) => atob(s);

export const STATUS_CONFIG: Record<Status, { label: string; icon: LucideIcon; color: string }> = {
  BACKLOG: { label: 'New Items', icon: HelpCircle, color: 'text-slate-500' },
  TODO: { label: 'To Do', icon: Circle, color: 'text-blue-500' },
  IN_PROGRESS: { label: 'In Progress', icon: Clock, color: 'text-yellow-500' },
  REVIEW: { label: 'Review', icon: AlertCircle, color: 'text-purple-500' },
  DONE: { label: 'Done', icon: CheckCircle2, color: 'text-emerald-500' },
};

export const PRIORITY_CONFIG: Record<Priority, { label: string; icon: LucideIcon; color: string; bg: string }> = {
  LOW: { label: 'Low', icon: ArrowDown, color: 'text-slate-400', bg: 'bg-slate-100' },
  MEDIUM: { label: 'Medium', icon: Circle, color: 'text-blue-500', bg: 'bg-blue-50' },
  HIGH: { label: 'High', icon: ArrowUp, color: 'text-orange-500', bg: 'bg-orange-50' },
  CRITICAL: { label: 'Critical', icon: AlertCircle, color: 'text-red-600', bg: 'bg-red-50' },
};

export const INITIAL_SPRINTS: Sprint[] = [
  {
    id: 'sprint-98',
    name: 'Q3 Cleanup & Refactor',
    startDate: Date.now() - 45 * 86400000,
    endDate: Date.now() - 31 * 86400000,
    goal: 'Resolve technical debt in the mobile client and improve error logging.',
    status: 'PAST'
  },
  {
    id: 'sprint-99',
    name: 'Q4 Foundation',
    startDate: Date.now() - 14 * 86400000,
    endDate: Date.now() - 1 * 86400000,
    goal: 'Set up core architecture for the new API and user permissions.',
    status: 'PAST'
  },
  {
    id: 'sprint-100',
    name: 'Q4 Core Feature Push',
    startDate: Date.now(),
    endDate: Date.now() + 14 * 86400000,
    goal: 'Implement main dashboards and integrate real-time notifications.',
    status: 'ACTIVE'
  },
  {
    id: 'sprint-101',
    name: 'Q4 Optimization',
    startDate: Date.now() + 15 * 86400000,
    endDate: Date.now() + 29 * 86400000,
    goal: 'Performance tuning and scalability improvements for peak season.',
    status: 'FUTURE'
  }
];

export const ASSIGNEES: Assignee[] = [
  { 
    id: '1', 
    name: 'Mehmood', 
    avatar: 'https://picsum.photos/seed/mehmood/100', 
    password: decodeVal('IUFkbWluKjA='), 
    role: 'ADMIN' 
  },
  { 
    id: '2', 
    name: 'Jordan Smith', 
    avatar: 'https://picsum.photos/seed/jordan/100', 
    password: decodeVal('dXNlcjE='), 
    role: 'USER' 
  },
  { 
    id: '3', 
    name: 'Casey Chen', 
    avatar: 'https://picsum.photos/seed/casey/100', 
    password: decodeVal('dXNlcjI='), 
    role: 'USER' 
  },
  { 
    id: '4', 
    name: 'Sam Taylor', 
    avatar: 'https://picsum.photos/seed/sam/100', 
    password: decodeVal('dXNlcjM='), 
    role: 'USER' 
  },
  { 
    id: 'unassigned', 
    name: 'Unassigned', 
    avatar: 'https://picsum.photos/seed/na/100', 
    role: 'USER' 
  },
];

export const INITIAL_TASKS: Task[] = [
  // Sprint 100 (Active)
  { id: 'T-101', title: 'Implement Auth0 authentication', assigneeId: '1', priority: 'HIGH', points: 5, status: 'IN_PROGRESS', updatedAt: Date.now(), sprintId: 'sprint-100' },
  { id: 'T-102', title: 'Design system audit', assigneeId: '2', priority: 'MEDIUM', points: 3, status: 'TODO', updatedAt: Date.now(), sprintId: 'sprint-100' },
  { id: 'T-103', title: 'API performance optimization', assigneeId: '1', priority: 'CRITICAL', points: 8, status: 'REVIEW', updatedAt: Date.now(), sprintId: 'sprint-100' },
  { id: 'T-104', title: 'Refactor state management', assigneeId: '3', priority: 'MEDIUM', points: 5, status: 'TODO', updatedAt: Date.now(), sprintId: 'sprint-100' },
  { id: 'T-105', title: 'User feedback collection', assigneeId: '4', priority: 'LOW', points: 2, status: 'DONE', updatedAt: Date.now() - 2 * 86400000, sprintId: 'sprint-100' },
  
  // Backlog
  { id: 'T-106', title: 'New landing page UI', assigneeId: '1', priority: 'HIGH', points: 5, status: 'BACKLOG', updatedAt: Date.now() },
  { id: 'T-107', title: 'Fix navigation bug', assigneeId: '2', priority: 'HIGH', points: 2, status: 'BACKLOG', updatedAt: Date.now() },
  { id: 'T-108', title: 'Dark mode accessibility check', assigneeId: 'unassigned', priority: 'LOW', points: 1, status: 'BACKLOG', updatedAt: Date.now() },

  // Sprint 99 (Past)
  { id: 'T-090', title: 'Database schema migration', assigneeId: '1', priority: 'CRITICAL', points: 8, status: 'DONE', updatedAt: Date.now() - 15 * 86400000, sprintId: 'sprint-99' },
  { id: 'T-091', title: 'Mobile responsive fixes', assigneeId: '1', priority: 'MEDIUM', points: 3, status: 'DONE', updatedAt: Date.now() - 14 * 86400000, sprintId: 'sprint-99' },
  { id: 'T-092', title: 'Analytics dashboard setup', assigneeId: '2', priority: 'HIGH', points: 5, status: 'DONE', updatedAt: Date.now() - 20 * 86400000, sprintId: 'sprint-99' },
  
  // Sprint 101 (Future)
  { id: 'T-110', title: 'Kafka producer optimization', assigneeId: '3', priority: 'HIGH', points: 13, status: 'TODO', updatedAt: Date.now(), sprintId: 'sprint-101' },
];
