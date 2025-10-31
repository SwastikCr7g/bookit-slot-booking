"use client";
import { useSearchParams, useRouter } from "next/navigation";

export default function ResultPage() {
  const searchParams = useSearchParams();
  const success = searchParams.get("success");
  const discount = searchParams.get("discount");
  const error = searchParams.get("error");
  const router = useRouter();

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 dark:bg-black">
      <main className="bg-white dark:bg-zinc-900 p-10 rounded-xl shadow-lg flex flex-col items-center max-w-lg w-full">
        <h1 className="text-3xl font-bold mb-4 text-center">
          {success === "1" ? "Booking Confirmed!" : "Booking Failed"}
        </h1>
        {success === "1" ? (
          <>
            <div className="text-green-600 text-lg mb-5">Your slot is booked successfully.</div>
            {discount && (
              <div className="text-blue-700 mb-4">Discount Applied: {discount}%</div>
            )}
            <button
              className="bg-blue-600 text-white py-2 px-5 rounded"
              onClick={() => router.push("/")}
            >
              Go Home
            </button>
          </>
        ) : (
          <>
            <div className="text-red-600 text-lg mb-5">Booking was not successful.</div>
            {error && (
              <div className="text-red-500 mb-4">Reason: {decodeURIComponent(error)}</div>
            )}
            <button
              className="bg-blue-600 text-white py-2 px-5 rounded"
              onClick={() => router.back()}
            >
              Try Again
            </button>
          </>
        )}
      </main>
    </div>
  );
}
