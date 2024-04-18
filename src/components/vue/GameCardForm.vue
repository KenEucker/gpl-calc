<script setup>
import PlayerDropdown from './PlayerDropdown.vue'
import CardsAdded from './CardsAdded.vue'
import { getPlayers, createCard } from '../../lib'
import { ref } from 'vue'

const resetForm = () => {
  player1.value = ""
  player1Winner.value = false
  player2.value = ""
  player2Winner.value = false
  referee.value = ""
  game.value = ""
  /// Let the date stay the same
  // date.value = new Date()
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
    <div class="inline-flex justify-center text-4xl w-full">
      <FormKit
        v-model="game"
        type="radio"
        :options="['8-ball', '9-ball']"
        outer-class="inline-flex outline-0 border-none focus:ring-0 content-center"
        inner-class="inline-flex outline-0 border-none focus:ring-0 content-center pl-3"
        input-class="inline-flex outline-0 border-none focus:ring-0 content-center"
        options-class="inline-flex outline-0 border-none focus:ring-0 content-center"
        fieldset-class="inline-flex outline-0 border-none focus:ring-0 content-center"
        wrapper-class="inline-flex outline-0 border-none focus:ring-0 content-center"
        />
      <label class="pl-6 pt-4 text-6xl font-medium text-gray-700 align-middle">date: </label>
      <VueDatePicker v-model="date" :enable-time-picker="false" class="max-w-max pl-6 pt-4 text-6xl align-middle" input-class-name="align-middle text-2xl"/>
    </div>
    <br />
    <div class="float-end">
      <FormKit type="button" @click="resetForm" label="Reset" />
    </div>
  </FormKit>
  <CardsAdded :cards="cardsAdded" />
</template>

<style>
.border-none {
  border: none !important;
}

:root {
    /*Sizing*/
    --dp-button-height: 35px; /*Size for buttons in overlays*/
    --dp-month-year-row-height: 35px; /*Height of the month-year select row*/
    --dp-month-year-row-button-size: 35px; /*Specific height for the next/previous buttons*/
    --dp-button-icon-height: 20px; /*Icon sizing in buttons*/
    --dp-cell-size: 35px; /*Width and height of calendar cell*/
    --dp-cell-padding: 5px; /*Padding in the cell*/
    --dp-common-padding: 10px; /*Common padding used*/
    --dp-input-icon-padding: 35px; /*Padding on the left side of the input if icon is present*/
    --dp-input-padding: 6px 30px 6px 12px; /*Padding in the input*/
    --dp-menu-min-width: 260px; /*Adjust the min width of the menu*/
    --dp-action-buttons-padding: 2px 5px; /*Adjust padding for the action buttons in action row*/
    --dp-row-margin:  5px 0; /*Adjust the spacing between rows in the calendar*/
    --dp-calendar-header-cell-padding:  0.5rem; /*Adjust padding in calendar header cells*/
    --dp-two-calendars-spacing:  10px; /*Space between multiple calendars*/
    --dp-overlay-col-padding:  3px; /*Padding in the overlay column*/
    --dp-time-inc-dec-button-size:  32px; /*Sizing for arrow buttons in the time picker*/
    --dp-menu-padding: 6px 8px; /*Menu padding*/
    
    /*Font sizes*/
    --dp-font-size: 1.5rem; /*Default font-size*/
    --dp-preview-font-size: 1rem; /*Font size of the date preview in the action row*/
    --dp-time-font-size: 1rem; /*Font size in the time picker*/
    
    /*Transitions*/
    --dp-animation-duration: 0.1s; /*Transition duration*/
    --dp-menu-appear-transition-timing: cubic-bezier(.4, 0, 1, 1); /*Timing on menu appear animation*/
    --dp-transition-timing: ease-out; /*Timing on slide animations*/
}
</style>
