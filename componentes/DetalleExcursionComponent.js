import React, { Component } from 'react';
import { Text, View, ScrollView, FlatList} from 'react-native';
import { Card, Icon } from 'react-native-elements';
import { baseUrl } from '../comun/comun';
import { connect } from 'react-redux';

const mapStateToProps = state => {
    return {
      excursiones: state.excursiones,
      comentarios: state.comentarios
    }
  }

function RenderExcursion(props) {

    const excursion = props.excursion;
    
    if (excursion != null) {
        return(
            <Card
            featuredTitle={excursion.nombre}
            image={{uri: baseUrl + excursion.imagen}}>
                <Text style={{margin: 10}}>
                    {excursion.descripcion}
                </Text>
                <Icon
                    raised
                    reverse
                    name={ props.favorita ? 'heart' : 'heart-o'}
                    type='font-awesome'
                    color='#f50'
                    onPress={() => props.favorita ? console.log('La excursión ya se encuentra entre las favoritas') : props.onPress()}
                />
            </Card>
        );
    }
    else {
        return(<View></View>);
    }
}

function RenderComentario(props) {

    const comentarios = props.comentarios;
            
    const renderCommentarioItem = ({item, index}) => {
        
        return (
            <View key={index} style={{margin: 10}}>
                <Text style={{fontSize: 14}}>{item.comentario}</Text>
                <Text style={{fontSize: 12}}>{item.valoracion} Stars</Text>
                <Text style={{fontSize: 12}}>{'-- ' + item.autor + ', ' + item.dia} </Text>
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
            favoritos: []
        };
    }

    marcarFavorito(excursionId) {
        this.setState({favoritos: this.state.favoritos.concat(excursionId)});
    }

    render(){
        const {excursionId} = this.props.route.params;
        return(
            <ScrollView>
                <RenderExcursion
                    excursion={this.props.excursiones.excursiones[+excursionId]}
                    favorita={this.state.favoritos.some(el => el === excursionId)}
                    onPress={() => this.marcarFavorito(excursionId)}
                />
                <RenderComentario
                    comentarios={this.props.comentarios.comentarios.filter((comentario) => comentario.excursionId === excursionId)}
                />
            </ScrollView>
        );
    } 
}

export default connect(mapStateToProps)(DetalleExcursion);