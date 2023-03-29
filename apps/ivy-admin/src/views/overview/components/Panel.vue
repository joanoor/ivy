<template>
  <div class="panel" p-5 :class="className">
    <div text-size-4 font-600 mb-4 class="title">{{ title }}</div>
    <div text-size-8 font-700 class="count">
      <!-- <DigitalFlop :digit="count"></DigitalFlop> -->
      <span cursor-pointer @click="$emit('goto')">{{ count }}</span>
    </div>
  </div>
</template>

<script setup lang="ts">
// import DigitalFlop from '@/components/DigitalFlop.vue'
defineProps<{ title: string; count?: string | number; className: string }>()
defineEmits(['goto'])
</script>

<style scoped lang="scss">
.panel {
  width: calc((100% - 80px) / 5);
  height: 130px;
  border: 1px solid #e5e6eb;
  border-radius: 4px;
  &:not(&:last-child) {
    margin-right: 20px;
  }
}
.title {
  font-weight: 600;
  line-height: 24px;
  height: 24px;
}

.count {
  &::after {
    font-size: 16px;
    font-weight: 500;
    margin-left: 0.5em;
  }
}

.station {
  background: linear-gradient(180deg, #f6f7ff, #ececff 100%);
  .count {
    &::after {
      content: '(个)';
    }
  }
}
.equip {
  background: linear-gradient(180deg, #f2f9fe, #e6f4fe 100%);
  .count {
    &::after {
      content: '(个)';
    }
  }
}
.meterequip {
  background: linear-gradient(180deg, #f5fef2, #e6feee 100%);
  .count {
    &::after {
      content: '(个)';
    }
  }
}
.station2 {
  background: linear-gradient(180deg, #fefdf2, #f8fee6 100%);
  .count {
    &::after {
      content: '(次)';
    }
  }
}
.station3 {
  background: linear-gradient(180deg, #fffdf6, #fef9e6 100%);
  .count {
    &::after {
      content: '(%)';
    }
  }
}
</style>
