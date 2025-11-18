// app/admin/layout.tsx
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const [isAuthorized, setIsAuthorized] = useState<boolean | null>(null);

  useEffect(() => {
    const checkAdminStatus = async () => {
      // Check if we're on the client side
      if (typeof window === 'undefined') return;

      try {
        const token = localStorage.getItem("token");
        if (!token) {
          throw new Error('No authentication token found');
        }

        const userData = localStorage.getItem("user");
        if (!userData) {
          throw new Error('No user data found');
        }

        const user = JSON.parse(userData);
        
        // For development, you can uncomment this to bypass the API check
        if (user.role === 'admin') {
          setIsAuthorized(true);
          return;
        }

        const response = await fetch(`/api/users/${user.id}`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          throw new Error('Failed to verify admin status');
        }

        const userDetails = await response.json();
        
        if (userDetails.role !== "admin") {
          throw new Error('Insufficient permissions');
        }

        setIsAuthorized(true);
      } catch (error) {
        console.error('Admin access denied:', error);
        // Clear any sensitive data
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        // Redirect to home page
        window.location.href = '/';
      }
    };

    checkAdminStatus();
  }, []);

  // Show loading state while checking auth status
  if (isAuthorized === null) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#141313]">
        <div className="flex flex-col items-center space-y-4">
          <Loader2 className="h-12 w-12 animate-spin text-teal-500" />
          <p className="text-gray-300">Verifying admin access...</p>
        </div>
      </div>
    );
  }

  // Only render children if authorized
  if (isAuthorized) {
    return (
      <div className="flex min-h-screen bg-[#141313] text-white">
        {children}
      </div>
    );
  }

  // This will be a brief flash before redirect happens
  return (
    <div className="min-h-screen bg-[#141313] flex items-center justify-center">
      <p className="text-gray-300">Redirecting...</p>
    </div>
  );
}