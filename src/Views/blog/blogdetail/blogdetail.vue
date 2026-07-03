<template>
  <!-- ✅ FIX: force re-render when id changes -->
  <div class="detail-wrapper" :key="postId">
    <!-- NAVBAR -->
    <main_navbar
      title="ຂ່າວສານ ແລະ ກິດຈະກຳ"
      :breadcrumb="[
        'ໜ້າຫຼັກ',
        'ຂ່າວສານ ແລະ ກິດຈະກຳ',
        'ລາຍລະອຽດ ຂ່າວສານ ແລະ ກິດຈະກຳ'
      ]"
      background-image="/blog/bgnewsgrid.png"
    />

    <div class="boxmargin" style="width: 100%; height: 10vh"></div>

    <!-- MAIN CONTENT -->
    <section class="detail-page">
      <!-- Header -->
      <header class="detail-header">
        <div class="headline-left">
          <button class="back-btn" @click="goBack">
            <span class="back-icon">←</span>
            <span class="back-text">Back to news</span>
          </button>

          <div class="headline">
            <h1 style="font-weight: bold">
              ລາຍລະອຽດ ຂ່າວສານ ແລະ ກິດຈະກຳ
            </h1>
            <p>ອ່ານລາຍລະອຽດຂ່າວສານ ແລະ ກິດຈະກຳ.</p>
          </div>
        </div>

        <div class="badge-counter">
          <span class="count">{{ latestPosts.length }}</span>
          <span class="label">Latest News</span>
        </div>
      </header>

      <!-- (optional) loading / error -->
      <div v-if="isLoading" class="not-found">
        <p>Loading...</p>
      </div>

      <div v-else-if="error" class="not-found">
        <p>{{ error }}</p>
        <button class="back-btn" @click="fetchNews">
          <span class="back-icon">⟳</span>
          <span class="back-text">Retry</span>
        </button>
      </div>

      <div v-else-if="!activePost" class="not-found">
        <p>ບໍ່ພົບຂ່າວສານ ແລະ ກີດຈະກຳ</p>
        <button class="back-btn" @click="goBack">
          <span class="back-icon">←</span>
          <span class="back-text">Back to news</span>
        </button>
      </div>

      <!-- Layout: Left Detail / Right Sidebar -->
      <div v-else class="detail-layout">
        <!-- LEFT: Blog Detail -->
        <main class="detail-main" ref="detailMain">
          <template v-if="!activePost.isDocument">
          <!-- Category + Meta -->
          <div class="post-meta">
            <span class="chip">
              <i class="fa-solid fa-tags"></i>{{ activePost.category }}
            </span>
            <span class="meta-text">
              {{ activePost.date }} · {{ activePost.readTime }}
            </span>
          </div>

          <!-- Title -->
          <h2 class="post-title">
            {{ activePost.title }}
          </h2>

          <!-- Tags for this post -->
          <div class="post-tags" v-if="activePost.tags && activePost.tags.length">
            <span v-for="tag in activePost.tags" :key="tag" class="tag-pill">
              #{{ tag }}
            </span>
          </div>

          <!-- Hero Image -->
          <div class="hero-image" v-if="activePost.heroImage">
            <img :src="activePost.heroImage" :alt="activePost.title" />
          </div>

          <!-- Gallery (1–5+ images) -->
          <div
            class="image-grid"
            v-if="activePost.gallery && activePost.gallery.length"
            ref="imageGrid"
          >
            <figure
              v-for="(img, idx) in activePost.gallery"
              :key="idx"
              class="image-item"
              @click="openLightbox(idx)"
            >
              <img :src="img.src" :alt="img.alt || activePost.title" />
            </figure>
          </div>

          <!-- Content -->
          <article class="post-body">
            <p
              v-for="(paragraph, index) in activePost.content"
              :key="index"
              class="post-paragraph"
            >
              {{ paragraph }}
            </p>
          </article>
          </template>

          <article v-else class="document-reader" aria-label="Document preview">
            <a
              v-if="activePost.pdfUrl"
              class="soft-copy-btn"
              :href="activePost.pdfUrl"
              target="_blank"
              rel="noopener"
            >
              <i class="fa-solid fa-file-pdf"></i>
              Soft Copy
            </a>

            <section
              v-for="(pageHtml, index) in activePost.documentPages"
              :key="index"
              class="document-paper"
              v-html="pageHtml"
            ></section>
          </article>

        </main>

        <!-- RIGHT: Sidebar -->
        <aside class="detail-sidebar" ref="detailSidebar">
          <!-- Search + Tags -->
          <div class="sidebar-card filters-card">
            <h3 class="sidebar-title">Search & Tags</h3>

            <!-- Search -->
            <div class="sidebar-block">
              <span class="control-label">Search</span>
              <div class="search-input-wrap">
                <span class="search-icon">🔍</span>
                <input
                  v-model="searchQuery"
                  type="text"
                  placeholder="Search latest news..."
                  class="search-input"
                />
              </div>
            </div>

            <!-- Tag Checkboxes -->
            <div class="sidebar-block">
              <span class="control-label">Filter by tag</span>
              <div class="tags-checkboxes">
                <label v-for="tag in tagFilters" :key="tag.id" class="tag-checkbox">
                  <input type="checkbox" :value="tag.id" v-model="selectedTags" />
                  <span class="checkmark"></span>
                  <span class="label-text">{{ tag.label }}</span>
                </label>
              </div>
            </div>
          </div>

          <!-- Latest News -->
          <div class="sidebar-card latest-card">
            <h3 class="sidebar-title">Latest news</h3>
            <div class="latest-list" ref="latestList">
              <router-link
                v-for="post in filteredLatestPosts"
                :key="post.id"
                class="latest-link"
                :to="{
                  name: 'BlogDetail',
                  params: { id: post.id },
                  // ✅ FIX: keep query (page) so back works + less weird state
                  query: { ...$route.query }
                }"
              >
                <article class="latest-item">
                  <div class="latest-thumb">
                    <img :src="post.image" :alt="post.title" />
                  </div>
                  <div class="latest-content">
                    <p class="latest-date">{{ post.date }}</p>
                    <h4 class="latest-title">{{ post.title }}</h4>
                    <p class="latest-tag">{{ post.category }}</p>
                  </div>
                </article>
              </router-link>

              <p v-if="!filteredLatestPosts.length" class="latest-empty">
                ບໍ່ພົບຂ່າວສານທີ່ຄົ້ນຫາ!
              </p>
            </div>
          </div>
        </aside>
      </div>
    </section>

    <!-- ✅ Lightbox -->
    <div
      v-if="isLightboxOpen && currentLightboxImage"
      class="lightbox-overlay"
      ref="lightboxOverlay"
      @click.self="closeLightbox"
    >
      <button class="lightbox-close" @click="closeLightbox">✕</button>

      <button class="lb-nav lb-prev" :disabled="!canNavigate" @click.stop="prevImage">
        <span class="lb-nav-icon">‹</span>
      </button>

      <button class="lb-nav lb-next" :disabled="!canNavigate" @click.stop="nextImage">
        <span class="lb-nav-icon">›</span>
      </button>

      <div class="lb-counter" v-if="galleryCount">
        <span class="lb-counter-pill">{{ activeImageIndex + 1 }} / {{ galleryCount }}</span>
      </div>

      <div
        class="lightbox-inner"
        :class="{ 'vertical-scroll': isVerticalImage }"
        @pointerdown="onSwipeDown"
        @pointermove="onSwipeMove"
        @pointerup="onSwipeUp"
        @pointercancel="onSwipeCancel"
      >
        <img
          :src="currentLightboxImage.src"
          :alt="currentLightboxImage.alt || activePost.title"
          ref="lightboxImg"
        />
      </div>
    </div>

    <div class="boxmargin" style="width: 100%; height: 10vh"></div>
    <mainfooter />
  </div>
</template>

<script>
import { gsap } from "gsap";
import * as pdfjsLib from "pdfjs-dist/legacy/build/pdf.mjs";
import pdfWorkerUrl from "pdfjs-dist/legacy/build/pdf.worker.mjs?url";

import main_navbar from "../../../components/miannavbar/main_navbar.vue";
import mainfooter from "../../../components/footer/mainfooter/secondfooter.vue";

pdfjsLib.GlobalWorkerOptions.workerSrc = pdfWorkerUrl;

// -------------------- Env-only API base (Vite) --------------------
// Required in .env:
//   VITE_API_BASE_URL=http://localhost:3000
function resolveEnvBaseUrl() {
  // IMPORTANT: Use direct access so Vite injects import.meta.env correctly.
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
  if (p.startsWith("/")) return b + p;
  return b + "/" + p;
}

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

const API_BASE = normalizeBaseUrl(resolveEnvBaseUrl());
const ASSET_BASE = API_BASE.endsWith("/api") ? API_BASE.slice(0, -4) : API_BASE;
const NEWS_API = joinBaseAndPath(API_BASE, "/api/news");
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

export default {
  name: "BlogDetail",

  components: { main_navbar, mainfooter },

  props: {
    id: { type: [String, Number], default: null }
  },

  data() {
    return {
      isLoading: false,
      error: null,
      posts: [],
      singlePost: null,

      searchQuery: "",
      tagFilters: [
        { id: "Meeting", label: "Meeting" },
        { id: "Contract Signing", label: "Contract Signing" },
        { id: "Announcement", label: "Announcement" },
        { id: "Activity", label: "Activity" },
        { id: "Launch Event", label: "Launch Event" },
        { id: "Event", label: "Event" }
      ],
      selectedTags: [],

      isLightboxOpen: false,
      activeImageIndex: null,
      isVerticalImage: false,

      swipe: { active: false, pointerId: null, startX: 0, startY: 0, lastX: 0, lastY: 0 },
      swipeCooldown: false,

      aborter: null,
      pdfTab: "original",
      pdfRenderStatus: "idle",
      pdfRenderError: "",
      pdfRenderTaskId: 0,

      // Keep timeline to kill safely
      introTl: null
    };
  },

  computed: {
    postId() {
      const raw =
        this.id != null
          ? this.id
          : this.$route && this.$route.params
            ? this.$route.params.id
            : null;
      return raw == null ? "" : String(raw).trim();
    },

    activePost() {
      if (this.singlePost && String(this.singlePost.id).trim() === this.postId) return this.singlePost;
      if (!Array.isArray(this.posts) || !this.posts.length) return null;
      const pid = this.postId;
      if (!pid) return null;
      return this.posts.find((p) => String(p.id).trim() === pid) || null;
    },

    latestPosts() {
      const arr = Array.isArray(this.posts) ? [...this.posts] : [];
      arr.sort((a, b) => this.safeTime(b.dateTime) - this.safeTime(a.dateTime));
      return arr.slice(0, 5);
    },

    filteredLatestPosts() {
      const q = this.searchQuery.trim().toLowerCase();
      const hasTagFilter = this.selectedTags.length > 0;

      return this.latestPosts.filter((post) => {
        if (hasTagFilter) {
          const matchTag = (post.tags || []).some((t) => this.selectedTags.includes(t));
          if (!matchTag) return false;
        }
        if (!q) return true;

        const haystack = (post.title + " " + post.category + " " + (post.tags || []).join(" ")).toLowerCase();
        return haystack.includes(q);
      });
    },

    currentLightboxImage() {
      if (!this.activePost || !this.activePost.gallery) return null;
      return this.activePost.gallery[this.activeImageIndex] || null;
    },

    galleryCount() {
      return this.activePost?.gallery?.length || 0;
    },

    canNavigate() {
      return (this.activePost?.gallery?.length || 0) > 1;
    }
  },

  watch: {
    postId() {
      this.scrollToTop();
      this.closeLightbox();

      if (!this.posts.length) {
        this.fetchNews();
        return;
      }

      this.$nextTick(() => {
        if (this.activePost) this.animateIntroSafe();
      });
    },

    searchQuery() {
      this.$nextTick(() => this.animateLatestSafe());
    },
    selectedTags() {
      this.$nextTick(() => this.animateLatestSafe());
    },

    isLightboxOpen(val) {
      if (val) {
        window.addEventListener("keydown", this.onLightboxKeydown);
        try {
          document.documentElement.style.overflow = "hidden";
          document.body.style.overflow = "hidden";
        } catch {}
      } else {
        window.removeEventListener("keydown", this.onLightboxKeydown);
        try {
          document.documentElement.style.overflow = "";
          document.body.style.overflow = "";
        } catch {}
      }
    },

    "activePost.pdfEmbedUrl"() {
      this.$nextTick(() => this.renderPdfCanvas());
    },

    pdfTab(val) {
      if (val === "original") {
        this.$nextTick(() => this.renderPdfCanvas());
      }
    }
  },

  created() {
    this.fetchNews();
  },

  mounted() {
    this.scrollToTop();
  },

  beforeDestroy() {
    window.removeEventListener("keydown", this.onLightboxKeydown);
    try {
      document.documentElement.style.overflow = "";
      document.body.style.overflow = "";
    } catch {}

    try {
      if (this.aborter) this.aborter.abort();
    } catch {}

    try {
      if (this.introTl) this.introTl.kill();
    } catch {}
  },

  beforeRouteUpdate(to, from, next) {
    next();

    this.closeLightbox();
    this.scrollToTop();

    this.$nextTick(() => {
      if (this.activePost) this.animateIntroSafe();
    });
  },

  methods: {
    async fetchNews() {
      this.isLoading = true;
      this.error = null;
      this.singlePost = null;

      try {
        if (!API_BASE) {
          throw new Error("Missing VITE_API_BASE_URL in .env");
        }

        if (this.aborter) this.aborter.abort();
        this.aborter = new AbortController();

        const res = await fetch(NEWS_API, {
          method: "GET",
          signal: this.aborter.signal,
          headers: { Accept: "application/json" }
        });
        if (!res.ok) throw new Error(`API error: ${res.status}`);

        const json = await res.json();

        const list =
          Array.isArray(json) ? json :
          Array.isArray(json?.data) ? json.data :
          Array.isArray(json?.news) ? json.news :
          Array.isArray(json?.result) ? json.result :
          [];

        this.posts = list.map((item) => this.normalizeNewsItem(item)).filter(Boolean);

        if (!this.activePost && this.postId) {
          const detailRes = await fetch(joinBaseAndPath(API_BASE, `/api/news/${encodeURIComponent(this.postId)}`), {
            method: "GET",
            signal: this.aborter.signal,
            headers: { Accept: "application/json" }
          });

          if (detailRes.ok) {
            const detailJson = await detailRes.json();
            const rawDetail = detailJson?.data ?? detailJson?.news ?? detailJson?.result ?? detailJson;
            this.singlePost = this.normalizeNewsItem(rawDetail);
          }
        }

        this.$nextTick(() => {
          if (this.activePost) {
            this.animateIntroSafe();
            this.renderPdfCanvas();
          }
        });
      } catch (e) {
        if (e?.name === "AbortError") return;
        this.posts = [];
        const msg = e?.message || "Failed to load news from API.";
        this.error =
          msg.includes("Failed to fetch") || msg.includes("NetworkError")
            ? "Failed to fetch. กรุณาเช็ค VITE_API_BASE_URL ใน .env, restart dev server และตรวจสอบ CORS/Network"
            : msg;
      } finally {
        this.isLoading = false;
      }
    },

    normalizeNewsItem(item) {
      const id =
        item?.id ??
        item?.news_id ??
        item?.id_news ??
        item?.idnews ??
        item?._id ??
        null;

      if (id == null) return null;

      const category = String(item?.category ?? "").trim();
      const titleRaw = item?.header_news ?? item?.title ?? "";
      const title = String(titleRaw).trim() || "-";

      const rawTags = item?.tags ?? item?.tag ?? [];
      const tags = Array.isArray(rawTags)
        ? rawTags.map((t) => String(t).trim()).filter(Boolean)
        : typeof rawTags === "string"
          ? rawTags.split(",").map((s) => s.trim()).filter(Boolean)
          : [];

      const rawDesc = item?.description_news ?? item?.description ?? "";
      const content = this.toParagraphs(rawDesc);
      const isDocument = this.isDocumentContent(category, rawDesc);
      const documentPages = isDocument ? this.toDocumentPages(rawDesc) : [];

      const heroImage = this.resolveImage(item?.hero_img ?? item?.heroImage ?? "");
      const pdfUrl = this.resolveImage(
        item?.pdf_file_url ??
          item?.pdf_url ??
          item?.pdf_file ??
          item?.pdfFile ??
          ""
      );
      const pdfVersion =
        item?.updated_at ??
        item?.updatedAt ??
        item?.created_at ??
        item?.createdAt ??
        item?.idnews ??
        item?.id ??
        Date.now();
      const pdfText = String(item?.pdf_text ?? item?.pdfText ?? "").trim();
      const pdfExtractStatus = String(item?.pdf_extract_status ?? item?.pdfExtractStatus ?? "").trim();
      const pdfPageCount = Number(item?.pdf_page_count ?? item?.pdfPageCount ?? 0) || 0;

      const galleryRaw = this.parseMaybeJson(item?.gallery ?? item?.images ?? []);
      const gallery = Array.isArray(galleryRaw)
        ? galleryRaw
            .map((g) => {
              if (typeof g === "string") {
                const src = this.resolveImage(g);
                return src ? { src, alt: "" } : null;
              }
              if (g && typeof g === "object") {
                const src = this.resolveImage(g.src || g.url || g.path || g.image || "");
                if (!src) return null;
                return { src, alt: String(g.alt || "").trim() };
              }
              return null;
            })
            .filter(Boolean)
        : [];

      const dateTime =
        item?.datetime ??
        item?.date_time ??
        item?.created_at ??
        item?.createdAt ??
        item?.updated_at ??
        item?.updatedAt ??
        "";

      const d = new Date(dateTime);

      return {
        id,
        category,
        title,
        tags,
        content,
        isDocument,
        documentPages,
        heroImage,
        pdfUrl,
        pdfEmbedUrl: this.buildPdfEmbedUrl(pdfUrl, pdfVersion),
        pdfText,
        pdfExtractStatus,
        pdfExtractStatusLabel: this.formatPdfStatus(pdfExtractStatus),
        pdfPageCount,
        gallery,
        image: heroImage,
        dateTime,
        date: this.formatDate(d),
        readTime: this.timeAgo(d)
      };
    },

    formatPdfStatus(status) {
      const s = String(status || "").trim();
      const labels = {
        TEXT_EXTRACTED: "Text extracted",
        NEEDS_OCR: "Needs OCR",
        EXTRACT_FAILED: "Extract failed",
        NO_PDF: "No PDF"
      };
      return labels[s] || (s ? s.replace(/_/g, " ").toLowerCase() : "Not processed");
    },

    buildPdfEmbedUrl(url, version) {
      const raw = String(url || "").trim();
      if (!raw) return "";
      const sep = raw.includes("?") ? "&" : "?";
      const v = encodeURIComponent(String(version || Date.now()));
      return `${raw}${sep}embed=1&v=${v}#toolbar=1&navpanes=0&view=FitH`;
    },

    async renderPdfCanvas() {
      if (!this.activePost?.pdfEmbedUrl || this.pdfTab !== "original") return;

      const host = this.$refs.pdfCanvasHost;
      if (!host) return;

      const taskId = this.pdfRenderTaskId + 1;
      this.pdfRenderTaskId = taskId;
      this.pdfRenderStatus = "loading";
      this.pdfRenderError = "";
      host.innerHTML = "";

      try {
        const sourceUrl = String(this.activePost.pdfEmbedUrl).split("#")[0];
        const loadingTask = pdfjsLib.getDocument({
          url: sourceUrl,
          withCredentials: false,
          disableAutoFetch: false,
          disableStream: false,
        });
        const pdf = await loadingTask.promise;

        if (taskId !== this.pdfRenderTaskId) return;

        const hostWidth = Math.max(320, host.clientWidth || 760);
        const pageTotal = Math.min(pdf.numPages || 0, 20);

        for (let pageNo = 1; pageNo <= pageTotal; pageNo += 1) {
          if (taskId !== this.pdfRenderTaskId) return;

          const page = await pdf.getPage(pageNo);
          const baseViewport = page.getViewport({ scale: 1 });
          const scale = Math.min(2, Math.max(0.7, (hostWidth - 24) / baseViewport.width));
          const viewport = page.getViewport({ scale });

          const pageWrap = document.createElement("div");
          pageWrap.className = "pdf-canvas-page";

          const canvas = document.createElement("canvas");
          const context = canvas.getContext("2d");
          const ratio = window.devicePixelRatio || 1;
          canvas.width = Math.floor(viewport.width * ratio);
          canvas.height = Math.floor(viewport.height * ratio);
          canvas.style.width = `${Math.floor(viewport.width)}px`;
          canvas.style.height = `${Math.floor(viewport.height)}px`;

          pageWrap.appendChild(canvas);
          host.appendChild(pageWrap);

          await page.render({
            canvasContext: context,
            viewport,
            transform: ratio !== 1 ? [ratio, 0, 0, ratio, 0, 0] : null,
          }).promise;
        }

        this.pdfRenderStatus = "ready";
      } catch (error) {
        if (taskId !== this.pdfRenderTaskId) return;
        this.pdfRenderStatus = "error";
        this.pdfRenderError = error?.message || "Unable to render PDF.";
      }
    },

    parseMaybeJson(v) {
      if (typeof v !== "string") return v;
      const s = v.trim();
      if (!s) return [];
      try {
        return JSON.parse(s);
      } catch {
        if (s.includes(",")) return s.split(",").map((x) => x.trim()).filter(Boolean);
        return [s];
      }
    },

    toParagraphs(desc) {
      if (Array.isArray(desc)) return desc.map((x) => String(x).trim()).filter(Boolean);

      const s = String(desc || "").trim();
      if (!s) return [];

      const noHtml = s.replace(/<\/?[^>]+(>|$)/g, " ");
      return noHtml.split(/\n+/).map((x) => x.trim()).filter(Boolean);
    },

    isDocumentContent(category, desc) {
      const cat = String(category || "").trim().toLowerCase();
      const html = String(desc || "");
      return (
        cat === "document" ||
        html.includes('class="page-break"') ||
        /<(h[1-6]|p|ul|ol|li|strong|span)\b/i.test(html)
      );
    },

    toDocumentPages(desc) {
      const html = this.sanitizeDocumentHtml(desc);
      const pages = html
        .split(/<div\s+class=["']page-break["']\s*><\/div>/i)
        .map((page) => page.trim())
        .filter(Boolean);
      return pages.length ? pages : [html];
    },

    sanitizeDocumentHtml(desc) {
      const wrapper = document.createElement("div");
      wrapper.innerHTML = String(desc || "");

      const allowedTags = new Set(["H1", "H2", "H3", "H4", "P", "BR", "STRONG", "B", "EM", "I", "U", "UL", "OL", "LI", "SPAN", "DIV"]);
      const allowedStyles = new Set(["text-align", "text-indent", "font-size", "font-weight", "font-style", "text-decoration"]);

      wrapper.querySelectorAll("*").forEach((node) => {
        if (!allowedTags.has(node.tagName)) {
          node.replaceWith(document.createTextNode(node.textContent || ""));
          return;
        }

        [...node.attributes].forEach((attr) => {
          const name = attr.name.toLowerCase();
          if (name === "class" && attr.value === "page-break") return;
          if (name !== "style") {
            node.removeAttribute(attr.name);
            return;
          }

          const safeStyles = attr.value
            .split(";")
            .map((rule) => rule.trim())
            .filter(Boolean)
            .map((rule) => {
              const [prop, ...valueParts] = rule.split(":");
              const key = String(prop || "").trim().toLowerCase();
              const value = valueParts.join(":").trim();
              if (!allowedStyles.has(key)) return "";
              if (/url|expression|javascript/i.test(value)) return "";
              return `${key}: ${value}`;
            })
            .filter(Boolean);

          if (safeStyles.length) node.setAttribute("style", safeStyles.join("; "));
          else node.removeAttribute("style");
        });
      });

      return wrapper.innerHTML.trim();
    },

    resolveImage(url) {
      if (!url) return "";
      const s = String(url).trim();
      if (!s) return "";

      // Absolute URL
      if (/^https?:\/\//i.test(s)) return rewriteBadAbsoluteToEnvBase(s);

      // Absolute path from server => use ASSET_BASE (no /api)
      if (s.startsWith("/")) return joinBaseAndPath(ASSET_BASE, s);

      // Relative path => use ASSET_BASE
      return joinBaseAndPath(ASSET_BASE, "/" + s);
    },

    safeTime(dt) {
      const t = new Date(dt || 0).getTime();
      return Number.isFinite(t) ? t : 0;
    },

    formatDate(d) {
      if (!(d instanceof Date) || Number.isNaN(d.getTime())) return "";
      return d.toLocaleDateString("en-GB", { day: "2-digit", month: "long", year: "numeric" });
    },

    timeAgo(d) {
      if (!(d instanceof Date) || Number.isNaN(d.getTime())) return "";

      let diffMs = Date.now() - d.getTime();
      if (diffMs < 0) diffMs = 0;

      const minute = 60 * 1000;
      const hour = 60 * minute;
      const day = 24 * hour;
      const month = 30 * day;
      const year = 365 * day;

      const n = (x) => Math.max(1, Math.floor(x));

      if (diffMs >= year) return `ໂພສເມື່ອ ${n(diffMs / year)} ປີກ່ອນ`;
      if (diffMs >= month) return `ໂພສເມື່ອ ${n(diffMs / month)} ເດືອນກ່ອນ`;
      if (diffMs >= day) return `ໂພສເມື່ອ ${n(diffMs / day)} ມື້ກ່ອນ`;
      if (diffMs >= hour) return `ໂພສເມື່ອ ${n(diffMs / hour)} ຊົ່ວໂມງກ່ອນ`;
      if (diffMs >= minute) return `ໂພສເມື່ອ ${n(diffMs / minute)} ນາທີກ່ອນ`;
      return "ໂພສເມື່ອ ບໍ່ດົນມານີ້";
    },

    scrollToTop() {
      window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
    },

    goBack() {
      const page = this.$route && this.$route.query ? this.$route.query.page : null;

      if (this.$router && page) {
        this.$router.push({ name: "BlogGrid", query: { page } });
        return;
      }

      if (window.history.length > 1 && this.$router) this.$router.back();
      else if (this.$router) this.$router.push({ name: "BlogGrid" });
    },

    animateIntroSafe() {
      try {
        this.animateIntro();
      } catch {}
    },
    animateLatestSafe() {
      try {
        this.animateLatest();
      } catch {}
    },

    animateIntro() {
      if (!this.$refs.detailMain || !this.$refs.detailSidebar) return;

      if (this.introTl) this.introTl.kill();
      gsap.killTweensOf(".detail-header");

      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
      this.introTl = tl;

      tl.from(".detail-header", { opacity: 0, y: -24, duration: 0.6 })
        .from(this.$refs.detailMain, { opacity: 0, x: -24, duration: 0.55 }, "-=0.25")
        .from(this.$refs.detailSidebar, { opacity: 0, x: 24, duration: 0.55 }, "-=0.4")
        .add(() => {
          this.animateGallery();
          this.animateLatest();
        }, "-=0.2");
    },

    animateGallery() {
      const grid = this.$refs.imageGrid;
      if (!grid || !this.activePost?.gallery?.length) return;

      const items = grid.querySelectorAll(".image-item");
      if (!items.length) return;

      gsap.fromTo(
        items,
        { opacity: 0, y: 18, scale: 0.96 },
        { opacity: 1, y: 0, scale: 1, duration: 0.6, ease: "power3.out", stagger: 0.08 }
      );
    },

    animateLatest() {
      const list = this.$refs.latestList;
      if (!list) return;

      const items = list.querySelectorAll(".latest-item");
      if (!items.length) return;

      gsap.fromTo(
        items,
        { opacity: 0, y: 14 },
        { opacity: 1, y: 0, duration: 0.45, ease: "power2.out", stagger: 0.05 }
      );
    },

    onLightboxKeydown(e) {
      if (!this.isLightboxOpen) return;
      if (e.key === "Escape") return this.closeLightbox();
      if (e.key === "ArrowRight") return this.nextImage();
      if (e.key === "ArrowLeft") return this.prevImage();
    },

    detectVertical(imgEl) {
      const naturalW = imgEl?.naturalWidth || 1;
      const naturalH = imgEl?.naturalHeight || 1;
      const imgRatio = naturalH / naturalW;
      const viewportRatio = window.innerHeight / window.innerWidth;
      this.isVerticalImage = imgRatio > viewportRatio;
    },

    onSwipeDown(e) {
      if (!this.isLightboxOpen || !this.canNavigate) return;
      if (e.pointerType === "mouse" && e.button !== 0) return;

      this.swipe.active = true;
      this.swipe.pointerId = e.pointerId;
      this.swipe.startX = e.clientX;
      this.swipe.startY = e.clientY;
      this.swipe.lastX = e.clientX;
      this.swipe.lastY = e.clientY;

      try {
        e.currentTarget?.setPointerCapture?.(e.pointerId);
      } catch {}
    },

    onSwipeMove(e) {
      if (!this.swipe.active) return;
      if (this.swipe.pointerId != null && e.pointerId !== this.swipe.pointerId) return;
      this.swipe.lastX = e.clientX;
      this.swipe.lastY = e.clientY;
    },

    onSwipeUp(e) {
      if (!this.swipe.active) return;
      if (this.swipe.pointerId != null && e.pointerId !== this.swipe.pointerId) return;

      const dx = this.swipe.lastX - this.swipe.startX;
      const dy = this.swipe.lastY - this.swipe.startY;

      this.onSwipeCancel();
      if (this.isVerticalImage) return;

      const absX = Math.abs(dx);
      const absY = Math.abs(dy);

      const MIN_SWIPE = 45;
      const DOMINANCE = 1.2;

      if (absX < MIN_SWIPE) return;
      if (absX < absY * DOMINANCE) return;

      if (this.swipeCooldown) return;
      this.swipeCooldown = true;
      setTimeout(() => (this.swipeCooldown = false), 260);

      if (dx < 0) this.nextImage();
      else this.prevImage();
    },

    onSwipeCancel() {
      this.swipe.active = false;
      this.swipe.pointerId = null;
    },

    openLightbox(index) {
      if (!this.activePost?.gallery || !this.activePost.gallery[index]) return;

      this.activeImageIndex = index;
      this.isLightboxOpen = true;
      this.isVerticalImage = false;
      this.onSwipeCancel();
      this.swipeCooldown = false;

      this.$nextTick(() => {
        const overlay = this.$refs.lightboxOverlay;
        const img = this.$refs.lightboxImg;
        if (!overlay || !img) return;

        const runAnimation = () => {
          this.detectVertical(img);

          gsap.set(overlay, { autoAlpha: 0 });
          gsap.set(img, { autoAlpha: 0, scale: 0.96, y: 20, x: 0 });

          const tl = gsap.timeline();
          tl.to(overlay, { autoAlpha: 1, duration: 0.2, ease: "power2.out" }).to(
            img,
            { autoAlpha: 1, scale: 1, y: 0, duration: 0.35, ease: "power3.out" },
            "-=0.05"
          );

          gsap.fromTo(
            ".lb-nav",
            { autoAlpha: 0, y: 6, scale: 0.98 },
            { autoAlpha: 1, y: 0, scale: 1, duration: 0.35, ease: "power3.out", stagger: 0.06, delay: 0.05 }
          );
          gsap.fromTo(
            ".lb-counter-pill",
            { autoAlpha: 0, y: 8 },
            { autoAlpha: 1, y: 0, duration: 0.35, ease: "power3.out", delay: 0.08 }
          );
        };

        if (img.complete) runAnimation();
        else img.addEventListener("load", runAnimation, { once: true });
      });
    },

    swapLightboxImage(newIndex, dir) {
      if (!this.activePost?.gallery?.length) return;

      const img = this.$refs.lightboxImg;
      if (!img) {
        this.activeImageIndex = newIndex;
        return;
      }

      const outX = -22 * dir;
      const inX = 22 * dir;

      const tl = gsap.timeline();

      tl.to(img, { autoAlpha: 0, x: outX, scale: 0.985, duration: 0.16, ease: "power2.inOut" }).add(() => {
        this.activeImageIndex = newIndex;
        this.isVerticalImage = false;
      });

      tl.add(() => {
        this.$nextTick(() => {
          const img2 = this.$refs.lightboxImg;
          if (!img2) return;

          const runIn = () => {
            this.detectVertical(img2);
            gsap.set(img2, { autoAlpha: 0, x: inX, scale: 0.985 });
            gsap.to(img2, { autoAlpha: 1, x: 0, scale: 1, duration: 0.24, ease: "power3.out" });
            gsap.fromTo(".lb-counter-pill", { scale: 0.98 }, { scale: 1, duration: 0.2, ease: "power2.out" });
          };

          if (img2.complete) runIn();
          else img2.addEventListener("load", runIn, { once: true });
        });
      });
    },

    nextImage() {
      if (!this.activePost?.gallery?.length || !this.canNavigate) return;
      const len = this.activePost.gallery.length;
      const next = (this.activeImageIndex + 1) % len;
      this.swapLightboxImage(next, 1);
    },

    prevImage() {
      if (!this.activePost?.gallery?.length || !this.canNavigate) return;
      const len = this.activePost.gallery.length;
      const prev = (this.activeImageIndex - 1 + len) % len;
      this.swapLightboxImage(prev, -1);
    },

    closeLightbox() {
      const overlay = this.$refs.lightboxOverlay;
      const img = this.$refs.lightboxImg;

      if (!overlay || !img) {
        this.isLightboxOpen = false;
        this.activeImageIndex = null;
        this.isVerticalImage = false;
        this.onSwipeCancel();
        this.swipeCooldown = false;
        return;
      }

      const tl = gsap.timeline({
        onComplete: () => {
          this.isLightboxOpen = false;
          this.activeImageIndex = null;
          this.isVerticalImage = false;
          this.onSwipeCancel();
          this.swipeCooldown = false;
        }
      });

      tl.to(img, { autoAlpha: 0, scale: 0.96, y: 10, x: 0, duration: 0.2, ease: "power2.inOut" }).to(
        overlay,
        { autoAlpha: 0, duration: 0.25, ease: "power2.inOut" },
        "-=0.1"
      );
    }
  }
};
</script>

<style scoped>
/* your original styles, plus lightbox */
.boxmargin {
  background: linear-gradient(180deg, #f5f7ff 0%, #ffffff 40%, #f7f9ff 100%);
}
.detail-wrapper {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.detail-page {
  flex: 1;
  padding: 60px 5vw 40px;
  background: linear-gradient(180deg, #f5f7ff 0%, #ffffff 40%, #f7f9ff 100%);
  color: #0b1020;
  display: flex;
  flex-direction: column;
  gap: 24px;
  font-family: system-ui, -apple-system, BlinkMacSystemFont, "SF Pro Text",
    "Segoe UI", sans-serif;
}

.detail-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 24px;
}

.headline-left {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

/* Modern back button */
.back-btn {
  align-self: flex-start;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 6px 14px 7px;
  border-radius: 999px;
  border: 1px solid rgba(191, 211, 255, 0.9);
  background: linear-gradient(
    95deg,
    rgba(0, 3, 41, 1) 0%,
    rgba(0, 51, 171, 1) 46%
  );
  color: #e5edff;
  font-size: 0.85rem;
  font-weight: 500;
  cursor: pointer;
  box-shadow:
    0 10px 22px rgba(15, 23, 42, 0.35),
    0 0 0 1px rgba(255, 255, 255, 0.4);
  backdrop-filter: blur(10px);
  transition:
    transform 0.18s ease,
    box-shadow 0.18s ease,
    background 0.18s ease,
    border-color 0.18s ease;
}

.back-icon {
  font-size: 1rem;
  transform: translateX(0);
  transition: transform 0.2s ease;
}

.back-btn:hover {
  transform: translateY(-1px);
  border-color: #bfdbfe;
  box-shadow:
    0 16px 30px rgba(15, 23, 42, 0.45),
    0 0 0 1px rgba(219, 234, 254, 0.9);
}

.back-btn:hover .back-icon {
  transform: translateX(-2px);
}

.headline h1 {
  font-size: 2.2rem;
  letter-spacing: 0.03em;
  margin-bottom: 6px;
  color: #020617;
}

.headline p {
  opacity: 0.8;
  font-size: 0.98rem;
  color: #4b5563;
}

.badge-counter {
  display: inline-flex;
  flex-direction: column;
  align-items: flex-end;
  padding: 10px 16px;
  border-radius: 999px;
  background: linear-gradient(
    95deg,
    rgba(0, 3, 41, 1) 0%,
    rgba(0, 51, 171, 1) 46%
  );
  border: 1px solid rgba(191, 211, 255, 0.9);
  box-shadow:
    0 12px 26px rgba(15, 23, 42, 0.28),
    0 0 0 1px rgba(255, 255, 255, 0.4);
  color: #f9fbff;
}

.badge-counter .count {
  font-size: 1.3rem;
  font-weight: 600;
  line-height: 1;
}

.badge-counter .label {
  font-size: 0.78rem;
  text-transform: uppercase;
  letter-spacing: 0.18em;
  opacity: 0.9;
}

/* Not found */
.not-found {
  margin-top: 32px;
  max-width: 480px;
  padding: 20px;
  border-radius: 18px;
  background: #f9fafb;
  border: 1px dashed rgba(148, 163, 184, 0.8);
  color: #4b5563;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

/* Layout */
.detail-layout {
  display: grid;
  grid-template-columns: minmax(0, 2.2fr) minmax(280px, 1fr);
  gap: 28px;
  align-items: flex-start;
}

/* LEFT */
.detail-main {
  background: #ffffff;
  border-radius: 24px;
  padding: 22px 24px 26px;
  border: 1px solid rgba(148, 163, 184, 0.3);
  box-shadow:
    0 16px 32px rgba(15, 23, 42, 0.08),
    0 0 0 1px rgba(255, 255, 255, 0.9);
}

.post-meta {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 10px;
}

.chip i {
  margin-right: 3px;
  font-size: 19px;
  color: #0e00aa;
}
.chip {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 4px 10px;
  border-radius: 10px;
  font-size: 0.75rem;
  letter-spacing: 0.08em;
  border: 1px solid rgba(0, 0, 0, 0.239);
  text-transform: uppercase;
  color: #000;
  font-weight: 600;
}

.meta-text {
  font-size: 0.82rem;
  color: #6b7280;
}

.post-title {
  font-size: 1.6rem;
  line-height: 1.4;
  margin-bottom: 8px;
  color: #020617;
}

.post-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: 18px;
}

.tag-pill {
  font-size: 0.78rem;
  padding: 4px 9px;
  border-radius: 999px;
  background: #eff6ff;
  color: #1d4ed8;
  border: 1px solid rgba(129, 140, 248, 0.5);
}

.hero-image {
  margin-bottom: 18px;
  border-radius: 18px;
  overflow: hidden;
  border: 1px solid rgba(209, 213, 219, 0.8);
  box-shadow: 0 16px 26px rgba(15, 23, 42, 0.15);
}

.hero-image img {
  width: 100%;
  display: block;
  object-fit: cover;
}

.image-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 14px;
  margin-bottom: 20px;
}

.image-item {
  position: relative;
  overflow: hidden;
  border-radius: 16px;
  border: 1px solid rgba(209, 213, 219, 0.8);
  cursor: pointer;
}

.image-item img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
  transform: scale(1.03);
  transition: transform 0.3s ease, filter 0.3s ease;
}

.image-item:hover img {
  transform: scale(1.08);
  filter: saturate(1.1);
}

.post-body {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.post-paragraph {
  font-size: 0.95rem;
  line-height: 1.7;
  color: #374151;
}

.document-reader {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 24px;
  margin: 6px auto 10px;
  padding: 20px 0;
  background: #eef2f7;
  border-radius: 18px;
}

.soft-copy-btn {
  align-self: flex-start;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  margin: 0 0 0 24px;
  padding: 9px 12px;
  border-radius: 8px;
  background: #ffffff;
  border: 1px solid #fecaca;
  color: #991b1b;
  font-size: 0.9rem;
  font-weight: 800;
  text-decoration: none;
  box-shadow: 0 8px 20px rgba(127, 29, 29, 0.12);
  transition:
    transform 0.18s ease,
    border-color 0.18s ease,
    box-shadow 0.18s ease;
}

.soft-copy-btn:hover {
  transform: translateY(-1px);
  border-color: #fca5a5;
  box-shadow: 0 12px 26px rgba(127, 29, 29, 0.18);
}

.document-paper {
  box-sizing: border-box;
  width: min(794px, 100%);
  min-height: 1123px;
  padding: 72px 64px;
  border: 1px solid #d9dee7;
  background: #fbfcfe;
  box-shadow: 0 18px 45px rgba(30, 41, 59, 0.13);
  color: #25282d;
  font-family: Arial, "Noto Sans Lao", "Noto Sans Thai", sans-serif;
  font-size: 18px;
  line-height: 1.55;
  letter-spacing: 0;
}

.document-paper :deep(h1),
.document-paper :deep(h2),
.document-paper :deep(h3),
.document-paper :deep(h4) {
  margin: 0 0 42px;
  font-size: 18px;
  line-height: 1.45;
  font-weight: 700;
}

.document-paper :deep(p) {
  margin: 0 0 12px;
}

.document-paper :deep(ul),
.document-paper :deep(ol) {
  margin: 0 0 22px 24px;
  padding-left: 20px;
}

.document-paper :deep(li) {
  margin: 0 0 5px;
}

.pdf-viewer-section {
  margin-top: 22px;
  padding: 14px;
  border-radius: 18px;
  border: 1px solid rgba(239, 68, 68, 0.18);
  background: linear-gradient(135deg, rgba(254, 242, 242, 0.95), rgba(255, 247, 237, 0.9));
  box-shadow: 0 16px 30px rgba(15, 23, 42, 0.08);
}

.pdf-viewer-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 14px;
  margin-bottom: 12px;
}

.pdf-copy {
  display: flex;
  align-items: center;
  gap: 12px;
  min-width: 0;
}

.pdf-icon {
  width: 42px;
  height: 42px;
  border-radius: 14px;
  display: grid;
  place-items: center;
  color: #b91c1c;
  background: rgba(239, 68, 68, 0.1);
  border: 1px solid rgba(239, 68, 68, 0.18);
  flex: 0 0 auto;
}

.pdf-title {
  font-weight: 700;
  color: #111827;
}

.pdf-sub {
  margin-top: 2px;
  font-size: 0.82rem;
  color: #6b7280;
}

.pdf-actions {
  display: inline-flex;
  align-items: center;
  gap: 10px;
}

.pdf-link {
  flex: 0 0 auto;
  text-decoration: none;
  border-radius: 999px;
  padding: 10px 14px;
  font-weight: 700;
  font-size: 0.86rem;
  color: #ffffff;
  background: #b91c1c;
  box-shadow: 0 10px 22px rgba(185, 28, 28, 0.22);
}

.pdf-link.ghost {
  color: #b91c1c;
  background: rgba(255, 255, 255, 0.75);
  border: 1px solid rgba(239, 68, 68, 0.2);
  box-shadow: none;
}

.pdf-frame-wrap {
  height: min(78vh, 820px);
  min-height: 560px;
  border-radius: 14px;
  overflow: hidden;
  border: 1px solid rgba(148, 163, 184, 0.35);
  background: #111827;
}

.pdf-canvas-wrap {
  height: auto;
  max-height: none;
  min-height: 240px;
  padding: 14px;
  background: #475569;
  overflow: auto;
}

.pdf-canvas-host {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 14px;
}

.pdf-canvas-page {
  max-width: 100%;
  padding: 8px;
  border-radius: 8px;
  background: #ffffff;
  box-shadow: 0 14px 28px rgba(15, 23, 42, 0.28);
}

.pdf-canvas-page canvas {
  max-width: 100%;
  height: auto !important;
  display: block;
}

.pdf-render-state {
  padding: 24px 12px;
  text-align: center;
  color: #ffffff;
  font-weight: 700;
}

.pdf-render-state.error {
  color: #fecaca;
}

.pdf-tabs {
  display: inline-flex;
  gap: 6px;
  padding: 5px;
  margin-bottom: 12px;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.7);
  border: 1px solid rgba(239, 68, 68, 0.12);
}

.pdf-tab {
  border: 0;
  border-radius: 999px;
  padding: 9px 13px;
  background: transparent;
  color: #6b7280;
  font-weight: 700;
  cursor: pointer;
}

.pdf-tab.active {
  color: #ffffff;
  background: #b91c1c;
  box-shadow: 0 8px 18px rgba(185, 28, 28, 0.18);
}

.pdf-frame {
  width: 100%;
  height: 100%;
  display: block;
  border: 0;
  background: #ffffff;
}

.pdf-text-panel {
  border-radius: 14px;
  border: 1px solid rgba(148, 163, 184, 0.35);
  background: rgba(255, 255, 255, 0.82);
  overflow: hidden;
}

.pdf-text-meta {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 12px 14px;
  border-bottom: 1px solid rgba(148, 163, 184, 0.25);
  color: #6b7280;
  font-size: 0.86rem;
}

.pdf-status {
  border-radius: 999px;
  padding: 6px 10px;
  background: rgba(107, 114, 128, 0.1);
  color: #374151;
  font-weight: 800;
}

.pdf-status.TEXT_EXTRACTED {
  background: rgba(16, 185, 129, 0.12);
  color: #047857;
}

.pdf-status.NEEDS_OCR {
  background: rgba(245, 158, 11, 0.14);
  color: #92400e;
}

.pdf-status.EXTRACT_FAILED {
  background: rgba(239, 68, 68, 0.12);
  color: #b91c1c;
}

.pdf-text {
  max-height: 520px;
  margin: 0;
  padding: 16px;
  overflow: auto;
  white-space: pre-wrap;
  word-break: break-word;
  font-family: inherit;
  font-size: 0.94rem;
  line-height: 1.75;
  color: #1f2937;
}

.pdf-empty-text {
  padding: 24px 16px;
  color: #6b7280;
  line-height: 1.6;
}

/* RIGHT */
.detail-sidebar {
  display: flex;
  flex-direction: column;
  gap: 18px;
}

.sidebar-card {
  background: rgba(255, 255, 255, 0.9);
  border-radius: 20px;
  padding: 16px 16px 18px;
  border: 1px solid rgba(148, 163, 184, 0.3);
  box-shadow:
    0 14px 30px rgba(15, 23, 42, 0.12),
    0 0 0 1px rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(10px);
}

.sidebar-title {
  font-size: 0.95rem;
  font-weight: 600;
  margin-bottom: 10px;
  color: #020617;
}

.control-label {
  font-size: 0.78rem;
  text-transform: uppercase;
  letter-spacing: 0.14em;
  color: #6b7280;
}

.sidebar-block {
  display: flex;
  flex-direction: column;
  gap: 6px;
  margin-top: 8px;
}

.search-input-wrap {
  position: relative;
  display: flex;
  align-items: center;
  background: #f9fafb;
  border-radius: 999px;
  padding: 2px 14px 2px 12px;
  border: 1px solid rgba(148, 163, 184, 0.7);
  box-shadow: 0 8px 18px rgba(148, 163, 184, 0.2);
}

.search-icon {
  font-size: 0.92rem;
  margin-right: 6px;
  opacity: 0.8;
}

.search-input {
  border: none;
  outline: none;
  background: transparent;
  padding: 7px 4px 7px 0;
  font-size: 0.9rem;
  width: 100%;
  color: #020617;
}

.search-input::placeholder {
  color: #9ca3af;
}

.tags-checkboxes {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.tag-checkbox {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 0.86rem;
  cursor: pointer;
  color: #374151;
}

.tag-checkbox input {
  display: none;
}

.checkmark {
  width: 16px;
  height: 16px;
  border-radius: 4px;
  border: 1px solid rgba(148, 163, 184, 0.9);
  background: #f9fafb;
  position: relative;
  flex-shrink: 0;
}

.tag-checkbox input:checked + .checkmark {
  background: linear-gradient(
    95deg,
    rgba(0, 3, 41, 1) 0%,
    rgba(0, 51, 171, 1) 46%
  );
  border-color: transparent;
}

.tag-checkbox input:checked + .checkmark::after {
  content: "✓";
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -55%);
  font-size: 0.7rem;
  color: #eff6ff;
}

.label-text {
  font-size: 0.86rem;
}

.latest-list {
  margin-top: 6px;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

/* router-link wrapper for latest items */
.latest-link {
  text-decoration: none;
  color: inherit;
  display: block;
}

.latest-item {
  display: grid;
  grid-template-columns: 80px minmax(0, 1fr);
  gap: 10px;
  padding: 8px;
  border-radius: 14px;
  cursor: pointer;
  transition: background 0.2s ease, box-shadow 0.2s ease, transform 0.18s ease;
}

.latest-item:hover {
  background: #eff6ff;
  box-shadow: 0 10px 20px rgba(15, 23, 42, 0.12);
  transform: translateY(-2px);
}

.latest-thumb {
  border-radius: 10px;
  overflow: hidden;
  border: 1px solid rgba(209, 213, 219, 0.9);
}

.latest-thumb img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

.latest-content {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.latest-date {
  font-size: 0.75rem;
  color: #6b7280;
}

.latest-title {
  font-size: 0.9rem;
  color: #020617;
}

.latest-tag {
  font-size: 0.78rem;
  color: #1d4ed8;
}

.latest-empty {
  font-size: 0.86rem;
  color: #6b7280;
  padding: 8px;
}

/* ✅ Lightbox */
.lightbox-overlay {
  position: fixed;
  inset: 0;
  z-index: 999;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 24px;
  background: radial-gradient(
    circle at top,
    rgba(15, 23, 42, 0.95) 0%,
    rgba(15, 23, 42, 0.98) 45%,
    rgba(15, 23, 42, 1) 100%
  );
  backdrop-filter: blur(8px);
}

.lightbox-inner {
  max-width: 1100px;
  width: 100%;
  max-height: 90vh;
  border-radius: 22px;
  overflow: hidden;
  background: #020617;
  box-shadow:
    0 30px 80px rgba(15, 23, 42, 0.9),
    0 0 0 1px rgba(148, 163, 184, 0.4);
  display: flex;
  align-items: center;
  justify-content: center;

  /* ✅ swipe */
  touch-action: none;
  overscroll-behavior: contain;
}

.lightbox-inner img {
  width: 100%;
  height: 100%;
  object-fit: contain;
  background: radial-gradient(circle at center, #0f172a, #020617);
}

/* When the image is very vertical, allow scrolling inside lightbox */
.lightbox-inner.vertical-scroll {
  align-items: flex-start;
  justify-content: flex-start;
  overflow-y: auto;
  overflow-x: hidden;
  padding: 16px;

  /* ✅ allow vertical scroll */
  touch-action: pan-y;
}

.lightbox-inner.vertical-scroll img {
  width: auto;
  max-width: 100%;
  height: auto;
}

.lightbox-close {
  position: fixed;
  top: 24px;
  right: 26px;
  z-index: 1000;
  border: none;
  border-radius: 999px;
  padding: 8px 14px;
  font-size: 1rem;
  cursor: pointer;
  background: rgba(15, 23, 42, 0.9);
  color: #e5edff;
  box-shadow:
    0 10px 24px rgba(15, 23, 42, 0.8),
    0 0 0 1px rgba(148, 163, 184, 0.6);
  backdrop-filter: blur(6px);
  transition: transform 0.18s ease, box-shadow 0.18s ease, background 0.18s ease;
}

.lightbox-close:hover {
  transform: translateY(-1px);
  background: rgba(30, 64, 175, 0.98);
  box-shadow:
    0 18px 40px rgba(15, 23, 42, 0.95),
    0 0 0 1px rgba(219, 234, 254, 0.9);
}

/* ✅ Modern Prev/Next buttons */
.lb-nav {
  position: fixed;
  top: 50%;
  transform: translateY(-50%);
  z-index: 1000;

  width: 46px;
  height: 46px;
  border-radius: 999px;
  border: 1px solid rgba(191, 211, 255, 0.7);
  background: linear-gradient(
    95deg,
    rgba(0, 3, 41, 0.92) 0%,
    rgba(0, 51, 171, 0.92) 46%
  );
  color: #eaf2ff;
  cursor: pointer;
  box-shadow:
    0 16px 34px rgba(15, 23, 42, 0.65),
    0 0 0 1px rgba(255, 255, 255, 0.25);
  backdrop-filter: blur(8px);
  transition: transform 0.18s ease, box-shadow 0.18s ease, filter 0.18s ease;
  display: grid;
  place-items: center;
}

.lb-prev { left: 26px; }
.lb-next { right: 26px; }

.lb-nav-icon {
  font-size: 1.55rem;
  line-height: 1;
  transform: translateY(-1px);
}

.lb-nav:hover {
  transform: translateY(-50%) scale(1.05);
  box-shadow:
    0 22px 44px rgba(15, 23, 42, 0.8),
    0 0 0 1px rgba(219, 234, 254, 0.9);
}

.lb-nav:disabled {
  opacity: 0.45;
  cursor: not-allowed;
  filter: grayscale(0.2);
}

/* ✅ Counter */
.lb-counter {
  position: fixed;
  bottom: 22px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 1000;
}

.lb-counter-pill {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 8px 12px;
  border-radius: 999px;
  border: 1px solid rgba(191, 211, 255, 0.7);
  background: rgba(15, 23, 42, 0.75);
  color: #eaf2ff;
  font-size: 0.9rem;
  box-shadow:
    0 14px 30px rgba(15, 23, 42, 0.7),
    0 0 0 1px rgba(255, 255, 255, 0.18);
  backdrop-filter: blur(8px);
}

/* Responsive */
@media (max-width: 1024px) {
  .detail-layout {
    grid-template-columns: minmax(0, 1.6fr) minmax(260px, 1fr);
  }

  .detail-header {
    flex-direction: column;
    align-items: flex-start;
  }

  .badge-counter {
    align-self: flex-start;
  }
}

@media (max-width: 900px) {
  .detail-layout {
    display: flex;
    flex-direction: column;
    gap: 24px;
  }

  .detail-sidebar {
    display: flex;
    flex-direction: column;
    gap: 24px;
  }

  .filters-card { order: 1; }
  .latest-card { order: 2; }


  .lightbox-overlay {
    padding-bottom: 96px;
  }

  .lightbox-inner {
    max-height: calc(90vh - 76px);
  }

  .lb-nav {
    top: auto;
    bottom: 18px;
    transform: none;
  }

  .lb-prev {
    left: calc(50% - 64px);
  }

  .lb-next {
    left: calc(50% + 18px);
    right: auto;
  }

  .lb-counter {
    bottom: 74px;
  }

  .pdf-viewer-header {
    align-items: flex-start;
    flex-direction: column;
  }

  .pdf-actions {
    width: 100%;
  }

  .pdf-link {
    flex: 1 1 0;
    text-align: center;
  }

  .pdf-frame-wrap {
    height: 70vh;
    min-height: 460px;
  }
}

/* ✅ smaller nav on tiny mobile */
@media (max-width: 640px) {
  .lb-nav {
    width: 42px;
    height: 42px;
  }
  .lb-nav-icon { font-size: 1.45rem; }

  .pdf-viewer-section {
    padding: 10px;
    border-radius: 16px;
  }

  .pdf-frame-wrap {
    min-height: 380px;
  }
}
</style>
