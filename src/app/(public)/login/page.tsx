import { LoginForm } from "./login-form";

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; callbackUrl?: string }>;
}) {
  const { error, callbackUrl } = await searchParams;
  const safeCallback =
    callbackUrl?.startsWith("/") && !callbackUrl.startsWith("//") ? callbackUrl : undefined;

  return (
    <main className="mx-auto flex min-h-screen max-w-sm flex-col justify-center gap-4 p-6">
      <h1 className="text-2xl font-semibold">Admin login</h1>
      {error && <p className="text-sm text-red-600">Sign-in failed. Please try again.</p>}
      <LoginForm callbackUrl={safeCallback} />
    </main>
  );
}