import { createStore, combineReducers, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import logger from 'redux-logger';
import { excursiones } from './excursiones';
import { comentarios } from './comentarios';
import { cabeceras } from './cabeceras';
import { actividades } from './actividades';
import { favoritos } from './favoritos';
import { AsyncStorage } from 'react-native';
import { persistStore, persistReducer } from 'redux-persist';


// export const ConfigureStore = () => {
//     const store = createStore(
//         combineReducers({
//             excursiones,
//             comentarios,
//             cabeceras,
//             actividades,
//             favoritos
//         }),
//         applyMiddleware(thunk, logger)
//     );

const persistConfig = {
    key: 'root',
    storage: AsyncStorage,
    whitelist: ['favoritos'] //En la configuración podemos espeficiar que reducers queremos que persistan. Todos los demás se ignoran. Podriamos espeficicar una blaclist pero por simplicidad mejor asi ya que solo nos interesa persisitir uno.
    //Documentación oficial: https://github.com/rt2zz/redux-persist
    //Blog que explica redux-persist: instalación y configuración: https://blog.reactnativecoach.com/the-definitive-guide-to-redux-persist-84738167975
    //Para una correcta configuración empleando expo: https://medium.com/survival-development/simple-redux-persist-configuration-in-react-native-expo-environment-5cae7c4a22
    // Implementación de AsyncStore por:
        //"It does not persist by itself. You need to define an Storage Engine that will interact with something (cookie, db, etc) in order to keep the memory. Here we will use AsyncStorage"
};


const pReducer = persistReducer(persistConfig, combineReducers({
    excursiones,
    comentarios,
    cabeceras,
    actividades,
    favoritos
})
);

const store = createStore(
    pReducer,
    applyMiddleware(thunk, logger)
);

const persistor = persistStore(store);
export {persistor, store};