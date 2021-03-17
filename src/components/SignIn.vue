<template>
  <div class="sign-in">
    <h1>This is sign-in page</h1>
    <img
      src="/images/google_signin_buttons/btn_google_signin_light_normal_web@2x.png"
      alt="Sign in with Google"
      v-on:click="signIn"
    />
  </div>
</template>

<script>
import firebase from "firebase"

export default {
  methods: {
    signIn() {
      var provider = new firebase.auth.GoogleAuthProvider()
      // firebase.auth().signInWithRedirect(provider)

      firebase
        .auth()
        .signInWithPopup(provider)
        .then(() => {
          /** @type {firebase.auth.OAuthCredential} */
        })
        .catch((error) => {
          // Handle Errors here.
          console.log(error)
        })
    },
  },
}
</script>

<style scoped>
.sign-in {
  text-align: center;
}
</style>
