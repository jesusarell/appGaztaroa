import React, { Component } from 'react';
import { View, Text, TextInput, Button, StyleSheet } from 'react-native';
import { addAuth} from "../redux/ActionCreators";
import { connect } from 'react-redux'

const mapStateToProps = state => {
    return {
        auth: state.auth,
    }
  }
  
  const mapDispatchToProps = dispatch => ({
    addAuth: (email) => dispatch(addAuth (email))
  })

class SignUpScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {
            email: "",
            password: "",
            confirmPassword: "",
            valid: false,
        };
    }

    comprobarPassword = () => {
        console.log(this.state.password)
        console.log(this.state.confirmPassword)
        if ((this.state.password.length > 0) && (this.state.password === this.state.confirmPassword)) {
            this.setState({ valid: true })
        } else {
            this.setState({ valid: false })
        }
    }

    signupHandler = ({ navigate }) => {
        const apiKey = "AIzaSyAMIuumz8RMXun_jhQj16bUfKt7Eg4Dq9o";
        let url = "https://www.googleapis.com/identitytoolkit/v3/relyingparty/signupNewUser?key=" + apiKey;

        fetch(url, {
            method: "POST",
            body: JSON.stringify({
                email: this.state.email,
                password: this.state.password,
                returnSecureToken: true
            }),
            headers: {
                "Content-Type": "application/json"
            }
        })
            .catch(err => {
                console.log(err);
                alert("La autenticación ha fallado. Por favor, intentalo de nuevo.");
            })
            .then(res => res.json())
            .then(parsedRes => {
                console.log(parsedRes);
                if (!parsedRes.idToken) {
                    alert("Se ha experimentado un error. Comprueba tus datos.");
                } else {
                    this.props.addAuth(this.state.email)
                    navigate('Inicio', { user: this.state.email })
                }
            });
    };

    render() {
        const { navigate } = this.props.navigation;

        return (
            <View style={styles.contianer}>
                <View style={styles.headerView}>
                    <Text style={styles.header}>Registrarse</Text>
                </View>

                <TextInput
                    placeholder="Email"
                    autoCapitalize="none"
                    value={this.state.email}
                    onChangeText={(email) => this.setState({ email })}
                    underlineColorAndroid="#1E90FF"
                    style={styles.input}
                />

                <TextInput
                    placeholder="Contraseña"
                    autoCapitalize="none"
                    value={this.state.password}
                    onChangeText={(password) => this.setState({ password: password }, this.comprobarPassword)}
                    underlineColorAndroid="#1E90FF"
                    style={styles.input}
                    secureTextEntry
                />

                <TextInput
                    placeholder="Contraseña"
                    autoCapitalize="none"
                    value={this.state.confirmPassword}
                    onChangeText={(confirmPassword) => this.setState({ confirmPassword }, this.comprobarPassword)}
                    underlineColorAndroid="#1E90FF"
                    style={styles.input}
                    secureTextEntry
                />

                <View style={styles.button} >
                    <Button title="Registrarse" onPress={() => this.signupHandler({ navigate })} disabled={(this.state.email === "" || !this.state.valid)} />
                </View>

                <Text style={styles.text}>¿Ya tienes una cuenta? <Text onPress={() => navigate('Login')} style={styles.navigateText}>Entrar</Text></Text>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    contianer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center"
    },
    headerView: {
        marginBottom: 25
    },
    header: {
        fontWeight: "bold",
        fontSize: 26,
        color: "#1E90FF"
    },
    text: {
        color: "black"
    },
    navigateText: {
        color: "#1E90FF"
    },
    input: {
        width: "70%"
    },
    button: {
        marginTop: 15,
        marginBottom: 15
    }
});

export default connect(mapStateToProps, mapDispatchToProps)(SignUpScreen);