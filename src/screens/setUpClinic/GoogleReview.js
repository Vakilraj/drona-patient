import React from 'react';
import { Platform, ScrollView, Text, TextInput, TouchableOpacity, View, Linking, Image } from 'react-native';
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
import EditIcon from '../../../assets/edit_primary.png';

class GoogleReview extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            fld8: Color.borderColor,
            fld5: Color.borderColor,
            googleReviewUrlData: '',
            isUrlTextEditable: false,
            isLinkShowFlag: true,
            isSaveBtnDisable: true
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
                    if (tempdata.googleReviewUrl)
                        this.setState({ googleReviewUrlData: tempdata.googleReviewUrl, isLinkShowFlag: true });
                    else
                        this.setState({ isLinkShowFlag: false });

                }
            } else if (tagname === 'updategooglervw') {
                if (newProps.responseData.statusCode == '0') {
                    this.setState({ isLinkShowFlag: true })
                    setTimeout(() => {
                        Snackbar.show({ text: 'URL updated successfully', duration: Snackbar.LENGTH_LONG, backgroundColor: Color.primary });
                    }, 300)
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
        } else
        if (!Validator.isUrlValidate(this.state.googleReviewUrlData)) {
            Snackbar.show({ text: 'Please enter the valid URL', duration: Snackbar.LENGTH_LONG, backgroundColor: Color.primary });
        }
        else {
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

                            <View style={{ margin: responsiveWidth(3), alignItems: 'center' }}>
                                {this.state.isLinkShowFlag ? 
                                <TouchableOpacity style={{ flexDirection: 'row',alignItems: 'center',flex: 1 }} onPress={() => {
                                    Linking.openURL(this.state.googleReviewUrlData)
                                }}>
                                    <Text style={{ color: Color.primary, textDecorationLine: 'underline',flex: 1  }}>{this.state.googleReviewUrlData}</Text>
                                    <TouchableOpacity
                                    style={{marginRight: responsiveWidth(2)}}
                                     onPress={() => {
                                        this.setState({ isLinkShowFlag: false, isSaveBtnDisable: true })
                                    }}>
                                       <Image style={{ resizeMode: 'contain', height: responsiveHeight(4), width: responsiveWidth(4) }} source={EditIcon} />
                                    </TouchableOpacity>
                                </TouchableOpacity> : <View>
                                    <TextInput blurOnSubmit={false} returnKeyType="next"
                                        onBlur={() => this.callOnBlur('1')}
                                        placeholderTextColor={Color.placeHolderColor}
                                        style={{ borderWidth: 1, borderColor: this.state.fld8, padding: 10, width: responsiveWidth(88), height: responsiveHeight(12), fontSize: CustomFont.font14, borderRadius: 5, marginLeft: responsiveHeight(0), marginRight: responsiveHeight(0), textAlignVertical: 'top', color: Color.optiontext, marginTop: 10 }}
                                        placeholder="Enter Review Link" multiline={true} onChangeText={googleReviewUrlData => {
                                            this.setState({ googleReviewUrlData });
                                            if (this.state.isSaveBtnDisable)
                                                this.setState({ isSaveBtnDisable: false })
                                        }} value={this.state.googleReviewUrlData} onFocus={() => this.setState({ keyboardAvoiding: 0, fld5: Color.primary })} maxLength={2000} />
                                    <View style={{ alignItems: 'flex-end' }}>
                                        <TouchableOpacity style={{ alignItems: 'center', justifyContent: 'center', borderRadius: 5, height: responsiveHeight(6), backgroundColor: this.state.isSaveBtnDisable ? Color.btnDisable : Color.primary, marginTop: responsiveHeight(1), marginBottom: 20, width: responsiveWidth(20), marginRight: responsiveWidth(4) }} onPress={() => {
                                            this.updateGoogleReviewURL();
                                        }}>
                                            <Text style={{ fontFamily: CustomFont.fontName, color: Color.white, fontSize: CustomFont.font12, textAlign: 'center' }}>Save</Text>
                                        </TouchableOpacity>
                                    </View>

                                </View>
                                }
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
