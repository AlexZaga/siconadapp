import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { SafeAreaProvider } from 'react-native-safe-area-context'
import { useRoute } from '@react-navigation/native'
import Asignaturas from './Asignaturas' 
import CalendarioPago from './CalendarioPagos'
import EdoCta from './EstadoCuenta'

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

export default function Dashboard() {
  const { params: { _nombre, _matricula, _cde, _grupo, _plan, _id, _correo } } = useRoute('Login')

  return (
    <SafeAreaProvider>
      <Stack.Navigator initialRouteName="Asignaturas" screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Asignaturas">
        {() => (
          <Tab.Navigator initialRouteName="Dashboard" screenOptions={{ headerShown: false }}>
            <Tab.Screen name="Dashboard" children={() => { return(<Asignaturas nombre={_nombre} matricula={_matricula} cde={_cde} grupo={_grupo} plan={_plan} correo={_correo}/>)}} />
            <Tab.Screen name="CalendarioPago" component={CalendarioPago} />
            <Tab.Screen name="EdoCta" component={EdoCta} />
          </Tab.Navigator>
        )}
        </Stack.Screen>
        <Stack.Screen name="EdoCta" component={EdoCta} />
      </Stack.Navigator>
    </SafeAreaProvider>
  );
}
