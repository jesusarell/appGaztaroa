import React, { useState, useEffect } from 'react';
import NetInfo from '@react-native-community/netinfo';
import { SafeAreaView, Text } from 'react-native';
//Importante debemos instalar  @react-native-community/netinfo:
// yarn add @react-native-community/netinfo
//Documentación: https://github.com/react-native-community/react-native-netinfo
//Documentación adicional: https://aprogrammingblog.com/react%20native/2019/02/09/react-native-offline-notice.html
//Documentación adicional: https://medium.com/dailyjs/offline-notice-in-react-native-28a8d01e8cd0
//Documentación adicional: https://stackoverflow.com/questions/61187090/react-native-netinfo-dosent-work-after-once-did-work
const NetworkStatus = () => {
    const [isInternetReachable, setIsInternetReachable] = useState(false);
    useEffect(() => {
        const unsubscribe = NetInfo.addEventListener(state => {
            setIsInternetReachable(state.isInternetReachable);
        });
        return () => {
            unsubscribe();
        };
    }, []);
    if (isInternetReachable) {       
        return null;
    }
    return (
        <SafeAreaView style={{ backgroundColor: 'red', height: 50 }}>
            <Text
                style={{
                    color: 'white',
                    fontSize:16,
                    fontWeight: '500',
                    padding: 12,
                    textAlign: 'center'
                }}>
                No disponde de conexión a internet
        </Text>
        </SafeAreaView>
    );
}
export default NetworkStatus;