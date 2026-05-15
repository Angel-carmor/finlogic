<template>
  <div class="base-select-wrapper" ref="wrapper">
    <div class="base-select-label" v-if="label">{{ label }}</div>
    <div 
      class="base-select-trigger" 
      :class="{ 'is-open': isOpen, 'has-icon': !!icon }"
      @click="toggleDropdown"
    >
      <div v-if="icon" class="select-icon" v-html="icon"></div>
      <div class="selected-text">{{ selectedLabel }}</div>
      <svg class="chevron-icon" viewBox="0 0 24 24"><path fill="currentColor" d="M7 10l5 5 5-5z"/></svg>
    </div>

    <transition name="fade-down">
      <div v-if="isOpen" class="base-select-dropdown">
        <div 
          v-for="option in options" 
          :key="option.value" 
          class="base-select-option"
          :class="{ 'is-selected': option.value === modelValue }"
          @click="selectOption(option)"
        >
          <div v-if="option.icon" class="option-icon" v-html="option.icon"></div>
          <span>{{ option.label }}</span>
          <svg v-if="option.value === modelValue" class="check-icon" viewBox="0 0 24 24"><path fill="currentColor" d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/></svg>
        </div>
      </div>
    </transition>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue';

const props = defineProps({
  modelValue: [String, Number],
  options: {
    type: Array,
    default: () => []
  },
  label: String,
  icon: String,
  placeholder: {
    type: String,
    default: 'Seleccionar...'
  }
});

const emit = defineEmits(['update:modelValue', 'change']);

const isOpen = ref(false);
const wrapper = ref(null);

const selectedLabel = computed(() => {
  const option = props.options.find(o => o.value === props.modelValue);
  return option ? option.label : props.placeholder;
});

const toggleDropdown = () => {
  isOpen.value = !isOpen.value;
};

const selectOption = (option) => {
  emit('update:modelValue', option.value);
  emit('change', option.value);
  isOpen.value = false;
};

const handleClickOutside = (event) => {
  if (wrapper.value && !wrapper.value.contains(event.target)) {
    isOpen.value = false;
  }
};

onMounted(() => {
  document.addEventListener('click', handleClickOutside);
});

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside);
});
</script>

<style scoped>
.base-select-wrapper {
  position: relative;
  width: 100%;
}

.base-select-label {
  font-size: 0.65rem;
  font-family: monospace;
  color: var(--text-muted);
  margin-bottom: 0.5rem;
  letter-spacing: 1px;
  text-transform: uppercase;
}

.base-select-trigger {
  display: flex;
  align-items: center;
  background: rgba(37, 37, 64, 0.6);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 10px;
  padding: 0.7rem 1rem;
  color: #fff;
  cursor: pointer;
  transition: all 0.3s;
  user-select: none;
}

.base-select-trigger:hover {
  border-color: var(--color-primary);
  background: rgba(59, 130, 246, 0.1);
}

.base-select-trigger.is-open {
  border-color: var(--color-primary);
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

.select-icon {
  width: 18px;
  height: 18px;
  margin-right: 0.8rem;
  color: var(--color-primary);
}

.selected-text {
  flex: 1;
  font-size: 0.9rem;
  font-weight: 500;
}

.chevron-icon {
  width: 20px;
  height: 20px;
  color: var(--text-muted);
  transition: transform 0.3s;
}

.is-open .chevron-icon {
  transform: rotate(180deg);
}

.base-select-dropdown {
  position: absolute;
  top: calc(100% + 8px);
  left: 0;
  right: 0;
  background: #1e1e35;
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5);
  z-index: 1000;
  padding: 0.5rem;
  max-height: 250px;
  overflow-y: auto;
}

.base-select-option {
  display: flex;
  align-items: center;
  padding: 0.7rem 1rem;
  border-radius: 8px;
  color: var(--text-muted);
  cursor: pointer;
  transition: all 0.2s;
}

.base-select-option:hover {
  background: rgba(255, 255, 255, 0.05);
  color: #fff;
}

.base-select-option.is-selected {
  background: rgba(59, 130, 246, 0.15);
  color: var(--color-primary);
  font-weight: 600;
}

.option-icon {
  width: 16px;
  height: 16px;
  margin-right: 0.8rem;
}

.check-icon {
  width: 16px;
  height: 16px;
  margin-left: auto;
}

/* Scrollbar styling */
.base-select-dropdown::-webkit-scrollbar { width: 6px; }
.base-select-dropdown::-webkit-scrollbar-track { background: transparent; }
.base-select-dropdown::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); border-radius: 10px; }

/* Animation */
.fade-down-enter-active, .fade-down-leave-active {
  transition: all 0.2s ease;
}
.fade-down-enter-from, .fade-down-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}
</style>
