<script setup>
import { ref, computed, watch, onMounted, nextTick } from "vue";
import { gsap } from "gsap";

import membercard from "../../../components/membercard/membercard.vue";
import logofootermembercardatm from "../../../components/footer/logomemberfooter/logofootermembercardatm.vue";
import secondfooter from "../../../components/footer/mainfooter/secondfooter.vue";
import main_navbar from "../../../components/miannavbar/main_navbar.vue";

/** ✅ API (env only - Vite)
 * Required in .env:
 *   VITE_API_BASE_URL=http://localhost:3000
 * 
 */

 console.log("[ENV] MODE =", import.meta.env.MODE);
console.log("[ENV] VITE_API_BASE_URL =", import.meta.env.VITE_API_BASE_URL);
console.log("[ENV] keys =", Object.keys(import.meta.env || {}));
function resolveEnvBaseUrl() {
  const raw = String(import.meta.env.VITE_API_BASE_URL || "").trim();
  return raw.replace(/\/+$/, "");
}

function normalizeBaseUrl(u) {
  return String(u || "").trim().replace(/\/+$/, "");
}

function joinBaseAndPath(baseUrl, path) {
  const b = normalizeBaseUrl(baseUrl);
  const p = String(path || "");

  if (!b) return p;

  // Prevent double "/api"
  // - If base ends with "/api" and path starts with "/api/..." => drop one
  if (b.endsWith("/api") && /^\/api(\/|$)/i.test(p)) {
    return b + p.replace(/^\/api/i, "");
  }

  if (!p) return b;
  if (p.startsWith("/")) return `${b}${p}`;
  return `${b}/${p}`;
}

const API_BASE = normalizeBaseUrl(resolveEnvBaseUrl());

// Asset base for images/files (strip trailing "/api" if env includes it)
const ASSET_BASE = API_BASE.endsWith("/api") ? API_BASE.slice(0, -4) : API_BASE;

// API endpoints
const MEMBERS_API_URL = joinBaseAndPath(API_BASE, "/api/members");

/** ✅ Footer logos (from API) */
const memberLogos = ref([]);

/** ✅ Members (from API) */
const members = ref([]);

/** ✅ Helpers */
const toNumber = (v) => {
  const n = Number(v);
  return Number.isFinite(n) ? n : null;
};

const pickMemberId = (item) => {
  return (
    toNumber(item?.membersid) ??
    toNumber(item?.memberid) ??
    toNumber(item?.memberId) ??
    toNumber(item?.idmember) ??
    toNumber(item?.idMember) ??
    toNumber(item?.id) ??
    toNumber(item?._id) ??
    null
  );
};

const extractImageString = (img) => {
  if (!img) return "";
  if (typeof img === "string") return img;

  if (Array.isArray(img)) {
    for (const it of img) {
      const s = extractImageString(it);
      if (s) return s;
    }
    return "";
  }

  const candidates = [
    img?.url,
    img?.path,
    img?.src,
    img?.image,
    img?.file,
    img?.filePath,
    img?.filename,
    img?.name,
    img?.download_url
  ];
  for (const c of candidates) {
    if (typeof c === "string" && c.trim()) return c;
  }
  if (img?.data) return extractImageString(img.data);

  return "";
};

// -------------------- Image URL normalization helpers --------------------
function isLoopbackHost(hostname) {
  const h = String(hostname || "").toLowerCase();
  return h === "localhost" || h === "127.0.0.1" || h === "0.0.0.0";
}

function isLikelyAssetPath(pathname) {
  const p = String(pathname || "");
  return (
    /^\/(uploads|upload|images|files|static)\b/i.test(p) ||
    p.includes("/uploads/") ||
    p.includes("/images/") ||
    p.includes("/files/")
  );
}

const ASSET_BASE_URL = (() => {
  try {
    return ASSET_BASE ? new URL(ASSET_BASE) : null;
  } catch {
    return null;
  }
})();

function rewriteBadAbsoluteToEnvBase(absoluteUrl) {
  try {
    const u = new URL(absoluteUrl);
    const fullPath = `${u.pathname || ""}${u.search || ""}`;

    // Rewrite when backend returns localhost (wrong outside local machine)
    if (isLoopbackHost(u.hostname)) {
      return ASSET_BASE ? joinBaseAndPath(ASSET_BASE, fullPath) : absoluteUrl;
    }

    // Rewrite when it looks like an asset path but host does not match our env asset base
    if (ASSET_BASE_URL && isLikelyAssetPath(u.pathname) && u.hostname !== ASSET_BASE_URL.hostname) {
      return joinBaseAndPath(ASSET_BASE, fullPath);
    }

    return absoluteUrl;
  } catch {
    return absoluteUrl;
  }
}

const resolveImage = (img) => {
  const s = extractImageString(img).trim();
  if (!s) return "";

  // Data URL
  if (/^data:image\//i.test(s)) return s;

  // Absolute URL
  if (/^https?:\/\//i.test(s)) return rewriteBadAbsoluteToEnvBase(s);

  // Absolute path from server (e.g. "/uploads/..") => use ASSET_BASE
  if (s.startsWith("/")) return joinBaseAndPath(ASSET_BASE, s);

  // Relative path (e.g. "uploads/..") => use ASSET_BASE
  return joinBaseAndPath(ASSET_BASE, "/" + s);
};

const extractLinkString = (v) => {
  if (!v) return "";
  if (typeof v === "string") return v;
  const candidates = [v?.url, v?.href, v?.link, v?.value];
  for (const c of candidates) {
    if (typeof c === "string" && c.trim()) return c;
  }
  return "";
};

const normalizeUrl = (u) => {
  const raw = extractLinkString(u).trim();
  if (!raw) return "";
  if (/^https?:\/\//i.test(raw)) return raw;
  if (raw.startsWith("//")) return `https:${raw}`;
  return `https://${raw.replace(/^\/+/, "")}`;
};

const getByPath = (obj, path) => {
  if (!obj || !path) return undefined;
  const parts = String(path).split(".");
  let cur = obj;
  for (const p of parts) {
    if (cur == null) return undefined;
    cur = cur[p];
  }
  return cur;
};

const pickFirstString = (item, paths) => {
  for (const p of paths) {
    const v = p.includes(".") ? getByPath(item, p) : item?.[p];
    const s = extractLinkString(v).trim();
    if (s) return s;
  }
  return "";
};

/** ✅ Convert DB hex to CSS hex (#RRGGBB) */
const normalizeHex = (c) => {
  if (c == null) return "";
  let s = String(c).trim();
  if (!s) return "";

  if (/^0x[0-9a-f]{6,8}$/i.test(s)) s = s.replace(/^0x/i, "#");

  if (/^#?[0-9a-f]{3,8}$/i.test(s)) {
    if (!s.startsWith("#")) s = `#${s}`;
    const hex = s.slice(1);

    if (hex.length === 3) {
      const r = hex[0],
        g = hex[1],
        b = hex[2];
      return `#${r}${r}${g}${g}${b}${b}`.toUpperCase();
    }

    if (hex.length === 6) return `#${hex}`.toUpperCase();

    if (hex.length === 8) return `#${hex.slice(2)}`.toUpperCase();

    return s.toUpperCase();
  }

  return s;
};

const buildLayer1FromColors = (primary, secondary) => {
  const p = normalizeHex(primary);
  const s = normalizeHex(secondary);

  if (!p && !s) {
    return "linear-gradient(#233f73, #1c335f) 50% 50%/calc(100% - 15px) calc(100% - 15px) no-repeat";
  }
  if (p && !s) {
    return `linear-gradient(${p}, ${p}) 50% 50%/calc(100% - 15px) calc(100% - 15px) no-repeat`;
  }
  if (!p && s) {
    return `linear-gradient(${s}, ${s}) 50% 50%/calc(100% - 15px) calc(100% - 15px) no-repeat`;
  }
  return `linear-gradient(${p}, ${s}) 50% 50%/calc(100% - 15px) calc(100% - 15px) no-repeat`;
};

const FILTER_CODE_ORDER = ["atm_inqury", "atm-transfer", "atm-transfer-card", "atm-cash-withdraw"];

const normKey = (s) =>
  String(s || "")
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "")
    .replace(/[_-]/g, "");

const FILTER_ALIASES = {
  atm_inqury: [
    "atm_inqury",
    "atm_inquiry",
    "atminquiry",
    "balanceinquiry",
    "balance_inquiry",
    "ກວດສອບຍອດເງິນຂ້າມທະນາຄານຜ່ານຕູ້atm"
  ],
  "atm-transfer": [
    "atm-transfer",
    "atm_transfer",
    "atmtransfer",
    "transfer",
    "ໂອນເງິນຂ້າມທະນາຄານຜ່ານຕູ້atm"
  ],
  "atm-transfer-card": [
    "atm-transfer-card",
    "atm_transfer_card",
    "atmtransfercard",
    "transfercard",
    "ໂອນເງິນຂ້າມທະນາຄານຜ່ານໂທລະສັບດ້ວຍເລກໜ້າບັດ"
  ],
  "atm-cash-withdraw": [
    "atm-cash-withdraw",
    "atm_cash_withdraw",
    "atmcashwithdraw",
    "cashwithdraw",
    "withdraw",
    "ຖອນເງິນສົດຂ້າມທະນາຄານຜ່ານຕູ້atm"
  ]
};

const isItemEnabled = (obj) => {
  if (!obj || typeof obj !== "object") return true;

  const candidates = [
    obj.enabled,
    obj.enable,
    obj.active,
    obj.isActive,
    obj.status,
    obj.available,
    obj.allow,
    obj.value,
    obj.flag
  ];

  const hasAnyFlag = candidates.some((v) => v !== undefined);
  if (!hasAnyFlag) return true;

  return candidates.some((v) => v === true || v === 1 || v === "1" || v === "true" || v === "Y" || v === "y");
};

const detectFilterCode = (raw) => {
  const nk = normKey(raw);
  if (!nk) return "";

  for (const code of FILTER_CODE_ORDER) {
    const aliases = FILTER_ALIASES[code] || [];
    const hit = aliases.some((a) => normKey(a) === nk);
    if (hit) return code;
  }
  return "";
};

const buildFiltersFromApi = (item) => {
  const rawItems =
    item?.CardATM?.items ??
    item?.CardAtm?.items ??
    item?.cardATM?.items ??
    item?.cardAtm?.items ??
    [];

  const arr = Array.isArray(rawItems) ? rawItems : [];
  const set = new Set();

  for (const it of arr) {
    if (typeof it === "string") {
      const code = detectFilterCode(it);
      if (code) set.add(code);
      continue;
    }

    if (it && typeof it === "object") {
      if (!isItemEnabled(it)) continue;

      const candidate =
        it.code ?? it.key ?? it.serviceCode ?? it.service ?? it.type ?? it.name ?? it.label ?? it.value ?? "";
      const code = detectFilterCode(candidate);
      if (code) set.add(code);
    }
  }

  return FILTER_CODE_ORDER.filter((c) => set.has(c));
};

async function fetchJson(url) {
  const res = await fetch(url, {
    method: "GET",
    cache: "no-store",
    headers: { Accept: "application/json" }
  });
  if (!res.ok) throw new Error(`API error: ${res.status}`);
  return res.json();
}

const mapApiMemberToCard = (item) => {
  const memberId = pickMemberId(item);

  const bankCode = String(item?.BankCode ?? item?.bankCode ?? item?.bank_code ?? "").trim();

  const title = String(item?.BanknameLA ?? item?.bankNameLA ?? item?.banknameLA ?? item?.bank_name_la ?? "").trim();

  const subtitle = String(
    item?.banknameEng ?? item?.BanknameEng ?? item?.BanknameEN ?? item?.bankNameEN ?? item?.bank_name_en ?? ""
  ).trim();

  const link1 = normalizeUrl(pickFirstString(item, ["LinkFB", "linkFB", "linkFb", "facebook", "fb", "LinkFacebook"]));

  const link2 = normalizeUrl(
    pickFirstString(item, [
      "linkweb",
      "linkWeb",
      "LinkWeb",
      "LinkWEB",
      "website",
      "Website",
      "web",
      "LinkWebsite",
      "linkWebsite",
      "urlWeb",
      "UrlWeb"
    ])
  );

  const img =
    item?.image_url ??
    item?.Image_url ??
    item?.imageUrl ??
    item?.image ??
    item?.logo ??
    item?.logo_img ??
    item?.member_logo ??
    "";
  const image = resolveImage(img) || "";

  const primary =
    item?.Color?.primary ??
    item?.color?.primary ??
    item?.colors?.primary ??
    item?.Colors?.primary ??
    item?.primary ??
    "";
  const secondary =
    item?.Color?.secondary ??
    item?.color?.secondary ??
    item?.colors?.secondary ??
    item?.Colors?.secondary ??
    item?.secondary ??
    "";

  const layer1 = buildLayer1FromColors(primary, secondary);

  const layer2 = "linear-gradient(321deg, transparent 0%, #b88a44 100%)";
  const layer3 = "linear-gradient(26deg, transparent 0%, #faf398 100%)";
  const layer4 = "linear-gradient(172deg, transparent 0%, #e0aa4e 100%)";
  const layer5 = "linear-gradient(270deg, transparent 0%, #f9f295 100%)";

  const filters = buildFiltersFromApi(item);

  return {
    memberId,
    bankCode,
    image,
    title,
    subtitle,
    link1,
    link2,
    layer1,
    layer2,
    layer3,
    layer4,
    layer5,
    filters
  };
};

async function loadMembersFromApi() {
  if (!API_BASE) {
    throw new Error("Missing VITE_API_BASE_URL in .env");
  }

  const json = await fetchJson(MEMBERS_API_URL);

  const list = Array.isArray(json)
    ? json
    : Array.isArray(json?.data)
    ? json.data
    : Array.isArray(json?.members)
    ? json.members
    : Array.isArray(json?.result)
    ? json.result
    : [];

  const onlyAtm = list.filter((it) => {
    const v = it?.memberATM ?? it?.MemberATM ?? it?.member_atm ?? it?.atmMember ?? 0;
    return v === 1 || v === "1" || v === true;
  });

  const mapped = onlyAtm.map(mapApiMemberToCard);

  mapped.sort((a, b) => {
    const A = a.memberId ?? 999999;
    const B = b.memberId ?? 999999;
    if (A !== B) return A - B;
    return String(a.bankCode).localeCompare(String(b.bankCode));
  });

  members.value = mapped;

  memberLogos.value = mapped
    .filter((m) => !!m.image)
    .map((m) => ({
      src: m.image,
      alt: m.title || m.bankCode || "Member"
    }));
}

/** ✅ Pagination / Filter UI */
const itemsPerPage = 5;
const currentPage = ref(1);

const searchQuery = ref("");
const selectedFilters = ref([]);

const filterOptions = [
  { label: "ເລືອກທັງໝົດ", value: "all" },
  { label: "ກວດສອບຍອດເງິນຂ້າມທະນາຄານຜ່ານຕູ້ ATM", value: "atm_inqury" },
  { label: "ໂອນເງິນຂ້າມທະນາຄານຜ່ານຕູ້ ATM", value: "atm-transfer" },
  { label: "ໂອນເງິນຂ້າມທະນາຄານຜ່ານໂທລະສັບດ້ວຍເລກໜ້າບັດ", value: "atm-transfer-card" },
  { label: "ຖອນເງິນສົດຂ້າມທະນາຄານຜ່ານຕູ້ ATM", value: "atm-cash-withdraw" }
];

const filteredMembers = computed(() => {
  const q = searchQuery.value.trim().toLowerCase();
  const activeFilters = selectedFilters.value;

  return members.value.filter((m) => {
    const title = (m.title || "").toLowerCase();
    const subtitle = (m.subtitle || "").toLowerCase();

    const matchesSearch = !q || title.includes(q) || subtitle.includes(q);
    if (!matchesSearch) return false;

    if (!activeFilters.length) return true;
    if (activeFilters.includes("all")) return true;

    const memberFilters = m.filters || [];
    return activeFilters.every((f) => memberFilters.includes(f));
  });
});

const totalPages = computed(() => Math.max(1, Math.ceil(filteredMembers.value.length / itemsPerPage)));

const paginatedMembers = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage;
  return filteredMembers.value.slice(start, start + itemsPerPage);
});

/** ✅ GSAP animation */
const cardsGridEl = ref(null);

const animateCards = () => {
  const grid = cardsGridEl.value;
  if (!grid) return;

  const cards = grid.children;
  if (!cards || !cards.length) return;

  gsap.killTweensOf(cards);
  gsap.fromTo(
    cards,
    { autoAlpha: 0, y: 24, scale: 0.96 },
    { autoAlpha: 1, y: 0, scale: 1, duration: 0.55, ease: "power2.out", stagger: 0.06 }
  );
};

function goToPage(p) {
  const next = Math.min(Math.max(1, p), totalPages.value);
  if (next === currentPage.value) return;
  currentPage.value = next;
}
function prevPage() {
  goToPage(currentPage.value - 1);
}
function nextPage() {
  goToPage(currentPage.value + 1);
}

/** ✅ checkbox logic */
const onFilterChange = (value, event) => {
  const checked = event.target.checked;

  if (value === "all") {
    if (checked) selectedFilters.value = filterOptions.map((o) => o.value);
    else selectedFilters.value = [];
  } else {
    if (selectedFilters.value.includes("all")) {
      selectedFilters.value = selectedFilters.value.filter((v) => v !== "all");
    }
  }
};

watch(totalPages, (tp) => {
  if (currentPage.value > tp) currentPage.value = tp;
});
watch(searchQuery, () => {
  currentPage.value = 1;
});
watch(selectedFilters, () => {
  currentPage.value = 1;
});
watch(currentPage, async () => {
  await nextTick();
  animateCards();
});
watch(filteredMembers, async () => {
  await nextTick();
  animateCards();
});

/** ✅ onMounted */
onMounted(async () => {
  window.scrollTo({ top: 0, left: 0, behavior: "smooth" });

  try {
    await loadMembersFromApi();
    currentPage.value = 1;
  } catch (e) {
    console.error("โหลด /api/members ไม่สำเร็จ:", e);
    members.value = [];
    memberLogos.value = [];
    currentPage.value = 1;
  }

  await nextTick();
  animateCards();
});
</script>

<template>
  <main_navbar
    title="ສະມາຊິກລະບົບບັດທະນາຄານຮ່ວມກັນ"
    :breadcrumb="['ໜ້າຫຼັກ', 'ສະມາຊິກ', 'ສະມາຊິກລະບົບບັດທະນາຄານຮ່ວມກັນ']"
    background-image="/member/membercard/membercrd-2.png"
  />
  <div class="boxmargin" style="width: 100%; height: 20vh"></div>

  <div class="membercardcontainer">
    <div class="leftsection">
      <div class="cardsgrid" ref="cardsGridEl">
        <membercard
          v-for="(m, idx) in paginatedMembers"
          :key="m.memberId ?? `${m.bankCode}-${idx}`"
          :image="m.image"
          :title="m.title"
          :subtitle="m.subtitle"
          :link1="m.link1"
          :link2="m.link2"
          :layer1="m.layer1"
          :layer2="m.layer2"
          :layer3="m.layer3"
          :layer4="m.layer4"
          :layer5="m.layer5"
        />
      </div>
    </div>

    <aside class="rightcontainer">
      <div class="filterPanel">

        <div class="panelStatusBar">
          <span class="statusDot"></span>
          <span class="statusLabel">FILTER SYSTEM</span>
          <span class="filterBadge">LAPNet</span>
        </div>

        <div class="panelTitleGroup">
          <h2 class="filterTitle">ຄົ້ນຫາທະນາຄານສະມາຊິກ</h2>
          <p class="filterSubtitle">ສະມາຊິກລະບົບບັດທະນາຄານຮ່ວມກັນ</p>
        </div>

        <div class="searchBox">
          <svg class="searchIcon" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="8.5" cy="8.5" r="5.5" stroke="currentColor" stroke-width="1.5"/>
            <path d="M13 13L17 17" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
          </svg>
          <input
            v-model="searchQuery"
            type="text"
            class="searchInput"
            placeholder="ຄົ້ນຫາທະນາຄານ..."
          />
        </div>

        <div class="filterDivider"></div>

        <div class="filterGroup">
          <div class="filterGroupHeader">
            <span class="filterGroupTitle">ໝວດໝູ່ການບໍລິການ</span>
            <span class="filterGroupHint">5 ລາຍການ</span>
          </div>

          <div class="filterChecks">
            <label v-for="opt in filterOptions" :key="opt.value" class="filterCheck">
              <input
                type="checkbox"
                :value="opt.value"
                v-model="selectedFilters"
                @change="onFilterChange(opt.value, $event)"
              />
              <span class="checkFake"><span class="checkTick">✓</span></span>
              <span class="checkLabel">{{ opt.label }}</span>
            </label>
          </div>
        </div>

        <div class="filterFooter">
          <p class="filterFooterText">
            <span class="promptCaret">&gt;</span>
            ຄົ້ນຫາພົບ <span class="filterFooterHighlight">{{ filteredMembers.length }}</span> ສະມາຊິກ
          </p>
        </div>

      </div>
    </aside>
  </div>

  <div class="paginationcontainer">
    <div class="pagerWrap" aria-label="Pagination">
      <button class="pagerBtn" :disabled="currentPage === 1" @click="prevPage" aria-label="Previous page">
        <span class="chev">‹</span>
        <span class="txt">Prev</span>
      </button>

      <div class="pagerPills" role="navigation" aria-label="Page numbers">
        <button
          v-for="p in totalPages"
          :key="p"
          class="pagePill"
          :class="{ active: p === currentPage }"
          @click="goToPage(p)"
          :aria-current="p === currentPage ? 'page' : undefined"
          :aria-label="`Go to page ${p}`"
        >
          {{ p }}
        </button>
      </div>

      <button class="pagerBtn" :disabled="currentPage === totalPages" @click="nextPage" aria-label="Next page">
        <span class="txt">Next</span>
        <span class="chev">›</span>
      </button>
    </div>
  </div>

  <div class="boxmargin" style="width: 100%; height: 15vh"></div>
  <logofootermembercardatm :logos="memberLogos" />
  <secondfooter />
</template>

<style scoped>
/* ✅ keep ALL your original styles (unchanged) */
.membercardcontainer {
  width: 90%;
  margin: 0 auto;
  display: flex;
  justify-content: space-between;
  gap: 18px;
  height: auto;
}
.leftsection {
  width: 55%;
  height: auto;
}
.rightcontainer {
  width: 42%;
  height: 700px;
  display: flex;
  align-items: stretch;
}
.filterPanel {
  width: 100%;
  height: 100%;
  padding: 24px 22px;
  border-radius: 16px;
  background: #ffffff;
  border: 1px solid rgba(15, 23, 42, 0.08);
  box-shadow: 0 4px 6px rgba(15, 23, 42, 0.04), 0 16px 32px rgba(15, 23, 42, 0.06);
  display: flex;
  flex-direction: column;
  gap: 20px;
  position: relative;
  overflow: hidden;
}
.filterPanel::before {
  content: "";
  position: absolute;
  top: -60px;
  right: -60px;
  width: 200px;
  height: 200px;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(61, 127, 255, 0.06) 0%, transparent 70%);
  pointer-events: none;
}
.panelStatusBar {
  display: flex;
  align-items: center;
  gap: 8px;
}
.statusDot {
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: #22c55e;
  box-shadow: 0 0 6px rgba(34, 197, 94, 0.5);
  flex-shrink: 0;
  animation: dotPulse 2.2s ease-in-out infinite;
}
@keyframes dotPulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.35; }
}
.statusLabel {
  font-size: 12px;
  letter-spacing: 0.16em;
  color: #94a3b8;
  text-transform: uppercase;
  font-weight: 500;
  flex: 1;
}
.filterBadge {
  font-size: 12px;
  padding: 3px 9px;
  border-radius: 5px;
  background: rgba(61, 127, 255, 0.08);
  border: 1px solid rgba(61, 127, 255, 0.2);
  color: #3d7fff;
  font-weight: 600;
  letter-spacing: 0.08em;
}
.panelTitleGroup {
  display: flex;
  flex-direction: column;
  gap: 5px;
}
.filterTitle {
  font-size: var(--fs-lg);
  font-weight: 600;
  color: #0f172a;
  margin: 0;
  line-height: 1.3;
}
.filterSubtitle {
  font-size: var(--fs-sm);
  color: #94a3b8;
  margin: 0;
}
.searchBox {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 12px 16px;
  border-radius: 10px;
  background: #f8fafc;
  border: 1px solid rgba(15, 23, 42, 0.1);
  transition: border-color 0.2s ease, box-shadow 0.2s ease;
}
.searchBox:focus-within {
  border-color: rgba(61, 127, 255, 0.45);
  box-shadow: 0 0 0 3px rgba(61, 127, 255, 0.08);
}
.searchIcon {
  color: #cbd5e1;
  flex-shrink: 0;
  width: 16px;
  height: 16px;
}
.searchInput {
  flex: 1;
  border: none;
  outline: none;
  background: transparent;
  font-size: var(--fs-base);
  color: #0f172a;
}
.searchInput::placeholder {
  color: #cbd5e1;
}
.filterDivider {
  height: 1px;
  background: rgba(15, 23, 42, 0.06);
}
.filterGroup {
  display: flex;
  flex-direction: column;
  gap: 14px;
  flex: 1;
}
.filterGroupHeader {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.filterGroupTitle {
  font-size: 12px;
  font-weight: 500;
  color: #94a3b8;
  text-transform: uppercase;
  letter-spacing: 0.12em;
}
.filterGroupHint {
  font-size: 11px;
  color: #94a3b8;
  background: #f1f5f9;
  padding: 2px 8px;
  border-radius: 99px;
  border: 1px solid rgba(15, 23, 42, 0.08);
}
.filterChecks {
  display: flex;
  flex-direction: column;
  gap: 4px;
}
.filterCheck {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 12px;
  border-radius: 8px;
  border: 1px solid transparent;
  cursor: pointer;
  user-select: none;
  transition: background 0.15s ease, border-color 0.15s ease;
}
.filterCheck:hover {
  background: #f8fafc;
  border-color: rgba(15, 23, 42, 0.07);
}
.filterCheck input {
  display: none;
}
.checkFake {
  width: 18px;
  height: 18px;
  border-radius: 5px;
  border: 1px solid #cbd5e1;
  background: #ffffff;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  transition: background 0.15s ease, border-color 0.15s ease;
}
.checkTick {
  font-size: 12px;
  color: #fff;
  opacity: 0;
  transform: scale(0.4);
  transition: opacity 0.12s ease, transform 0.12s ease;
  line-height: 1;
}
.filterCheck input:checked + .checkFake {
  background: #3d7fff;
  border-color: #3d7fff;
}
.filterCheck input:checked + .checkFake .checkTick {
  opacity: 1;
  transform: scale(1);
}
.filterCheck input:checked ~ .checkLabel {
  color: #1d4ed8;
}
.checkLabel {
  font-size: var(--fs-sm);
  color: #475569;
  line-height: 1.4;
  transition: color 0.15s ease;
}
.filterFooter {
  padding-top: 16px;
  border-top: 1px solid rgba(15, 23, 42, 0.07);
}
.filterFooterText {
  font-size: var(--fs-sm);
  color: #64748b;
  margin: 0;
  display: flex;
  align-items: center;
  gap: 6px;
}
.promptCaret {
  color: #3d7fff;
  font-weight: 700;
  font-size: 15px;
}
.filterFooterHighlight {
  font-weight: 700;
  color: #2563eb;
}
.cardsgrid {
  display: grid;
  gap: 18px;
  grid-template-columns: 1fr;
  align-items: stretch;
  overflow: hidden;
}
.paginationcontainer {
  width: 40%;
  margin: 0 auto;
  height: auto;
  border: none;
}
.pagerWrap {
  margin-top: 22px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  padding: 10px 14px;
  border-radius: 999px;
  background: #00123d;
  background: linear-gradient(
    95deg,
    rgba(0, 18, 61, 1) 0%,
    rgba(0, 51, 171, 1) 35%,
    rgba(6, 0, 120, 1) 100%
  );
  border: 1px solid rgba(152, 189, 255, 0.8);
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.45), 0 0 0 1px rgba(255, 255, 255, 0.06);
}
.pagerBtn {
  display: inline-flex;
  gap: 8px;
  align-items: center;
  justify-content: center;
  padding: 8px 14px;
  border-radius: 999px;
  cursor: pointer;
  user-select: none;
  font-size: 13px;
  letter-spacing: 0.2px;
  color: #e9f3ff;
  background: rgba(255, 255, 255, 0.08);
  border: 1px solid rgba(184, 210, 255, 0.7);
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.25);
  backdrop-filter: blur(6px);
  transition: transform 0.16s ease, box-shadow 0.16s ease, background 0.16s ease, opacity 0.16s ease;
}
.pagerBtn:hover {
  transform: translateY(-1px);
  background: rgba(255, 255, 255, 0.16);
  box-shadow: 0 7px 16px rgba(0, 0, 0, 0.35);
}
.pagerBtn:disabled {
  opacity: 0.45;
  cursor: not-allowed;
  transform: none;
  box-shadow: none;
}
.chev {
  font-size: 16px;
  line-height: 1;
}
.pagerPills {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 4px 6px;
  border-radius: 999px;
  background: rgba(1, 8, 30, 0.55);
  border: 1px solid rgba(167, 199, 255, 0.6);
  box-shadow: inset 0 0 0 1px rgba(0, 0, 0, 0.35);
}
.pagePill {
  width: 34px;
  height: 34px;
  border-radius: 999px;
  cursor: pointer;
  font-size: 13px;
  font-weight: 500;
  color: #dbe8ff;
  background: rgba(255, 255, 255, 0.06);
  border: 1px solid rgba(179, 204, 255, 0.7);
  box-shadow: 0 3px 8px rgba(0, 0, 0, 0.3);
  transition: transform 0.16s ease, box-shadow 0.16s ease, background 0.16s ease, color 0.16s ease,
    border-color 0.16s ease;
}
.pagePill:hover {
  transform: translateY(-1px);
  background: rgba(255, 255, 255, 0.18);
  border-color: #c4d6ff;
  box-shadow: 0 5px 12px rgba(0, 0, 0, 0.45);
}
.pagePill.active {
  background: #ffffff;
  color: #0b2e7e;
  border-color: #ffffff;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.5), 0 0 0 3px rgba(116, 170, 255, 0.6);
}
@media (max-width: 900px) {
  .membercardcontainer {
    flex-direction: column;
    width: 95%;
  }
  .rightcontainer {
    width: 100%;
    height: auto;
    order: 1;
  }
  .leftsection {
    width: 100%;
    order: 2;
  }
  .paginationcontainer {
    width: 100%;
  }
  .pagerWrap {
    flex-wrap: wrap;
    padding: 10px 10px;
    gap: 8px;
  }
}
</style>