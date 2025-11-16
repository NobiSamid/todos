"use client";

import LogIn from "./authentication/LogIn";
import SignUp from "./authentication/SignUp";

export default function Home() {
  return (
   <main>
    <div>
      <h1>wassaaaap</h1>
      <LogIn />
      <SignUp />
    </div>
   </main>
  );
}