import React from 'react';
import { Platform, ScrollView, Text, TextInput, TouchableOpacity, View, Linking } from 'react-native';
import { responsiveHeight, responsiveWidth } from 'react-native-responsive-dimensions';

import Color from '../../components/Colors';
import CustomFont from '../../components/CustomFont';
var axios = require('axios');
var qs = require('qs');


import Snackbar from 'react-native-snackbar';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import Validator from '../../components/Validator';
import * as apiActions from '../../redux/actions/apiActions';
import * as signupActions from '../../redux/actions/signupActions';

class GoogleReview extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            fld8: Color.borderColor,
            fld5: Color.borderColor,
            googleReviewUrlData: '',
            isUrlTextEditable: false,
        };
    }
    componentDidMount() {
        this.getGoogleReviewURL()
    }

    async UNSAFE_componentWillReceiveProps(newProps) {
        if (newProps.responseData && newProps.responseData.tag) {
            let tagname = newProps.responseData.tag;
            let tempdata = newProps.responseData.data
            let { actions, signupDetails, } = this.props;
            if (tagname === 'getgooglervw') {
                if (newProps.responseData.statusCode == '0') {

                    this.setState({ googleReviewUrlData: tempdata.googleReviewUrl })

                }
            }
        }
    }

    callOnBlur = (type) => {
        if (type == '1') {
            this.setState({ fld5: Color.borderColor })
        }

    }

    callOnFocus = (type) => {
        if (type == '5') {
            this.setState({ fld5: Color.primary })
        }

    }

    updateGoogleReviewURL = () => {
        if (!this.state.googleReviewUrlData) {
            Snackbar.show({ text: 'Please fill the URL', duration: Snackbar.LENGTH_LONG, backgroundColor: Color.primary });
        } else if (!Validator.isUrlValidate(this.state.googleReviewUrlData)) {
            Snackbar.show({ text: 'Please enter the valid URL', duration: Snackbar.LENGTH_LONG, backgroundColor: Color.primary });
        }
        else {
            Snackbar.show({ text: 'URL updated successfully', duration: Snackbar.LENGTH_LONG, backgroundColor: Color.primary });
            let { actions, signupDetails } = this.props;
            let params = {
                "DoctorGuid": signupDetails.doctorGuid,
                "ClinicGuid": signupDetails.clinicGuid,
                "UserGuid": signupDetails.UserGuid,
                "Version": "",
                "Data": {
                    "GoogleReviewUrl": this.state.googleReviewUrlData,
                }
            }
            actions.callLogin('V12/FuncForDrAppToUpdateGoogleReviewUrl', 'post',
                params, signupDetails.accessToken, 'updategooglervw');
            this.setState({ isUrlTextEditable: false })

        }

    }
    getGoogleReviewURL = () => {

        let { actions, signupDetails } = this.props;
        let params = {
            "DoctorGuid": signupDetails.doctorGuid,
            "ClinicGuid": signupDetails.clinicGuid,
            "UserGuid": signupDetails.UserGuid,
            "Version": "",
        }
        actions.callLogin('V12/FuncForDrAppToGetGoogleReviewUrl', 'post',
            params, signupDetails.accessToken, 'getgooglervw');


    }
    render() {
        let { signupDetails } = this.props;
        return (

            <View style={{ flex: 1, backgroundColor: Color.newBgColor, minHeight: Platform.OS == 'android' ? responsiveHeight(74) : responsiveHeight(70) }}>
                <View style={{ flex: 1 }}>
                    <ScrollView keyboardShouldPersistTaps='always'>
                        <View style={{ margin: responsiveWidth(3), backgroundColor: Color.white, borderRadius: 6 }}>
                            {/* <View style={{ alignItems: 'flex-end', marginRight: 10 }}>
                                {
                                    this.state.googleReviewUrlData && this.state.googleReviewUrlData.length > 0 ?
                                        <TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center' }} onPress={() => {
                                            console.log('get api called')
                                            this.getGoogleReviewURL();
                                        }}>
                                            <Image source={EditBlue} style={{ height: responsiveFontSize(2), width: responsiveFontSize(2), resizeMode: 'contain', margin: 7 }} />
                                            <Text style={{ fontFamily: CustomFont.fontNameSemiBold, fontSize: CustomFont.font14, color: Color.primary }}>Edit</Text>
                                        </TouchableOpacity> : null}
                            </View> */}

                            <View style={{ flexDirection: 'row', justifyContent: 'space-between', margin: responsiveWidth(3), alignItems: 'center' }}>
                                {
                                    !this.state.isUrlTextEditable ?
                                        <TouchableOpacity onPress={()=>{
                                             Linking.openURL(this.state.googleReviewUrlData)
                                             } }>
                                            <Text style={{ borderWidth: 1, borderColor: this.state.fld8,
                                                     padding: 10, 
                                                     width: responsiveWidth(88),
                                                      height: responsiveHeight(12),
                                                       fontSize: CustomFont.font14,
                                                        borderRadius: 5, marginLeft: responsiveHeight(0),
                                                         marginRight: responsiveHeight(0), 
                                                         textAlignVertical: 'top', 
                                                         color: Color.optiontext, marginTop: 10 }}>{this.state.googleReviewUrlData}</Text>
                                        </TouchableOpacity> :
                                        <TextInput blurOnSubmit={false} returnKeyType="next"
                                            editable={this.state.isUrlTextEditable}
                                            onBlur={() => this.callOnBlur('1')}
                                            placeholderTextColor={Color.placeHolderColor}
                                            style={{ borderWidth: 1, borderColor: this.state.fld8, padding: 10, width: responsiveWidth(88), height: responsiveHeight(12), fontSize: CustomFont.font14, borderRadius: 5, marginLeft: responsiveHeight(0), marginRight: responsiveHeight(0), textAlignVertical: 'top', color: Color.optiontext, marginTop: 10 }}
                                            placeholder="Enter Review Link" multiline={true} onChangeText={googleReviewUrlData => {
                                                this.setState({ googleReviewUrlData });
                                            }} value={this.state.googleReviewUrlData} onFocus={() => this.setState({ keyboardAvoiding: 0, fld5: Color.primary })} maxLength={2000} />
                                }
                            </View>
                            <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'flex-end' }}>
                            <TouchableOpacity style={{ alignItems: 'center', justifyContent: 'center', borderRadius: 5, height: responsiveHeight(6), backgroundColor: Color.primary, marginTop: responsiveHeight(1), marginBottom: 20, width: responsiveWidth(20), marginRight: responsiveWidth(4) }} onPress={() => {
                                        this.setState({ isUrlTextEditable: true })
                                    }}>
                                        <Text style={{ fontFamily: CustomFont.fontName, color: Color.white, fontSize: CustomFont.font12, textAlign: 'center' }}>Edit</Text>
                                </TouchableOpacity>
                                    <TouchableOpacity style={{ alignItems: 'center', justifyContent: 'center', borderRadius: 5, height: responsiveHeight(6), backgroundColor: Color.primary, marginTop: responsiveHeight(1), marginBottom: 20, width: responsiveWidth(20), marginRight: responsiveWidth(4) }} onPress={() => {
                                        this.updateGoogleReviewURL();
                                    }}>
                                        <Text style={{ fontFamily: CustomFont.fontName, color: Color.white, fontSize: CustomFont.font12, textAlign: 'center' }}>Save</Text>
                                    </TouchableOpacity>
                                    
                                
                            </View>
                        </View>
                    </ScrollView>
                </View>
            </View>

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
)(GoogleReview);
