"use client";

import { Suspense } from "react";
import LoginForm from "./Login.jsx";

export default function LoginAdminPage() {
  return (
    <Suspense fallback={<p>Loading...</p>}>
      <LoginForm />
    </Suspense>
  );
}
