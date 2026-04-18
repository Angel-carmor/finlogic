<template>
  <header class="topbar">
    <div>
      <h1>{{ title }}</h1>
    </div>
    <div class="actions">
      <button class="btn-primary">+ Nueva Transacción</button>
    </div>
  </header>
</template>

<script setup>
defineProps({
  title: {
    type: String,
    default: 'Panel Principal'
  }
});
</script>

<style scoped>
.topbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  color: #f8fafc;
}
.topbar h1 { margin: 0; font-size: 1.8rem; }
.btn-primary { 
  background: #6366f1; color: white; border: none; 
  padding: 0.6rem 1.2rem; border-radius: 8px; cursor: pointer; 
}
.btn-primary:hover { background: #4f46e5; }
</style>
