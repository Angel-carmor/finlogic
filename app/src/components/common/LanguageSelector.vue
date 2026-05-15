<template>
  <div class="lang-selector" ref="container">
    <button class="selector-trigger" @click="isOpen = !isOpen" :class="{ 'is-open': isOpen }">
      <div class="trigger-info">
        <span class="flag-icon">{{ currentLang.flag }}</span>
        <span class="lang-name">{{ currentLang.name }}</span>
      </div>
      <svg viewBox="0 0 24 24" class="chevron" :class="{ 'rotate': isOpen }"><path fill="currentColor" d="M7 10l5 5 5-5H7z"/></svg>
    </button>

    <Transition name="slide-fade">
      <div v-if="isOpen" class="selector-dropdown">
        <button 
          v-for="lang in languages" 
          :key="lang.code"
          class="lang-option"
          :class="{ 'is-active': modelValue === lang.code }"
          @click="selectLang(lang.code)"
        >
          <span class="flag-icon">{{ lang.flag }}</span>
          <span class="lang-name">{{ lang.name }}</span>
          <span v-if="modelValue === lang.code" class="check-icon">✓</span>
        </button>
      </div>
    </Transition>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue';

const props = defineProps({
  modelValue: String
});

const emit = defineEmits(['update:modelValue', 'change']);

const isOpen = ref(false);
const container = ref(null);

const languages = [
  { code: 'es', name: 'Español', flag: '🇪🇸' },
  { code: 'en', name: 'English', flag: '🇺🇸' }
];

const currentLang = computed(() => {
  return languages.find(l => l.code === props.modelValue) || languages[0];
});

const selectLang = (code) => {
  emit('update:modelValue', code);
  emit('change', code);
  isOpen.value = false;
};

const handleClickOutside = (e) => {
  if (container.value && !container.value.contains(e.target)) {
    isOpen.value = false;
  }
};

onMounted(() => document.addEventListener('click', handleClickOutside));
onUnmounted(() => document.removeEventListener('click', handleClickOutside));
</script>

<style scoped>
.lang-selector {
  position: relative;
  width: 100%;
}

.selector-trigger {
  width: 100%;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid var(--border-color);
  border-radius: 12px;
  padding: 0.8rem 1.2rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  outline: none;
}

.selector-trigger:hover, .selector-trigger.is-open {
  background: rgba(255, 255, 255, 0.08);
  border-color: var(--color-primary);
  box-shadow: 0 0 15px rgba(73, 75, 235, 0.15);
}

.trigger-info {
  display: flex;
  align-items: center;
  gap: 0.8rem;
}

.flag-icon { font-size: 1.2rem; }
.lang-name { color: #fff; font-weight: 600; font-size: 0.95rem; }
.chevron { width: 20px; height: 20px; color: #666; transition: transform 0.3s; }
.chevron.rotate { transform: rotate(180deg); }

.selector-dropdown {
  position: absolute;
  top: calc(100% + 8px);
  left: 0;
  right: 0;
  background: #1A1A2E;
  border: 1px solid var(--border-color);
  border-radius: 16px;
  padding: 0.5rem;
  z-index: 100;
  box-shadow: 0 15px 35px rgba(0,0,0,0.5);
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.lang-option {
  width: 100%;
  background: transparent;
  border: none;
  border-radius: 10px;
  padding: 0.8rem 1rem;
  display: flex;
  align-items: center;
  gap: 0.8rem;
  cursor: pointer;
  transition: all 0.2s;
  color: #9E9E9E;
}

.lang-option:hover {
  background: rgba(255, 255, 255, 0.05);
  color: #fff;
  transform: translateX(4px);
}

.lang-option.is-active {
  background: rgba(73, 75, 235, 0.1);
  color: var(--color-primary);
  font-weight: 700;
}

.check-icon {
  margin-left: auto;
  font-weight: 800;
  color: var(--color-primary);
}

/* Animations */
.slide-fade-enter-active {
  transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
}
.slide-fade-leave-active {
  transition: all 0.2s cubic-bezier(0.34, 1.56, 0.64, 1);
}
.slide-fade-enter-from, .slide-fade-leave-to {
  opacity: 0;
  transform: translateY(-10px) scale(0.95);
}
</style>
