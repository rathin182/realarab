
import { LoginForm } from "./login-form";

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{
    error?: string;
    callbackUrl?: string;
  }>;
}) {
  const { error, callbackUrl } = await searchParams;

  const safeCallback =
    callbackUrl?.startsWith("/") &&
    !callbackUrl.startsWith("//")
      ? callbackUrl
      : undefined;

  return (
    <main className="mx-auto flex min-h-screen max-w-sm flex-col justify-center gap-4 p-6">
      <div className="space-y-2 text-center">
        <h1 className="text-2xl font-semibold">Welcome back</h1>
        <p className="text-sm text-gray-600">
          Log in to your RealArab account.
        </p>
      </div>

      {error && (
        <p role="alert" className="text-sm text-red-600">
          Sign-in failed. Please try again.
        </p>
      )}

      <LoginForm callbackUrl={safeCallback} />
    </main>
  );
}
