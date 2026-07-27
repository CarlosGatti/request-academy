import type { LucideIcon } from "lucide-react";
import {
  BarChart3,
  BookOpen,
  Building2,
  FolderOpen,
  LayoutDashboard,
  Link2,
  Megaphone,
  Settings,
} from "lucide-react";

export type AdminNavItem = {
  href: string;
  label: string;
  exact?: boolean;
  icon: LucideIcon;
};

export type AdminNavGroup = {
  id: string;
  label: string;
  items: AdminNavItem[];
};

/**
 * Academy Operating System navigation — only implemented routes.
 * Paths preserved; labels may differ from legacy flat nav.
 *
 * Future Learning items (not yet implemented — do not add nav placeholders):
 * Career Journey, Certifications, Assessments, Badges.
 * Future Content: Templates, Media Library.
 * Future Community: Mentors, Learners.
 * Future Intelligence: Analytics, Reports (beyond Data Audit Lab).
 * Future Administration: Users, Roles, Branding (beyond Settings).
 */
export const adminNavGroups: AdminNavGroup[] = [
  {
    id: "dashboard",
    label: "Dashboard",
    items: [
      {
        href: "/admin",
        label: "Overview",
        exact: true,
        icon: LayoutDashboard,
      },
    ],
  },
  {
    id: "learning",
    label: "Learning",
    items: [{ href: "/admin/courses", label: "Programs", icon: BookOpen }],
  },
  {
    id: "content",
    label: "Content",
    items: [
      { href: "/admin/resources", label: "Resources", icon: FolderOpen },
    ],
  },
  {
    id: "community",
    label: "Community",
    items: [{ href: "/admin/partners", label: "Partners", icon: Building2 }],
  },
  {
    id: "growth",
    label: "Growth",
    items: [
      { href: "/admin/campaigns", label: "Campaigns", icon: Megaphone },
      { href: "/admin/short-links", label: "Short Links", icon: Link2 },
    ],
  },
  {
    id: "intelligence",
    label: "Intelligence",
    items: [
      { href: "/admin/data-audit", label: "Data Audit Lab", icon: BarChart3 },
    ],
  },
  {
    id: "administration",
    label: "Administration",
    items: [{ href: "/admin/settings", label: "Settings", icon: Settings }],
  },
];

export function isAdminNavActive(
  pathname: string,
  href: string,
  exact?: boolean,
) {
  if (exact) return pathname === href;
  return pathname === href || pathname.startsWith(`${href}/`);
}

/** Resolve section eyebrow for page headers from the current path. */
export function adminSectionLabel(pathname: string): string | undefined {
  for (const group of adminNavGroups) {
    for (const item of group.items) {
      if (isAdminNavActive(pathname, item.href, item.exact)) {
        return group.label;
      }
    }
  }
  if (pathname.startsWith("/admin/courses/")) return "Learning";
  return undefined;
}
