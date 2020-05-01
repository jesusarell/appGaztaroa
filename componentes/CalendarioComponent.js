import React, { Component } from 'react';
import { FlatList } from 'react-native';
import { ListItem } from 'react-native-elements';
import { baseUrl } from '../comun/comun';
import { connect } from 'react-redux';

const mapStateToProps = state => {
    return {
      excursiones: state.excursiones
    }
  }

class Calendario extends Component {

    render(){
        const { navigate } = this.props.navigation;

        const renderCalendarioItem = ({item, index}) => {
            return (
                    <ListItem
                        key={index}
                        title={item.nombre}
                        subtitle={item.descripcion}
                        hideChevron={true}
                        onPress={() => navigate('DetalleExcursion', { excursionId: item.id })}
                        leftAvatar={{source: {uri: baseUrl + item.imagen}}}
                    />
            );
        }

        return (
            <FlatList 
                data={this.props.excursiones.excursiones}
                renderItem={renderCalendarioItem}
                keyExtractor={item => item.id.toString()}
                />
        );
    };
}

export default connect(mapStateToProps)(Calendario);