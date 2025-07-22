import { NextRequest, NextResponse } from "next/server";

// 임시 메모리 DB (서버 재시작 시 초기화, globalThis에 저장)
let globalAny = globalThis as any;
if (!globalAny.todos) globalAny.todos = [];
if (!globalAny.idSeq) globalAny.idSeq = 1;
const todos: any[] = globalAny.todos;

export async function GET(req: NextRequest, { params }: { params: { tenantId: string } }) {
  const { tenantId } = params;
  const { searchParams } = new URL(req.url);
  const itemId = searchParams.get("itemId");
  if (itemId) {
    // 상세 조회
    const todo = todos.find(
      t => String(t.id) === String(itemId) && String(t.tenantId) === String(tenantId)
    );
    if (!todo) {
      return NextResponse.json({ message: "존재하지 않는 항목" }, { status: 404 });
    }
    return NextResponse.json(todo);
  } else {
    // 목록 조회
    const list = todos.filter(t => String(t.tenantId) === String(tenantId));
    return NextResponse.json(list);
  }
}

export async function POST(req: NextRequest, { params }: { params: { tenantId: string } }) {
  const { tenantId } = params;
  const body = await req.json();
  if (!body.name) {
    return NextResponse.json({ message: "name 필수" }, { status: 400 });
  }
  const todo = {
    id: String(globalAny.idSeq++),
    tenantId: String(tenantId),
    name: body.name,
    memo: "",
    imageUrl: "",
    isCompleted: false,
  };
  todos.push(todo);
  return NextResponse.json(todo);
}

export async function PATCH(req: NextRequest, { params }: { params: { tenantId: string } }) {
  const { tenantId } = params;
  const { searchParams } = new URL(req.url);
  const itemId = searchParams.get("itemId");
  if (!itemId) {
    return NextResponse.json({ message: "itemId 필수" }, { status: 400 });
  }
  const idx = todos.findIndex(
    t => String(t.id) === String(itemId) && String(t.tenantId) === String(tenantId)
  );
  if (idx === -1) {
    return NextResponse.json({ message: "존재하지 않는 항목" }, { status: 404 });
  }
  const body = await req.json();
  todos[idx] = {
    ...todos[idx],
    name: body.name,
    memo: body.memo,
    imageUrl: body.imageUrl,
    isCompleted: body.isCompleted,
  };
  return NextResponse.json(todos[idx]);
}

export async function DELETE(req: NextRequest, { params }: { params: { tenantId: string } }) {
  const { tenantId } = params;
  const { searchParams } = new URL(req.url);
  const itemId = searchParams.get("itemId");
  if (!itemId) {
    return NextResponse.json({ message: "itemId 필수" }, { status: 400 });
  }
  const idx = todos.findIndex(
    t => String(t.id) === String(itemId) && String(t.tenantId) === String(tenantId)
  );
  if (idx === -1) {
    return NextResponse.json({ message: "존재하지 않는 항목" }, { status: 404 });
  }
  todos.splice(idx, 1);
  return NextResponse.json({ message: "삭제 완료" });
} 