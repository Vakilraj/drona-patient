import React, { useState } from 'react';
import {
    SafeAreaView,  View,
    Text,
    ImageBackground,
    StatusBar, Button, TouchableOpacity, Image, TextInput, SectionList, FlatList, BackHandler
} from 'react-native';
import Color from '../../../components/Colors';
import CommonStyle from '../../../components/CommonStyle.js';
import Moment from 'moment';
import CustomFont from '../../../components/CustomFont';
import { setApiHandle } from "../../../service/ApiHandle"
import Toolbar from '../../../customviews/Toolbar.js';
import { responsiveHeight, responsiveWidth, responsiveFontSize, } from 'react-native-responsive-dimensions';
import * as signupActions from '../../../redux/actions/signupActions';
import * as apiActions from '../../../redux/actions/apiActions';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import _ from 'lodash';
import Trace from '../../../service/Trace'

import patient_background from '../../../../assets/patient_background.png';
import finding_patient from '../../../../assets/finding_patient.png';
let item = null,appointmentGuid=null;

class PastEncounters extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            count: 0,
            data: [],
            consultButtonShow:true
        }
    }
    componentDidMount() {
        let { signupDetails } = this.props;
		let timeRange = Trace.getTimeRange();
		Trace.startTrace(timeRange, signupDetails.firebasePhoneNumber, signupDetails.firebaseDOB, signupDetails.firebaseSpeciality,signupDetails.firebaseUserType +'Past_Encounter_list', signupDetails.firebaseLocation );
		Trace.setLogEventWithTrace( signupDetails.firebaseUserType + "Past_Encounter_list", { 'TimeRange' : timeRange , 'Mobile' : signupDetails.firebasePhoneNumber,'Age' : signupDetails.firebaseDOB, 'Speciality' :  signupDetails.firebaseSpeciality })
        this.backHandler = BackHandler.addEventListener('hardwareBackPress', () => this.props.navigation.goBack())
        item = this.props.navigation.state.params.item;
        this.getPastEncounter();

    }
    componentWillUnmount(){
        Trace.stopTrace()
    }
    getPastEncounter = () => {
        let { actions, signupDetails } = this.props;
        // let params = { "userGuid": "a5ebc671-c456-11eb-b68b-0022486b91c8", "DoctorGuid": "2669ad72-c457-11eb-b68b-0022486b91c8", "ClinicGuid": "b437021f-c459-11eb-b68b-0022486b91c8", "Version": "", "Data": { "AppointmentGuid": "cb7180d6-c8f3-11eb-92ab-0022486b91c8" } }

        let params = {
            "RoleCode": signupDetails.roleCode,
            "userGuid": signupDetails.UserGuid, "DoctorGuid": signupDetails.doctorGuid
            , "ClinicGuid": signupDetails.clinicGuid,
            "PatientGuid": item ? item.patientGuid : null, "Data": { 
                "AppointmentGuid": signupDetails.appoinmentGuid 
            }
        }
        actions.callLogin('V1/FuncForDrAppToGetViewALLPastEncounter', 'post', params, signupDetails.accessToken, 'getPastEncounter');
    }

    async UNSAFE_componentWillReceiveProps(newProps) {
        setApiHandle(this.handleApi, newProps)
    }

    Refresh = () => {
        this.getBillingHistoryList();
    }

    handleApi = (response, tag) => {
        if (tag === 'getPastEncounter') {
            appointmentGuid=response.appointmentGuid;
            if(response.pastEncounter == null)
        {
            this.setState({consultButtonShow : false})
        }
            let temp = []
            for (const element of response.pastEncounter) {
                let year = Moment(element.consultationDate).format('YYYY')
                let index = -1;
                for (let i = 0; i < temp.length; i++) {
                    if (temp[i].year == year) {
                        index = i;
                        break;
                    }
                }
                index > -1 ? temp[index].data.push(element) : temp.push({ year: year, data: [element] })
            }
            this.setState({ data: temp })
        }
    }

    formatDate = (dateValue) => {
        return Moment(dateValue).format('DD MMM')
    }

    renderItem = (item, index) => {

        let topRadius = index == 0 ? 15 : 0;
        let bottomRadius = index == this.state.data.length ? 15 : 0;

        return (
            <TouchableOpacity onPress={() => { 
                this.props.navigation.navigate("PastEncountersDetail", { data: item, vitalMasterStatus: this.props.navigation.getParam("vitalMasterStatus"), from: 'Vitals', item: this.props.navigation.getParam("item"), date: this.props.navigation.getParam("date") })
             }
            }
                style={{ borderTopLeftRadius: topRadius, borderTopRightRadius: topRadius, borderBottomLeftRadius: bottomRadius, borderBottomRightRadius: bottomRadius, backgroundColor: Color.white, flexDirection: 'row', padding: responsiveHeight(2), marginTop: 2 }}>
                <View style={{ paddingEnd: 9, alignItems: 'center', padding: responsiveWidth(0.5), borderRadius: responsiveWidth(1), flexDirection: 'row' }}>
                    <Text style={{ fontWeight: CustomFont.fontWeight500, fontSize: CustomFont.font16, color: Color.liveBg, fontFamily: CustomFont.fontName }}>{this.formatDate(item.consultationDate).split(" ")[0]}{' '}</Text>
                    <Text style={{ fontWeight: CustomFont.fontWeight500, fontSize: CustomFont.font16, color: Color.liveBg, fontFamily: CustomFont.fontName }} >{this.formatDate(item.consultationDate).split(" ")[1]}</Text>
                </View>
                <View style={{ flex: 1, }}>
                    <Text style={{ marginTop: responsiveHeight(1.2), fontWeight: CustomFont.fontWeight500, fontFamily: CustomFont.fontName, fontSize: CustomFont.font14, marginLeft: responsiveWidth(4), color: Color.patientSearchName }}>{item.consultationType}</Text>
                    <Text style={{ marginTop: responsiveHeight(.2), fontWeight: CustomFont.fontWeight500, fontFamily: CustomFont.fontName, fontSize: CustomFont.font12, marginLeft: responsiveWidth(4), color: Color.patientSearchAge }}>Dr. {item.doctorName}</Text>
                </View>
                <View style={{ marginEnd: responsiveWidth(3) }} >
                    <Text></Text>
                    <Text style={{ marginTop: responsiveHeight(1.2), fontWeight: CustomFont.fontWeight500, alignItems: 'flex-end', fontFamily: CustomFont.fontName, fontSize: CustomFont.font12, marginLeft: responsiveWidth(4), color: Color.text3 }}>{item.consultationDaysAgo}</Text>
                </View>
            </TouchableOpacity>
        );
    };

    render() {
        let { signupDetails } = this.props;
        return (
            <SafeAreaView style={CommonStyle.containerlightBg}>
                <StatusBar backgroundColor={Color.statusBarNewColor} barStyle="dark-content" />
                {/* <NavigationEvents onDidFocus={() => this.getBillingHistoryList()} /> */}
                {/* <ScrollView> */}
                <View style={{ flex: 1, backgroundColor: Color.patientBackground }}>
                    <Toolbar
                        title={"Past Encounters"}
                        onBackPress={() => this.props.navigation.goBack()} />
                    {/* <View style={{ flexDirection: 'row', backgroundColor: Color.white, justifyContent: 'space-between', height: responsiveHeight(7), alignItems: 'center', zIndex: 999 }}>
                        <TouchableOpacity style={{ padding: 10, flexDirection: 'row', alignItems: 'center' }} onPress={() => this.props.navigation.goBack()}>
                            <Image source={arrowBack} style={{ height: responsiveWidth(4), width: responsiveWidth(5),marginLeft:responsiveWidth(1) }} />
                            <Text style={{ color: Color.patientSearch, fontSize: CustomFont.font16, fontWeight: 'bold', marginLeft: responsiveWidth(4), fontFamily: CustomFont.fontName, }}>Past Encounters</Text>
                        </TouchableOpacity>
                    </View> */}
                    <View style={{ flex: 1 }}>
                        {this.state.data.length == 0 ?

                            <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                                <ImageBackground source={patient_background} style={{ height: responsiveFontSize(25), width: responsiveFontSize(25), justifyContent: 'center', alignItems: 'center', resizeMode: 'cover', alignSelf: 'center', alignContent: 'center' }}>

                                    <Image source={finding_patient} style={{ height: responsiveFontSize(16), width: responsiveFontSize(16), resizeMode: 'cover', marginTop: responsiveFontSize(2) }} />
                                </ImageBackground>

                                <View style={{ width: '100%', flex: 1, alignItems: 'center', justifyContent: 'center', borderRadius: 4, height: responsiveHeight(9), backgroundColor: Color.white, borderTopLeftRadius: 20, borderTopRightRadius: 20, position: 'absolute', bottom: 0 }}>
                                    {(item && (!appointmentGuid || !this.state.consultButtonShow || item.appointmentStatus == 'No Show' || item.appointmentStatus == 'Cancelled' || item.appointmentStatus == 'Completed')) || signupDetails.isAssistantUser ?

                                        <View style={{ alignItems: 'center', marginBottom: responsiveHeight(2.5), justifyContent: 'center', borderRadius: 5, height: responsiveHeight(6), width: responsiveWidth(93), backgroundColor: Color.disabledBtn, marginTop: 7, marginBottom: 7 }}  >
                                            <Text style={{ fontFamily: CustomFont.fontName, color: Color.white, fontSize: CustomFont.font14, textAlign: 'center', fontWeight: CustomFont.fontWeight600 }}>Consult Now</Text>
                                        </View>
                                        :
                                        <TouchableOpacity style={{ alignItems: 'center', marginBottom: responsiveHeight(2.5), justifyContent: 'center', borderRadius: 5, height: responsiveHeight(6), width: responsiveWidth(93), backgroundColor: Color.primary, marginTop: 7, marginBottom: 7 }}
                                            onPress={() => { this.props.navigation.navigate('ConsultationTab', { vitalMasterStatus: this.props.navigation.getParam("vitalMasterStatus"), from: 'Past Encounters', item: this.props.navigation.getParam("item"), date: this.props.navigation.getParam("date"),tabIndex:0}) }}>
                                            <Text style={{ fontFamily: CustomFont.fontName, color: Color.white, fontSize: CustomFont.font14, textAlign: 'center', fontWeight: CustomFont.fontWeight600 }}>Consult Now</Text>
                                        </TouchableOpacity>
                                    }
                                </View>
                            </View>
                            :
                            <View style={{ marginTop: responsiveHeight(2), margin: responsiveWidth(3) }}>
                                <SectionList
                                stickySectionHeadersEnabled={false}
                                    // data={this.state.data}
                                    sections={this.state.data}
                                    renderItem={({ item, index }) => this.renderItem(item, index)}
                                    renderSectionHeader={({ section }) => <Text style={{ marginBottom: 8, fontSize: CustomFont.font14, fontWeight: CustomFont.fontWeight700, fontFamily: CustomFont.fontName,color:Color.fontColor }}>{section.year}</Text>}
                                    keyExtractor={(item, index) => index}
                                />
                            </View>
                        }
                    </View>
                </View>
                {/* </ScrollView> */}
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
)(PastEncounters);
