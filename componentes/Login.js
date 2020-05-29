import React, { Component } from 'react';
import { View, Text, TextInput, Button, StyleSheet } from 'react-native';
import { colorGaztaroaOscuro, ANDROID_CLIENT_ID, firebaseConfig } from '../comun/comun';
import { addAuth} from "../redux/ActionCreators";
import { connect } from 'react-redux'
import * as Google from "expo-google-app-auth";
import firebase from 'firebase';
const mapStateToProps = state => {
  return {
      auth: state.auth,
  }
}

const mapDispatchToProps = dispatch => ({
  addAuth: (email) => dispatch(addAuth (email))
})

firebase.initializeApp(firebaseConfig);

class LoginScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: '',
      password: ''
    }
  }




  loginHandler = ({navigate}) => {
    const apiKey = "AIzaSyAMIuumz8RMXun_jhQj16bUfKt7Eg4Dq9o";
    const url = "https://www.googleapis.com/identitytoolkit/v3/relyingparty/verifyPassword?key=" + apiKey;

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
          navigate('Inicio')
        }
      });
  };

  signInWithGoogle = async () => {
    try {
      console.log('Intentando autenticar');
      const result = await Google.logInAsync({
        androidClientId: ANDROID_CLIENT_ID,
        scopes: ["profile", "email"]
      });

      if (result.type === "success") {
        console.log("LoginScreen.js.js 21 | ", result.user);
        this.props.addAuth(result.user.email)
        this.props.navigation.navigate("Inicio")
      } else {
        return { cancelled: true };
      }
    } catch (e) {
      console.log('LoginScreen.js.js 30 | Error with login', e);
      return { error: true };
    }
  };
  render() {
    const { navigate } = this.props.navigation;
    if( this.props.auth.email  != null){ //En caso de que se haya logeado previamente, no mostramos el screen de autenticación. Inciamos normalmente.
      navigate('Inicio')
    }
  

    return (
      <View style={styles.contianer}>
        <View style={styles.headerView}>
          <Text style={styles.header}>Acceso</Text>
        </View>

        <TextInput
          placeholder="Email"
          autoCapitalize="none"
          value={this.state.email}
          onChangeText={(email) => this.setState({ email })}
          underlineColorAndroid={colorGaztaroaOscuro}
          style={styles.input}
        />

        <TextInput
          placeholder="Contraseña"
          autoCapitalize="none"
          value={this.state.password}
          onChangeText={(password) => this.setState({ password })}
          underlineColorAndroid={colorGaztaroaOscuro}
          style={styles.input}
          secureTextEntry
        />

        <View style={styles.button}>
          <Button title="Acceder" onPress={() => this.loginHandler({navigate})} style={styles.button} disabled={(this.state.email === "" || this.state.password === "")} />
          <Button title="Iniciar sesión con Google" onPress={this.signInWithGoogle} />
        </View>

        <Text style={styles.text}>¿Todavía no tienes una cuenta? <Text onPress={() => navigate('SignUp')} style={styles.navigateText}>Registrarse</Text></Text>
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
    marginBottom: 20
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

export default connect(mapStateToProps, mapDispatchToProps)(LoginScreen);