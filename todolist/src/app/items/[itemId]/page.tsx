"use client";
import { useRouter, useParams } from "next/navigation";
import { useState, useEffect, useRef } from "react";
import Button from "@/components/Button";
import Input from "@/components/Input";
import Checkbox from "@/components/Checkbox";
import MemoBox from "@/components/MemoBox";
import { useTodoContext } from "@/context/TodoContext";
import { fetchTodoDetail, updateTodo, deleteTodo } from "@/api/todoApi";

export default function TodoDetailPage() {
  const router = useRouter();
  const { itemId } = useParams<{ itemId: string }>();
  const [todo, setTodo] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    setLoading(true);
    fetchTodoDetail(itemId)
      .then(setTodo)
      .catch(() => {
        setError("존재하지 않는 항목입니다.");
        setTodo(null);
      })
      .finally(() => setLoading(false));
  }, [itemId]);

  const [content, setContent] = useState("");
  const [completed, setCompleted] = useState(false);
  const [memo, setMemo] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [imageUrl, setImageUrl] = useState<string | undefined>(undefined);
  const [imgError, setImgError] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [saveLoading, setSaveLoading] = useState(false);
  const [saveError, setSaveError] = useState("");
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [deleteError, setDeleteError] = useState("");
  const [imgUploading, setImgUploading] = useState(false);

  useEffect(() => {
    if (todo) {
      setContent(todo.name);
      setCompleted(todo.isCompleted);
      setMemo(todo.memo || "");
      setImageUrl(todo.imageUrl);
    }
  }, [todo]);

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!/^[a-zA-Z0-9_.-]+$/.test(file.name)) {
      setImgError("이미지 파일 이름은 영어, 숫자, 언더스코어, 하이픈, 점만 허용됩니다.");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setImgError("이미지 크기는 5MB 이하여야 합니다.");
      return;
    }
    setImgError("");
    setImgUploading(true);
    try {
      const formData = new FormData();
      formData.append("image", file);
      const res = await fetch("/api/testTenant/images/upload", {
        method: "POST",
        body: formData,
      });
      if (!res.ok) throw new Error("이미지 업로드 실패");
      const data = await res.json();
      setImageUrl(data.url);
      setImage(file);
    } catch (e: any) {
      setImgError(e.message || "이미지 업로드 실패");
      setImage(null);
      setImageUrl(undefined);
    } finally {
      setImgUploading(false);
    }
  };

  const handleImageRemove = () => {
    setImage(null);
    setImageUrl(undefined);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleSave = async () => {
    if (!todo) return;
    setSaveLoading(true);
    setSaveError("");
    try {
      await updateTodo(todo.id, {
        name: content,
        memo,
        imageUrl: imageUrl || "",
        isCompleted: completed,
      });
      router.push("/");
    } catch (e: any) {
      setSaveError(e.message || "수정 실패");
    } finally {
      setSaveLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!todo) return;
    setDeleteLoading(true);
    setDeleteError("");
    try {
      await deleteTodo(todo.id);
      router.push("/");
    } catch (e: any) {
      setDeleteError(e.message || "삭제 실패");
    } finally {
      setDeleteLoading(false);
    }
  };

  if (loading) return <div className="text-center mt-10">로딩 중...</div>;
  if (error) return <div className="text-center mt-10 text-rose-500">{error}</div>;
  if (!todo) return null;

  return (
    <div className="bg-white rounded-2xl border-2 border-slate-900 shadow-[4px_4px_0_0_#0F172A] p-8 max-w-3xl mx-auto mt-8">
      {/* 제목/체크박스 */}
      <div className="flex items-center gap-4 mb-8">
        <Checkbox checked={completed} onChange={setCompleted} />
        <Input
          value={content}
          onChange={e => setContent(e.target.value)}
          className="flex-1 text-xl font-bold bg-transparent border-none focus:ring-0 focus:border-none px-0"
          placeholder="할 일 제목을 입력하세요"
        />
      </div>
      {/* 2단 그리드 (이미지/메모) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* 이미지 업로드/미리보기 */}
        <div className="flex items-center justify-center">
          {imageUrl ? (
            <div className="relative w-full flex flex-col items-center">
              <img
                src={imageUrl}
                alt="첨부 이미지"
                className="rounded-xl border border-slate-200 object-contain max-h-64 w-full mx-auto"
              />
              {/* 연필(수정) 버튼 - 우측 하단 */}
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="absolute bottom-4 right-4 z-10"
                aria-label="이미지 수정"
              >
                <img src="/img/edit-round.svg" alt="이미지 수정" className="w-14 h-14" />
              </button>
              <Button
                variant="danger"
                size="sm"
                className="absolute top-2 right-2 z-10"
                onClick={handleImageRemove}
              >
                삭제
              </Button>
            </div>
          ) : (
            <div className="relative w-full aspect-square max-w-xs border-2 border-dashed border-slate-300 rounded-xl bg-slate-50 flex flex-col items-center justify-center">
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleImageChange}
              />
              {/* 플러스(추가) 버튼 - 우측 하단 */}
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="absolute bottom-4 right-4 z-10"
                aria-label="이미지 추가"
              >
                <img src="/img/plus-round.svg" alt="이미지 추가" className="w-14 h-14" />
              </button>
              <span className="text-slate-300 text-3xl absolute inset-0 flex items-center justify-center pointer-events-none">
                <img src="/img/img-placeholder.svg" alt="이미지 없음" className="w-12 h-12 opacity-60" />
              </span>
            </div>
          )}
          {imgError && <p className="text-xs text-rose-500 font-nanum mt-1">{imgError}</p>}
          {imgUploading && <p className="text-xs text-slate-400 font-nanum mt-1">이미지 업로드 중...</p>}
        </div>
        {/* 메모장 */}
        <MemoBox value={memo} onChange={setMemo} editable className="mt-2" />
      </div>
      {/* 버튼 영역 */}
      <div className="flex justify-end gap-4 mt-8">
        <Button variant="success" onClick={handleSave} size="md" className="px-8" disabled={saveLoading}>
          <span className="flex items-center gap-1">
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><circle cx="10" cy="10" r="10" fill="#fff"/><path d="M6 10.5L9 13.5L14 8.5" stroke="#222" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
            수정 완료
          </span>
        </Button>
        <Button variant="danger" onClick={handleDelete} size="md" className="px-8" disabled={deleteLoading}>
          <span className="flex items-center gap-1">
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><circle cx="10" cy="10" r="10" fill="#fff"/><path d="M6 14L14 6M6 6l8 8" stroke="#222" strokeWidth="2" strokeLinecap="round"/></svg>
            삭제하기
          </span>
        </Button>
      </div>
      {saveError && <div className="text-center text-rose-500 mt-2">{saveError}</div>}
      {deleteError && <div className="text-center text-rose-500 mt-2">{deleteError}</div>}
    </div>
  );
} 