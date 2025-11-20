'use client';

import Sidebar from '@/components/Layout/Sidebar';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // DISABILITATO TEMPORANEAMENTE - così puoi usare l'app
  // La verifica auth verrà fatta dalle API stesse
  
  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <main className="flex-1 bg-[#F5F7FB]">
        {children}
      </main>
    </div>
  );
}
