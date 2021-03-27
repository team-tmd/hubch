<template>
  <div class="main-field">
    <!-- Roomリスト検索部分 -->
    <div v-if="orSearchRoom">
      <div class="search-room-face" style="z-index:10000">
        <div class="option-title">Search Room</div>
        <div class="option-content">
          <p>
            Keyword <br />
            <select name="keyward" v-model="keyward">
              <option value="" selected>指定なし</option>
              <option value="スガノミクス">スガノミクス</option>
              <option value="アベノミクス">アベノミクス</option>
            </select>
          </p>
        </div>
        <div class="option-button">
          <p>
            <button class="do-button" @click="searchRoom">
              search
            </button>
            <button class="do-button" @click="cancelSearchRoom">
              cancel
            </button>
          </p>
        </div>
      </div>
    </div>
    <div v-else></div>

    <!-- Room作成部分 -->
    <div v-if="orCreateNewRoom">
      <div class="create-room-face">
        <div class="option-title">Create New Room</div>
        <div class="option-content">
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
        </div>
        <div class="option-button">
          <p>
            <button class="do-button" @click="createNewRoom">
              create
            </button>
            <button class="do-button" @click="cancelCreateNewRoom">
              cancel
            </button>
          </p>
        </div>
      </div>
    </div>

    <!-- Roomリスト表示部分 -->
    <div class="room-list" v-for="room in rooms" :key="room.id">
      <a class="room room-title" @click="toChatRoom(room.id, room.title)">
        {{ room.title }}
        <!-- <div class="delete-button" @click="deleteRoom">X</div> -->
      </a>
      <div class="room-reference">
        owner <br />
        <div class="owner">
          <img class="room-reference-img" :src="room.ownerImage" alt="" />
          {{ room.owner }}
        </div>
        <br />
        <div class="about">
          about <br />
          {{ room.about }}
        </div>
        <br />
        <div class="keward">
          keward <br />
          {{ room.keyward }}
        </div>
        <br />
      </div>
    </div>
    <!-- </div> -->
    <!-- <div v-else>該当するルームは見つかりませんでした</div> -->

    <footer>
      <!-- Room「検索」ボタン -->
      <button class="search footer-button" @click="doSearchRoom">
        Search Room
      </button>
      <!-- Room「作成」ボタン -->
      <button class="create footer-button" @click="doCreateNewRoom">
        create New Room
      </button>
    </footer>
  </div>
</template>

<script>
import firebase from "firebase"

export default {
  data() {
    return {
      // ログインしているユーザー(自分)の情報
      currentUser: {},

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
    // ログイン状態を識別
    firebase.auth().onAuthStateChanged((user) => {
      this.currentUser = user ? user : {}
    })

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
      const valueKeyward = this.keyward
      this.rooms.length = 0

      // 「キーワード指定」で検索した時の処理
      if (this.keyward != "") {
        quary
          .where("keyward", "==", valueKeyward)
          .get()
          .then((snapshot) => {
            snapshot.forEach((doc) => {
              this.rooms.push({
                id: doc.id,
                ...doc.data(),
              })
            })
          })
        // アクションを起こすことで強制的にラグ(lag)をなくす
        this.rooms.splice()
      }
      // 「指定なし」で検索を実行するとタイムスタンプ順で「全て」表示
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
        let getUserNickname = ""
        let getUserImage = ""

        firebase
          .firestore()
          .collection("users")
          .doc(this.currentUser.uid)
          .get()
          .then((userSnapshot) => {
            getUserNickname = userSnapshot.data().myNickname
            getUserImage = userSnapshot.data().userImage
          })
          .then(() => {
            quary
              .add({
                owner: getUserNickname,
                ownerID: this.currentUser.uid,
                ownerImage: getUserImage,
                title: this.newRoomTitle,
                about: this.newRoomAbout,
                keyward: valuetKeyward,
                timestamp: firebase.firestore.FieldValue.serverTimestamp(),
              })
              .catch(function(error) {
                console.error("Error writing new message to database", error)
              })
              .then(() => {
                this.newRoomTitle = ""
                this.newRoomAbout = ""
                this.keyward = ""
                this.orCreateNewRoom = false
              })
          })
        // .then(() => {
        //   this.toChatRoom(this.room.id, this.room.title)
        // })
      }
    },
    //Room作成の中止
    cancelCreateNewRoom() {
      this.newRoomTitle = ""
      this.newRoomAbout = ""
      this.keyward = ""
      this.orCreateNewRoom = false
    },

    deleteRoom() {
      firebase
        .firestore()
        .collection("rooms")
        .delete.catch((error) => {
          console.error("Error removing document: ", error)
        })
    },
  },
}
</script>

<style scoped>
.main-field {
  min-height: 100vh; /* ←コンテンツの高さの最小値＝ブラウザの高さに指定 */
  position: relative; /* ←相対位置 */
  padding-bottom: 60px; /* ←フッターの高さを指定 */
  box-sizing: border-box;
  background-color: rgb(50, 50, 50);
  /* ↑ヘッダーやフッターを含むすべての要素の高さ＝min-height:100vhになるように指定 */
  background-image: linear-gradient(45deg, #000000 0%, #6e6e6e 100%);
}
.option-title {
  padding-top: 10px;
  text-align: center;
  font-weight: bold;
}
.option-content {
  padding-left: 20px;
}
.option-button {
  text-align: center;
}
.do-button {
  width: 45%;
  border-radius: 20px;
  background-color: hsl(32, 100%, 50%);
  background-image: linear-gradient(45deg, #ffc107 0%, #ff8b5f 100%);
}
.do-button:hover {
  font-weight: bold;
  background-image: linear-gradient(45deg, #6b5000 0%, #633624 100%);
}
.do-button:active {
  -webkit-transform: translateY(4px);
  transform: translateY(4px);
  box-shadow: 0px 0px 1px rgba(0, 0, 0, 0.2);
  border-bottom: none;
}
.do-search:hover {
  background-color: hsl(32, 100%, 19%);
}
.search-room-face {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 50%;
  transform: translate(-50%, -50%);
  z-index: 10000;
  filter: brightness(120%);
  background-color: hsl(32, 100%, 50%);
  background-image: linear-gradient(45deg, #ffc107 0%, #ff8b5f 100%);
  border-bottom: solid 3px #c58668;
  box-shadow: 0px 10px 25px 10px hsl(0, 0%, 0%);
  border-radius: 20px;
}
.create-room-face {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 50%;
  transform: translate(-50%, -50%);
  z-index: 10000;
  filter: brightness(120%);
  background-image: linear-gradient(45deg, #ffc107 0%, #ff8b5f 100%);
  border-bottom: solid 3px #c58668;
  box-shadow: 0px 10px 25px 10px hsl(0, 0%, 0%);
  border-radius: 20px;
}
.fice-about {
  width: 75%;
  height: 100px;
}
.room-list {
  float: left;
  margin-right: 1%;
  margin-top: 1%;
  width: 24%;
}
.room {
  width: 100%;
  height: 100px;
  display: inline-block;
  padding: 0.5em 1em;
  font-size: 20px;
  text-decoration: none;
  border-radius: 4px;
  color: rgb(0, 0, 0);
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

.room-reference {
  display: none;
  position: relative;
  width: 24%;
  color: rgb(255, 94, 0);
  background-image: linear-gradient(45deg, #494949 0%, #000000 100%);
  border: 2px solid rgb(255, 94, 0);
  /* display: flex; */
  flex-direction: column;
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
  /* border-bottom-color: #ff9408; */
  background-image: linear-gradient(45deg, #494949 0%, #000000 100%);
  border-width: 30px;
  margin-left: -30px;
}
.room-reference:before {
  border-color: rgba(161, 107, 0, 0);
  border-bottom-color: rgb(255, 94, 0);
  border-width: 33px;
  margin-left: -33px;
}
.room:hover + .room-reference {
  position: absolute;
  display: block;
}
.owner {
  float: left;
  /* display: flex; */
  justify-content: center;
  align-items: center;
}
.about {
  /* display: flex; */
  float: left;
}
.keyward {
  /* display: flex; */
  float: left;
}
.room-reference-img {
  height: 20px;
  width: 20px;
  border-radius: 50px;
}

.search {
  width: 50%;
}
.create {
  width: 50%;
}
.footer-button {
  height: 50px;
  background: rgb(0, 0, 0);
  border: 2px solid rgb(255, 94, 0);
  color: rgb(255, 94, 0);
}
.footer-button:hover {
  font-weight: bold;
  color: rgb(255, 94, 0);
}
footer {
  position: fixed;
  bottom: 0;
  width: 100%;
  background-color: black;
}
</style>
