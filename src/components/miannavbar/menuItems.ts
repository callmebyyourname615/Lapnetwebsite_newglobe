type MenuChild = {
  label: string
  to: string
  icon: string
}

type MenuItem = {
  label: string
  to: string
  children?: MenuChild[]
  isCta?: boolean
}

export const menuItems: MenuItem[] = [
  {
    label: 'ຜະລິດຕະພັນ ແລະ ການບໍລິການ',
    to: '/products_service/allproduct',
    children: [
      { label: 'ຜະລິດຕະພັນ ແລະ ການບໍລິການ ທັງໝົດ', to: '/products_service/allproduct', icon: 'ri-layout-grid-fill' },
      { label: 'ກວດຍອດເງິນຂ້າມທະນາຄານຜ່ານຕູ້ ATM', to: '/products_service/atm-inquiry', icon: 'ri-qr-scan-2-line' },
      { label: 'ຖອນເງິນສົດຂ້າມທະນາຄານຜ່ານຕູ້ ATM', to: '/products_service/atm-cash-withdraw', icon: 'fa-solid fa-money-bill-transfer' },
      { label: 'ໂອນເງິນຂ້າມທະນາຄານຜ່ານຕູ້ ATM', to: '/products_service/atm-transfer', icon: 'fa-solid fa-right-left' },
      { label: 'ໂອນເງິນຂ້າມທະນາຄານເທິງມືຖື', to: '/products_service/mobile-transfer', icon: 'fa-solid fa-mobile-screen' },
      { label: 'ຊຳລະຂ້າມທະນາຄານຜ່ານ LAPNet', to: '/products_service/qr-payment', icon: 'fa-solid fa-money-bill-wave' },
      { label: 'ຊຳລະຂ້າມແດນຜ່ານ QR CODE', to: '/products_service/crossborder', icon: 'fa-solid fa-qrcode' }
    ]
  },
  {
    label: 'ສະມາຊິກ',
    to: '/member/membercardATM',
    children: [
      { label: 'ສະມາຊິກລະບົບບັດທະນາຄານຮ່ວມກັນ', to: '/member/membercardATM', icon: 'fa-solid fa-credit-card' },
      { label: 'ສະມາຊິກລະບົບຊຳລະຂ້າມທະນາຄານເທິງມືຖື', to: '/member/mobile_banking', icon: 'fa-solid fa-mobile-screen-button' },
      { label: 'ສະມາຊິກລະບົບຊຳລະຂ້າມແດນຜ່ານ QR Code', to: '/member/crossborder', icon: 'fa-solid fa-earth-asia' }
    ]
  },
  { label: 'ຂ່າວ ແລະ ກິດຈະກຳ', to: '/bloggrid' },
  { label: 'ຮ່ວມງານກັບເຮົາ', to: '/joinus' },
  {
    label: 'ກ່ຽວກັບພວກເຮົາ',
    to: '/aboutus/vision',
    children: [
      { label: 'ວິໄສທັດ ແລະ ພາລະກິດ', to: '/aboutus/vision', icon: 'fa-solid fa-lightbulb' },
      { label: 'ພາລະບົດບາດ', to: '/aboutus/role', icon: 'fa-solid fa-list-check' },
      { label: 'ຄວາມເປັນມາ', to: '/aboutus/history', icon: 'fa-solid fa-timeline' },
      { label: 'ສະພາບໍລິຫານ', to: '/aboutus/board_director', icon: 'fa-solid fa-users-between-lines' },
      { label: 'ໂຄງຮ່າງການຈັດຕັ້ງ', to: '/aboutus/companystructureimage', icon: 'fa-solid fa-sitemap' }
    ]
  },
  { label: 'ຕິດຕໍ່ພວກເຮົາ', to: '/contactus' }
]

export const menuColumns = menuItems.filter((item) => item.children?.length)
