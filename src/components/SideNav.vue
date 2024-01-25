<template>
  <div class="container">
    <div class="leftNavbar">
      <!-- Options in the left navbar -->
      <div class="link-title">
        GESTIONE CLIENTI
      </div>
      <div class="linksContainer">
        <RouterLink :to="{ name: 'user-stats', params: { userId: id } }">
          <div class="navLink" :class="{'colored': page == 'stats'}">
            <img src="../images/stats_smm.png"/>
            <span class="linkName">Statistiche</span>
          </div>
        </RouterLink>
        <RouterLink :to="{ name: 'user-activity', params: { userId: id } }">
          <div class="navLink" :class="{'colored': page == 'activity'}">
            <img src="../images/activity_smm.png"/>
            <span class="linkName">Attività</span>
          </div>
        </RouterLink>
        <RouterLink :to="{ name: 'user-notifications', params: { userId: id } }">
          <div class="navLink" :class="{'colored': page == 'notifications'}">
            <img src="../images/notification_smm.png"/>
            <span class="linkName">Notifiche</span>
          </div>
        </RouterLink>
        <RouterLink :to="{ name: 'user-buyChars', params: { userId: id } }">
          <div class="navLink" :class="{'colored': page == 'buyChar'}">
            <img src="../images/add_smm.png"/>
            <span class="linkName">Acquista caratteri</span>
          </div>
        </RouterLink>
        <RouterLink :to="{ name: 'user-newSqueal', params: { userId: id } }">
          <div class="navLink" :class="{'colored': page == 'newSqueal'}">
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
          <div class="navLink" :class="{'colored': page == 'smmProfile'}">
            <img src="../images/customer_smm.png"/>
            <span class="linkName">Profilo SMM</span>
          </div>
        </RouterLink>
        <RouterLink to="/smmNotifications">
          <div class="navLink" :class="{'colored': page == 'smmNotifications'}">
            <img src="../images/notification_smm.png"/>
            <span class="linkName">Notifiche SMM</span>
          </div>
        </RouterLink>
        <RouterLink to="/smmReviews">
          <div class="navLink" :class="{'colored': page == 'smmReviews'}">
            <img src="../images/review_smm.png"/>
            <span class="linkName">Review SMM</span>
          </div>
        </RouterLink>
      </div>
      <div class="buttonContainer">
        <RouterLink to="/home">
          <button class="fullB">
            Scegli cliente
          </button>
        </RouterLink>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: ['pathId', 'page'],
  data(){
    return{
      id: this.pathId,
      page: this.page
    }
  }
};
</script>

<style>
.leftNavbar {
  position: fixed;
  background-color: #1e2229;
  height: 100%;
  width: 15%;
  padding: 3% 0px 0px 0px;
  box-shadow: 2px 0 5px rgba(0, 0, 0, 0.1);
  flex-direction: column;
  left: 0;
  top: 0;
}

.link-title{
  color: white;
  font-weight: 600;
  margin-bottom: 10px;
  font-size: 18px;
  padding-left: 10px;
}

.leftNavbar a {
  display: inline-block;
  color: white;
  text-decoration: none; /* Remove underline */
  font-weight: 400;
  width: 100%;
}

.navLink{
  display: flex;
  align-items: center;
  padding: 10px 15px;
  width: 100%;
}

.navLink:hover{
  background: #ff3385bb;
}

.colored{
  background: #ff3385bb;
}

.navLink img{
  width: 28px;
  height: 28px;
  margin-right: 10px;
}

.linksContainer {
  display: flex;
  flex-direction: column;
  color: white;
  font-size: 20px;
  align-items: flex-start;
  margin-bottom: 40px;
  width: 100%;
}


.content {
  padding: 20px;
  margin-left: 200px;
}

.buttonContainer{
  width:100%;
  display: flex;
  justify-content: center;
}

.buttonContainer a{
  display: flex;
  width: 100%;
  justify-content: center;
}

.fullB{
  font-size: 18px;
  color: #1e2229;
  background-color: #ff3385;
  border: 1px solid #ff3385;
  padding: 5px 15px;
  border-radius: 10px;
}

.fullB:hover{
  color: #ff3385;
  background-color: transparent;
  transition: all 0.2s ease-in-out;
}

@media(max-width:576px){
  .leftNavbar{
    display: none;
  }
}
</style>
