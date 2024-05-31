<script setup lang="ts">
import { ref, computed } from 'vue'
import StandingsTable from './StandingsTable.vue'
import GenerateStandings from './GenerateStandings.vue'
import { getDateMonth, getDateYear, getStandingsByMonth } from '../../lib';

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
const dateDisplay = ref('')

const changeDateDisplay = () => {
    dateDisplay.value = `${ getDateMonth(dataDate.value)} ${dataDate.value.getFullYear()}`
}
changeDateDisplay()

const changeMonth = (direction: number = 0) => {
    dataDate.value.setMonth(dataDate.value.getMonth() + direction)
    // console.log('New Date', dataDate.value, dateDisplay.value)
    changeDateDisplay()
    displayStandings()
}

const displayStandings = async () => {
    const standings = await getStandingsByMonth(dataDate.value)
    if (standings?.length) {
        const standing = standings[0]
        dataDate.value = new Date(standing.date)
        beginnerData.value = standing.beginnerleaderboard
        proData.value = standing.proleaderboard
        console.log({dataDate: dataDate.value, beginnerData: beginnerData.value, proData: proData.value})
    }
}
displayStandings()

defineOptions({
    name: 'StandingsGenerator',
})
</script>

<template>
    <div>
        <button @click="changeMonth(-1)"><-</button> {{dateDisplay }} <button @click="changeMonth(1)">-></button>
    </div>
    <GenerateStandings @generated="newStandingsGenerated" date="x`x"/>
    <StandingsTable :date="dataDate" :data="proData" type="Pro" :headers="headers" />
    <StandingsTable :date="dataDate" :data="beginnerData" type="Beginner" :headers="headers" />
</template>