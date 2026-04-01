import { Gem } from "lucide-react";
import type { LucideIcon } from "lucide-react";

export interface WhitelabelConfig {
  brand: {
    /** App name rendered in the navbar, login page, and browser tab. */
    name: string;
    /** Short tagline shown on the login screen beneath the app name. */
    tagline: string;
    /** Lucide icon rendered as the brand logo. */
    icon: LucideIcon;
  };
  meta: {
    /** Full browser tab title. */
    title: string;
    /** Meta description used by search engines and link previews. */
    description: string;
  };
  company: {
    /** Primary domain used to generate placeholder email addresses (e.g. "acme.com"). */
    domain: string;
  };
  currency: {
    /** Singular unit name, e.g. "Carat". */
    singular: string;
    /** Plural unit name, e.g. "Carats". */
    plural: string;
  };
  /**
   * Product tags that users can attach to feature requests.
   * Keys become the values stored in the database — choose stable identifiers
   * (e.g. "JEWELRY"). Labels and colors are display-only and can change freely.
   * Tailwind color classes are safe to use; they are static strings included at
   * build time.
   */
  productTags: Record<string, { label: string; color: string }>;
  seed: {
    /** Email address for the seeded admin account. */
    adminEmail: string;
    /** Password for the seeded admin account. */
    adminPassword: string;
    /** Email address for the seeded regular user account. */
    userEmail: string;
    /** Password for the seeded regular user account. */
    userPassword: string;
    /** Company name shown for the seeded regular user. */
    userCompany: string;
  };
}

const config: WhitelabelConfig = {
  brand: {
    name: "Facet",
    tagline: "Manage Diamonds",
    icon: Gem,
  },
  meta: {
    title: "Facet — Feature Governance",
    description: "Crowdfund feature development with Carats",
  },
  company: {
    domain: "managediamonds.com",
  },
  currency: {
    singular: "Carat",
    plural: "Carats",
  },
  productTags: {
    WHITE_DIAMONDS: { label: "White Diamonds", color: "bg-slate-600 text-slate-100" },
    JEWELRY: { label: "Jewelry", color: "bg-purple-600 text-purple-100" },
    RFID: { label: "RFID", color: "bg-blue-600 text-blue-100" },
    MD_MOBILE: { label: "MD Mobile", color: "bg-orange-600 text-orange-100" },
    MD_COMMERCE: { label: "MD Commerce", color: "bg-pink-600 text-pink-100" },
    MD_CONNECT: { label: "MD Connect", color: "bg-cyan-600 text-cyan-100" },
  },
  seed: {
    adminEmail: "admin@managediamonds.com",
    adminPassword: "AdminFacet2025!",
    userEmail: "user@managediamonds.com",
    userPassword: "UserFacet2025!",
    userCompany: "Diamond Co.",
  },
};

export default config;
