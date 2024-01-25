<template>
  <KeepAlive>
    <div key="user-activity-component">
  <div class="page-container">
      <SideNav :pathId="0"/>
      <Header :pathId="0"/>

      <div v-if="loadingChats" class="loading-container">
        <div class="loadingContainer">
          <BounceLoader :loading="loadingChats" :color="loadingColor" :size="loadingSize"/>
        </div>
      </div>      
      <div v-if="!loadingChats" class="content-container">
        <h1 class="title">Chats </h1>
        <div v-if="chats.length > 0" class="container px-8">
          <div class="min-w-full border border-light rounded lg:grid lg:grid-cols-3">
            <div class="border-r br lg:col-span-1">

              <ul class="overflow-auto h-[32rem]">
                <h2 class="my-2 mb-2 ml-2 text-lg text-gray-600">Clienti</h2>
                <li>
                  <a v-for="chat in chats" :key="chat._id"
                    class="flex items-center px-3 py-2 text-sm transition duration-150 ease-in-out border-gray-300 cursor-pointer hover:bg-gray-100 focus:outline-none"
                    @click="() => showChat(chat)"
                  >
                    <img class="object-cover w-10 h-10 rounded-full"
                      :src="chat.client.profileImage" alt="username" />
                    <div class="w-full pb-2">
                      <div class="flex justify-between">
                        <span class="block ml-2 font-semibold text-gray-600">{{chat.client.nome}} {{ chat.client.cognome }}</span>
                        <span v-if="chat.texts.length > 0" class="block ml-2 text-sm text-gray-600">{{ formatTimeDifference(new Date(chat.texts[chat.texts.length - 1].date))}}</span>
                      </div>
                      <span v-if="chat.texts.length > 0" class="block ml-2 text-sm text-gray-600">{{ chat.texts[chat.texts.length - 1].text}}</span>
                    </div>
                  </a>
                </li>
              </ul>
            </div>
            <div v-if="selectedChat" class="hidden lg:col-span-2 lg:block">
              <div class="w-full">
                <div class="relative flex items-center p-3 bb border-gray-300">
                  <img class="object-cover w-10 h-10 rounded-full"
                    :src="selectedChat.client.profileImage" alt="username" />
                  <span class="block ml-2 font-bold text-gray-600">{{selectedChat.client.nome}} {{ selectedChat.client.cognome }}</span>
                  <span class="absolute w-3 h-3 bg-green-600 rounded-full left-10 top-3">
                  </span>
                </div>
                <div class="relative w-full p-6 overflow-y-auto h-[40rem]">
                  <ul class="space-y-2" ref="lastMessage">
                    <li v-for="(message, index) in selectedChat.texts" :class="{'flex justify-start' : message.senderId == selectedChat.clientId, 'flex justify-end' : message.senderId !== selectedChat.clientId}">
                      <div :class="{'relative max-w-xl px-4 py-2 clientMessage rounded shadow' : message.senderId == selectedChat.clientId, 'relative max-w-xl px-4 py-2 myMessage rounded shadow' : message.senderId !== selectedChat.clientId}">
                        <span class="block">{{message.text}}</span>
                      </div>
                    </li>
                  </ul>
                </div>

                <div class="flex items-center justify-between w-full p-3 bt">
                  <input v-model="newMessage" type="text" placeholder="Message"
                    class="block w-full py-2 pl-4 mx-3 bg-g rounded-full inputF"
                    name="message" required />
                  <button @click="submitMessage" type="submit">
                    <svg class="w-5 h-5 text-gray-500 origin-center transform rotate-90" xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20" fill="currentColor">
                      <path
                        d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div v-if="chats.length == 0" class="noInfoMessage">
            <img src="../images/alertIcon.png" alt="Nessuna notifica"/>
            <div class="messageNoContainer">
              Non hai clienti con cui chattare
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
import { GET_CHATS } from '../graphql/queries'; // Adjust the path based on your project structure
import { useRoute } from "vue-router";
import { formatTimeDifference } from "../utils/utils";
import {positiveReactions} from "../utils/fixed"
import {BounceLoader} from "vue3-spinner"
import ErrorMessage from '../components/ErrorMessage.vue';
import CorrectMessage from '../components/CorrectMessage.vue';

import {
  TransitionRoot,
  TransitionChild,
  Dialog,
  DialogPanel,
  DialogTitle,
} from '@headlessui/vue'
import { NEW_MESSAGE } from "../graphql/mutations";
import Header from "../components/header.vue";

const { loading: loadingChats, result: resultChats, refetch: refetchChats } = useQuery(GET_CHATS);

const chats = ref([]);
const clientsShow = ref([]);
const selectedChat = ref();

const fetchData = async () => {
  await refetchChats();
  clientsShow.value = resultChats.value.getChatsSmm.clients;
  chats.value = mergeClientsAndChats(resultChats.value.getChatsSmm.clients, resultChats.value.getChatsSmm.chats);
  console.log(chats.value, clientsShow.value);
};

// Fetch data on component mount
onBeforeMount(() => {
  fetchData();
});

const isOpen = ref(false)

function closeModal() {
  isOpen.value = false;
}
function openModal(squealId) {
  squealToDelete.value = squealId;
  isOpen.value = true;
}

function mergeClientsAndChats(clients, chats) {
  // Create a map for quick lookups based on _id
  const clientsMap = new Map(clients.map(client => [client._id, client]));

  // Iterate through the chats and merge with corresponding client data
  const mergedChats = chats.map(chat => {
    const client = clientsMap.get(chat.clientId);
    return {
      ...chat,
      client: client || null, // Include client data or set to null if not found
    };
  });

  return mergedChats;
}

const showChat = (chat) => {
  selectedChat.value = chat;
  lastMessage.value =
  scrollToBottom();
}


const showError = ref(false);
const showCorrect = ref(false);
const loadingColor = "#ff3385";
const loadingSize = "60px";

/**
 * new messages
 */
const errorText = "Messaggio non inviato."

const newMessage = ref('');
const lastMessage = ref();
const {onDone, mutate: sendMessage, onError} = useMutation(NEW_MESSAGE);

onDone((result) => {
  const updatedChats = chats.value.map(chat => {
    if (chat._id === selectedChat.value._id) {
      // Update the selected chat with the new message
      const updatedChat = {
        ...chat,
        texts: [...result.data.addMessage.texts],
      };
      return updatedChat;
    }
    return chat;
  });

  // Update the reactive chats variable
  chats.value = updatedChats;
  selectedChat.value.texts = result.data.addMessage.texts;

  // Clear the newMessage input field
  newMessage.value = '';
  scrollToBottom();
})

onError(() => {
  showError.value = true;
  setTimeout(() => {
    showError.value=false;
  }, 1500);
})

const submitMessage = () => {
  sendMessage({
    text: newMessage.value,
    channelId: selectedChat.value._id
  });
}


const scrollToBottom = () => {
  lastMessage.value.scrollTop = lastMessage.value.scrollHeight;
};
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

.myMessage{
  background-color: lightgray;
}

.clientMessage{
  background-color: #ff338533;
}

.border-light{
  border-width: 2px;
  border-radius: 10px;
  border-style: solid;
  border-color: #ff338566;
}

.br{
  border-right: 2px solid #ff338566;
}

.bb{
  border-bottom: 2px solid #ff338566;
}

.bt{
  border-top: 2px solid #ff338566;
}

.bg-g{
  background-color: lightgray;
}
.inputF:focus{
  background-color: white;
  outline-color: #ff338588;
}



@media(max-width: 576px){
  .loading-container, .content-container{
    padding-inline: 10px;
  }

  .title{
    font-size: 25px;
  }

}
</style>
