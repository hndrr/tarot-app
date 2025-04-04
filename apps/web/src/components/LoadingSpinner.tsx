"use client";

export default function LoadingSpinner() {
  return (
    <div className="flex flex-col items-center">
      <div className="w-10 h-10 border-4 border-purple-400 border-t-transparent rounded-full animate-spin"></div>
      <p className="mt-4 text-purple-200 text-lg">loading...</p>
    </div>
  );
}
