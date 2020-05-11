import React, { Component } from 'react';
import { Text, ScrollView, View } from 'react-native';
import { Card } from 'react-native-elements';
import { baseUrl } from '../comun/comun';
import { connect } from 'react-redux';
import { IndicadorActividad } from './IndicadorActividadComponent';
import * as Animatable from 'react-native-animatable';

const mapStateToProps = state => {
    return {
        excursiones: state.excursiones,
        cabeceras: state.cabeceras,
        actividades: state.actividades
    }
}

function RenderItem(props) {
    const item = props.item;
    if (props.isLoading) {
        return (
            <IndicadorActividad />
        );
    }
    else if (props.errMess) {
        return (
            <View>
                <Text>{props.errMess}</Text>
            </View>
        );
    }
    else {
        if (item != null) {
                return (

                    < Animatable.View animation="slideInLeft" duration={2000} delay={0} >
                        <Card
                            featuredTitle={item.nombre}
                            image={{ uri: baseUrl + item.imagen }}>
                            <Text
                                style={{ margin: 10 }}>
                                {item.descripcion}</Text>
                        </Card>
                    </Animatable.View>
                );
            }else {
                return (<View></View>);
            }

        }
    }

    class Home extends Component {

        render() {

            return (
                <ScrollView>
                    <RenderItem item={this.props.cabeceras.cabeceras.filter((cabecera) => cabecera.destacado)[0]} />
                    <RenderItem item={this.props.actividades.actividades.filter((actividad) => actividad.destacado)[0]} />
                    <RenderItem item={this.props.excursiones.excursiones.filter((excursion) => excursion.destacado)[0]}
                        isLoading={this.props.excursiones.isLoading}
                        errMess={this.props.excursiones.errMess}
                    />
                </ScrollView>
            );
        }
    }

    export default connect(mapStateToProps)(Home);