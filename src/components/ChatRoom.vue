<template>
  <div>
    {{ $route.params.id }}
    <section v-for="message in messages" :key="message.id" class="item">
      <!-- <section v-for="(room) in messages" :key="message.id" class="item"> -->
      <div v-if="message.text">
        <div class="item-message">{{ message.text }}</div>
      </div>
      <div v-if="message.imageURL">
        <img class="item-image" :src="message.imageURL" />
      </div>
    </section>
    <div class="form">
      <!-- New Room作成部分 -->
      <form action="" @submit.prevent="sendMessage">
        <textarea
          v-model="inputMessage"
          @keydown.enter.exact.prevent="sendMessage"
        ></textarea>
        <button type="submit">Send message</button>
      </form>

      <input type="file" ref="inputFile" accept="image/*" @change="sendImage" />
    </div>
  </div>
</template>

<script>
// firebase モジュール
import firebase from "firebase"

export default {
  data() {
    return {
      user: "",
      inputMessage: "",
      messages: [],
      users: [],
      file: "",
    }
  },

  created() {
    ///Roomリストの表示
    const col_rooms = firebase
      .firestore()
      .collection("rooms")
      .doc(this.$route.params.id)
      .collection("messages")
      .orderBy("timestamp")
      .limit(30)
    col_rooms.onSnapshot((snapshot) => {
      this.messages.length = 0
      snapshot.docs.forEach((doc) => {
        this.messages.push({
          id: doc.id,
          ...doc.data(),
        })
      })
    })
  },

  methods: {
    sendMessage() {
      if (this.inputMessage.length) {
        const quary = firebase
          .firestore()
          .collection("rooms")
          .doc(this.$route.params.id)
          .collection("messages")

        const newMessage = {
          text: this.inputMessage,
          //owner:
          timestamp: firebase.firestore.FieldValue.serverTimestamp(),
        }

        quary
          .add(newMessage)
          .catch(function(error) {
            console.error("Error writing new message to database", error)
          })
          .then(() => {
            this.inputMessage = ""
          })
      }
    },

    sendImage() {
      const file = this.$refs.inputFile.files[0]
      const quary = firebase
        .firestore()
        .collection("rooms")
        .doc(this.$route.params.id)
        .collection("messages")
      const strageRef = firebase
        .storage()
        .ref()
        .child("rooms/" + this.$route.params.id + "/messages")

      strageRef.put(file).then((fileSnapshote) =>
        fileSnapshote.ref.getDownloadURL().then(function(url) {
          quary.add({
            imageURL: url,
            timestamp: firebase.firestore.FieldValue.serverTimestamp(),
          })
        })
      )
    },

    // sendImage(file) {
    //   const quary = firebase
    //     .firestore()
    //     .collection("rooms")
    //     .doc(this.$route.params.id)
    //     .collection("messages")
    //   quary
    //     .add({
    //       timestamp: firebase.firestore.FieldValue.serverTimestamp(),
    //     })
    //     .then(function(messageRef) {
    //       const filePath =
    //         firebase.auth().currentUser.uid +
    //         "/" +
    //         messageRef.id +
    //         "/" +
    //         file.name

    //       return firebase
    //         .storage()
    //         .ref(filePath)
    //         .put(file)
    //         .then(function(fileSnapshot) {
    //           //return fileSnapshote.ref.getDownloadURL().then((url) => {
    //           fileSnapshot.ref.getDownloadURL().then((url) => {
    //             //return messageRef.update({
    //             messageRef.update({
    //               imageURL: url,
    //               storageUrl: fileSnapshot.metadata.fullPath,
    //             })
    //           })
    //         })
    //     })
    //     .catch(function(error) {
    //       console.error(
    //         "There was an error uploading a file to Cloud Strage",
    //         error
    //       )
    //     })
    // },
  },
}
</script>

<style>
.room-lists {
  width: 50%;
  position: relative;
  /* display: inline-block; */
  display: flex;
  padding: 2em;
  background: #00ff95;
  border: 1px solid black;
  border-radius: 4px;
  line-height: 1.2em;
}
.item {
  position: relative;
  display: flex;
  align-items: flex-end;
  margin-bottom: 0.8em;
}
.item-message {
  position: relative;
  display: inline-block;
  padding: 0.8em;
  background: #deefe8;
  border-radius: 4px;
  line-height: 1.2em;
}
.item-image {
  width: 50%;
  height: 50%;
}
.form {
  position: fixed;
  display: flex;
  justify-content: center;
  align-items: center;
  bottom: 0;
  height: 80px;
  width: 100%;
  background: #f5f5f5;
}
</style>
