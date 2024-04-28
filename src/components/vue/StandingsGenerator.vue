<script setup lang="ts">
import { ref } from 'vue'
import StandingsTable from './StandingsTable.vue'
import GenerateStandings from './GenerateStandings.vue'
import { getStandingsByMonth } from '../../lib';

const newStandingsGenerated = (response: any) => {
    console.log('New Standings Generated', response)
    displayStandings()
}
const headers = [{ text: "Rank", value: "rank", sortable: true },
            { text: "Player", value: "player", sortable: true },
            { text: "Bracket", value: "bracket", sortable: true },
            { text: "Score", value: "score", sortable: true },
            { text: "Games", value: "games", sortable: true },
        ]
const beginnerData = ref([])
const proData = ref([])
const dataDate = ref(new Date())

const displayStandings = async () => {
    const standings = await getStandingsByMonth(new Date())
    if (standings?.length) {
        const standing = standings[0]
        dataDate.value = new Date(standing.date)
        beginnerData.value = standing.beginnerleaderboard
        proData.value = standing.proleaderboard
    }
}
displayStandings()

defineOptions({
    name: 'StandingsGenerator',
})
</script>

<template>
    <GenerateStandings @generated="newStandingsGenerated"/>
    <StandingsTable :date="dataDate" :data="proData" type="Pro" :headers="headers" />
    <StandingsTable :date="dataDate" :data="beginnerData" type="Beginner" :headers="headers" />
</template>