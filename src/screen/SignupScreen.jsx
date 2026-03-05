import { StyleSheet, Text, View, TouchableOpacity, TextInput, ScrollView, Alert, ActivityIndicator } from 'react-native';
import React, { useState } from 'react';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { supabase } from '../lib/supabase';

const SignupScreen = ({ navigation }) => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [agreeTerms, setAgreeTerms] = useState(false);
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({});

    const validateForm = () => {
        const newErrors = {};

        if (!name.trim()) {
            newErrors.name = 'Full name is required';
        }

        if (!email.trim()) {
            newErrors.email = 'Email is required';
        } else if (!/\S+@\S+\.\S+/.test(email)) {
            newErrors.email = 'Please enter a valid email address';
        }

        if (!password) {
            newErrors.password = 'Password is required';
        } else if (password.length < 6) {
            newErrors.password = 'Password must be at least 6 characters';
        }

        if (password !== confirmPassword) {
            newErrors.confirmPassword = 'Passwords do not match';
        }

        if (!agreeTerms) {
            newErrors.terms = 'You must agree to the terms and conditions';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const createProfile = async (userId, retryCount = 0) => {
        try {
            console.log(`Attempting to create profile for user: ${userId} (attempt ${retryCount + 1})`);
            
            // Check if we have a session
            const { data: { session } } = await supabase.auth.getSession();
            console.log('Session status:', session ? 'Active' : 'No session');
            
            if (!session) {
                console.log('No active session, waiting...');
                return false;
            }

            const { error } = await supabase
                .from('profiles')
                .insert([
                    {
                        id: userId,
                        full_name: name.trim(),
                        email: email.trim().toLowerCase(),
                        created_at: new Date().toISOString(),
                    }
                ]);

            if (error) {
                console.log('Profile creation error:', error);
                return false;
            }

            console.log('Profile created successfully');
            return true;
        } catch (error) {
            console.log('Profile creation exception:', error);
            return false;
        }
    };

    const handleSignUp = async () => {
        if (!validateForm()) {
            return;
        }

        setLoading(true);
        try {
            // Sign up the user with Supabase Auth
            const { data: authData, error: authError } = await supabase.auth.signUp({
                email: email.trim().toLowerCase(),
                password: password,
                options: {
                    data: {
                        full_name: name.trim(),
                    }
                }
            });

            if (authError) {
                Alert.alert('Sign Up Failed', authError.message);
                return;
            }

            if (authData.user) {
                console.log('User created successfully:', authData.user.id);
                
                // Wait for session to be established
                let profileCreated = false;
                let retries = 0;
                const maxRetries = 5;

                while (!profileCreated && retries < maxRetries) {
                    // Wait increasing time between retries
                    const waitTime = Math.min(1000 * Math.pow(2, retries), 5000);
                    await new Promise(resolve => setTimeout(resolve, waitTime));
                    
                    profileCreated = await createProfile(authData.user.id, retries);
                    retries++;
                }

                if (profileCreated) {
                    Alert.alert(
                        'Success!',
                        'Your account has been created successfully. Please check your email for a verification link before logging in.',
                        [
                            {
                                text: 'OK',
                                onPress: () => navigation.navigate('LOGIN')
                            }
                        ]
                    );
                } else {
                    // Profile creation failed after retries, but user was created
                    Alert.alert(
                        'Account Created',
                        'Your account was created successfully! However, we encountered an issue setting up your profile. You can still log in and your profile will be created automatically.',
                        [
                            {
                                text: 'Go to Login',
                                onPress: () => navigation.navigate('LOGIN')
                            }
                        ]
                    );
                }
            }
        } catch (error) {
            Alert.alert('Error', 'An unexpected error occurred. Please try again.');
            console.error('Signup error:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleLogin = () => {
        navigation.navigate('LOGIN');
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
                {/* Back Button */}
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.iconContainer}>
                    <Ionicons name="arrow-back" size={24} color="#444444" />
                </TouchableOpacity>

                {/* Header */}
                <View style={styles.headerContainer}>
                    <Ionicons name="person-add-outline" size={60} color="#E55858" />
                    <Text style={styles.headerTitle}>Create Account</Text>
                    <Text style={styles.headerSubtitle}>Sign up to get started</Text>
                </View>

                {/* Sign Up Form */}
                <View style={styles.formContainer}>
                    {/* Name Input */}
                    <View style={styles.inputWrapper}>
                        <Text style={styles.inputLabel}>Full Name</Text>
                        <View style={[styles.inputContainer, errors.name && styles.inputError]}>
                            <Ionicons name="person-outline" size={20} color="#E55858" style={styles.inputIcon} />
                            <TextInput
                                style={styles.input}
                                placeholder="Enter your full name"
                                placeholderTextColor="#999"
                                value={name}
                                onChangeText={setName}
                                editable={!loading}
                            />
                        </View>
                        {errors.name && <Text style={styles.errorText}>{errors.name}</Text>}
                    </View>

                    {/* Email Input */}
                    <View style={styles.inputWrapper}>
                        <Text style={styles.inputLabel}>Email</Text>
                        <View style={[styles.inputContainer, errors.email && styles.inputError]}>
                            <Ionicons name="mail-outline" size={20} color="#E55858" style={styles.inputIcon} />
                            <TextInput
                                style={styles.input}
                                placeholder="Enter your email"
                                placeholderTextColor="#999"
                                keyboardType="email-address"
                                autoCapitalize="none"
                                autoCorrect={false}
                                value={email}
                                onChangeText={setEmail}
                                editable={!loading}
                            />
                        </View>
                        {errors.email && <Text style={styles.errorText}>{errors.email}</Text>}
                    </View>

                    {/* Password Input */}
                    <View style={styles.inputWrapper}>
                        <Text style={styles.inputLabel}>Password</Text>
                        <View style={[styles.inputContainer, errors.password && styles.inputError]}>
                            <Ionicons name="lock-closed-outline" size={20} color="#E55858" style={styles.inputIcon} />
                            <TextInput
                                style={styles.input}
                                placeholder="Create a password (min. 6 characters)"
                                placeholderTextColor="#999"
                                secureTextEntry={!showPassword}
                                value={password}
                                onChangeText={setPassword}
                                editable={!loading}
                            />
                            <TouchableOpacity onPress={() => setShowPassword(!showPassword)} disabled={loading}>
                                <Ionicons 
                                    name={showPassword ? "eye-off-outline" : "eye-outline"} 
                                    size={20} 
                                    color="#E55858" 
                                />
                            </TouchableOpacity>
                        </View>
                        {errors.password && <Text style={styles.errorText}>{errors.password}</Text>}
                    </View>

                    {/* Confirm Password Input */}
                    <View style={styles.inputWrapper}>
                        <Text style={styles.inputLabel}>Confirm Password</Text>
                        <View style={[styles.inputContainer, errors.confirmPassword && styles.inputError]}>
                            <Ionicons name="lock-closed-outline" size={20} color="#E55858" style={styles.inputIcon} />
                            <TextInput
                                style={styles.input}
                                placeholder="Confirm your password"
                                placeholderTextColor="#999"
                                secureTextEntry={!showConfirmPassword}
                                value={confirmPassword}
                                onChangeText={setConfirmPassword}
                                editable={!loading}
                            />
                            <TouchableOpacity onPress={() => setShowConfirmPassword(!showConfirmPassword)} disabled={loading}>
                                <Ionicons 
                                    name={showConfirmPassword ? "eye-off-outline" : "eye-outline"} 
                                    size={20} 
                                    color="#E55858" 
                                />
                            </TouchableOpacity>
                        </View>
                        {errors.confirmPassword && <Text style={styles.errorText}>{errors.confirmPassword}</Text>}
                    </View>

                    {/* Terms & Conditions */}
                    <TouchableOpacity 
                        style={styles.termsContainer}
                        onPress={() => setAgreeTerms(!agreeTerms)}
                        disabled={loading}
                    >
                        <View style={[styles.checkbox, agreeTerms && styles.checkboxChecked]}>
                            {agreeTerms && <Ionicons name="checkmark" size={16} color="white" />}
                        </View>
                        <Text style={styles.termsText}>
                            I agree to the <Text style={styles.termsLink}>Terms of Service</Text> and{' '}
                            <Text style={styles.termsLink}>Privacy Policy</Text>
                        </Text>
                    </TouchableOpacity>
                    {errors.terms && <Text style={styles.errorText}>{errors.terms}</Text>}

                    {/* Sign Up Button */}
                    <TouchableOpacity 
                        style={[styles.signUpButton, (!agreeTerms || loading) && styles.signUpButtonDisabled]} 
                        onPress={handleSignUp}
                        disabled={!agreeTerms || loading}
                    >
                        {loading ? (
                            <ActivityIndicator color="white" />
                        ) : (
                            <Text style={styles.signUpButtonText}>Create Account</Text>
                        )}
                    </TouchableOpacity>

                    {/* Login Link */}
                    <View style={styles.loginContainer}>
                        <Text style={styles.loginText}>Already have an account? </Text>
                        <TouchableOpacity onPress={handleLogin} disabled={loading}>
                            <Text style={styles.loginLink}>Sign In</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </ScrollView>
        </LinearGradient>
    );
};

const styles = StyleSheet.create({
    gradient: {
        flex: 1,
    },
    scrollContent: {
        flexGrow: 1,
        paddingHorizontal: 20,
        paddingBottom: 30,
    },
    iconContainer: {
        backgroundColor: '#fff',
        height: 44,
        width: 44,
        borderRadius: 22,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#f0f0f0',
        marginTop: 50,
        marginBottom: 20,
    },
    headerContainer: {
        alignItems: 'center',
        marginBottom: 30,
    },
    headerTitle: {
        fontSize: 28,
        fontWeight: '700',
        color: '#444444',
        marginTop: 10,
        marginBottom: 5,
    },
    headerSubtitle: {
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
    inputError: {
        borderColor: '#E55858',
        borderWidth: 2,
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
    errorText: {
        color: '#E55858',
        fontSize: 12,
        marginTop: 5,
        marginLeft: 5,
    },
    termsContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 5,
    },
    checkbox: {
        height: 20,
        width: 20,
        borderRadius: 4,
        borderWidth: 2,
        borderColor: '#E55858',
        marginRight: 10,
        justifyContent: 'center',
        alignItems: 'center',
    },
    checkboxChecked: {
        backgroundColor: '#E55858',
    },
    termsText: {
        flex: 1,
        fontSize: 14,
        color: '#757575',
        lineHeight: 20,
    },
    termsLink: {
        color: '#E55858',
        fontWeight: '600',
    },
    signUpButton: {
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
    signUpButtonDisabled: {
        backgroundColor: '#FFB6C1',
        opacity: 0.7,
    },
    signUpButtonText: {
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
    loginContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
    loginText: {
        fontSize: 14,
        color: '#757575',
    },
    loginLink: {
        fontSize: 14,
        color: '#E55858',
        fontWeight: '700',
    },
});

export default SignupScreen;