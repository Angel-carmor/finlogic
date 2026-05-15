<template>
  <router-view></router-view>
</template>

<script setup>
import { onMounted } from 'vue';
import { useFinanceStore } from './store/finance';

const financeStore = useFinanceStore();

onMounted(() => {
  financeStore.initBudget();
});
</script>

<style>
</style>
