<template>
      <div class="page-container">
        <SideNav :pathId="0" page="smmNotifications"/>
        <Header :pathId="0" page="smmNotifications" pageTitle="NOTIFICHE SMM"/>
        <div v-if="loadingNotifications" class="loading-container">
          <div class="loadingContainer">
            <BounceLoader :loading="loadingNotifications" :color="loadingColor" :size="loadingSize"/>
          </div>
        </div>      
        <div v-if="!loadingNotifications" class="content-container">
          <h1 class="title">Notifiche SMM</h1>
          <div v-if="relationalNotifications.length > 0 || interactiveNotifications.length > 0" class="filters">
            <div class="filtersContainer">
              <div :class="{'filter': filter !== 'Relazioni', 'selected': filter == 'Relazioni'}" @click="() => setFilter('Relazioni')">
                Relazioni 
              </div>
              <div :class="{'filter': filter !== 'Interazioni', 'selected': filter == 'Interazioni'}" @click="() => setFilter('Interazioni')">
                Interazioni
              </div>
            </div>
          </div>
          <div v-if="relationalNotifications.length > 0 || interactiveNotifications.length > 0" class="centeringContainer">
            <div class="notificationsContainer">
              <div v-if="selectedNotifications.length > 0" v-for="notification in selectedNotifications" :key="notification._id" class="singleNotification">
                <img v-if="notification.senderType == 'user'" src="../images/user.png" />
                <img v-if="notification.senderType !== 'user'" src="../images/channel.jpeg" />
                <div class="notificationText">
                  <span>{{notification.notificationText}}</span>
                  <span class="dateText">{{ formatTimeDifference(new Date(notification.createdAt)) }}</span>
                </div>
                <div v-if="notification.notificationType == 'SMM_REQUEST' && notification.active" class="friendReqContainer">
                  <button class="fullButton" @click="() => accSmmReq(notification._id)">Accetta</button>
                  <button class="emptyButton" @click="() => refSmmReq(notification._id)">Rifiuta</button>
                </div>
              </div>
            </div>
          </div>
          <div v-if="relationalNotifications.length == 0 && interactiveNotifications.length == 0" class="noInfoMessage">
            <img src="../images/alertIcon.png" alt="Nessuna notifica"/>
            <div class="messageNoContainer">
              Non hai notifiche da visualizzare
            </div>
          </div>
        </div>      
      </div>
      <div v-if="showCorrect">
        <CorrectMessage :correctText="correctText" />
      </div>
      <div v-if="showError">
        <ErrorMessage :errorText="errorText" />
      </div>
</template>

<script setup>
import SideNav from '../components/SideNav.vue'
import { ref, watch, onMounted } from 'vue';
import { useQuery, useMutation } from '@vue/apollo-composable';
import { GET_SMM_NOTIFICATIONS } from '../graphql/queries';
import { ACCEPT_SMM, REFUSE_SMM} from '../graphql/mutations';
import { useRoute } from "vue-router";
import { formatTimeDifference } from "../utils/utils";
import { BounceLoader } from "vue3-spinner";
import ErrorMessage from '../components/ErrorMessage.vue';
import CorrectMessage from '../components/CorrectMessage.vue';
import Header from '../components/header.vue';


const { loading: loadingNotifications, result: resultQuery, refetch: refetchQuery } = useQuery(GET_SMM_NOTIFICATIONS);
const { mutate: acceptSmm, result: resultAccSmm, onDone: onDoneAccept, onError: onErrorAccept } = useMutation(ACCEPT_SMM);
const { mutate: refuseSmm, result: resultRefSmm, onDone: onDoneRefuse, onError: onErrorRefuse  } = useMutation(REFUSE_SMM);

const showCorrect = ref(false);
const showError = ref(false);

const correctText = ref('');
const errorText = ref('');

onDoneAccept( () => {
  fetchData();
  correctText.value = "Utente aggiunto ai clienti!"
  showCorrect.value = true;
  setTimeout(() => {
    showCorrect.value = false;
  }, 1500)
})

onDoneRefuse( () => {
  fetchData();
  correctText.value = "Utente non aggiunto ai clienti!"
  showCorrect.value = true;
  setTimeout(() => {
    showCorrect.value = false;
  }, 1500)
})

onErrorAccept( () => {
  errorText.value = "Errore nell'accettare la richiesta."
  showError.value = true;
  setTimeout(() => {
    showError.value = false;
  }, 1500)
})

onErrorRefuse( () => {
  errorText.value = "Errore nel rifiutare la richiesta"
  showError.value = true;
  setTimeout(() => {
    showError.value = false;
  }, 1500)
})

const selectedNotifications = ref([]);
const relationalNotifications = ref([]);
const interactiveNotifications = ref([]);
const filter = ref('Relazioni');

const fetchData = async () => {
  await refetchQuery();
  relationalNotifications.value = resultQuery.value.getNotifications.relationalNotifications;
  interactiveNotifications.value = resultQuery.value.getNotifications.interactiveNotifications;
  selectedNotifications.value = relationalNotifications.value;
};

// Fetch data on component mount
onMounted(() => {
  fetchData();
});
const setFilter = filtername => {
  if (filtername != filter.value) filter.value = filtername;
};

watch(filter, value => {
  if (value == 'Relazioni') selectedNotifications.value = relationalNotifications.value;
  else selectedNotifications.value = interactiveNotifications.value;
});

const loadingColor = "#ff3385";
const loadingSize = "60px";

const accSmmReq = (notId) => acceptSmm({ notificationId: notId});
const refSmmReq = (notId) => refuseSmm({ notificationId: notId});
</script>



<style scoped>
  .content-container{
    padding-left: 18%;
    padding-bottom: 100px;
    display: flex;
    width: 100%;
    flex-direction: column;
    align-items: center;
  }
  .loading-container{
    padding-left: 18%;
    margin-top: 10%;
  }

  .loadingContainer{
    width: 100%;
    display: flex;
    justify-content: center;
  }

  .title {
  margin-top: 30px;
  background: linear-gradient(to right, #ff00ff, #ff3385); /* Adjust the colors as needed */
  -webkit-background-clip: text;
  color: transparent;
  font-size: 40px;
  font-weight: 600;
  margin-bottom: 20px;
  text-align: center;
  width: 100%;
}

.centeringContainer{
  width: 100%;
  display: flex;
  justify-content: center;
}
.notificationsContainer {
  width: 50%;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}

.singleNotification{
  display: flex;
  width: 100%;
  margin: 10px 0px 15px 40px;
  align-items: flex-start;
}
.singleNotification img{
  width: 30px;
  height: 30px;
  margin-right: 20px;
}

.notificationText{
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  line-height: 1.1;
  font-size: 1.2em;
}

.notificationText .dateText{
  color: #949494;
  font-size: 1.1em;
}

.friendReqContainer{
  padding: 0px 5px;
  display: flex;
  align-items: center;
  justify-content: space-around;
  margin-left: 10px;
}

.fullButton{
  font-size: 18px;
  color: white;
  background-color: #ff3385;
  border-radius: 10px;
  padding: 3px 9px;
  border: 2px solid #ff3385;
  margin: 0px 5px;
}

.fullButton:hover{
  color: #ff3385;
  background-color: white;
  transition: all 0.2s ease-in-out;
}

.emptyButton{
  font-size: 18px;
  color: #ff3385;
  background-color: white;
  border-radius: 10px;
  padding: 3px 9px;
  border: 2px solid #ff3385;
}

.emptyButton:hover{
  color: white;
  background-color: #ff3385;
  transition: all 0.2s ease-in-out;
}

.filters{
  width: 55%;
  margin-bottom: 10px;
}

.filtersContainer{
  display: flex;
  flex-wrap: wrap;
  width: 100%;
  justify-content: center;
  align-items: center;
}


.filter{
  font-size: 20px;
  padding: 5px 20px;
  border-radius: 10px;
  border: 2px solid black;
  margin: 5px 80px;
}

.selected{
  font-size: 20px;
  padding: 5px 20px;
  border-radius: 10px;
  background: #ff3385;
  border: 2px solid #ff3385;
  color: white;
  margin: 5px 80px;
}

.filter:hover{
  cursor: pointer;
  border: 2px solid #ff3385;
  color: #ff3385;
  transition: all 0.2s ease-in-out;

}

.selected:hover{
  cursor: pointer;
}

@media(max-width: 576px){
  .content-container{
    padding-inline: 10px;
    margin-top: 60px;
  }

  .loading-container{
    padding-inline: 10px;
  }

  .title{
    display: none;
  }

  .notificationsContainer{
    width: 85%;
  }
  .singleNotification{
    margin: 5px 0px 10px 10px;
  }

  .filters{
    width: 90%;
  }

  .filter, .selected{
    margin: 5px 20px;
    font-size: 18px;
  }

  .filtersContainer{
    flex-wrap: nowrap;
    margin-bottom: 15px;
  }

}
</style>
