<template>
  <Transition name="fade">
    <div v-if="show" class="modal-overlay" @click.self="$emit('cancel')">
      <Transition name="zoom">
        <div v-if="show" class="modal-content">
          <div class="modal-header">
            <div class="modal-icon">{{ icon }}</div>
            <h3 class="modal-title">{{ title }}</h3>
          </div>
          <p class="modal-body">{{ message }}</p>
          <div class="modal-actions">
            <button class="btn-cancel" @click="$emit('cancel')">Cancelar</button>
            <button class="btn-confirm" @click="$emit('confirm')">Confirmar</button>
          </div>
        </div>
      </Transition>
    </div>
  </Transition>
</template>

<script setup>
defineProps({
  show: Boolean,
  title: String,
  message: String,
  icon: { type: String, default: '❓' }
});

defineEmits(['confirm', 'cancel']);
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0; left: 0; width: 100%; height: 100%;
  background: rgba(0, 0, 0, 0.7);
  backdrop-filter: blur(8px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
}

.modal-content {
  background: #1A1A2E;
  border: 1px solid #3a3a5c;
  border-radius: 24px;
  padding: 2rem;
  max-width: 400px;
  width: 90%;
  box-shadow: 0 20px 40px rgba(0,0,0,0.5);
}

.modal-header {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1rem;
}

.modal-icon { font-size: 2rem; }
.modal-title { font-size: 1.4rem; font-weight: 800; color: #fff; margin: 0; }

.modal-body {
  color: #9E9E9E;
  line-height: 1.6;
  margin-bottom: 2rem;
  font-size: 0.95rem;
}

.modal-actions {
  display: flex;
  gap: 1rem;
  justify-content: flex-end;
}

.btn-cancel {
  background: transparent;
  color: #9E9E9E;
  border: 1px solid #3a3a5c;
  padding: 0.7rem 1.4rem;
  border-radius: 12px;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.2s;
}
.btn-cancel:hover { color: #fff; border-color: #fff; }

.btn-confirm {
  background: #0052FF;
  color: #fff;
  border: none;
  padding: 0.7rem 1.4rem;
  border-radius: 12px;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.2s;
}
.btn-confirm:hover { background: #0043D1; transform: translateY(-2px); }

/* Animations */
.fade-enter-active, .fade-leave-active { transition: opacity 0.3s ease; }
.fade-enter-from, .fade-leave-to { opacity: 0; }

.zoom-enter-active, .zoom-leave-active { transition: transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1); }
.zoom-enter-from, .zoom-leave-to { transform: scale(0.9); }
</style>
