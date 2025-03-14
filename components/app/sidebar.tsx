"use client";

import { Factory, LogOut, Monitor } from "lucide-react";
import { usePathname } from "next/navigation";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { useAuth } from "@/lib/context/auth-context";
import { cn } from "@/lib/utils";

// Elementos del menú principal
const items = [
  {
    title: "Monitor en tiempo real",
    url: "/monitorizacion",
    icon: Monitor,
  },
  {
    title: "Centros de trabajo",
    url: "/centros-de-trabajo",
    icon: Factory,
  },
];

export function AppSidebar() {
  const { logout } = useAuth();
  const pathname = usePathname();

  const handleLogout = () => {
    logout();
  };

  // Función para verificar si un elemento del menú está activo
  const isActive = (itemUrl: string) => {
    // Verifica si la ruta actual comienza con la URL del elemento del menú
    return pathname.startsWith(itemUrl);
  };

  return (
    <Sidebar>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Grupo Elemento</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => {
                const active = isActive(item.url);
                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild>
                      <a 
                        href={item.url} 
                        className={cn(
                          active && "bg-muted text-primary font-medium"
                        )}
                      >
                        <item.icon className={cn(active && "text-primary")} />
                        <span>{item.title}</span>
                      </a>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              onClick={handleLogout}
              className="hover:cursor-pointer"
            >
              <LogOut />
              <span>Cerrar sesión</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
