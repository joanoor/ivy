<template>
  <VueOfficeExcel
    v-if="$route.query['type'] === 'excel'"
    :src="$route.query['src']"
  ></VueOfficeExcel>
  <VueOfficeDocx
    v-if="$route.query['type'] === 'word'"
    :src="$route.query['src']"
  ></VueOfficeDocx>
  <VueOfficePdf
    v-if="$route.query['type'] === 'pdf'"
    :src="$route.query['src']"
  ></VueOfficePdf>
</template>
<script setup lang="ts">
import VueOfficeExcel from '@vue-office/excel'
import VueOfficeDocx from '@vue-office/docx'
import VueOfficePdf from '@vue-office/pdf'
// import '@vue-office/docx/lib/index.css'
// import '@vue-office/excel/lib/index.css'
// import '@vue-office/pdf/lib/index.css'
</script>

<style scoped></style>
