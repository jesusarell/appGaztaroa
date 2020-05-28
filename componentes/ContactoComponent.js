import React, { Component } from 'react';
import { Text, ScrollView, View } from 'react-native';
import { Card, Icon } from 'react-native-elements';
import * as MailComposer from 'expo-mail-composer';

class Contacto extends Component {

    //Para la implementacion de la funcionalidad de enviar un correo electronico se va a emplear Mail-Composer.
    // Documentación oficial de expo: https://docs.expo.io/versions/latest/sdk/mail-composer/
    // Necesaria instalación: expo install expo-mail-composer

    //Tenemos que declarar un nuevo método para la clase Contacto.
    sendMail() {
        MailComposer.composeAsync({
            subject: 'Contacto a través App club de montaña Gaztaroa',
            body: 'Introduzca aquí el contenido de su mensaje.',
            recipients: ['gaztaroa@gaztaroa.com']
        });
    }
    render() {
        return (
            <ScrollView>
            <Card title="Información de contacto"
                featuredTitle="Contacto">
                <Text style={{ margin: 10 }}>
                    Kaixo Mendizale!{'\n'}{'\n'}
                Si quieres participar en las salidas de montaña que organizamos o quieres hacerte soci@ de Gaztaroa, puedes contactar con nosotros a través de diferentes medios. Puedes llamarnos por teléfono los jueves de las semanas que hay salida (de 20:00 a 21:00). También puedes ponerte en contacto con nosotros escribiendo un correo electrónico, o utilizando la aplicación de esta página web. Y además puedes seguirnos en Facebook.{'\n'}{'\n'}
                Para lo que quieras, estamos a tu disposición!{'\n'}{'\n'}
                Tel: +34 948 277151{'\n'}{'\n'}
                Email: gaztaroa@gaztaroa.com
                </Text>
            </Card>
            <Card title="Enviar correo">
                <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'center' }}>
                    <Icon
                        raised
                        reverse
                        name='envelope'
                        type='font-awesome'
                        color='#f50'
                        onPress={this.sendMail}
                    />
                </View>
            </Card>     
            </ScrollView>
            );
    }
}

export default Contacto;