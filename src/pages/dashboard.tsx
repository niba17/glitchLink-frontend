import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/store/useAuthStore";

export default function Dashboard() {
  const { isLoggedIn } = useAuthStore();

  return (
    <div className="p-8 min-h-screen bg-white">
      <h1 className="text-3xl font-bold mb-6">Dashboard</h1>
      {!isLoggedIn ? (
        <p className="text-gray-600">Please login to see your dashboard.</p>
      ) : (
        <div>
          <p className="mb-4">Welcome back! Here is your dashboard overview.</p>
          <Button className="px-4 py-2">Create Short Link</Button>
        </div>
      )}
    </div>
  );
}
