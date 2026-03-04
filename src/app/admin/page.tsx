import { redirect } from "next/navigation";
import { isAdminAuthenticated } from "@/lib/admin-auth";
import { AdminPanel } from "@/components/admin/admin-panel";
import { folderProjects } from "@/lib/company-data";
import { getProjectFolderImages } from "@/lib/project-gallery";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Admin | Quality Road Intact Kft",
  robots: { index: false, follow: false },
};

export default async function AdminPage() {
  if (!(await isAdminAuthenticated())) {
    redirect("/admin/login");
  }

  const folderProjectsData = folderProjects.map((p) => ({
    id:      p.id,
    name:    p.name,
    folder:  p.folder,
    year:    p.year,
    summary: p.summary,
    logoSrc: p.logoSrc,
    tags:    [...p.tags] as string[],
    images:  getProjectFolderImages(p.folder),
  }));

  return <AdminPanel folderProjects={folderProjectsData} />;
}
