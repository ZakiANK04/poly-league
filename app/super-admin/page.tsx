import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import SuperAdminDashboard from '@/components/SuperAdminDashboard';

export default async function SuperAdminPage() {
  const supabase = createClient();
  if (!supabase) redirect('/login');

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/login?next=/super-admin');

  const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).maybeSingle();
  if (profile?.role !== 'super_admin') redirect('/captain-portal');

  return <SuperAdminDashboard />;
}