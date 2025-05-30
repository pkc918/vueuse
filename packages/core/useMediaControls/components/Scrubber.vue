<script setup lang="ts">
import { useEventListener, useMouseInElement, useVModel } from '@vueuse/core'
import { shallowRef, watch } from 'vue'

const props = defineProps({
  min: { type: Number, default: 0 },
  max: { type: Number, default: 100 },
  secondary: { type: Number, default: 0 },
  modelValue: { type: Number, required: true },
})

const emit = defineEmits(['update:modelValue'])

const scrubber = shallowRef<HTMLDivElement>()
const scrubbing = shallowRef(false)
const pendingValue = shallowRef(0)

useEventListener('mouseup', () => scrubbing.value = false, { passive: true })

const value = useVModel(props, 'modelValue', emit)
const { elementX, elementWidth } = useMouseInElement(scrubber)

watch([scrubbing, elementX], () => {
  const progress = Math.max(0, Math.min(1, (elementX.value) / elementWidth.value))
  pendingValue.value = progress * props.max
  if (scrubbing.value)
    value.value = pendingValue.value
})
</script>

<template>
  <div ref="scrubber" class="relative h-2 rounded cursor-pointer select-none bg-black dark:bg-white dark:bg-opacity-10 bg-opacity-20" @mousedown="scrubbing = true">
    <div class="relative overflow-hidden h-full w-full rounded">
      <div class="h-full absolute opacity-30 left-0 top-0 bg-emerald-700 w-full rounded" :style="{ transform: `translateX(${secondary / max * 100 - 100}%)` }" />
      <div class="relative h-full w-full bg-emerald-500 rounded" :style="{ transform: `translateX(${value / max * 100 - 100}%)` }" />
    </div>
    <div class="absolute inset-0 hover:opacity-100 opacity-0" :class="{ '!opacity-100': scrubbing }">
      <slot :pending-value="pendingValue" :position="`${Math.max(0, Math.min(elementX, elementWidth))}px`" />
    </div>
  </div>
</template>
