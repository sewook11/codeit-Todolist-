import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest, { params }: { params: { tenantId: string } }) {
  const formData = await req.formData();
  const file = formData.get("image");
  if (!file || !(file instanceof Blob)) {
    return NextResponse.json({ message: "image 파일이 필요합니다." }, { status: 400 });
  }
  // 파일 크기 제한 (5MB)
  if (file.size > 5 * 1024 * 1024) {
    return NextResponse.json({ message: "이미지 크기는 5MB 이하여야 합니다." }, { status: 400 });
  }
  // 임시: data URL로 반환 (실제 서비스에서는 파일 저장 후 URL 반환 필요)
  const arrayBuffer = await file.arrayBuffer();
  const base64 = Buffer.from(arrayBuffer).toString("base64");
  const mime = file.type || "image/png";
  const url = `data:${mime};base64,${base64}`;
  return NextResponse.json({ url });
} 