import { StyleSheet, Text, View, TouchableOpacity, TextInput, ScrollView, Image, ActivityIndicator } from 'react-native'
import React, { useState } from 'react'
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../context/AuthContext';

const LoginScreen = ({ navigation }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [rememberMe, setRememberMe] = useState(false);
    const [loading, setLoading] = useState(false);
    
    const { signIn } = useAuth();

    const handleLogin = async () => {
        if (!email || !password) {
            alert('Please fill in all fields');
            return;
        }
        
        setLoading(true);
        try {
            await signIn(email, password);
            // Navigate to main app on success
            navigation.replace('MAIN_TABS');
        } catch (error) {
            alert(error.message);
        } finally {
            setLoading(false);
        }
    };

    const handleForgotPassword = () => {
        // Navigate to forgot password screen
        console.log('Forgot password pressed');
    };

    const handleSignUp = () => {
        navigation.navigate('SIGNUP');
    };

    return (
        <LinearGradient
            colors={['#FFB6C1', '#FFC0CB', '#FFD1DC']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.gradient}
        >
            <ScrollView 
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.scrollContent}
            >
                {/* App Logo/Name */}
                <View style={styles.logoContainer}>
                    <Ionicons name="cart-outline" size={80} color="#E55858" />
                    <Text style={styles.appName}>My E-Shop</Text>
                    <Text style={styles.tagline}>Shop with style</Text>
                </View>

                {/* Welcome Text */}
                <View style={styles.welcomeContainer}>
                    <Text style={styles.welcomeTitle}>Welcome Back!</Text>
                    <Text style={styles.welcomeSubtitle}>Sign in to continue shopping</Text>
                </View>

                {/* Login Form */}
                <View style={styles.formContainer}>
                    {/* Email Input */}
                    <View style={styles.inputWrapper}>
                        <Text style={styles.inputLabel}>Email</Text>
                        <View style={styles.inputContainer}>
                            <Ionicons name="mail-outline" size={20} color="#E55858" style={styles.inputIcon} />
                            <TextInput
                                style={styles.input}
                                placeholder="Enter your email"
                                placeholderTextColor="#999"
                                keyboardType="email-address"
                                autoCapitalize="none"
                                value={email}
                                onChangeText={setEmail}
                            />
                        </View>
                    </View>

                    {/* Password Input */}
                    <View style={styles.inputWrapper}>
                        <Text style={styles.inputLabel}>Password</Text>
                        <View style={styles.inputContainer}>
                            <Ionicons name="lock-closed-outline" size={20} color="#E55858" style={styles.inputIcon} />
                            <TextInput
                                style={styles.input}
                                placeholder="Enter your password"
                                placeholderTextColor="#999"
                                secureTextEntry={!showPassword}
                                value={password}
                                onChangeText={setPassword}
                            />
                            <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                                <Ionicons 
                                    name={showPassword ? "eye-off-outline" : "eye-outline"} 
                                    size={20} 
                                    color="#E55858" 
                                />
                            </TouchableOpacity>
                        </View>
                    </View>

                    {/* Remember Me & Forgot Password */}
                    <View style={styles.rowContainer}>
                        <TouchableOpacity 
                            style={styles.rememberMeContainer}
                            onPress={() => setRememberMe(!rememberMe)}
                        >
                            <View style={[styles.checkbox, rememberMe && styles.checkboxChecked]}>
                                {rememberMe && <Ionicons name="checkmark" size={16} color="white" />}
                            </View>
                            <Text style={styles.rememberMeText}>Remember me</Text>
                        </TouchableOpacity>

                        <TouchableOpacity onPress={handleForgotPassword}>
                            <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
                        </TouchableOpacity>
                    </View>

                    {/* Login Button */}
                    <TouchableOpacity 
                        style={[styles.loginButton, loading && styles.loginButtonDisabled]} 
                        onPress={handleLogin}
                        disabled={loading}
                    >
                        {loading ? (
                            <ActivityIndicator color="white" />
                        ) : (
                            <Text style={styles.loginButtonText}>Sign In</Text>
                        )}
                    </TouchableOpacity>

                    {/* OR Divider */}
                    <View style={styles.orContainer}>
                        <View style={styles.orLine} />
                        <Text style={styles.orText}>OR</Text>
                        <View style={styles.orLine} />
                    </View>

                    {/* Social Login */}
                    <View style={styles.socialContainer}>
                        <TouchableOpacity style={styles.socialButton}>
                            <Ionicons name="logo-google" size={24} color="#DB4437" />
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.socialButton}>
                            <Ionicons name="logo-facebook" size={24} color="#4267B2" />
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.socialButton}>
                            <Ionicons name="logo-apple" size={24} color="#000" />
                        </TouchableOpacity>
                    </View>

                    {/* Sign Up Link */}
                    <View style={styles.signUpContainer}>
                        <Text style={styles.signUpText}>Don't have an account? </Text>
                        <TouchableOpacity onPress={handleSignUp}>
                            <Text style={styles.signUpLink}>Sign Up</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </ScrollView>
        </LinearGradient>
    );
};

export default LoginScreen;

const styles = StyleSheet.create({
    gradient: {
        flex: 1,
    },
    scrollContent: {
        flexGrow: 1,
        paddingHorizontal: 20,
        paddingBottom: 30,
    },
    logoContainer: {
        alignItems: 'center',
        marginTop: 60,
        marginBottom: 30,
    },
    appName: {
        fontSize: 32,
        fontWeight: '700',
        color: '#E55858',
        marginTop: 10,
    },
    tagline: {
        fontSize: 16,
        color: '#757575',
        marginTop: 5,
    },
    welcomeContainer: {
        marginBottom: 30,
    },
    welcomeTitle: {
        fontSize: 28,
        fontWeight: '700',
        color: '#444444',
        marginBottom: 5,
    },
    welcomeSubtitle: {
        fontSize: 16,
        color: '#757575',
    },
    formContainer: {
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
        borderRadius: 20,
        padding: 20,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.1,
        shadowRadius: 3.84,
        elevation: 3,
    },
    inputWrapper: {
        marginBottom: 20,
    },
    inputLabel: {
        fontSize: 14,
        color: '#444444',
        marginBottom: 8,
        fontWeight: '500',
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FFFFFF',
        borderRadius: 12,
        paddingHorizontal: 15,
        borderWidth: 1,
        borderColor: '#E0E0E0',
    },
    inputIcon: {
        marginRight: 10,
    },
    input: {
        flex: 1,
        paddingVertical: 15,
        fontSize: 16,
        color: '#444444',
    },
    rowContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 25,
    },
    rememberMeContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    checkbox: {
        height: 20,
        width: 20,
        borderRadius: 4,
        borderWidth: 2,
        borderColor: '#E55858',
        marginRight: 8,
        justifyContent: 'center',
        alignItems: 'center',
    },
    checkboxChecked: {
        backgroundColor: '#E55858',
    },
    rememberMeText: {
        fontSize: 14,
        color: '#757575',
    },
    forgotPasswordText: {
        fontSize: 14,
        color: '#E55858',
        fontWeight: '600',
    },
    loginButton: {
        backgroundColor: '#E55858',
        borderRadius: 15,
        padding: 18,
        alignItems: 'center',
        marginBottom: 20,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.2,
        shadowRadius: 3.84,
        elevation: 5,
    },
    loginButtonDisabled: {
        opacity: 0.7,
    },
    loginButtonText: {
        fontSize: 18,
        fontWeight: '700',
        color: 'white',
    },
    orContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 20,
    },
    orLine: {
        flex: 1,
        height: 1,
        backgroundColor: '#E0E0E0',
    },
    orText: {
        marginHorizontal: 10,
        color: '#757575',
        fontSize: 14,
    },
    socialContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginBottom: 20,
    },
    socialButton: {
        backgroundColor: '#FFFFFF',
        height: 50,
        width: 50,
        borderRadius: 25,
        justifyContent: 'center',
        alignItems: 'center',
        marginHorizontal: 10,
        borderWidth: 1,
        borderColor: '#E0E0E0',
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 1,
        },
        shadowOpacity: 0.1,
        shadowRadius: 2,
        elevation: 2,
    },
    signUpContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
    signUpText: {
        fontSize: 14,
        color: '#757575',
    },
    signUpLink: {
        fontSize: 14,
        color: '#E55858',
        fontWeight: '700',
    },
});