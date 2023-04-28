import React, { useState } from 'react';
import {
    SafeAreaView,
    View,
    Text, Image, TextInput, TouchableOpacity, ScrollView, BackHandler,KeyboardAvoidingView,Platform
} from 'react-native';
import styles from './style';

import * as signupActions from '../../redux/actions/signupActions';
import * as apiActions from '../../redux/actions/apiActions';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import Color from '../../components/Colors';
import CustomFont from '../../components/CustomFont';
import CommonStyle from '../../components/CommonStyle.js';
import { responsiveFontSize, responsiveHeight, responsiveWidth } from 'react-native-responsive-dimensions';
import arrowBack from '../../../assets/back_blue.png';
import Circlecheck from '../../../assets/circle_check.png';
import Circle from '../../../assets/circle.png';
import Edit from '../../../assets/ic_edit.png';
import ic_inclinic from '../../../assets/ic_inclinic.png';
import ic_person from '../../../assets/ic_person.png';
import ic_timing from '../../../assets/ic_timing.png';
import Snackbar from 'react-native-snackbar';
import Moment from 'moment';
import { setLogEvent } from '../../service/Analytics';
import Trace from '../../service/Trace'

let patientGuid = '', availabilityGuid = '', prevIndex = 0, resonOfVisitId = '', timeSlotGuid = '', DayPeriod = '', convertedStartTime = '', convertedEndTime,stop2TimesClickStatus=0;
class confirmAppointment extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            clicks: 0,
            dataArray: [],
            notes: '',
            timeslot: '',
            dateshow: '',
            patientname: '',
            patientContact: '',
            clinicType: '',
            drName: '',
            fld1: Color.inputdefaultBorder,
            patientImageUrl: ''
        };
        stop2TimesClickStatus=0
    }
    callOnFocus = () => {
        this.setState({ fld1: Color.primary })

    }
    callOnBlur = () => {
        this.setState({ fld1: Color.inputdefaultBorder })
    }

    async componentDidMount() {

        let { actions, signupDetails } = this.props;
        let timeRange = Trace.getTimeRange();
        Trace.startTrace(timeRange, signupDetails.firebasePhoneNumber, signupDetails.firebaseDOB, signupDetails.firebaseSpeciality, signupDetails.firebaseUserType +"Confirm_Appointment_Page_Time",  signupDetails.firebaseLocation);
        Trace.setLogEventWithTrace(signupDetails.firebaseUserType +"Confirm_Appointment_Page_Time", {'TimeRange' : timeRange , 'Mobile' : signupDetails.firebasePhoneNumber,'Age' : signupDetails.firebaseDOB, 'Speciality' :  signupDetails.firebaseSpeciality })
       
        let params = {
            "UserGuid": signupDetails.UserGuid,
            "ClinicGuid": "",
            "DoctorGuid": "",
            "data": {
            }
        }
        actions.callLogin('V1/FuncForDrAppToGetReasonOfVisitList', 'post', params, signupDetails.accessToken, 'ReasonOfVisitList');
        let item = this.props.navigation.state.params.item;

        let timeslot = this.props.navigation.state.params.timeslot;
        patientGuid = item.patientGuid;
        if (timeslot) {
            availabilityGuid = timeslot.availabilityGuid;
            timeSlotGuid = timeslot.timeSlotGuid;
            DayPeriod = timeslot.dayPeriad;
            convertedStartTime = Moment(timeslot.availableTime, 'hh:mm A').format('HH:mm');
            convertedEndTime = Moment(timeslot.endTime, 'hh:mm A').format('HH:mm');
            //alert(DayPeriod)
        }

        if (DRONA.getClinicType() === 'WalkIns') {
            try {
                this.setState({
                    patientname: item.patientName.replace('  ', ' '),
                    patientContact: item.phoneNumber ? item.phoneNumber : item.contactNumber,
                    drName: 'Dr. ' + signupDetails.fname + ' ' + signupDetails.lname,
                    patientImageUrl: item.imageUrl ? item.imageUrl : item.patientImageUrl
                })
            } catch (e) {
            }
        }
        else {
            try {
                this.setState({
                    timeslot: timeslot.availableTime + ' - ' + timeslot.endTime,
                    patientname: item.patientName.replace('  ', ' '),
                    patientContact: item.phoneNumber ? item.phoneNumber : item.contactNumber,
                    drName: 'Dr. ' + signupDetails.fname + ' ' + signupDetails.lname,
                    patientImageUrl: item.imageUrl ? item.imageUrl : item.patientImageUrl
                })
            } catch (e) {
            }
        }

        try {
            let selday = DRONA.getSelectedAppoinDate();
            let showDate = Moment(selday).format('DD MMM YYYY');
            var weekDayName = Moment(selday).format('dddd');
            this.setState({
                dateshow: weekDayName + ', ' + showDate
            })
        } catch (e) { }
        this.backHandler = BackHandler.addEventListener('hardwareBackPress', () => this.props.navigation.goBack())
    }
    componentWillUnmount(){
        Trace.stopTrace()
    }

    async UNSAFE_componentWillReceiveProps(newProps) {
        if (newProps.responseData && newProps.responseData.tag) {
            let tagname = newProps.responseData.tag;
            let { actions, signupDetails, loading } = this.props;
            if (tagname === 'ReasonOfVisitList') {
                if (newProps.responseData.statusCode == '0' && newProps.responseData.data)
                    var resData = newProps.responseData.data;
                let tempArr = [];
                for (let i = 0; i < resData.length; i++) {
                    let isActive = resData[i].isActive
                    if (resData[i].reasonVisitName === "Consultation") {
                        isActive = true
                        resonOfVisitId = resData[i].reasonVisitGuid
                        prevIndex=i
                    }
                    tempArr.push({ visitName: resData[i].reasonVisitName, isActive: isActive, reasonVisitGuid: resData[i].reasonVisitGuid })
                }
                this.setState({ dataArray: tempArr });
            }
            else if (tagname === 'postWalkinConfirm') {
                if (newProps.responseData.statusCode == '0' || newProps.responseData.statusCode == '-1') {
                    this.props.navigation.navigate('DoctorHome');
                }else if(newProps.responseData.statusCode == '-9'){
                    Snackbar.show({ text: 'Sorry! the appointment can not be booked now. Please try again', duration: Snackbar.LENGTH_LONG, backgroundColor: Color.primary });
                }
                setTimeout(() => {
                    Snackbar.show({ text: newProps.responseData.statusMessage, duration: Snackbar.LENGTH_LONG, backgroundColor: Color.primary });
                }, 2000)
                //
                let { signupDetails } = this.props;
                let timeRange = Trace.getTimeRange();
                Trace.startTrace(timeRange, signupDetails.firebasePhoneNumber, signupDetails.firebaseDOB, signupDetails.firebaseSpeciality,signupDetails.firebaseUserType +'Appointment_Booked', signupDetails.firebaseLocation );
                Trace.setLogEventWithTrace( signupDetails.firebaseUserType + "Appointment_Booked", { 'TimeRange' : timeRange , 'Mobile' : signupDetails.firebasePhoneNumber,'Age' : signupDetails.firebaseDOB, 'Speciality' :  signupDetails.firebaseSpeciality })
                //
                setLogEvent("walkin_book_appointment_success", { UserGuid:signupDetails.UserGuid })
            }
            else if (tagname === 'postConfirm') {
                stop2TimesClickStatus=0;
                //alert(JSON.stringify(newProps.responseData))
                if (newProps.responseData.statusCode == '0') {
                    //
                    let { signupDetails } = this.props;
                    let timeRange = Trace.getTimeRange();
                    Trace.startTrace(timeRange, signupDetails.firebasePhoneNumber, signupDetails.firebaseDOB, signupDetails.firebaseSpeciality,signupDetails.firebaseUserType +'Appointment_Booked', signupDetails.firebaseLocation );
                    Trace.setLogEventWithTrace( signupDetails.firebaseUserType + "Appointment_Booked", { 'TimeRange' : timeRange , 'Mobile' : signupDetails.firebasePhoneNumber,'Age' : signupDetails.firebaseDOB, 'Speciality' :  signupDetails.firebaseSpeciality })
                    //

                    setLogEvent("new_book_appointment_success", { UserGuid:signupDetails.UserGuid,'source':'App' })
                    this.props.navigation.navigate('DoctorHome');
                    setTimeout(() => {
                        Snackbar.show({ text: 'Appointment booked successfully', duration: Snackbar.LENGTH_LONG, backgroundColor: Color.primary });
                    }, 2000)

                } else {
                    alert(newProps.responseData.statusMessage)
                    setTimeout(() => {
                        this.props.navigation.navigate('DoctorHome');
                    }, 2000)
                }
               // setLogEvent("add_appointment", { "appointmentType": DRONA.getClinicType() })
            } else if (tagname === 'reschedule') {
                if (newProps.responseData.statusCode == '-1') {
                    //
                    let { signupDetails } = this.props;
                    let timeRange = Trace.getTimeRange();
                    Trace.startTrace(timeRange, signupDetails.firebasePhoneNumber, signupDetails.firebaseDOB, signupDetails.firebaseSpeciality,signupDetails.firebaseUserType +'Appointment_Rescheduled', signupDetails.firebaseLocation );
                    Trace.setLogEventWithTrace( signupDetails.firebaseUserType + "Appointment_Rescheduled", { 'TimeRange' : timeRange , 'Mobile' : signupDetails.firebasePhoneNumber,'Age' : signupDetails.firebaseDOB, 'Speciality' :  signupDetails.firebaseSpeciality })
                    //
                    this.props.navigation.navigate('DoctorHome');
                    setTimeout(() => {
                        Snackbar.show({ text: 'Appointment rescheduled successfully', duration: Snackbar.LENGTH_LONG, backgroundColor: Color.primary });
                    }, 2000)
                    setLogEvent("reschdule_book_appointment_success", { UserGuid:signupDetails.UserGuid })
                } else {
                    alert(newProps.responseData.statusMessage)
                    setTimeout(() => {
                        this.props.navigation.navigate('DoctorHome');
                    }, 2000)
                }
            }
        }
    }

    selectItems = (item, ind) => {
        let itemss = [...this.state.dataArray]
        itemss[prevIndex].isActive = false;
        itemss[ind].isActive = !itemss[ind].isActive
        this.setState({ dataArray: itemss })
        prevIndex = ind;
        resonOfVisitId = itemss[ind].reasonVisitGuid;
    }
    renderList = ({ item, index }) => (
        <TouchableOpacity style={{
            flex: 1, flexDirection: 'row', margin: responsiveWidth(2.5),
            backgroundColor: item.isActive ? '#FF739B' : Color.white, height: responsiveHeight(7), borderRadius: 5, justifyContent: 'center', alignItems: 'center', borderColor: Color.createInputBorder, borderWidth: 1
        }}
            onPress={() => this.selectItems(item, index)}
        >
            <Text>{item.visitName} <Image source={item.isActive ? Circlecheck : Circle} style={{ height: responsiveWidth(4.5), width: responsiveWidth(5) }} /></Text>
        </TouchableOpacity>
    );
    postConfirmData = () => {
        stop2TimesClickStatus=1;
        setTimeout(()=>{
            stop2TimesClickStatus=0;
        },2000)
        let { actions, signupDetails } = this.props;
        if (this.props.navigation.state.params.from === 'Reshedule') {
            let params = {
                "UserGuid": signupDetails.UserGuid,
                "data": {
                    "userGuid": signupDetails.UserGuid,
                    "pateintGuid": null,
                    "version": null,
                    "doctorGuid": signupDetails.doctorGuid,
                    "patientContactGuid": this.props.navigation.state.params.item.patientGuid,
                    "clinicGuid": signupDetails.clinicGuid,
                    "offerGuid": null,
                    "availabilityGuid": availabilityGuid,
                    "reasonVisitGuid": resonOfVisitId,
                    "notes": "other",
                    "PatientAppointmentGuid": signupDetails.appoinmentGuid,
                    "StartDate": DRONA.getSelectedAppoinDate(),
                    "TimeSlotGuid": timeSlotGuid,
                    "StartTime": convertedStartTime,
                    "EndTime": convertedEndTime,
                    "DayPeriod": DayPeriod,
                }
            }
            actions.callLogin('V11/FuncForDrAppToPatientBookAppointment_101_V2', 'post', params, signupDetails.accessToken, 'reschedule');
        }
        else if (DRONA.getClinicType() === 'WalkIns') {
            let params = {
                "RoleCode": signupDetails.roleCode,
                "UserGuid": signupDetails.UserGuid,
                "PatientGuid": null,
                "Version": null,
                "Data":
                {
                    "DoctorGuid": signupDetails.doctorGuid,
                    "PatientContactGuid": patientGuid,
                    "ClinicGuid": signupDetails.clinicGuid,
                    "OfferGuid": null,
                    "ReasonVisitGuid": resonOfVisitId,
                    "IsWalkIn": true,
                    "Notes": this.state.notes,
                }
            }
            actions.callLogin('V16/FuncForDrAppToPatientBookAppointment_V2_1', 'post', params, signupDetails.accessToken, 'postWalkinConfirm');
        }
        else {
            let params = {
                "RoleCode": signupDetails.roleCode,
                "UserGuid": signupDetails.UserGuid,
                "DoctorGuid": signupDetails.doctorGuid,
                "ClinicGuid": signupDetails.clinicGuid,
                "PatientGuid": null,
                "Version": null,
                "Data": {
                    "UserGuid": signupDetails.UserGuid,
                    "PatientGuid": null,
                    "Version": null,
                    "DoctorGuid": signupDetails.doctorGuid,
                    "PatientContactGuid": patientGuid,
                    "ClinicGuid": signupDetails.clinicGuid,
                    "OfferGuid": null,
                    "AvailabilityGuid": availabilityGuid,
                    "ReasonVisitGuid": resonOfVisitId,
                    "Notes": this.state.notes,
                    "StartDate": DRONA.getSelectedAppoinDate(),
                    "TimeSlotGuid": timeSlotGuid,
                    "StartTime": convertedStartTime,
                    "EndTime": convertedEndTime,
                    "DayPeriod": DayPeriod,
                    "IsForTreatment": 0,
                    
                }
            }
            //console.log('----'+JSON.stringify(params))
            actions.callLogin('V16/FuncForDrAppToPatientBookAppointment_V3', 'post', params, signupDetails.accessToken, 'postConfirm');
        }
        signupDetails.confirmAppoinmentDate=DRONA.getSelectedAppoinDate();
        actions.setSignupDetails(signupDetails);
    }

    render() {
        let { actions, signupDetails, loading } = this.props;
        return (
            <SafeAreaView style={CommonStyle.container}>
                <View style={{flex:1}}>
                <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : null} >
                <ScrollView keyboardShouldPersistTaps='always'>
                    <View style={{ flex: 1, flexDirection: 'column', alignItems: 'center', backgroundColor: Color.patientBackground }}>

                        <View style={{ flexDirection: 'row', padding: 10, alignItems: 'center', justifyContent: 'space-between', backgroundColor: Color.white, width: '100%' }}>
                            <TouchableOpacity style={{ padding: 10, flexDirection: 'row', alignItems: 'center' }} onPress={() => this.props.navigation.goBack()}>
                                <Image source={arrowBack} style={{ height: responsiveHeight(3), width: responsiveHeight(3), resizeMode: 'contain' }} />
                                <Text style={{ marginLeft: responsiveWidth(5), color: Color.patientSearch, fontFamily: CustomFont.fontName, fontSize: CustomFont.font16, fontWeight: CustomFont.fontWeight700 }}>{DRONA.getClinicType() === 'WalkIns' ? 'New Walk-In Appointment' : 'New Appointment'}</Text>
                            </TouchableOpacity>
                        </View>

                        <View style={{ flexDirection: 'column', backgroundColor: Color.patientBackground, width: '100%' }}>
                            <View style={{ margin: 15 }}>
                                <View style={{ borderTopLeftRadius: 20, borderTopRightRadius: 20, padding: 15, flexDirection: 'column', backgroundColor: Color.white, width: '100%', }}>
                                    <Text style={{ color: Color.patientSearch, fontFamily: CustomFont.fontName, fontSize: CustomFont.font14, textAlign: 'left', fontWeight: CustomFont.fontWeight700 }}>Appointment Details</Text>
                                </View>

                                <View style={{ paddingLeft: 5, flexDirection: 'row', alignItems: 'center', backgroundColor: Color.white, height: responsiveHeight(10), marginTop: 2 }}>
                                    <View style={{ flex: .9, alignItems: 'center' }}>
                                    <View>
                                            <Image source={ic_timing} style={{ height: responsiveHeight(10), width: responsiveWidth(10), resizeMode: 'contain' }} />
                                        </View>
                                    </View>
                                    <View style={{ flex: 4, marginLeft: 5 }}>
                                        {DRONA.getClinicType() === 'WalkIns' ?
                                            <Text style={{ marginLeft: responsiveWidth(-2), fontSize: CustomFont.font12, color: Color.patientSearchAge, marginTop: 3, fontFamily: CustomFont.fontName, fontWeight: CustomFont.fontWeight500 }}>{Moment(new Date()).format('dddd')} {Moment(new Date()).format('DD MMM YYYY')}</Text>
                                            :
                                            <View>
                                                <Text style={{ fontSize: CustomFont.font14, fontWeight: CustomFont.fontWeight500, color: Color.patientSearchName, fontFamily: CustomFont.fontName }}>{this.state.timeslot}</Text>
                                                <Text style={{ fontSize: CustomFont.font12, color: Color.patientSearchAge, marginTop: 3, fontFamily: CustomFont.fontName, fontWeight: CustomFont.fontWeight500 }}>{this.state.dateshow}</Text>
                                            </View>
                                        }
                                    </View>
                                    {DRONA.getClinicType() === 'WalkIns' ? null :
                                        <TouchableOpacity style={{ flex: .8, alignItems: 'center' }} onPress={() => this.props.navigation.navigate('AppoinmentTimesShow')}>
                                            <Image source={Edit} style={{ width: responsiveFontSize(3), height: responsiveFontSize(3), resizeMode: 'contain' }} />
                                        </TouchableOpacity>}
                                </View>

                                <View style={{ paddingLeft: 5, marginTop: 2, flexDirection: 'row', alignItems: 'center', backgroundColor: Color.white, height: responsiveHeight(10) }}>
                                    <View style={{ flex: .9, alignItems: 'center' }}>
                                        {this.state.patientImageUrl ? <Image source={{ uri: this.state.patientImageUrl }} style={[styles.profileRoundImg]} />
                                            : <Image source={ic_person} style={[styles.profileRoundImg]} />}
                                    </View>
                                    <View style={{ flex: 4, marginLeft: 5 }}>
                                        <Text style={{ fontSize: CustomFont.font14, fontWeight: CustomFont.fontWeight500, color: Color.patientSearchName, fontFamily: CustomFont.fontName, textTransform: 'capitalize' }}>{this.state.patientname}</Text>
                                        <Text style={{ fontSize: CustomFont.font12, color: Color.patientSearchAge, marginTop: 3, fontFamily: CustomFont.fontName, fontWeight: CustomFont.fontWeight500 }}>{this.state.patientContact}</Text>
                                    </View>
                                    <TouchableOpacity style={{ flex: .8, alignItems: 'center' }} onPress={() => this.props.navigation.goBack()}>
                                        <Image source={Edit} style={{ width: responsiveFontSize(3), height: responsiveFontSize(3), resizeMode: 'contain' }} />
                                    </TouchableOpacity>
                                </View>

                                <View style={{ paddingLeft: 5, marginTop: 2, borderBottomLeftRadius: 20, borderBottomRightRadius: 20, flexDirection: 'row', alignItems: 'center', backgroundColor: Color.white, height: responsiveHeight(10) }}>
                                    <View style={{ flex: .9, alignItems: 'center' }}>
                                        <View style={[styles.profileRoundImg]} >
                                        <Image source={ic_inclinic} style={{ height: responsiveHeight(10), width: responsiveWidth(10), resizeMode: 'contain' }}/>
                                        </View>
                                    </View>
                                    <View style={{ flex: 4, marginLeft: 5 }}>
                                        {signupDetails.isAssistantUser == true ?
                                            <View>
                                                <Text style={{ fontSize: CustomFont.font14, fontWeight: CustomFont.fontWeight500, color: Color.patientSearchName, fontFamily: CustomFont.fontName, }}>{DRONA.getClinicType() === 'InClinic' ? 'In-Clinic' : DRONA.getClinicType() === 'Virtual' ? 'Virtual' : 'Walk In'} Appointment</Text>
                                                <Text style={{ fontSize: CustomFont.font12, color: Color.patientSearchAge, marginTop: 3, fontFamily: CustomFont.fontName, fontWeight: CustomFont.fontWeight500 }}>Dr. {signupDetails.fname + ' ' + signupDetails.lname}</Text>
                                            </View>
                                            :
                                            <View>
                                                <Text style={{ fontSize: CustomFont.font14, fontWeight: CustomFont.fontWeight500, color: Color.patientSearchName, fontFamily: CustomFont.fontName, }}>{DRONA.getClinicType() === 'InClinic' ? 'In-Clinic' : DRONA.getClinicType() === 'Virtual' ? 'Virtual' : 'Walk In'} Appointment</Text>
                                                <Text style={{ fontSize: CustomFont.font12, color: Color.patientSearchAge, marginTop: 3, fontFamily: CustomFont.fontName, fontWeight: CustomFont.fontWeight500 }}>{this.state.drName}</Text>
                                            </View>
                                        }

                                    </View>
                                    <View style={{ flex: 1.2, alignItems: 'center' }}>
                                    </View>
                                </View>
                            </View>

                            <View style={{ flexDirection: 'column', backgroundColor: Color.white, margin: 15, marginTop: 0, borderRadius: 20 }}>
                                <Text style={{ padding: 15, marginLeft: 5, color: Color.patientSearch, fontFamily: CustomFont.fontName, fontSize: CustomFont.font14, textAlign: 'left', fontWeight: CustomFont.fontWeight700 }}>Reason of visit</Text>
                                <View style={{ flexDirection: 'row', flexWrap: 'wrap', alignItems: 'flex-start', paddingLeft: 15, marginRight: 15, marginBottom: 15 }}>
                                    {this.state.dataArray.map((item, index) => {
                                        return (
                                            <TouchableOpacity style={{
                                                flexDirection: 'row', margin: responsiveWidth(1.6),
                                                backgroundColor: item.isActive ? Color.genderSelection : Color.white,
                                                height: responsiveHeight(5.5),
                                                borderRadius: responsiveHeight(1),
                                                justifyContent: 'center', alignItems: 'center',
                                                borderColor: item.isActive ? Color.liveBg : Color.borderColor,
                                                borderWidth: 1
                                            }}
                                                onPress={() => this.selectItems(item, index)}
                                            >
                                                <Text style={{ fontWeight: CustomFont.fontWeight500, marginLeft: responsiveWidth(3), marginRight: responsiveWidth(3), fontSize: CustomFont.font14, color: Color.optiontext }}>{item.visitName}</Text>
                                                {/* <Image source={item.isActive ? Circlecheck : Circle} style={{ height: responsiveFontSize(2.5), width: responsiveFontSize(2.5), resizeMode: 'contain', marginRight: responsiveWidth(3) }} />
                                            */}
                                            </TouchableOpacity>
                                        );
                                    }, this)}
                                </View>
                            </View>

                            <View style={{ flexDirection: 'column', backgroundColor: Color.white, margin: 15, marginTop: 0, borderRadius: 20 }}>
                                <View style={{ flex: 2, backgroundColor: Color.white, margin: 15 }}>
                                    <Text style={{ color: Color.patientSearch, fontFamily: CustomFont.fontName, fontSize: CustomFont.font14, textAlign: 'left', fontWeight: CustomFont.fontWeight700 }}>Note</Text>
                                </View>

                                <View style={{ flex: 2, margin: 5,marginBottom:10 }}>

                                    <TextInput returnKeyType="done"
                                        onFocus={this.callOnFocus}
                                        onBlur={this.callOnBlur}
                                        style={{ borderWidth: 1, borderColor: this.state.fld1, padding: 10, height: responsiveHeight(8), fontSize: CustomFont.font14, borderRadius: 5, marginTop: 0, marginBottom: responsiveHeight(1), textAlignVertical: 'top',color:Color.fontColor }}
                                        placeholder="Enter notes here"
                                        placeholderTextColor={Color.placeHolderColor}
                                        multiline={true} value={this.state.notes} onChangeText={notes => {
                                            this.setState({ notes })
                                        }} blurOnSubmit={true}/>
                                </View>
                            </View>

                        </View>


                    </View>
                </ScrollView>
                
                </KeyboardAvoidingView>
                </View>
                
                <View style={{ width: '100%', alignItems: 'center', justifyContent: 'center', borderRadius: 4, height: responsiveHeight(9), backgroundColor: Color.white, borderTopLeftRadius: 20, borderTopRightRadius: 20,}}>

<TouchableOpacity style={{ alignItems: 'center', marginBottom: responsiveHeight(2.5), justifyContent: 'center', borderRadius: 5, height: responsiveHeight(6), width: responsiveWidth(93), backgroundColor: '#5715D2', marginTop: responsiveHeight(3) }} onPress={() => {
    if(stop2TimesClickStatus==0)
    this.postConfirmData();

    //this.props.navigation.navigate('DoctorHome')
    //alert("under development")
}}>
    <Text style={{ fontFamily: CustomFont.fontName, color: Color.white, fontSize: CustomFont.font16, textAlign: 'center' }}>Confirm Appointment</Text>
</TouchableOpacity>
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
)(confirmAppointment);
