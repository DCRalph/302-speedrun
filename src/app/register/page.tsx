import { auth } from "~/server/auth";
import Register from "./Register";

export default async function Home() {
  const session = await auth();



  return (
      <Register />
  );
}
