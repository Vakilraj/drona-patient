import React from 'react';
import {
    Image, SafeAreaView, ScrollView, Text, Platform, BackHandler,
    TouchableOpacity, View, TextInput
} from 'react-native';
import { responsiveFontSize, responsiveHeight, responsiveWidth } from 'react-native-responsive-dimensions';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import arrowBack from '../../../assets/arrowBack_white.png';
import Color from '../../components/Colors';
import CustomFont from '../../components/CustomFont';
import * as apiActions from '../../redux/actions/apiActions';
import * as signupActions from '../../redux/actions/signupActions';
let DoctorPatientClinicGuid = '';
import Snackbar from 'react-native-snackbar';
import Trace from '../../service/Trace'
import Validator from '../../components/Validator';
class PrivateNotes extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            checked: false,
            fld8: Color.borderColor,
            notesData: '',

        };
    }

    componentDidMount() {
        let { signupDetails } = this.props;
        let timeRange = Trace.getTimeRange();
        Trace.startTrace(timeRange, signupDetails.firebasePhoneNumber, signupDetails.firebaseDOB, signupDetails.firebaseSpeciality, signupDetails.firebaseUserType + 'Private_Notes_Screen', signupDetails.firebaseLocation)
        Trace.setLogEventWithTrace(signupDetails.firebaseUserType + "Private_Notes_Screen", { 'TimeRange': timeRange, 'Mobile': signupDetails.firebasePhoneNumber, 'Age': signupDetails.firebaseDOB, 'Speciality': signupDetails.firebaseSpeciality })
        this.getPrivateNote();
        this.backHandler = BackHandler.addEventListener('hardwareBackPress', () => this.props.navigation.goBack())
    }

    async UNSAFE_componentWillReceiveProps(newProps) {
        if (newProps.responseData && newProps.responseData.tag) {
            let tagname = newProps.responseData.tag;
            if (tagname === 'AddDoctorPrivateNote') {
                if (newProps.responseData.statusCode == -1) {
                    this.props.navigation.goBack();
                }
                Snackbar.show({ text: newProps.responseData.statusMessage, duration: Snackbar.LENGTH_SHORT, backgroundColor: Color.primary });
            } else if (tagname === 'GetDoctorPrivateNote') {
                let data = newProps.responseData.data;
                if (data) {
                    DoctorPatientClinicGuid = data.doctorPatientClinicGuid;
                    this.setState({ notesData: data.doctorPrivateNote });
                }

            }
        }
    }
    componentWillUnmount() {
        Trace.stopTrace()
    }

    callOnFocus = (type) => {
        if (type == '8') {
            this.setState({ fld8: Color.primary })
        }
    }
    callOnBlur = (type) => {
        if (type == '8') {
            this.setState({ fld8: Color.borderColor })
        }
    }

    getPrivateNote = () => {
        let { actions, signupDetails } = this.props;
        let params = {
            "UserGuid": signupDetails.UserGuid,
            "DoctorGuid": signupDetails.doctorGuid,
            "ClinicGuid": signupDetails.clinicGuid,
            "PatientGuid": signupDetails.patientGuid,
            "Version": "",
        }

        actions.callLogin('V1/FuncForDrAppToGetDoctorPrivateNote', 'post', params, signupDetails.accessToken, 'GetDoctorPrivateNote');
    }
    savePrivateNote = () => {
        Trace.stopTrace()
        let { actions, signupDetails } = this.props;
        let params = {
            "UserGuid": signupDetails.UserGuid,
            "DoctorGuid": signupDetails.doctorGuid,
            "ClinicGuid": signupDetails.clinicGuid,
            "PatientGuid": signupDetails.patientGuid,
            "Version": "",
            "Data": {
                "DoctorPrivateNote": this.state.notesData,
                "DoctorPatientClinicGuid": DoctorPatientClinicGuid
            }
        }

        actions.callLogin('V1/FuncForDrAppToAddDoctorPrivateNote', 'post', params, signupDetails.accessToken, 'AddDoctorPrivateNote');
    }
    render() {
        let { signupDetails } = this.props;
        return (
            <SafeAreaView style={{ flex: 1, backgroundColor: Color.primary }}>
                <View style={{ flex: 1, backgroundColor: Color.white }}>


                    <View style={{ flexDirection: 'row', backgroundColor: Color.white, padding: 10, height: responsiveFontSize(7.5), }}>
                        <TouchableOpacity style={{ padding: 10 }} onPress={() => this.props.navigation.goBack()}>
                            <Image source={arrowBack} style={{ tintColor: Color.primary, height: responsiveWidth(4.5), width: responsiveWidth(5) }} />
                        </TouchableOpacity>
                        <View style={{ marginTop: responsiveHeight(1), flex: 5, marginLeft: responsiveWidth(1), marginRight: responsiveWidth(1), }}>
                            <Text style={{ fontFamily: CustomFont.fontName, fontWeight: 'bold', fontSize: CustomFont.font14, color: Color.patientSearchName, marginRight: responsiveWidth(1), }}>Private Notes</Text>
                        </View>
                    </View>

                    <ScrollView style={{ padding: 10, backgroundColor: Color.patientBackground, }}>
                        <View style={{ marginBottom: 5, }}>
                            <View style={{ flex: 1, backgroundColor: Color.white, padding: 5, borderRadius: responsiveWidth(2) }}>

                                <TextInput returnKeyType="done"
                                    onFocus={() => this.callOnFocus('8')}
                                    onBlur={() => this.callOnBlur('8')}
                                    placeholderTextColor={Color.placeHolderColor}
                                    style={{ borderWidth: 1, borderColor: this.state.fld8, padding: 10, height: responsiveHeight(15), fontSize: CustomFont.font14, borderRadius: 5, marginLeft: responsiveHeight(1.5), marginRight: responsiveHeight(1.5), textAlignVertical: 'top', color: Color.optiontext, marginTop: responsiveHeight(2) }}
                                    placeholder="Add notes" multiline={true} value={this.state.notesData} onChangeText={notesData => {
                                        if (notesData) {
                                            if (Validator.isSpecialCharValidateNotes(notesData)) {
                                                this.setState({ notesData });
                                            }
                                        } else
                                            this.setState({ notesData });
                                    }} keyboardType='email-address' maxLength={560} blurOnSubmit />
                                <View style={{ alignItems: 'flex-end', marginBottom: responsiveHeight(1) }}>
                                    <Text style={{ fontSize: CustomFont.font10, color: Color.fontColor, marginRight: responsiveHeight(3), marginTop: 8, opacity: .4 }}>{this.state.notesData ? this.state.notesData.length : 0} / 560</Text>
                                </View>
                            </View>
                        </View>
                    </ScrollView>

                    <View style={{ flexDirection: 'row', padding: 10, backgroundColor: Color.white, borderTopLeftRadius: 10, borderTopRightRadius: 10 }}>
                        <TouchableOpacity
                            onPress={() => {
                                this.savePrivateNote();
                            }}
                            style={{ margin: 5, borderRadius: 5, justifyContent: 'center', alignItems: 'center', backgroundColor: Color.primary, width: '97%', height: responsiveHeight(6) }}>
                            <Text style={{ color: Color.white, fontSize: CustomFont.font14, fontFamily: CustomFont.fontName, fontWeight: CustomFont.fontWeight600 }}>Save</Text>
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
)(PrivateNotes);
