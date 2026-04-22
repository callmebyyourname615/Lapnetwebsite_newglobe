<template>
  <section ref="root" class="hero">
    <!-- background -->
    <div class="bg" aria-hidden="true">
      <div class="bgRadial"></div>
      <div class="bgGrid"></div>
      <div class="bgNoise"></div>
    </div>

    <header ref="nav" class="nav">
      <div class="navInner">
        <div class="brand">
          <span class="brandMark">
            <img src="/logolapnet/fullcircle.png" alt="" />
          </span>
          <span class="brandText">LAPNET</span>
        </div>

        <!-- Desktop links -->
        <nav class="navLinks">
         
          <a href="/" class="navLink">Product</a>
        
          <a href="/" class="navLink">Member</a>
          <a href="/" class="navLink">BLog</a>
          <a href="/" class="navLink">Join us </a>
          <a href="/" class="navLink">About </a>
          <a href="/" class="navLink">Contact </a>
        </nav>

        <!-- Right actions -->
        <div class="navRight">
          <a
            class="iconBtn"
            href="https://www.facebook.com/laonationalpaymentnetwork/?locale=th_TH"
            target="_blank"
            rel="noopener"
            aria-label="Facebook"
          >
            <i class="fa-brands fa-facebook-f"></i>
          </a>

          <a class="iconBtn" href="mailto:info@lapnet.la" aria-label="Email">
            <i class="fa-solid fa-envelope"></i>
          </a>

          <a href="https://admin.lapnet.com.la/login" target="_blank"><button class="navCta">Login</button></a>

          <!-- Mobile only -->
          <button
            class="menuBtn"
            type="button"
            @click.stop="sidebarOpen = true"
            :aria-expanded="sidebarOpen ? 'true' : 'false'"
            aria-label="Open menu"
          >
            <span class="hamburger" aria-hidden="true">
              <span></span><span></span><span></span>
            </span>
            <span class="menuText">Menu</span>
          </button>
        </div>
      </div>
    </header>

    <div class="container">
      <div class="copy">
        <div ref="pill" class="pill">
          <span class="pillDot"></span>
          Lao National Payment Network
        </div>

        <h1 ref="title" class="title">
          Anywhere Anytime
          <span class="titleAccent"></span>
          Any <span style="width: 3px"></span><span class="titleAI">Payment Channel</span>
        </h1>

        <p ref="desc" class="desc">
          ພັດທະນາລະບົບການຊໍາລະທຸລະກຳຍ່ອຍໃຫ້ເປັນສູນກາງການຊໍາລະຂອງບັນດາຜູ້ໃຫ້ບໍລິການຊໍາລະ ທັງພາຍໃນ ແລະ ສາກົນ,
          ແນໃສ່ໃຫ້ປະຊາຊົນລາງໄດ້ໃຊ້ບໍລິການຊໍາລະທີ່ສະດວກວ່ອງໄວ, ທັນສະໄໝ, ປອດໄພ, ຕົ້ນທືນຕໍາ ແລະ
          ເພື່ອໃຫ້ບໍລິສັດການເປັນໂຄງຮ່າງພື້ນຖານໃຫ້ແກ່ການຊໍາລະໃນ ສປປ ລາວ.
        </p>

        <div ref="actions" class="actions">
          <router-link to="/products_service/allproduct">
            <button class="btnPrimary">ຜະລິດຕະພັນ ແລະ ການບໍລິການ</button>
          </router-link>
          <router-link to="/contactus">
            <button class="btnGhost">Contact us</button>
          </router-link>
        </div>
      </div>

      <div ref="deviceStage" class="deviceStage">
        <div ref="deviceGlow" class="deviceGlow" aria-hidden="true"></div>

        <div ref="globeEl" class="globeStage">
          <!-- ✅ no delay: render immediately, fallback shows while async chunk loads -->
          <Suspense>
            <template #default>
              <LapnetGlobe class="globe" />
            </template>
            <template #fallback>
              <div class="globePlaceholder" aria-hidden="true"></div>
            </template>
          </Suspense>
        </div>
      </div>
    </div>

    <div class="bottomFade" aria-hidden="true"></div>
  </section>

  <Teleport to="body">
    <homepage_sidebar
      v-if="sidebarShouldMount"
      v-model="sidebarOpen"
      logo-src="/logolapnet/fullcircle.png"
      company-name="LAPNET"
      company-tagline="Lao National Payment Network"
    />
  </Teleport>

  <!-- ✅ below the fold: mount later + render-skip -->
  <template v-if="belowFold">
    <div class="cvAuto">
      <visionherosection />
    </div>

    <div class="cvAuto">
      <whychooseus
        title="Why choose LAPNET"
        description="ບໍລິສັດ ລາວເນ ເຊີນນໍ ເພເມັ້ນ ເນັດເວີກ ຈຳກັດ (LAPNet) ເຊິ່ງບໍລິສັດ LAPNet ເປັນຜູ້ໃຫ້ບໍລິການລະບົບ ການຊໍາລະທຸລະກໍາຍ່ອຍ ຕາມທີ່ໄດ້ກໍານົດໄວ້ໃນກົດໝາຍວ່າດ້ວຍລະບົບ ການຊໍາລະ. ຊຶ່ງເຮັດໜ້າທີ່ເປັນໂຕກາງໃນການ ເຊື່ອມໂຍງກັບທຸກຂະແໜງການຊຳລະທີ່ເປັນທະນາຄານ, ສະຖາບັນການເງິນ ແລະ ຜູ້ໃຫ້ບໍລິການ ການຊຳລະແຫ່ງດຽວໃນ ສປປ ລາວ;"
        :stat1Value="19"
        stat1Label="Member Banks"
        stat1Suffix="19 ທະນາຄານສະມາຊິກທີ່ເຂົ້າຮ່ວມກັບ Lao National Payment Network"
        :stat2Value="2"
        stat2Label="Fintech"
        stat2Suffix=""
      />
    </div>

    <div class="cvAuto scollingmember">
      <allMembersscrolling />
    </div>

    <div class="cvAuto">
      <productherosectionhomepage />
    </div>

    <div class="boxmargin" style="width: 100%; height: 10vh"></div>

    <div class="cvAuto">
      <bloghomepage />
    </div>

    <div class="boxmargin" style="width: 100%; height: 10vh"></div>

    <div class="cvAuto">
      <secondfooter />
    </div>
  </template>

  <!-- ✅ 3s Tech Glow Loader (GSAP) -->
  <Teleport to="body">
    <div v-if="isLoading" ref="loaderEl" class="pageLoader" role="status" aria-label="Loading">
      <div ref="loaderCardEl" class="loaderCard techCard">
        <div class="techOrb" aria-hidden="true">
          <div class="orbGlow"></div>

          <div class="orbCore">
            <img src="/logolapnet/fullcircle.png" alt="LAPNET" class="orbLogo" />
          </div>

          <div class="orbRing ring1"></div>
          <div class="orbRing ring2"></div>
          <div class="orbRing ring3"></div>
          <div class="orbScan"></div>
        </div>

        <div class="techMeta">
          <div class="techLabel">Loading....</div>
          <div class="techSub">Lao National Payment Network</div>

          <div class="techBar" aria-hidden="true">
            <span class="techBarFill"></span>
          </div>

          <div class="techDots" aria-hidden="true">
            <span></span><span></span><span></span>
          </div>
        </div>

        <div class="techGridOverlay" aria-hidden="true"></div>
      </div>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount, watch, defineAsyncComponent, nextTick } from "vue";
import gsap from "gsap";

// ✅ above-the-fold (keep normal so nav shows instantly)



// ✅ lazy load heavy components (split chunks) — use PascalCase vars so template is clean
const visionherosection = defineAsyncComponent(() => import("./visionherosection.vue"));
const allMembersscrolling = defineAsyncComponent(() =>
  import("../../components/swiper/memberscrolling/allmemberscrolling.vue")
);
const homepage_sidebar = defineAsyncComponent(() =>
  import("../../components/sidebar/homepage_sidebar.vue")
);
const whychooseus = defineAsyncComponent(() => import("./whychooseus.vue"));
const productherosectionhomepage = defineAsyncComponent(() =>
  import("../../Views/Homepage/productherosectionhomepage.vue").catch(() =>
    import("./productherosectionhomepage.vue")
  )
); // fallback
const bloghomepage = defineAsyncComponent(() => import("../../components/blog/hompage/bloghomepage.vue"));
const secondfooter = defineAsyncComponent(() => import("../../components/footer/mainfooter/secondfooter.vue"));

// ✅ Globe: preload immediately (no idle delay)
const atmmockup = () => import("../../components/mockup/atmmockup.vue");
atmmockup(); // start fetching chunk ASAP
const LapnetGlobe = defineAsyncComponent(atmmockup);

const sidebarOpen = ref(false);
const sidebarShouldMount = ref(false);
const belowFold = ref(false);

const root = ref<HTMLElement | null>(null);
const nav = ref<HTMLElement | null>(null);
const pill = ref<HTMLElement | null>(null);
const title = ref<HTMLElement | null>(null);
const desc = ref<HTMLElement | null>(null);
const actions = ref<HTMLElement | null>(null);

const deviceStage = ref<HTMLElement | null>(null);
const deviceGlow = ref<HTMLElement | null>(null);
const globeEl = ref<HTMLElement | null>(null);

// ✅ Loader refs/state
const isLoading = ref(true);
const loaderEl = ref<HTMLElement | null>(null);
const loaderCardEl = ref<HTMLElement | null>(null);

let heroCtx: gsap.Context | null = null;
let heroTl: gsap.core.Timeline | null = null;

let stageCleanup: (() => void) | null = null;
let removeKeyListener: (() => void) | null = null;

// ✅ store any GSAP animations (Tween/Timeline/DelayedCall etc.)
let loaderAnims: gsap.core.Animation[] = [];
let loaderDone: gsap.core.Tween | null = null;

const lockScroll = (on: boolean) => {
  if (typeof document === "undefined") return;
  document.documentElement.style.overflow = on ? "hidden" : "";
};

// ✅ mount sidebar only when opened + lock scroll
watch(sidebarOpen, (v) => {
  lockScroll(v || isLoading.value);
  if (v) sidebarShouldMount.value = true;
});

// ✅ keep scroll lock in sync if loading state changes
watch(isLoading, (v) => {
  lockScroll(v || sidebarOpen.value);
});

// ✅ helper: run later (reduce initial work)
const runIdle = (cb: () => void, timeout = 1200) => {
  const ric = (window as any).requestIdleCallback;
  if (typeof ric === "function") ric(cb, { timeout });
  else setTimeout(cb, 250);
};

const buildHeroIntro = () => {
  heroCtx = gsap.context(() => {
    const reduce = window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches ?? false;

    const tl = gsap.timeline({
      paused: true,
      defaults: { ease: "power3.out" },
    });

    tl.from(nav.value, { y: -16, opacity: 0, duration: 0.7 })
      .from(pill.value, { y: 18, opacity: 0, duration: 0.7 }, "-=0.35")
      .from(title.value, { y: 22, opacity: 0, duration: 0.9 }, "-=0.42")
      .from(desc.value, { y: 18, opacity: 0, duration: 0.7 }, "-=0.55")
      .from(actions.value, { y: 16, opacity: 0, duration: 0.7 }, "-=0.5")
      .from(globeEl.value, { y: 26, opacity: 0, scale: 0.985, duration: 1.0 }, "-=0.55")
      .from(deviceGlow.value, { opacity: 0, duration: 0.9 }, "-=0.8");

    heroTl = tl;
    heroTl?.progress(0);

    if (!reduce) {
      if (globeEl.value) {
        gsap.to(globeEl.value, {
          y: -10,
          duration: 3.8,
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut",
        });
      }

      const stage = deviceStage.value;
      if (stage && globeEl.value && deviceGlow.value) {
        const qx = gsap.quickTo(globeEl.value, "rotationX", { duration: 0.8, ease: "power3.out" });
        const qy = gsap.quickTo(globeEl.value, "rotationY", { duration: 0.8, ease: "power3.out" });
        const qg = gsap.quickTo(deviceGlow.value, "x", { duration: 0.9, ease: "power3.out" });

        const onMove = (e: MouseEvent) => {
          const r = stage.getBoundingClientRect();
          const nx = (e.clientX - r.left) / r.width - 0.5;
          const ny = (e.clientY - r.top) / r.height - 0.5;
          qx(-ny * 4.0);
          qy(nx * 5.5);
          qg(nx * 18);
        };

        const onLeave = () => {
          qx(0);
          qy(0);
          qg(0);
        };

        stage.addEventListener("mousemove", onMove);
        stage.addEventListener("mouseleave", onLeave);

        stageCleanup = () => {
          stage.removeEventListener("mousemove", onMove);
          stage.removeEventListener("mouseleave", onLeave);
        };
      }
    }
  }, root);
};

const finishLoading = () => {
  isLoading.value = false;
  lockScroll(sidebarOpen.value);
  heroTl?.play(0);
};

const startLoader = () => {
  // ✅ IMPORTANT: Teleport refs can be null for a moment (especially in prod build)
  lockScroll(true);

  const el = loaderEl.value;
  const card = loaderCardEl.value;

  // if teleport not ready yet, retry next frame (and never get stuck forever)
  if (!el || !card) {
    requestAnimationFrame(startLoader);

    // safety: force finish after ~3.5s if something goes wrong
    setTimeout(() => {
      if (isLoading.value) finishLoading();
    }, 3500);

    return;
  }

  const q = gsap.utils.selector(el);

  gsap.set(el, { autoAlpha: 1 });

  // entrance
  loaderAnims.push(
    gsap.fromTo(
      card,
      { y: 14, scale: 0.985, autoAlpha: 0 },
      { y: 0, scale: 1, autoAlpha: 1, duration: 0.45, ease: "power3.out" }
    )
  );

  // rings rotate
  loaderAnims.push(gsap.to(q(".ring1"), { rotation: 360, duration: 1.4, repeat: -1, ease: "none" }));
  loaderAnims.push(gsap.to(q(".ring2"), { rotation: -360, duration: 2.2, repeat: -1, ease: "none" }));
  loaderAnims.push(gsap.to(q(".ring3"), { rotation: 360, duration: 3.1, repeat: -1, ease: "none" }));

  // core pulse + glow breathe
  loaderAnims.push(
    gsap.to(q(".orbCore"), { scale: 1.08, duration: 0.85, repeat: -1, yoyo: true, ease: "sine.inOut" })
  );
  loaderAnims.push(
    gsap.to(q(".orbGlow"), { opacity: 0.85, duration: 0.9, repeat: -1, yoyo: true, ease: "sine.inOut" })
  );

  // scanline sweep
  loaderAnims.push(
    gsap.fromTo(
      q(".orbScan"),
      { yPercent: -140, opacity: 0.0 },
      { yPercent: 140, opacity: 0.9, duration: 0.85, repeat: -1, ease: "sine.inOut" }
    )
  );

  // bar sweep
  gsap.set(q(".techBarFill"), { xPercent: -120 });
  loaderAnims.push(gsap.to(q(".techBarFill"), { xPercent: 220, duration: 1.0, repeat: -1, ease: "sine.inOut" }));

  // dots
  loaderAnims.push(
    gsap.to(q(".techDots span"), {
      opacity: 1,
      scale: 1.25,
      duration: 0.35,
      stagger: 0.2,
      repeat: -1,
      yoyo: true,
      ease: "sine.inOut",
    })
  );

  // ✅ 3 seconds then fade out
  loaderDone = gsap.delayedCall(3, () => {
    loaderAnims.forEach((a) => a.kill());
    loaderAnims = [];

    gsap.to(el, {
      autoAlpha: 0,
      duration: 0.35,
      ease: "power2.out",
      onComplete: finishLoading,
    });
  });
};

onMounted(async () => {
  runIdle(() => (belowFold.value = true), 1400);

  const onKey = (e: KeyboardEvent) => {
    if (e.key === "Escape") sidebarOpen.value = false;
  };
  window.addEventListener("keydown", onKey);
  removeKeyListener = () => window.removeEventListener("keydown", onKey);

  // ✅ wait for Teleport refs to exist (prod build friendly)
  await nextTick();

  buildHeroIntro();
  startLoader();
});

onBeforeUnmount(() => {
  loaderDone?.kill();

  loaderAnims.forEach((a) => a.kill());
  loaderAnims = [];

  stageCleanup?.();
  stageCleanup = null;

  heroCtx?.revert();
  heroCtx = null;
  heroTl = null;

  removeKeyListener?.();
  removeKeyListener = null;

  lockScroll(false);
});
</script>

<style scoped>
.whyus {
  max-width: 1380px;
  height: auto;
  margin: 0 auto;
}

.scollingmember {
  width: 100%;
  height: auto;
}

/* ---- hero base ---- */
.hero {
  position: relative;
  min-height: 100svh;
  padding: 22px 18px 70px;
  overflow: hidden;
  background: #07050f;
  color: rgba(255, 255, 255, 0.92);
}

.bg {
  position: absolute;
  inset: 0;
  pointer-events: none;
  z-index: 0;
}

.bgRadial {
  position: absolute;
  inset: -20%;
  background: radial-gradient(980px 520px at 50% 18%, rgba(0, 200, 255, 0.12), transparent 62%),
    radial-gradient(980px 620px at 42% 40%, rgba(0, 0, 191, 0.18), transparent 65%),
    radial-gradient(880px 620px at 60% 72%, rgba(124, 58, 237, 0.12), transparent 68%);
  filter: blur(2px);
}

.bgGrid {
  position: absolute;
  inset: 0;
  background-image: linear-gradient(rgba(255, 255, 255, 0.06) 1px, transparent 1px),
    linear-gradient(90deg, rgba(255, 255, 255, 0.06) 1px, transparent 1px);
  background-size: 58px 58px;
  opacity: 0.06;
  mask-image: radial-gradient(closest-side at 50% 25%, rgba(0, 0, 0, 1), rgba(0, 0, 0, 0));
}

.bgNoise {
  position: absolute;
  inset: 0;
  opacity: 0.08;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='180' height='180'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.8' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='180' height='180' filter='url(%23n)' opacity='.6'/%3E%3C/svg%3E");
  background-size: 180px 180px;
  mix-blend-mode: overlay;
}

/* ---- nav ---- */
.nav {
  position: relative;
  z-index: 2;
  max-width: 1380px;
  margin: 0 auto;
}

.navInner {
  height: 56px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px 14px;
  border-radius: 999px;
  background: rgba(10, 8, 18, 0.55);
  border: 1px solid rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.35), inset 0 1px 0 rgba(255, 255, 255, 0.06);
}

.brand {
  display: flex;
  align-items: center;
  gap: 10px;
  user-select: none;
}

.brandMark {
  width: 50px;
  height: 50px;
  display: grid;
  place-items: center;
}

.brandMark img {
  width: 100%;
  height: 100%;
  object-fit: contain;
}

.brandText {
  font-weight: 800;
  letter-spacing: 0.12em;
  font-size: 12px;
  opacity: 0.92;
}

.navLinks {
  display: flex;
  gap: 32px;
  align-items: center;
}

.navLink {
  color: rgb(255, 255, 255);
  font-size: var(--fs-xs);
  text-decoration: none;
  transition: opacity 0.2s ease, transform 0.2s ease;
  cursor: pointer;
}

.navLink:hover {
  opacity: 1;
  transform: translateY(-1px);
}

.navRight {
  display: flex;
  align-items: center;
  gap: 10px;
}

.iconBtn {
  width: 36px;
  height: 36px;
  border-radius: 999px;
  display: grid;
  place-items: center;
  border: 1px solid rgba(255, 255, 255, 0.12);
  background: rgba(10, 8, 18, 0.35);
  color: rgba(255, 255, 255, 0.92);
  text-decoration: none;
  transition: transform 0.2s ease, background 0.2s ease, border-color 0.2s ease;
  backdrop-filter: blur(10px);
}

.iconBtn:hover {
  transform: translateY(-1px);
  background: rgba(10, 8, 18, 0.55);
  border-color: rgba(255, 255, 255, 0.16);
}

.iconBtn i {
  font-size: 14px;
}

.navCta {
  height: 36px;
  padding: 0 14px;
  border-radius: 999px;
  border: 1px solid rgba(255, 255, 255, 0.12);
  background: rgba(255, 255, 255, 0.92);
  color: rgba(8, 6, 14, 1);
  font-weight: 700;
  font-size: 13px;
  cursor: pointer;
  transition: transform 0.2s ease;
}

.navCta:hover {
  transform: translateY(-1px);
}

.menuBtn {
  display: none;
  align-items: center;
  gap: 10px;
  height: 36px;
  padding: 0 12px;
  border-radius: 999px;
  border: 1px solid rgba(255, 255, 255, 0.12);
  background: rgba(10, 8, 18, 0.35);
  color: rgba(255, 255, 255, 0.92);
  cursor: pointer;
}

.menuBtn:hover {
  transform: translateY(-1px);
  background: rgba(10, 8, 18, 0.55);
}

.hamburger {
  width: 18px;
  height: 12px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.hamburger span {
  display: block;
  height: 2px;
  border-radius: 99px;
  background: rgba(255, 255, 255, 0.92);
  opacity: 0.92;
}

.menuText {
  font-weight: 700;
  font-size: 13px;
  letter-spacing: 0.02em;
}

/* ---- hero content ---- */
.container {
  position: relative;
  z-index: 1;
  max-width: 1380px;
  margin: 0 auto;
  padding-top: 26px;
  display: grid;
  grid-template-columns: 1.05fr 0.95fr;
  gap: 26px;
  align-items: center;
}

.copy {
  padding: 22px 6px;
}

.pill {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  padding: 8px 12px;
  border-radius: 999px;
  border: 1px solid rgba(255, 255, 255, 0.12);
  background: rgba(10, 8, 18, 0.55);
  backdrop-filter: blur(10px);
  font-size: 12px;
  color: rgba(255, 255, 255, 0.78);
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.05);
}

.pillDot {
  width: 10px;
  height: 10px;
  border-radius: 999px;
  background: linear-gradient(271deg, rgba(0, 0, 191, 1) 35%, rgba(0, 200, 255, 1) 100%);
  box-shadow: 0 0 18px rgba(0, 200, 255, 0.35);
}

.title {
  margin: 16px 0 10px;
  font-size: clamp(44px, 5.2vw, 78px);
  line-height: 0.98;
  letter-spacing: -0.02em;
  font-weight: 700;
}

.titleAI {
  background: linear-gradient(271deg, rgba(0, 0, 191, 1) 35%, rgba(0, 200, 255, 1) 100%);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
  text-shadow: 0 18px 60px rgba(0, 200, 255, 0.14);
}

.desc {
  max-width: 520px;
  color: rgba(255, 255, 255, 0.7);
  font-size: 15px;
  line-height: 1.6;
  margin: 10px 0 18px;
}

.actions {
  display: flex;
  gap: 12px;
  align-items: center;
}

.btnPrimary {
  height: 44px;
  padding: 0 18px;
  border-radius: 999px;
  border: 1px solid rgba(255, 255, 255, 0.14);
  background: rgba(255, 255, 255, 0.92);
  color: rgba(8, 6, 14, 1);
  font-weight: 600;
  cursor: pointer;
  box-shadow: 0 18px 50px rgba(0, 0, 0, 0.35);
  transition: transform 0.2s ease;
}

.btnPrimary:hover {
  transform: translateY(-1px);
}

.btnGhost {
  height: 44px;
  padding: 0 18px;
  border-radius: 999px;
  border: 1px solid rgba(255, 255, 255, 0.14);
  background: rgba(10, 8, 18, 0.35);
  color: rgba(255, 255, 255, 0.86);
  backdrop-filter: blur(10px);
  cursor: pointer;
  transition: transform 0.2s ease, background 0.2s ease;
}

.btnGhost:hover {
  transform: translateY(-1px);
  background: rgba(10, 8, 18, 0.5);
}

/* ---- right stage ---- */
.deviceStage {
  position: relative;
  display: grid;
  place-items: center;
  isolation: isolate;
  padding-top: 18px;
}

.deviceGlow {
  position: absolute;
  inset: -140px -180px;
  z-index: 0;
  background: linear-gradient(271deg, rgb(1, 0, 44) 35%, rgba(0, 98, 255, 0.548) 100%);
  filter: blur(78px);
  opacity: 0.78;
  transform: translateY(-12px);
  border-radius: 999px;
  pointer-events: none;
}

.globeStage {
  position: relative;
  z-index: 1;
  width: min(820px, 92vw);
  height: 740px;
  border-radius: 26px;
  backdrop-filter: blur(10px);
  transform: perspective(1200px) rotateX(6deg);
  transform-origin: center;
}

.globe {
  width: 100%;
  height: 100%;
  display: block;
}

.globePlaceholder {
  width: 100%;
  height: 100%;
  border-radius: inherit;
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid rgba(255, 255, 255, 0.08);
}

.bottomFade {
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  height: 160px;
  background: linear-gradient(180deg, transparent, rgba(7, 5, 15, 1));
  z-index: 1;
  pointer-events: none;
}

/* ✅ render-skip for below-fold sections */
.cvAuto {
  content-visibility: auto;
  contain-intrinsic-size: 900px;
}

/* ✅ responsive navbar */
@media (max-width: 980px) {
  .container {
    grid-template-columns: 1fr;
    gap: 10px;
  }

  .copy {
    padding: 18px 2px;
  }

  .navLinks {
    display: none;
  }

  .menuBtn {
    display: flex;
  }

  .globeStage {
    width: min(760px, 96vw);
    height: 420px;
  }
}

@media (max-width: 520px) {
  .globeStage {
    height: 340px;
  }

  .title {
    font-size: 44px;
  }

  .iconBtn {
    width: 34px;
    height: 34px;
    display: none;
  }

  .navCta {
    height: 34px;
  }

  .menuBtn {
    height: 34px;
  }
}

@media (max-width: 464px) {
  .navCta {
    display: none;
  }
}

/* ---------------- Loader (Tech Glow) ---------------- */
.pageLoader {
  position: fixed;
  inset: 0;
  z-index: 9999;
  display: grid;
  place-items: center;
  background: radial-gradient(980px 520px at 50% 18%, rgba(0, 200, 255, 0.16), transparent 62%),
    radial-gradient(980px 620px at 42% 40%, rgba(0, 0, 191, 0.18), transparent 65%),
    rgba(7, 5, 15, 0.92);
  backdrop-filter: blur(14px);
}

.loaderCard {
  position: relative;
  width: min(520px, 90vw);
  padding: 26px 24px 22px;
  border-radius: 24px;
  border: 1px solid rgba(255, 255, 255, 0.12);
  background: rgba(10, 8, 18, 0.55);
  box-shadow: 0 30px 90px rgba(0, 0, 0, 0.55), inset 0 1px 0 rgba(255, 255, 255, 0.06);
  overflow: hidden;
}

.techCard {
  display: grid;
  grid-template-columns: 170px 1fr;
  gap: 18px;
  align-items: center;
}

.techGridOverlay {
  position: absolute;
  inset: 0;
  pointer-events: none;
  opacity: 0.12;
  background-image: linear-gradient(rgba(255, 255, 255, 0.12) 1px, transparent 1px),
    linear-gradient(90deg, rgba(255, 255, 255, 0.12) 1px, transparent 1px);
  background-size: 48px 48px;
  mask-image: radial-gradient(closest-side at 40% 45%, rgba(0, 0, 0, 1), rgba(0, 0, 0, 0));
}

.techOrb {
  position: relative;
  width: 150px;
  height: 150px;
  border-radius: 999px;
  display: grid;
  place-items: center;
  isolation: isolate;
  transform: translateZ(0);
}

.orbGlow {
  position: absolute;
  inset: -32px;
  border-radius: 999px;
  background: radial-gradient(circle at 50% 50%, rgba(0, 200, 255, 0.22), transparent 62%);
  filter: blur(14px);
  opacity: 0.55;
  z-index: 0;
}

.orbCore {
  position: absolute;
  inset: 22px;
  border-radius: 999px;
  z-index: 2;
  overflow: hidden;
  display: grid;
  place-items: center;
  border: 1px solid rgba(255, 255, 255, 0.1);
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.1);
  will-change: transform;
}

.orbCore::before {
  content: "";
  position: absolute;
  inset: -6px;
  border-radius: 999px;
  background: radial-gradient(circle at 30% 25%, rgba(0, 200, 255, 0.35), rgba(0, 0, 191, 0.14) 55%, rgba(0, 0, 0, 0) 80%),
    radial-gradient(circle at 60% 70%, rgba(124, 58, 237, 0.16), rgba(0, 0, 0, 0) 70%);
  opacity: 0.9;
  pointer-events: none;
}

.orbLogo {
  position: relative;
  width: 88%;
  height: 88%;
  object-fit: contain;
  border-radius: 999px;
  filter: drop-shadow(0 18px 60px rgba(0, 200, 255, 0.18));
  transform-origin: center;
  will-change: transform;
}

.orbRing {
  position: absolute;
  inset: 6px;
  border-radius: 999px;
  border: 1px solid rgba(0, 200, 255, 0.28);
  box-shadow: 0 0 28px rgba(0, 200, 255, 0.2);
  z-index: 1;
  will-change: transform;
}

.ring2 {
  inset: 18px;
  border-color: rgba(124, 58, 237, 0.24);
  box-shadow: 0 0 26px rgba(124, 58, 237, 0.18);
}

.ring3 {
  inset: 30px;
  border-color: rgba(0, 0, 191, 0.22);
  box-shadow: 0 0 24px rgba(0, 0, 191, 0.16);
}

.orbScan {
  position: absolute;
  left: 12px;
  right: 12px;
  height: 18px;
  border-radius: 999px;
  background: linear-gradient(90deg, transparent, rgba(0, 200, 255, 0.55), transparent);
  filter: blur(0.2px);
  opacity: 0;
  z-index: 3;
  will-change: transform, opacity;
}

.techMeta {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.techLabel {
  font-size: 12px;
  letter-spacing: 0.22em;
  text-transform: uppercase;
  color: rgba(255, 255, 255, 0.82);
}

.techSub {
  font-size: 13px;
  color: rgba(255, 255, 255, 0.62);
}

.techBar {
  margin-top: 8px;
  width: min(280px, 100%);
  height: 6px;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.1);
  overflow: hidden;
}

.techBarFill {
  display: block;
  height: 100%;
  width: 45%;
  border-radius: inherit;
  background: linear-gradient(271deg, rgba(0, 0, 191, 1) 35%, rgba(0, 200, 255, 1) 100%);
  will-change: transform;
}

.techDots {
  display: flex;
  gap: 6px;
  margin-top: 6px;
}

.techDots span {
  width: 6px;
  height: 6px;
  border-radius: 999px;
  background: rgba(0, 200, 255, 0.85);
  opacity: 0.25;
  transform: scale(1);
}
</style>
