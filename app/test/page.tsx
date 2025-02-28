"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import TestContent from "@/components/TestContent";
import { useAuthStore } from "@/lib/store";

const Page = () => {
  const { userUid } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    if (!userUid) {
      router.push("/"); // Redirect to home if user logs out
    }
  }, [userUid, router]);

  return <TestContent />;
};

export default Page;
