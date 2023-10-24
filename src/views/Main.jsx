import React from 'react'
import { NavigationContainer } from '@react-navigation/native'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import Splash from './Splash'
import Login from './Login'
import Dashboard from './Dashboard'
import TableDetails from './TableDetails'

const Stack = createNativeStackNavigator()

export default function App() {
  return (
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Bienvenido" screenOptions={{ headerShown: false }}>
          <Stack.Screen name='Bienvenido' component={Splash} options={{ animationTypeForReplace: 'pop' }} />
          <Stack.Screen name='AHJ ENDE' component={Login} options={{ animationTypeForReplace: 'push' }} />
          <Stack.Screen name='Dashboard' component={Dashboard} options={{ animationTypeForReplace: 'push' }} />
          <Stack.Screen name='TableDetails' component={TableDetails} options={{ animationTypeForReplace: 'push' }} />
        </Stack.Navigator>
      </NavigationContainer>
  )
}
