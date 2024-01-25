<template>
  <div class="home-container">
    <h1 class="title">Scegli il cliente da gestire</h1>
    <div class="users-container">
      <div v-if="loadingClients">
        <div class="loadingContainer">
          <BounceLoader :loading="loadingClients" :color="loadingColor" :size="loadingSize"/>
        </div>
      </div>
        <div v-if="clients.length > 0 && !loadingClients" v-for="user in clients" :key="user.id" class="user-card">
          <div class="profile-border">
            <img :src="user.profileImage" alt="Profile Image" class="profile-image" />
          </div>
          <div class="user-info">
            <div class="name-row">
              <span class="name">{{ user.nome }} {{ user.cognome }}</span>
            </div>
            <span class="username">@{{ user.username }}<br/></span>
            <span class="squeals">#Squeals: {{ user.squeals && user.squeals.length }}</span>
          </div>
          <div class="button-container">
            <MainButton :onClick="() => goToClient(user._id)" :buttonText="handleText" :active=true />
          </div>
        </div>
      </div>
      <div class="buttonContainer">
        <MainButton :active="true" :buttonText="goProfile" :onClick="() => goToPorfile()" />
      </div>
  </div>
</template>

<script setup>
import { computed, ref, watch, onBeforeMount } from 'vue';
import { useQuery } from '@vue/apollo-composable';
import { GET_CLIENTS } from '../graphql/queries'; // Adjust the path based on your project structure
import MainButton from "../components/MainButton.vue"
import { useRouter } from 'vue-router';
import {BounceLoader} from "vue3-spinner"

    const { loading : loadingClients, result : resultClients, refetch : refetchClients } = useQuery(GET_CLIENTS);
    const router = useRouter();
    const clients = ref([]);

    const fetchData = async () => {
      await refetchClients();
      clients.value = resultClients.value.getClients;
    };

    onBeforeMount( () => {
      fetchData();
    })

    const handleText = "Gestisci";

    const goToClient = (userId) => {
      router.push(`/${userId}/stats`);
    }
    const loadingColor = "#ff3385";
    const loadingSize = "60px";
    const goProfile = "Vai al tuo profilo"

    const goToPorfile = () => {
      router.push('/profile')
    }

</script>

<style scoped>

.loading-container{
    padding-left: 18%;
    margin-top: 10%;
  }
.home-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  padding-bottom: 100px;
}

.title {
  margin-top: 30px;
  background: linear-gradient(to right, #ff00ff, #ff3385); /* Adjust the colors as needed */
  -webkit-background-clip: text;
  color: transparent;
  font-size: 40px;
  font-weight: 600;
  margin-bottom: 50px;
  text-align: center;
}

.button-container{
  width: 60%;
  font-size: 16px;
  position: absolute;
  bottom: 30px;
}


.users-container {
  display: flex;
  flex-wrap: wrap;
  width: 90%;
  justify-content: center;
}

.user-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: 10px;
  padding: 10px 40px 80px 40px;
  border-radius: 10px;
  box-shadow: 0px 0px 2px 2px lightgray;
  max-width: 230px;
  position: relative;
}

.user-card:hover{
  box-shadow: 0px 0px 2px 2px #ff00ff88;
}

.profile-image {
  width: 150px;
  height: 150px;
  object-fit: cover;
  border-radius: 50%;
  border: 2px solid white;
}
.profile-border {
  margin-top: 10px;
  border-radius: 50%;
  background: linear-gradient(to right, #ff00ff, #ff3385); /* Adjust the colors as needed */
  display: flex;
  padding: 2px;
  margin-bottom: 10px;
}

.user-info {
  text-align: center;
  display: flex;
  flex-direction: column;
}

.name-row {
  display: flex;
  justify-content: center;
  margin-bottom: 10px;
  font-weight: bold;
  font-size: 20px;
}

.name {
  display: inline;
  width: 210px
}

.username {
  color: #666;
  font-size: 18px;
  margin-bottom: 10px;
  display: inline;
  width: 210px
}

.squeals {
  color: #888;
  font-size: 18px;
  margin-bottom: 60px;
}

.buttonContainer{
  margin-top: 20px;
  width: 15%;
}

@media(max-width: 576px){
  .title{
    font-size: 25px;
    margin-top: 20px;
  }
  .buttonContainer{
    width: 50%;
  }
}
</style>
