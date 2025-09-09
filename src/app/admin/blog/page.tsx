import { redirect } from "next/navigation";
import Navbar from "~/components/Navbar";
import { auth } from "~/server/auth";
import { api } from "~/trpc/server";
import AdminBlogManager from "./ui";

export default async function AdminBlogPage() {
  const session = await auth();
  if (!session?.user) redirect("/");
  // Just render the client UI; it will call APIs
  const { items } = await api.adminBlog.listAll({ limit: 20 });
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <AdminBlogManager initialPosts={items} />
      </div>
    </div>
  );
}

