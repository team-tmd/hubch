<template>
  <div>
    <!-- New Room作成部分 -->
    <form action="" @submit.prevent="createNewRoom">
      <textarea
        v-model="newRoom_input"
        @keydown.enter.exact.prevent="createNewRoom"
      ></textarea>
      <button type="submit">Create New Room</button>
    </form>
    <div>
      <div v-for="room in rooms" :key="room.id">
        <a @click="toChatRoom(room.id)" class="room-lists">{{ room.title }}</a>
      </div>
    </div>
  </div>
</template>

<script>
// firebase モジュール
import firebase from "firebase"
// import chatRoom from "chatRoom"

export default {
  data() {
    return {
      user: "",
      newRoom_input: "",
      rooms: [],
      users: [],
    }
  },

  created() {
    ///Roomリストの表示
    firebase
      .firestore()
      .collection("rooms")
      .orderBy("timestamp")
      .limit(15)
      .onSnapshot((snapshot) => {
        this.rooms.length = 0
        snapshot.docs.forEach((doc) => {
          this.rooms.push({
            id: doc.id,
            ...doc.data(),
          })
        })
      })
  },
  methods: {
    toChatRoom(roomID) {
      console.log(roomID)
      this.$router.push({
        name: "ChatRoom",
        params: { id: roomID },
      })
    },

    createNewRoom() {
      if (this.newRoom_input.length) {
        const quary = firebase.firestore().collection("rooms")
        const newRoom = {
          title: this.newRoom_input,
          //owner:
          timestamp: firebase.firestore.FieldValue.serverTimestamp(),
        }
        quary
          .add(newRoom)
          .catch(function(error) {
            console.error("Error writing new message to database", error)
          })
          .then(() => {
            this.newRoom_input = ""
          })
      }
    },
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

.room-lists:hover {
  background-color: #007c48;
}
</style>
