import { requireAdmin } from "@/lib/permissions";
import AdminPropertyForm from "./admin-property-form";

export default async function NewAdminPropertyPage() {
  await requireAdmin();

  return <AdminPropertyForm />;
}