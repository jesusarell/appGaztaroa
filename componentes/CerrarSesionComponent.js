import React, { Component } from 'react';
import { View, Text, ScrollView } from 'react-native';
import { Card, Icon } from 'react-native-elements';
import * as Animatable from 'react-native-animatable';
import { delAuth} from "../redux/ActionCreators";
import { connect } from 'react-redux';

const mapStateToProps = state => {
    return {
        auth: state.auth
    }
}

const mapDispatchToProps = dispatch => ({
    delAuth: (email) => dispatch(delAuth(email))
})


class CerrarSesion extends Component {
    constructor(props) {
        super(props);
      }
    

    cerrarSesionHandler = ({navigate}) =>{
        this.props.delAuth();
        this.props.navigation.navigate('Login');
    }

    render() {
        return (
            <ScrollView>
                <Animatable.View animation="zoomInUp" duration={2000} delay={1000}>
                    <Card title="Haga click para cerrar sesión:">
                        <Text style={{ margin: 10 , textAlign: "center"}}>
                            ¡Nos vemos pronto {this.props.auth.email}!
                </Text>
                        <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'center' }}>
                            <Icon
                                raised
                                reverse
                                name='sign-out'
                                type='font-awesome'
                                color='#f50'
                                onPress={this.cerrarSesionHandler}
                            />
                        </View>
                    </Card>
                </Animatable.View>
            </ScrollView>
        );
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(CerrarSesion);