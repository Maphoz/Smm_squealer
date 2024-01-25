<template>
  <div class="page-container">
      <SideNav :pathId="0" page="smmProfile"/>
      <Header :pathId="0" page="smmProfile" pageTitle="PROFILO"/>
      <div v-if="loadingProfile" class="loading-container">
        <div class="loadingContainer">
          <BounceLoader :loading="loadingProfile" :color="loadingColor" :size="loadingSize"/>
        </div>
      </div>      
      <div v-if="!loadingProfile" class="content-container">
        <h1 class="title">Profilo</h1>
        <div class="profileContainer">
          <div class="mainRowContainer">
            <div class="profile-border">
              <img :src="userInfo.profileImage" alt="Immagine profilo" class="profilePicture">
              <img src="../images/edit_smm.png" alt="" class="editIcon" @click="openEdit">
            </div>
            <div class="infoDiv">
              <span class="name">{{ userInfo.nome }}  {{ userInfo.cognome }}</span>
              <span class="username">{{ userInfo.username }}</span>
              <div class="emailContainer">
                <img src="../images/email_smm.png" alt="icona email" class="infoIcon">
                <span class="email">{{ userInfo.email }}</span>
              </div>
              <div class="emailContainer">
                <img src="../images/tariffa_smm.png" alt="icona tariffa" class="infoIcon">
                <span class="email">€ {{ userInfo.price }} /mese</span>
              </div>
            </div>
            <div class="mainCardsContainer disappearDiv">
              <div class="mainCard">
                <div class="cardInfo">
                  <div class="iconContainer">
                    <img src="../images/star.png" />
                  </div>
                  <div class="cardTitle">
                    Rating
                    <div class="cardValue">
                      {{ (userInfo.rating).toFixed(1)}} ({{ userInfo.reviews.length }})
                    </div>
                  </div>
                </div>
              </div>
              <div class="mainCard">
                <div class="cardInfo">
                  <div class="iconContainer">
                    <img src="../images/clients.png" />
                  </div>
                  <div class="cardTitle">
                    Clienti
                    <div class="cardValue">
                      {{ userInfo.assistedList.length}}
                    </div>
                  </div>
                </div>
              </div>   
            </div>
          </div>
          <div class="bioContainer">
            <span class="bio">{{ userInfo.bio }}</span>
          </div>
        </div>
        <div class="mainCardsContainer appearDiv">
              <div class="mainCard">
                <div class="cardInfo">
                  <div class="iconContainer">
                    <img src="../images/star.png" />
                  </div>
                  <div class="cardTitle">
                    Rating
                    <div class="cardValue">
                      {{ (userInfo.rating).toFixed(1)}} ({{ userInfo.reviews.length }})
                    </div>
                  </div>
                </div>
              </div>
              <div class="mainCard">
                <div class="cardInfo">
                  <div class="iconContainer">
                    <img src="../images/clients.png" />
                  </div>
                  <div class="cardTitle">
                    Clienti
                    <div class="cardValue">
                      {{ userInfo.assistedList.length}}
                    </div>
                  </div>
                </div>
              </div>   
            </div>
        <div class="tabContainer">
        <div class="w-full px-2 py-16 sm:px-0">
          <TabGroup>
            <TabList class="flex space-x-1 rounded-xl bg-blue-900/20 p-1">
              <Tab
                as="template"
                v-slot="{ selected }"
              >
                <button
                  :class="[
                    'w-full rounded-lg py-2.5 text-lg font-medium leading-5 mx-2',
                    
                    selected
                      ? 'bg-white selectedTab'
                      : 'tab text-blue-100 hover:bg-white/[0.12] hover:text-white',
                  ]"
                >
                  Clienti ({{ userInfo.assistedList.length }})
                </button>
              </Tab>
              <Tab
                as="template"
                v-slot="{ selected }"
              >
                <button
                  :class="[
                    'w-full rounded-lg py-2.5 text-lg font-medium leading-5 mx-2',
                    
                    selected
                      ? 'bg-white selectedTab'
                      : 'tab text-blue-100 hover:bg-white/[0.12] hover:text-white',
                  ]"
                >
                  Recensioni
                </button>
              </Tab>
            </TabList>

            <TabPanels class="mt-2">
              <TabPanel
                :class="[
                  'rounded-xl bg-white p-3',,
                ]"
              >
              <div v-if="loadingClients" class="loading-container">
                <div class="loadingContainer">
                  <BounceLoader :loading="loadingClients" :color="loadingColor" :size="loadingSize"/>
                </div>
              </div>  
                <div v-if="!loadingClients" class="clientsContainer">
                  <div v-for="client in clients" class="singleClient" @click="() => openFireClient(client)">
                    <div class="nameImage">
                      <img :src="client.profileImage" alt="foto cliente" class="clientImage">
                      <div class="nameDiv">
                        <span class="clientName">{{ client.nome }}  {{ client.cognome }}</span>
                        <span class="clientUsername">@{{ client.username }}</span>
                      </div>
                    </div>
                    <img src="../images/addRemove.png" alt="gestisci cliente" class="dotIcon">
                  </div>
                </div>
              </TabPanel>
              <TabPanel
                :class="[
                  'rounded-xl bg-white p-3',
                ]"
              >
              <div class="reviewsContainer">
                <div v-for="review in reviews" class="singleClient">
                  <div class="nameImage">
                    <img :src="review.profileImage" alt="foto cliente" class="clientImage">
                    <div class="nameDiv">
                      <div class="nameRating">
                        <span class="reviewName">{{ review.nome }}  {{ review.cognome }}</span>
                        <img v-if="review.rating > 0" src="../images/star.png" alt="rating" class="starIcon"/>
                        <img v-if="review.rating > 1" src="../images/star.png" alt="rating" class="starIcon"/>
                        <img v-if="review.rating > 2" src="../images/star.png" alt="rating" class="starIcon"/>
                        <img v-if="review.rating > 3" src="../images/star.png" alt="rating" class="starIcon"/>
                        <img v-if="review.rating > 4" src="../images/star.png" alt="rating" class="starIcon"/>
                        <span class="ratingValue">({{ review.rating }})</span>
                      </div>
                      <span class="reviewText">{{ review.text }}</span>
                    </div>
                  </div>
                </div>
                <div class="flex w-full justify-center">
                  <button class="fullB" @click="goReviews">Vai a reviews</button>
                </div>
              </div>
              </TabPanel>
              
            </TabPanels>
          </TabGroup>
        </div>
      </div>
      <TransitionRoot appear :show="showFire" as="template">
          <Dialog as="div" @close="closeFore" class="relative z-10">
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
                      Conferma acquisto
                    </DialogTitle>
                    <div class="mt-2">
                      <p class="text-sm text-gray-500">
                        Vuoi rescindere il contratto con questo cliente?
                      </p>
                    </div>
                    <div class="mt-4 flex justify-center space-x-4">
                      <button
                          type="button"
                          className="inline-flex justify-center rounded-md border border-transparent fullB px-4 py-2 text-sm font-medium text-black-900  focus:outline-none focus-visible:ring-2 focus-visible:ring-green-500 focus-visible:ring-offset-2"
                          @click="fireClient"
                        >
                          Conferma
                        </button>
                        <button
                          type="button"
                          className="inline-flex justify-center rounded-md border border-transparent emptyB px-4 py-2 text-sm font-medium text-black-900  focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:ring-offset-2"
                          @click="closeFire"
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
        <TransitionRoot appear :show="showEdit" as="template">
          <Dialog as="div" @close="closeEdit" class="relative z-10">
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
                      Modifica profilo
                    </DialogTitle>
                    <div class="mt-2">
                      <div class="formContainer">
                        <div class="image-picker">
                          <img v-if="selectedImage" :src="selectedImage" alt="Selected" />
                          <img v-else src="../images/user_image.jpg" alt="No Profile" />
                          <input ref="uploadImage" type="file" accept="image/*" @change="handleImageChange" />
                          <MainButton :onClick="openImagePicker" :buttonText="selectedImage ? 'Cambia' : 'Carica'" :active=true />
                        </div>
                        <FormField :value="newEmail" :width="fieldWidth" name="Email" inputName="email" @update:value="updateValue"/>
                        <FormField :value="newUsername" :width="fieldWidth" name="Username" inputName="username" @update:value="updateValue"/>
                        <div class="textarea-container">
                          <textarea
                            class="bio-textarea"
                            placeholder="Inserisci la tua biografia qui..."
                            v-model="newBio"
                          ></textarea>
                        </div>
                        <div class="input-container">
                          <div class="euro-icon">&#x20AC;</div>
                          <input
                            class="cost-input"
                            type="number"
                            placeholder="Tariffa mensile"
                            v-model="newPrice"
                          />
                          <div class="per-month-text">/month</div>
                        </div>
                        <div class="buttonContainer">
                          <div class="singleButton">
                            <MainButton :onClick="saveChanges" :buttonText="'Salva modifiche'" :active="true" />
                          </div>
                          <div class="singleButton">                            
                            <EmptyButton :onClick="closeEdit" :buttonText="'Chiudi'" :active="true" />
                          </div>
                        </div>
                      </div>
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
    <div v-if="showCorrectDelete">
      <CorrectMessage :correctText="correctTextDelete" />
    </div>
    <div v-if="showErrorDelete">
      <ErrorMessage :errorText="errorTextDelete" />
    </div>
</template>

<script setup>
import SideNav from "../components/sidenav.vue" // Update the path based on your project structure
import { computed, ref, watch, onBeforeMount } from 'vue';
import { useQuery, useMutation } from '@vue/apollo-composable';
import { GET_CLIENTS, GET_PROFILE, GET_SMM_NOTIFICATIONS } from '../graphql/queries'; // Adjust the path based on your project structure
import { useRoute, useRouter } from "vue-router";
import { formatTimeDifference } from "../utils/utils";
import {positiveReactions} from "../utils/fixed"
import {UPDATE_PROFILE, DELETE_CLIENT} from "../graphql/mutations"
import {BounceLoader} from "vue3-spinner"
import ErrorMessage from '../components/ErrorMessage.vue';
import CorrectMessage from '../components/CorrectMessage.vue';
import MainButton from "../components/MainButton.vue"
import EmptyButton from "../components/EmptyButton.vue"

import FormField from "../components/FormField.vue"
import {
  TransitionRoot,
  TransitionChild,
  Dialog,
  DialogPanel,
  DialogTitle,
} from '@headlessui/vue'
import { TabGroup, TabList, Tab, TabPanels, TabPanel } from '@headlessui/vue'
import Header from "../components/header.vue";

const router = useRouter();


const { loading: loadingProfile, result: resultProfile, refetch: refetchProfile } = useQuery(GET_PROFILE);
const { loading : loadingClients, result : resultClients, refetch : refetchClients } = useQuery(GET_CLIENTS);
const { loading: loadingNotifications, result: resultNotifications, refetch: refetchNotifications } = useQuery(GET_SMM_NOTIFICATIONS);
const { mutate: changeProfile, onDone: onDoneUpdate, onError: onErrorUpdate } = useMutation(UPDATE_PROFILE);
const { mutate: deleteClient, onDone: onDoneRemove, onError: onErrorRemove} = useMutation(DELETE_CLIENT);

const fetchData = async () => {
  await refetchProfile();
  await refetchClients();
  await refetchNotifications();
  userInfo.value = resultProfile.value.getSmmProfile.smm;
  reviews.value = mergeArrays(userInfo.value.reviews, resultProfile.value.getSmmProfile.reviewers).reverse().slice(0,5);
  clients.value = resultClients.value.getClients;
  notifications.value = resultNotifications.value.getNotifications.interactiveNotifications;
};

onDoneUpdate(({ data }) => {
  userInfo.value = data.updateSmm;
  showCorrect.value = true;
  setTimeout(() => {
    showCorrect.value = false;
  }, 1500)
});

onErrorUpdate(() => {
  showError.value = true;
  setTimeout(() => {
    showError.value = false;
  }, 1500)
});

onDoneRemove(({ data }) => {
  clients.value = data.removeClient;
  showCorrectDelete.value = true;
  setTimeout(() => {
    showCorrectDelete.value = false;
  }, 1500)
});

onErrorRemove(() => {
  showErrorDelete.value = true;
  setTimeout(() => {
    showErrorDelete.value = false;
  }, 1500)
});

// Fetch data on component mount
onBeforeMount(() => {
  fetchData();
});

const mergeArrays = (arr1, arr2) => {
  return arr1.map(obj1 => {
    const matchingObj = arr2.find(obj2 => obj1.senderId === obj2._id);
    return { ...obj1, ...matchingObj };
  });
};

const userInfo = ref({});
const clients = ref([]);
const reviews = ref([]);
const notifications = ref([]);

const isOpen = ref(false);
const closeModal = () => {
  isOpen.value = false;
}
const showCorrect = ref(false);
const correctText = "Profilo modificato."
const showError = ref(false);
const errorText = "Profilo non modificato."
const showCorrectDelete = ref(false);
const correctTextDelete = "Cliente rimosso."
const showErrorDelete = ref(false);
const errorTextDelete = "Cliente non rimosso."

const loadingColor = "#ff3385";
const loadingSize = "60px";

/**
 * 
 * Update profile section
 */

const newUsername = ref('');
const newEmail = ref('');
const newPrice = ref();
const newBio = ref();
const selectedImage = ref();
const uploadImage = ref(null);
const fileImage = ref();


const showEdit = ref(false);

const closeEdit = () => {
  showEdit.value = false;
  newEmail.value = null;
  newUsername.value = null;
  newPrice.value = null;
  newBio.value = null;
  fileImage.value = null;
  selectedImage.value = null;
}

const openEdit = () => {
  showEdit.value = true;
  newEmail.value = userInfo.value.email;
  newUsername.value = userInfo.value.username;
  newPrice.value =userInfo.value.price;
  newBio.value = userInfo.value.bio;
  selectedImage.value = userInfo.value.profileImage;
}

const selectedClient = ref();
const showFire = ref(false);

const closeFire = () => {
  showFire.value = false;
}

const openFireClient = (client) => {
  selectedClient.value = client;
  showFire.value = true;
}

const fireClient = () => {
  deleteClient({
    clientId: selectedClient.value._id
  })
  showFire.value = false;
}

const updateValue = ({ key, value }) => {
  if (key == 'username') newUsername.value = value;
  if (key == 'email') newEmail.value = value;
};

const handleImageChange = (event) => {
  const file = event.target.files[0];

  if (file) {
    fileImage.value = file;
    const reader = new FileReader();

    reader.onload = (e) => {
      selectedImage.value = e.target.result;
    };

    reader.readAsDataURL(file);
  }
};

const openImagePicker = () => {
  uploadImage.value.click();
};

const saveChanges = () => {
  changeProfile({
    userInfo: {
      email: newEmail.value || null,
      username: newUsername.value || null,
      bio: newBio.value || null,
      price: newPrice.value || null,
    },
    file: fileImage.value || null
  })
  closeEdit();
}
const fieldWidth = '100%';


/**
 * random
 */

const goReviews = () => router.push('/smmReviews');
const clientToManage = ref();
const manageClient = (client) => {
  clientToManage.value = client;
}
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

  .tabContainer{
    width: 60%;
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

.profileContainer{
  display: flex;
  width: 100%;
  flex-direction: column;
  align-items: flex-start;
}
.mainRowContainer{
  display: flex;
  align-items: flex-start;
  width: 100%;
}
.profilePicture {
  width: 120px;
  height: 120px;
  object-fit: cover;
  border-radius: 50%;
  border: 2px solid white;
  background-color: white;
}
.profile-border {
  border-radius: 50%;
  background: linear-gradient(to right, #ff00ff, #ff3385); /* Adjust the colors as needed */
  display: flex;
  padding: 2px;
  margin-bottom: 10px;
  margin-right: 20px;
  position: relative;
}
.infoDiv{
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  margin-top: 20px;
}
.name{
  font-weight: 600;
  font-size: 18px;
}
.username{
  color: #555;
}
.email{
  font-weight: 600;
  font-size: 18px;
}
.bioContainer{
  width: 400px;
}
.bio{
  font-size: 18px;
}

.mainCardsContainer{
  display: flex;
  justify-content: space-around;
  flex-wrap: wrap;
  margin-top: 40px;
  padding-inline: 60px;
}

.appearDiv{
  display: none;
}

.mainCard{
  display: flex;
  padding: 10px 0px 10px 20px;
  flex-direction: column;
  align-items: flex-start;
  box-shadow: 0px 0px 10px 2px lightgray;
  border-radius: 15px;
  width: 250px;
  background: #fafafa;
  margin-bottom: 15px;
  margin-right: 30px;
  margin-left: 80px;
}

.mainCard:hover{
  box-shadow: 0px 0px 10px 2px #ff338566;
}
.cardTitle{
  font-size: 20px;
  color: grey;
}
.cardValue{
  font-size: 24px;
  color: #ff3385;
  font-weight: 600;
  margin-left: 10px;
  margin-top: -5px;
}

.iconContainer{
  padding: 10px;
  background: #ff338544;
  border-radius: 50%;
  margin-right: 10px;
}

.iconContainer img{
  width: 30px;
  height: 30px;
}

.cardInfo{
    display: flex;
    align-items: center;
  }

.emailContainer{
  display: flex;
  align-items: center;
}
.infoIcon{
  width: 20px;
  height: 20x;
  margin-right: 5px;
}

.editIcon{
  border-radius: 50%;
  position: absolute;
  bottom: 0;
  right: 5px;
  width: 35px;
  height: 35px;
  border: 2px solid black;
  cursor: pointer;
}

.editIcon:hover{
  border: 2px solid #ff3385;
}

.clientsContainer{
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  width: 100%;
}
.singleClient{
  display: flex;
  align-items: center;
  margin: 10px 0px;
  justify-content: space-between;
  width: 100%;
  padding: 10px 20px;
  border-radius: 20px;
  position: relative;
}


.singleClient:hover{
  background: #ff338511;
  cursor: pointer;
}
.nameImage{
  display: flex;
  align-items: flex-start;
}
.clientImage{
  border-radius: 50%;
  width: 60px;
  height: 60px;
  margin-right: 15px;
}
.nameDiv{
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  font-size: 18px;
}

.nameRating{
  display: flex;
  align-items: center;
}

.reviewName{
  font-weight: 600;
  margin-right: 5px;
}

.ratingValue{
  color: #ff3385;
  margin-left: 5px;
}

.starIcon{
  margin-left: 2px;
  width: 15px;
  height: 15px;
}
.clientName{
  font-weight: 600;
}
.clientUsername{
  color: #555;
}
.dotIcon{
  width: 25px;
  height: 25px;
}

.optionsManage{
  position: absolute;
  top: 0;
  right: 0;
  display: flex;
  flex-direction: column;
  background-color: white;
}
.option{
  width: 100%;
  text-align: left;
  padding: 10px 15px;
}

.option:hover{
  cursor: pointer;
  background: #ff338544;
}

.selectedTab{
  color: #ff3385;
  box-shadow: 0px 2px 10px 1px #ff338544;
  outline: none;
}

.tab{
  box-shadow: 0px 2px 10px 1px #00000011;
}
.tab:hover{
  color: #ff3385;
  box-shadow: 0px 2px 10px 1px #ff338544;
  transition: all 0.2s ease-in-out;
}

.formContainer{
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-inline: 5%;
}
.image-picker {
  margin: 0px 0px 25px 0px;
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
}

.image-picker button{
  width: 30%;
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

.image-picker img {
  border-radius: 50%;
  width: 120px;
  height: 120px;
  margin-bottom: 10px;
  box-shadow: 0px 0px 2px 2px #eeeeee;
}

.image-picker input {
  display: none;
}
.textarea-container{
  width: 100%;
  margin-bottom: 15px;
}
.bio-textarea{
  width: 100%;
  padding: 10px;
  border: 2px solid black;
  border-radius: 5px;
  box-sizing: border-box;
  transition: border-color 0.3s ease-in-out;
  height: 100px;

  &:focus{
    border-color: #ff3385; /* Purple border when focused */
    outline: none;
  }
}
.input-container{
  position: relative;
  margin-bottom: 25px;
}
.euro-icon {
  position: absolute;
  left: 15px;
  top: 50%;
  transform: translateY(-50%);
  font-size: 20px;
  color: #ff3385; /* Purple color */
}
.cost-input{
  width: calc(100% - 30px);
  padding-left: 30px;
  outline: none;
  font-size: 18px;
  line-height: 40px;
  border-radius: 10px;
  border: 2px solid black;
  transition: 0.2s ease;
  box-sizing: border-box;

  &:focus{
    border-color: #ff3385;
  }

  &:valid{
    border-color: #ff3385;
  }
}
.per-month-text{
  position: absolute;
  right: 35px;
  top: 50%;
  transform: translateY(-50%);
  font-size: 14px;
  color: #555; /* Adjust color as needed */
}

.buttonContainer{
  width: 100%;
  justify-content: space-between;
  display: flex;
  align-items: center;
}

.singleButton{
  width: 48%;
}

@media(max-width: 576px){
  .content-container, .loading-container{
    padding-inline: 10px;
    margin-top: 60px;
  }

  .title{
    display: none;
  }

  .tabContainer{
    width: 100%;
  }

  .disappearDiv{
    display: none;
  }

  .bioContainer{
    width: 90%;
  }

  .profilePicture{
    width: 90px;
    height: 90px;
  }

  .infoDiv{
    margin-top: 0px;
  }

  .appearDiv{
    display: flex;
  }

  .reviewsContainer{
    width: 100%;
  }

  .clientImage{
    width: 50px; 
    height: 50px;
  }

  .singleClient{
    padding: 10px 10px;
  }

  .mainCardsContainer{
    padding-inline: 10px;
    margin-top: 20px;
  }

  .mainCard{
    width: 150px;
    margin: 10px;
    padding: 10px 0px 10px 10px;
  }

  .cardTitle{
    font-size: 16px;
  }

  .cardValue{
    font-size: 20px;
  }

  .iconContainer img{
    width: 25px;
    height: 25px;
  }

}
</style>