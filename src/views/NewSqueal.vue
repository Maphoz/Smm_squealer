<template>
  <div class="page-container">
      <SideNav page="newSqueal" />  
      <Header page="newSqueal" pageTitle="PUBBLICA SQUEAL"/>
      <div class="content-container">
        <h1 class="title">Pubblica Squeal</h1>
        <div v-if="(loadingClient || loadingReceivers)" class="loadingContainer">
          <BounceLoader :loading="(loadingClient || loadingReceivers)" :color="loadingColor" :size="loadingSize"/>
        </div>
        <div v-if="!(loadingClient || loadingReceivers)" class="newSquealContainer">
          <div class="buttonActions">
            <button class="fullB" @click="openReceivers">Destinatari</button>
            <button class="fullB"  @click="postRegularSqueal">Squeal</button>
          </div>
          <div class="textRow">
            <img :src="userInfo.profileImage" alt="" class="imgProfile">
            <textarea v-if="!imageRef && !selectedVideo && !userPosition" v-model="text" class="styledTextarea" placeholder="Scrivi uno squeal"></textarea>
            <div v-if="imageRef" class="imageSqueal">
              <img src="../images/cancel.png" alt="" class="xIcon" @click="deleteImage">
              <img :src="imageRef" alt="" class="squealImage">
            </div>
            <div v-if="selectedVideo" class="videoSqueal">
              <img src="../images/cancel.png" alt="" class="xIcon" @click="deleteVideo">
              <video controls>
                <source :src="selectedVideo">
              </video>
            </div>
            <div v-if="userPosition" class="mapContainer">
              <img src="../images/cancel.png" alt="" class="xIcon" @click="deletePosition">
              <GMapAutocomplete
                placeholder="Search for a location"
                @place_changed="setPlace"
                class="autocompleteG"
              >
              </GMapAutocomplete>
              <GMapMap
                :center="userPosition"
                :zoom="15"
                map-type-id="terrain"
                class="mapNewSqueal"
                :options="{
                  mapTypeControl: false,
                }"
              >
                <GMapMarker
                  v-if="marker"
                  :key="marker.id"
                  :position="marker.position"
                  :clickable="true"
                  :draggable="true"
                  @click="openMarker(marker.id)"
                  @dragend="updateMarkerPosition"
                >
                <GMapInfoWindow
                  v-if="locationDetails && locationDetails.address != ''"
                  :closeclick="true"
                  @closeclick="openMarker(null)"
                  :opened="openedMarkerID === marker.id"
                  :options="{
                    pixelOffset: {
                      width: 10,
                      height: 0
                    },
                    maxWidth: 320,
                    maxHeight: 320
                  }"

                >
                </GMapInfoWindow>
                </GMapMarker>
              </GMapMap>
            </div>
            <div class="disappearDiv">
              <button class="fullB" @click="openReceivers">Destinatari</button>
            </div>
          </div>
          <div class="iconRow">
            <div class="iconActionBar">
              <div class="iconPost" @click="openImageSelection">
                <img src="../images/image_smm.png" alt="carica immagine" class="iconLink">
                <div class="tooltip">Immagine</div>
                <input type="file" ref="imageInput" @change="handleFileChange" style="display: none">
              </div>
              <div class="iconPost">
                <img src="../images/temporized_smm.png" alt="pianifica messaggi" class="iconLink" @click="openTemporizedReceivers">
                <div class="tooltip">Messaggi temporizzati</div>
              </div>
              <div class="iconPost" @click="openVideoSelection">
                <img src="../images/video_smm.png" alt="carica video" class="iconLink">
                <input type="file" ref="videoInput" @change="handleVideoChange" style="display: none">
                <div class="tooltip">Video</div>
              </div>
              <div class="iconPost">
                <img src="../images/position_smm.png" alt="condividi posizione" class="iconLink" @click="getUserPos">
                <div class="tooltip">Geolocalizzazione</div>
              </div>
              <div class="iconPost" @click="generateNews">
                <img src="../images/news_smm.png" alt="Condividi ultima notizia" class="iconLink">
                <div class="tooltip">Notizie</div>
              </div>
              <div class="iconPost" @click="generateRandomQuote">
                <img src="../images/quote_smm.png" alt="Condividi citazione" class="iconLink">
                <div class="tooltip">Citazione</div>
              </div>
            </div>
            <div class="charBigTitle">
              Utilizzo caratteri
            </div>
            <div v-if="userInfo" class="charIndicator">
              <div class="charValue"  :class="{'orange' : charUsed > maxChar}">
                <div class="charTitle">
                  Giornalieri
                </div>
                <div class="charNumber">
                  {{ userInfo.caratteri_giornalieri_rimanenti - charUsed }}
                </div>
              </div>
              <div class="charValue"  :class="{'orange' : charUsed > maxChar}">
                <div class="charTitle">
                  Settimanali
                </div>
                <div class="charNumber">
                  {{ userInfo.caratteri_settimanali_rimanenti - charUsed }}
                </div>
              </div>
              <div class="charValue"  :class="{'orange' : charUsed > maxChar}">
                <div class="charTitle">
                  Mensili
                </div>
                <div class="charNumber">
                  {{ userInfo.caratteri_mensili_rimanenti - charUsed }}
                </div>
              </div>
            </div>
            <button class="fullB squealB disappearButton" @click="postRegularSqueal">Squeal</button>
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
                      Conferma acquisto
                    </DialogTitle>
                    <div class="mt-2">
                      <p class="text-sm text-gray-500">
                        Ciao
                      </p>
                    </div>
                    <div class="mt-4 flex justify-center space-x-4">
                      <button
                          type="button"
                          className="inline-flex justify-center rounded-md border border-transparent fullB px-4 py-2 text-sm font-medium text-black-900  focus:outline-none focus-visible:ring-2 focus-visible:ring-green-500 focus-visible:ring-offset-2"
                          @click="closeModal"
                        >
                          Conferma
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

        <TransitionRoot appear :show="showReceivers" as="template">
          <Dialog as="div" @close="closeReceivers" class="relative z-10">
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
                      Scegli destinatari
                    </DialogTitle>
                    <div class="receiversContainer">
                      <div class="receiversColumn columns br">
                        <div class="receiverTitle">
                          Amici
                        </div>
                        <input v-model="filterDestinationUsers" type="text" class="receiverSearch" placeholder="Cerca username">
                        <div v-for="user in userReceiverShow" class="singleReceiver" @click="includeReceiver(user, 'friends')">
                          <img :src="user.profileImage || userImageUrl" />
                          <p>{{ user.profileImage.length }}</p> 
                          <span class="receiverName">{{ user.username }}</span>
                          <img v-if="destinationUsers.indexOf(user) >= 0" class="selected" src="../images/check_theme_2.png"/>
                        </div>
                      </div>
                      <div class="receiversColumn columns">
                        <div class="receiverTitle">
                          Canali
                        </div>
                        <input v-model="filterDestinationChannels" type="text" class="receiverSearch" placeholder="Cerca canale">
                        <div v-for="channel in channelReceiverShow" class="singleReceiver" @click="includeReceiver(channel, 'channels')">
                          <img :src="channel.channelImage || channelImageUrl" />
                          <p>{{ channel.channelImage.length }}</p> 
                          <span class="receiverName">{{ channel.name }}</span>
                          <img v-if="destinationChannels.indexOf(channel) >= 0" class="selected" src="../images/check_theme_2.png"/>
                        </div>
                      </div> 
                    </div>
                    <div class="mt-4 flex justify-center space-x-4">
                      <button
                          type="button"
                          className="inline-flex justify-center rounded-md border border-transparent fullB px-4 py-2 text-sm font-medium text-black-900  focus:outline-none focus-visible:ring-2 focus-visible:ring-green-500 focus-visible:ring-offset-2"
                          @click="closeReceivers"
                        >
                          Chiudi selezione
                        </button>
                    </div>
                  </DialogPanel>
                </TransitionChild>
              </div>
            </div>
          </Dialog>
        </TransitionRoot>

        <TransitionRoot appear :show="temporaryWarning" as="template">
          <Dialog as="div" @close="closeTemporary" class="relative z-10">
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
                      Attenzione, squeal temporaneo
                    </DialogTitle>
                    <div class="mt-2">
                      <p class="text-sm text-gray-500">
                        Attenzione! Quando uno squeal è indirizzato a un canale temporaneo (#parola), non può essere mandato ad ulteriori destinatari!
                      </p>
                    </div>
                    <div class="mt-4 flex justify-center space-x-4">
                      <button
                          type="button"
                          className="inline-flex justify-center rounded-md border border-transparent emptyB px-4 py-2 text-sm font-medium text-black-900  focus:outline-none focus-visible:ring-2 focus-visible:ring-green-500 focus-visible:ring-offset-2"
                          @click="closeTemporary"
                        >
                          Capito
                        </button>
                    </div>
                  </DialogPanel>
                </TransitionChild>
              </div>
            </div>
          </Dialog>
        </TransitionRoot>

        <TransitionRoot appear :show="overcharWarning" as="template">
          <Dialog as="div" @close="closeOver" class="relative z-10">
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
                      Attenzione, caratteri eccessivi
                    </DialogTitle>
                    <div class="mt-2">
                      <p class="text-sm text-gray-500">
                        Attenzione! Questo squeal utilizza <b>{{ charUsed - maxChar }}</b> caratteri oltre quelli possieduti dal cliente. Vuoi acquistarli per <b>€{{ ((charUsed - maxChar) * 0.20).toFixed(2) }}</b> 
                      </p>
                    </div>
                    <div class="mt-4 flex justify-center space-x-4">
                      <button
                          type="button"
                          className="inline-flex justify-center rounded-md border border-transparent fullB px-4 py-2 text-sm font-medium text-black-900  focus:outline-none focus-visible:ring-2 focus-visible:ring-green-500 focus-visible:ring-offset-2"
                          @click="postSqueal"
                        >
                          Acquista
                        </button>
                        <button
                          type="button"
                          className="inline-flex justify-center rounded-md border border-transparent emptyB px-4 py-2 text-sm font-medium text-black-900  focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:ring-offset-2"
                          @click="closeOver"
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

        <TransitionRoot appear :show="showTemporized" as="template">
          <Dialog as="div" @close="closeTemporized" class="fixed inset-0 z-10 overflow-y-auto">
            <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
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

                <TransitionChild
                  as="template"
                  enter="duration-300 ease-out"
                  enter-from="opacity-0 scale-95"
                  enter-to="opacity-100 scale-100"
                  leave="duration-200 ease-in"
                  leave-from="opacity-100 scale-100"
                  leave-to="opacity-0 scale-95"
                >
                  <div class="temporizedContainer">
                    <div class="temporizedForm">
                      <div class="temporizedTitle">
                        Pianifica gli squeal del tuo cliente!
                      </div>
                      <div class="textDiv">
                        <div class="tempTextContainer">
                          All'interno di uno squeal temporizzato, puoi inserire le diciture &#123;NUM&#125;, &#123;TIME&#125; e &#123;DATE&#125;, che al momento della pubblicazione verranno sostituiti con il numero del post, l'ora e il tempo di pubblicazione. 
                        </div>
                      </div>
                      <div class="temporizedTextContainer">
                        <div class="inputName">
                          Scrivi lo squeal
                        </div>
                        <textarea v-model="temporizedSqueal" placeholder="Il tuo squeal" class="temporizedTextArea"></textarea>
                      </div>
                      <div class="temporizedTextContainer">
                        <div class="temporizedRow">
                          <div class="choiceContainer">
                            <div class="temporizedRepetition">
                              <div class="inputName choice">
                                Numero di ripetizioni
                              </div>
                              <input v-model="temporizedRepetitions" type="number" class="temporizedInput noArrows">
                            </div>
                            <div class="temporizedRepetition">
                              <div class="inputName choice">
                                Ogni quanto tempo
                              </div>
                              <select v-model="selectedTimeFrame">
                                <option v-for="(seconds, label) in temporizedTimeFramesString" :key="label" :value="seconds">{{ label }}</option>
                              </select>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div class="textDiv">
                        <div class="tempTextContainer">
                          <b>Nota: </b> il costo di uno squeal temporizzato viene determinato al momento della pubblicazione.<br/>
                          <b className="red">Se non avrai caratteri sufficienti, lo squeal non verrà pubblicato.</b>
                        </div>
                      </div>
                      <div class="buttonContainer">
                        <button class="fullB" @click="createTemporized">Pianifica pubblicazione</button>
                        <button class="emptyB" @click="closeTemporized">Chiudi</button>
                      </div>
                    </div>
                  </div>
                </TransitionChild>
            </div>
          </Dialog>
        </TransitionRoot>

        <TransitionRoot appear :show="showTemporizedReceivers" as="template">
          <Dialog as="div" @close="closeTemporizedReceivers" class="relative z-10">
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
                      class="tempRec text-lg font-medium leading-6 text-gray-900"
                    >
                      Scegli i destinatari per gli squeal programmati
                    </DialogTitle>
                    <div class="receiversContainer">
                      <div class="receiversColumn columns br">
                        <div class="receiverTitle">
                          Amici
                        </div>
                        <input v-model="filterDestinationUsers" type="text" class="receiverSearch" placeholder="Cerca username">
                        <div v-for="user in userReceiverShow" class="singleReceiver" @click="includeReceiver(user, 'friends')">
                          <img :src="user.profileImage || userImageUrl" />
                          <p>{{ user.profileImage.length }}</p> 
                          <span class="receiverName">{{ user.username }}</span>
                          <img v-if="destinationUsers.indexOf(user) >= 0" class="selected" src="../images/check_theme_2.png"/>
                        </div>
                      </div>
                      <div class="receiversColumn columns">
                        <div class="receiverTitle">
                          Canali
                        </div>
                        <input v-model="filterDestinationChannels" type="text" class="receiverSearch" placeholder="Cerca canale">
                        <div v-for="channel in channelReceiverShow" class="singleReceiver" @click="includeReceiver(channel, 'channels')">
                          <img :src="channel.channelImage || channelImageUrl" />
                          <p>{{ channel.channelImage.length }}</p> 
                          <span class="receiverName">{{ channel.name }}</span>
                          <img v-if="destinationChannels.indexOf(channel) >= 0" class="selected" src="../images/check_theme_2.png"/>
                        </div>
                      </div> 
                    </div>
                    <div class="mt-4 flex justify-center space-x-4">
                      <button
                          type="button"
                          className="inline-flex justify-center rounded-md border border-transparent fullB px-4 py-2 text-sm font-medium text-black-900  focus:outline-none focus-visible:ring-2 focus-visible:ring-green-500 focus-visible:ring-offset-2"
                          @click="planSqueal"
                        >
                          Continua pianificazione
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
    <div v-if="showTemporizedCorrect">
      <CorrectMessage :correctText="correctTemporizedText" />
    </div>
    <div v-if="showTemporizedError">
      <ErrorMessage :errorText="errorTemporizedText" />
    </div>
</template>

<script setup>
import { computed, ref, watch, watchEffect, onBeforeMount } from 'vue';
import { useQuery, useMutation } from '@vue/apollo-composable';
import { GET_CLIENT, GET_CLIENT_RECEIVERS } from '../graphql/queries'; // Adjust the path based on your project structure
import { REDUCE_CHARS_CLIENT, CREATE_SQUEAL_CLIENT, CREATE_TEMPORIZED_SQUEAL_CLIENT } from '../graphql/mutations'; // Adjust the path based on your project structure
import SideNav from '../components/sidenav.vue';
import { useRoute, useRouter } from "vue-router";
import { formatTimeDifference, getMin } from "../utils/utils";
import {tariffe} from "../utils/fixed"
import MainButton from "../components/MainButton.vue"
import {BounceLoader} from "vue3-spinner"
import ErrorMessage from '../components/ErrorMessage.vue';
import CorrectMessage from '../components/CorrectMessage.vue';
import { ImgCharCost, VideoCharCost, GeolocCharCost, temporizedTimeFramesString } from '../utils/utils';
import {
  TransitionRoot,
  TransitionChild,
  Dialog,
  DialogPanel,
  DialogTitle,
} from '@headlessui/vue'
import {onMounted} from 'vue'
import Header from '../components/header.vue';
import { GRAPHQL_MAX_INT } from 'graphql';

    /**
     * Query section
     */
    const route = useRoute();
    const userId = route.params.userId;
    const router = useRouter();
    const { loading: loadingClient, result: resultClient, refetch: refetchClient } = useQuery(GET_CLIENT, {
      clientId: userId
    });

    const { loading: loadingReceivers, result: resultReceivers, refetch: refetchReceivers } = useQuery(GET_CLIENT_RECEIVERS, {
      clientId: userId
    });

    const { mutate: buyChars, result: resultPurchase, onDone: onDonePurchase, onError: onErrorPurchase} = useMutation(REDUCE_CHARS_CLIENT);
    const { mutate: createSqueal, result: resultCreateSqueal, onDone: onDoneCreation, onError: onErrorCreation} = useMutation(CREATE_SQUEAL_CLIENT);
    const { mutate: planTemporized, result: resultTemporized, onDone: onDoneTemporized, onError: onErrorTemporized} = useMutation(CREATE_TEMPORIZED_SQUEAL_CLIENT);

    const userInfo = ref({});

    onDoneCreation(() => {
      showCorrect.value = true;
      refetchClient({ clientId: userId });
      setTimeout(() => {
        showCorrect.value = false;
      }, 1500)
    })

    onErrorCreation(() => {
      showError.value = true;
      setTimeout(() => {
        showError.value = false;
      }, 1500)
    })

    onDoneTemporized(() => {
      showTemporizedCorrect.value = true;
      refetchClient({ clientId: userId });
      setTimeout(() => {
        showTemporizedCorrect.value = false;
      }, 1500)
    })

    onErrorTemporized(() => {
      showTemporizedError.value = true;
      setTimeout(() => {
        showTemporizedError.value = false;
      }, 1500)
    })

    const fetchData = async () => {
      if(userId == 0){
        router.push('/home');
      }
      await refetchClient({ clientId: userId });
      await refetchReceivers({ clientId: userId });
      userInfo.value = resultClient.value.getClient;
      maxChar.value = getMin(userInfo.value.caratteri_giornalieri_rimanenti, userInfo.value.caratteri_settimanali_rimanenti, userInfo.value.caratteri_mensili_rimanenti);
      channelReceivers.value = resultReceivers.value.getClientReceivers.channels;
      userReceivers.value = resultReceivers.value.getClientReceivers.friends;
      userReceiverShow.value =  resultReceivers.value.getClientReceivers.friends;
      channelReceiverShow.value = resultReceivers.value.getClientReceivers.channels;
    };

    onBeforeMount( () => {
      fetchData();
    })

    const showError = ref(false);
    const showCorrect = ref(false);
    const showTemporizedCorrect = ref(false);
    const showTemporizedError = ref(false);


    /**
     * New squeal section
     */

     /**
      * refs
      */
    const charsToPurchase = ref(0);
    const charUsed = ref(0);
    const maxChar = ref(GRAPHQL_MAX_INT);

    const fileRef = ref(null);
    const imageRef = ref(null);
    const imageInput = ref();
    const selectedVideo = ref();
    const videoInput = ref();
    const text = ref();
    const userPosition = ref();
    const userReceiverShow = ref([]);
    const channelReceiverShow = ref([]);
    const destinationChannels = ref([]);
    const destinationUsers = ref([]);
    const channelReceivers = ref([]);
    const userReceivers = ref([]);
    const keyword = ref();
    const marker = ref();
    const containsTemporary = ref(false);
    const locationDetails = ref({
      address: '',
      url: ''
    });

    //temporizedSqueal
    const selectedTimeFrame = ref(Object.keys(temporizedTimeFramesString)[0]);
    const showTemporized = ref(false);
    const temporizedSqueal = ref();
    const temporizedRepetitions = ref(0);


    const filterDestinationUsers = ref('');
    const filterDestinationChannels = ref('');


    watch(filterDestinationChannels, value => {
      var exchangeArray = channelReceivers.value;
      var exchangeArray = exchangeArray.filter((item) => item.name.toLowerCase().includes(value.toLowerCase()));
      channelReceiverShow.value = exchangeArray;
    })

    watch(filterDestinationUsers, value => {
      var exchangeArray = userReceivers.value;
      var exchangeArray = exchangeArray.filter((item) => item.username.toLowerCase().includes(value.toLowerCase()));
      userReceiverShow.value = exchangeArray;
    })

    watch(text, (newText) => {
      // Check if the text contains the specified pattern
      const regex = /(?:^|\s)#(\w+)/;
      containsTemporary.value = regex.test(newText);
      if(containsTemporary.value == true) destinationChannels.value = []; destinationUsers.value = [];
    });

    watch([imageRef, selectedVideo, userPosition], () => {
      containsTemporary.value = false;
    });

    watch(charUsed, (newCharUsed) => {
      console.log(`charUsed changed:  ${newCharUsed}`);
    });

    watchEffect(() => {
      if (userPosition.value) charUsed.value = GeolocCharCost * destinationChannels.value.length;
      if (text.value) charUsed.value = text.value.length * destinationChannels.value.length;
      if (imageRef.value) charUsed.value = ImgCharCost * destinationChannels.value.length;
      if (selectedVideo.value) charUsed.value = VideoCharCost * destinationChannels.value.length;
    }, { flush: 'sync', deep: true, immediate: true, onTrack: null, onTrigger: null }, [destinationChannels]);
    /**
     * functions
     */
    const handleFileChange = (event) => {
      const selectedFile = event.target.files[0];

      if (selectedFile) {
        const reader = new FileReader();

        reader.onload = (e) => {
          const imageData = e.target.result;
          fileRef.value = selectedFile;
          imageRef.value = imageData;
          text.value = '';
          selectedVideo.value = '';
          userPosition.value = null;
          charUsed.value = ImgCharCost * destinationChannels.value.length;
        };

        reader.readAsDataURL(selectedFile);
      }
    };

    const openImageSelection = () => {
      imageInput.value.click();
    } 

    const deleteImage = () => {charUsed.value = 0; imageRef.value = null; fileRef.value = null};

    const openVideoSelection = () => {
      videoInput.value.click();
    }

    const handleVideoChange = (event) => {
      const selectedFile = event.target.files[0];
      event.target.value = '';
      console.log(selectedFile);
      fileRef.value = selectedFile;
      selectedVideo.value =  URL.createObjectURL(selectedFile);
      text.value = '';
      imageRef.value = '';
      userPosition.value = null;
      charUsed.value = VideoCharCost * destinationChannels.value.length;
      console.log('selectedVideo', selectedVideo.value);
      console.log('fileRef', fileRef.value);
    };

    const deleteVideo = () => { charUsed.value = 0; selectedVideo.value = null; fileRef.value = null; }
    
    const deletePosition = () => {userPosition.value = null; charUsed.value = 0;}
    //quote generation
    const generateRandomQuote = () => {
      const proxyUrl = 'http://api.quotable.io/random';
      fetch(proxyUrl)
        .then(res => res.json())
        .then((quote) => {
          text.value = `${quote.content} - ${quote.author}`;
          imageRef.value = null;
          fileRef.value = null;
          selectedVideo.value = null;
          userPosition.value = null;
          charUsed.value = text.value.length * destinationChannels.value.length; // You may adjust this value based on your requirements
        })
        .catch(error => {
          console.error('Error fetching quote:', error);
        });
    };

    const generateNews = async () => {
      const apiUrl =
        'https://api.thenewsapi.com/v1/news/top?api_token=jrlpUzNRyPoXW6GM9Vgl77UzH1toil19CsZIf03a&language=it&categories=science,travel,politics,tech';
  
      try {
        const response = await fetch(apiUrl, {
          method: 'GET',
          headers: {
            'Authorization': 'jrlpUzNRyPoXW6GM9Vgl77UzH1toil19CsZIf03a',
            // You may need to include other headers if required by the API
            // For example, 'Content-Type': 'application/json' for JSON requests
          },
        });
  
        const data = await response.json();
        const randomArticle = Math.floor(Math.random() * 3);
        const textArticle = data.data[randomArticle].title;
        const url = data.data[randomArticle].url;
  
        const resp = await fetch(`https://api.tinyurl.com/create`, {
          method: 'POST',
          headers: {
            'Authorization': 'Bearer J3xAPhU5PuuBUbM5oO1VI3gE3OnB5od7Le65rVirrWy42iaNJQVS69vSFJVX',
            'Content-type': 'application/json'
          },
          body: JSON.stringify({
            url: url,
            domain: 'tinyurl.com'
          })
        });
        
        const dataurl = await resp.json();
        const tinyurl = dataurl.data.tiny_url;
        text.value = `${textArticle} - ${tinyurl}`;
        imageRef.value = null;
        fileRef.value = null;
        selectedVideo.value = null;
        userPosition.value = null;
        charUsed.value = text.value.length * destinationChannels.value.length; // You may adjust this value based on your requirements
      } catch (error) {
        console.error('Error:', error.message);
      }
    };

    const getUserPos = () => {
      navigator.geolocation.getCurrentPosition((position) => {
        userPosition.value = {
          lat: position.coords.latitude,
          lng: position.coords.longitude
        }
        marker.value = {
          id: "user-marker",
          position: {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
          },
        }
        text.value = '';
        imageRef.value = null;
        fileRef.value = null;
        selectedVideo.value = null;
        charUsed.value = GeolocCharCost * destinationChannels.value.length;
      })
    }

    const setPlace = (place) => {
      userPosition.value.lat = place.geometry.location.lat()
      userPosition.value.lng = place.geometry.location.lng()
      // Update the location details
      locationDetails.value.address = place.formatted_address
      locationDetails.value.url = place.url
      marker.value = {
        id: "user-marker",
        position: {
          lat: place.geometry.location.lat(),
          lng: place.geometry.location.lng()
        },
      }

      console.log(userPosition.value);
    }

    const updateMarkerPosition = (event) => {
      const newPosition = {
        lat: event.latLng.lat(),
        lng: event.latLng.lng(),
      };

      // Update userPosition
      userPosition.value = newPosition;

      console.log(userPosition.value);
    };

    const includeReceiver = (index, array) => {
    if (array == "friends"){
      var exchangeArray = destinationUsers.value;
      const isSelected = destinationUsers.value.indexOf(index);
      if (isSelected >= 0){
        exchangeArray = exchangeArray.filter(username => username.username !== index.username)
      }
      else{
        exchangeArray.push(index);
      }
      destinationUsers.value = exchangeArray;
    }
    else{
      var exchangeArray = destinationChannels.value;
      const isSelected = destinationChannels.value.indexOf(index);
      if (isSelected >= 0){
        exchangeArray = exchangeArray.filter(name => name.name !== index.name)
      }
      else{
        exchangeArray.push(index);
      }
      destinationChannels.value = exchangeArray;
    }
  }

    /**
     * Pop up section
     */

    const isOpen = ref(false)

    function closeModal() {
      isOpen.value = false
    }
    const openModal = (totalCost, period) => {
      isOpen.value = true;
      periodSelected.value = period;
      total.value = totalCost;
    }

    const showReceivers = ref(false);

    const openReceivers = () => {
      if(containsTemporary.value == true) openTemporary();
      else showReceivers.value = true;
    }

    const closeReceivers = () => {
      showReceivers.value = false;
    }

    const showTemporizedReceivers = ref(false);

    const openTemporizedReceivers = () => {
      showTemporizedReceivers.value = true;
    }

    const closeTemporizedReceivers = () => {
      showTemporizedReceivers.value = false;
    }

    const planSqueal = () => {
      closeTemporizedReceivers();
      openTemporized();  
    }

    const userImageUrl = new URL(`../images/user.png`, import.meta.url).href
    const channelImageUrl = new URL(`../images/channel.jpeg`, import.meta.url).href

    const temporaryWarning = ref(false);
    const closeTemporary = () => {
      temporaryWarning.value = false;
    }

    const openTemporary = () => {
      temporaryWarning.value = true;
    }

    /**
     * SQUEAL CREATION
     */

    const postSqueal = () => {
      buyChars({
        clientId: userId,
        chars: charUsed.value - maxChar.value
      });
      var charsToPay = maxChar.value;
      var destinationFr = destinationUsers.value;
      var destinationCh = destinationChannels.value;

      destinationFr = destinationFr.map((obj) => obj._id);
      destinationCh = destinationCh.map((obj) => obj._id);

      if(containsTemporary.value == true) charsToPay = text.value.length;

      createSqueal({
        clientId: userId,
        file: fileRef.value || null,
        squealInput: {
          text: text.value,
          destinationUserIds: [...destinationFr],
          destinationChannels: [...destinationCh],
          typeOfUpload: (imageRef.value && "image") || (selectedVideo.value && "video") || null,
          lat: userPosition.value? userPosition.value.lat : null,
          lng: userPosition.value? userPosition.value.lng : null,
          keyword: containsTemporary.value ? text.value.match(/#(\w+)/)[1] : null,
          charactersCost: charsToPay
        }
      })
    }

    const overcharWarning = ref(false);
    
    const closeOver = () => {
      overcharWarning.value = false;
    }

    const postRegularSqueal = () => {
      if(charUsed.value > maxChar.value){
        overcharWarning.value = true;
      }
      else{
        var charsToPay = charUsed.value;
        var destinationFr = destinationUsers.value;
        var destinationCh = destinationChannels.value;
  
        destinationFr = destinationFr.map((obj) => obj._id);
        destinationCh = destinationCh.map((obj) => obj._id);
  
        if(containsTemporary.value == true) charsToPay = text.value.length;
  
        createSqueal({
          clientId: userId,
          file: fileRef.value || null,
          squealInput: {
            text: text.value,
            destinationUserIds: [...destinationFr],
            destinationChannels: [...destinationCh],
            typeOfUpload: (imageRef.value && "image") || (selectedVideo.value && "video") || null,
            lat: userPosition.value? userPosition.value.lat : null,
            lng: userPosition.value? userPosition.value.lng : null,
            keyword: containsTemporary.value ? text.value.match(/#(\w+)/)[1] : null,
            charactersCost: charsToPay
          }
        })
      }
    }

    const closeTemporized = () => {
      showTemporized.value = false;
    };
    const openTemporized = () => {
      showTemporized.value = true;
    }
    const createTemporized = () =>{
      closeTemporized();
      var destinationFr = destinationUsers.value;
      var destinationCh = destinationChannels.value;

      destinationFr = destinationFr.map((obj) => obj._id);
      destinationCh = destinationCh.map((obj) => obj._id);
      planTemporized({
        clientId: userId,
        squealInput: {
          text: temporizedSqueal.value,
          destinationUserIds: [...destinationFr],
          destinationChannels: [...destinationCh],
          typeOfUpload: null,
          lat: null,
          lng: null,
          keyword: null,
          repetitions: parseInt(temporizedRepetitions.value),
          delay: parseInt(selectedTimeFrame.value)
        },
        file: null
      });
    };   

  const correctText = "Squeal creato con successo";
  const errorText = "Squeal non creato";
  const correctTemporizedText = "Pianificazione avvenuta con successo";
  const errorTemporizedText = "Pianificazione non avvenuta.";
  const planText = "Pianifica pubblicazione";
  const noImagePath = new URL(`../images/no_image.png`, import.meta.url).href
  const loadingColor = "#ff3385";
  const loadingSize = "60px";
</script>

<style scoped>
@keyframes slideUp{
      0% {
        bottom: -600px;
      }
      100% {
        bottom: 0px;
      }
    }

.tempRec{
  font-size: 22px;
  text-align: center;
  margin-bottom: 20px;
}
.loadingContainer{
    width: 100%;
    display: flex;
    justify-content: center;
  }
  .content-container{
    padding-left: 18%;
    padding-bottom: 100px;
    display: flex;
    width: 100%;
    flex-direction: column;
    align-items: center;
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

.newSquealContainer{
  overflow: hidden;
  width: 700px;
}

.buttonActions{
  width: 100%;
  display: flex;
  justify-content: space-between;
  padding-inline: 15px;
  margin-bottom: 20px;
  display: none;
}

.textRow{
  display: flex;
  align-items: start;
  margin-left: 15px;
  margin-right: 20px;
  position: relative;
  margin-bottom: 50px;
}

.imgProfile{
    width: 50px;
    height: 50px;
    border-radius: 50%;
    margin-right: 20px;
    border: 1px solid black
  }

.styledTextarea{
  box-sizing: border-box;
  resize: none;
  font-size: 18px;
  width: 65%;
  margin-right: 10px;
}

.styledTextarea:focus{
  outline: none;
}

.mapContainer{
  width: 70%;
  position: relative;
  display: flex;
  justify-content: flex-start;
}

.autocompleteG{
  position: absolute;
  top: 10px;
  left: 10px;
  z-index: 5;
  padding: 5px;
  border: 1px solid grey;
  border-radius: 10px;
  color: black;
}
.mapNewSqueal{
  width: 400px;
  height: 400px;
}

.xIcon{
  position: absolute;
  right: 5px;
  top: 5px;

  height: 25px;
  width: 25px;
  cursor: pointer;
}

.imageSqueal{
  width: 70%;
  display: flex;
  justify-content: center;  
  position: relative;
}

.squealImage{ 
    width: 80%;
    height: auto;
  }

  .orange{
    color: orange;
  }

.videoSqueal{
  position: relative;
  width: 70%;
  display: flex;
  justify-content: center;
}

video{
    width: 80%;
    height: auto;
  }

.iconRow{
  display: flex;
  justify-content: space-between;
  margin-right: 20px;
}

.iconActionBar{
  display: flex;
  padding-left: 10px;
}

.iconLink{
  width: 35px;
  height: 35px;
  padding: 5px;
  border-radius: 10px;
}

.iconLink:hover{
  background: #eeeeee;
}

.charBigTitle{
  display: none;
}

.charIndicator{
  display: flex;
  justify-content: center;
}

.charValue{
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: 0px 15px;
  line-height: 1.2;
}

.charTitle{
  font-size: 14px;
}

.charNumber{
  font-size: 16px;
  font-weight: 600;
}

.iconPost{
  position: relative;
  cursor: pointer;
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
}

.bg-w{
  background-color: white;
}

.bg-b{
  background-color: black;
  opacity: 0.25;
}

.inputVideo{
  display: none;
}
.iconPost:hover{
  .tooltip{
    visibility: visible;
    opacity: 1;
    z-index: 5;
  }
}

.buttonContainer{
  width: 50%;
  justify-content: space-around;
  display: flex;
}
.fullB{
  font-size: 18px;
  color: white;
  background-color: #ff3385;
  border: 1px solid #ff3385;
  padding: 5px 15px;
  border-radius: 10px;
}

.fullB:hover{
  color: #ff3385;
  background-color: white;
  transition: all 0.2s ease-in-out;
}

.emptyB{
  font-size: 18px;
  color: #ff3385;
  background-color: white;
  border-radius: 10px;
  padding: 3px 9px;
  border: 2px solid #ff3385;
}

.emptyB:hover{
  color: white;
  background-color: #ff3385;
  transition: all 0.2s ease-in-out;
}

.receiversContainer{
  border-radius: 15px;
  width: 100%;
  overflow-y: hidden;
  scrolling-behaviour: smooth;
  background: white;
  display: flex;
  max-height: 500px;
  z-index: 10;
}
.receiversColumn{
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: 10px 0px;
  padding: 0px 10px;
  width: 50%;
  overflow-x: hidden;
}
.columns::-webkit-scrollbar {
    display: none;
  }
  .br{
    border-right: 1px solid lightcoral;
  }
.receiverTitle{
  font-weight: 600;
  font-size: 18px;
  margin-bottom: 15px;
}
.receiverSearch{
  width: 100%;
  margin-top: 10px;
  margin-bottom: 10px;
  border-radius: 5px;
  border: 1px solid #949494;
  padding: 5px 10px;
}

.receiverSearch:focus{
  outline: none;
  border: 1px solid #ff3385;
  box-shadow: 0px 0px 1px 1px #ff3385;
}
.singleReceiver{
  margin-bottom: 10px;
  display: flex;
  align-items: center;
  width: 100%;
  padding: 5px 20px 5px 10px;
  justify-content: start;
  color: white;
  border-radius: 15px;
  position: relative;
  cursor: pointer;
}

.singleReceiver img{
  width: 30px;
  height: 30px;
  margin-right: 10px;
  border-radius: 50%;
}
.receiverName{
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
  width: 100px;
  color: black;
}
.selected{
  position: absolute;
    right: -10px;
    width: 25px;
    height: 25px;
}

.temporizedContainer{
  display: flex;
  justify-content: center;
  width: 100%;
  position: absolute;
  background: white;
  top: 10%;
  z-index: 10;
}
.temporizedForm{
  padding: 1.5rem 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 50%;
  position: fixed;
  border-radius: 15px;
  background: white;
}
.temporizedTitle{
  font-size: 25px;
  margin-bottom: 10px;
  font-weight: 600;
  margin-left: 5px;
}
.textDiv{
  margin: 0.5rem;
  width: 70%;
  text-align: left;
}
.tempTextContainer{
  font-size: 16px;
  margin-bottom: 30px;
}
.temporizedTextContainer{
  width: 70%;
  display: flex;
  flex-direction: column;
  align-items: start;
}
.inputName{
  font-size: 18px;
  margin-bottom: 10px;
}
.temporizedTextArea{
  padding: 10px;
  width: 100%;
  height: 150px;
  border-radius: 10px;
  border: 1px solid #ff3385;
}
.temporizedRow{
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  position: relative;
}
.choiceContainer{
  width: 60%;
  margin-top: 20px;
  display: flex;
  justify-content: space-between;
}
.temporizedRepetition{
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 45%;
}
.choice{
  font-size: 14px;
}
.temporizedInput{
  border: 1px solid #ff3385;
  border-radius: 5px;
  width: 100px;
  text-align: center;
  font-size: 18px;
}
.noArrows{
  -moz-appearance: textfield;
}

.noArrows::-webkit-inner-spin-button,
  .noArrows::-webkit-outer-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }
.noArrows[type="number"] {
  -moz-appearance: textfield; /* Firefox */
}
.red{
  color: red;
}


@media(max-width: 576px){
  .content-container{
    margin-top: 60px;
  }

  .title{
    display: none;
  }

  .disappearDiv, .disappearButton{
    display: none;
  }

  .content-container{
    padding-inline: 10px;

  }
  .newSquealContainer{
    width: 100%;
  }
  .receiversContainer{
    top: 20%;
    max-height: 350px;
  }
  .buttonActions{
    display: flex;
  }

  .flexRow{
    margin-inline: 5px;
    margin-bottom: 10px;
  }

  .imgProfile{
      width: 40px;
      height: 40px;
      margin-right: 10px;
    }

    .styledTextarea{
      width: 100%;
    }

    .mapContainer{
      width: 100%;
      justify-content: start;
    }
    .mapNewSqueal{
      width: 250px;
      height: 250px;
    }

    .xIcon{
      height: 20px; 
      width: 20px;
      right: -5px;
    }

    .imageSqueal{
      width: 100%;
    }

    .squealImage{
      width: 90%;
      height: auto;
    }

    .videoSqueal{
      width: 100%;
    }

    video{
      width: 90%;
      height: auto;
    }

    .iconRow{
      flex-direction: column;
      margin-top: 25px;
    }

    .iconActionBar{
      margin-left: 10px;
      padding-left: 0px;
      margin-top: 50px;
    }

    .iconLink{
      margin-right: 5px;
    }

    .charBigTitle{
      display: block;
      font-size: 18px;
      font-weight: 600;
      color: #ff3385;
      margin-left: 10px;
      margin-top: 20px;
    }

    .charIndicator{
      margin-top: 10px;
      margin-bottom: 10px;
      justify-content: start;
    }

    .charTitle{
      font-size: 12px;
    }

    .charNumber{
      font-size: 14px;
    }

    .temporizedContainer{
      height: 600px;
      animation: slideUp 0.3s ease-in-out;
      bottom: 0px;
      top: auto;
      border-top-right-radius: 20px;
      border-top-left-radius: 20px;
    }
    .temporizedForm{
      width:100%;
    }
    .textDiv{
      width:90%;
      font-size: 14px;
    }
    .tempTextContainer{
      font-size: 12px;
      margin-bottom: 5px;
    }
    .temporizedTextContainer{
      width: 90%;
    }
    .temporizedTextArea{
      height:100px;
      font-size: 16px;
    }
    .temporizedRow{
      justify-content: space-around;
    }
    .temporizedInput{
      font-size: 14px;
      width: 50px;
    }
}
</style>
