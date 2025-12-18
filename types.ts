
export type Priority = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';

export type Status = 'BACKLOG' | 'TODO' | 'IN_PROGRESS' | 'REVIEW' | 'DONE';

export type UserRole = 'ADMIN' | 'USER';

export type SprintStatus = 'PAST' | 'ACTIVE' | 'FUTURE';

export interface Sprint {
  id: string;
  name: string;
  startDate: number;
  endDate: number;
  goal: string;
  status: SprintStatus;
}

export interface Assignee {
  id: string;
  name: string;
  avatar: string;
  password?: string;
  role: UserRole;
}

export interface Task {
  id: string;
  title: string;
  description?: string;
  prLink?: string;
  assigneeId: string;
  priority: Priority;
  points: number;
  status: Status;
  updatedAt: number;
  sprintId?: string; // Links task to a specific sprint
}

export type GroupBy = 'ASSIGNEE' | 'PRIORITY';

export interface SwimlaneData {
  id: string;
  label: string;
  icon?: string;
}
