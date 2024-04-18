<script setup lang="ts">
import  {type Card} from "../../lib"

const props = defineProps({
  cards: Array<Card>,
})
</script>

<template>
  <div v-if="cards?.length" class="border-t-2 border-gray-100">
    <h2>Cards you have added: {{ cards.length }}</h2>
    <ul>
      <li v-for="card in cards" :key="card.slug.current" class="mt-2 mb-2 ml-0 mr-0">
        <span>{{ card.slug.current }}</span>
      </li>
    </ul>
  </div>
</template>