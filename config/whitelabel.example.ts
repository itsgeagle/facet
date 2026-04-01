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
  seed: {
    adminEmail: "admin@managediamonds.com",
    adminPassword: "AdminFacet2025!",
    userEmail: "user@managediamonds.com",
    userPassword: "UserFacet2025!",
    userCompany: "Diamond Co.",
  },
};

export default config;
