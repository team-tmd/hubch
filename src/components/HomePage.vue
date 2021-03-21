<template>
  <div>
    <!-- New Room作成部分 -->
    <button @click="doCreateNewRoom">create New Room</button>
    <div v-if="orCreateNewRoom">
      true
      <input type="text" v-model="newRoomTitle" />
      <input type="text" v-model="newRoomAbout" />
      <button @click="createNewRoom">create</button>
      <button @click="cancelCreateNewRoom">cancel</button>
    </div>
    <div v-else>false</div>

    <div>
      <div class="roomlist" v-for="room in rooms" :key="room.id">
        <a
          v-if="room.about"
          class="room room-title"
          @click="toChatRoom(room.id)"
        >
          {{ room.title }}
          {{ room.about }}
        </a>
        <a v-else class="room room-title" @click="toChatRoom(room.id)">
          {{ room.title }}
        </a>
      </div>
    </div>
  </div>
</template>

<script>
import firebase from "firebase"

export default {
  data() {
    return {
      orCreateNewRoom: false,
      newRoomTitle: "",
      newRoomAbout: "",

      newRoom_input: "",
      rooms: [],
    }
  },

  created() {
    ///Roomリストの表示（onSnapshotで変化を監視）
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
    // ChatRoom.vueへ"ID, Title, About"をルートで渡す
    toChatRoom(roomID) {
      this.$router.push({
        name: "ChatRoom",
        params: { id: roomID, title: this.room.title, about: this.room.about },
      })
    },
    //ボタンを押したらRoom作成画面が表示される(ture:表示、false:非表示)
    doCreateNewRoom() {
      if (this.orCreateNewRoom == false) {
        this.orCreateNewRoom = true
      } else {
        this.orCreateNewRoom = false
        this.newRoomTitle = ""
        this.newRoomAbout = ""
      }
    },
    //FireStoreに新しいRoomの情報を送る
    createNewRoom() {
      if (this.newRoomTitle.length) {
        const quary = firebase.firestore().collection("rooms")
        const newRoom = {
          title: this.newRoomTitle,
          about: this.newRoomAbout,
          //owner:
          timestamp: firebase.firestore.FieldValue.serverTimestamp(),
        }
        quary
          .add(newRoom)
          .catch(function(error) {
            console.error("Error writing new message to database", error)
          })
          .then(() => {
            this.newRoomTitle = ""
            this.newRoomAbout = ""
            this.orCreateNewRoom = false
          })
      }
    },
    cancelCreateNewRoom() {
      this.orCreateNewRoom = false
      this.newRoomTitle = ""
      this.newRoomAbout = ""
    },
  },
}
</script>

<style>
.roomlist {
  float: left;
  margin-right: 1%;
  margin-bottom: 1%;
  width: 24%;
}
.room {
  /* float: left; */
  display: flex;
  width: 100%;
  height: 100px;
  /* margin: 0 1 0 0; */
  /* position: relative; */
  /* display: inline-block; */
  /* padding: 2em; */
  background: #00ff95;
  border: 5px solid black;
  border-radius: 25px;
  /* line-height: 1.2em; */
}
.room:hover {
  background-color: #007c48;
}
</style>
