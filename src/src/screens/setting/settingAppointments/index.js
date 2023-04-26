import cloneDeep from 'lodash/cloneDeep';
import React from 'react';
import {
    FlatList, Image, SafeAreaView,
    StatusBar, Text,
    TouchableOpacity, View
} from 'react-native';
import { responsiveHeight, responsiveWidth } from 'react-native-responsive-dimensions';
import { Switch } from 'react-native-switch';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import arrow_right from '../../../../assets/arrow_right.png';
import arrowBack from '../../../../assets/back_blue.png';
import Color from '../../../components/Colors';
import CommonStyle from '../../../components/CommonStyle.js';
import CustomFont from '../../../components/CustomFont';
import * as apiActions from '../../../redux/actions/apiActions';
import * as signupActions from '../../../redux/actions/signupActions';
import styles from './style';
import { setLogEvent } from '../../../service/Analytics';

let swichIndex = -1;
let swichValue = false;

class SettingAppointments extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            appointmentData: []
        };
    }
    async componentDidMount() {
        let from=this.props.navigation.getParam("from");
        // if(from=='whatsapp'){
        //     this.setState({
        //         appointmentData: [{applicationSettingGuid	:	'ade3728d-c80d-11eb-b68b-0022486b91c8',
		// 		applicationSettingName	:	'Receive Updates',
		// 		abbreviationName	:	'Reminder',
		// 		isActive	:	true,
		// 		cancellationTime	:	null
		// 		}]
        //     })
        // }else{
            let appointmentData = this.props.navigation.getParam("appointmentSettingData");
            this.setState({
                appointmentData: appointmentData
            })
        //}
        
    }
    saveUpdateSettings = (settingGuid) => {
        let { actions, signupDetails } = this.props;
        let params = {
			"RoleCode": signupDetails.roleCode,
			"UserGuid": signupDetails.UserGuid,
			"DoctorGuid": signupDetails.doctorGuid,
			"ClinicGuid": signupDetails.clinicGuid,
            "Data": {
                "ApplicationSettingGuid": settingGuid,
                "ApplicationSettingName": null,
                "AbbreviationName": null,
                "IsActivated": swichValue
            }
        }
        actions.callLogin('V1/FuncForDrAppToSaveUpdateSettings', 'post', params, signupDetails.accessToken, 'UpdateSettings');

    }

    setSwitchValue = (value, index, settingGuid) => {
        swichValue = value
        swichIndex = index
        this.saveUpdateSettings(settingGuid)
    }

    async UNSAFE_componentWillReceiveProps(newProps) {
        if (newProps.responseData && newProps.responseData.tag) {
            let tagname = newProps.responseData.tag;
            if (tagname == "UpdateSettings") {
                const tempappointmentData = cloneDeep(this.state.appointmentData);
                if (tempappointmentData.userSetting == null) {
                    const newTempappointmentData = {
                        ...tempappointmentData[swichIndex],
                        userSetting: {
                            isActivated: swichValue
                        }
                    }
                    tempappointmentData[swichIndex] = newTempappointmentData;
                } else {
                    tempappointmentData[swichIndex].userSetting.isActivated = swichValue;
                }
                this.setState({ appointmentData: tempappointmentData });
            }
        }
    }

    goToBack = () => {
        this.props.navigation.goBack()
        this.props.navigation.state.params.onAppointmentsDataHandle(this.state.appointmentData);
    }

    render() {

        const timeView = () => {
            return (
                <View style={styles.timeContainer} >
                    <View style={styles.lableContainer}>
                        <Text style={styles.lable}>Cancellation time</Text>
                        <Text style={styles.subLable}>Before scheduled appointment</Text>
                    </View>
                    <TouchableOpacity style={styles.arrowContainer}>
                        <Text style={styles.lable}>10 mins</Text>
                        <Image source={arrow_right} style={styles.arrowView} />
                    </TouchableOpacity>

                </View>
            )
        }

        const renderList = ({ item, index }) => {
            return (
                <View style={{ padding: 0 }}>
                    <View style={styles.viewMainContainer} >
                        <View style={styles.lableContainer}>
                            <Text style={styles.lable}>{item.applicationSettingName}</Text>
                            {item.applicationSettingName == 'Send reminder to patient' ?
                                <Text style={{ marginTop: responsiveWidth(2), marginBottom: responsiveWidth(2), color: Color.text2, fontFamily: CustomFont.fontName, fontSize: CustomFont.font10, opacity: 0.6 }}>60 mins before the appointment</Text>
                                : item.abbreviationName =='Whatsapp' ? null:
                                <Text style={{ marginTop: responsiveWidth(2), marginBottom: responsiveWidth(2), color: Color.text2, fontFamily: CustomFont.fontName, fontSize: CustomFont.font10, opacity: 0.6 }}>If off, patients will have to call or walk-in</Text>
                            }
                        </View>
                        {/* <ToggleSwitch
                            isOn={item.userSetting == null ? true : item.userSetting.isActivated}
                            onColor={Color.weekdaycellPink}
                            offColor={Color.white}
                            size="medium"
                            onToggle={(isOn) => this.setSwitchValue(isOn, index, item.applicationSettingGuid)}
                        /> */}

                        <Switch
                            value={item.userSetting == null ? true : item.userSetting.isActivated}
                            onValueChange={(val) => {
                                setLogEvent("setting", { "on_off": "track" })
                                this.setSwitchValue(val, index, item.applicationSettingGuid)
                            }}
                            innerCircleStyle={{ height: 28, width: 28, alignItems: "center", justifyContent: "center", borderWidth: 0 }}
                            activeText={'On'}
                            activeTextStyle={{ color: Color.liveBg, fontSize: CustomFont.font14, fontWeight: CustomFont.fontWeight600, fontFamily: CustomFont.fontName }}
                            inactiveTextStyle={{ color: Color.switchInActiveColoer, fontSize: CustomFont.font14, fontWeight: CustomFont.fontWeight600, fontFamily: CustomFont.fontName }}
                            circleSize={38}
                            switchLeftPx={4}
                            barHeight={35}
                            switchRightPx={4}
                            inActiveText={'Off'}
                            backgroundActive={Color.billBack}
                            backgroundInactive={Color.patientBackground}
                            circleActiveColor={Color.liveBg}
                            circleInActiveColor={Color.switchInActiveColoer} />
                    </View>
                    {index != this.state.appointmentData.length - 1 ?
                        <Text style={{ borderBottomWidth: 1, borderColor: '#e8e1FF', marginTop: responsiveHeight(-2) }} /> : null
                    }
                </View>
            )
        };

        return (
            <SafeAreaView style={CommonStyle.container}>
                <StatusBar backgroundColor={Color.statusBarNewColor} barStyle="dark-content" />
                <View style={styles.container}>
                    <View style={{ backgroundColor: Color.white, flexDirection: 'row', height: responsiveHeight(7), alignItems: 'center' }}>
                        <TouchableOpacity onPress={() => this.goToBack()} >
                            <Image source={arrowBack} style={{ marginLeft: responsiveWidth(3), height: responsiveWidth(4.5), width: responsiveWidth(5.5), paddingTop: responsiveWidth(2) }} />
                        </TouchableOpacity>
                        <Text style={styles.title}>{this.props.navigation.getParam("from")=='whatsapp' ? 'Receive Updates on WhatsApp':'Appointments'} </Text>
                    </View>
                    {/* <View style={styles.headerContainer}>
                        <Text style={styles.headingView}>Appointment Preferences</Text>
                    </View> */}
                    <View style={{ backgroundColor: Color.newBgColor, flex: 1 }}>
                        <View style={{ backgroundColor: Color.white, padding: responsiveWidth(1), borderRadius: 10, margin: responsiveWidth(3) }}>

                            <FlatList
                                data={this.state.appointmentData}
                                renderItem={renderList}
                                extraData={this.state}
                                keyExtractor={(item, index) => index.toString()}
                            />
                        </View>
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
)(SettingAppointments);
