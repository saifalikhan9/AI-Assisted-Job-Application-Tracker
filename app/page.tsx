import { cookies } from "next/headers";
import { verifyToken } from "@/lib/auth";

export default async function Home() {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;

  let isLoggedIn = false;

  if (token) {
    const decoded = verifyToken(token);
    if (decoded) {
      isLoggedIn = true;
    }
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 text-center">
      
      {/* Title */}
      <h1 className="text-4xl font-bold mb-4">
        AI Job Application Tracker 🚀
      </h1>

      {/* Subtitle */}
      <p className="text-lg text-gray-600 max-w-xl mb-8">
        Track your job applications in a smart Kanban board, 
        parse job descriptions using AI, and generate tailored 
        resume bullet points instantly.
      </p>

      {/* Buttons */}
      <div className="flex gap-4">
        {isLoggedIn ? (
          <a
            href="/dashboard"
            className="px-6 py-2 rounded-lg bg-primary text-white hover:bg-primary/90 transition"
          >
            Go to Dashboard
          </a>
        ) : (
          <>
            <a
              href="/auth/login"
              className="px-6 py-2 rounded-lg bg-primary text-white hover:bg-primary/90 transition"
            >
              Login
            </a>

            <a
              href="/auth/signup"
              className="px-6 py-2 rounded-lg border border-gray-300 hover:bg-gray-100 transition"
            >
              Sign Up
            </a>
          </>
        )}
      </div>

      {/* Hint */}
      <p className="text-sm text-gray-400 mt-6">
        {isLoggedIn
          ? "Continue managing your applications."
          : "Get started by creating an account and adding your first application."}
      </p>

    </div>
  );
}