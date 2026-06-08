<script setup lang="ts">
import { RouterView } from "vue-router";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarRail,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { LayoutDashboard, Printer } from "lucide-vue-next";
import Logo from "@/components/common/Logo.vue";
import ModeToggle from "@/components/common/ModeToggle.vue";
</script>

<template>
  <SidebarProvider>
    <Sidebar class="print:hidden">
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg">
              <div class="size-8">
                <Logo />
              </div>
              <div class="grid flex-1 text-left text-sm leading-tight">
                <span class="truncate font-semibold">Foam Crafts India</span>
                <span class="truncate text-xs">Ecosoft Mattress</span>
              </div>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton as-child>
                  <RouterLink to="/">
                    <LayoutDashboard />
                    <span>Dashboard</span>
                  </RouterLink>
                </SidebarMenuButton>
                <SidebarMenuButton as-child>
                  <RouterLink to="/invoice">
                    <Printer />
                    <span>Invoice</span>
                  </RouterLink>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter />
      <SidebarRail />
    </Sidebar>
    <SidebarInset>
      <header
        class="flex bg-sidebar justify-between print:hidden h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[[collapsible=icon]]/sidebar-wrapper:h-12 px-4 border-b"
      >
        <div class="flex items-center gap-2">
          <SidebarTrigger class="ml-1 cursor-pointer" />
          <span class="font-medium">{{ $route.meta.title }}</span>
        </div>

        <ModeToggle />
      </header>
      <div class="flex flex-1 flex-col gap-4">
        <RouterView />
      </div>
    </SidebarInset>
  </SidebarProvider>
</template>
