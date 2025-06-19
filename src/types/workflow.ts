export type WorkflowStepStatus = "upcoming" | "current" | "complete";

export interface WorkflowStep {
  id: string;
  title: string;
  description: string;
  status: WorkflowStepStatus;
} 