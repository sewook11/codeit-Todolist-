import { NextRequest, NextResponse } from "next/server";

// 상위 route.ts에서 임시 메모리 DB를 import (없으면 전역 공유)
// 실제로는 DB나 서비스 계층을 써야 함
let globalAny = globalThis as any;
if (!globalAny.todos) globalAny.todos = [];
const todos: any[] = globalAny.todos;

export async function GET(req: NextRequest, { params }: { params: { tenantId: string; itemId: string } }) {
  const { tenantId, itemId } = params;
  const todo = todos.find(
    t => String(t.id) === String(itemId) && String(t.tenantId) === String(tenantId)
  );
  if (!todo) {
    return NextResponse.json({ message: "존재하지 않는 항목" }, { status: 404 });
  }
  return NextResponse.json(todo);
} 