<template>
  <div>
    <br />
    <h1>【HubCh の始め方】</h1>
    <br />
    <h2>サインイン</h2>
    <h3>1. 右上のSignInをクリック</h3>
    <h3>2. Googleログインボタンをクリック</h3>
    <img
      src="/images/about_page/signin-page.png"
      alt="About Sign in"
      v-on:click="toSignInPage"
      class="about-image"
      id="about-signin-image"
    />
  </div>
</template>

<script>
export default {}
</script>

<style scoped>
.about-image {
  width: 700px;
  max-width: 100%;
}
</style>
