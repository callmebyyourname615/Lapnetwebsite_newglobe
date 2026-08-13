<template>
    <section class="hero" ref="heroRef">
        <div class="hero-inner">
            <!-- LEFT: TEXT -->
            <div class="hero-left">
                <h1 class="hero-title">
                    ໂອນເງິນ<span>ຂ້າມທະນາຄານ ສະກຸນເງິນຕາຕ່າງປະເທດ</span> ຜ່ານ LAPNet
                </h1>
                <p class="hero-subtitle">
                    "ບໍລິການໂອນເງິນ ສະກຸນເງິນຕາຕ່າງປະເທດ ຂ້າມທະນາຄານ" ເພື່ອເພີ່ມທາງເລືອກ ແລະ
                    ຕອບໂຈດຄວາມຕ້ອງການດ້ານທຸລະກຳການເງິນໃຫ້ມີຄວາມຫຼາກຫຼາຍ ແລະ ຄ່ອງຕົວຂຶ້ນກວ່າເກົ່າ ໂດຍສະເພາະສອງສະກຸນເງິນ
                    ຄື: ສະກຸນເງິນ ໂດລາສະຫະລັດ (USD) ແລະ ສະກຸນເງິນ ບາດ (THB).
                    ສາມາດເຮັດທຸລະກຳໂອນເງິນໄດ້ຢ່າງສະດວກ, ວ່ອງໄວ, ມີຄວາມປອດໄພສູງ ແລະ ບໍລິການຕະຫຼອດ 24 ຊົ່ວໂມງ (24/7
                    Service).

                </p>
                <router-link :to="{ path: '/products_service/allproduct', query: { id: 4 } }">
                    <tagproduct label="ຜະລິດຕະພັນ ແລະ ການບໍລິການ ທັງໝົດ" />
                </router-link>
            </div>

            <!-- RIGHT: SINGLE 3D MOCKUP FOLLOW MOUSE -->
            <div class="hero-right" ref="wrapperRef">
                <!-- soft glowing shapes behind -->
                <div class="bg-orb bg-orb-1"></div>
                <div class="bg-orb bg-orb-2"></div>

                <div class="mockup-shadow"></div>

                <!-- gradient outer frame -->
                <div class="mockup-frame">
                    <div class="mockup-glow-ring"></div>

                    <div class="mockup-card" ref="mockupRef">
                        <div class="mockup-top-bar">
                            <div class="top-dots">
                                <span></span><span></span><span></span>
                            </div>
                            <div class="top-status">
                                <span class="status-dot"></span>
                                <span class="status-text" style="display:flex; align-items: center;">
                                    ຜະລິດຕະພັນຂອງ • LAPNet

                                </span>
                            </div>
                        </div>

                        <div class="mockup-inner">
                            <div class="image-wrap">
                                <img class="mockup-image" :src="imageSrc" alt="3D product mockup" />
                                <div class="shimmer-layer shimmer-glow" aria-hidden="true"></div>
                                <div class="shimmer-layer shimmer-band" aria-hidden="true"></div>
                                <div class="shimmer-layer shimmer-edge" aria-hidden="true"></div>
                            </div>

                            <!-- top reflection -->
                            <div class="mockup-reflection"></div>

                            <!-- subtle diagonal shine -->
                            <div class="mockup-overlay"></div>


                        </div>
                    </div>
                </div>

                <!-- extra floating accents -->
                <div class="accent-pill accent-pill-1"></div>
                <div class="accent-pill accent-pill-2"></div>
            </div>
        </div>
    </section>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from "vue";
import { gsap } from "gsap";
import tagproduct from "../../../components/tagproduct/tagproduct.vue";

const props = defineProps({
    // 🔁 put your own image URL here
    imageSrc: {
        type: String,
        default:
            "/product/product4/Transfer_Currentcy.png?v=20260813",
    },
});

const heroRef = ref(null);
const wrapperRef = ref(null);
const mockupRef = ref(null);

let ctx;

onMounted(() => {
    ctx = gsap.context(() => {
        gsap.from(".hero-left", {
            y: 30,
            opacity: 0,
            duration: 0.8,
            ease: "power3.out",
        });

        gsap.from(".mockup-frame", {
            y: 50,
            opacity: 0,
            duration: 1,
            ease: "power3.out",
            delay: 0.1,
        });

        gsap.to(".mockup-frame", {
            y: -10,
            duration: 3,
            ease: "sine.inOut",
            repeat: -1,
            yoyo: true,
            delay: 1.1,
        });

        // ✨ Premium shimmer — three coordinated layers
        const shimmerTl = gsap.timeline({ repeat: -1, repeatDelay: 1.4, delay: 1.4 });

        shimmerTl
            .fromTo(
                ".shimmer-glow",
                { xPercent: -180, opacity: 0, scaleX: 0.9 },
                {
                    xPercent: 180,
                    opacity: 1,
                    scaleX: 1.05,
                    duration: 2.2,
                    ease: "power2.inOut",
                },
                0
            )
            .fromTo(
                ".shimmer-band",
                { xPercent: -180, opacity: 0 },
                {
                    xPercent: 180,
                    opacity: 1,
                    duration: 1.9,
                    ease: "power3.inOut",
                    onStart() {
                        gsap.set(".shimmer-band", { filter: "blur(0.4px)" });
                    },
                },
                0.12
            )
            .fromTo(
                ".shimmer-edge",
                { xPercent: -200, opacity: 0 },
                {
                    xPercent: 200,
                    opacity: 0.95,
                    duration: 1.6,
                    ease: "power4.inOut",
                },
                0.22
            )
            .to(
                [".shimmer-glow", ".shimmer-band", ".shimmer-edge"],
                {
                    opacity: 0,
                    duration: 0.4,
                    ease: "power1.out",
                },
                "-=0.4"
            );
    }, heroRef);
});


onBeforeUnmount(() => {
    ctx && ctx.revert();
});
</script>

<style scoped>
.hero {
    min-height: 78vh;
    display: flex;
    align-items: center;
    padding: 2.25rem 6vw;
    background: linear-gradient(135deg, #ffffff 0%, #ffffff 45%, #ffffff 100%);
    color: #0b1020;
    position: relative;
    overflow: hidden;
}

.hero::before {
    content: "";
    position: absolute;
    inset: -40%;
    background:
        radial-gradient(circle at 10% 0%, rgba(0, 51, 171, 0.1), transparent 55%),
        radial-gradient(circle at 100% 100%, rgba(0, 3, 41, 0.12), transparent 55%);
    opacity: 0.9;
    pointer-events: none;
}

.hero-inner {
    position: relative;
    z-index: 1;
    display: flex;
    gap: 3rem;
    align-items: center;
    justify-content: space-between;
    max-width: 1240px;
    margin: 0 auto;
}

/* LEFT */
.hero-left {
    flex: 1;
    max-width: 520px;
}

.hero-title {
    margin-top: 1.4rem;
    font-size: clamp(2rem, 3vw, 4.2rem);
    line-height: 1.1;
    font-weight: 700;
    color: #0b1020;
}

.hero-title span {
    background: linear-gradient(120deg, #0033ab 0%, #0078ff 40%, #00c6ff 100%);
    -webkit-background-clip: text;
    background-clip: text;
    color: transparent;
}

.hero-subtitle {
    margin-top: 1rem;
    text-align: justify;

    font-size: 0.98rem;

    line-height: 1.7;
    margin-bottom: 40px;
    color: #566280;
}

/* RIGHT */
.hero-right {
    flex: 1;
    display: flex;
    justify-content: center;
    align-items: center;
    position: relative;
    perspective: 1100px;
}

/* soft glowing background orbs */
.bg-orb {
    position: absolute;
    border-radius: 999px;
    filter: blur(28px);
    opacity: 0.7;
    pointer-events: none;
}

.bg-orb-1 {
    width: 220px;
    height: 220px;
    background: linear-gradient(95deg,
            rgba(0, 3, 41, 0.2) 0%,
            rgba(0, 51, 171, 0.35) 46%);
    top: -10%;
    left: 10%;
}

.bg-orb-2 {
    width: 260px;
    height: 260px;
    background: radial-gradient(circle at 30% 30%,
            rgba(0, 51, 171, 0.25),
            rgba(0, 3, 41, 0.15));
    bottom: -12%;
    right: 0;
}

.mockup-shadow {
    position: absolute;
    width: 280px;
    height: 70px;
    border-radius: 999px;
    background: rgba(8, 16, 40, 0.2);
    filter: blur(24px);
    bottom: -8px;
    z-index: 0;
}

/* outer gradient frame using your gradient */
.mockup-frame {
    position: relative;
    z-index: 1;
    padding: 1px;
    border-radius: 28px;
    background: linear-gradient(95deg,
            rgba(0, 3, 41, 1) 0%,
            rgba(0, 51, 171, 1) 46%);
    box-shadow:
        0 24px 70px rgba(0, 15, 45, 0.18),
        0 0 0 1px rgba(10, 20, 60, 0.08);
    overflow: hidden;
}

/* soft glow ring around frame */
.mockup-glow-ring {
    position: absolute;
    inset: -16px;
    border-radius: 36px;
    background: radial-gradient(circle at 50% -10%,
            rgba(255, 255, 255, 0.3),
            transparent 65%);
    opacity: 0.9;
    pointer-events: none;
}

/* 3D card */
.mockup-card {
    position: relative;
    width: min(560px, 42vw);
    height: auto;
    aspect-ratio: 1122 / 1448;
    border-radius: 26px;

    overflow: hidden;
}

/* top bar */
.mockup-top-bar {
    position: absolute;
    top: 8px;
    left: 10px;
    right: 10px;
    height: 26px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 0.6rem;
    border-radius: 999px;
    background: rgba(255, 255, 255, 0.85);
    backdrop-filter: blur(14px);
    border: 1px solid rgba(180, 195, 245, 0.9);
    transform: translateZ(40px);
}

.top-dots {
    display: flex;
    gap: 0.25rem;
}


.top-status {
    display: flex;
    align-items: center;
    gap: 0.35rem;
    font-size: 0.68rem;
    color: #3f4c7a;
}



/* inner content */
.mockup-inner {
    position: absolute;
    inset: 38px 16px 16px 16px;
    border-radius: 18px;
    overflow: hidden;
    transform: translateZ(30px);
    box-shadow: 0 16px 45px rgba(9, 22, 70, 0.22);
    background: #06175d;
    /* in case image has transparency */
}

.mockup-image {
    width: 100%;
    height: 100%;
    object-fit: contain;
    display: block;
}

/* ✨ premium shimmer — three layered GSAP-driven sweeps */
.image-wrap {
    position: absolute;
    inset: 0;
    overflow: hidden;
}

.shimmer-layer {
    position: absolute;
    top: -25%;
    left: 0;
    height: 150%;
    pointer-events: none;
    transform: skewX(-22deg);
    will-change: transform, opacity;
    z-index: 3;
    opacity: 0;
}

/* soft outer glow halo */
.shimmer-glow {
    width: 55%;
    background: linear-gradient(110deg,
            rgba(255, 255, 255, 0) 0%,
            rgba(170, 210, 255, 0.18) 35%,
            rgba(255, 255, 255, 0.35) 50%,
            rgba(170, 210, 255, 0.18) 65%,
            rgba(255, 255, 255, 0) 100%);
    filter: blur(22px);
    mix-blend-mode: screen;
}

/* main bright band */
.shimmer-band {
    width: 28%;
    background: linear-gradient(115deg,
            rgba(255, 255, 255, 0) 0%,
            rgba(255, 255, 255, 0.55) 38%,
            rgba(255, 255, 255, 0.95) 50%,
            rgba(255, 255, 255, 0.55) 62%,
            rgba(255, 255, 255, 0) 100%);
    mix-blend-mode: screen;
    filter: blur(0.6px);
}

/* razor-thin leading edge */
.shimmer-edge {
    width: 6%;
    background: linear-gradient(110deg,
            rgba(255, 255, 255, 0) 0%,
            rgba(220, 235, 255, 0.8) 45%,
            rgba(255, 255, 255, 1) 50%,
            rgba(220, 235, 255, 0.8) 55%,
            rgba(255, 255, 255, 0) 100%);
    mix-blend-mode: screen;
    filter: blur(0.3px);
}

/* top reflection band (under sweep) */
.mockup-reflection {
    position: absolute;
    top: -18%;
    left: -10%;
    width: 130%;
    height: 40%;
    background: linear-gradient(180deg,
            rgba(255, 255, 255, 0.3),
            transparent 80%);
    transform: skewY(-10deg);
    pointer-events: none;
    z-index: 1;
}

/* diagonal shine (under sweep) */
.mockup-overlay {
    position: absolute;
    inset: 0;
    background: linear-gradient(135deg,
            rgba(0, 51, 171, 0.12),
            transparent 45%,
            rgba(0, 3, 41, 0.32) 100%);
    mix-blend-mode: screen;
    pointer-events: none;
    z-index: 2;
}

/* floating glass chips */
.mockup-chip {
    position: absolute;
    padding: 0.4rem 0.8rem;
    border-radius: 999px;
    font-size: 0.7rem;
    background: rgba(255, 255, 255, 0.94);
    color: #2c3555;
    border: 1px solid rgba(0, 51, 171, 0.25);
    display: inline-flex;
    align-items: center;
    gap: 0.35rem;
    backdrop-filter: blur(12px);
    transform: translateZ(55px);
    box-shadow: 0 8px 25px rgba(9, 22, 70, 0.15);
    z-index: 4;
}

.mockup-chip-bottom {
    bottom: 12px;
    left: 16px;
}

.chip-pill {
    width: 16px;
    height: 8px;
    border-radius: 999px;
    background: linear-gradient(95deg,
            rgba(0, 3, 41, 1) 0%,
            rgba(0, 51, 171, 1) 46%);
}

/* extra floating accents around mockup */
.accent-pill {
    position: absolute;
    border-radius: 999px;
    backdrop-filter: blur(12px);
    border: 1px solid rgba(0, 51, 171, 0.25);
    background: rgba(255, 255, 255, 0.8);
    box-shadow: 0 12px 30px rgba(9, 22, 70, 0.12);
}



@media (max-width: 960px) {
    .hero {
        padding: 3.4rem 7vw 4.2rem;
    }

    .hero-inner {
        flex-direction: column;
        text-align: left;
        gap: 3rem;
    }

    .hero-left {
        max-width: 100%;
    }

    .hero-right {
        width: 100%;
    }

    .mockup-card {
        width: min(420px, 92vw);
        aspect-ratio: 1122 / 1448;
    }

    .mockup-frame {
        transform: scale(0.96);
    }
}

@media (max-width: 640px) {
    .hero {
        padding: 2.7rem 6vw 3.4rem;
    }

    .mockup-frame {
        transform: scale(0.9);
    }
}
</style>
