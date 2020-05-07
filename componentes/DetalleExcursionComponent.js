import React, { Component } from 'react';
import { Text, View, ScrollView, FlatList, Modal, StyleSheet } from 'react-native';
import { Card, Icon, Input, Button, Rating } from 'react-native-elements';
import { baseUrl, colorGaztaroaOscuro } from '../comun/comun';
import { connect } from 'react-redux';
import { postFavorito, postComentario } from "../redux/ActionCreators";


const mapStateToProps = state => {
    return {
        excursiones: state.excursiones,
        comentarios: state.comentarios,
        favoritos: state.favoritos
    }
}

const mapDispatchToProps = dispatch => ({
    postFavorito: (excursionId) => dispatch(postFavorito(excursionId)),
    postComentario: (comentario) => dispatch(postComentario(comentario))
})

function RenderExcursion(props) {

    const excursion = props.excursion;

    if (excursion != null) {
        return (
            <Card
                featuredTitle={excursion.nombre}
                image={{ uri: baseUrl + excursion.imagen }}>
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
        <Card title='Comentarios' >
            <FlatList
                data={comentarios}
                renderItem={renderCommentarioItem}
                keyExtractor={item => item.id.toString()}
            />
        </Card>
    );
}


class DetalleExcursion extends Component {
    constructor(props) {
        super(props);
        this.state = {
            rating: 3,
            autor: '',
            comentario: '',
            showModal: false
        }
    }

    marcarFavorito(excursionId) {
        this.props.postFavorito(excursionId);
    }

    resetForm(){
        this.setState({
            rating: 3,
            autor: '',
            comentario: '',
            showModal: false
        });
    }

    gestionarComentario(excursionId){
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


    toggleModal(){
        this.setState({
            showModal: !this.state.showModal
        })
    }


    render() {
        const { excursionId } = this.props.route.params;
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
                    animationType = {"slide"}
                    transparent = {false}
                    visible = {this.state.showModal}
                    onDismiss = {() => {this.toggleModal(); this.resetForm();}}
                    onRequestClose = {() => {this.toggleModal(); this.resetForm();}}>
                    <View style = {styles.modal}>
                        <Rating
                            showRating
                            startingValue={3}
                            onFinishRating={rating => this.setState({rating: rating})}
                        />
                        <Input
                            placeholder='Autor'
                            leftIcon={{ type: 'font-awesome', name: 'user' }}
                            leftIconContainerStyle={{marginRight: 15}}
                            onChangeText={value => this.setState({autor: value})}
                        />
                        <Input
                            placeholder='Comentario'
                            leftIcon={{ type: 'font-awesome', name: 'comment' }}
                            leftIconContainerStyle={{marginRight: 15}}
                            onChangeText={value => this.setState({comentario: value})}

                        />
                        <Button
                            onPress = {() => this.gestionarComentario(excursionId)}
                            style={{backgroundColor: '#fff', color: colorGaztaroaOscuro}}
                            title="Enviar"
                            type='clear'
                        />
                        <Button
                            onPress = {() =>{this.toggleModal(); this.resetForm();}}
                            title="Cancelar"
                            type='clear'
                        />
                    </View>
                </Modal>
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