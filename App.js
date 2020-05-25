import React from 'react';
import Campobase from './componentes/CampobaseComponent';
import { Provider } from 'react-redux';
//import { ConfigureStore } from './redux/configureStore';
//const store = ConfigureStore();
import { store } from "./redux/configureStore";
export default class App extends React.Component {
    render() {
        return (
            <Provider store={store}>
                <Campobase />
            </Provider>
        );
    }
}