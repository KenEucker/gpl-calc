<script lang="ts" setup>
import { toRef, onMounted } from 'vue'
import { getDateMonth, getDateYear, getCards } from '../../lib'


const headers = [
    { text: "Winner", value: "winner", sortable: true },
    { text: "Loser", value: "loser", sortable: true },
    { text: "Referee", value: "referee", sortable: true },
    { text: "Game", value: "game", sortable: true },
    { text: "Date", value: "date", sortable: true },
]

const props = defineProps({
    cards: Array,
    date: Date,
})
const cards = toRef(props.cards)

onMounted(async () => {
    if(!cards.value?.length) {
        cards.value = await getCards()
    }
})

defineOptions({
    name: 'CardsTable',
})
</script>

<template>
    <h2 class="text-2xl font-semibold text-gray-800">Cards For The Month Of {{ getDateMonth(props.date) }} {{ getDateYear(props.date) }}</h2>
    <div v-if="cards?.length">
        <EasyDataTable :headers="headers" :items="cards" alternating />
    </div>
    <div v-else>
        <p>No cards to display</p>
    </div>
</template>