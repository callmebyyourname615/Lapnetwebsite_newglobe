<script setup lang="ts">
import navbar from "../../components/miannavbar/main_navbar.vue";
import ScrollspySidebar from "../../components/scrollspy/ScrollspySidebar.vue";

const sections = [
  { id: "intro", label: "ບົດແນະນຳ", icon: "overview" },
  { id: "benefit", label: "ຜົນປະໂຫຍດ", icon: "spark" },
  { id: "steps", label: "ຂັ້ນຕອນ", icon: "box" },
  { id: "desc", label: "ລາຍລະອຽດ", icon: "tag" },
  { id: "member", label: "ສະມາຊິກ", icon: "box" },
];
import product6benetfit from "../techbenetfit/product6benetfit.vue";
import crossborderbtn from "../../components/button/crossborderbtn.vue";
import product6tech from "../techbenetfit/product6tech.vue";
import secondfooter from "../../components/footer/mainfooter/secondfooter.vue";
import vdoproductcrossborderKH_LA from "../../components/videoproductcrossborder/vdoproductcrossborderKH_LA.vue";
import vdoproductcrossborderLA_KH from "../../components/videoproductcrossborder/vdoproductcrossborderLA_KH.vue";
import vdoproductcrossborderTH_LA from "../../components/videoproductcrossborder/vdoproductcrossborderTH_LA.vue";
import vdoproductcrossborderLA_TH from "../../components/videoproductcrossborder/vdoproductcrossborderLA_TH.vue";
import vdoproductcrossborderVN_LA from "../../components/videoproductcrossborder/vdoproductcrossborderVN_LA.vue";
import vdoproductcrossborderCN_LA from "../../components/videoproductcrossborder/vdoproductcrossborderCN_LA.vue";
import hero_sectionproduct6 from "../../Views/products/product_herosection/hero_sectionproduct6.vue";
import product6_footerlogomember from "../../components/footer/logomemberfooter/product6_footerlogomember.vue";

import { computed, ref, watch, onMounted, onBeforeUnmount } from "vue";
import { useRoute } from "vue-router";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

/** =========================
 * ✅ Load member logos from API (env only)
 * API: {VITE_API_BASE_URL}/api/members
 * Condition: crossborderproduct = 1
 * ========================= */
type MemberLogo = {
  src: string;
  alt: string;
  memberId?: number;
};

type TimelineStep = {
  id: string;
  title: string;
  text: string;
  icon: string;
  side: "left" | "right";
};

// Required in .env:
//   VITE_API_BASE_URL=http://localhost:3000
function resolveEnvBaseUrl(): string {
  // IMPORTANT: Use direct access so Vite injects import.meta.env correctly.
  const raw = String(import.meta.env.VITE_API_BASE_URL || "").trim();
  return raw.replace(/\/+$/, "");
}

function normalizeBaseUrl(u: string): string {
  return String(u || "").trim().replace(/\/+$/, "");
}

function joinBaseAndPath(baseUrl: string, path: string): string {
  const b = normalizeBaseUrl(baseUrl);
  const p = String(path || "");

  if (!b) return p;

  // Prevent double "/api"
  if (b.endsWith("/api") && /^\/api(\/|$)/i.test(p)) {
    return b + p.replace(/^\/api/i, "");
  }

  if (!p) return b;
  if (p.startsWith("/")) return b + p;
  return b + "/" + p;
}

function isLoopbackHost(hostname: string) {
  const h = String(hostname || "").toLowerCase();
  return h === "localhost" || h === "127.0.0.1" || h === "0.0.0.0";
}

function isLikelyAssetPath(pathname: string) {
  const p = String(pathname || "");
  return /^\/(uploads|upload|images|files|static)\b/i.test(p) || p.includes("/uploads/") || p.includes("/images/");
}

const API_BASE = normalizeBaseUrl(resolveEnvBaseUrl());
const ASSET_BASE = API_BASE.endsWith("/api") ? API_BASE.slice(0, -4) : API_BASE;
const MEMBERS_API_URL = joinBaseAndPath(API_BASE, "/api/members");

const memberLogos = ref<MemberLogo[]>([]);
const timelineSection = ref<HTMLElement | null>(null);
let timelineContext: gsap.Context | null = null;

const crossBorderTimeline: TimelineStep[] = [
  {
    id: "01",
    title: "ຈຸດປະສົງຫຼັກຂອງໂຄງການຈຸດປະສົງຫຼັກຂອງໂຄງການ",
    text: "ໂຄງການດັ່ງກ່າວມີຈຸດປະສົງຫຼັກເພື່ອ ສົ່ງເສີມ ແລະ ອຳນວຍຄວາມສະດວກໃຫ້ແກ່ການບໍລິການຮ່ວມກັນພາຍໃນ ແລະ ຕ່າງປະເທດ ໃຫ້ສາມາດດຳເນີນລື່ນໄຫຼ ແລະ ບໍລິການ ລະຫວ່າງ ສປປ ລາວ ແລະ ປະເທດຄູ່ຮ່ວມ, ໂດຍຜ່ານລະບົບທີ່ປອດໄພ, ວ່ອງໄວ, ແລະ ສະດວກສະບາຍ.",
    icon: "fa-solid fa-bullseye",
    side: "left",
  },
  {
    id: "02",
    title: "ພາບລວມການເຊື່ອມໂຍງການຊຳລະຂ້າມແດນດ້ວຍ QR Code (Cross-border QR Payment)",
    text: "ບໍລິສັດ ລາວເນເຊີນນໍ ເພເມັ້ນ ເນັດເວີກ ຈຳກັດ (LAPNET) ມີຄວາມມຸ່ງໝັ້ນໃນການພັດທະນາລະບົບເພື່ອເປັນພື້ນຖານໂຄງຮ່າງດ້ານການຊຳ ລະສະສາງ ແລະ ເຊື່ອມໂຍງເຂົ້າກັນບັນດາປະເທດພາກພື້ນ. ໂດຍເລີ່ມຕົ້ນຈາກການຮ່ວມມືກັບບັນດາປະເທດໃກ້ຄຽງເປັນຕົ້ນແມ່ນ: ຣາຊະອານາຈັກ ກຳປູເຈຍ, ຣາຊະອານາຈັກ ໄທ, ສາທາລະນະລັດ ສັງຄົມນິຍົມ ຫວຽດນາມ, ແລະ ສາທານະລັດ ປະຊາຊົນ ຈີນ.",
    icon: "fa-solid fa-image",
    side: "right",
  },
  {
    id: "03",
    title: "ກົນໄກການຊຳລະ",
    text: "ໂຄງການນີ້ໄດ້ນຳໃຊ້ເທັກໂນໂລຢີ QR Code ທີ່ທັນສະໄໝ.",
    icon: "fa-solid fa-qrcode",
    side: "left",
  },
  {
    id: "04",
    title: "ສຳລັບນັກທ່ອງທຽວ",
    text: "ນັກທ່ອງທ່ຽວຈາກປະເທດຄູ່ຮ່ວມສາມາດນໍາໃຊ້ Mobile Banking Application ຂອງທະນາຄານທີ່ເຂົ້າຮ່ວມໂຄງການ ເພື່ອສະແກນຈ່າຍຄ່າສິນຄ້າ ແລະ ບໍລິການຢູ່ຮ້ານຄ້າໃນ ສປປ ລາວ (ເຊັ່ນ: ການໃຊ້ແອັບໄທສະແກນ LAO QR ຫຼື ແອັບກຳປູເຈຍ ສະແກນ LAO QR);",
    icon: "fa-brands fa-avianex",
    side: "right",
  },
  
  {
    id: "05",
    title: "ສຳລັບຮ້ານຄ້າ",
    text: "ຮ້ານຄ້າພາຍໃນ ສປປ ລາວ ສາມາດຮັບການຊຳລະຈາກຕ່າງປະເທດໄດ້ ໂດຍຈະໄດ້ຮັບເງິນເປັນເງິນສະກຸນທ້ອງຖິ່ນ (ເງິນ ກີບ) ເຂົ້າບັນຊີຂອງຕົນໂດຍກົງ, ໂດຍລະບົບຈະມີການຄິດໄລ່ການແລກປ່ຽນເງິນຕາແບບອັດຕະໂນມັດຕາມອັດຕາ ແລກປ່ຽນທີ່ໄດ້ກຳນົດໄວ້ໃນເວລາເຮັດທຸລະກຳ.",
    icon: "fa-solid fa-store",
    side: "left",
  },



];

const ASSET_BASE_URL = (() => {
  try {
    return ASSET_BASE ? new URL(ASSET_BASE) : null;
  } catch {
    return null;
  }
})();

function rewriteBadAbsoluteToEnvBase(absoluteUrl: string) {
  try {
    const u = new URL(absoluteUrl);
    const fullPath = `${u.pathname || ""}${u.search || ""}`;

    // Rewrite when backend returns localhost
    if (isLoopbackHost(u.hostname)) {
      return ASSET_BASE ? joinBaseAndPath(ASSET_BASE, fullPath) : absoluteUrl;
    }

    // Rewrite when it looks like an asset path but host mismatches env base
    if (ASSET_BASE_URL && isLikelyAssetPath(u.pathname) && u.hostname !== ASSET_BASE_URL.hostname) {
      return joinBaseAndPath(ASSET_BASE, fullPath);
    }

    return absoluteUrl;
  } catch {
    return absoluteUrl;
  }
}

const normalizeUrl = (p: unknown) => {
  const s = String(p ?? "").trim();
  if (!s) return "";

  if (/^data:/i.test(s) || /^blob:/i.test(s)) return s;

  // Absolute URL
  if (/^https?:\/\//i.test(s)) return rewriteBadAbsoluteToEnvBase(s);

  // Absolute path
  if (s.startsWith("/")) return joinBaseAndPath(ASSET_BASE, s);

  // Relative path
  return joinBaseAndPath(ASSET_BASE, "/" + s);
};

const getMemberId = (m: any) => Number(m?.idmember ?? m?.id ?? m?.member_id ?? 0);

const fetchMemberLogos = async () => {
  try {
    if (!API_BASE) {
      throw new Error("Missing VITE_API_BASE_URL in .env");
    }

    const res = await fetch(MEMBERS_API_URL, { headers: { Accept: "application/json" } });
    if (!res.ok) throw new Error(`Fetch failed: ${res.status} ${res.statusText}`);

    const json = await res.json();
    const list = Array.isArray(json) ? json : json?.data || json?.members || [];
    const arr = Array.isArray(list) ? list : [];

    memberLogos.value = arr
      .filter((m: any) => String(m?.crossborderproduct) === "1" || m?.crossborderproduct === true)
      .sort((a: any, b: any) => getMemberId(a) - getMemberId(b))
      .map((m: any) => {
        const rawSrc = m?.image ?? m?.image_url ?? m?.logo ?? m?.img ?? m?.photo ?? m?.path ?? m?.src ?? "";
        const alt = m?.alt ?? m?.name ?? m?.bank_name ?? m?.title ?? "Member logo";

        return {
          src: normalizeUrl(rawSrc),
          alt,
          memberId: getMemberId(m),
        };
      })
      .filter((x: MemberLogo) => !!x.src);
  } catch (err) {
    console.error("Error loading member logos (crossborderproduct):", err);
    memberLogos.value = [];
  }
};

onMounted(() => {
  window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
  fetchMemberLogos();

  timelineContext = gsap.context(() => {
    gsap.from(".process-eyebrow, .process-title, .process-copy", {
      opacity: 0,
      y: 24,
      duration: 0.9,
      ease: "power2.out",
      stagger: 0.1,
    });

    const timelineRoot = timelineSection.value?.querySelector<HTMLElement>(".process-timeline");
    const lineRail = timelineSection.value?.querySelector<HTMLElement>(".process-line");
    const lineFill = timelineSection.value?.querySelector<HTMLElement>(".process-line-fill");
    const rows = gsap.utils.toArray<HTMLElement>(".process-row");
    const firstRow = rows[0];
    const lastRow = rows[rows.length - 1];
    let animateLineFill: ((value: number) => gsap.core.Tween) | null = null;

    const syncLineGeometry = () => {
      if (!timelineRoot || !lineRail || !lineFill) return 0;

      const nodes = gsap.utils.toArray<HTMLElement>(".process-node");
      const firstNode = nodes[0];
      const lastNode = nodes[nodes.length - 1];

      if (!firstNode || !lastNode) return 0;

      const timelineRect = timelineRoot.getBoundingClientRect();
      const firstRect = firstNode.getBoundingClientRect();
      const lastRect = lastNode.getBoundingClientRect();

      const start = firstRect.top - timelineRect.top + firstRect.height / 2;
      const end = lastRect.top - timelineRect.top + lastRect.height / 2;
      const travel = Math.max(end - start, 1);

      gsap.set(lineRail, {
        top: start,
        height: travel,
        bottom: "auto",
      });

      gsap.set(lineFill, {
        scaleY: 0,
        transformOrigin: "top center",
      });

      return travel;
    };

    const setLineProgress = (progress: number, immediate = false) => {
      if (!lineRail || !lineFill) return;

      const clamped = gsap.utils.clamp(0, 1, progress);

      if (immediate || !animateLineFill) {
        gsap.set(lineFill, {
          scaleY: clamped,
          transformOrigin: "top center",
        });
        return;
      }

      animateLineFill(clamped);
    };

    if (timelineRoot && lineRail && lineFill) {
      syncLineGeometry();

      gsap.set(".process-card, .process-node, .process-line-fill", {
        force3D: true,
      });
      gsap.set(lineFill, { transformOrigin: "top center" });
      animateLineFill = gsap.quickTo(lineFill, "scaleY", {
        duration: 0.22,
        ease: "power3.out",
      });
      setLineProgress(0, true);

      ScrollTrigger.create({
        trigger: firstRow || timelineRoot,
        endTrigger: lastRow || timelineRoot,
        start: "top 90%",
        end: "bottom 24%",
        invalidateOnRefresh: true,
        onRefreshInit: () => {
          syncLineGeometry();
        },
        onRefresh: (self) => {
          syncLineGeometry();
          setLineProgress(self.progress, true);
        },
        onUpdate: (self) => {
          setLineProgress(self.progress);
        },
      });
    }

    gsap.to(".process-node-ring", {
      scale: 1.08,
      opacity: 0.42,
      duration: 1.8,
      repeat: -1,
      yoyo: true,
      ease: "sine.inOut",
      stagger: 0.15,
    });

    rows.forEach((item) => {
      const isLeft = item.classList.contains("is-left");
      const card = item.querySelector(".process-card");
      const node = item.querySelector(".process-node");

      if (card) {
        gsap.from(card, {
          autoAlpha: 0,
          y: 52,
          x: isLeft ? 42 : -42,
          duration: 0.95,
          ease: "power2.out",
          clearProps: "transform,opacity,visibility",
          scrollTrigger: {
            trigger: item,
            start: "top 88%",
            once: true,
            toggleActions: "play none none none",
          },
        });
      }

      if (node) {
        gsap.from(node, {
          autoAlpha: 0,
          scale: 0.5,
          duration: 0.62,
          ease: "back.out(1.8)",
          clearProps: "transform,opacity,visibility",
          scrollTrigger: {
            trigger: item,
            start: "top 90%",
            once: true,
            toggleActions: "play none none none",
          },
        });
      }

      ScrollTrigger.create({
        trigger: item,
        start: "top 64%",
        end: "bottom 40%",
        toggleClass: {
          targets: item,
          className: "is-active",
        },
      });
    });
  }, timelineSection);

  ScrollTrigger.refresh();
});

onBeforeUnmount(() => {
  timelineContext?.revert();
  timelineContext = null;
});

/** =========================
 * ✅ Video switch by route param
 * ========================= */
const route = useRoute();
const videoBox = ref<HTMLElement | null>(null);

const pair = computed(() => {
  const currentPair = (route.params.pair as string) || "kh-la";

  if (currentPair === "cn-la") return "ch-la";
  if (currentPair === "la-cn") return "la-ch";

  return currentPair;
});

const currentVideoComponent = computed(() => {
  switch (pair.value) {
    case "kh-la":
      return vdoproductcrossborderKH_LA;
    case "la-kh":
      return vdoproductcrossborderLA_KH;
    case "th-la":
      return vdoproductcrossborderTH_LA;
    case "la-th":
      return vdoproductcrossborderLA_TH;
    case "vn-la":
    case "la-vn":
      return vdoproductcrossborderVN_LA;
    case "ch-la":
    case "la-ch":
      return vdoproductcrossborderCN_LA;
    default:
      return vdoproductcrossborderKH_LA;
  }
});

watch(
  pair,
  () => {
    if (!videoBox.value) return;

    gsap.fromTo(
      videoBox.value,
      { opacity: 0, y: 40 },
      { opacity: 1, y: 0, duration: 2.0, ease: "power3.out" }
    );
  },
  { immediate: true }
);
</script>
<template>
  <navbar
    title="ຜະລິດຕະພັນ ແລະ ການບໍລິການ"
    :breadcrumb="[
      'ໜ້າຫຼັກ',
      'ຜະລິດຕະພັນ ແລະ ການບໍລິການ',
      'ຊຳລະຂ້າມແດນໃນຮູບແບບ QR CODE ລະຫວ່າງປະເທດ'
    ]"
    background-image="/overlaynav/product/navigatorcontent-bg.png"
  />

  <ScrollspySidebar :items="sections" />

  <div id="intro" class="productdiscription">
    <hero_sectionproduct6 />
  </div>

  <div id="benefit" class="benetfix">
    <product6benetfit />
  </div>

  <section id="steps" ref="timelineSection" class="process-showcase">
    <div class="process-shell">
      <div class="process-header">
        <span class="process-eyebrow">How It Works</span>
        <h2 class="process-title">
          ຂັ້ນຕອນການຊຳລະ
          <span>ຂ້າມແດນຜ່ານ QR Code</span>
        </h2>
        <p class="process-copy">
          ປັດຈຸບັນ LAPNet ໄດ້ຮ່ວມໂຄງການກັບ 4 ປະເທດຄື: ປະເທດກຳປູເຈຍ, ປະເທດໄທ, ປະເທດຈີນ ແລະ ປະເທດຫວຽດນາມ.
        </p>
      </div>

      <div class="process-timeline">
        <div class="process-line">
          <div class="process-line-track"></div>
          <div class="process-line-fill"></div>
        </div>

        <div
          v-for="item in crossBorderTimeline"
          :key="item.id"
          class="process-row"
          :class="item.side === 'left' ? 'is-left' : 'is-right'"
        >
          <div class="process-side process-side--left">
            <article v-if="item.side === 'left'" class="process-card">
              <span class="process-step">{{ item.id }}</span>
              <h3 class="process-card-title">{{ item.title }}</h3>
              <p class="process-card-text">{{ item.text }}</p>
            </article>
          </div>

          <div class="process-node-column">
            <span class="process-node-ring"></span>
            <span class="process-node">
              <i :class="item.icon"></i>
            </span>
          </div>

          <div class="process-side process-side--right">
            <article v-if="item.side === 'right'" class="process-card">
              <span class="process-step">{{ item.id }}</span>
              <h3 class="process-card-title">{{ item.title }}</h3>
              <p class="process-card-text">{{ item.text }}</p>
            </article>
          </div>
        </div>
      </div>
    </div>
  </section>

  <div class="crossborderinfo">
    <div class="boxmargin" style="width: 100%; height: 15vh"></div>

    <div class="titlecrossborder">
      <h1 id="memberjoin">ທະນາຄານສະມາຊິກທີ່ເຂົ້າຮ່ວມ</h1>
      <crossborderbtn />
    </div>

    <div class="videocontainer">
      <div class="videocorssbordershow" ref="videoBox">
        <component :is="currentVideoComponent" :key="pair" />
      </div>
    </div>
  </div>

  <div id="desc" class="descriptionforcustomer">
    <product6tech />
  </div>

  <div id="member" class="footermember">
    <!-- ✅ ส่ง logos ที่ get จาก API (crossborderproduct=1) -->
    <product6_footerlogomember :subtitle="`  ຊຳລະຂ້າມແດນຜ່ານ QR CODE ບໍລິສັດ LAPNet ໄດ້ຕໍ່ຍອດການພັດທະນາລະບົບຊຳລະຂ້າມທະນາຄານເທິງມືຖື (LMPS) ເພື່ອຂະຫຍາຍຜະລິດຕະພັນ ຊຳລະຂ້າມທະນາຄານ ໃຫ້ສາມາດຮອງຮັບການ ຊຳລະ ຄ່າສິນຄ້າ - ບໍລິການ ລະຫວ່າງປະເທດ`"
      :features="[
        'ປັດຈຸບັນ LAPNet ໄດ້ຮ່ວມໂຄງການກັບ 4 ປະເທດຄື: ປະເທດກຳປູເຈຍ, ປະເທດໄທ, ປະເທດຈີນ ແລະ ປະເທດຫວຽດນາມ. ',
      ]"
      :logos="memberLogos" />
  </div>

  <secondfooter />
</template>

<style scoped>
@import url("https://fonts.googleapis.com/css2?family=Noto+Sans+Lao:wght@400;500;600;700;800&display=swap");

.process-showcase {
  position: relative;
  overflow: hidden;
  padding: clamp(5.75rem, 7vw, 7.6rem) 0;
  background:
    radial-gradient(circle at 16% 14%, rgba(190, 194, 255, 0.22), transparent 30%),
    radial-gradient(circle at 84% 76%, rgba(205, 221, 255, 0.42), transparent 26%),
    radial-gradient(circle at 50% 100%, rgba(239, 244, 255, 0.75), transparent 40%),
    linear-gradient(180deg, #f7f9fb 0%, #f7f9fb 62%, #ffffff 100%);
  font-family: "Noto Sans Lao", sans-serif;
}

.process-shell {
  position: relative;
  z-index: 1;
  max-width: 1260px;
  margin: 0 auto;
  padding: 0 30px;
}

.process-header {
  max-width: 900px;
  margin: 0 auto clamp(4rem, 6vw, 6.2rem);
  text-align: center;
}

.process-eyebrow {
  display: inline-block;
  margin-bottom: 12px;
  font-size: 0.72rem;
  font-weight: 700;
  letter-spacing: 0.24em;
  text-transform: uppercase;
  color: #313dff;
}

.process-title {
  margin: 0;
  font-size: clamp(2.55rem, 4.3vw, 4.7rem);
  line-height: 1.14;
  letter-spacing: -0.04em;
  color: #191c1e;
  font-weight: 700;
}

.process-title span {
  color: #000abc;
  background: linear-gradient(135deg, #000ba6 0%, #001cff 45%, #00a6ff 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.process-copy {
  max-width: 780px;
  margin: 20px auto 0;
  font-size: 1.08rem;
  line-height: 1.86;
  color: #6d7387;
}

.process-timeline {
  position: relative;
  padding: 10px 0 0;
}

.process-line {
  position: absolute;
  top: 0;
  bottom: 0;
  left: 50%;
  width: 6px;
  transform: translateX(-50%);
  isolation: isolate;
}

.process-line::before {
  content: "";
  position: absolute;
  inset: -24px -14px;
  border-radius: 999px;
  background: linear-gradient(180deg, rgba(0, 11, 166, 0.12), rgba(0, 166, 255, 0.05));
  filter: blur(18px);
  opacity: 0.7;
  z-index: -2;
  pointer-events: none;
}

.process-line::after {
  content: "";
  position: absolute;
  left: 50%;
  top: 0;
  bottom: 0;
  width: 1px;
  transform: translateX(-50%);
  background: linear-gradient(180deg, rgba(255, 255, 255, 0.9), rgba(255, 255, 255, 0.06));
  opacity: 0.78;
  z-index: 2;
  pointer-events: none;
}

.process-line-track,
.process-line-fill {
  position: absolute;
  inset: 0;
  border-radius: 999px;
}

.process-line-track {
  background:
    linear-gradient(180deg, rgba(255, 255, 255, 0.92), rgba(255, 255, 255, 0.12)) left center / 1px 100% no-repeat,
    linear-gradient(180deg, rgba(224, 227, 229, 0.95), rgba(224, 227, 229, 0.82));
  box-shadow:
    inset 0 0 0 1px rgba(255, 255, 255, 0.45),
    inset 0 10px 14px rgba(255, 255, 255, 0.5);
}

.process-line-fill {
  background:
    linear-gradient(180deg, rgba(255, 255, 255, 0.72), rgba(255, 255, 255, 0)) left center / 1px 100% no-repeat,
    linear-gradient(180deg, #000ba6 0%, #2143ff 52%, #00a6ff 100%);
  box-shadow:
    0 0 26px rgba(0, 17, 255, 0.18),
    0 0 46px rgba(0, 166, 255, 0.08);
}

.process-row {
  position: relative;
  display: grid;
  grid-template-columns: minmax(0, 1fr) 112px minmax(0, 1fr);
  align-items: center;
  margin: 0 0 3.45rem;
}

.process-side {
  display: flex;
}

.process-side--left {
  justify-content: flex-end;
  padding-right: 36px;
}

.process-side--right {
  justify-content: flex-start;
  padding-left: 36px;
}

.process-node-column {
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100%;
}

.process-node-ring,
.process-node {
  position: absolute;
  border-radius: 999px;
}

.process-node-ring {
  width: 34px;
  height: 34px;
  border: 1px solid rgba(0, 17, 255, 0.18);
  background: rgba(0, 17, 255, 0.04);
  opacity: 0.4;
}

.process-node {
  position: relative;
  width: 50px;
  height: 50px;
  display: grid;
  place-items: center;
  color: #000abc;
  font-size: 1.02rem;
  background: linear-gradient(180deg, #f5f7fa 0%, #dfe4eb 100%);
  box-shadow: 0 12px 28px rgba(19, 27, 46, 0.09);
  transition: background 0.28s ease, color 0.28s ease, box-shadow 0.28s ease, transform 0.28s ease;
}

.process-card {
  position: relative;
  width: min(100%, 500px);
  min-height: 228px;
  padding: 34px 34px 30px;
  border-radius: 32px;
  overflow: hidden;
  background:
    linear-gradient(180deg, rgba(255, 255, 255, 0.98) 0%, rgba(245, 248, 255, 0.94) 100%);
  border: 1px solid rgba(197, 196, 219, 0.12);
  box-shadow:
    0 20px 46px rgba(19, 27, 46, 0.06),
    0 36px 78px rgba(19, 27, 46, 0.05);
  transition: transform 0.36s ease, box-shadow 0.36s ease, border-color 0.36s ease;
}

.process-card::before {
  content: "";
  position: absolute;
  inset: 0 auto auto 0;
  width: 100%;
  height: 6px;
  background: linear-gradient(90deg, rgba(0, 11, 166, 0.92), rgba(0, 166, 255, 0.72));
}

.process-card::after {
  content: "";
  position: absolute;
  right: 18px;
  top: 14px;
  width: 120px;
  height: 120px;
  border-radius: 999px;
  background: radial-gradient(circle, rgba(49, 61, 255, 0.08), rgba(49, 61, 255, 0));
  pointer-events: none;
}

.process-step {
  display: inline-block;
  margin-bottom: 12px;
  font-size: 3rem;
  font-weight: 800;
  line-height: 0.95;
  letter-spacing: -0.05em;
  color: rgba(0, 17, 255, 0.18);
}

.process-card-title {
  margin: 0;
  font-size: 1.26rem;
  line-height: 1.54;
  font-weight: 700;
  color: #191c1e;
}

.process-card-text {
  margin: 14px 0 0;
  font-size: 1.02rem;
  line-height: 1.88;
  color: #697286;
}

.process-row.is-active .process-card {
  transform: translateY(-10px);
  border-color: rgba(0, 17, 255, 0.08);
  box-shadow:
    0 28px 56px rgba(19, 27, 46, 0.08),
    0 40px 86px rgba(0, 17, 255, 0.08);
}

.process-row.is-active .process-node {
  color: #ffffff;
  background: linear-gradient(135deg, #000ba6 0%, #0011ff 100%);
  box-shadow: 0 0 0 10px rgba(0, 17, 255, 0.07), 0 18px 38px rgba(0, 17, 255, 0.22);
  transform: scale(1.06);
}

.process-card,
.process-node,
.process-line-fill {
  will-change: transform, opacity;
  transform: translateZ(0);
}

.footermember {
  width: 100%;
  height: auto;
}

.descriptionforcustomer {
  width: 100%;
  height: auto;
}

.videocontainer {
  width: 100%;
  height: auto;
}

@media (max-width: 518px) {
  #memberjoin {
    font-size: 2.3rem;
  }
}

.titlecrossborder h1 {
  font-size: var(--fs-hero);
  font-weight: bold;
  color: #0025b8;
  background-image: linear-gradient(45deg, #312ba4, #0d1c9c 8%, #00a6ff 100%);
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  display: inline-block;
}

.titlecrossborder {
  width: 100%;
  height: 30%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
}

.crossborderinfo {
  width: 100%;
  height: auto;
}

.footermemberproduct1 {
  width: 100%;
  height: 100vh;
}

.benetfitcontent p {
  width: 100%;
  padding-top: 40px;
  width: 80%;
  font-size: var(--fs-base);
  text-align: center;
}

.benetfitcontent h1 {
  text-align: center;
  width: 100%;
  font-size: var(--fs-xxl);
  font-weight: bold;
}

.benetfitcontent {
  width: 100%;
  color: #fff;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 40%;
}

.benetfitcontainer {
  width: 80%;
  display: flex;
  justify-content: space-around;
  flex-direction: column;
  height: 100%;
}

.benetfix {
  width: 100%;
  height: auto;
}

.productdiscription {
  width: 100%;
  height: auto;
}

@media (max-width: 980px) {
  .process-shell {
    padding: 0 22px;
  }

  .process-line {
    left: 50%;
    transform: translateX(-50%);
  }

  .process-row {
    grid-template-columns: minmax(0, 1fr);
    grid-template-areas:
      "node"
      "card";
    gap: 18px;
    justify-items: center;
    margin-bottom: 2.2rem;
  }

  .process-side--left,
  .process-side--right {
    grid-area: card;
    width: 100%;
    justify-content: center;
    padding: 0;
  }

  .process-side--left:empty,
  .process-side--right:empty {
    display: none;
  }

  .process-node-column {
    grid-area: node;
    width: 100%;
    min-height: 56px;
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 0;
    margin: 0 auto;
  }

  .process-node-ring,
  .process-node {
    inset: 50% auto auto 50%;
    transform: translate(-50%, -50%);
  }

  .process-row.is-left .process-side--left,
  .process-row.is-right .process-side--right {
    grid-area: card;
  }

  .process-card {
    width: min(100%, 640px);
    min-height: 0;
    margin: 0 auto;
  }

  .process-node {
    display: grid;
    place-items: center;
  }

  .process-node i {
    display: inline-grid;
    place-items: center;
    line-height: 1;
  }
}

@media (max-width: 640px) {
  .process-showcase {
    padding: 4.8rem 0;
  }

  .process-title {
    font-size: 2.1rem;
  }

  .process-copy {
    font-size: 0.96rem;
    line-height: 1.78;
  }

  .process-card {
    min-height: 0;
    padding: 28px 22px 24px;
    border-radius: 26px;
  }

  .process-card-title {
    font-size: 1.08rem;
  }

  .process-card-text {
    font-size: 0.95rem;
    line-height: 1.76;
  }

  .process-step {
    font-size: 2.45rem;
  }

  .process-node {
    width: 42px;
    height: 42px;
    font-size: 0.9rem;
  }
}
</style>
