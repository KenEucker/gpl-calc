<script setup>
import PlayerDropdown from './PlayerDropdown.vue'
import { getPlayers, createCard } from '../../lib'
import { ref } from 'vue'

const resetForm = () => {
  player1.value = ""
  player1Winner.value = false
  player2.value = ""
  player2Winner.value = false
  referee.value = ""
  game.value = ""
  date.value = new Date()
}

const getFormData = () => {
  return {
    winner: player1Winner.value ? player1.value : player2.value,
    loser: player1Winner.value ? player2.value : player1.value,
    referee: referee.value,
    game: game.value,
    date: date.value,
  }

}

const submitHandler = async () => {
  const newCard = getFormData()
  // console.log('adding card', newCard)
  await new Promise((r) => setTimeout(r, 1000))
  const response = await createCard(newCard)
  cardsAdded.value.push(response)
  resetForm()
}

const players = ref([])
const player1 = ref("")
const player1Winner = ref(false)
const player2 = ref("")
const player2Winner = ref(false)
const game = ref("")
const referee = ref("")
const date = ref(new Date())
const cardsAdded = ref([])

getPlayers().then(fetchedPlayers => players.value = fetchedPlayers)
</script>

<template>
  <FormKit type="form" @submit="submitHandler" class="w-full mt-0 mb-4 ml-auto mr-auto">
    <div>
      <PlayerDropdown v-model:name="player1" v-model:winner="player1Winner" :players="players"
        class="mt-1 mb-0 ml-0 mr-0" :cannot-be="[player2, referee]" :show-winner="!player2Winner" />
    </div>
    <div>
      <PlayerDropdown v-model:name="player2" v-model:winner="player2Winner" :players="players"
        class="mt-1 mb-0 ml-0 mr-0" :cannot-be="[player1, referee]" :show-winner="!player1Winner" />
    </div>
    <div>
      <PlayerDropdown v-model:name="referee" :players="players" label="Referee" class="mt-1 mb-0 ml-0 mr-0"
        :cannot-be="[player1, player2]" />
    </div>
    <div>
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
  <div v-if="cardsAdded?.length" class="border-t-2 border-gray-100">
    <h2>Cards you have added</h2>
    <ul>
      <li v-for="card in cardsAdded" :key="card.id" class="mt-2 mb-2 ml-0 mr-0">
        <span>{{ card.slug.current }}</span>
      </li>
    </ul>
  </div>
</template>