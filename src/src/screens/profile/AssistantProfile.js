import React from 'react';
import {
    Image, SafeAreaView,
    ScrollView, StatusBar, Text, TextInput, TouchableOpacity,BackHandler, View
} from 'react-native';
import { responsiveHeight, responsiveWidth } from 'react-native-responsive-dimensions';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import arrowBack from '../../../assets/back_blue.png';
import Color from '../../components/Colors';
import CommonStyle from '../../components/CommonStyle.js';
import CustomFont from '../../components/CustomFont';
import * as apiActions from '../../redux/actions/apiActions';
import * as signupActions from '../../redux/actions/signupActions';
import styles from './style';
import Snackbar from 'react-native-snackbar';
import EmailValidator from '../../components/Validator'
import Validator from '../../components/Validator';
let assistantProfileData = null

class AssistantProfile extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            firstName: '',
            lastName: '',
            mobileNumber: '',
            emailId: '',
            fld1: Color.newBorder,
            fld2: Color.newBorder,
            fld3: Color.newBorder,
            fld4: Color.newBorder,
            assistantGUID: '',
			isMale: false,
			isFemale: false,
			isOther: false,
        };
    }

    componentDidMount() {
        let { signupDetails } = this.props;
        assistantProfileData = this.props.navigation.state.params.assistantProfileData;
        this.setState({
            firstName: assistantProfileData.assistanceFirstName,
            lastName: assistantProfileData.assistanceLastName,
            mobileNumber: assistantProfileData.phoneNo,
            emailId: assistantProfileData.email,
        })
        if(assistantProfileData.genderCode=='F'){
          this.setState({isFemale: true});
        }else if(assistantProfileData.genderCode=='M'){
          this.setState({isMale: true});
        }else{
            this.setState({isOther: true});
        }
        this.backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
            this.props.navigation.goBack();
            try {
                this.props.navigation.state.params.Refresh();
            } catch (error) {
                
            }
            
        })
    }

    updateAssistantProfile = () => {
        if (!this.state.firstName.trim()) {
            Snackbar.show({ text: 'Please enter first name', duration: Snackbar.LENGTH_SHORT, backgroundColor: Color.primary });
        }
        else if (!this.state.lastName.trim()) {
            Snackbar.show({ text: 'Please enter last name', duration: Snackbar.LENGTH_SHORT, backgroundColor: Color.primary });
        }
        else if (!Validator.isNameValidate(this.state.firstName.trim()) || !Validator.isNameValidate(this.state.lastName)) {
            Snackbar.show({ text: 'Name should contain only alphabets', duration: Snackbar.LENGTH_SHORT, backgroundColor: Color.primary });
        } else if (!this.state.mobileNumber) {
            Snackbar.show({ text: 'Please enter mobile number', duration: Snackbar.LENGTH_SHORT, backgroundColor: Color.primary });
        }
        else if (this.state.mobileNumber.length != 10) {
            Snackbar.show({ text: 'Mobile number should be 10 digit', duration: Snackbar.LENGTH_SHORT, backgroundColor: Color.primary });
        } else if (!Validator.isMobileValidate(this.state.mobileNumber)) {
            Snackbar.show({ text: 'Mobile number should contain only number', duration: Snackbar.LENGTH_SHORT, backgroundColor: Color.primary });
        }
        // else if (!this.state.emailId) {
        //     Snackbar.show({ text: 'Please enter email id', duration: Snackbar.LENGTH_SHORT, backgroundColor: Color.primary });
        // }
        // else if (this.state.email != '' && !EmailValidator.isEmailValid(this.state.emailId)) {
        //     Snackbar.show({ text: 'Please Enter valid email', duration: Snackbar.LENGTH_SHORT, backgroundColor: Color.primary });
        // }
        else {
            let { actions, signupDetails } = this.props;
            let params = {
                "UserGuid": signupDetails.UserGuid,
                "ClinicGuid": signupDetails.clinicGuid,
                "DoctorGuid": signupDetails.doctorGuid,
                "Data": {
                    "AssistanceGuid": assistantProfileData.assistanceGuid,
                    "AssistanceUserGuid": assistantProfileData.assistanceUserGuid,
                    "AssistanceFirstName": this.state.firstName.trim(),
                    "AssistanceMiddleName": "",
                    "AssistanceLastName": this.state.lastName.trim(),
                    "PhoneNo": this.state.mobileNumber,
                    "Email": this.state.emailId,
                    "GenderCode": this.state.isMale ? "M" : this.state.isFemale ? "F" : "O",
                }
            }
            actions.callLogin('V1/FuncForDrAppToUpdateAssistantProfile', 'post', params, signupDetails.accessToken, 'updateAssistantProfile');

        }
    }

    async UNSAFE_componentWillReceiveProps(newProps) {
        if (newProps.responseData && newProps.responseData.tag) {
            let tagname = newProps.responseData.tag;
            if (tagname == "updateAssistantProfile") {
                alert('Profile updated successfully')
                    this.props.navigation.goBack();
                    try {
                        this.props.navigation.state.params.Refresh();
                    } catch (error) {
                        
                    }
                    
            }
        }
    }
	clickGender = (gender) => {
		if (gender === 'male') {
			this.setState({ isMale: true, isFemale: false, isOther: false })
		} else if (gender === 'female') {
			this.setState({ isMale: false, isFemale: true, isOther: false })
		}
		else {
			this.setState({ isMale: false, isFemale: false, isOther: true })
		}
	}
    render() {
        return (
            <SafeAreaView style={CommonStyle.container}>
                <StatusBar backgroundColor={Color.statusBarNewColor} barStyle="dark-content" />

                <View style={{ flex: 1, backgroundColor: Color.patientBackground }}>

                    <View style={{ flexDirection: 'row', padding: 10, alignItems: 'center', justifyContent: 'space-between', backgroundColor: Color.white, width: '100%' }}>
                        <TouchableOpacity style={{ padding: 10, flexDirection: 'row', alignItems: 'center' }} onPress={() => {
						this.props.navigation.goBack();
                        try {
                            this.props.navigation.state.params.Refresh();
                        } catch (error) {
                            
                        }
						
					}}>
                            <Image source={arrowBack} style={{ height: responsiveHeight(3), width: responsiveHeight(3), resizeMode: 'contain' }} />
                            <Text style={{ marginLeft: responsiveWidth(5), color: Color.patientSearch, fontFamily: CustomFont.fontName, fontSize: CustomFont.font16, fontWeight: CustomFont.fontWeight700 }}>Profile</Text>
                        </TouchableOpacity>
                    </View>
                    <ScrollView>
                        <View style={{ flex: 1, margin: 20, borderRadius: 10, backgroundColor: Color.white, padding: 20 }}>
                            <Text style={{ ...styles.tiTitle, marginTop: 0 }}>First Name </Text>
                            <View>
                                <TextInput returnKeyType="done" style={[styles.modelTextInput1, { borderColor: this.state.fld1,}]}
                                    placeholder="Enter First Name"
                                    autoCapitalize="none"
                                    autoCorrect={false}
                                    value={this.state.firstName}
                                    onChangeText={text => {
                                        this.setState({ firstName: text });
                                    }}
                                    placeholderTextColor={Color.placeHolderColor}
                                    onBlur={() => this.setState({ fld1: Color.newBorder })} onFocus={() => this.setState({ keyboardAvoiding: responsiveHeight(-50), fld1: Color.primary })} />
                            </View>


                            <Text style={styles.tiTitle}>Last Name </Text>
                            <View>
                                <TextInput returnKeyType="done" style={[styles.modelTextInput1, { borderColor: this.state.fld2, }]}
                                    placeholder="Enter Last Name"
                                    autoCapitalize="none"
                                    autoCorrect={false}
                                    value={this.state.lastName}
                                    onChangeText={text => {
                                        this.setState({ lastName: text });
                                    }}
                                    placeholderTextColor={Color.placeHolderColor}
                                    onBlur={() => this.setState({ fld2: Color.newBorder })} onFocus={() => this.setState({ keyboardAvoiding: responsiveHeight(-50), fld2: Color.primary })} />
                            </View>

                            <Text style={styles.tiTitle}>Mobile Number</Text>
                            <View>
                                <TextInput returnKeyType="done" style={[styles.modelTextInput1, { borderColor: this.state.fld3 }]}
                                    placeholder="Enter mobile Number"
                                    autoCapitalize="none"
                                    autoCorrect={false}
                                    keyboardType={'number-pad'}
                                    maxLength={10}
                                    value={this.state.mobileNumber}
                                    onChangeText={text => {
                                        this.setState({ mobileNumber: text.trim() });
                                    }}
                                    editable={false}
                                    placeholderTextColor={Color.placeHolderColor}
                                    onBlur={() => this.setState({ fld3: Color.newBorder })} onFocus={() => this.setState({ keyboardAvoiding: responsiveHeight(-50), fld3: Color.primary })} />
                            </View>
                            <Text style={styles.tiTitle}>Select Gender</Text>
                            <View style={{ flexDirection: 'row', marginTop: 10, marginRight: responsiveWidth(10) }}>
									<TouchableOpacity style={{ flex: 1, alignItems: 'center', justifyContent: 'center', height: responsiveHeight(5.5), borderRadius: 4, borderWidth: 1, borderColor: this.state.isMale ? Color.liveBg : Color.lightBlueBorder, backgroundColor: this.state.isMale ? Color.accountTypeSelBg : Color.white }} onPress={() => this.clickGender('male')}>
										<Text style={{ color: Color.fontColor, fontSize: CustomFont.font14 }}>Male</Text>
									</TouchableOpacity>
									<TouchableOpacity style={{ flex: 1, alignItems: 'center', justifyContent: 'center', height: responsiveHeight(5.5), borderRadius: 4, borderWidth: 1, borderColor: this.state.isFemale ? Color.liveBg : Color.lightBlueBorder, backgroundColor: this.state.isFemale ? Color.accountTypeSelBg : Color.white, marginLeft: 10, marginRight: 10 }} onPress={() => this.clickGender('female')}>
										<Text style={{ color: Color.fontColor, fontSize: CustomFont.font14, }}>Female</Text>
									</TouchableOpacity>
									<TouchableOpacity style={{ flex: 1, alignItems: 'center', justifyContent: 'center', height: responsiveHeight(5.5), borderRadius: 4, borderWidth: 1, borderColor: this.state.isOther ? Color.liveBg : Color.lightBlueBorder, backgroundColor: this.state.isOther ? Color.accountTypeSelBg : Color.white }} onPress={() => this.clickGender('other')}>
										<Text style={{ color: Color.fontColor, fontSize: CustomFont.font14, }}>Other</Text>
									</TouchableOpacity>
								</View>
                            <Text style={styles.tiTitle}>Email ID</Text>
                            <View>
                                <TextInput returnKeyType="done" style={[styles.modelTextInput1, { borderColor: this.state.fld4, }]}
                                    placeholder="Enter Email Address"
                                    autoCapitalize="none"
                                    autoCorrect={false}
                                    keyboardType={'email-address'}
                                    value={this.state.emailId}
                                    onChangeText={text => {
                                        this.setState({ emailId: text.trim() });
                                    }}
                                    placeholderTextColor={Color.placeHolderColor}
                                    onBlur={() => this.setState({ fld4: Color.newBorder })} onFocus={() => this.setState({ keyboardAvoiding: responsiveHeight(-50), fld4: Color.primary })} />
                            </View>
                        </View>
                    </ScrollView>
                    <View style={{ width: '100%', alignItems: 'center', justifyContent: 'center', borderRadius: 4, height: responsiveHeight(9), backgroundColor: Color.white, borderTopLeftRadius: 20, borderTopRightRadius: 20 }}>
                        <TouchableOpacity style={{ alignItems: 'center', marginBottom: responsiveHeight(2.5), justifyContent: 'center', borderRadius: 5, height: responsiveHeight(5.5), width: responsiveWidth(93), backgroundColor: Color.primary, marginTop: responsiveHeight(3) }} onPress={() => {
                            this.updateAssistantProfile()
                        }}>
                            <Text style={{ fontFamily: CustomFont.fontName, color: Color.white, fontSize: CustomFont.font16, textAlign: 'center' }}>Save</Text>
                        </TouchableOpacity>
                    </View>

                </View>
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
)(AssistantProfile);
