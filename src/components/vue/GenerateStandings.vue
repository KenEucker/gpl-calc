<script lang="ts" setup>
import { defineModel, ref, onMounted } from 'vue'
import { getCardsByMonth, generateStandings, createSanityStanding } from '../../lib'
import CardsTable from './CardsTable.vue'

const model = defineModel()
const showGenerator = ref(false)
const cards = ref([])
const emit = defineEmits(['generated'])
const isLoading = ref(false)
const onCancel = () => isLoading.value = false
const fullPage = ref(true)

const generateStandingsFromCards = async () => {
    isLoading.value = true
    console.log('Generating Standings from Cards', cards.value)
    const standings = await generateStandings(cards.value)
    console.log('Creating standings record', {standings})
    const response = await createSanityStanding(standings)
    if (response.slug) {
        model.value = response
        emit('generated', response)
        showGenerator.value = false
    }
    isLoading.value = false
}

onMounted(async () => {
    cards.value = await getCardsByMonth()
})

defineOptions({
    name: 'GenerateStandings',
})
</script>

<template>
    <div>
        <VueLoadingOverlay v-model:active="isLoading"
                    :can-cancel="true"
                    :on-cancel="onCancel"
                    :is-full-page="fullPage"/>
        <div v-if="!showGenerator">
            <button class="bg-purple-500 hover:bg-purple-600 text-white font-bold py-2 px-4 rounded-full shadow-lg" @click="showGenerator = true">
                Generate Standings
            </button>
        </div>
        <div v-else>
            <CardsTable v-if="!isLoading" :cards="cards"/>
            <button v-if="cards?.length" class="bg-purple-500 hover:bg-purple-600 text-white font-bold py-2 px-4 rounded-full shadow-lg" @click="generateStandingsFromCards">
                Generate Standings from Cards
            </button>
        </div>
    </div>
</template>