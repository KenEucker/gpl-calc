<script lang="ts" setup>
import { defineModel, ref } from "vue"
import { getCards, getDateAbbreviation } from "../../lib";

const model = defineModel()
const showGenerator = ref(false)
const cards = await getCards()

const headers = [
    { text: "Winner", value: "winner", sortable: true },
    { text: "Loser", value: "loser", sortable: true },
    { text: "Referee", value: "referee", sortable: true },
    { text: "Game", value: "game", sortable: true },
    { text: "Date", value: "date", sortable: true },
]
</script>

<template>
    <div v-if="!showGenerator">
        <button class="bg-purple-500 hover:bg-purple-600 text-white font-bold py-2 px-4 rounded-full shadow-lg" @click="showGenerator = true">
            Generate Standings
        </button>
    </div>
    <div v-else>
        <h2 class="text-2xl font-semibold text-gray-800">Cards For {{ getDateAbbreviation(new Date()) }}</h2>
        <div v-if="cards?.length">
            <EasyDataTable :headers="headers" :items="cards" alternating />
            <button class="bg-purple-500 hover:bg-purple-600 text-white font-bold py-2 px-4 rounded-full shadow-lg" @click="showGenerator = true">
                Generate Standings from Cards
            </button>
        </div>
        <div v-else>
            <p>No cards to display</p>
        </div>
    </div>
</template>