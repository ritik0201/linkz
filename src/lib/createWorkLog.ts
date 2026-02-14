// Works both client-side and server-side.
// - Client: POSTs to `/api/workspace/logs/:projectId` (keeps existing behavior)
// - Server: writes directly to DB using the current server session (avoids internal fetch)

export async function createWorkLog({
  projectId,
  title,
  description,
}: {
  projectId: string;
  title: string;
  description?: string;
}) {
  // Server-side: create work log directly (no internal fetch, no extra auth needed)
  if (typeof window === "undefined") {
    const dbConnect = (await import("@/lib/dbConnect")).default;
    const WorkLog = (await import("@/models/WorkLog")).default;
    const { getServerSession } = await import("next-auth");
    const { authOptions } = await import("@/app/api/auth/[...nextauth]/route");

    const session = await getServerSession(authOptions);
    if (!session?.user?._id) {
      throw new Error("Unauthorized: no session user for server-side work log");
    }

    await dbConnect();

    const wl = await WorkLog.create({
      projectId,
      userId: session.user._id,
      title,
      description,
    });

    return wl;
  }

  // Client-side: keep existing behavior (call the logs API)
  const res = await fetch(`/api/workspace/logs/${projectId}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ title, description }),
  });

  if (!res.ok) {
    const data = await res.json().catch(() => null);
    throw new Error((data && data.error) || "Failed to create log");
  }

  return res.json();
}
