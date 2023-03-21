import React from 'react';
import {
    Image, SafeAreaView, ScrollView, StatusBar, Text,
    TextInput, TouchableOpacity, View, BackHandler
} from 'react-native';
import Snackbar from 'react-native-snackbar';
import Color from '../../../components/Colors';
import CustomFont from '../../../components/CustomFont';
import tick from '../../../../assets/success_tick.png';
import * as signupActions from '../../../redux/actions/signupActions';
import * as apiActions from '../../../redux/actions/apiActions';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import styles from './style';
var _ = require('lodash');

import { NavigationActions, StackActions } from 'react-navigation';
import AsyncStorage from 'react-native-encrypted-storage';
//import { GoogleSignin, statusCodes } from '@react-native-community/google-signin';


const navigateAction = StackActions.reset({
    index: 0,
    actions: [NavigationActions.navigate({ routeName: 'GetStarted' })],
});
import CryptoJS from "react-native-crypto-js";
class ChangePassword extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            oldPassword: '',
            newPassword: '',
            confirmNewPassword: '',
            currentPassword: '',
            passwordModal: false,
            fld1: Color.inputdefaultBorder,
            fld2: Color.inputdefaultBorder,
            fld3: Color.inputdefaultBorder,
        }
    }

    async componentDidMount() {
        let pass = CryptoJS.AES.encrypt(await AsyncStorage.getItem('password'), 'MNKU').toString();
        this.setState({
            currentPassword: pass
        })
        this.backHandler = BackHandler.addEventListener('hardwareBackPress', this.handleBackPress)

        // this.getConsulatationBillingPreviewData();
    }

    handleBackPress = () => {
        return true;
    }

    async UNSAFE_componentWillReceiveProps(newProps) {
        let tagname = newProps.responseData.tag;
        if (tagname == 'changePasswords') {
            if (newProps.responseData.statusCode == '-1' || newProps.responseData.statusCode == '0') {
                this.setState({ passwordModal: true })
            }
            else {
                alert(newProps.responseData.statusMessage);
                //Snackbar.show({ text: newProps.responseData.statusMessage, duration: Snackbar.LENGTH_SHORT, backgroundColor: Color.primary });
            }

            // if(this.state.newPassword == this.state.confirmNewPassword)
            // {}
        }
    }

    passwordChange = () => {
        let { actions, signupDetails } = this.props;

        let params = {
			"UserGuid": signupDetails.UserGuid,
            "Data": {
                "MobileNo": signupDetails.mobile,
                "UserName": signupDetails.mobile,
                "OldPassword": this.state.oldPassword,
                "NewPassword": this.state.newPassword,
                "ConfirmPassword": this.state.confirmNewPassword,
                "UpdatedBy": "1"
            }
        }
        actions.callLogin('V1/FuncForDrAppToChangePassword', 'post', params, signupDetails.accessToken, 'changePasswords');
    }



    checkPasswordValidation = (str) => {
        //var format = /[ `?!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/~]/;
        // if (str.length < 8) {
        //     return ("New password must be between 8 and 30 characters.");
        // } else if (str.length > 30) {
        //     return ("New password must be between 8 and 30 characters.");
        // } else if (str.search(/\d/) == -1) {
        //     return ("New password must contain at least one number");
        // } else if (str.search(/[a-zA-Z]/) == -1) {
        //     return ("New password must contain at least one latter");
        // } else if (!format.test(str)) {
        //     return ("New password must contain at least one special character");
        // }
        return ("");
    }

    onDone = () => {
        var value = this.state.newPassword
        var resmsg = this.checkPasswordValidation(value)
        if (resmsg == "") {
            //if (this.state.oldPassword == this.state.currentPassword) {
            if (this.state.newPassword && this.state.confirmNewPassword && this.state.oldPassword) {
                if (this.state.newPassword == this.state.confirmNewPassword) {
                    if (this.state.newPassword != this.state.oldPassword) {
                        this.passwordChange()
                    } else {
                        Snackbar.show({ text: 'Old and new password are same', duration: Snackbar.LENGTH_SHORT, backgroundColor: Color.primary });
                    }
                } else {
                    Snackbar.show({ text: 'New password does not match', duration: Snackbar.LENGTH_SHORT, backgroundColor: Color.primary });
                }
            } else {
                Snackbar.show({ text: 'Please enter password', duration: Snackbar.LENGTH_SHORT, backgroundColor: Color.primary });
            }
            // } else {
            //     Snackbar.show({ text: 'Current password does not match', duration: Snackbar.LENGTH_SHORT, backgroundColor: Color.primary });
            // }
        } else {
            Snackbar.show({ text: resmsg, duration: Snackbar.LENGTH_SHORT, backgroundColor: Color.primary });
        }
    }

    navigateToGetStarted = () => {
        this.signOutFromGoogle();
        this.props.navigation.dispatch(navigateAction);
    }

    signOutFromGoogle = async () => {
        try {
            await AsyncStorage.setItem('profile_complete', 'logout');
            // await GoogleSignin.revokeAccess();
            // await GoogleSignin.signOut();
        } catch (error) {
            console.error(error);
        }
    };

    render() {
        return (
            <SafeAreaView style={styles.container}>
                <StatusBar backgroundColor={Color.statusBarNewColor} barStyle="dark-content"  />
                <View style={{ flex: 1, backgroundColor: Color.white }}>
                    <View style={{ justifyContent: 'center', alignItems: 'center', alignSelf: 'center', height: 137, width: 137, borderRadius: 68.5, backgroundColor: Color.lightGreen1, marginTop: 102, }}>
                        <Image source={tick} />
                    </View>
                    <Text style={{ marginTop: 70, textAlign: 'center', color: Color.yrColor, fontWeight: CustomFont.fontWeight700, fontSize: CustomFont.font22, fontFamily: CustomFont.fontName }}>
                        Your password has been changed successfully
                    </Text>
                    <TouchableOpacity
                        onPress={() => { this.navigateToGetStarted() }}
                        style={{ borderRadius: 5, justifyContent: 'center', alignItems: 'center', backgroundColor: Color.primary, margin: 45, paddingTop: 8, paddingBottom: 8, paddingStart: 27, paddingEnd: 27 }}>
                        <Text style={{ fontWeight: CustomFont.fontWeight600, color: Color.white, fontSize: CustomFont.font16, fontFamily: CustomFont.fontName }}>Okay</Text>
                    </TouchableOpacity>
                </View>
                {/* <View style={styles.headerContainer}>
                    <TouchableOpacity style={styles.backView} onPress={() => this.props.navigation.goBack()}>
                        <Image source={arrowBack} style={styles.backImage} />
                        <Text style={styles.changePasswordView}>Change Password</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={{ padding: 10 }} onPress={() => {
                                this.onDone();
                                }}>
                        <Text style={styles.doneView}>DONE</Text>
                    </TouchableOpacity>
                </View>
                <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "position" : null} >
                    <ScrollView>
                        <View style={styles.containerView}>
                            <View style={{ margin: responsiveWidth(4) }}>
                                <View style={{ flexDirection: 'row', }}>
                                    <View style={{ flex: 7, marginLeft: 10 }}>
                                        <Text style={styles.inputHeader}>Current Password</Text>
                                        <TextInput style={[styles.createInputStyle, {borderColor : this.state.fld1}]}
                                            placeholder="Enter Current Password"
                                            autoCapitalize="none"
                                            autoCorrect={false}
                                            secureTextEntry
                                            value={this.state.oldPassword}
                                            onChangeText={text => {
                                                this.setState({ oldPassword: text });
                                            }}
                                            placeholderTextColor={Color.feeText}
                                            //onSubmitEditing={() => this.refs.lname.focus()}
                                            onBlur={() => this.setState({fld1 : Color.inputdefaultBorder })}
                                            onFocus={() => this.setState({ keyboardAvoiding: responsiveHeight(-50), fld1 : Color.primary })} />
                                        <Text style={styles.inputHeader}>New Password</Text>
                                        <TextInput style={[styles.createInputStyle, {borderColor : this.state.fld2}]}
                                            placeholder="Enter New Password"
                                            placeholderTextColor={Color.feeText}
                                            autoCapitalize="none"
                                            autoCorrect={false}
                                            secureTextEntry={true}
                                            value={this.state.newPassword}
                                            //onSubmitEditing={() => this.refs.age.focus()}
                                            onChangeText={text => {
                                                this.setState({ newPassword: text });
                                            }}
                                            onBlur={() => this.setState({fld2 : Color.inputdefaultBorder })}
                                            onFocus={() => this.setState({ keyboardAvoiding: responsiveHeight(-40), fld2 : Color.primary })} />
                                        <Text style={styles.inputHeader}>Retype New Password</Text>
                                        <TextInput style={[styles.createInputStyle, {borderColor : this.state.fld3}]}
                                            placeholder="Retype New Password"
                                            placeholderTextColor={Color.feeText}
                                            autoCapitalize="none"
                                            autoCorrect={false}
                                            secureTextEntry={true}
                                            //onSubmitEditing={() => this.refs.age.focus()}
                                            value={this.state.confirmNewPassword}
                                            onChangeText={text => {
                                                this.setState({ confirmNewPassword: text });
                                            }}
                                            onBlur={() => this.setState({fld3 : Color.inputdefaultBorder })}
                                            onFocus={() => this.setState({ keyboardAvoiding: responsiveHeight(-40), fld3 : Color.primary })} />
                                    </View>
                                </View>
                            </View>

                            <Modal isVisible={this.state.passwordModal}>
                                <View style={[styles.modelViewMessage2]}>
                                    <Image source={OK} style={{ height: 65, width: 65, marginTop: 30 }} />
                                    <Text style={{ marginTop: 20, textAlign: 'center', color: Color.darkText, fontSize: CustomFont.font16, fontFamily: CustomFont.fontName }}>
                                        Your password has been changed successfully
                                    </Text>
                                    <TouchableOpacity
                                        onPress={() => {
                                            this.setState({ passwordModal: false });
                                            this.navigateToGetStarted()
                                        }}
                                        style={{ borderRadius: 5, justifyContent: 'center', alignItems: 'center', backgroundColor: Color.primary, margin: 20, paddingTop: 8, paddingBottom: 8, paddingStart: 27, paddingEnd: 27 }}>
                                        <Text style={{ color: Color.white, fontSize: CustomFont.font16, fontFamily: CustomFont.fontName }}>Ok</Text>
                                    </TouchableOpacity>
                                </View>
                            </Modal>

                        </View>
                    </ScrollView>
                </KeyboardAvoidingView> */}
            </SafeAreaView>
        );
    }
}

const mapStateToProps = state => ({
    signupDetails: state.signupReducerConfig.signupDetails,
    responseData: state.apiResponseDataConfig.responseData,
    loading: state.apiResponseDataConfig.loading,
});

const ActionCreators = Object.assign(
    {},
    apiActions, signupActions
);
const mapDispatchToProps = dispatch => ({
    actions: bindActionCreators(ActionCreators, dispatch),
});
export default connect(
    mapStateToProps,
    mapDispatchToProps,
)(ChangePassword);
