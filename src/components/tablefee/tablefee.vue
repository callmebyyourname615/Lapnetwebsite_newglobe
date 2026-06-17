<template>
  <div class="table-wrap" ref="tableRef">
    <div class="header">
      <h2 class="title">{{ title }}</h2>
      <div class="actions">
        <button class="btn" @click="downloadImage">ດາວໂຫຼດຮູບພາບ</button>
      </div>
    </div>

    <div class="card">
      <!-- Desktop Table -->
      <table class="modern-table desktop-table">
        <thead>
          <tr>
            <th class="col-name">ໂອນເງິນແຕ່ຈຳນວນ</th>
            <th class="col-role">ຫາຈຳນວນ</th>
            <th class="col-location">ຄ່າບໍລິການ</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(row, i) in rows" :key="row.id" :class="{ alt: i % 2 === 1 }">
            <td>{{ row.name }}</td>
            <td>{{ row.role }}</td>
            <td>{{ row.location }}</td>
          </tr>
        </tbody>
      </table>

      <!-- Mobile Blocks (2 rows per block) -->
      <div class="mobile-list">
        <div
          v-for="(pair, gi) in groupedRows"
          :key="`group-${gi}`"
          class="mobile-block"
          :class="{ alt: gi % 2 === 1 }"
        >
          <div v-for="(row, ri) in pair" :key="row.id" class="mobile-row">
            <div class="mobile-cell">
              <div class="label">ໂອນເງິນແຕ່ຈຳນວນ</div>
              <div class="value">{{ row.name }}</div>
            </div>

            <div class="mobile-cell">
              <div class="label">ຫາຈຳນວນ</div>
              <div class="value">{{ row.role }}</div>
            </div>

            <div class="mobile-cell">
              <div class="label">ຄ່າບໍລິການ</div>
              <div class="value">{{ row.location }}</div>
            </div>

            <!-- separator between 2 rows inside same block -->
            <div v-if="ri === 0 && pair.length === 2" class="row-sep"></div>
          </div>
        </div>
      </div>

      <div class="footer">
       
      </div>
    </div>
  </div>
</template>

<script setup>
import { reactive, ref, computed } from 'vue'
import html2canvas from 'html2canvas'

const props = defineProps({
  title: { type: String, default: 'ຄິດໄລ່ຄ່າບໍລິການດັ່ງນີ້ :' }
})

const tableRef = ref(null)

const original = [
  { id: 1, name: '1.000 ກີບ', role: '2.000.000 ກີບ', location: '1.000 / ທຸລະກຳ' },
  { id: 2, name: '2.000.001 ກີບ', role: '3.000.000 ກີບ', location: '1.500 ກີບ / ທຸລະກຳ' },
  { id: 3, name: '3.000.001 ກີບ', role: '4.000.000 ກີບ', location: '2.500 ກີບ / ທຸລະກຳ' },
  { id: 4, name: '4.000.001 ກີບ', role: '5.000.000 ກີບ', location: '3.000 ກີບ / ທຸລະກຳ' },
  { id: 5, name: '5.000.001 ກີບ', role: '7.000.000 ກີບ', location: '4.500 ກີບ / ທຸລະກຳ' },
  { id: 6, name: '7.000.001 ກີບ', role: '10.000.000 ກີບ', location: '7.500 ກີບ / ທຸລະກຳ' },
  { id: 7, name: '10.000.001 ກີບ', role: '30.000.000 ກີບ', location: '12.000 ກີບ / ທຸລະກຳ' },
  { id: 8, name: '30.000.001 ກີບ', role: '50.000.000 ກີບ', location: '15.500 ກີບ / ທຸລະກຳ' },
  { id: 9, name: '50.000.001 ກີບ', role: '100.000.000 ກີບ', location: '20.000 ກີບ / ທຸລະກຳ' },
  { id: 10, name: '100.000.001 ກີບ', role: '120.000.000 ກີບ', location: '25.000 ກີບ / ທຸລະກຳ' },
  { id: 11, name: '120.000.001 ກີບ', role: '150.000.000 ກີບ', location: '30.000 ກີບ / ທຸລະກຳ' },
  { id: 12, name: '150.000.001 ກີບ', role: '200.000.000 ກີບ', location: '40.000 ກີບ / ທຸລະກຳ' }
]

const rows = reactive([...original])

// ✅ group rows 2-by-2 for mobile blocks
const groupedRows = computed(() => {
  const out = []
  for (let i = 0; i < rows.length; i += 2) {
    out.push(rows.slice(i, i + 2))
  }
  return out
})

async function downloadImage() {
  const tableElement = tableRef.value
  if (!tableElement) return

  const canvas = await html2canvas(tableElement, { backgroundColor: null })
  const link = document.createElement('a')
  link.download = 'table.png'
  link.href = canvas.toDataURL('image/png')
  link.click()
}
</script>

<style scoped>
:root {
  --muted: #9aa4b2;
}

.table-wrap {
  width: 90%;
  max-width: 1300px;
  margin: 24px auto;
  font-family: Inter, ui-sans-serif, system-ui, -apple-system, 'Segoe UI', Roboto, 'Helvetica Neue', Arial;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.title {
  margin: 0;
  font-family: "Noto Sans Lao", sans-serif;
  font-size: 30px;
  font-weight: 700;
  color: #000000;
}

.actions button {
  font-family: "Noto Sans Lao", sans-serif;
}

.actions {
  display: flex;
  gap: 8px;
}

.btn {
  border: 0;
  padding: 8px 12px;
  border-radius: 10px;
  background: linear-gradient(90deg, #026df0, #0026b1);
  color: white;
  font-weight: 600;
  cursor: pointer;
  box-shadow: 0 6px 18px rgba(79, 70, 229, .15);
}

.btn.ghost {
  display: none;
}

.card {
  background: linear-gradient(180deg, #214495, #032059);
  border-radius: 14px;
  padding: 12px;
  box-shadow: 0 8px 30px rgba(2, 6, 23, .3);
  overflow: hidden;
}

/* ===== Desktop table ===== */
.modern-table {
  width: 100%;
  border-collapse: separate;
  border-spacing: 0 8px;
  color: #ffffff;
  font-family: "Noto Sans Lao", sans-serif;
}

.modern-table thead th {
  text-align: left;
  padding: 12px 16px;
  font-size: 23px;
  color: #cbd5e1;
}

.modern-table tbody tr {
  background: rgba(255, 255, 255, 0.08);
  border-radius: 10px;
}

.modern-table tbody tr.alt {
  background: rgba(255, 255, 255, 0.15);
}

.modern-table tbody td {
  padding: 14px 16px;
  border-top: 0;
  font-size: 19px;
  vertical-align: middle;
}

/* ===== Mobile blocks ===== */
.mobile-list {
  display: none;
  font-family: "Noto Sans Lao", sans-serif;
}

.mobile-block {
  background: rgba(255, 255, 255, 0.08);
  border-radius: 12px;
  padding: 10px 12px;
  margin-bottom: 10px;
}

.mobile-block.alt {
  background: rgba(255, 255, 255, 0.15);
}

.mobile-row {
  position: relative;
  padding: 10px 0;
}

.row-sep {
  margin-top: 12px;
  border-top: 1px dashed rgba(255, 255, 255, 0.18);
}

.mobile-cell {
  display: flex;
  justify-content: space-between;
  gap: 12px;
  padding: 6px 0;
}

.label {
  color: #cbd5e1;
  font-size: 13px;
}

.value {
  color: #ffffff;
  font-size: 16px;
  font-weight: 600;
  text-align: right;
}

/* Footer */
.footer {
  display: flex;
  justify-content: flex-end;
  padding-top: 10px;
  color: #cbd5e1;
  font-size: 13px;
}

/* Responsive */
@media (max-width:720px) {
  .table-wrap {
    padding: 12px;
    width: 95%;
  }

  /* hide desktop table, show mobile blocks */
  .desktop-table {
    display: none;
  }
  .mobile-list {
    display: block;
  }

  .title {
    font-size: 22px;
  }

  .actions {
    gap: 6px;
  }
}
</style>
