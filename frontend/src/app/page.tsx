"use client"
import { useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import { redirect } from "next/navigation";

export default function Home() {
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    if (isAuthenticated) {
      redirect("/home");
    } else {
      redirect("/login");
    }
  }, [isAuthenticated]);


}
