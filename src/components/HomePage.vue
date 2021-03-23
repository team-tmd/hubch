<template>
  <div class="main-field">
    <!-- Room「検索」ボタン -->
    <button @click="doSearchRoom">Search Room</button>
    <!-- Room「作成」ボタン -->
    <button @click="doCreateNewRoom">create New Room</button>

    <!-- Roomリスト検索部分 -->
    <div v-if="orSearchRoom">
      <div class="search-room-face">
        <p>
          Keyword <br />
          <select name="keyward" v-model="keyward">
            <option value="" selected>指定なし</option>
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
          <a class="room room-title" @click="toChatRoom(room.id, room.title)">
            {{ room.title }}
          </a>
          <a class="room-reference">
            about <br />
            {{ room.about }} <br />
            keward <br />
            {{ room.keyward }} <br />
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
        </a>
        <a class="room-reference">
          about <br />
          {{ room.about }} <br />
          keward <br />
          {{ room.keyward }} <br />
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
      this.orCreateNewRoom = false
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
      this.orSearchRoom = false
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
.main-field {
  width: 100%;
  height: 2000px;
  background-color: rgb(50, 50, 50);
}
.search-room-face {
  width: 50%;
  background-color: blue;
}
.create-room-face {
  width: 50%;
  border-radius: 50px;
  filter: brightness(120%);
  background-color: hsl(32, 100%, 50%);
  /* box-shadow: inset 2px -5px 40px 30px hsl(34, 98%, 34%); */
  /* box-shadow: 0px 10px 25px 1px hsl(34, 98%, 34%); */
  box-shadow: 0px 10px 25px 10px hsl(0, 0%, 0%);
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
  width: 100%;
  height: 100px;
  display: inline-block;
  padding: 0.5em 1em;
  text-decoration: none;
  border-radius: 4px;
  color: #ffffff;
  background-image: linear-gradient(45deg, #ffc107 0%, #ff8b5f 100%);
  box-shadow: 0px 2px 2px rgba(0, 0, 0, 0.29);
  border-bottom: solid 3px #c58668;
}
.room:active {
  -webkit-transform: translateY(4px);
  transform: translateY(4px);
  box-shadow: 0px 0px 1px rgba(0, 0, 0, 0.2);
  border-bottom: none;
}
.room:hover {
  font-weight: bold;
}

/* .room-reference { */
/* position: absolute; */
/* display: none; */
/* background: #ffffff; */
/* border: 1px solid #020203; */
/* border-radius: 0.4em; */
/* } */

/* .room-reference:after { */
/* content: ""; */
/* position: absolute; */
/* top: 0; */
/* left: 50%; */
/* width: 0; */
/* height: 0; */
/* border: 0.625em solid transparent; */
/* border: 1px solid #020203; */
/* border-bottom-color: #ffffff; */
/* border-top: 0; */
/* border-left: 0; */
/* margin-left: -0.312em; */
/* margin-top: -0.625em; */
/* } */

.room-reference {
  display: none;
  position: relative;
  background: #ff9408;
  border: 2px solid #a16b00;
}
.room-reference:after,
.room-reference:before {
  bottom: 100%;
  left: 50%;
  border: solid transparent;
  content: "";
  height: 0;
  width: 0;
  position: absolute;
  pointer-events: none;
}

.room-reference:after {
  border-color: rgba(255, 148, 8, 0);
  border-bottom-color: #ff9408;
  border-width: 30px;
  margin-left: -30px;
}
.room-reference:before {
  border-color: rgba(161, 107, 0, 0);
  border-bottom-color: #a16b00;
  border-width: 33px;
  margin-left: -33px;
}

.room:hover + .room-reference {
  position: absolute;
  display: block;
}
</style>
