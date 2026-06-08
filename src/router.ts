import { createRouter, createWebHistory } from "vue-router";

import Default from "./layouts/Default.vue";
import Dashboard from "./pages/Dashboard.vue";

const routes = [
  {
    path: "/",
    component: Default,
    children: [
      {
        path: "",
        component: Dashboard,
        meta: {
          title: "Dashboard",
        },
      },
      {
        path: "invoice",
        component: () => import("./pages/Invoice.vue"),
        meta: { title: "Print Invoice" },
      },
    ],
  },
];

export const router = createRouter({
  history: createWebHistory(),
  routes,
});
