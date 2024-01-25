import gql from "graphql-tag";

export const GET_CLIENTS = gql`
  query getClients{
    getClients{
      username
      profileImage
      nome
      cognome
      squeals
      _id
    }
  }
`

export const GET_CLIENT_STATS = gql`
  query getClientStats($clientId: String!){
    getClientStats(clientId: $clientId){
      totalPositive
      totalNegative
      totalComments
      totalPosts
      totalViews
      populars
      impopulars
      controverse
      regular
      client{
        nome
        cognome
        _id
        profileImage
        bio
        username
        friends
        channels
        squeals
      }
    }
  }
`

export const GET_CLIENT_SQUEALS = gql`
query getClientSqueals($clientId: String!){
  getClientSqueals(clientId: $clientId){
    squeals{
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
      uploadedFile
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
    client{
      username
      profileImage
      nome
      cognome
      _id
    }
  }
}
`

export const GET_NOTIFICATIONS = gql`
  query getClientNotifications($clientId: String!){
    getClientNotifications(clientId: $clientId){
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

export const GET_SMM_NOTIFICATIONS = gql`
  query getNotifications{
    getNotifications{
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


export const GET_CLIENT = gql`
  query getClient($clientId: String!){
    getClient(clientId: $clientId){
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

export const GET_CLIENT_RECEIVERS = gql`
query getClientReceivers($clientId: String!){
  getClientReceivers(clientId: $clientId){
    channels{
      name
      channelImage
      _id
    }
    friends{
      username
      profileImage
      _id
    }
  }
}
`

export const GET_PROFILE = gql`
query getSmmProfile{
  getSmmProfile{
    smm{
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
    reviewers{
      _id
      nome
      cognome
      profileImage
    }
  }
}
`

export const GET_CHATS = gql`
query{
  getChatsSmm{
    chats{
      _id
      smmId
      clientId
      texts{
        text
        senderId
        date
      }
    }
    clients{
      _id
      nome
      cognome
      profileImage
    }
  }
}
`

export const CLIENT_MONTH_DATA =gql`
query monthDataClient($clientId: String!){
  monthDataClient(clientId: $clientId){
    controverse{
      label
      value
    }
    normal{
      label
      value
    }
    impopular{
      label
      value
    }
    popular{
      label
      value
    }
  }
}
`