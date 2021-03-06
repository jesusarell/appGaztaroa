import React, { Component } from 'react';
import { Text, View, ScrollView, FlatList, Modal, StyleSheet, Alert, PanResponder } from 'react-native';
import { Card, Icon, Input, Button, Rating, Image } from 'react-native-elements';
import { baseUrl, colorGaztaroaOscuro } from '../comun/comun';
import { connect } from 'react-redux';
import { postFavorito, postComentario } from "../redux/ActionCreators";
import * as Animatable from 'react-native-animatable';
import { useRef } from "react";
import * as ImageManipulator from "expo-image-manipulator";
import * as ImagePicker from 'expo-image-picker';


const mapStateToProps = state => {
    return {
        excursiones: state.excursiones,
        comentarios: state.comentarios,
        favoritos: state.favoritos,
        auth: state.auth
    }
}

const mapDispatchToProps = dispatch => ({
    postFavorito: (excursionId) => dispatch(postFavorito(excursionId)),
    postComentario: (comentario) => dispatch(postComentario(comentario))
})

function RenderExcursion(props) {

    const excursion = props.excursion;

    const cardAnimada = useRef(null);
    const reconocerDragDerechaIzquierda = ({ moveX, moveY, dx, dy }) => {
        if (dx < -50)
            return true;
        else
            return false;
    }

    const reconocerDragIzquierdaDerecha = ({ moveX, moveY, dx, dy }) => {
        if (dx > -50)
            return true;
        else
            return false;
    }
    const panResponder = PanResponder.create({
        onStartShouldSetPanResponder: (e, gestureState) => {
            return true;
        },
        onPanResponderGrant: () => {
            cardAnimada.current.rubberBand(1000)
                .then(endState => console.log(endState.finished ? 'terminado' : 'cancelado'));
        },
        onPanResponderEnd: (e, gestureState) => {
            console.log("PanResponder finalizado", gestureState);
            if (reconocerDragDerechaIzquierda(gestureState))
                Alert.alert(
                    'Añadir favorito',
                    'Confirmar que desea añadir' + excursion.nombre + ' a favoritos:',
                    [{
                        text: 'Cancelar', onPress: () => console.log('Excursión no añadida a favoritos'), style: 'cancel'
                    },
                    {
                        text: 'OK', onPress: () => {
                            props.favorita ? console.log('La excursión ya se encuentra entre las favoritas') : props.onPressFavorito()
                        }
                    },
                    ],
                    { cancelable: false }
                );
            if (reconocerDragIzquierdaDerecha(gestureState)) {
                props.onPressComentar();
            }
            return true;

        }
    })

    if (excursion != null) {
        return (
            <Animatable.View
                animation="fadeInDown"
                duration={2000}
                delay={500}
                ref={cardAnimada}
                {...panResponder.panHandlers}>
                <Card
                    featuredTitle={excursion.nombre}
                    image={{ uri: excursion.imagen }}>
                    <Text style={{ margin: 10 }}>
                        {excursion.descripcion}
                    </Text>
                    <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'center' }}>
                        <Icon
                            raised
                            reverse
                            name={props.favorita ? 'heart' : 'heart-o'}
                            type='font-awesome'
                            color='#f50'
                            onPress={() => props.favorita ? console.log('La excursion ya esta en favoritos') : props.onPressFavorito()}
                        />
                        <Icon
                            raised
                            reverse
                            name='pencil'
                            type='font-awesome'
                            color={colorGaztaroaOscuro}
                            onPress={() => props.onPressComentar()}
                        />
                    </View>
                </Card>
            </Animatable.View>
        );
    }
    else {
        return (<View></View>);
    }
}

function RenderComentario(props) {

    const comentarios = props.comentarios;

    const renderCommentarioItem = ({ item, index }) => {

        return (
            <View key={index} style={{ margin: 10 }}>
                <Text style={{ fontSize: 14 }}>{item.comentario}</Text>
                <Text style={{ fontSize: 12 }}>{item.valoracion} Stars</Text>
                <Text style={{ fontSize: 12 }}>{'-- ' + item.autor + ', ' + item.dia} </Text>
            </View>
        );
    };

    return (
        <Animatable.View animation="fadeInUp" duration={2000} delay={1000}>
            <Card title='Comentarios' >
                <FlatList
                    data={comentarios}
                    renderItem={renderCommentarioItem}
                    keyExtractor={item => item.id.toString()}
                />
            </Card>


        </Animatable.View>
    );
}


class DetalleExcursion extends Component {
    constructor(props) {
        super(props);
        this.state = {
            rating: 3,
            autor: this.props.auth.email,
            comentario: '',
            showModal: false,
            image: null
        }
    }

    componentDidMount() {
        this.getPermissionAsync();
    }

    getPermissionAsync = async () => {
        if (Constants.platform.Android) {
            const { status } = await Permissions.askAsync(Permissions.CAMERA_ROLL);
            if (status !== 'granted') {
                alert('Debe permitir el acceso a los recursos de su dispositivo móvil.');
            }
        }
    };

    rotate90 = async () => {
        const manipResult = await ImageManipulator.manipulateAsync(
            this.state.image,
            [{ rotate: 90 }],
            { compress: 1, format: ImageManipulator.SaveFormat.PNG }
        );
        this.setState({ image: manipResult.uri });
    };

    espejoVertical = async () => {
        const manipResult = await ImageManipulator.manipulateAsync(
            this.state.image,
            [{ flip: ImageManipulator.FlipType.Vertical }],
            { compress: 1, format: ImageManipulator.SaveFormat.PNG }
        );
        this.setState({ image: manipResult.uri });
    };

    pickImage = async () => {
        try {
            let result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.All,
                allowsEditing: true,
                aspect: [4, 3],
                quality: 1,
            });
            if (!result.cancelled) {
                this.setState({ image: result.uri });
            }
        } catch (E) {
        }
    };




    marcarFavorito(excursionId) {
        this.props.postFavorito(excursionId);
    }

    resetForm() {
        this.setState({
            rating: 3,
            autor: '',
            comentario: '',
            showModal: false
        });
    }

    gestionarComentario(excursionId) {
        const fecha = new Date(Date.now()).toISOString()
        const comentario = {
            id: null,
            excursionId: excursionId,
            valoracion: this.state.rating,
            autor: this.state.autor,
            comentario: this.state.comentario,
            dia: fecha
        }
        this.props.postComentario(comentario)
        this.resetForm()
    }


    toggleModal() {
        this.setState({
            showModal: !this.state.showModal
        })
    }


    render() {
        const { excursionId } = this.props.route.params;
        let { image } = this.state;
        let iconos = <View></View>;
        if (image !== null) {
            iconos =
                <View style={{ flexDirection: "column" }}>
                    <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'center' }}>
                        <Icon
                            raised
                            reverse
                            name='undo'
                            type='font-awesome'
                            color='#f50'
                            onPress={this.rotate90}
                        />
                        <Icon
                            raised
                            reverse
                            name='arrows-v'
                            type='font-awesome'
                            color='#f50'
                            onPress={this.espejoVertical}
                        />
                    </View>

                </View>
        }
        return (
            <ScrollView>
                <RenderExcursion
                    excursion={this.props.excursiones.excursiones[+excursionId]}
                    favorita={this.props.favoritos.some(el => el === excursionId)}
                    onPressFavorito={() => this.marcarFavorito(excursionId)}
                    onPressComentar={() => this.toggleModal()}
                />
                <RenderComentario
                    comentarios={this.props.comentarios.comentarios.filter((comentario) => comentario.excursionId === excursionId)}
                />
                <Modal
                    animationType={"slide"}
                    transparent={false}
                    visible={this.state.showModal}
                    onDismiss={() => { this.toggleModal(); this.resetForm(); }}
                    onRequestClose={() => { this.toggleModal(); this.resetForm(); }}>
                    <View style={styles.modal}>

                        <Rating
                            showRating
                            startingValue={3}
                            onFinishRating={rating => this.setState({ rating: rating })}
                        />

                        {/* <Input
                            placeholder='Autor: '
                            leftIcon={{ type: 'font-awesome', name: 'user' }}
                            leftIconContainerStyle={{ marginRight: 15 }}
                            onChangeText={value => this.setState({ autor: value })}
                        /> */}

                        <Input
                            placeholder='Comentario'
                            leftIcon={{ type: 'font-awesome', name: 'comment' }}
                            leftIconContainerStyle={{ marginRight: 15 }}
                            onChangeText={value => this.setState({ comentario: value })}

                        />
                        <Button
                            onPress={() => this.gestionarComentario(excursionId)}
                            style={{ backgroundColor: '#fff', color: colorGaztaroaOscuro }}
                            title="Enviar"
                            type='clear'
                        />
                        <Button
                            onPress={() => { this.toggleModal(); this.resetForm(); }}
                            title="Cancelar"
                            type='clear'
                        />
                    </View>
                    <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent:"center"}}>
                        <Icon raised
                                reverse
                                name='user'
                                type='font-awesome' />
                        <Text>{this.props.auth.email}</Text>
                    </View>
                </Modal>

                <Animatable.View animation="fadeInUp" duration={2000} delay={1000}>
                    <Card title="Imágenes personales">
                        <Button title="Seleccionar imágen" onPress={this.pickImage} />
                        <Image source={{ uri: image }} style={{ width: 300, height: 300 }} />
                        {iconos}
                    </Card>
                </Animatable.View>
            </ScrollView>
        );
    }
}
const styles = StyleSheet.create({
    modal: {
        justifyContent: 'center',
        margin: 20
    }
});

export default connect(mapStateToProps, mapDispatchToProps)(DetalleExcursion);