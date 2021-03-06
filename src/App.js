import React, { Fragment } from 'react'
import Main from './components/Main'

import appSyncConfig from "./AppSync"
import { ApolloProvider } from "react-apollo"
import AWSAppSyncClient from "aws-appsync"
import { Rehydrated } from "aws-appsync-react"
import Amplify, {I18n, Auth} from "aws-amplify"
import { withAuthenticator } from "aws-amplify-react"

const App = () => {
  // console.log('> App');
  return (
    <Fragment>
      <Main />
    </Fragment>
  )
}

I18n.putVocabularies({
  'ru': {
    'Sign In Account': "Войдите в систему",
    'Username': "Логин",
    'Password': "Пароль",
    'Sign In': "Вход"
  }
})

I18n.setLanguage('ru')

Amplify.configure({
  Auth: {
    // identityPoolId: process.env.REACT_APP_IDENTITY_POOL_ID,
    region: process.env.REACT_APP_AWS_AUTH_REGION, // REQUIRED - Amazon Cognito Region
    userPoolId: process.env.REACT_APP_USER_POOL_ID, //OPTIONAL - Amazon Cognito User Pool ID
    userPoolWebClientId: process.env.REACT_APP_CLIENT_APP_ID //User Pool App Client ID
  }
});

const client = new AWSAppSyncClient({
  url: appSyncConfig.graphqlEndpoint,
  region: 'eu-west-1',
  auth: {
    type: "AMAZON_COGNITO_USER_POOLS",
    jwtToken: async () => (await Auth.currentSession()).getAccessToken().getJwtToken()
  },
  disableOffline: true
})

const WithProvider = () => (
  <ApolloProvider client={client}>
    <Rehydrated>
      <App />
    </Rehydrated>
  </ApolloProvider>
)

export default withAuthenticator(WithProvider, false )

// export default App;
