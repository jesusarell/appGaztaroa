import React from 'react';
import Campobase from './componentes/CampobaseComponent';
import { Provider } from 'react-redux';
//import { ConfigureStore } from './redux/configureStore';
//const store = ConfigureStore();
import { store } from "./redux/configureStore";
import NetworkStatus from './componentes/NetworkStatusComponent';
export default class App extends React.Component {
    render() {
        return (
            <Provider store={store}>
                <Campobase />
                <NetworkStatus></NetworkStatus> 
                {/*Lo pongo debajo del render de campo base para no tener problemas con el notch de algunos dispositivos móviles. Otra opcion sería emplear aquí un SafeAreaProvider. */}
            </Provider>
        );
    }
}