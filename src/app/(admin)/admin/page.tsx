// src/app/(admin)/admin/page.tsx
// Redirect to dashboard
import { redirect } from "next/navigation";

export default function AdminPage() {
  redirect("/admin/dashboard");
}