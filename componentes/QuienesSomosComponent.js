import React, { Component } from 'react';
import { Text, ScrollView } from 'react-native';
import { Card } from 'react-native-elements';
import { FlatList } from 'react-native';
import { ListItem } from 'react-native-elements';
import { connect } from 'react-redux';
import { IndicadorActividad } from './IndicadorActividadComponent';
import * as Animatable from 'react-native-animatable';

const mapStateToProps = state => {
    return {
        actividades: state.actividades
    }
}

function Historia() {
    return (
        <Animatable.View animation="zoomInUp" duration={2000} delay={1000}>
            <Card title="Un poquito de historia"
                featuredTitle="Quiénes somos">
                <Text style={{ margin: 10 }}>
                    El nacimiento del club de montaña Gaztaroa se remonta a la primavera de 1976 cuando jóvenes aficionados a la montaña y pertenecientes a un club juvenil decidieron crear la sección montañera de dicho club. Fueron unos comienzos duros debido sobre todo a la situación política de entonces. Gracias al esfuerzo económico de sus socios y socias se logró alquilar una bajera. Gaztaroa ya tenía su sede social.
                {'\n'}{'\n'}
                Desde aquí queremos hacer llegar nuestro agradecimiento a todos los montañeros y montañeras que alguna vez habéis pasado por el club aportando vuestro granito de arena.
                {'\n'}{'\n'}
                Gracias!
                </Text>
            </Card>
            </Animatable.View>
    );
}

class QuienesSomos extends Component {

                render() {

        const renderActividadItem = ({ item, index}) => {
            return (
            <ListItem
                key={index}
                title={item.nombre}
                subtitle={item.descripcion}
                hideChevron={true}
                leftAvatar={{ source: { uri: item.imagen } }}
            />
            );
        };
        if (this.props.actividades.isLoading) {
            return (
            <ScrollView>

                <Historia />

                <Card title="Actividades y recursos">
                    <IndicadorActividad />
                </Card>
            </ScrollView>
            );
        } else if (this.props.actividades.errMess) {
            return (
            <View>
                <Text>{props.errMess}</Text>
            </View>
            );
        } else {

            return (
            <ScrollView>
                <Historia />
                <Animatable.View animation="zoomInUp" duration={2000} delay={1000}>
                <Card title="Actividades y recursos">
                    <FlatList
                        data={this.props.actividades.actividades}
                        renderItem={renderActividadItem}
                        keyExtractor={item => item.id.toString()}
                    />
                </Card>
                </Animatable.View>
            </ScrollView>
            );
        }
    }
}

export default connect(mapStateToProps)(QuienesSomos);