import type { Metadata } from "next";
import dynamic from "next/dynamic";
import { Suspense } from "react";
import Header from "../components/Header";
import GymList from "./GymList";

//const MainTab = dynamic(() => import("../components/Tab"));
// import DashboardFallback from "../components/DashboardFallback";
// import MainTabFallBack from "../components/MainTabFallBack";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
