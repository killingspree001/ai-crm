import { withAuth } from "next-auth/middleware";

export default withAuth({
  pages: { signIn: "/login" },
});

export const config = {
  // Protect all app routes except auth pages, API routes, and static assets.
  matcher: ["/((?!login|register|api|_next/static|_next/image|favicon.ico|.*\\.).*)"],
};
