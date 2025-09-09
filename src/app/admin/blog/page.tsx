import { redirect } from "next/navigation";
import Navbar from "~/components/Navbar";
import { auth } from "~/server/auth";
import AdminBlogManager from "./ui";

export default async function AdminBlogPage() {
  const session = await auth();
  if (!session?.user) redirect("/");
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <AdminBlogManager />
      </div>
    </div>
  );
}

