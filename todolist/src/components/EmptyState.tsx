import React from "react";

export type EmptyStateProps = {
  type: "todo" | "done";
};

export default function EmptyState({ type }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-10 text-center text-slate-400 select-none">
      {type === "todo" ? (
        <img src="/img/empty-todo.svg" alt="할 일 없음" className="mx-auto w-40" />
      ) : (
        <img src="/img/empty-done.svg" alt="완료 없음" className="mx-auto w-40" />
      )}
      <div className="mt-4 text-base font-nanum font-bold">
        {type === "todo"
          ? "할 일이 없어요. TODO를 새롭게 추가해주세요!"
          : "아직 다 한 일이 없어요. 해야 할 일을 체크해보세요!"}
      </div>
    </div>
  );
} 