<script setup>
import { toRef } from 'vue'
import { Switch } from '@headlessui/vue'

const props = defineProps({
  players: Array,
  label: String,
  cannotBe: Array,
  showWinner: Boolean,
})
const modelName = defineModel('name', { default: "" })
const modelWinner = defineModel('winner', { default: false })
const gamePlayers = toRef(props, 'players')
const cannotBePlayer = toRef(props, 'cannotBe')
const emits = defineEmits("change")

const disabledOption = (player) => cannotBePlayer.value.includes(player)

// const onChange = () => emits("change", {modelName: modelName.value, modelWinner: modelWinner.value})
</script>
<template>
  <div class="relative">
    <div :class="`${modelWinner ? 'outline-double outline-4 outline-offset-4 outline-stone-700' : '' }`">
      <label class="block text-sm font-medium text-gray-700">{{ props.label ?? "Player" }}</label>
      <FormKit v-model="modelName" type="select">
        <option value="" disabled selected>Select a player</option>
        <option v-for="player in gamePlayers" :key="player" :value="player" :disabled="disabledOption(player)">
          {{ player }}
        </option>
      </FormKit>
    </div>
    <div v-if="showWinner" class="absolute top-3 right-10">
      <label class="block text-sm font-medium text-gray-700">winner</label>
      <Switch v-model="modelWinner" :class="modelWinner ? 'bg-blue-600' : 'bg-gray-200'"
        class="relative inline-flex h-6 w-11 items-center rounded-full">
        <span class="sr-only">winner</span>
        <span :class="modelWinner ? 'translate-x-6' : 'translate-x-1'"
          class="inline-block h-4 w-4 transform rounded-full bg-white transition" />
      </Switch>
    </div>
  </div>
</template>