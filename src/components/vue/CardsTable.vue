<script lang="ts" setup>
import { toRef } from "vue"
import { getDateAbbreviation, getCards } from "../../lib";


const headers = [
    { text: "Winner", value: "winner", sortable: true },
    { text: "Loser", value: "loser", sortable: true },
    { text: "Referee", value: "referee", sortable: true },
    { text: "Game", value: "game", sortable: true },
    { text: "Date", value: "date", sortable: true },
]

const props = defineProps({
    cards: Array,
})
const cards = toRef(props.cards)

if(!cards.value?.length) {
   cards.value = await getCards()
}
</script>

<template>
    <h2 class="text-2xl font-semibold text-gray-800">Cards For {{ getDateAbbreviation(new Date()) }}</h2>
    <div v-if="cards?.length">
        <EasyDataTable :headers="headers" :items="cards" alternating />
    </div>
    <div v-else>
        <p>No cards to display</p>
    </div>
</template>