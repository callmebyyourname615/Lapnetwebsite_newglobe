import { createRouter, createWebHistory, type RouteRecordRaw } from "vue-router";
import axios from "axios";

import {
  TOKEN_PREFIX,
  decodePathToken,
  encodePathToken,
} from "../utils/pathToken";

import product1 from "../Views/products/product1.vue";
import product2 from "../Views/products/product2.vue";
import product3 from "../Views/products/product3.vue";
import product4 from "../Views/products/product4.vue";

import membercardATM from "../Views/member/membercard/membercardATM.vue";
import membermobile_banking from "../Views/member/membercard/membermobile_banking.vue";
import membercrossborder from "../Views/member/membercard/membercrossborder.vue";
import Joinus from "../Views/joinus/joinus.vue";

import Board_director from "../Views/Aboutus/board_director/board_director.vue";
import Role from "../Views/Aboutus/role/role.vue";
import Vision from "../Views/Aboutus/vision/vision.vue";
import History from "../Views/Aboutus/history/history.vue";
import Contactus from "../Views/contact/contactus.vue";
import Operationstructure from "../Views/Aboutus/companystructure/operationstructure.vue";
import It from "../Views/Aboutus/companystructure/it.vue";
import Ceo from "../Views/Aboutus/companystructure/ceo.vue";

import Finance from "../Views/Aboutus/companystructure/finance.vue";
import Office from "../Views/Aboutus/companystructure/office.vue";
import Audit from "../Views/Aboutus/companystructure/audit.vue";

import Bloggridview from "../Views/blog/bloggrid/bloggridview.vue";
import Blogdetail from "../Views/blog/blogdetail/blogdetail.vue";

import Product6 from "../Views/products/product6.vue";
import Boarddirector_audit from "../Views/Aboutus/board_director/boarddirector_audit.vue";
import Boarddirector_policy from "../Views/Aboutus/board_director/boarddirector_policy.vue";
import Boarddirector_develop from "../Views/Aboutus/board_director/boarddirector_develop.vue";
import Boarddirector_risk from "../Views/Aboutus/board_director/boarddirector_risk.vue";
import Productqrpayment from "../Views/products/productqrpayment.vue";
import Companystructureimage from "../Views/Aboutus/companystructure/companystructureimage.vue";
import Companystructure from "../Views/Aboutus/companystructure/companystructure.vue";

import allproduct from "../Views/products/allproduct.vue";
import atmmockup from "../components/mockup/atmmockup.vue";
import testhome from "../Views/Homepage/testhome.vue";
import allbox from "../Views/Aboutus/companystructure/allbox.vue";
import testinfocomponent from "../Views/products/procomponent/testinfocomponent.vue";

declare global {
  interface Window {
    gtag?: (...args: any[]) => void;
  }
}

function normalizeApiBaseUrl(): string {
  const fallback = "http://localhost:3000";
  const raw = String(import.meta.env.VITE_API_BASE_URL || "").trim();

  if (!raw) {
    return fallback;
  }

  try {
    const url = new URL(raw);
    if (!["http:", "https:"].includes(url.protocol)) {
      return fallback;
    }

    return `${url.origin}${url.pathname}`.replace(/\/+$/, "");
  } catch {
    return fallback;
  }
}

const API_BASE_URL = normalizeApiBaseUrl();

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 5000,
  headers: {
    "Content-Type": "application/json",
  },
});

function safeStorageGet(storage: Storage, key: string): string | null {
  try {
    return storage.getItem(key);
  } catch {
    return null;
  }
}

function safeStorageSet(storage: Storage, key: string, value: string): void {
  try {
    storage.setItem(key, value);
  } catch {
    // Ignore storage write failure
  }
}

function getVisitorSessionId(): string {
  const key = "visitor_session_id";
  const cached = safeStorageGet(localStorage, key);

  if (cached) {
    return cached;
  }

  const created =
    typeof crypto !== "undefined" && typeof crypto.randomUUID === "function"
      ? crypto.randomUUID()
      : `${Date.now()}-${Math.random().toString(16).slice(2)}`;

  safeStorageSet(localStorage, key, created);
  return created;
}

async function trackVisitor(pageUrl: string, token?: string): Promise<void> {
  try {
    if (token) {
      const dedupeKey = `visitor_tracked_${token}`;
      if (safeStorageGet(sessionStorage, dedupeKey)) {
        return;
      }
      safeStorageSet(sessionStorage, dedupeKey, "1");
    }

    const session_id = getVisitorSessionId();

    await api.post("/api/visitors/track", {
      page_url: pageUrl,
      session_id,
    });
  } catch (error: any) {
    if (import.meta.env.DEV) {
      console.debug("visitor track failed:", error?.message || error);
    }
  }
}

const routes: RouteRecordRaw[] = [
  {
    path: "/t",
    name: "t",
    component: testinfocomponent,
  },
  {
    path: "/",
    name: "home",
    component: testhome,
  },
  {
    path: "/mockup",
    name: "atmmockup",
    component: atmmockup,
  },
  {
    path: "/products_service/allproduct",
    name: "allproduct",
    component: allproduct,
  },
  {
    path: "/products_service/atm-inquiry",
    name: "atm-inquiry",
    component: product1,
  },
  {
    path: "/products_service/atm-cash-withdraw",
    name: "atm-cash-withdraw",
    component: product2,
  },
  {
    path: "/products_service/atm-transfer",
    name: "atm-transfer",
    component: product3,
  },
  {
    path: "/products_service/mobile-transfer",
    name: "mobile-transfer",
    component: product4,
  },
  {
    path: "/products_service/qr-payment",
    name: "qrpayment",
    component: Productqrpayment,
  },
  {
    path: "/products_service/crossborder",
    name: "crossborder-overview",
    component: Product6,
  },
  {
    path: "/products_service/crossborder/:pair(kh-la|la-kh|th-la|la-th|vn-la|la-vn|ch-la|la-ch)",
    name: "crossborder-product",
    component: Product6,
  },
  {
    path: "/member/membercardATM",
    name: "membercardATM",
    component: membercardATM,
  },
  {
    path: "/member/mobile_banking",
    name: "mobile_banking",
    component: membermobile_banking,
  },
  {
    path: "/member/crossborder",
    name: "crossborder",
    component: membercrossborder,
  },
  {
    path: "/joinus",
    name: "joinus",
    component: Joinus,
  },
  {
    path: "/bloggrid",
    name: "BlogGrid",
    component: Bloggridview,
  },
  {
    path: "/blogdetail/:id",
    name: "BlogDetail",
    component: Blogdetail,
    props: true,
  },
  {
    path: "/aboutus/companystructure",
    name: "companystructure",
    component: Companystructure,
  },
  {
    path: "/aboutus/companystructureimage",
    name: "companystructureimage",
    component: Companystructureimage,
  },
  {
    path: "/company/lapnet",
    name: "lapnet",
    component: allbox,
  },
  {
    path: "/company/operation",
    name: "operation",
    component: Operationstructure,
  },
  {
    path: "/company/it",
    name: "it",
    component: It,
  },
  {
    path: "/company/ceo-cfo",
    name: "ceo",
    component: Ceo,
  },
  {
    path: "/company/finance",
    name: "finance",
    component: Finance,
  },
  {
    path: "/company/office",
    name: "office",
    component: Office,
  },
  {
    path: "/company/audit",
    name: "audit",
    component: Audit,
  },
  {
    path: "/aboutus/board_director",
    name: "board_director",
    component: Board_director,
  },
  {
    path: "/board_of_director/audit_committee",
    name: "board_directoraudit",
    component: Boarddirector_audit,
  },
  {
    path: "/board_of_director/policy_research_committee",
    name: "board_directorpolicy",
    component: Boarddirector_policy,
  },
  {
    path: "/board_of_director/develop_committee",
    name: "board_directordevelop",
    component: Boarddirector_develop,
  },
  {
    path: "/board_of_director/riskmanagemen_committee",
    name: "board_directorrisk",
    component: Boarddirector_risk,
  },
  {
    path: "/aboutus/role",
    name: "role",
    component: Role,
  },
  {
    path: "/aboutus/vision",
    name: "vision",
    component: Vision,
  },
  {
    path: "/aboutus/history",
    name: "history",
    component: History,
  },
  {
    path: "/contactus",
    name: "contactus",
    component: Contactus,
  },
  {
    path: "/r/:token(.*)",
    name: "masked",
    component: testhome,
    meta: { noMask: true },
  },
  {
    path: "/:pathMatch(.*)*",
    redirect: "/",
  },
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
});

let lastTrackedPage = "";

function trackPageView(fullPath: string): void {
  if (lastTrackedPage === fullPath) {
    return;
  }

  lastTrackedPage = fullPath;

  window.gtag?.("event", "page_view", {
    page_path: fullPath,
    page_location: `${window.location.origin}/#${fullPath}`,
    page_title: document.title,
  });
}

router.beforeEach(async (to) => {
  if (to.path.startsWith(TOKEN_PREFIX) && typeof to.params.token === "string") {
    const token = to.params.token;

    await trackVisitor(window.location.href, token);

    const decodedPath = decodePathToken(token);
    if (!decodedPath) {
      return { path: "/", replace: true };
    }

    return { path: decodedPath, replace: true };
  }

  return true;
});

router.afterEach((to) => {
  if (!(to.meta as { noMask?: boolean } | undefined)?.noMask) {
    const maskedHash = `#${TOKEN_PREFIX}${encodePathToken(to.fullPath)}`;

    if (window.location.hash !== maskedHash) {
      const newUrl = `${window.location.pathname}${window.location.search}${maskedHash}`;
      window.history.replaceState(window.history.state, "", newUrl);
    }
  }

  trackPageView(to.fullPath);
});

router.isReady().then(() => {
  trackPageView(router.currentRoute.value.fullPath);

  const hash = window.location.hash || "";
  if (hash.startsWith(`#${TOKEN_PREFIX}`)) {
    const token = hash.slice(`#${TOKEN_PREFIX}`.length);
    trackVisitor(window.location.href, token);
    const decodedPath = decodePathToken(token);
    if (decodedPath && decodedPath !== router.currentRoute.value.fullPath) {
      router.replace(decodedPath);
    }
  }
});

export default router;
