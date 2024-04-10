<script lang="ts" setup>
import { defineModel, ref } from "vue"
import { getCards, generateStandings, createSanityStanding } from "../../lib";
import CardsTable from './CardsTable.vue'

const model = defineModel()
const showGenerator = ref(false)
const cards = await getCards()
const emit = defineEmits(['generated'])

const generateStandingsFromCards = async () => {
    console.log('Generating Standings from Cards', cards)
    const standings = await generateStandings(cards)
    console.log('Creating standings record', {standings})
    const response = await createSanityStanding(standings)
    if (response.slug) {
        model.value = response
        emit('generated', response)
    }
}

</script>

<template>
    <div v-if="!showGenerator">
        <button class="bg-purple-500 hover:bg-purple-600 text-white font-bold py-2 px-4 rounded-full shadow-lg" @click="showGenerator = true">
            Generate Standings
        </button>
    </div>
    <div v-else>
        <CardsTable :cards="cards"/>
        <button v-if="cards?.length" class="bg-purple-500 hover:bg-purple-600 text-white font-bold py-2 px-4 rounded-full shadow-lg" @click="generateStandingsFromCards">
            Generate Standings from Cards
        </button>
    </div>
</template>