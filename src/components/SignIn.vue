<template>
  <div class="sign-in">
    <h1>This is sign-in page</h1>
    <button v-on:click="signIn">ログインする</button>
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
