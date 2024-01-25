<template>
  <div class="headerContainer">
    <!-- Burger icon -->
    <img src="../images/burger_smm.png" class="burger-icon" @click="toggleMenu" />
    <div class="headerTitle">{{ pageTitle }}</div>
    <!-- Menu -->
    <div class="menu" :class="{ 'menu-open': isMenuOpen }">
      <!-- Close icon -->
      <img src="../images/cross.png" class="close-icon" @click="toggleMenu" /> 

      <!-- Menu items -->
      <div class="link-title">
        GESTIONE CLIENTI
      </div>
      <div class="linksContainer">
        <RouterLink :to="{ name: 'user-stats', params: { userId: id } }">
          <div class="navLink" :class="{'colored' : page == 'stats'}">
            <img src="../images/stats_smm.png"/>
            <span class="linkName">Statistiche</span>
          </div>
        </RouterLink>
        <RouterLink :to="{ name: 'user-activity', params: { userId: id } }">
          <div class="navLink" :class="{'colored' : page == 'activity'}">
            <img src="../images/activity_smm.png"/>
            <span class="linkName">Attività</span>
          </div>
        </RouterLink>
        <RouterLink :to="{ name: 'user-notifications', params: { userId: id } }">
          <div class="navLink" :class="{'colored' : page == 'notifications'}">
            <img src="../images/notification_smm.png"/>
            <span class="linkName">Notifiche</span>
          </div>
        </RouterLink>
        <RouterLink :to="{ name: 'user-buyChars', params: { userId: id } }">
          <div class="navLink" :class="{'colored' : page == 'buyChar'}">
            <img src="../images/add_smm.png"/>
            <span class="linkName">Acquista caratteri</span>
          </div>
        </RouterLink>
        <RouterLink :to="{ name: 'user-newSqueal', params: { userId: id } }">
          <div class="navLink" :class="{'colored' : page == 'newSqueal'}">
            <img src="../images/feather_smm.png"/>
            <span class="linkName">Posta squeal</span>
          </div>
        </RouterLink>
      </div>
      <div class="link-title">
        GESTIONE PERSONALE
      </div>
      <div class="linksContainer">
        <RouterLink to="/profile">
          <div class="navLink" :class="{'colored' : page == 'smmProfile'}">
            <img src="../images/customer_smm.png"/>
            <span class="linkName">Profilo SMM</span>
          </div>
        </RouterLink>
        <RouterLink to="/smmNotifications">
          <div class="navLink" :class="{'colored' : page == 'smmNotifications'}">
            <img src="../images/notification_smm.png"/>
            <span class="linkName">Notifiche SMM</span>
          </div>
        </RouterLink>
        <RouterLink to="/smmReviews">
          <div class="navLink" :class="{'colored' : page == 'smmReviews'}">
            <img src="../images/review_smm.png"/>
            <span class="linkName">Review SMM</span>
          </div>
        </RouterLink>
      </div>
      <div class="buttonContainer">
        <button class="fullB" @click="router.push('/home')">
          Scegli cliente 
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import { useRouter } from 'vue-router';
export default {
  props: ['pathId', "page", "pageTitle"],
  data() {
    const router = useRouter();
    return {
      isMenuOpen: false,
      id: this.pathId,
      page: this.page,
      pageTitle: this.pageTitle,
      router
    };
  },
  methods: {
    toggleMenu() {
      this.isMenuOpen = !this.isMenuOpen;
    },
  },
};
</script>

<style scoped>
.headerContainer {
  background-color: #1e2229;
  color: white;
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  padding: 6px 10px;
  box-sizing: border-box;
  display: none;
  align-items: center;
  z-index: 100;
}

.burger-icon {
  cursor: pointer;
  width: 25px;
  height: 25px;
  margin-right: 8px;
}

.menu {
  position: fixed;
  top: 0;
  left: -75%; /* Initially off-screen */
  height: 100%;
  width: 75%;
  background-color: #1e2229;
  color: white;
  overflow-x: hidden;
  transition: 0.5s; /* Add a smooth transition effect */
  z-index: 100;
  padding-top: 15px;
}

.menu-open {
  left: 0; /* Slide in from the left when menu is open */
}

.close-icon {
  cursor: pointer;
  width: 25px;
  height: 25px;
  margin-bottom: 20px;
  margin-left: 10px;
}

.navLink{
  display: flex;
  align-items: center;
  font-size: 20px;
  padding-left: 20px;
}

.linksContainer a{
  width: 100%;
}

.navLink:hover{
  background: #ff3385bb;
}

.colored{
  background: #ff3385bb;
}

.headerTitle{
  font-weight: 600;
  font-size: 20px;
  background: linear-gradient(to right, #ff00ff, #ff3385); /* Adjust the colors as needed */
  -webkit-background-clip: text;
  color: transparent;
}

.navLink img{
  width: 25px;
  height: 25px;
  margin-right: 10px;
}

.linksContainer {
  display: flex;
  flex-direction: column;
  color: white;
  font-size: 18px;
  align-items: flex-start;
  margin-bottom: 30px;
}

.buttonContainer{
  width: 100%;
  display: flex;
  justify-content: center;
}
.fullB{
  background: #ff3385;
  color: #1e2229;
  border: 1px solid #ff3385;
}

.fullB:hover{
  cursor: pointer;
  color: #ff3385;
  background-color: #1e2229;
  transition: all 0.2s ease-in-out;
}

@media(max-width:576px){
  .headerContainer{
    display: flex;
  }
}
</style>

