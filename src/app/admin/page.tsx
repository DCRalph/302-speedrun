import { auth } from "~/server/auth";
import AdminHome from "./AdminHome";
import { UserRole } from "@prisma/client";
import { redirect } from "next/navigation";

export default async function Home() {
  const session = await auth();

  if (session?.user.role !== UserRole.ADMIN) {
    redirect("/");
  }

  return (
    <AdminHome />
  );
}
