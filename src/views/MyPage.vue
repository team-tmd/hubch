<template>
  <div class="my-page">
    <MyProfile v-if="isSignIn" />
    <SignIn v-else />
  </div>
</template>

<script>
import firebase from "firebase"
import SignIn from "../components/SignIn.vue"
import MyProfile from "../components/MyProfile.vue"

export default {
  components: {
    SignIn,
    MyProfile,
  },
  data() {
    return {
      isSignIn: false,
    }
  },
  created() {
    // ログイン状態を識別
    firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        this.isSignIn = true
      } else {
        this.isSignIn = false
      }
    })
  },
}
</script>
