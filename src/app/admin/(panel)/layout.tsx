import AdminNav from "@/components/admin/AdminNav";

export default function AdminPanelLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-[calc(100vh-120px)]">
      <AdminNav />
      <div className="flex-1 overflow-auto p-6">{children}</div>
    </div>
  );
}
