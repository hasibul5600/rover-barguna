"use client";
import { usePathname } from "next/navigation";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
export default function SiteShell({children}:{children:React.ReactNode}){const pathname=usePathname();const isAdmin=pathname.startsWith("/admin");return <>{!isAdmin&&<Navbar/>}<main className={!isAdmin?"min-h-screen":""}>{children}</main>{!isAdmin&&<Footer/>}</>}
