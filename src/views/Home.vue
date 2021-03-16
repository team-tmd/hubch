<template>
  <div class="home">
    <HomePage />
    <router-view />
  </div>
</template>

<script>
// @ is an alias to /src
import HomePage from "@/components/HomePage.vue"

export default {
  components: {
    HomePage,
  },
}
</script>
