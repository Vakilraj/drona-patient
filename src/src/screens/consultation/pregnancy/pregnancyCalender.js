import React, { useState } from 'react';
import {
    SafeAreaView, View,
    ScrollView,
    Text,
    StatusBar, TouchableOpacity, Image, BackHandler, SectionList
} from 'react-native';
import CalendarPicker from 'react-native-calendar-picker';
import Color from '../../../components/Colors';
import Modal from 'react-native-modal';
import CommonStyle from '../../../components/CommonStyle.js';
import Moment from 'moment';
import CustomFont from '../../../components/CustomFont';
import { responsiveHeight, responsiveWidth, responsiveFontSize, } from 'react-native-responsive-dimensions';
import * as signupActions from '../../../redux/actions/signupActions';
import * as apiActions from '../../../redux/actions/apiActions';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import _ from 'lodash';
import { NavigationEvents } from 'react-navigation';
import arrowBack from '../../../../assets/back_blue.png';
import plus_new from '../../../../assets/plus_new.png';
import CalenderIcon from '../../../../assets/calender_icon.png';
import radioSelected from '../../../../assets/radioSelected.png';
import radioNotSelected from '../../../../assets/radioNotSelected.png';
import { TextInput } from 'react-native-gesture-handler';
import { setApiHandle } from "../../../service/ApiHandle"

let selectedDay = '', selectedDayReformat = '', selectedDayReformatDue = '';
let item = null;
let details = null;


class pregnancyCalender extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            showSelectedDay: '',
            isModalVisibleCalendars: false,
            pregnancyType: 'pre',
            headerText: 'Last Menstrual Period Date (LMP)'
        }
    }
    componentDidMount() {
        this.backHandler = BackHandler.addEventListener('hardwareBackPress', () => this.props.navigation.goBack())
        item = this.props.navigation.state.params.item;
        details = this.props.navigation.state.params.details;
        // alert(JSON.stringify(item))
    }

    async UNSAFE_componentWillReceiveProps(newProps) {
        // setApiHandle(this.handleApi, newProps)
    }

    clickOnDone = () => {
        if (this.state.isModalVisibleCalendars) {
            this.setState({ showSelectedDay: selectedDayReformat, isModalVisibleCalendars: false });
        }
    }

    clickOnPrePregnancy = () => {
        this.setState({ pregnancyType: 'pre', headerText: 'Last Menstrual Period Date (LMP)' })
    }

    clickOnPostPregnancy = () => {
        this.setState({ pregnancyType: 'post', headerText: 'Actual Delivery Date (ADD)' })
    }

    generateChart = () => {
        let { actions, signupDetails } = this.props;

        let pregnencyTypeGuid = ""
        for (let i = 0; i < details.pregrancyType.length; i++) {
            if (details.pregrancyType[i].pregrancyType === "Pre Pregnency" && this.state.pregnancyType == 'pre') {
                pregnencyTypeGuid = details.pregrancyType[i].pregrancyTypeGuid
                break
            } else if (details.pregrancyType[i].pregrancyType === "Post Pregnency" && this.state.pregnancyType == 'post') {
                pregnencyTypeGuid = details.pregrancyType[i].pregrancyTypeGuid
                break
            }
        }

        var finalDate = this.getdateFormat(this.state.showSelectedDay);
        let params = {
            "UserGuid": signupDetails.UserGuid,
            "DoctorGuid": signupDetails.doctorGuid,
            "ClinicGuid": null,
            "Version": null,
            "data": {
                "PatientGuid": item.patientGuid,
                "PregnencyTypeGuid": pregnencyTypeGuid,
                "LMPDate": this.state.pregnancyType == 'pre' ? finalDate : "",
                "ADDDate": this.state.pregnancyType == 'post' ? finalDate : ""
            }
        }
        // console.log('Hukka ' + JSON.stringify(params))
        actions.callLogin('V1/FuncForDrAppToGetPregnancyCalnderInfo', 'post', params, signupDetails.accessToken, 'getpregnancydata');
    }

    getdateFormat = (val) => {
        let str = '';
        try {
            str = Moment(val).format('YYYY-MM-DD');
        } catch (error) {
            str = val;
        }
        return str;
    }

    async UNSAFE_componentWillReceiveProps(newProps) {
        setApiHandle(this.handleApi, newProps)
    }

    handleApi = (response, tag, statusMessage) => {
        if (tag === 'getpregnancydata') {
            this.props.navigation.navigate('PregnancyList', { item: item, data: response, details: details })
        }
    }

    render() {
        return (
            <SafeAreaView style={CommonStyle.containerlightBg}>
                <StatusBar backgroundColor={Color.statusBarNewColor} barStyle="dark-content" />
                {/* <NavigationEvents onDidFocus={() => this.getBillingHistoryList()} /> */}
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', backgroundColor: Color.white }}>
                    <TouchableOpacity onPress={() => this.props.navigation.goBack()} style={{ backgroundColor: Color.white, flexDirection: 'row', height: responsiveHeight(7), alignItems: 'center' }}>
                        <TouchableOpacity onPress={() => this.props.navigation.goBack()} >
                            <Image source={arrowBack} style={{ marginLeft: responsiveWidth(3), marginTop: responsiveHeight(.8), marginBottom: responsiveWidth(2), width: responsiveFontSize(3.2), height: responsiveFontSize(3.2), resizeMode: 'contain' }} />
                        </TouchableOpacity>
                        <Text style={{ color: Color.fontColor, fontSize: CustomFont.font16, marginLeft: responsiveWidth(4), fontFamily: CustomFont.fontName, }}>Pregnancy Calendar</Text>
                    </TouchableOpacity>
                    {/* <TouchableOpacity style={{ justifyContent: 'center', flexDirection: 'row', alignItems: 'center' }}>
                        <TouchableOpacity>
                            <Image source={plus_new} style={{ marginLeft: responsiveWidth(5), marginRight: responsiveWidth(3), marginTop: responsiveHeight(.8), marginBottom: responsiveWidth(2), width: responsiveFontSize(2.2), height: responsiveFontSize(2.2), resizeMode: 'contain' }} />
                        </TouchableOpacity>
                    </TouchableOpacity> */}
                </View>
                {/* backgroundColor: Color.PregnancyBack */}
                <View style={{ flex: 1, backgroundColor: Color.PregnancyBack }}>
                    <View style={{ marginTop: responsiveWidth(4), paddingTop: responsiveWidth(4), paddingLeft: responsiveWidth(4), backgroundColor: Color.white }}>
                        <View style={{ flexDirection: 'row', justifyContent: 'flex-start', backgroundColor: Color.white }}>
                            <TouchableOpacity
                                onPress={this.clickOnPrePregnancy}
                                style={{ backgroundColor: Color.white, flexDirection: 'row', height: responsiveHeight(7), alignItems: 'center' }}>
                                {/* <TouchableOpacity> */}
                                <Image source={this.state.pregnancyType == 'pre' ? radioSelected : radioNotSelected} style={{ marginTop: responsiveWidth(2.3), marginLeft: responsiveWidth(1), marginRight: responsiveWidth(2), marginBottom: responsiveWidth(2), width: responsiveFontSize(2.2), height: responsiveFontSize(2.2), resizeMode: 'contain' }} />
                                {/* </TouchableOpacity> */}
                                <Text style={{ fontFamily: CustomFont.fontName, fontSize: CustomFont.font14, color: Color.text2, fontWeight: 'bold' }}>Pre-Pregnancy</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                onPress={this.clickOnPostPregnancy}
                                style={{ marginLeft: responsiveWidth(5), justifyContent: 'center', flexDirection: 'row', alignItems: 'center' }}>
                                {/* <TouchableOpacity> */}
                                <Image source={this.state.pregnancyType == 'post' ? radioSelected : radioNotSelected} style={{ marginTop: responsiveWidth(2.3), marginLeft: responsiveWidth(1), marginRight: responsiveWidth(2), marginBottom: responsiveWidth(2), width: responsiveFontSize(2.2), height: responsiveFontSize(2.2), resizeMode: 'contain' }} />
                                {/* </TouchableOpacity> */}
                                <Text style={{ fontFamily: CustomFont.fontName, fontSize: CustomFont.font14, color: Color.text2, fontWeight: 'bold' }} >Post-Pregnancy</Text>
                            </TouchableOpacity>
                        </View>

                        <View style={{ flex: 6 }}>
                            <Text style={{ borderColor: '#D5DAF3CC', borderBottomWidth: 1, marginRight: responsiveWidth(3) }} />
                        </View>

                        <Text style={{ marginTop: responsiveHeight(2), fontFamily: CustomFont.fontName, fontSize: CustomFont.font12, color: Color.textItem }} >{this.state.headerText}</Text>
                        <TouchableOpacity style={{ width: responsiveWidth(40), height: responsiveHeight(6), borderColor: Color.createInputBorder, borderWidth: 1, borderRadius: 5, backgroundColor: Color.white, alignItems: 'center', justifyContent: 'center', marginTop: responsiveHeight(1.2), flexDirection: 'row' }}
                            onPress={() => {
                                this.setState({ isModalVisibleCalendars: true })
                            }}>
                            <TextInput returnKeyType="done" style={{ marginLeft: responsiveWidth(2), fontSize: CustomFont.font14, color: Color.fontColor, textAlign: 'center', fontWeight: CustomFont.fontWeight400, fontFamily: CustomFont.fontName, }}
                                value={this.state.showSelectedDay}
                                editable={false}
                                placeholder={"DD/MM/YYYY"}
                                placeholderTextColor={Color.datecolor}
                            />
                            <Image source={CalenderIcon} style={{ height: responsiveFontSize(3), width: responsiveFontSize(3), marginLeft: responsiveWidth(5), marginRight: responsiveWidth(3) }} />
                        </TouchableOpacity>
                        <TouchableOpacity style={{ height: responsiveHeight(6), width: responsiveWidth(50), alignItems: 'center', justifyContent: 'center', borderRadius: 4, backgroundColor: Color.primary, marginTop: responsiveHeight(2), marginBottom: responsiveHeight(2) }} onPress={() => {
                            // this.props.navigation.navigate('PregnancyList');
                            if (this.state.showSelectedDay === null || this.state.showSelectedDay === '') {
                                alert("Please Select Last Menstrual Date")
                            } else {
                                this.generateChart()
                                // alert(this.state.showSelectedDay)
                            }
                        }}>
                            <Text style={{ fontFamily: CustomFont.fontName, color: Color.white, fontSize: CustomFont.font14 }}>Generate Chart</Text>
                        </TouchableOpacity>
                    </View>
                </View>

                <Modal isVisible={this.state.isModalVisibleCalendars} >
                    <View style={{ backgroundColor: Color.white, borderRadius: 7, alignItems: 'center' }}>
                        <ScrollView>
                            <View style={{ flex: 1, flexDirection: 'column', justifyContent: 'center', alignItems: 'center', marginTop: 20 }}>
                                <CalendarPicker
                                    width={responsiveWidth(90)}
                                    startFromMonday={true}
                                    todayTextStyle={{ color: '#00bfff' }}
                                    todayBackgroundColor="#FFF"
                                    selectedDayColor={Color.primary}
                                    selectedDayTextColor="#FFFFFF"
                                    todayTextColor="red"
                                    selectYearTitle={true}
                                    style={{ width: responsiveWidth(99) }}
                                    onDateChange={date => {
                                        // selectedDay = Moment(date).format('YYYY-MM-DD')
                                        // this.setState({ dateForfullCalendar: selectedDay})
                                        selectedDay = Moment(date.toString()).format('YYYY/MM/DD');
                                        selectedDayReformat = Moment(selectedDay).format('DD/MM/YYYY');
                                        // this.setState({ showDueDay: 'DD/MM/YYYY' })
                                    }}
                                    // maxDate={new Date()}
                                    minDate={new Date()}
									nextTitleStyle={{color:Color.fontColor}}
									previousTitleStyle={{color:Color.fontColor}}
									yearTitleStyle={{color:Color.fontColor}}
									monthTitleStyle={{color:Color.fontColor}}
                                />
                                <View style={{ flexDirection: 'row', marginTop: responsiveHeight(5), marginBottom: responsiveHeight(3), justifyContent: 'flex-end', width: '100%' }}>
                                    <TouchableOpacity style={{ alignItems: 'center', justifyContent: 'center', borderRadius: 4, borderColor: Color.grayBorder, borderWidth: 1, height: responsiveHeight(6), width: responsiveWidth(25) }} onPress={() => this.setState({ isModalVisibleCalendars: false })}>
                                        <Text style={{ fontFamily: CustomFont.fontName, color: Color.fontColor, fontSize: CustomFont.font16, textAlign: 'center' }}>Cancel</Text>
                                    </TouchableOpacity>

                                    <TouchableOpacity style={{ alignItems: 'center', justifyContent: 'center', borderRadius: 4, height: responsiveHeight(6), width: responsiveWidth(25), backgroundColor: Color.primaryBlue, marginLeft: responsiveWidth(6), marginRight: 10 }} onPress={() => {
                                        this.clickOnDone();
                                    }}>
                                        <Text style={{ fontFamily: CustomFont.fontName, color: Color.white, fontSize: CustomFont.font16, textAlign: 'center' }}>Done </Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </ScrollView>
                    </View>
                </Modal>
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
)(pregnancyCalender);
