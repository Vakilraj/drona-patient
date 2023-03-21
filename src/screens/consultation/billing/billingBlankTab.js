import React, { useState } from 'react';
import {
    SafeAreaView, View,
    Text,
    StatusBar, TouchableOpacity, Image, BackHandler, SectionList
} from 'react-native';
import Color from '../../../components/Colors';
import CommonStyle from '../../../components/CommonStyle.js';
import Moment from 'moment';
import CustomFont from '../../../components/CustomFont';
import BillingBlank from '../../../../assets/BillingBlank.png';
import { setApiHandle } from "../../../service/ApiHandle"
import Toolbar from '../../../customviews/Toolbar.js';
import { responsiveHeight, responsiveWidth, responsiveFontSize, } from 'react-native-responsive-dimensions';
import * as signupActions from '../../../redux/actions/signupActions';
import * as apiActions from '../../../redux/actions/apiActions';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import _ from 'lodash';
import { NavigationEvents } from 'react-navigation';

let billingDetailsFullArray = [];

class BillingHistory extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            count: 0,
            billingDetailsState: [],
            dayValue: '',
            billingDataStatus: false,
            isBillingDone: false,
            isDataLoaded: false,
        }
        DRONA.setIsDrTimingsUpdated(true);
    }
    componentDidMount() {
         this.getBillingHistoryList();
    }
    async UNSAFE_componentWillReceiveProps(newProps) {
        setApiHandle(this.handleApi, newProps)
    }
    handleApi = (response, tag) => {
        if (tag === 'BillingHistoryList') {
            if (response.billingInfoYearly) {
                billingDetailsFullArray = response.billingInfoYearly;
                this.setState({ billingDetailsState: billingDetailsFullArray });
                let { signupDetails } = this.props;
                try {
                    for (let i = 0; i < response.billingInfoYearly.length; i++) {
                        let billDone = false;
                        for (let j = 0; j < response.billingInfoYearly[i].data.length; j++) {
                            if (response.billingInfoYearly[i].data[j].appointmentGuid == signupDetails.appoinmentGuid && response.billingInfoYearly[i].data[j].billingStatus != "Canceled") {
                                billDone = true
                                this.setState({ isBillingDone: true })
                                break
                            }
                        }
                        if (billDone) break
                    }
                } catch (e) { }
                this.setState({ isDataLoaded: true })
            }else{
                this.setState({ billingDataStatus: true });
            }
            

            // if (response.billingInfoYearly) {
            //     this.setState({ billingDataStatus: false });
            // }
            
            DRONA.setIsDrTimingsUpdated(false);
        }
    }


    getBillingHistoryList = () => {
       // alert("KKKK")
        let item = this.props.item;
        let { actions, signupDetails } = this.props;
        let params = {
            "RoleCode": signupDetails.roleCode,
            "UserGuid": signupDetails.UserGuid,
            "DoctorGuid": signupDetails.doctorGuid,
            "ClinicGuid": signupDetails.clinicGuid,
            "PatientGuid": item ? item.patientGuid : null,
            "Version": "",
            "Data": {
                "AppointmentGuid": signupDetails.appoinmentGuid,
            }
        }
        actions.callLogin('V1/FuncForDrAppToGetBillingInfo', 'post', params, signupDetails.accessToken, 'BillingHistoryList');
    }

    formatDate = (dateValue) => {
        // 2021-05-27 00:00:00.000000
        let dateGet = dateValue;
        let formatedDatefinal = dateGet.substr(8, 2)
        // this.setState({dayValue: formatedDatefinal})
        // alert(formatedDatefinal);
        return Moment(dateValue).format('DD MMM')
    }

    renderItem = (item, index) => {
        let isDue = item.billingStatus == 'Due'
        let isPaid = item.billingStatus == 'Paid'
        let isCancelled = item.billingStatus == 'Cancelled'
        return (
            <TouchableOpacity onPress={() => { this.props.nav.navigation.navigate("NewBill", { item: item}) }} style={{ marginTop: 2, backgroundColor: Color.white, flexDirection: 'row', paddingBottom: 8, paddingTop: 8, borderRadius: responsiveWidth(1.5), marginLeft: responsiveWidth(3), marginRight: responsiveWidth(3) }}>
                <View style={{ flex: 3, padding: responsiveWidth(0.5), marginTop: responsiveHeight(1.7), marginLeft: 10 }}>
                    <Text style={{ color: Color.textDate, fontFamily: CustomFont.fontName, fontSize: CustomFont.font16, }}>{this.formatDate(item.billingDate).split(" ")[0]} {this.formatDate(item.billingDate).split(" ")[1]}</Text>
                </View>
                <View style={{ flex: 4, }}>
                    <Text style={{ marginTop: responsiveHeight(1.2), fontFamily: CustomFont.fontName, fontSize: CustomFont.font14, marginLeft: responsiveWidth(4), color: Color.text1 }}>{item.itemNameCount}</Text>
                    <View style={{ flexDirection: 'row', marginTop: 3 }}>
                        <View style={{}}>
                            <View onPress={() => { this.getBillingHistoryList() }}>
                                <Text style={{ marginTop: responsiveHeight(.2), fontFamily: CustomFont.fontName, fontSize: CustomFont.font12, marginLeft: responsiveWidth(4), color: Color.textGrey, }}>#{item.billingNumber}</Text>
                            </View>
                        </View>
                    </View>
                </View>
                {isCancelled ?
                    <View style={{ flex: 3.5 }}>
                        <View>
                            <Text style={{ marginRight: responsiveWidth(3), marginTop: responsiveHeight(1.2), fontWeight: 'bold', alignItems: 'flex-end', fontFamily: CustomFont.fontName, fontSize: CustomFont.font14, textAlign: 'right', color: Color.text2, }}>₹{item.totalAmount}</Text>
                            <View style={{ borderWidth: 1, marginStart: 14, marginRight: responsiveWidth(2), borderRadius: 6, paddingStart: 10, paddingRight: 5, paddingTop: 2, paddingBottom: 2, borderColor: isDue ? Color.textDue : isCancelled ? Color.textCancelled : Color.textPaid, }}>
                                <Text style={{textAlign:'center', padding:0, textAlign:'center', textTransform: 'uppercase', color: isDue ? Color.textDue : isCancelled ? Color.textCancelled : Color.textPaid, fontSize: CustomFont.font10 }}>{item.billingStatus}</Text>
                            </View>
                        </View>
                    </View>
                    :
                    <View style={{ flex: 4, alignItems: 'flex-end' }}>
                        <Text style={{ marginRight: responsiveWidth(3), marginTop: responsiveHeight(1.2), fontWeight: 'bold', alignItems: 'flex-end', fontFamily: CustomFont.fontName, fontSize: CustomFont.font14, textAlign: 'right', color: Color.text2, }}>₹{item.totalAmount}</Text>
                        <View style={{ width: responsiveWidth(12), marginRight: responsiveWidth(3), borderWidth: 1, borderRadius: 6, paddingStart: 10, paddingTop: responsiveWidth(.5), paddingBottom: responsiveWidth(.5), borderColor: isDue ? Color.textDue : isCancelled ? Color.textCancelled : Color.textPaid, }}>
                            <Text style={{paddingLeft:responsiveWidth(1), textTransform: 'uppercase', color: isDue ? Color.textDue : isCancelled ? Color.textCancelled : Color.textPaid, fontSize: CustomFont.font10 }}>{item.billingStatus}</Text>
                        </View>
                    </View>
                }


            </TouchableOpacity>
        );
    };

    render() {
        return (
            <SafeAreaView style={CommonStyle.containerlightBg}>
                <StatusBar backgroundColor={Color.statusBarNewColor} barStyle="dark-content" />
                <NavigationEvents onDidFocus={() =>{
                    if(DRONA.getIsDrTimingsUpdated())
                    this.getBillingHistoryList();
                } } />
                {/* <Toolbar
                    title={"Bills"}
                    onBackPress={() => this.props.navigation.goBack()} /> */}
                {/* <ScrollView> */}
                <View style={{ flex: 1, backgroundColor: Color.newBgColor }}>
                    {this.state.billingDataStatus ?
                        <View style={{ alignItems: 'center', marginTop: responsiveHeight(20) }}>
                            <Image source={BillingBlank} />
                            <Text style={{ fontFamily: CustomFont.fontName, fontSize: CustomFont.font14, color: Color.text1, opacity: 0.6, marginTop: responsiveHeight(5), fontWeight: '700' }} >There are no bills added.</Text>
                        </View> :
                        <View style={{ marginTop: responsiveHeight(1), marginBottom: this.state.isDataLoaded && !this.state.isBillingDone ? responsiveHeight(9) : 0 }}>
                            <SectionList
                            stickySectionHeadersEnabled={false}
                                sections={this.state.billingDetailsState}
                                //style={{ marginStart: 20, marginEnd: 20, maxHeight: Platform.OS === 'ios' ? responsiveHeight(85) : responsiveHeight(90) }}
                                renderItem={({ item, index }) => this.renderItem(item, index)}
                                renderSectionHeader={({ section }) => <Text style={{ marginLeft: 18, fontSize: CustomFont.font14, fontWeight: 'bold', marginBottom: 8, color:Color.fontColor }}>{section.billingYear}</Text>}
                                keyExtractor={(item, index) => index} />
                        </View>
                    }
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
)(BillingHistory);
