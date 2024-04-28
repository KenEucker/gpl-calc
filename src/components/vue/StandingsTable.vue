<script lang='ts' setup>
import { ref, onMounted } from 'vue'
import { getStandingsByMonth, getDateAbbreviation } from '../../lib'
import type { SortType } from 'vue3-easy-data-table'


const props = defineProps({
    data: Array,
    items: Array,
    headers: Array,
    date: Date,
    type: {
        type: String,
        default: 'Beginner'
    },
})

const _items = ref(props.items)
const _headers = ref(props.headers)
const _data = ref(props.data ?? [])
const _type = ref(props.type)
const _date = ref(props.date ?? new Date())
const sortBy = 'score';
const sortType: SortType = 'desc';

const loadData = async () => {
    const standings = await getStandingsByMonth(_date.value)
    if (standings?.length) {
        const standing = standings[0]

        _date.value = standing.date
        _data.value = _type.value === 'Pro' ? standing.proleaderboard : standing.beginnerleaderboard
        _headers.value = [
            { text: 'Rank', value: 'rank', sortable: true },
            { text: 'Player', value: 'player', sortable: true },
            { text: 'Bracket', value: 'bracket', sortable: true },
            { text: 'Score', value: 'score', sortable: true },
            { text: 'Games', value: 'games', sortable: true },
        ]

        _data.value = _data.value.map((item: any, index: number) => ({ rank: index + 1, ...item }))
    }

    if (_data.value?.length && !_items.value?.length) {
        _items.value = _data.value
    }

    if (_data.value?.length && !_headers.value?.length) {
        const firstRow = _data.value[0]
        const keys = Object.keys(firstRow)
        _headers.value = keys.map(key => ({ text: key, value: key }))
    }
}

onMounted(loadData)

defineOptions({
    name: 'StandingsTable',
})
</script>

<template>
    <h2 class='text-2xl font-semibold text-gray-800'>{{ _type }} Standings For {{ getDateAbbreviation(_date) }}</h2>
    <EasyDataTable v-if='_data?.length' :headers='_headers' :items='_items' :hide-footer='true' :sort-by='sortBy'
        :sort-type='sortType' alternating />
    <div v-else>
        <p>No data to display</p>
    </div>
</template>