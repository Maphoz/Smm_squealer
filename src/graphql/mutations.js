import gql from "graphql-tag";

export const REGISTER_USER = gql`
 mutation createSmm($userInfo: CreateSMMInput!, $file: Upload!){
  createSmm(userInfo: $userInfo, file: $file){
    _id
    nome
    cognome
  }
 }
`
export const LOGIN = gql`
  mutation login($loginUserInput: LoginUserInput!){
    login(loginUserInput: $loginUserInput){
      accessToken
    }
  }
`


export const ACCEPT_FRIEND = gql`
  mutation acceptFriendRequestSmm($notificationId: String!, $clientId: String!){
    acceptFriendRequestSmm(notificationId: $notificationId, clientId: $clientId){
     relationalNotifications{
        _id
        notificationText
        active
        createdAt
        senderType
        notificationType
      }
      interactiveNotifications{
        _id
        notificationText
        active
        createdAt
        senderType
        notificationType
      }
    }
  }
`

export const REFUSE_FRIEND = gql`
  mutation refuseFriendRequestSmm($notificationId: String!, $clientId: String!){
    refuseFriendRequestSmm(notificationId: $notificationId, clientId: $clientId){
      relationalNotifications{
        _id
        notificationText
        active
        createdAt
        senderType
        notificationType
      }
      interactiveNotifications{
        _id
        notificationText
        active
        createdAt
        senderType
        notificationType
      }
    }
  }
`

export const ACCEPT_CHANNEL = gql`
  mutation acceptChannelRequestSmm($notificationId: String!, $clientId: String!){
    acceptChannelRequestSmm(notificationId: $notificationId, clientId: $clientId){
      relationalNotifications{
        _id
        notificationText
        active
        createdAt
        senderType
        notificationType
      }
      interactiveNotifications{
        _id
        notificationText
        active
        createdAt
        senderType
        notificationType
      }
    }
  }
`

export const REFUSE_CHANNEL = gql`
  mutation refuseChannelRequestSmm($notificationId: String!, $clientId: String!){
    refuseChannelRequestSmm(notificationId: $notificationId, clientId: $clientId){
      relationalNotifications{
        _id
        notificationText
        active
        createdAt
        senderType
        notificationType
      }
      interactiveNotifications{
        _id
        notificationText
        active
        createdAt
        senderType
        notificationType
      }
    }
  }
`


export const BUY_CHARS_CLIENT = gql`
  mutation addCharsClient($chars: Float!, $period: String!, $clientId: String!){
    addCharsClient(chars: $chars, period: $period, clientId: $clientId){
      _id
      nome
      cognome
      userType
      caratteri_giornalieri_rimanenti
      caratteri_settimanali_rimanenti
      caratteri_mensili_rimanenti
      profileImage  
    }
  }
`

export const REDUCE_CHARS_CLIENT = gql`
  mutation reduceCharsClient($chars: Float!, $clientId: String!){
    reduceCharsClient(chars: $chars, clientId: $clientId)
  }
`

export const DELETE_CLIENT_SQUEALS = gql`
  mutation deleteClientSqueal($squealId: String!, $clientId: String!){
    deleteClientSqueal(squealId: $squealId, clientId: $clientId){
      reactions{
        type
      }
      views
      _id
      text
      uploadedFile
      typeOfUpload
      classification
      channelName
      comments{
        text
        user{
          nome
          cognome
          username
          profileImage
        }
        date
      }
      publicationDate
      geolocation{
        latitude
        longitude
      }
    }
  }
`

export const CREATE_SQUEAL_CLIENT = gql`
  mutation createClientSqueal($squealInput: CreateSquealInput!, $file: Upload, $clientId: String!){
    createClientSqueal(squealInput: $squealInput, file: $file, clientId: $clientId)
  }
`

export const CREATE_TEMPORIZED_SQUEAL_CLIENT = gql`
  mutation createTemporizedClientSqueal($squealInput: CreateSquealInput!, $file: Upload, $clientId: String!){
    createTemporizedClientSqueal(squealInput: $squealInput, file: $file, clientId: $clientId)
  }
`

export const UPDATE_PROFILE = gql`
  mutation updateSmm($userInfo: UpdateSmm, $file: Upload){
    updateSmm(userInfo: $userInfo, file: $file){
      _id
      nome
      cognome
      username
      email
      rating
      price
      profileImage
      assistedList
      bio
      reviews{
        text
        senderId
        rating
      }
    }
  }
`

export const ACCEPT_SMM = gql`
  mutation acceptSmmRequest($notificationId: String!){
    acceptSmmRequest(notificationId: $notificationId){
     relationalNotifications{
        _id
        notificationText
        active
        createdAt
        senderType
        notificationType
      }
      interactiveNotifications{
        _id
        notificationText
        active
        createdAt
        senderType
        notificationType
      }
    }
  }
`

export const REFUSE_SMM = gql`
  mutation refuseSmmRequest($notificationId: String!){
    refuseSmmRequest(notificationId: $notificationId){
      relationalNotifications{
        _id
        notificationText
        active
        createdAt
        senderType
        notificationType
      }
      interactiveNotifications{
        _id
        notificationText
        active
        createdAt
        senderType
        notificationType
      }
    }
  }
`

export const NEW_MESSAGE = gql`
mutation addMessage($text: String!, $channelId: String!){
	addMessage(text: $text, channelId: $channelId){
    smmId
    clientId
    texts{
      text
      senderId
      date
    }
  }
}
`

export const DELETE_CLIENT = gql`
  mutation removeClient($clientId: String!){
    removeClient(clientId: $clientId){
      username
      profileImage
      nome
      cognome
      squeals
      _id
    }
  }
`