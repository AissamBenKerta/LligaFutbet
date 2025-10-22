<template>
  <div class="tabs-container">
    <div class="tabs-header">
      <button
        v-for="(tab, index) in tabs"
        :key="index"
        :class="['tab-button', { active: currentTab === index }]"
        @click="currentTab = index"
      >
        <v-icon v-if="getIcon(index)" class="mr-2" size="20">{{ getIcon(index) }}</v-icon>
        {{ tab }}
      </button>
    </div>
    <div class="tabs-content">
      <slot></slot>
    </div>
  </div>
</template>

<script setup>
import { ref, provide, watch } from 'vue';

const props = defineProps({
  tabs: {
    type: Array,
    required: true
  },
  activeIndex: {
    type: Number,
    default: 0
  }
});

const currentTab = ref(props.activeIndex);
provide('currentTab', currentTab);

// Sincronizar con prop activeIndex
watch(() => props.activeIndex, (newIndex) => {
  currentTab.value = newIndex;
});

const getIcon = (index) => {
  const icons = {
    0: 'mdi-shield-star',
    1: 'mdi-account-group',
    2: 'mdi-scoreboard'
  };
  return icons[index];
};
</script>

<style scoped>
.tabs-container {
  width: 100%;
}

.tabs-header {
  display: flex;
  gap: 4px;
  background: #F8FAFC;
  padding: 8px;
  border-bottom: 1px solid #E2E8F0;
}

.tab-button {
  flex: 1;
  padding: 12px 20px;
  background: transparent;
  border: none;
  border-radius: 8px;
  font-size: 0.9375rem;
  font-weight: 600;
  color: #64748B;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  white-space: nowrap;
}

.tab-button:hover {
  background: #E2E8F0;
  color: #334155;
}

.tab-button.active {
  background: #2563EB;
  color: white;
}

.tabs-content {
  padding: 0;
}

@media (max-width: 600px) {
  .tab-button {
    padding: 10px 12px;
    font-size: 0.875rem;
  }
}
</style>
