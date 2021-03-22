<template>
  <div>
    <!-- Room「作成」ボタン -->
    <button @click="doSearchRoom">Search Room</button>
    <!-- Room「検索」ボタン -->
    <button @click="doCreateNewRoom">create New Room</button>

    <!-- Roomリスト検索部分 -->
    <div v-if="orSearchRoom">
      <div class="search-room-face">
        <p>
          Keyword <br />
          <select name="keyward" v-model="keyward">
            <option value="" selected>選択してください</option>
            <option value="スガノミクス">スガノミクス</option>
            <option value="アベノミクス">アベノミクス</option>
          </select>
        </p>
        <p>
          <button @click="searchRoom">search</button>
          <button @click="cancelSearchRoom">cancel</button>
        </p>
      </div>
      <!-- 検索結果の表示部分 -->
      <div>
        <div class="room-list" v-for="room in rooms" :key="room.id">
          <a
            v-if="room.about"
            class="room room-title"
            @click="toChatRoom(room.id, room.title)"
          >
            {{ room.title }}
            {{ room.about }}
            {{ room.keyward }}
          </a>
          <a
            v-else
            class="room room-title"
            @click="toChatRoom(room.id, room.title)"
          >
            {{ room.title }}
          </a>
        </div>
      </div>
    </div>
    <div v-else></div>

    <!-- Room作成部分 -->
    <div v-if="orCreateNewRoom">
      <div class="create-room-face">
        <div>Create New Room</div>
        <p>
          Title <br />
          <input type="text" v-model="newRoomTitle" />
        </p>
        <p>
          About <br />
          <textarea v-model="newRoomAbout" cols="30" rows="10"></textarea>
        </p>
        <p>
          Keyword <br />
          <select name="keyward" v-model="keyward">
            <option value="" selected>選択してください</option>
            <option value="スガノミクス">スガノミクス</option>
            <option value="アベノミクス">アベノミクス</option>
          </select>
        </p>
        <p>
          <button @click="createNewRoom">create</button>
          <button @click="cancelCreateNewRoom">cancel</button>
        </p>
      </div>
    </div>

    <!-- Roomリスト表示部分 -->
    <div v-if="!orSearchRoom">
      <div class="room-list" v-for="room in rooms" :key="room.id">
        <!-- <a
          v-if="room.about"
          class="room room-title"
          @click="toChatRoom(room.id, room.title)"
        > -->
        <a class="room room-title" @click="toChatRoom(room.id, room.title)">
          {{ room.title }}
          <!-- {{ room.about }}
          {{ room.keyward }} -->
        </a>
        <a class="room-reference">
          about <br />
          {{ room.about }} <br />
          keward <br />
          {{ room.keyward }} <br />
        </a>
        <!-- <a
          v-else
          class="room room-title"
          @click="toChatRoom(room.id, room.title)"
        >
          {{ room.title }}
        </a> -->
      </div>
    </div>
  </div>
</template>

<script>
import firebase from "firebase"

export default {
  data() {
    return {
      orSearchRoom: false,
      orCreateNewRoom: false,
      newRoomTitle: "",
      newRoomAbout: "",
      keyward: "",

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
    toChatRoom(roomID, roomTitle) {
      this.$router.push({
        name: "ChatRoom",
        // params: { id: roomID, title: this.room.title, about: this.room.about },
        params: { id: roomID, title: roomTitle },
      })
    },

    //ボタンを押したらRoom検索画面が表示される(ture:表示、false:非表示)
    doSearchRoom() {
      if (this.orSearchRoom == false) {
        this.orSearchRoom = true
      } else {
        this.orSearchRoom = false
      }
    },
    //Room検索結果の表示（キーワード検索）
    searchRoom() {
      const quary = firebase.firestore().collection("rooms")
      const valuetKeyward = this.keyward
      this.rooms.length = 0

      // 「選択してください」で検索を実行するとタイムスタンプ順で「全て」表示
      if (this.keyward != "") {
        quary
          .where("keyward", "==", valuetKeyward)
          .get()
          .then((snapshot) => {
            snapshot.forEach((doc) => {
              this.rooms.push({
                id: doc.id,
                ...doc.data(),
              })
            })
          })
      }
      // 「キーワード指定」で検索した時の処理
      else {
        quary
          .orderBy("timestamp")
          .get()
          .then((snapshot) => {
            snapshot.forEach((doc) => {
              this.rooms.push({
                id: doc.id,
                ...doc.data(),
              })
            })
          })
      }
    },
    //検索を中止
    cancelSearchRoom() {
      this.orSearchRoom = false
      this.keyward = ""
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
    //FireStoreに新しく作成したRoomの情報を送る
    createNewRoom() {
      if (this.newRoomTitle.length) {
        const quary = firebase.firestore().collection("rooms")
        const valuetKeyward = this.keyward
        const newRoom = {
          title: this.newRoomTitle,
          about: this.newRoomAbout,
          keyward: valuetKeyward,
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
            this.keyward = ""
            this.orCreateNewRoom = false
          })
      }
    },
    //Room作成の中止
    cancelCreateNewRoom() {
      this.newRoomTitle = ""
      this.newRoomAbout = ""
      this.keyward = ""
      this.orCreateNewRoom = false
    },
  },
}
</script>

<style scoped>
.search-room-face {
  width: 50%;
  background-color: blue;
}
.create-room-face {
  width: 50%;
  background-color: orange;
}
.fice-about {
  width: 75%;
  /* line-height: 1.2 * 3 em; */
  height: 100px;
}
.room-list {
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
  /* background: #00ff95; */
  background-color: #ffffff;
  border: 3px solid black;
  border-radius: 25px;
  /* line-height: 1.2em; */
}
.room:hover {
  background-color: #a8a8a8;
}
.room-reference {
  display: none;
}
.room:hover + .room-reference {
  display: block;
}
</style>
