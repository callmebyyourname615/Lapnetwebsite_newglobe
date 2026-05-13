<template>
  <!-- Desktop links -->
  
  <!-- <popupoverlay
  :debugAlwaysShow="true"
  /> -->
  <popupoverlay/>

 

  <div class="herosectionhomepage" id="hero">
    <mockupherosectionpage />
  </div>

  <div class="vision" id="vision">
    <SwitchSplit
      company-name="LAPNet"
      logo-src="/logolapnet/fullcircle.png"
      image1="/homepage/Vision.png"
      image2="/homepage/missionhome.png"
      label-a="VISION"
      label-b="MISSION"
    >
      <template #content1>
        <p style="margin: 0; opacity: 0.7">
          ພັດທະນາລະບົບການຊໍາລະທຸລະກຳຍ່ອຍ ໃຫ້ເປັນສູນກາງການຊໍາລະຂອງບັນດາຜູ້ໃຫ້ບໍລິການຊໍາລະ ທັງພາຍໃນ ແລະ ສາກົນ, ແນໃສ່ໃຫ້ປະຊາຊົນລາວໄດ້ໃຊ້ບໍລິການຊໍາລະທີ່ສະດວກວ່ອງໄວ, ທັນສະໄໝ, ປອດໄພ ແລະ ຕົ້ນທືນຕໍ່າ.
        </p>
      </template>

      <template #content2>
        <p style="margin: 0; opacity: 0.7">
          ພັດທະນາລະບົບການຊໍາລະໃຫ້ມີຄວາມຫຼາກຫຼາຍ, ທັນສະໄໝ, ຕອບຮັບໄດ້ທຸກຊ່ອງທາງການຊໍາລະທີ່ເກີດຂື້ນ,
          ເຕົ້າໂຮມເອົາບັນດາທະນາຄານທຸລະກິດ, ສະຖາບັນການເງິນ ແລະ ບໍລິສັດ Fintech ທີ່ເປັນຜູ້ໃຫ້ບໍລິການຊໍາລະ
          ໃຫ້ເຂົ້າມາເປັນສະມາຊີກຂອງບໍລິສັດ ເພື່ອພ້ອມກັນໃຫ້ບໍລິການລະບົບການຊໍາລະແກ່ສັງຄົມ,
          ຫັນເອົາການເຊື່ອມຕໍ່ສາກົນທີ່ມີລັກສະນະກະແຈກກະຈາຍລວມສູນເຂົ້າມາເຊື່ອມຕໍ່ເປັນຮູບແບບລະບົບປະຕູດຽວເພື່ອຫຼຸດຜ່ອນຕົ້ນທືນລວມຂອງທົ່ວລະບົບ,
          ເສີມຂະຫຍາຍຄວາມຮູ້-ເຂົ້າໃຈໃຫ້ແກ່ມວນຊົນໄດ້ຮັບຮູ້ເຖິງຄວາມສຳຄັນ ແລະ
          ປະໂຫຍກຂອງການນຳໃຊ້ລະບົບການຊໍາລະເອເລັກໂຕຣນິກຢ່າງຖ່ອງແທ້ ເພື່ອເຮັດໃຫ້ມວນຊົນໄດ້ນຳໃຊ້ລະບົບການຊໍາລະຢ່າງຖືກຕ້ອງ
          ແລະ ປອດໄພ ເປັນການເສີມສ້າງຄວາມໝັ້ນໃຈໃຫ້ແກ່ມວນຊົນ.
        </p>
      </template>
    </SwitchSplit>
  </div>

  <div class="whytus" id="why">
    <whychooseus
      title="Why choose LAPNET"
      description="ບໍລິສັດ ລາວເນ ເຊີນນໍ ເພເມັ້ນ ເນັດເວີກ ຈຳກັດ (LAPNet)  ເປັນຜູ້ໃຫ້ບໍລິການລະບົບ ຊໍາລະທຸລະກໍາຍ່ອຍທົ່ວໄປ ຕາມທີ່ໄດ້ກໍານົດໄວ້ໃນກົດໝາຍວ່າດ້ວຍລະບົບການຊໍາລະ. ຊຶ່ງເຮັດໜ້າທີ່ເປັນໂຕກາງໃນການ ເຊື່ອມໂຍງກັບທຸກຂະແໜງການຊຳລະທີ່ເປັນທະນາຄານ, ສະຖາບັນການເງິນ ແລະ ຜູ້ໃຫ້ບໍລິການ ການຊຳລະແຫ່ງດຽວໃນ ສປປ ລາວ;"
      :stat1Value="19"
      stat1Label="Commercial Bank"
      stat1Suffix=""
      :stat2Value="2"
      stat2Label="Fintech"
      stat2Suffix=""
    />
  </div>

  <div class="memberscroll" id="members">
    <memberorbit />
  </div>

  <div class="heroproduct" id="products">
    <productherosectionhomepage />
  </div>

  <div class="boxpadding" style="width: 100%; height: 15vh"></div>

  <div class="bloghomepage" id="blog">
    <bloghomepage />
  </div>

  <div class="boxpadding" style="width: 100%; height: 15vh"></div>

  <secondfooter id="footer" />

  
</template>

<style scoped>
.herosectionhomepage {
  width: 100%;
  height: auto;
  position: relative;
  overflow: hidden;
  isolation: isolate;
  background:
    radial-gradient(circle at 14% 18%, rgba(67, 124, 255, 0.22), transparent 0 34%),
    radial-gradient(circle at 82% 12%, rgba(76, 214, 255, 0.14), transparent 0 28%),
    radial-gradient(circle at 50% 88%, rgba(18, 75, 194, 0.28), transparent 0 42%),
    linear-gradient(135deg, #020712 0%, #061121 28%, #0b1f43 62%, #041325 100%);
  border-bottom: 1px solid rgba(126, 186, 255, 0.12);
  box-shadow: inset 0 -80px 120px rgba(2, 8, 22, 0.82);
}

.herosectionhomepage::before {
  content: "";
  position: absolute;
  inset: 0;
  pointer-events: none;
  background:
    linear-gradient(180deg, rgba(176, 220, 255, 0.08) 0%, transparent 18%),
    repeating-linear-gradient(90deg, rgba(86, 152, 255, 0.04) 0 1px, transparent 1px 120px),
    repeating-linear-gradient(180deg, rgba(86, 152, 255, 0.035) 0 1px, transparent 1px 120px);
  opacity: 0.42;
  mask-image: linear-gradient(180deg, rgba(0, 0, 0, 0.95), rgba(0, 0, 0, 0.58) 66%, transparent);
}

.herosectionhomepage::after {
  content: "";
  position: absolute;
  inset: auto 0 0;
  height: min(220px, 24vw);
  background: linear-gradient(180deg, rgba(2, 8, 22, 0), rgba(2, 8, 22, 0.9));
  pointer-events: none;
  z-index: 0;
}

.herosectionhomepage :deep(.page) {
  background:
    radial-gradient(1100px 680px at 62% 48%, rgba(31, 100, 255, 0.18), transparent 60%),
    radial-gradient(720px 420px at 76% 18%, rgba(76, 214, 255, 0.12), transparent 52%),
    linear-gradient(145deg, rgba(2, 7, 20, 0.74), rgba(3, 14, 34, 0.18)) !important;
}

.herosectionhomepage :deep(.topbar),
.herosectionhomepage :deep(.nav),
.herosectionhomepage :deep(.badge),
.herosectionhomepage :deep(.btn),
.herosectionhomepage :deep(.iconLink),
.herosectionhomepage :deep(.hamburger) {
  border-color: rgba(126, 186, 255, 0.14);
  background: rgba(6, 17, 44, 0.34);
  box-shadow:
    inset 0 1px 0 rgba(214, 235, 255, 0.06),
    0 18px 40px rgba(2, 12, 34, 0.28);
}

.herosectionhomepage :deep(.heroTitle) {
  text-shadow: 0 0 34px rgba(35, 102, 255, 0.16);
}

.herosectionhomepage :deep(.ai) {
  background: linear-gradient(135deg, #9be4ff 0%, #74b6ff 36%, #4b7fff 100%);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
  text-shadow: 0 0 38px rgba(68, 138, 255, 0.28);
}

.herosectionhomepage :deep(.heroPara) {
  color: rgba(222, 236, 255, 0.76);
}

.herosectionhomepage :deep(.mockupSlot) {
  border: none;
  border-radius: 0;
  background: transparent;
  box-shadow: none;
  overflow: visible;
}

.herosectionhomepage :deep(.mockupFill),
.herosectionhomepage :deep(.globeWrap) {
  position: relative;
  z-index: 1;
}

.herosectionhomepage :deep(.globeWrap) {
  background: transparent;
  border-radius: 0;
  overflow: visible;
}

.herosectionhomepage :deep(.globeCanvas) {
  filter:
    saturate(1.08)
    contrast(1.05)
    brightness(0.96)
    drop-shadow(0 0 26px rgba(43, 109, 255, 0.26))
    drop-shadow(0 0 82px rgba(76, 214, 255, 0.1));
}

.globemockup {
  width: 100%;
  height: auto;
  background:
    linear-gradient(145deg, #020712 0%, #081a3a 55%, #041325 100%);
}

.bloghomepage {
  width: 100%;
  height: auto;
  margin: 0 auto;
}

.heroproduct {
  max-width: 100%;
  height: auto;
  margin: 0 auto;
}

.memberscroll {
  width: 100%;
  height: auto;
}

.whyus {
  max-width: 1380px;
  height: auto;
  margin: 0 auto;
}

.vision {
  max-width: 100%;
  height: auto;
}

@media (max-width: 980px) {
  .herosectionhomepage {
    background:
      radial-gradient(circle at 50% 12%, rgba(76, 214, 255, 0.12), transparent 0 28%),
      radial-gradient(circle at 50% 78%, rgba(31, 100, 255, 0.2), transparent 0 40%),
      linear-gradient(180deg, #020712 0%, #08152f 52%, #041325 100%);
  }

  .herosectionhomepage :deep(.mockupSlot) {
    border-radius: 0;
    box-shadow: none;
  }
}

/* =========================
   ✅ Bottom-left Eye Viewer
   Glassmorphism + Modern Blue
   ========================= */

</style>

<script setup>
import mockupherosectionpage from "./mockupherosectionpage.vue"
import atmmockup from "../../components/mockup/atmmockup.vue"
import bloghomepage from "../../components/blog/hompage/bloghomepage.vue"
import main_navbar from "../../components/miannavbar/main_navbar.vue"
import SwitchSplit from "./visionherosection.vue"
import whychooseus from "./whychooseus.vue"
import memberorbit from "../../components/swiper/memberscrolling/memberorbit.vue"
import productherosectionhomepage from "./productherosectionhomepage.vue"
import secondfooter from "../../components/footer/mainfooter/secondfooter.vue"
import popupoverlay from "../../components/popup/popupoverlay.vue"

import { ref, onMounted, onBeforeUnmount, nextTick, watch } from "vue"
import { gsap } from "gsap"

/** ✅ TEST MODE: 3 Hour per show  */
// const INTERVAL_MS = 3 * 60 * 60 * 1000 // 3 hours
const INTERVAL_MS = 1 * 60 * 1000 // 3 hours

const KEY_LAST = "home_popups_last_shown_ts_test"
const KEY_STATE = "home_two_popups_state_test"

const show1 = ref(false)
const show2 = ref(false)

function getNumber(key) {
  try {
    const v = localStorage.getItem(key)
    if (!v) return null
    const n = Number(v)
    return Number.isFinite(n) ? n : null
  } catch {
    return null
  }
}

function setValue(key, val) {
  try {
    localStorage.setItem(key, String(val))
  } catch {}
}

function shouldShowNow() {
  const last = getNumber(KEY_LAST)
  if (!last) return true
  return Date.now() - last >= INTERVAL_MS
}

function markShownNow() {
  setValue(KEY_LAST, Date.now())
}

function setState(val) {
  setValue(KEY_STATE, val)
}

onMounted(() => {
  if (!shouldShowNow()) return
  markShownNow()
  setState("step1")
  setTimeout(() => {
    show1.value = true
  }, 500)
})

function handleClosed1() {
  show1.value = false
  setState("step2")
  setTimeout(() => {
    show2.value = true
  }, 200)
}

function handleClosed2() {
  show2.value = false
  setState("done")
}

/* ===========================
   ✅ Viewer Today + Week (static now)
   =========================== */
const viewerToday = ref(300)
const viewerWeek = ref(300)

const viewerOpen = ref(false)

const viewerWrapRef = ref(null)
const viewerPanelRef = ref(null)
const eyeIconRef = ref(null)

function toggleViewer() {
  viewerOpen.value = !viewerOpen.value
}
function closeViewer() {
  viewerOpen.value = false
}
function refreshViewer() {
  // future: fetch again, for now pulse animation
  pulseViewer()
}

/**
 * ✅ FUTURE (DB/API example):
 * async function loadViews() {
 *   const res = await fetch("/api/views") // { today: number, week: number }
 *   const data = await res.json()
 *   viewerToday.value = data.today
 *   viewerWeek.value = data.week
 * }
 */

function pulseViewer() {
  const wrap = viewerWrapRef.value
  if (!wrap) return

  gsap.fromTo(
    wrap,
    { y: 0 },
    { y: -6, duration: 0.18, ease: "power2.out", yoyo: true, repeat: 1 }
  )

  if (eyeIconRef.value) {
    gsap.fromTo(
      eyeIconRef.value,
      { scale: 1 },
      { scale: 1.08, duration: 0.18, ease: "power2.out", yoyo: true, repeat: 1 }
    )
  }
}

function onKeydown(e) {
  if (e.key === "Escape") closeViewer()
}

onMounted(async () => {
  window.addEventListener("keydown", onKeydown)
  await nextTick()

  // entrance
  if (viewerWrapRef.value) {
    gsap.from(viewerWrapRef.value, {
      y: 18,
      autoAlpha: 0,
      duration: 0.8,
      ease: "power3.out",
      delay: 0.1,
    })
  }

  // panel initial (no padding on wrapper to allow true height 0)
  if (viewerPanelRef.value) {
    gsap.set(viewerPanelRef.value, {
      height: 0,
      autoAlpha: 0,
      y: 8,
      pointerEvents: "none",
      overflow: "hidden",
    })
  }
})

onBeforeUnmount(() => {
  window.removeEventListener("keydown", onKeydown)
})

watch(viewerOpen, async (open) => {
  await nextTick()
  const panel = viewerPanelRef.value
  if (!panel) return

  gsap.killTweensOf(panel)

  if (open) {
    gsap.set(panel, { pointerEvents: "auto" })
    gsap.fromTo(
      panel,
      { height: 0, autoAlpha: 0, y: 10 },
      { height: "auto", autoAlpha: 1, y: 0, duration: 0.32, ease: "power2.out" }
    )
    pulseViewer()
  } else {
    gsap.to(panel, {
      height: 0,
      autoAlpha: 0,
      y: 8,
      duration: 0.22,
      ease: "power2.in",
      onComplete: () => gsap.set(panel, { pointerEvents: "none" }),
    })
  }
})
</script>
