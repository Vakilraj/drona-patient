import React from 'react';
import {
    Image, SafeAreaView, Text,
    TouchableOpacity, View, TextInput
} from 'react-native';
import { responsiveFontSize, responsiveHeight, responsiveWidth } from 'react-native-responsive-dimensions';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import arrowBack from '../../../../assets/arrowBack_white.png';
import RupeeIcon from '../../../../assets/rupee.png';
import Color from '../../../components/Colors';
import CustomFont from '../../../components/CustomFont';
import * as apiActions from '../../../redux/actions/apiActions';
import * as signupActions from '../../../redux/actions/signupActions';
import { setApiHandle } from "../../../service/ApiHandle";
import arrow_right from '../../../../assets/arrow_right.png';
import Toolbar from '../../../customviews/Toolbar.js';
import Snackbar from 'react-native-snackbar';
import Validator from '../../../components/Validator';
let patientTreatmentDetailsGuid='';
class Dentist extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            treatmenDateTime: '',
            initialHeight: 3,
            workdoneTxt: '',
            amountTxt: ''

        };
    }

    componentDidMount() {
        let item = this.props.navigation.state.params.item;
        this.setState({ treatmenDateTime: item.appointmentDate + ', ' + item.appointmentTime, workdoneTxt: item.workDone, amountTxt: item.amountPaid + '' })
        patientTreatmentDetailsGuid=this.props.navigation.state.params.patientTreatmentDetailsGuid;
    }

    async UNSAFE_componentWillReceiveProps(newProps) {
        if (newProps.responseData && newProps.responseData.tag) {
            let tagname = newProps.responseData.tag;
            if (tagname === 'AddUpdateTreatmentAppointment') {
                if (newProps.responseData.statusCode == 0) {
                    setTimeout(() => {
                       // this.props.navigation.goBack();
                       DRONA.setIsDrTimingsUpdated(true);
                       this.props.navigation.navigate('AddDentistAppoinment')
                       
                    }, 2000)
                }
                Snackbar.show({ text: newProps.responseData.statusMessage, duration: Snackbar.LENGTH_LONG, backgroundColor: Color.primary });
            }
        }
    }

    typeWorkDone = (text) => {
        this.setState({ workdoneTxt: text })
    }
    saveWorkDone = () => {
        if(!this.state.workdoneTxt.trim()){
            Snackbar.show({ text: 'Please enter treatment plans', duration: Snackbar.LENGTH_LONG, backgroundColor: Color.primary });
        }else if(!this.state.amountTxt.trim()){
            Snackbar.show({ text: 'Please enter amount', duration: Snackbar.LENGTH_LONG, backgroundColor: Color.primary });
        }else{
            let item = this.props.navigation.state.params.item;
            let { actions, signupDetails } = this.props;
            let params = {
                "UserGuid": signupDetails.UserGuid,
                "ClinicGuid": signupDetails.clinicGuid,
                "DoctorGuid": signupDetails.doctorGuid,
                "PatientGuid": signupDetails.patientGuid,
                "Version": null,
                "Data": {
                    "TreatmentAppointmenGuid": item.treatmentAppointmenGuid,
                    "PatientTreatmentDetailsGuid": patientTreatmentDetailsGuid,
                    "AppointmentGuid": item.appointmentGuid,
                    "WorkDone": this.state.workdoneTxt,
                    "AmountPaid": this.state.amountTxt,
                }
            }
            actions.callLogin('V1/FuncForDrAppToAddTreatmentAppointment', 'post', params, signupDetails.accessToken, 'AddUpdateTreatmentAppointment');
        }
        
    }



    render() {
        let { signupDetails } = this.props;
        return (
            <SafeAreaView style={{ flex: 1, backgroundColor: Color.statusBarNewColor }}>
                <View style={{ flex: 1, backgroundColor: Color.statusBarNewColor }}>
                    <Toolbar
                        title={this.state.treatmenDateTime}
                        onBackPress={() => this.props.navigation.goBack()} />

                    <View style={{
                        borderRadius: 10, padding: responsiveWidth(4),
                        marginTop: responsiveHeight(3),
                        marginLeft: responsiveWidth(3), marginRight: responsiveWidth(3), backgroundColor: Color.white
                    }}>
                        <Text style={{ color: Color.fontColor, fontFamily: CustomFont.fontName, fontSize: CustomFont.font14, fontWeight: CustomFont.fontWeightBold }}>Treatment Plans</Text>
                        <TextInput returnKeyType="done" onChangeText={this.typeWorkDone} multiline={true} numberOfLines={4} style={{
                            fontSize: CustomFont.font14,
                            color: Color.fontColor,
                            textAlign: 'left',
                            padding: 10,
                            borderRadius: 10,
                            marginTop: responsiveHeight(1.5),
                            height: responsiveHeight(10),
                            fontWeight: CustomFont.fontWeight400,
                            fontFamily: CustomFont.fontName, borderColor: Color.borderColor, borderWidth: 1
                        }}
                            value={this.state.workdoneTxt}
                            placeholder={"Add treatment details here"}
                            placeholderTextColor={Color.datecolor}
                            maxLength={200}
                            blurOnSubmit={true}
                        />
                    </View>

                    <View style={{
                        borderRadius: 10, padding: responsiveWidth(4),
                        marginTop: responsiveHeight(3),
                        marginLeft: responsiveWidth(3), marginRight: responsiveWidth(3), backgroundColor: Color.white
                    }}>
                        <Text style={{ color: Color.fontColor, fontFamily: CustomFont.fontName, fontSize: CustomFont.font14, fontWeight: CustomFont.fontWeightBold }}>Amount Paid</Text>
                        <View>
                            <TextInput returnKeyType="done" style={{
                                height: responsiveHeight(5),
                                fontSize: CustomFont.font14,
                                color: Color.fontColor,
                                textAlign: 'left',
                                paddingLeft: 40,
                                borderRadius: 10,
                                marginTop: responsiveHeight(1.5),
                                // backgroundColor : Color.accountTypeSelBg,
                                fontWeight: CustomFont.fontWeight400,
                                fontFamily: CustomFont.fontName, borderColor: Color.borderColor, borderWidth: 1
                            }}
                            onChangeText={amountTxt => {
                                if (amountTxt) {
                                    if (Validator.isMobileValidate(amountTxt)) {
                                        this.setState({ amountTxt });
                                    }
                                } else
                                    this.setState({ amountTxt });
                                }}
                            maxLength={7}
                                value={this.state.amountTxt}
                                placeholderTextColor={Color.datecolor}
                                keyboardType="number-pad" 
                            />
                            <Image source={RupeeIcon} style={{ marginTop: responsiveHeight(-5), marginLeft: responsiveWidth(4), height: responsiveHeight(5), width: responsiveWidth(3), resizeMode: 'contain' }} />
                        </View>
                    </View>
                    <View style={{
                        justifyContent: 'center', alignItems: 'center', width: responsiveWidth(100),
                        backgroundColor: Color.white, bottom: responsiveHeight(-4),
                        position: 'absolute', borderTopLeftRadius: 10, borderTopRightRadius: 10
                    }}>
                        <TouchableOpacity style={{ width: responsiveWidth(90), height: responsiveHeight(5.5), borderRadius: 10, backgroundColor: Color.primary, alignItems: 'center', justifyContent: 'center',marginBottom:responsiveHeight(5.5),marginTop:responsiveHeight(3) }} onPress={() => {
                            this.saveWorkDone();
                        }}>
                            <Text style={{ color: Color.white, fontFamily: CustomFont.fontName, fontSize: CustomFont.font14, fontWeight: CustomFont.fontWeightBold }}>Save</Text>
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
)(Dentist);

