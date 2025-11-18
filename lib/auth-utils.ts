"use client";

export async function isAdmin(): Promise<boolean> {
  // This function should only run on the client side
  if (typeof window === 'undefined') return false;

  try {
    const token = localStorage.getItem('token');
    if (!token) return false;

    const userData = localStorage.getItem('user');
    if (!userData) return false;

    const user = JSON.parse(userData);
    if (!user?.id) return false;

    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'}/api/users/${user.id}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      cache: 'no-store',
    });

    if (!response.ok) return false;

    const userDetails = await response.json();
    return userDetails.role === 'admin';
  } catch (error) {
    console.error('Error checking admin status:', error);
    return false;
  }
}

export function checkAdminSync(): boolean {
  if (typeof window === 'undefined') return false;
  
  try {
    const userData = localStorage.getItem('user');
    if (!userData) return false;
    
    const user = JSON.parse(userData);
    return user?.role === 'admin';
  } catch (error) {
    console.error('Error checking admin status:', error);
    return false;
  }
}
