<template>
  <div v-show="currentTab === index">
    <slot></slot>
  </div>
</template>

<script setup>
import { inject } from 'vue';

const props = defineProps({
  index: {
    type: Number,
    required: true
  }
});

// Cambiar de 'activeTab' a 'currentTab'
const currentTab = inject('currentTab');
</script>
