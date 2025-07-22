"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useTodoContext } from "@/context/TodoContext";
import Input from "@/components/Input";
import Button from "@/components/Button";
import Section from "@/components/Section";
import TodoCard from "@/components/TodoCard";
import EmptyState from "@/components/EmptyState";
import { fetchTodos, addTodo, updateTodo } from "@/api/todoApi";

export default function Home() {
  const { state, dispatch } = useTodoContext();
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [addLoading, setAddLoading] = useState(false);
  const [toggleLoadingId, setToggleLoadingId] = useState<string | null>(null);
  const router = useRouter();

  // 초기 로딩 시 목록 조회
  useEffect(() => {
    setLoading(true);
    fetchTodos()
      .then((data) => {
        dispatch({ type: "INIT", payload: data });
        setError("");
      })
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
    // eslint-disable-next-line
  }, []);

  // 할 일 추가 (API 연동)
  const handleAdd = async () => {
    if (!input.trim()) return;
    setAddLoading(true);
    try {
      const newTodo = await addTodo(input);
      dispatch({ type: "ADD", payload: newTodo });
      setInput("");
      setError("");
    } catch (e: any) {
      setError(e.message || "등록 실패");
    } finally {
      setAddLoading(false);
    }
  };

  // 엔터 입력 시 추가
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") handleAdd();
  };

  // 상태 토글 (API 연동)
  const toggleTodo = async (id: string) => {
    const todo = state.todos.find(t => String(t.id) === id);
    if (!todo) return;
    setToggleLoadingId(id);
    try {
      const updated = await updateTodo(id, {
        name: todo.name,
        memo: todo.memo || "",
        imageUrl: todo.imageUrl || "",
        isCompleted: !todo.isCompleted,
      });
      dispatch({ type: "UPDATE", payload: updated });
      setError("");
    } catch (e: any) {
      setError(e.message || "상태 변경 실패");
    } finally {
      setToggleLoadingId(null);
    }
  };

  // 상세 페이지 이동
  const goToDetail = (id: string) => {
    router.push(`/items/${id}`);
  };

  // 반응형 레이아웃
  return (
    <div className="w-full max-w-3xl mx-auto flex flex-col gap-8 pt-8 px-2 md:px-0">
      {/* 입력창 + 버튼 */}
      <div className="flex flex-col sm:flex-row items-center gap-4 w-full">
        <Input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="할 일을 입력해주세요"
          className="flex-1 min-w-0 text-lg"
          disabled={addLoading}
        />
        <Button
          onClick={handleAdd}
          size="md"
          variant="primary"
          className="min-w-[120px] drop-shadow-md"
          disabled={addLoading}
        >
          {addLoading ? "등록 중..." : "+ 추가하기"}
        </Button>
      </div>
      {/* 에러/로딩 표시 */}
      {loading && <div className="text-center text-slate-400">불러오는 중...</div>}
      {error && <div className="text-center text-rose-500">{error}</div>}
      {/* 컬럼(TO DO / DONE) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* TO DO 컬럼 */}
        <Section title="TO DO" color="lime">
          {state.todos.filter((t) => !t.isCompleted).length === 0 ? (
            <EmptyState type="todo" />
          ) : (
            state.todos
              .filter((t) => !t.isCompleted)
              .map((todo) => (
                <TodoCard
                  key={todo.id}
                  content={todo.name}
                  completed={todo.isCompleted}
                  onToggle={() => toggleTodo(String(todo.id))}
                  onClick={() => goToDetail(String(todo.id))}
                  disabled={toggleLoadingId === String(todo.id)}
                />
              ))
          )}
        </Section>
        {/* DONE 컬럼 */}
        <Section title="DONE" color="green">
          {state.todos.filter((t) => t.isCompleted).length === 0 ? (
            <EmptyState type="done" />
          ) : (
            state.todos
              .filter((t) => t.isCompleted)
              .map((todo) => (
                <TodoCard
                  key={todo.id}
                  content={todo.name}
                  completed={todo.isCompleted}
                  onToggle={() => toggleTodo(String(todo.id))}
                  onClick={() => goToDetail(String(todo.id))}
                />
              ))
          )}
        </Section>
      </div>
    </div>
  );
}
