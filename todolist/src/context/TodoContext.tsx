"use client";
import React, { createContext, useContext, useReducer, useEffect, Dispatch } from "react";
import type { Todo } from "@/types/todo";

// 상태 타입 정의
type State = {
  todos: Todo[];
};

// 액션 타입 정의
// INIT: 초기화, ADD: 추가, TOGGLE: 상태 토글, UPDATE: 수정, DELETE: 삭제
// payload는 각 액션에 맞는 데이터
type Action =
  | { type: "INIT"; payload: Todo[] }
  | { type: "ADD"; payload: Todo }
  | { type: "TOGGLE"; payload: string }
  | { type: "UPDATE"; payload: Todo }
  | { type: "DELETE"; payload: string };

// 초기 상태
const initialState: State = {
  todos: [],
};

// 리듀서 함수: 액션에 따라 상태를 변경
function todoReducer(state: State, action: Action): State {
  switch (action.type) {
    case "INIT":
      return { todos: action.payload };
    case "ADD":
      return { todos: [action.payload, ...state.todos] };
    case "TOGGLE":
      return {
        todos: state.todos.map((t) =>
          t.id === action.payload ? { ...t, completed: !t.completed, updatedAt: new Date().toISOString() } : t
        ),
      };
    case "UPDATE":
      return {
        todos: state.todos.map((t) => (t.id === action.payload.id ? { ...action.payload, updatedAt: new Date().toISOString() } : t)),
      };
    case "DELETE":
      return { todos: state.todos.filter((t) => t.id !== action.payload) };
    default:
      return state;
  }
}

// Context 생성
const TodoContext = createContext<{
  state: State;
  dispatch: Dispatch<Action>;
} | undefined>(undefined);

// Provider 컴포넌트: 전역 상태 제공
export function TodoProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(todoReducer, initialState);

  // localStorage에서 초기값 불러오기 (최초 1회)
  useEffect(() => {
    const stored = localStorage.getItem("todos");
    if (stored) {
      dispatch({ type: "INIT", payload: JSON.parse(stored) });
    }
  }, []);

  // todos 변경 시 localStorage에 저장
  useEffect(() => {
    localStorage.setItem("todos", JSON.stringify(state.todos));
  }, [state.todos]);

  return <TodoContext.Provider value={{ state, dispatch }}>{children}</TodoContext.Provider>;
}

// 커스텀 훅: Context 사용 편의 제공
export function useTodoContext() {
  const ctx = useContext(TodoContext);
  if (!ctx) throw new Error("useTodoContext must be used within TodoProvider");
  return ctx;
} 