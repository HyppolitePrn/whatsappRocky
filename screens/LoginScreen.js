import {
    StyleSheet,
    Text,
    View,
    Pressable,
    Button,
    Keyboard,
    Platform,
    KeyboardAvoidingView,
    TouchableWithoutFeedback,
    Alert,
} from 'react-native'
import React, { useState, useEffect } from 'react'
import InputForm from '../components/InputForm'
import { useNavigation } from '@react-navigation/native'
import AsyncStorage from '@react-native-async-storage/async-storage'
import axios from 'axios'
import config from '../config.env.json'

const LoginScreen = () => {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [emailError, setEmailError] = useState('')
    const navigation = useNavigation()

    const handleLogin = async () => {
        const emailRegex =
            /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/

        if (!emailRegex.test(email)) {
            setEmailError('Veuillez entrer un email valide')
            return
        } else {
            setEmailError('')
        }

        try {
            const body = {
                email,
                password,
            }

            const response = await fetch(config.REACT_APP_API_URL + '/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Accept: 'application/json',
                },
                body: JSON.stringify(body),
            })

            if (!response.ok) {
                throw new Error('Network response was not ok')
            }

            const data = await response.json()

            const token = data.token

            AsyncStorage.setItem('authToken', token)

            navigation.replace('Home')
        } catch (error) {
            if (error.response) {
                console.log(error.response.data.message)

                Alert.alert('Error', error.response.data.message, [
                    { text: 'OK', onPress: () => navigation.navigate('Login') },
                ])
            } else {
                console.log('Unexpected error:', error.message)
            }
        }
    }

    useEffect(() => {
        const checkLoggedIn = async () => {
            try {
                const token = await AsyncStorage.getItem('authToken')

                if (token) {
                    navigation.replace('Home')
                }
            } catch (error) {
                console.log('Unexpected error:', error.message)
            }
        }

        checkLoggedIn()
    }, [])

    return (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <View style={styles.loginContainer}>
                <KeyboardAvoidingView
                    behavior={Platform.OS === 'ios' ? 'padding' : null}
                >
                    <Text style={styles.loginTitle}>Login</Text>

                    <InputForm
                        placeholderInput={'Email...'}
                        valueInput={email}
                        isSecure={false}
                        handleChangeInput={text => setEmail(text)}
                    />
                    {emailError ? (
                        <Text style={{ color: 'red' }}>{emailError}</Text>
                    ) : null}

                    <InputForm
                        placeholderInput={'Password...'}
                        valueInput={password}
                        isSecure={true}
                        handleChangeInput={text => setPassword(text)}
                    />

                    <Button
                        onPress={handleLogin}
                        title='Login'
                        style={styles.inputLogin}
                    />

                    <Pressable
                        onPress={() => navigation.navigate('Register')}
                        style={{ marginTop: 20 }}
                    >
                        <Text style={styles.signupText}>
                            Dont't have an account? Sign Up
                        </Text>
                    </Pressable>
                </KeyboardAvoidingView>
            </View>
        </TouchableWithoutFeedback>
    )
}

export default LoginScreen

const styles = StyleSheet.create({
    loginTitle: {
        fontSize: 30,
        textTransform: 'uppercase',
        textAlign: 'center',
        letterSpacing: 2,
        marginBottom: 30,
        color: 'black',
        fontWeight: 'bold',
    },
    loginContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    inputLogin: {
        width: '20%',
        height: 40,
        backgroundColor: '#007AFF',
        borderRadius: 22,
        justifyContent: 'center',
        alignItems: 'center',
        margin: 16,
    },
    signupText: {
        textAlign: 'center',
        color: 'gray',
        fontSize: 14,
    },
})
