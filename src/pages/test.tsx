// frontend-final/src/pages/test.tsx
"use client";

import { useQuery } from "@tanstack/react-query";
import { useToastHandler } from "@/hooks/useToastHandler";

export default function TestPage() {
  const { showSuccess, showError } = useToastHandler();

  const { data, isLoading } = useQuery({
    queryKey: ["hello"],
    queryFn: async () => {
      await new Promise((res) => setTimeout(res, 1000));
      return "Hello from React Query!";
    },
  });

  return (
    <div className="p-6">
      <button
        onClick={() => showSuccess("Sonner works!")}
        className="px-4 py-2 bg-blue-600 text-white rounded-lg"
      >
        Show Toast
      </button>

      <div className="mt-4">{isLoading ? "Loading..." : <p>{data}</p>}</div>
    </div>
  );
}
