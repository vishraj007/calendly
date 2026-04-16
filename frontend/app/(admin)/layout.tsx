import { AdminLayout } from "@/components/layout/AdminLayout";
import { Toaster } from "react-hot-toast";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Toaster
        position="top-right"
        toastOptions={{ duration: 4000 }}
      />
      <AdminLayout>{children}</AdminLayout>
    </>
  );
}