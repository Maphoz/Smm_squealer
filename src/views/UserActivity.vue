<template>
  <KeepAlive>
    <div key="user-activity-component">
  <div class="page-container">
      <SideNav page="activity"/>
      <Header page="activity" pageTitle="SQUEALS CLIENTE"/>
      <div v-if="loading" class="loading-container">
        <div class="loadingContainer">
          <BounceLoader :loading="loading" :color="loadingColor" :size="loadingSize"/>
        </div>
      </div>      
      <div v-if="!loading" class="content-container">
        <h1 class="title">Squeals cliente</h1>
        <div class="filters">
          <div class="filterTitle">Filtra squeals</div>
          <div class="filtersContainer">
            <div :class="{'filter': filter !== 'Popolare', 'selected': filter == 'Popolare'}" @click="() => setFilter('Popolare')">
              Popolari 
            </div>
            <div :class="{'filter': filter !== 'Impopolare', 'selected': filter == 'Impopolare'}" @click="() => setFilter('Impopolare')">
              Impopolari
            </div>
            <div :class="{'filter': filter !== 'Controverso', 'selected': filter == 'Controverso'}" @click="() => setFilter('Controverso')">
              Controversi
            </div>
            <div :class="{'filter': filter !== 'Normale', 'selected': filter == 'Normale'}" @click="() => setFilter('Normale')">
              Normali
            </div>
          </div>
        </div>
        <div class="sorting">
          <div class="filterTitle">Ordina squeals</div>
          <div class="sortingContainer">
            <div :class="{'sortOption': sortMethod !== 'dateDown', 'selectedSort': sortMethod == 'dateDown'}" @click="() => setSort('dateDown')">
              Più recenti
            </div>
            <div :class="{'sortOption': sortMethod !== 'dateUp', 'selectedSort': sortMethod == 'dateUp'}" @click="() => setSort('dateUp')">
              Più vecchi
            </div>
            <div :class="{'sortOption': sortMethod !== 'viewsUp', 'selectedSort': sortMethod == 'viewsUp'}" @click="() => setSort('viewsUp')">
              Views(crescente)
            </div>
            <div :class="{'sortOption': sortMethod !== 'viewsDown', 'selectedSort': sortMethod == 'viewsDown'}" @click="() => setSort('viewsDown')">
              Views(decrescente)
            </div>
            <div :class="{'sortOption': sortMethod !== 'commentsUp', 'selectedSort': sortMethod == 'commentsUp'}" @click="() => setSort('commentsUp')">
              Commenti(crescente)
            </div>
            <div :class="{'sortOption': sortMethod !== 'commentsDown', 'selectedSort': sortMethod == 'commentsDown'}" @click="() => setSort('commentsDown')">
              Commenti(decrescente)
            </div>
            <div :class="{'sortOption': sortMethod !== 'reactionsUp', 'selectedSort': sortMethod == 'reactionsUp'}" @click="() => setSort('reactionsUp')">
              Reazioni(crescente)
            </div>
            <div :class="{'sortOption': sortMethod !== 'reactionsDown', 'selectedSort': sortMethod == 'reactionsDown'}" @click="() => setSort('reactionsDown')">
              Reazioni(decrescente)
            </div>
          </div>
        </div>
        <div class="squealsContainer">
          <div v-if="squealsToShow.length > 0" v-for="squeal in squealsToShow" :key="squeal._id" class="singleSqueal">
            <div class="profileRow">
              <img :src="userInfo.profileImage" alt="" class="userImage">
              <div class="squealSender">
                <div class="nameDiv">
                  <div class="div">
                    <span class="name">{{ userInfo.nome }}</span>
                    <span v-if="squeal.channelName" class="tag themeColor">§{{ squeal.channelName }} · </span>
                    <span v-if="!squeal.channelName" class="tag">§{{ userInfo.nome }} {{ userInfo.cognome }} · </span>
                    <span class="date">{{ formatTimeDifference(new Date(squeal.publicationDate)) }}</span>
                    <span v-if="squeal.classification == 'Popolare'" class="classTag Popular">{{ squeal.classification }}</span>
                    <span v-if="squeal.classification == 'Impopolare'" class="classTag Impopular">{{ squeal.classification }}</span>
                    <span v-if="squeal.classification == 'Controverso'" class="classTag Controverse">{{ squeal.classification }}</span>                    
                  </div>
                  <div class="dotContainer" @click="() => openModal(squeal._id)">
                    <img src="../images/addRemove.png" alt="cancella squeal"/>
                  </div>
                </div>
              </div>
            </div>
            <div class="contentContainer">
              <span v-if="squeal.text">{{ squeal.text }}</span>
              <div v-if="squeal.typeOfUpload == 'video'" class="videoContainer">
                <video controls>
                  <source :src="squeal.uploadedFile"/>
                </video>
              </div>
              <div v-if="squeal.typeOfUpload == 'image'" class="squealImageContainer">
                <img :src="squeal.uploadedFile">
              </div>
              <div v-if="squeal.geolocation" class="positionContainer">
                <GMapMap
                :center="{
                  lat: squeal.geolocation.latitude,
                  lng: squeal.geolocation.longitude
                }"
                :zoom="15"
                map-type-id="terrain"
                class="mapNewSqueal"
                :options="{
                  mapTypeControl: false,
                }"
              >
                <GMapMarker
                  :position="{
                    lat: squeal.geolocation.latitude,
                    lng: squeal.geolocation.longitude
                  }"
                  :clickable="true"
                  :draggable="false"
                >
                </GMapMarker>
              </GMapMap>
              </div>
            </div>
            <div class="iconsContainer">
              <div class="iconDiv">
                <img src="../images/positive_theme_2.png" alt="reazioni positive" class="iconImage">
                <span>{{ squeal.reactions.filter(reaction => positiveReactions.includes(reaction.type)).length }}</span>
                <div class="tooltip">Reazioni positive</div>
              </div>
              <div class="iconDiv">
                <img src="../images/negative_theme_2.png" alt="reazioni negative" class="iconImage">
                <span>{{ squeal.reactions.filter(reaction => !positiveReactions.includes(reaction.type)).length }}</span>
                <div class="tooltip">Reazioni negative</div>
              </div>
              <div class="iconDiv">
                <img src="../images/views_theme_2.png" alt="visualizzazioni" class="iconImage">
                <span>{{ squeal.views }}</span>
                <div class="tooltip">Visualizzazioni</div>
              </div>
              <div class="iconDiv">
                <img src="../images/comment_theme_2.png" alt="commenti" class="iconImage">
                <span>{{ squeal.comments.length }}</span>
                <div class="tooltip">Commenti</div>
              </div>
            </div>
          </div>
        </div>
        <TransitionRoot appear :show="isOpen" as="template">
          <Dialog as="div" @close="closeModal" class="relative z-10">
            <TransitionChild
              as="template"
              enter="duration-300 ease-out"
              enter-from="opacity-0"
              enter-to="opacity-100"
              leave="duration-200 ease-in"
              leave-from="opacity-100"
              leave-to="opacity-0"
            >
              <div class="fixed inset-0 bg-b" />
            </TransitionChild>

            <div class="fixed inset-0 overflow-y-auto">
              <div
                class="flex min-h-full items-center justify-center p-4 text-center"
              >
                <TransitionChild
                  as="template"
                  enter="duration-300 ease-out"
                  enter-from="opacity-0 scale-95"
                  enter-to="opacity-100 scale-100"
                  leave="duration-200 ease-in"
                  leave-from="opacity-100 scale-100"
                  leave-to="opacity-0 scale-95"
                >
                  <DialogPanel
                    class="w-full max-w-md transform overflow-hidden rounded-2xl bg-w p-6 text-left align-middle shadow-xl transition-all"
                  >
                    <DialogTitle
                      as="h3"
                      class="text-lg font-medium leading-6 text-gray-900"
                    >
                      Cancella squeal
                    </DialogTitle>
                    <div class="mt-2">
                      <p class="text-sm text-gray-500">
                        Sei sicuro di voler eliminare questo squeal?
                      </p>
                    </div>
                    <div class="mt-4 flex justify-center space-x-4">
                      <button
                          type="button"
                          className="inline-flex justify-center rounded-md border border-transparent fullB px-4 py-2 text-sm font-medium text-black-900  focus:outline-none focus-visible:ring-2 focus-visible:ring-green-500 focus-visible:ring-offset-2"
                          @click="deleteSquealCall"
                        >
                          Elimina
                        </button>
                        <button
                          type="button"
                          className="inline-flex justify-center rounded-md border border-transparent emptyB px-4 py-2 text-sm font-medium text-black-900  focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:ring-offset-2"
                          @click="closeModal"
                        >
                          Annulla
                        </button>
                    </div>
                  </DialogPanel>
                </TransitionChild>
              </div>
            </div>
          </Dialog>
        </TransitionRoot>
      </div>
    </div>
    <div v-if="showCorrect">
      <CorrectMessage :correctText="correctText" />
    </div>
    <div v-if="showError">
      <ErrorMessage :errorText="errorText" />
    </div>
  </div>
  </KeepAlive>
</template>

<script setup>
import SideNav from "../components/sidenav.vue" // Update the path based on your project structure
import { computed, ref, watch, onBeforeMount } from 'vue';
import { useQuery, useMutation } from '@vue/apollo-composable';
import { GET_CLIENT_SQUEALS } from '../graphql/queries'; // Adjust the path based on your project structure
import { useRoute, useRouter } from "vue-router";
import { formatTimeDifference } from "../utils/utils";
import {positiveReactions} from "../utils/fixed"
import {BounceLoader} from "vue3-spinner"
import ErrorMessage from '../components/ErrorMessage.vue';
import CorrectMessage from '../components/CorrectMessage.vue';
import Header from "../components/Header.vue";

import {
  TransitionRoot,
  TransitionChild,
  Dialog,
  DialogPanel,
  DialogTitle,
} from '@headlessui/vue'
import { DELETE_CLIENT_SQUEALS } from "../graphql/mutations";

const route = useRoute();
const router = useRouter();
const userId = route.params.userId;
const { loading, result: resultActivity, refetch: refetchActivity } = useQuery(GET_CLIENT_SQUEALS, {
  clientId: userId
});

const userInfo = ref({});
const squeals = ref([]);
const squealsToShow = ref([]);
const { mutate: deleteSqueal, result: resultSqueal, onDone, onError} = useMutation(DELETE_CLIENT_SQUEALS);

const fetchData = async () => {
  await refetchActivity({ clientId: userId });
  userInfo.value = resultActivity.value.getClientSqueals.client;
  squeals.value = resultActivity.value.getClientSqueals.squeals;
  squealsToShow.value = resultActivity.value.getClientSqueals.squeals;
};

// Fetch data on component mount
onBeforeMount(() => {
  if(userId == 0){
    router.push('/home');
  }
  fetchData();
});

onDone(({ data }) => {
  squeals.value = data.deleteClientSqueal;
  squealsToShow.value = data.deleteClientSqueal;
  sortSqueals(sortMethod.value);
  showCorrect.value = true;
  setTimeout(() => {
    showCorrect.value = false;
  }, 1500)
})

onError(() => {
  showError.value = true;
  setTimeout(() => {
    showError.value = false;
  }, 1500)
})

watch(resultActivity, value => {
  userInfo.value = value.getClientSqueals.client;
  squeals.value = value.getClientSqueals.squeals;
  squealsToShow.value = value.getClientSqueals.squeals;
})

const filter = ref('');

const setFilter = (filtername) => {
  if(filtername == filter.value) filter.value = '';
  else filter.value = filtername;
}

watch(filter, value => {
  if(value == '') squealsToShow.value = squeals.value;
  else  squealsToShow.value = squeals.value.filter(squeal => squeal.classification == value);
  sortSqueals(sortMethod.value);
})

const sortMethod = ref('dateDown');
const setSort = (sortName) => {
  console.log(sortName)
  sortMethod.value = sortName;
}

const sortSqueals = (value) => {
  console.log(" mi hanno richiamato con valore", value);
  const sortedSqueals = [...squealsToShow.value];  // Create a shallow copy

  if (value == 'dateDown') sortedSqueals.sort((a, b) => (new Date(b.publicationDate)).getTime() - (new Date(a.publicationDate)).getTime());
  else if (value == 'dateUp') sortedSqueals.sort((a, b) => (new Date(a.publicationDate)).getTime() - (new Date(b.publicationDate)).getTime());
  else if (value == 'commentsDown') sortedSqueals.sort((a, b) => b.comments.length - a.comments.length);
  else if (value == 'commentsUp') sortedSqueals.sort((a, b) => a.comments.length - b.comments.length);
  else if (value == 'reactionsDown') sortedSqueals.sort((a, b) => b.reactions.length - a.reactions.length);
  else if (value == 'reactionsUp') sortedSqueals.sort((a, b) => a.reactions.length - b.reactions.length);
  else if (value == 'viewsDown') sortedSqueals.sort((a, b) => b.views - a.views);
  else if (value == 'viewsUp') sortedSqueals.sort((a, b) => a.views - b.views);

  // Assign the sorted array to the reactive variable
  squealsToShow.value = sortedSqueals;
}

watch(sortMethod, value => {
  sortSqueals(value);
});


const isOpen = ref(false)

function closeModal() {
  isOpen.value = false;
}
function openModal(squealId) {
  squealToDelete.value = squealId;
  isOpen.value = true;
}

const squealToDelete = ref('');

const deleteSquealCall = () => {
  deleteSqueal({
    squealId: squealToDelete.value,
    clientId: userId
  });
  closeModal();
}

const showError = ref(false);
const showCorrect = ref(false);
const correctText = "Squeal cancellato con successo";
const errorText = "Squeal non cancellato";
const loadingColor = "#ff3385";
const loadingSize = "60px";

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

.squealsContainer{
  display: flex;
  width: 100%;
  flex-direction: column;
  align-items: center;
}

.singleSqueal{
  border-bottom: 1px solid lightgrey;
  padding: 40px 0% 10px 0;
  overflow: hidden;
  width: 700px;
  position: relative;
}

.profileRow{
  display: flex;
  align-items: flex-start;
}
.userImage{
  width: 40px;
  height: 40px;
  border-radius: 50%;
  margin-right: 10px;
  border: 1px solid black;
}
.squealSender{
  color: black;
  display: flex;
  line-height: 1.2;
  flex-direction: column;
  width: 100%;
}

.name{
    font-weight: 600;
    margin-right: 5px;
    font-size: 14px;
  }

.themeColor{
  color: #ff3385;
  font-weight: 600;
}

.tag{
  font-size: 14px;
}

.date{
  font-size: 14px;
}

.nameDiv{
  display: flex;
  width: 100%;
  justify-content: space-between;
  align-items: center;
}

.classTag{
  font-weight: 600;
  margin-left: 5px;
  font-size: 14px;
  padding: 1px 5px;
  border-radius: 10px;
}

.Popular{
  border: 1px solid blue;
  color: blue;
}

.Impopular{
  border: 1px solid red;
  color: red;
}

.Controverse{
  border: 1px solid #B99AFF;
  color: #B99AFF;
}

.contentContainer{
  margin-top: -20px;
  font-size: 16px;
  padding-left: 50px;
}

.videoContainer{
  display: flex;
  justify-content: flex-start;  
  width: 70%;
  margin-right: 15px;
  margin-top: 5px;
}
.squealImageContainer{
  display: flex;
  justify-content: flex-start;  
  margin-top: 5px;
}
.squealImageContainer img{ 
  width: 70%;
  height: auto;
}
.iconsContainer{
  display: flex;
  width: 100%;
  margin-top: 20px;
  padding-left: 50px;
  padding-left: 70px;
  padding-right: 20;
  justify-content: space-around;
}
.iconDiv{
  display: flex;
  align-items: center;
  position: relative;
  margin-right: 15px;
  font-size: 16px;
  font-weight: 600;
}
.iconImage{
  width: 20px;
  height: 20px;
  margin-right: 5px;
}
.tooltip{
  font-size: 10px;
    visibility: hidden;
    background-color: #333;
    color: #fff;
    text-align: center;
    border-radius: 6px;
    padding: 3px 6px;
    position: absolute;
    z-index: 1;
    bottom: 100%;
    left: 50%;
    transform: translateX(-50%);
    opacity: 0;
    transition: opacity 0.3s;
    white-space: nowrap;
}

.iconDiv:hover .tooltip{
  visibility: visible;
  opacity: 1;
}

.filters{
  width: 750px;
  margin-bottom: 10px;
}

.filtersContainer{
  display: flex;
  flex-wrap: wrap;
  width: 80%;
  justify-content: space-between;
  align-items: center;
  font-weight: 600;;
}

.filterTitle{
  font-size: 18px;
  font-weight: 600;
  margin-bottom: 20px;
}

.filter{
  padding: 5px 20px;
  border-radius: 10px;
  border: 2px solid black;
}

.selected{
  padding: 5px 20px;
  border-radius: 10px;
  background: #ff3385;
  border: 2px solid #ff3385;
  color: white;
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

.sorting{
  width: 750px;
  margin-bottom: 10px;
}
.sortingContainer{
  display: flex;
  flex-wrap: wrap;
  width: 100%;
  align-items: center;
}
.sortOption{
  padding: 5px 15px;
  border-radius: 10px;
  border: 2px solid black;
  margin-bottom: 10px;
  margin-right: 10px;
  font-size: 14px;

}
.selectedSort{
  padding: 5px 15px;
  border-radius: 10px;
  color: #ff3385;
  border: 2px solid #ff3385;
  margin-bottom: 10px;
  margin-right: 10px;
  font-size: 14px;

}

.sortOption:hover{
  cursor: pointer;
  border: 2px solid #ff3385;
  color: #ff3385;
  transition: all 0.2s ease-in-out;

}

.selectedSort:hover{
  cursor: pointer;
}

.bg-w{
  background-color: white;
}

.bg-b{
  background-color: black;
  opacity: 0.25;
}

.dotContainer{
  box-shadow: 0px 3px 5px 5px #ffffffdd;
  margin-right: 10px;
}

.dotContainer:hover{
  cursor: pointer;
}

.dotContainer img{
  width: 15px;
  height: auto;
}

.fullB{
  color: white;
  background-color: #ff3385;
  border: 1px solid #ff3385;
}

.fullB:hover{
  color: #ff3385;
  background-color: white;
  transition: all 0.2s ease-in-out;
}

.emptyB{
  color: white;
  background-color: black;
  border: 1px solid black;
}

.emptyB:hover{
  color: black;
  background-color: white;
  transition: all 0.2s ease-in-out;
}

.positionContainer{
  display: flex;
  justify-content: flex-start;  
  margin-top: 5px;
}
.mapNewSqueal{
  width: 450px;
  height: 450px;
}

@media(max-width: 576px){

  .content-container{
    padding-inline: 15px;
    margin-top: 60px;
  }

  .loading-container{
    padding-inline: 15px;
  }

  .title{
    display: none;
  }

  .filters{
    width: 100%;
  }

  .filterTitle{
    margin-bottom: 10px;
  }

  .filtersContainer{
    width: 90%;
    justify-content: start;
    flex-wrap: wrap;
  }

  .filter{
    margin: 5px 10px;
  }

  .selected{
    margin: 5px 10px;
  }

  .sorting{
    width: 100%;
  }

  .sortingContainer{
    width: 90%;
  }
  .singleSqueal{
    width: 100%;
  }
  .classTag{
    font-size: 12px;
  }

  .videoContainer{
    width: 100%;
    height: auto;
  }

  .dotContainer{
    margin-right: 5px;
  }

  .squealImageContainer img{ 
    width: 100%;
    height: auto;
  }

  .iconsContainer{
    margin-top: 10px;
  }

  .iconDiv{
    margin-right: 10px;
  }
}
</style>
