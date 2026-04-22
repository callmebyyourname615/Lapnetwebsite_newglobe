<template>
  <div class="video-background-container">
    <!-- Background Video -->
    <video ref="videoRef" class="video-bg" autoplay muted loop playsinline>
      <source :src="videoSrc" type="video/mp4" />
      Your browser does not support HTML5 video.
    </video>

    <!-- Center Content -->
    <div class="content">
      <div class="glass-card">
        <div class="topcontainer">
          <h1 ref="titleRef">
            ຈີນ
            <img src="https://flagcdn.com/cn.svg" alt="China Flag" />
            ສະແກນຊຳລະ ລາວ
            <img src="https://flagcdn.com/la.svg" alt="Laos Flag" />
            : ນັກທ່ອງທ່ຽວຈີນ (ແລະ ອື່ນໆ) ຊຳລະຢູ່ລາວ
          </h1>
        </div>

        <div class="centercontainer">
          <div class="headercondition">
            <p>
              ເບື້ອງລາວ (ຮັບການຊຳລະ) : 10 ທະນາຄານສະມາຊິກ.
            </p>
          </div>
          <div class="logomember">
            <div class="logo-row">
              <img src="/logoallmember/retangle_scale/BCEL.png" alt="BCEL" />
              <img src="/Logomember/APB.png" alt="APB" />
              <img src="/logoallmember/retangle_scale/LDBnew.png" alt="LDB" />
              <img src="/logoallmember/retangle_scale/LVBnew.png" alt="LVB" />
              <img src="/logoallmember/retangle_scale/jdbnew.png" alt="JDB" />
              <img src="/logoallmember/retangle_scale/STB.jpg" alt="STB" />
              <img src="/logoallmember/retangle_scale/mjbl.jpeg" alt="MJBL" />
              <img src="/logoallmember/retangle_scale/ACL.jpg" alt="ACL" />
              <img src="/logoallmember/retangle_scale/psvb.PNG" alt="PSVB" />
              <img src="/logoallmember/retangle_scale/MB.png" alt="MB" />
            </div>
          </div>
        </div>

        <div class="bottomcontainer">
          <div class="headercondition">
            <p class="upi-text">
              ເບື້ອງຈີນ/ສາກົນ (ສະແກນຊຳລະ) : ທະນາຄານທີ່ເປັນສະມາຊິກຂອງ Unionpay International ໃນທົ່ວໂລກ <br>( Cross-border transactions may incur a transaction fee ) 
            </p>
          </div>

          <div class="logomember">
            <div class="unoinpaycontainer">
              <img
                class="union-logo-main"
                src="/logoallmember/retangle_scale/upi.png"
                alt="UnionPay"

                id="upiimage"
              />
          
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch, nextTick } from "vue";
import { gsap } from "gsap";

const videoSrc = "/videos/testcrossborder.mp4";
const videoRef = ref(null);
const titleRef = ref(null);

// dropdown country if you use it
const selectedCountry = ref("china");

// refs for future logo-row animations if needed
const row2Ref = ref(null);
const row3Ref = ref(null);

const onChangeCountry = (countryId) => {
  if (selectedCountry.value === countryId) return;
  selectedCountry.value = countryId;
};

const animateRows = () => {
  if (row2Ref.value) {
    gsap.fromTo(
      row2Ref.value,
      { opacity: 0, y: 25 },
      {
        opacity: 1,
        y: 0,
        duration: 0.6,
        ease: "power3.out",
      }
    );
  }

  if (row3Ref.value) {
    gsap.fromTo(
      row3Ref.value,
      { opacity: 0, y: 35 },
      {
        opacity: 1,
        y: 0,
        duration: 0.6,
        ease: "power3.out",
        delay: 0.08,
      }
    );
  }
};

onMounted(() => {
  if (titleRef.value) {
    gsap.from(titleRef.value, {
      y: -40,
      opacity: 0,
      duration: 1,
      ease: "power3.out",
    });
  }

  animateRows();
});

watch(selectedCountry, async () => {
  await nextTick();
  animateRows();
});
</script>

<style scoped>
/* ===== Base layout ===== */
#upiimage{
  width: 100%;
  height: 100%;

  border-radius: 20px;
}
.video-background-container {
  position: relative;
  width: 100%;
  min-height: 100vh; /* full screen instead of fixed 1000px */
  padding: 40px 0;
  box-sizing: border-box;
  overflow: hidden;
  display: flex;
  justify-content: center;
  align-items: center;
  color: #fff;
  font-family: "Poppins", sans-serif;
  z-index: 0;
}

.video-bg {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: top;
  filter: brightness(70%);
  z-index: 1;
}

.content {
  position: relative;
  z-index: 3;
  width: 90%;
  max-width: 1200px;
  min-height: 60vh;
  display: flex;
  flex-direction: column;
}

/* ===== Glass card ===== */

.glass-card {
  width: 100%;
  height: 100%;
  padding: 24px 32px;
  box-sizing: border-box;
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(5px);
  -webkit-backdrop-filter: blur(5px);
  border-radius: 20px;
  border: 1px solid rgba(255, 255, 255, 0.3);
  box-shadow:
    0 8px 32px rgba(0, 0, 0, 0.1),
    inset 0 1px 0 rgba(255, 255, 255, 0.5),
    inset 0 -1px 0 rgba(255, 255, 255, 0.1),
    inset 0 0 0px 0px rgba(255, 255, 255, 0);
  position: relative;
  overflow: hidden;
}

.glass-card::before {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 1px;
  background: linear-gradient(
    90deg,
    transparent,
    rgba(255, 255, 255, 0.8),
    transparent
  );
}

.glass-card::after {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  width: 1px;
  height: 100%;
  background: linear-gradient(
    180deg,
    rgba(255, 255, 255, 0.8),
    transparent,
    rgba(255, 255, 255, 0.3)
  );
}

/* ===== Top (title) ===== */

.topcontainer {
  width: 100%;
  min-height: 80px;
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
}

.topcontainer h1 {
  font-size: clamp(1.4rem, 2vw + 1rem, 2.5rem);
  font-weight: bold;
  display: inline-flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: center;
  gap: 8px;
  color: #fff;
}

.topcontainer img {
  width: 40px;
  height: 30px;
  border-radius: 3px;
}

/* ===== Text blocks ===== */

.centercontainer {
  margin-top: 20px;
  width: 100%;
}

.headercondition {
  width: 100%;
  min-height: 60px;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-wrap: wrap;
  gap: 12px;
  text-align: center;
  padding: 0 10px;
}

.headercondition p {
  font-size: clamp(1rem, 0.8vw + 0.8rem, 1.75rem);
  font-weight: bold;
  line-height: 1.4;
}

.upi-text {
  font-size: clamp(1rem, 1vw + 0.8rem, 1.8rem);
}

/* ===== Logo grid ===== */

.logomember {
  width: 100%;
  margin-top: 30px;
}

.logo-row {
  display: flex;
  flex-wrap: wrap; /* responsive wrapping */
  justify-content: center;
  align-items: center;
  gap: 12px;
  width: 100%;
  margin: 0 auto;
}

.logo-row img {
  width: 110px;
  max-width: 20vw;
  height: auto;
  object-fit: contain;
}

/* ===== UnionPay section ===== */

.bottomcontainer {
  margin-top: 30px;
  width: 100%;
  height: auto;
}

.unoinpaycontainer {
  width: 100%;
  max-width: 390px;
  margin: 0 auto;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 24px;
  flex-wrap: wrap;
  padding: 10px 0;
}

.unoinpaycontainer img {
  object-fit: contain;
}

.union-logo-main {
  width: 230px;
  height: auto;
}

.union-logo-sub {
  width: 180px;
  height: auto;
}

/* ===== Optional QR block (if used elsewhere) ===== */

.imgqrpayment {
  width: 30%;
  max-width: 260px;
  margin: 20px auto 0;
}

.imgqrpayment img {
  width: 100%;
  height: auto;
  object-fit: contain;
}

/* ===== Responsive breakpoints ===== */

/* Tablets */
@media (max-width: 1024px) {
  .glass-card {
    padding: 20px;
  }

  .logo-row img {
    width: 90px;
    max-width: 24vw;
  }

  .union-logo-main {
    width: 200px;
  }

  .union-logo-sub {
    width: 150px;
  }

  .imgqrpayment {
    width: 40%;
  }
}

/* Mobile & small tablets */
@media (max-width: 768px) {
  .video-background-container {
    padding: 24px 0;
  }

  .glass-card {
    padding: 16px;
  }

  .topcontainer h1 {
    font-size: clamp(1.2rem, 3vw + 0.8rem, 1.9rem);
  }

  .topcontainer img {
    width: 32px;
    height: 24px;
  }

  .logo-row {
    gap: 10px;
  }

  .logo-row img {
    width: 80px;
    max-width: 30vw;
  }

  .headercondition {
    min-height: auto;
  }

  .union-logo-main {
    width: 180px;
  }

  .union-logo-sub {
    width: 130px;
  }

  .imgqrpayment {
    width: 50%;
  }
}

/* Small phones */
@media (max-width: 480px) {
  .content {
    width: 94%;
  }

  .topcontainer h1 {
    font-size: 1.1rem;
  }

  .headercondition p,
  .upi-text {
    font-size: 0.95rem;
    padding: 0 8px;
  }

  .logo-row img {
    width: 70px;
    max-width: 35vw;
  }

  .union-logo-main {
    width: 160px;
  }

  .union-logo-sub {
    width: 120px;
  }

  .imgqrpayment {
    width: 65%;
  }
}
</style>
