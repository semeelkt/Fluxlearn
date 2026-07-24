import { AdminSidebar } from "@/components/admin/admin-sidebar";

export default function AdminAppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen">
      <AdminSidebar />
      <main className="flex-1 px-10 py-10 max-w-6xl">{children}</main>
    </div>
  );
}
