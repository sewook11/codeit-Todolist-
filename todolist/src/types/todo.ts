export interface Todo {
  id: number | string;
  tenantId?: string;
  name: string;
  memo?: string;
  imageUrl?: string;
  isCompleted: boolean;
  // 기존 로컬 상태 호환
  content?: string;
  completed?: boolean;
  createdAt?: string;
  updatedAt?: string;
} 