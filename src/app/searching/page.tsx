"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

interface User {
  email: string;
}

export default function SearchPage() {
  const [searchEmail, setSearchEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<User | null>(null);
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSearch = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setResult(null);

    try {
      // Gửi yêu cầu tới API
      const res = await fetch("/api/searching", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: searchEmail }),
      });

      if (!res.ok) {
        const text = await res.text();
        console.log("Phản hồi từ API:", text);
        let errorMessage = "Lỗi không xác định từ server";
        try {
          const errorData = JSON.parse(text);
          errorMessage = errorData.message || "Lỗi không xác định";
        } catch {
          errorMessage = text || "Không tìm thấy người dùng";
        }
        console.log("Lỗi được ném:", errorMessage);
        throw new Error(errorMessage);
      }

      const data = await res.json();

      // Log dữ liệu trả về từ API để kiểm tra
      console.log("Dữ liệu trả về từ API:", data);

      if (!data || !data.user) {
        throw new Error("Dữ liệu trả về không hợp lệ từ server");
      }

      setResult(data.user);
    } catch (err: any) {
      const errorMessage = err instanceof Error ? err.message : "Đã xảy ra lỗi không xác định";
      setError(errorMessage);

      // Log lỗi để debug
      console.error("Chi tiết lỗi:", errorMessage, err instanceof Error ? err.stack : err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100">
      <div className="w-full max-w-md bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold mb-6 text-center">Tìm kiếm người dùng</h2>

        {error && <p className="text-red-500 text-center">{error}</p>}
        {result && (
          <div className="text-center p-4 bg-green-100 rounded">
            <p>Tìm thấy người dùng!</p>
            <p>Email: {result.email}</p>
          </div>
        )}

        <form onSubmit={handleSearch} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-gray-700">
              Nhập email cần tìm
            </label>
            <input
              id="email"
              type="email"
              value={searchEmail}
              onChange={(e) => setSearchEmail(e.target.value)}
              required
              className="w-full p-2 border border-gray-300 rounded mt-1"
              placeholder="example@domain.com"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
            disabled={loading}
          >
            {loading ? "Đang tìm kiếm..." : "Tìm kiếm"}
          </button>
        </form>

        <p className="mt-4 text-center">
          Quay lại{" "}
          <Link href="/" className="text-blue-500 hover:underline">
            Trang chủ
          </Link>
        </p>
      </div>
    </div>
  );
}
