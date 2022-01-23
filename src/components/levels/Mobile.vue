<template>
  <div>
    <p>Use your desktop or laptop computer to open:</p>
    <p v-text="url" />
  </div>
</template>

<script setup>
const url = location.href
</script>
