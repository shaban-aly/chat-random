"use client";

import { AppSidebar } from "@/features/random-chat/components/app-sidebar";
import { MobileNav } from "@/features/random-chat/components/mobile-nav";
import { usePathname } from "next/navigation";

export default function ChatLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  
  
  const isInsideChat = pathname.startsWith("/rooms/") || pathname.startsWith("/private/");
  const showNav = !isInsideChat;

  return (
    <div className="flex h-dvh w-full overflow-hidden bg-background text-foreground">
      {/* Desktop Sidebar */}
      <AppSidebar className="hidden lg:flex" />

      {/* Main Screen Area */}
      <main
        className={`flex-1 flex flex-col overflow-y-auto hide-scrollbar relative lg:pb-0
        ${showNav ? "pb-[100px]" : "pb-0"}
        `}
      >
        {children}

        {/* Mobile Navigation */}
        {showNav && <MobileNav />}
      </main>
    </div>
  );
}
