import { NextResponse } from "next/server";
import withAuth from "@/middlewares/withAuth";

export function mainMiddleware() {
  const res = NextResponse.next();
  return res;
}

export default withAuth(mainMiddleware, [
  "root",
  "sa",
  "admin",
  "auth",
  "member",
  "kasir",
  "keuangankps",
  "personalia",
  "mgmkebun",
  "authenticated",
  "operatorsch",
  "newncil",
]);
export const config = {
  matcher: ["/", "/((?!_next|api|favicon.ico).*)"],
};