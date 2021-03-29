<template>
  <div class="about page">
    <h1>This is an about page</h1>
    <AboutSignIn />
  </div>
</template>

<script>
import AboutSignIn from "../components/AboutSignIn.vue"

export default {
  components: {
    AboutSignIn,
  },
}
</script>

<style scoped>
.about {
  padding-top: 5px; /* ←フッターの高さを指定 */
  position: relative; /* ←相対位置 */
  text-align: center;
  box-sizing: border-box;
  min-height: 100vh; /* ←コンテンツの高さの最小値＝ブラウザの高さに指定 */
  background-image: linear-gradient(45deg, #000000 0%, #6e6e6e 100%);
  color: hsl(32, 100%, 50%);
}
</style>
