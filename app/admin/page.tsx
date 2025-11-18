import { redirect } from 'next/navigation';

export default function AdminPage() {
  // This page will be protected by the middleware
  // The middleware will handle redirects for non-admin users
  redirect('/admin/dashboard');
}
