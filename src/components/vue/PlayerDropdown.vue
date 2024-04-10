<script setup>
import { toRef } from 'vue'
const props = defineProps({
  players: Array,
  label: String,
  cannotBe: Array,
})
const model = defineModel({ default: "" })
const gamePlayers = toRef(props, 'players')
const cannotBePlayer = toRef(props, 'cannotBe')
const emits = defineEmits("change")

const disabledOption = (player) => cannotBePlayer.value.includes(player)

// const onChange = () => emits("change", model.value)
</script>
<template>
  <label class="block text-sm font-medium text-gray-700">{{ props.label ?? "Player" }}</label>
  <FormKit v-model="model" type="select" >
    <option value="" disabled selected>Select a player</option>
    <option v-for="player in gamePlayers" :key="player" :value="player" :disabled="disabledOption(player)">
      {{ player }}
    </option>
  </FormKit>
</template>