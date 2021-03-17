<template>
  <div class="signin">
    <h1>This is sign-in page</h1>

    <img
      src="/images/google_signin_buttons/btn_google_signin_light_normal_web@2x.png"
      alt="Sign in with Google"
      v-on:click="signIn"
      class="signin-image"
      id="google-signin-image"
    />
  </div>
</template>

<script>
import firebase from "firebase"

export default {
  methods: {
    signIn() {
      var provider = new firebase.auth.GoogleAuthProvider()

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
.signin {
  text-align: center;
}
.signin-image {
  width: 300px;
  max-width: 100%;
  height: auto;
  background-size: cover;
}
#google-signin-image:hover {
  background-image: url("/images/google_signin_buttons/btn_google_signin_light_focus_web@2x.png");
  background-repeat: no-repeat;
}
#google-signin-image:active {
  background-image: url("/images/google_signin_buttons/btn_google_signin_light_pressed_web@2x.png");
}
</style>
