import { NextResponse } from "next/server";
import prisma from "@/lib/prisma"; // Import PrismaClient từ file prisma.ts

export async function POST(request: Request) {
  try {
    // Lấy email từ request body
    const { email } = await request.json();

    if (!email) {
      return NextResponse.json(
        { message: "Vui lòng cung cấp email" },
        { status: 400 }
      );
    }

    // Log email để kiểm tra
    console.log("Tìm kiếm người dùng với email:", email);

    // Tìm user trong database bằng Prisma
    const user = await prisma.user.findUnique({
      where: { email },
      select: { email: true }, // Chỉ lấy field email (có thể thêm field khác nếu cần)
    });

    // Kiểm tra nếu không tìm thấy người dùng
    if (!user) {
      return NextResponse.json(
        { message: "Không tìm thấy người dùng với email này" },
        { status: 404 }
      );
    }

    // Trả về thông tin user
    return NextResponse.json(
      { user: { email: user.email } },
      { status: 200 }
    );
  } catch (error) {
    // Log lỗi chi tiết để dễ dàng debug
    console.error("Lỗi khi tìm kiếm:", error);

    // Trả về thông báo lỗi server nếu có ngoại lệ
    return NextResponse.json(
      { message: "Lỗi server, vui lòng thử lại sau" },
      { status: 500 }
    );
  }
}
