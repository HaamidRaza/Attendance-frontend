import {
  LayoutGrid,
  CalendarCheck,
  History,
  Users,
  GraduationCap,
  UserCog,
} from "lucide-react";

export const navItems = [
  {
    to: "/dashboard",
    label: "Dashboard",
    mobileLabel: "Home",
    icon: LayoutGrid,
    roles: ["admin"],
  },
  {
    to: "/attendance",
    label: "Take Attendance",
    mobileLabel: "Attendance",
    icon: CalendarCheck,
    roles: ["admin", "teacher"],
  },
  {
    to: "/attendance/history",
    label: "Attendance History",
    mobileLabel: "History",
    icon: History,
    roles: ["admin", "teacher"],
  },
  {
    to: "/students",
    label: "Students",
    mobileLabel: "Students",
    icon: Users,
    roles: ["admin"],
  },
  {
    to: "/classes",
    label: "Classes",
    mobileLabel: "Classes",
    icon: GraduationCap,
    roles: ["admin"],
  },
  {
    to: "/users",
    label: "Teachers",
    mobileLabel: "Teachers",
    icon: UserCog,
    roles: ["admin"],
  },
];
