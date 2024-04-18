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
  <div class="relative p-5 inline-flex items-center">
    <div :class="`${modelWinner ? 'outline-double outline-4 outline-offset-4 outline-stone-700' : '' } inline-flex content-center`">
      <label class="inline-flex text-4xl font-medium text-gray-700 pr-10 items-center -mt-5">{{ props.label ?? "Player" }}</label>
      <FormKit 
        v-model="modelName"
        type="select"
        select-icon="none"
        outer-class="block outline-0 border-none focus:ring-0 text-3xl content-center"
        label-class="block outline-0 border-none focus:ring-0 text-3xl content-center"
        inner-class="block outline-0 border-none focus:ring-0 text-3xl content-center"
        input-class="block outline-0 border-none focus:ring-0 text-3xl content-center"
        help-class="text-xs text-gray-500"
      >
        <option value="" disabled selected>Select a player</option>
        <option v-for="player in gamePlayers" :key="player" :value="player" :disabled="disabledOption(player)">
          {{ player }}
        </option>
      </FormKit>
    </div>
    <div v-if="showWinner" class="pl-5 -mt-5">
      <label class="text-lg font-medium text-gray-700">winner</label>
      <Switch v-model="modelWinner" :class="modelWinner ? 'bg-blue-600' : 'bg-gray-200'"
        class="relative h-6 w-11 rounded-full">
        <span class="sr-only">winner</span>
        <span :class="modelWinner ? 'translate-x-6' : 'translate-x-1'"
          class="inline-block h-4 w-4 transform rounded-full bg-white transition" />
      </Switch>
    </div>
  </div>
</template>