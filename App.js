import { NavigationContainer } from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack'
import { RecoilRoot } from 'recoil';
import CameraScreen from './components/CameraScreen';
import Categories from './components/Categories';
import CategoryDetailScreen from './components/CategoryDetailScreen';

const Stack = createNativeStackNavigator()

export default function App() {

  return (
    <RecoilRoot >
      <NavigationContainer>
        <Stack.Navigator>
        <Stack.Screen
        name="Categories"
        component={Categories}
        />
        <Stack.Screen
        name="CategoryDetail"
        component={CategoryDetailScreen}
        />
        <Stack.Screen
        name="CameraScreen"
        component={CameraScreen}
        />
        </Stack.Navigator>
      </NavigationContainer>
    </RecoilRoot>
  );
}
