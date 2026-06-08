<script setup lang="ts">
import { useColorMode } from "@vueuse/core";
import { Switch } from "../ui/switch";
import { computed } from "vue";
import { Icon } from "@iconify/vue";

const mode = useColorMode();

const theme = computed({
  get: () => mode.value === "dark",
  set: (value) => {
    mode.value = value ? "dark" : "light";
  },
});

function toggleMode() {
  mode.value = mode.value === "light" ? "dark" : "light";
}
</script>

<template>
  <div class="flex items-center gap-2 cursor-pointer">
    <label for="theme-switch">
      <Icon icon="mdi:circle-half-full" class="text-xl" />
    </label>
    <Switch id="theme-switch" @click="toggleMode" v-model="theme" class="cursor-pointer" />
  </div>
</template>
