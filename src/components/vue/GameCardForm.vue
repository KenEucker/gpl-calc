<script setup>
import PlayerDropdown from './PlayerDropdown.vue'
import { getPlayers } from '../../lib'
import { ref } from 'vue'

const resetForm = () => {
  player1.value = ""
  player2.value = ""
  referee.value = ""
  game.value = ""
  date.value = new Date()
}

const submitHandler = async (fields) => {
  await new Promise((r) => setTimeout(r, 1000))
  console.log(fields)
  // console.log({ game: game.value, player1: player1.value, player2: player2.value, referee: referee.value, date: date.value })
  resetForm()
}

const players = ref([])
const player1 = ref("")
const player2 = ref("")
const game = ref("")
const referee = ref("")
const date = ref(new Date())

getPlayers().then(fetchedPlayers => players.value = fetchedPlayers)
</script>

<template>
  <FormKit type="form" @submit="submitHandler" class="w-full mt-0 mb-4 ml-auto mr-auto">
    <div>
      <PlayerDropdown v-model="player1" :players="players" class="mt-1 mb-0 ml-0 mr-0" 
        :cannot-be="[player2, referee]" />
    </div>
    <div>
      <PlayerDropdown v-model="player2" :players="players" class="mt-1 mb-0 ml-0 mr-0" 
        :cannot-be="[player1, referee]" />
    </div>
    <div>
      <PlayerDropdown v-model="referee" :players="players" label="Referee" class="mt-1 mb-0 ml-0 mr-0"
         :cannot-be="[player1, player2]" />
    </div>
    <div >
      <FormKit v-model="game" type="radio" label="Game" :options="['8-ball', '9-ball']" help="What game was played?" />
    </div>
    <div>
      <label class="block text-sm font-medium text-gray-700">Date</label>
      <VueDatePicker v-model="date" :enable-time-picker="false" class="max-w-max" />
    </div>
    <br />
    <div class="float-end">
      <FormKit type="button" @click="resetForm" label="Reset" />
    </div>
  </FormKit>
</template>