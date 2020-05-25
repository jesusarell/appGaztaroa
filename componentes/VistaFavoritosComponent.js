import React, {Component} from "react";
import { FlatList, Alert } from "react-native";
import {ListItem} from "react-native-elements";
import { connect } from 'react-redux'
import Swipeout from 'react-native-swipeout';
import {borrarFavorito, postComentario, postFavorito} from "../redux/ActionCreators";
import * as Animatable from 'react-native-animatable';  

const mapStateToProps = state => {
    return {
        excursiones: state.excursiones,
        favoritos: state.favoritos
    }
}

const mapDispatchToProps = dispatch => ({
    borrarFavorito: (excursionId) => dispatch(borrarFavorito(excursionId))
})

class VistaFavoritos extends Component {

    constructor(props) {
        super(props);
        this.state = {

        }
    }

    render() {
        const renderFavoritosItem = ({item, index}) => {
            const {navigate} = this.props.navigation
            const rightButton = [
                {
                    text: 'Borrar',
                    type: 'delete',
                    onPress: () => Alert.alert(
                                        'Borrar excursión favorita?',
                                        'Confirme que desea borrar la excursión: ' + item.nombre,
                                        [
                                            {text: 'Cancelar', onPress: () => console.log(item.nombre + ' Favorito no borrado')},
                                            {text: 'OK', onPress: () => this.props.borrarFavorito(item.id)},
                                        ],
                                        {cancelable: false},
                                    )
                }
            ]
            return(
                <Animatable.View animation="bounceInDown" duration={700} delay={700}>
                <Swipeout right={rightButton} autoClose={true}>
                    <ListItem
                        key={index}
                        title={item.nombre}
                        subtitle={item.descripcion}
                        hideChevron={true}
                        leftAvatar={{source: {uri: item.imagen} }}
                        onPress={() => navigate("DetalleExcursion", { excursionId: item.id })}
                        onLongPress={ () => Alert.alert(
                                                'Borrar excursión favorita?',
                                                'Confirme que desea borrar la excursión: ' + item.nombre,
                                                [
                                                    {text: 'Cancelar', onPress: () => console.log(item.nombre + ' Favorito no borrado')},
                                                    {text: 'OK', onPress: () => this.props.borrarFavorito(item.id)},
                                                ],
                                                {cancelable: false},
                                            )
                        }
                    />
                </Swipeout>
                </Animatable.View>
            )
        }

        return(
            <FlatList
                data={this.props.excursiones.excursiones.filter(
                    excursion => this.props.favoritos.some(el => el === excursion.id)
                )}
                renderItem={renderFavoritosItem}
                keyExtractor={item => item.id.toString()}
            />
        )

    }

}


export default connect(mapStateToProps, mapDispatchToProps)(VistaFavoritos);