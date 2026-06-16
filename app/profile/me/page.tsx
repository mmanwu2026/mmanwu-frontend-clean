// app/profile/me/page.tsx
import { redirect } from "next/navigation";
import { createServerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";

export default async function ProfileMeRedirect() {
  // Next.js 14: cookies() is async
  const cookieStore = await cookies();

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value;
        },
      },
    }
  );

  const {
    data: { session },
  } = await supabase.auth.getSession();

  // Not logged in → go to login
  if (!session?.user) {
    redirect("/login");
  }

  // Logged in → redirect to real profile
  redirect(`/profile/${session.user.id}`);
}
