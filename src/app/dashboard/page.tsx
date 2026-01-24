'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function DashboardRedirectPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === 'loading') return; // Wait until session is loaded

    if (status === 'unauthenticated') {
      router.replace('/'); // Not logged in, send to home
      return;
    }

    const userRole = session?.user?.role;

    if (userRole === 'admin') {
      router.replace('/admin/dashboard');
    } else if (userRole === 'startup') {
      router.replace('/startup/dashboard');
    } else if (userRole === 'user') {
      const username = session?.user?.name || session?.user.username?.split('@')[0] || 'profile';
      router.replace(`/user/${encodeURIComponent(username)}`);
    } else {
      // Fallback for unknown roles or if role is not set
      router.replace('/');
    }
  }, [session, status, router]);

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
      <div>Loading...</div>
    </div>
  );
}
