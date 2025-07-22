const tenantId = "testTenant"; // 실제 환경에 맞게 관리

// 항목 목록 조회
export async function fetchTodos(page = 1, pageSize = 10) {
  const res = await fetch(`/api/${tenantId}/items?page=${page}&pageSize=${pageSize}`);
  if (!res.ok) throw new Error("목록 조회 실패");
  return await res.json();
}

// 항목 상세 조회
export async function fetchTodoDetail(itemId: number | string) {
  const res = await fetch(`/api/${tenantId}/items?itemId=${itemId}`);
  if (!res.ok) throw new Error("상세 조회 실패");
  return await res.json();
}

// 항목 등록
export async function addTodo(name: string) {
  const res = await fetch(`/api/${tenantId}/items`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name }),
  });
  if (!res.ok) throw new Error("등록 실패");
  return await res.json();
}

// 항목 수정
export async function updateTodo(itemId: number | string, data: { name: string; memo: string; imageUrl: string; isCompleted: boolean }) {
  const res = await fetch(`/api/${tenantId}/items?itemId=${itemId}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("수정 실패");
  return await res.json();
}

// 항목 삭제
export async function deleteTodo(itemId: number | string) {
  const res = await fetch(`/api/${tenantId}/items?itemId=${itemId}`, { method: "DELETE" });
  if (!res.ok) throw new Error("삭제 실패");
  return await res.json();
} 