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

  // Logic to determine if nav should be shown
  // We show nav only on main directory pages, not inside an active chat session
  // But wait, in a multi-page app, we usually want the nav always visible unless it's a full-screen mode
  // The user wants features in pages, so let's keep nav visible on /, /rooms
  // And hide it when inside /rooms/[id] or /private/[id] if we want a clean chat experience
  
  const isInsideChat = pathname.startsWith("/rooms/") || pathname.startsWith("/private/");
  const showNav = !isInsideChat;

  return (
    <div className="flex h-dvh w-full overflow-hidden bg-background text-foreground">
      {/* Desktop Sidebar */}
      <AppSidebar className="hidden lg:flex" />

      {/* Main Screen Area */}
      <main
        className={`flex-1 flex flex-col overflow-auto hide-scrollbar relative lg:pb-0
          ${showNav ? "pb-[80px]" : "pb-0"}
        `}
      >
        {children}

        {/* Mobile Navigation */}
        {showNav && <MobileNav />}
      </main>
    </div>
  );
}
