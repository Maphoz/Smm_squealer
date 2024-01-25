import { createApp, provide } from 'vue'
import App from './App.vue'
import router from './router'
import { ApolloClient, InMemoryCache, createHttpLink } from '@apollo/client/core'
import { DefaultApolloClient } from '@vue/apollo-composable'
import {h} from 'vue'
import createUploadLink from 'apollo-upload-client/createUploadLink.mjs'
import { useCookies } from "vue3-cookies"
import {setContext} from "@apollo/client/link/context"
import './style.css'
import { vue3Spinner } from 'vue3-spinner'
import VueGoogleMaps from "@fawmi/vue-google-maps";

const httpLink = createUploadLink({
  uri: 'http://localhost:8000/graphql',
});


const {cookies} = useCookies();

const authLink = setContext((_, {headers}) => {
  const token = cookies.get('accessTokenSmm');
  return{
    headers: {
      ...headers, 
      Authorization: token ? `Bearer ${token}` : ""
    }
  }
})

const apolloClient = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache()
})

const app = createApp({
  setup() {
    provide(DefaultApolloClient, apolloClient)
  },
  
  render: () => h(App)
})

app.use(router);
app.use(vue3Spinner).use(VueGoogleMaps, {
  load: {
    key: 'AIzaSyDU3irmdSk97jenRAJTJXCWjBpI8-wY4Zs',
    v: '3.54',
    libraries: 'places',
  },
}).mount('#app');
