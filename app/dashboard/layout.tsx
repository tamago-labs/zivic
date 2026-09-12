import Sidebar from '@/components/dashboard/Sidebar';
import Topbar from '@/components/dashboard/Topbar';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-dark">
      <Sidebar />
      <div className="ml-56">
        <Topbar />
        <main className="p-6">{children}</main>
      </div>
    </div>
  );
}
