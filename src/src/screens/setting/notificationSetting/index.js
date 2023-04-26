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
import arrowBack from '../../../../assets/back_blue.png';
import Color from '../../../components/Colors';
import CommonStyle from '../../../components/CommonStyle.js';
import CustomFont from '../../../components/CustomFont';
import * as apiActions from '../../../redux/actions/apiActions';
import * as signupActions from '../../../redux/actions/signupActions';
import styles from './style';
let swichIndex = -1;
let swichValue = false;

class NotificationSetting extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            notificationItem: []
        };
    }

    async componentDidMount() {
        let notificationData = this.props.navigation.getParam("notificationSettingData");
        this.setState({
            notificationItem: notificationData
        })
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

    renderList = ({ item, index }) => {

        return (
            <View style={{ padding: 0 }}>
                <View style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    backgroundColor: Color.white,
                    height: responsiveHeight(8),
                    paddingLeft: responsiveHeight(2),
                    paddingRight: responsiveHeight(2),
                    alignItems: 'center'
                }}>
                    <View style={styles.lableContainer}>
                        <Text style={styles.lable}>{item.applicationSettingName}</Text>
                    </View>
                    {/* <ToggleSwitch
                        isOn={item.userSetting == null ? true : item.userSetting.isActivated}
                        onColor={Color.weekdaycellPink}
                        offColor={Color.newBgColor}
                        size="medium"
                        onToggle={(isOn) => this.setSwitchValue(isOn, index, item.applicationSettingGuid)}
                    /> */}

                    <Switch
                        value={item.userSetting == null ? true : item.userSetting.isActivated}
                        onValueChange={(val) => this.setSwitchValue(val, index, item.applicationSettingGuid)}
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
                {index != this.state.notificationItem.length - 1 ?
                    <Text style={{ borderBottomWidth: 1, borderColor: '#e8e1FF', marginTop: responsiveHeight(-2) }} /> : null
                }

            </View>
        )
    };

    async UNSAFE_componentWillReceiveProps(newProps) {
        if (newProps.responseData && newProps.responseData.tag) {
            let tagname = newProps.responseData.tag;
            if (tagname == "UpdateSettings") {
                const tempNotificationItem = cloneDeep(this.state.notificationItem);
                if (tempNotificationItem.userSetting == null) {
                    const newTempNotificationItem = {
                        ...tempNotificationItem[swichIndex],
                        userSetting: {
                            isActivated: swichValue
                        }
                    }
                    tempNotificationItem[swichIndex] = newTempNotificationItem;
                } else {
                    tempNotificationItem[swichIndex].userSetting.isActivated = swichValue;
                }
                this.setState({ notificationItem: tempNotificationItem });
            }
        }
    }

    goToBack = () => {
        this.props.navigation.goBack()
        this.props.navigation.state.params.onNotificationDataHandle(this.state.notificationItem);
    }

    render() {
        return (
            <SafeAreaView style={CommonStyle.container}>
                <StatusBar backgroundColor={Color.statusBarNewColor} barStyle="dark-content" />
                <View style={styles.container}>
                    <View style={{ backgroundColor: Color.white, flexDirection: 'row', height: responsiveHeight(7), alignItems: 'center' }}>
                        <TouchableOpacity onPress={() => this.goToBack()} >
                            <Image source={arrowBack} style={{ marginLeft: responsiveWidth(3), height: responsiveWidth(4.5), width: responsiveWidth(5.5), paddingTop: responsiveWidth(2) }} />
                        </TouchableOpacity>
                        <Text style={styles.title}>Notification</Text>
                    </View>

                    <View style={{ backgroundColor: Color.newBgColor, flex: 1 }}>
                        <View style={{ backgroundColor: Color.white, borderRadius: 10, margin: responsiveWidth(3) }}>

                            {Object.keys(this.state.notificationItem).length > 0 ?
                                <FlatList
                                    data={this.state.notificationItem}
                                    style={{ marginBottom: responsiveHeight(1), marginTop: responsiveHeight(1) }}
                                    renderItem={this.renderList}
                                    extraData={this.state}
                                    keyExtractor={(item, index) => index.toString()}
                                /> : null}

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
)(NotificationSetting);
