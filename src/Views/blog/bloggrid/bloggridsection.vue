<template>
  <section class="blog-page">
    <!-- Header -->
    <header class="blog-header">
      <div class="headline">
        <h1 style="font-weight: bold">ຂ່າວສານ ແລະ ກິດຈະກຳ</h1>
      </div>
      <div class="badge-counter">
        <span class="count">{{ filteredPosts.length }}</span>
        <span class="label">News Posts</span>
      </div>
    </header>

    <!-- Controls: Search + Year + Month -->
    <div class="blog-controls">
      <!-- Search -->
      <div class="control search-control">
        <span class="control-label">Search</span>
        <div class="search-input-wrap">
          <span class="search-icon"><i class="fa-solid fa-magnifying-glass"></i></span>
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Search by title, category, date, month, or year..."
            class="search-input"
          />
        </div>
      </div>

      <!-- Year Filter -->
      <div class="control">
        <span class="control-label">Year</span>
        <div class="select-wrap">
          <select v-model="selectedYear" class="select-input">
            <option value="all">All years</option>
            <option v-for="year in availableYears" :key="year" :value="year">
              {{ year }}
            </option>
          </select>
        </div>
      </div>

      <!-- Month Filter -->
      <div class="control">
        <span class="control-label">Month</span>
        <div class="select-wrap">
          <select v-model="selectedMonth" class="select-input">
            <option value="all">All months</option>
            <option v-for="month in months" :key="month.value" :value="month.value">
              {{ month.label }}
            </option>
          </select>
        </div>
      </div>
    </div>

    <!-- 3x3 Grid -->
    <div class="blog-grid" ref="blogGrid">
      <!-- ✅ Loading / Error -->
      <p v-if="loading" class="empty-state">Loading...</p>
      <p v-else-if="error" class="empty-state">{{ error }}</p>

      <!-- router-link wraps each card, dynamic path blogdetail/:id -->
      <router-link
        v-else
        v-for="post in paginatedPosts"
        :key="post.id"
        class="blog-link"
        :to="{
          name: 'BlogDetail',
          params: { id: post.id },                 // ✅ send real API id to BlogDetail
          query: { ...$route.query, page: currentPage } // ✅ keep page for back button
        }"
      >
        <article class="blog-card">
          <div class="blog-card-gradient"></div>

          <!-- Image at top of card -->
          <div class="blog-media" :class="{ 'document-media': post.isDocument && post.pdfUrl }">
            <img :src="post.coverImage || post.image || documentPlaceholder" :alt="post.title" loading="lazy" />
            <div class="media-overlay"></div>
          </div>

          <div class="blog-card-content">
            <div class="blog-meta-top">
              <span class="chip">
                <i class="fa-solid fa-tags"></i>{{ post.category }}
              </span>
              <span class="date">
                {{ post.date }} · {{ post.readTime }}
              </span>
            </div>

            <h2 class="blog-title">
              {{ post.title }}
            </h2>

            <p class="blog-excerpt">
              {{ post.excerpt }}
            </p>

            <div class="blog-footer">
              <button class="read-more" type="button">
                ອ່ານເພີ່ມເຕີ່ມ
                <span class="arrow">➜</span>
              </button>
            </div>
          </div>
        </article>
      </router-link>

      <!-- Empty state -->
      <p v-if="!loading && !error && !paginatedPosts.length" class="empty-state">
        ບໍ່ພົບ ຂ່າວສານ ແລະ ກິດຈະກຳ ທີ່ຄົ້ນຫາ
      </p>
    </div>

    <!-- Pagination -->
    <div class="paginationcontainer" v-if="!loading && !error && totalPages > 1">
      <div class="pagerWrap" aria-label="Pagination">
        <button
          class="pagerBtn"
          :disabled="currentPage === 1"
          @click="prevPage"
          aria-label="Previous page"
        >
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

        <button
          class="pagerBtn"
          :disabled="currentPage === totalPages"
          @click="nextPage"
          aria-label="Next page"
        >
          <span class="txt">Next</span>
          <span class="chev">›</span>
        </button>
      </div>
    </div>
  </section>
</template>

<script>
import { gsap } from "gsap";
import * as pdfjsLib from "pdfjs-dist/legacy/build/pdf.mjs";
import pdfWorkerUrl from "pdfjs-dist/legacy/build/pdf.worker.mjs?url";
import secondfooter from "../../../components/footer/mainfooter/secondfooter.vue";

pdfjsLib.GlobalWorkerOptions.workerSrc = pdfWorkerUrl;

// -------------------- Resolve API base from env ONLY --------------------
// Supports both Vite (import.meta.env.VITE_*) and Vue CLI (process.env.VUE_APP_*)
function resolveEnvBaseUrl() {
  try {
    // Vite
    const viteVal =
      typeof import.meta !== "undefined" &&
      import.meta &&
      import.meta.env &&
      (import.meta.env.VITE_API_BASE_URL || import.meta.env.VITE_API_BASE || "");

    if (viteVal) return String(viteVal).trim();
  } catch (e) {
    // ignore
  }

  try {
    // Vue CLI
    const vueCliVal =
      typeof process !== "undefined" &&
      process &&
      process.env &&
      (process.env.VUE_APP_API_BASE_URL || process.env.VUE_APP_API_BASE || "");

    if (vueCliVal) return String(vueCliVal).trim();
  } catch (e) {
    // ignore
  }

  return "";
}

function normalizeBaseUrl(u) {
  return String(u || "").trim().replace(/\/+$/, "");
}

// Join base + path, and auto-fix duplicate "/api" when base already ends with "/api"
function joinBaseAndPath(baseUrl, path) {
  const b = normalizeBaseUrl(baseUrl);
  const p = String(path || "");

  if (!b) return p;

  // If base already includes /api and path starts with /api/..., remove one /api
  if (b.endsWith("/api") && /^\/api(\/|$)/i.test(p)) {
    return b + p.replace(/^\/api/i, "");
  }

  if (!p) return b;
  if (p.startsWith("/")) return b + p;
  return b + "/" + p;
}

// ✅ API base from env only
const API_BASE = normalizeBaseUrl(resolveEnvBaseUrl());

// ✅ If env accidentally includes "/api", keep API calls correct but use ASSET_BASE for images
const ASSET_BASE = API_BASE.endsWith("/api") ? API_BASE.slice(0, -4) : API_BASE;

// ✅ News endpoint: /api/news
const NEWS_API_URL = joinBaseAndPath(API_BASE, "/api/news");
const DOCUMENT_PLACEHOLDER =
  "data:image/svg+xml;charset=UTF-8," +
  encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" width="640" height="360" viewBox="0 0 640 360">
      <rect width="640" height="360" fill="#eef2f7"/>
      <rect x="220" y="70" width="200" height="220" rx="8" fill="#ffffff" stroke="#cbd5e1" stroke-width="4"/>
      <text x="320" y="185" text-anchor="middle" font-family="Arial" font-size="28" font-weight="700" fill="#991b1b">PDF</text>
      <text x="320" y="222" text-anchor="middle" font-family="Arial" font-size="18" fill="#475569">Document</text>
    </svg>`
  );

export default {
  name: "BlogGrid",

  components: {
    secondfooter
  },

  data() {
    return {
      currentPage: 1,
      pageSize: 9,
      searchQuery: "",
      selectedYear: "all",
      selectedMonth: "all",
      loading: false,
      error: null,

      months: [
        { value: 1, label: "January" },
        { value: 2, label: "February" },
        { value: 3, label: "March" },
        { value: 4, label: "April" },
        { value: 5, label: "May" },
        { value: 6, label: "June" },
        { value: 7, label: "July" },
        { value: 8, label: "August" },
        { value: 9, label: "September" },
        { value: 10, label: "October" },
        { value: 11, label: "November" },
        { value: 12, label: "December" }
      ],

      posts: [],
      documentPlaceholder: DOCUMENT_PLACEHOLDER
    };
  },

  created() {
    const pageFromQuery = Number(this.$route?.query?.page);
    if (pageFromQuery && pageFromQuery > 0) {
      this.currentPage = pageFromQuery;
    }

    this.fetchNews();
  },

  computed: {
    availableYears() {
      const years = this.posts
        .map((post) => this.getPostYear(post))
        .filter((y) => Number.isFinite(y));
      return [...new Set(years)].sort((a, b) => b - a);
    },

    filteredPosts() {
      const query = this.searchQuery.trim().toLowerCase();

      return this.posts
        .filter((post) => {
          const dateObj = this.parsePostDate(post);
          if (!(dateObj instanceof Date) || Number.isNaN(dateObj.getTime())) return false;

          const year = dateObj.getFullYear();
          const month = dateObj.getMonth() + 1;

          if (this.selectedYear !== "all" && year !== Number(this.selectedYear)) return false;
          if (this.selectedMonth !== "all" && month !== Number(this.selectedMonth)) return false;

          if (!query) return true;

          const monthLabel = this.months.find((m) => m.value === month)?.label || "";
          const haystack = [
            post.title,
            post.category,
            post.excerpt,
            post.date,
            post.readTime,
            year,
            month,
            monthLabel,
            "ຂ່າວສານ ແລະ ກິດຈະກຳ"
          ]
            .join(" ")
            .toLowerCase();

          return haystack.includes(query);
        })
        .sort((a, b) => this.parsePostDate(b) - this.parsePostDate(a));
    },

    totalPages() {
      return Math.max(1, Math.ceil(this.filteredPosts.length / this.pageSize));
    },

    paginatedPosts() {
      const start = (this.currentPage - 1) * this.pageSize;
      return this.filteredPosts.slice(start, start + this.pageSize);
    }
  },

  watch: {
    "$route.query.page"(val) {
      const p = Number(val);
      if (p && p > 0 && p !== this.currentPage) {
        this.currentPage = p;
      }
    },

    currentPage(newVal) {
      if (this.$router) {
        const q = { ...this.$route.query, page: newVal };
        this.$router.replace({
          name: this.$route.name,
          params: this.$route.params,
          query: q
        });
      }
    },

    searchQuery() {
      this.currentPage = 1;
      this.$nextTick(() => this.animateCards());
    },
    selectedYear() {
      this.currentPage = 1;
      this.$nextTick(() => this.animateCards());
    },
    selectedMonth() {
      this.currentPage = 1;
      this.$nextTick(() => this.animateCards());
    }
  },

  mounted() {
    this.animateCards();
  },

  methods: {
    async fetchNews() {
      this.loading = true;
      this.error = null;

      // Fail fast if env missing
      if (!API_BASE) {
        this.posts = [];
        this.loading = false;
        this.error = "Missing API base in .env (VITE_API_BASE_URL / VUE_APP_API_BASE_URL).";
        return;
      }

      try {
        const res = await fetch(NEWS_API_URL, { method: "GET" });
        if (!res.ok) throw new Error(`Request failed (${res.status})`);

        const json = await res.json();
        const arr = Array.isArray(json)
          ? json
          : Array.isArray(json?.data)
            ? json.data
            : Array.isArray(json?.news)
              ? json.news
              : [];

        const mapped = arr
          .map((raw) => this.normalizeNewsItem(raw))
          .filter((p) => p && p.id != null && String(p.id).trim() !== "" && p.title);

        this.posts = mapped;
        this.renderPdfCovers();

        this.$nextTick(() => {
          if (this.currentPage > this.totalPages) this.currentPage = 1;
          this.animateCards();
        });
      } catch (e) {
        this.posts = [];
        this.error = e?.message ? `Failed to load news: ${e.message}` : "Failed to load news.";
      } finally {
        this.loading = false;
      }
    },

    normalizeNewsItem(raw) {
      const id = raw?.id ?? raw?.news_id ?? raw?.id_news ?? raw?.idnews ?? raw?._id ?? null;

      const title = String(raw?.header_news ?? raw?.title ?? "").trim();
      const category = String(raw?.category ?? "").trim();

      const dateTime =
        raw?.date_time ??
        raw?.datetime ??
        raw?.created_at ??
        raw?.createdAt ??
        raw?.updated_at ??
        raw?.updatedAt ??
        "";

      const image = this.resolveImage(raw?.hero_img ?? raw?.image ?? "");
      const pdfUrl = this.resolveImage(
        raw?.pdf_file_url ??
          raw?.pdf_url ??
          raw?.pdf_file ??
          raw?.pdfFile ??
          ""
      );

      const desc =
        raw?.description_news ?? raw?.description ?? raw?.short_desc ?? raw?.excerpt ?? "";
      const excerpt = this.makeExcerpt(desc);
      const isDocument = this.isDocumentContent(category, desc);

      const tags = Array.isArray(raw?.tags)
        ? raw.tags
        : typeof raw?.tags === "string"
          ? raw.tags.split(",").map((s) => s.trim()).filter(Boolean)
          : [];

      return {
        id,
        title,
        category,
        dateTime: String(dateTime || ""),
        date: this.formatDate(dateTime),
        readTime: this.formatRelativeTime(dateTime),
        image,
        coverImage: image,
        pdfUrl,
        isDocument,
        excerpt,
        tags
      };
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

    stripHtml(s) {
      return String(s || "").replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();
    },

    makeExcerpt(text, maxLen = 140) {
      const clean = this.stripHtml(text);
      if (!clean) return "";
      if (clean.length <= maxLen) return clean;
      return clean.slice(0, maxLen).trim() + "...";
    },

    async renderPdfCovers() {
      const targets = this.posts.filter((post) => post.isDocument && post.pdfUrl);
      if (!targets.length) return;

      await Promise.all(
        targets.map(async (post) => {
          try {
            const cover = await this.renderPdfFirstPage(post.pdfUrl);
            if (!cover) return;

            const found = this.posts.find((item) => item.id === post.id);
            if (found) found.coverImage = cover;
          } catch (error) {
            console.warn("PDF cover render failed:", post.pdfUrl, error);
          }
        })
      );
    },

    async renderPdfFirstPage(pdfUrl) {
      const loadingTask = pdfjsLib.getDocument({
        url: String(pdfUrl || "").split("#")[0],
        withCredentials: false,
        disableAutoFetch: false,
        disableStream: false
      });
      const pdf = await loadingTask.promise;
      const page = await pdf.getPage(1);
      const viewportBase = page.getViewport({ scale: 1 });
      const targetWidth = 640;
      const scale = targetWidth / viewportBase.width;
      const viewport = page.getViewport({ scale });
      const canvas = document.createElement("canvas");
      const context = canvas.getContext("2d");
      const ratio = window.devicePixelRatio || 1;
      canvas.width = Math.floor(viewport.width * ratio);
      canvas.height = Math.floor(viewport.height * ratio);
      await page.render({
        canvasContext: context,
        viewport,
        transform: ratio !== 1 ? [ratio, 0, 0, ratio, 0, 0] : null
      }).promise;
      return canvas.toDataURL("image/jpeg", 0.86);
    },

    resolveImage(u) {
      if (!u) return "";
      const s = String(u).trim();
      if (!s) return "";
      if (/^https?:\/\//i.test(s)) return s;

      // Use ASSET_BASE (no /api) for static files
      try {
        return new URL(s, ASSET_BASE || API_BASE || window.location.origin).toString();
      } catch {
        return s;
      }
    },

    parsePostDate(post) {
      const raw = post?.dateTime || "";
      return new Date(String(raw).trim());
    },

    getPostYear(post) {
      return this.parsePostDate(post).getFullYear();
    },

    formatDate(dateInput) {
      const d = new Date(dateInput);
      if (!(d instanceof Date) || Number.isNaN(d.getTime())) return "";
      return d.toLocaleDateString("en-GB", { day: "2-digit", month: "long", year: "numeric" });
    },

    formatRelativeTime(dateInput) {
      const d = new Date(dateInput);
      if (!(d instanceof Date) || Number.isNaN(d.getTime())) return "";

      const now = new Date();
      let diffMs = now.getTime() - d.getTime();
      if (diffMs < 0) diffMs = 0;

      const diffSec = Math.floor(diffMs / 1000);
      if (diffSec < 60) return "ໂພສເມື່ອ ບໍ່ດົນມານີ້";

      const diffMin = Math.floor(diffSec / 60);
      if (diffMin < 60) return `ໂພສເມື່ອ ${diffMin} ນາທີກ່ອນ`;

      const diffHr = Math.floor(diffMin / 60);
      if (diffHr < 24) return `ໂພສເມື່ອ ${diffHr} ຊົ່ວໂມງກ່ອນ`;

      const diffDay = Math.floor(diffHr / 24);
      return `ໂພສເມື່ອ ${diffDay} ມື້ກ່ອນ`;
    },

    scrollToTop() {
      window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
    },

    nextPage() {
      if (this.currentPage < this.totalPages) {
        this.currentPage += 1;
        this.$nextTick(() => {
          this.scrollToTop();
          this.animateCards();
        });
      }
    },
    prevPage() {
      if (this.currentPage > 1) {
        this.currentPage -= 1;
        this.$nextTick(() => {
          this.scrollToTop();
          this.animateCards();
        });
      }
    },
    goToPage(page) {
      if (page >= 1 && page <= this.totalPages && page !== this.currentPage) {
        this.currentPage = page;
        this.$nextTick(() => {
          this.scrollToTop();
          this.animateCards();
        });
      }
    },

    animateCards() {
      const grid = this.$refs.blogGrid;
      if (!grid) return;

      const cards = grid.querySelectorAll(".blog-card");
      if (!cards.length) return;

      gsap.killTweensOf(cards);

      gsap.fromTo(
        cards,
        { opacity: 0, y: 30, scale: 0.98 },
        { opacity: 1, y: 0, scale: 1, duration: 0.6, ease: "power3.out", stagger: 0.06 }
      );
    }
  }
};
</script>

<style scoped>
/* --- Page Layout (Light Theme) --- */
.blog-page {
  min-height: 100vh;
  padding: 60px 5vw 40px;
  background: linear-gradient(180deg, #f5f7ff 0%, #ffffff 40%, #f7f9ff 100%);
  color: #0b1020;
  display: flex;
  flex-direction: column;
  gap: 24px;
  font-family: system-ui, -apple-system, BlinkMacSystemFont, "SF Pro Text", "Segoe UI", sans-serif;
}

/* Make router-link behave like a normal grid item */
.blog-link {
  display: block;
  text-decoration: none;
  color: inherit;
  height: 100%;
}

/* --- Header --- */
.blog-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 24px;
}

.headline h1 {
  font-size: 2.4rem;
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
  background: linear-gradient(95deg, rgba(0, 3, 41, 1) 0%, rgba(0, 51, 171, 1) 46%);
  border: 1px solid rgba(191, 211, 255, 0.9);
  box-shadow: 0 12px 26px rgba(15, 23, 42, 0.28), 0 0 0 1px rgba(255, 255, 255, 0.4);
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

/* --- Controls --- */
.blog-controls {
  display: grid;
  grid-template-columns: minmax(0, 2.2fr) repeat(2, minmax(0, 1fr));
  gap: 16px;
  align-items: flex-end;
}

.control {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.control-label {
  font-size: 0.78rem;
  text-transform: uppercase;
  letter-spacing: 0.14em;
  color: #6b7280;
}

/* Search */
.search-input-wrap {
  position: relative;
  display: flex;
  align-items: center;
  background: #f9fafb;
  border-radius: 999px;
  padding: 2px 14px 2px 12px;
  border: 1px solid rgba(148, 163, 184, 0.7);
  box-shadow: 0 10px 20px rgba(148, 163, 184, 0.25);
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
  padding: 13px 4px 7px 6px;
  font-size: 0.9rem;
  width: 100%;
  color: #020617;
}

.search-input::placeholder {
  color: #9ca3af;
}

/* Selects */
.select-wrap {
  position: relative;
  border-radius: 999px;
  overflow: hidden;
  background: #f9fafb;
  border: 1px solid rgba(148, 163, 184, 0.7);
  box-shadow: 0 8px 18px rgba(148, 163, 184, 0.22);
}

.select-input {
  width: 100%;
  border: none;
  outline: none;
  background: transparent;
  padding: 16px 32px 7px 20px;
  font-size: 0.9rem;
  color: #020617;
  appearance: none;
}

/* Custom select arrow */
.select-wrap::after {
  content: "▾";
  position: absolute;
  right: 12px;
  top: 50%;
  transform: translateY(-52%);
  font-size: 0.76rem;
  color: #6b7280;
  pointer-events: none;
}

/* --- Grid --- */
.blog-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  grid-auto-rows: 1fr;
  gap: 22px;
}

/* --- Card --- */
.blog-card {
  position: relative;
  overflow: hidden;
  border-radius: 20px;
  background: #ffffff;
  border: 1px solid rgba(148, 163, 184, 0.3);
  box-shadow: 0 16px 30px rgba(15, 23, 42, 0.08), 0 0 0 1px rgba(255, 255, 255, 0.9);
  transform-origin: center;
  transition: transform 0.22s ease, box-shadow 0.22s ease, border-color 0.22s ease, background 0.22s ease;
}

.blog-card-gradient {
  position: absolute;
  inset: 0;
  background: radial-gradient(circle at top left, rgba(51, 119, 255, 0.1), transparent 60%);
  opacity: 0;
  transition: opacity 0.25s ease;
  pointer-events: none;
}

/* Image area at top of card */
.blog-media {
  position: relative;
  width: 100%;
  aspect-ratio: 16 / 9;
  overflow: hidden;
  cursor: pointer;
  border-bottom: 1px solid rgba(226, 232, 240, 0.9);
}

.blog-media img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
  transform: scale(1.03);
  transition: transform 0.35s ease, filter 0.35s ease;
}

.blog-media.document-media {
  background: #e5eaf1;
}

.blog-media.document-media img {
  object-fit: contain;
  padding: 10px;
  background: #e5eaf1;
}

.media-overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(to bottom, rgba(255, 255, 255, 0.05), rgba(15, 23, 42, 0.15));
  opacity: 0;
  transition: opacity 0.35s ease;
}

/* Card content */
.blog-card-content {
  position: relative;
  padding: 16px 20px 18px;
  height: 100%;
  display: flex;
  flex-direction: column;
  gap: 14px;



}

/* Card hover */
.blog-card:hover {
  transform: translateY(-6px) scale(1.01);
  border-color: rgba(96, 165, 250, 0.9);
  box-shadow: 0 20px 45px rgba(15, 23, 42, 0.18), 0 0 0 1px rgba(219, 234, 254, 0.85);
  background: #ffffff;
}

.blog-card:hover .blog-card-gradient {
  opacity: 1;
}

/* Hover effects for image */
.blog-card:hover .blog-media img {
  transform: scale(1.08);
  filter: saturate(1.1);
}

.blog-card:hover .media-overlay {
  opacity: 1;
}

/* Meta */
.blog-meta-top {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  font-size: 0.82rem;
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

.date {
  opacity: 0.7;
  white-space: nowrap;
  color: #6b7280;
}

/* Title / Excerpt */
.blog-title {
  font-size: 1.05rem;
  line-height: 1.32;
  letter-spacing: 0.01em;
  color: #020617;
}

.blog-excerpt {
  font-size: 0.9rem;
 
  opacity: 0.9;
  color: #4b5563;
}

/* Footer */
.blog-footer {
  margin-top: auto;
  display: flex;
  align-items: center;
  justify-content: flex-start;
}

.read-more {
  border: none;
  outline: none;
  cursor: pointer;
  padding: 8px 14px 8px 12px;
  border-radius: 999px;
  font-size: 0.86rem;
  font-weight: 500;
  background: linear-gradient(95deg, rgba(0, 3, 41, 1) 0%, rgba(0, 51, 171, 1) 46%);
  color: #f9fbff;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  box-shadow: 0 10px 26px rgba(15, 23, 42, 0.35), 0 0 0 1px rgba(226, 232, 240, 0.8);
  transition: transform 0.18s ease, box-shadow 0.18s ease, background 0.18s ease;
}

.read-more .arrow {
  font-size: 1rem;
  transform: translateX(0);
  transition: transform 0.2s ease;
}

.read-more:hover {
  transform: translateY(-1px);
  box-shadow: 0 16px 32px rgba(15, 23, 42, 0.4), 0 0 0 1px rgba(191, 219, 254, 0.9);
}

.read-more:hover .arrow {
  transform: translateX(3px);
}

/* Empty state */
.empty-state {
  grid-column: 1 / -1;
  text-align: center;
  padding: 32px 16px;
  border-radius: 20px;
  background: #f9fafb;
  border: 1px dashed rgba(148, 163, 184, 0.7);
  color: #6b7280;
  font-size: 0.9rem;
}

/* --- Pagination (Desktop / Default) --- */
.paginationcontainer {
  width: 100%;
  max-width: 520px;
  margin: 10px auto 0;
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
  background: linear-gradient(95deg, rgba(0, 3, 41, 1) 0%, rgba(0, 51, 171, 1) 46%);
  border: 1px solid rgba(191, 211, 255, 0.95);
  box-shadow: 0 10px 24px rgba(15, 23, 42, 0.35), 0 0 0 1px rgba(255, 255, 255, 0.45);
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
  color: #e5edff;
  background: rgba(15, 23, 42, 0.2);
  border: 1px solid rgba(209, 213, 219, 0.7);
  box-shadow: 0 4px 10px rgba(15, 23, 42, 0.35);
  backdrop-filter: blur(6px);
  transition: transform 0.16s ease, box-shadow 0.16s ease, background 0.16s ease, opacity 0.16s ease;
}

.pagerBtn:hover:not(:disabled) {
  transform: translateY(-1px);
  background: rgba(15, 23, 42, 0.35);
  box-shadow: 0 7px 16px rgba(15, 23, 42, 0.5);
}

.pagerBtn:disabled {
  opacity: 0.5;
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
  background: rgba(15, 23, 42, 0.25);
  border: 1px solid rgba(191, 219, 254, 0.8);
  box-shadow: inset 0 0 0 1px rgba(15, 23, 42, 0.5);
}

.pagePill {
  width: 34px;
  height: 34px;
  border-radius: 999px;
  cursor: pointer;
  font-size: 13px;
  font-weight: 500;
  color: #e5edff;
  background: rgba(15, 23, 42, 0.55);
  border: 1px solid rgba(209, 213, 219, 0.7);
  box-shadow: 0 3px 8px rgba(15, 23, 42, 0.5);
  transition: transform 0.16s ease, box-shadow 0.16s ease, background 0.16s ease, color 0.16s ease, border-color 0.16s ease;
}

.pagePill:hover {
  transform: translateY(-1px);
  background: rgba(248, 250, 252, 0.9);
  color: #020617;
  border-color: #bfdbfe;
  box-shadow: 0 5px 12px rgba(15, 23, 42, 0.6);
}

.pagePill.active {
  background: #ffffff;
  color: #0b1120;
  border-color: #ffffff;
  box-shadow: 0 8px 20px rgba(15, 23, 42, 0.8), 0 0 0 3px rgba(147, 197, 253, 0.95);
}

/* --- Responsive --- */
@media (max-width: 1024px) {
  .blog-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  .blog-header {
    flex-direction: column;
    align-items: flex-start;
  }

  .badge-counter {
    align-self: flex-start;
  }

  .blog-controls {
    grid-template-columns: minmax(0, 2fr) minmax(0, 1fr);
    grid-auto-rows: auto;
  }
}

@media (max-width: 768px) {
  .blog-page {
    padding: 32px 20px 28px;
  }

  .blog-grid {
    grid-template-columns: minmax(0, 1fr);
  }

  .headline h1 {
    font-size: 1.8rem;
  }

  .blog-controls {
    grid-template-columns: 1fr;
  }

  /* =========================================================
     ✅ Mobile Pagination = Prev • Dots • Next (เหมือน Swiper)
     ========================================================= */
  .paginationcontainer {
    max-width: 100%;
    margin-top: 18px;
  }

  .pagerWrap {
    margin-top: 18px;
    background: transparent;
    border: none;
    box-shadow: none;
    padding: 0;
    gap: 0.75rem;
    flex-wrap: nowrap;
    justify-content: center;
    transform: none;
  }

  .pagerBtn {
    padding: 0.5rem 0.85rem;
    gap: 0.35rem;
    border-radius: 999px;
    border: 1px solid rgba(191, 219, 254, 0.9);
    background: radial-gradient(circle at top, rgba(59, 130, 246, 0.95), rgba(15, 23, 42, 0.98));
    color: #e0f2fe;
    box-shadow: 0 0 18px rgba(59, 130, 246, 0.55), 0 0 34px rgba(56, 189, 248, 0.35);
    backdrop-filter: none;
  }

  .pagerBtn:hover:not(:disabled) {
    transform: translateY(-1px);
    background: radial-gradient(circle at top, rgba(96, 165, 250, 1), rgba(15, 23, 42, 0.98));
    border-color: #e0f2fe;
    box-shadow: 0 0 24px rgba(96, 165, 250, 0.7), 0 0 44px rgba(56, 189, 248, 0.45);
  }

  .pagerBtn:disabled {
    opacity: 0.5;
  }

  .pagerBtn .txt {
    display: none;
  }

  .pagerBtn .chev {
    width: 18px;
    height: 18px;
    border-radius: 999px;
    border: 1px solid rgba(191, 219, 254, 0.9);
    display: inline-flex;
    align-items: center;
    justify-content: center;
    line-height: 1;
    font-size: 14px;
  }

  .pagerPills {
    background: transparent;
    border: none;
    box-shadow: none;
    padding: 0;
    gap: 6px;
    flex: 1;
    min-width: auto;
    justify-content: center;
  }

  .pagePill {
    width: 6px;
    height: 6px;
    padding: 0;
    border-radius: 999px;
    border: none;
    box-shadow: none;
    background: rgba(148, 163, 184, 0.7);
    opacity: 1;
    transform: none;
    font-size: 0;
    color: transparent;
    transition: width 180ms ease-out, background 180ms ease-out, transform 180ms ease-out;
  }

  .pagePill.active {
    width: 20px;
    height: 6px;
    background: linear-gradient(90deg, #3b82f6, #0ea5e9);
    transform: translateY(-1px);
    box-shadow: 0 0 14px rgba(59, 130, 246, 0.5);
  }

  .pagePill:hover {
    background: rgba(148, 163, 184, 0.85);
    color: transparent;
    border: none;
    box-shadow: none;
    transform: none;
  }

  .pagePill.active:hover {
    background: linear-gradient(90deg, #3b82f6, #0ea5e9);
  }
}
</style>
