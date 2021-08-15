import { createRouter, createWebHistory } from "vue-router";

import HomeComponent from "@/views/Home.vue";
import AppointmentsComponent from "@/views/Appointments.vue";
import CreateComponent from "@/views/Create.vue";

const routes = [
  {
    path: "/",
    name: "Home",
    component: HomeComponent,
  },
  {
    path: "/appointments",
    name: "Appointments",
    component: AppointmentsComponent,
  },
  {
    path: "/create",
    name: "Create",
    component: CreateComponent,
  },
];

const routing = createRouter({
  history: createWebHistory(),
  routes,
});

export default routing;
