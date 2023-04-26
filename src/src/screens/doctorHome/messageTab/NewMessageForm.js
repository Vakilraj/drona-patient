import React, { useState } from 'react';
import {
    SafeAreaView,
    ScrollView,
    View,
    Text, Image, TouchableOpacity, BackHandler, TextInput
} from 'react-native';
import CalendarModal from './CalendarModal';
import arrowBack from '../../../../assets/back_blue.png';
import styles from './../style';
import { responsiveFontSize, responsiveHeight, responsiveWidth } from 'react-native-responsive-dimensions';
import Color from '../../../components/Colors';
import CustomFont from '../../../components/CustomFont';
import * as signupActions from '../../../redux/actions/signupActions';
import * as apiActions from '../../../redux/actions/apiActions';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import Moment from 'moment';
import Snackbar from 'react-native-snackbar';
import DropDownPicker from 'react-native-dropdown-picker';

let selectedContentTypeGuid = '', selectedContentType = '', startDate = '', endingDate = '';
let tempContent = '';
class NewMessageForm extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            prefilledContentType: '',
            dataContenSelectedTypeArr: [],
            content: '',
            selectedSignatureType: '',
            dataContenSignatureTypeArr: [],

            calendarType: 'multi'
        };
        selectedContentTypeGuid = ''; selectedContentType = ''; startDate = ''; endingDate = '';
        tempContent = '';
    }

    async componentDidMount() {
        this.backHandler = BackHandler.addEventListener('hardwareBackPress', () => this.props.navigation.goBack())
       
        let { actions, signupDetails } = this.props;
        let params = {
			"UserGuid": signupDetails.UserGuid,
            "DoctorGuid": signupDetails.doctorGuid,
            "ClinicGuid": signupDetails.clinicGuid,
            "Data": {
                "ListOfFilter": [{ "Key": "ContentTypeGuid", "Value": null }]
            }
        }
        actions.callLogin('V1/FuncForDrAppToGetContentTypeList', 'post', params, signupDetails.accessToken, 'GetContentSelectList');
    }

    async UNSAFE_componentWillReceiveProps(newProps) {
        if (newProps.responseData && newProps.responseData.tag) {
            let tagname = newProps.responseData.tag;
            let { actions, signupDetails } = this.props;
            if (tagname === 'GetContentSelectList') {
                let data = newProps.responseData.data.contentTypeList;
                let dataSignature = newProps.responseData.data.signatureList;
                if (data && data.length > 0) {
                    let tempArr = [];
                    for (let i = 0; i < data.length; i++) {
                        let tempText = data[i].content.toString();
                        let replacedText = tempText.replace("@ClinicName", '\n' + signupDetails.clinicName)
                            .replace("@DoctorName", signupDetails.fname + ' ' + signupDetails.mname)
                            .replace("%Dr. name%", 'Dr. ' + signupDetails.fname + ' ' + signupDetails.mname)
                            .replace("@Signature", '')
                            .replace("Hi %PatientName%,The", 'The')
                            .replace("Hi %PatientName%,Dr.", 'Dr. ');
                        tempArr.push({ label: data[i].contentTypeTitle, value: data[i].contentTypeGuid, title: replacedText })
                    }
                    this.setState({ dataContenSelectedTypeArr: tempArr });

                    setTimeout(() => {
                        let item = this.props.navigation.state.params.item;

                        if (item) {
                            selectedContentType = item.label;
                            selectedContentTypeGuid = item.value;
                            
                            let replacedText = item.content.replace("@ClinicName", '\n' + signupDetails.clinicName)
                                .replace("@DoctorName", signupDetails.fname + ' ' + signupDetails.mname)
                                .replace("%Dr. name%", 'Dr. ' + signupDetails.fname + ' ' + signupDetails.mname)
                                .replace("@Signature", '')
                                .replace("Hi %PatientName%,The", 'The')
                                .replace("Hi %PatientName%, Dr.", 'Dr. ');
                            this.setState({ prefilledContentType: item.value, content: replacedText, calendarType: item.label === 'Clinic closed One day' ? 'single' : 'multi' });
                            tempContent = replacedText;                           
                        }
                    }, 100);
                }
                if (dataSignature && dataSignature.length > 0) {
                    let tempSignatureArr = [];
                    for (let i = 0; i < dataSignature.length; i++) {
                        tempSignatureArr.push({ label: dataSignature[i].signatureType, value: dataSignature[i].signatureGuid })
                    }
                    this.setState({ dataContenSignatureTypeArr: tempSignatureArr });
                }
            }
        }
    }

    refreshData = (val) => {
        if (val) {
            startDate = val.startDate;
            endingDate = val.endingDate;
            let temp = '';
            if (endingDate) {
                let reformatStDate = Moment(startDate).format('DD MMM YYYY');
                let reformatEndDate = Moment(endingDate).format('DD MMM YYYY');
                temp = tempContent.replace("@DateRange", 'from ' + reformatStDate + ' - ' + reformatEndDate).replace("@Date", 'from ' + reformatStDate + ' - ' + reformatEndDate)

            } else {
                let reformatStDate = Moment(startDate).format('DD MMM YYYY');
                temp = tempContent.replace("@DateRange", 'on ' + reformatStDate).replace("@Date", 'on ' + reformatStDate)
            }
            this.setState({ content: temp })
        }
    }


    render() {
        let { actions, signupDetails } = this.props;
        return (
            <SafeAreaView style={styles.container}>
                <View style={{ flex: 1, backgroundColor: Color.bgColor }}>
                    <View style={{ zIndex: 0, flexDirection: 'row', backgroundColor: Color.white, paddingBottom: responsiveHeight(1), paddingTop: responsiveWidth(1) }}>
                        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                            <TouchableOpacity style={{ padding: 10 }} onPress={() => this.props.navigation.goBack()}>
                                <Image source={arrowBack} style={{ height: responsiveWidth(4.5), width: responsiveWidth(5) }} />
                            </TouchableOpacity>
                        </View>
                        <TouchableOpacity style={{ flex: 7, flexDirection: 'row', alignItems: 'center', }}>
                            <Text style={{ fontFamily: CustomFont.fontName, fontSize: CustomFont.font16, color: Color.black, marginLeft: responsiveWidth(2), paddingTop: responsiveWidth(1),fontWeight:'700'}}>New Message</Text>
                        </TouchableOpacity>
                    </View>
                    <ScrollView>
                    <View style={{ backgroundColor: Color.newBgColor }}>
                        
                            <View style={{ backgroundColor: Color.white, margin: responsiveWidth(4), padding: responsiveWidth(2), borderRadius: 10 }}>

                                <View style={{ zIndex: 0, paddingBottom: responsiveHeight(11.5) }}>
                                    <Text style={{ fontFamily: CustomFont.fontName, fontSize: CustomFont.font14, color: Color.text2, marginLeft: responsiveWidth(3), marginTop: responsiveWidth(2), fontWeight: 'bold', paddingBottom: responsiveHeight(2) }}>Broadcast Message</Text>
                                    <Text style={{ fontFamily: CustomFont.fontName, fontSize: CustomFont.font12, color: Color.textItem, marginLeft: responsiveWidth(3) }}>Content type</Text>
                                </View>

                                {this.state.dataContenSelectedTypeArr && this.state.dataContenSelectedTypeArr.length > 0 ?
                                    <DropDownPicker zIndex={999}
                                        items={this.state.dataContenSelectedTypeArr}
                                        containerStyle={{ height: responsiveHeight(7), marginLeft: responsiveWidth(3), marginRight: responsiveWidth(3), marginTop: responsiveHeight(-9.5) }}
                                        style={{ backgroundColor: Color.white }}
                                        itemStyle={{
                                            justifyContent: 'flex-start'
                                        }}
                                        dropDownStyle={{ backgroundColor: Color.white, zIndex: 4 }}
                                        onChangeItem={item => {
                                            selectedContentTypeGuid = item.value;
                                            selectedContentType = item.label;
                                            this.setState({ content: item.title, calendarType: item.label === 'Clinic closed One day' ? 'single' : 'multi', });
                                            tempContent = item.title;
                                        }}
                                        globalTextStyle={{color:Color.fontColor}}
                                        placeholder="Select"
                                        placeholderTextColor = {Color.placeHolderColor}
                                        defaultValue={this.state.prefilledContentType}
                                    /> : null}

                                <View style={{ margin: responsiveWidth(3), flexDirection: 'column' }}>
                                    <View style={{ flexDirection: 'row', marginTop: 1 }}>
                                        <View style={{ flex: 3 }}>
                                            <Text style={{ fontFamily: CustomFont.fontName, fontSize: CustomFont.font12, color: Color.textItem, }}>Date Range</Text>
                                            <CalendarModal Refresh={this.refreshData} nav={this.state.calendarType}></CalendarModal>
                                        </View>
                                    </View>

                                    <Text style={{ fontFamily: CustomFont.fontName, fontSize: CustomFont.font12, color: Color.textItem, marginTop: responsiveWidth(2), marginBottom: responsiveWidth(2) }}>Signature</Text>
                                    {this.state.dataContenSignatureTypeArr && this.state.dataContenSignatureTypeArr.length > 0 ?
                                        <DropDownPicker zIndex={999}
                                            items={this.state.dataContenSignatureTypeArr}
                                            // defaultValue={this.title}
                                            containerStyle={{ height: responsiveHeight(7), marginLeft: responsiveWidth(0), marginRight: responsiveWidth(0) }}
                                            style={{ backgroundColor: Color.white }}
                                            itemStyle={{
                                                justifyContent: 'flex-start'
                                            }}
                                            globalTextStyle={{color:Color.fontColor}}
                                            dropDownStyle={{ backgroundColor: Color.white, zIndex: 4 }}
                                            onChangeItem={item => this.setState({ selectedSignatureType: item.label })}
                                            placeholder="Select"
                                            placeholderTextColor = {Color.placeHolderColor}
                                            defaultValue={this.state.dataContenSignatureTypeArr[0].value}
                                        />
                                        : null
                                    }


                                    <View style={{ flexDirection: 'row', marginTop: responsiveHeight(1.5), zIndex: 10 }}>
                                        {/* {signupDetails.messageType == 'SMS' ? <Image source={sms} style={{ height: responsiveFontSize(3), width: responsiveFontSize(3) }} /> : signupDetails.messageType == 'Push Notification' ? <Image source={push} style={{ height: responsiveFontSize(3), width: responsiveFontSize(3) }} /> : <Image source={message} style={{ height: responsiveFontSize(3), width: responsiveFontSize(3) }} />} */}
                                        <Text style={{ fontFamily: CustomFont.fontName, fontSize: CustomFont.font12, color: Color.textItem, marginBottom: responsiveHeight(1.6), }}>{signupDetails.messageType} Preview</Text>
                                    </View>

                                    <View>
                                        <View style={{ flex: 1, borderWidth: 1, borderColor: Color.newBorder, backgroundColor: '#FFF', borderRadius: 5 }}>
                                            <Text style={{ color: Color.text2, fontFamily: CustomFont.fontName, fontSize: CustomFont.font14, marginTop: responsiveHeight(1.6), marginLeft: responsiveWidth(4) }}>
                                                Hi %PatientName%,</Text>
                                            <TextInput returnKeyType="done" style={{ padding: responsiveWidth(4), fontSize: CustomFont.font14, textAlignVertical: 'top', color: Color.text2, fontFamily: CustomFont.fontName }}
                                                multiline={true} value={this.state.content} onChangeText={content => {
                                                    this.setState({ content });
                                                }} maxLength={1000} blurOnSubmit/>
                                            <Text style={{ color: Color.text2, fontFamily: CustomFont.fontName, fontSize: CustomFont.font14, marginBottom: responsiveHeight(1.6), marginLeft: responsiveWidth(4) }}>
                                                {this.state.selectedSignatureType == 'Doctor Name' ? 'Dr. ' + signupDetails.fname + (signupDetails.mname && signupDetails.mname.length ? ' ' : "") + signupDetails.mname + ' ' + signupDetails.lname : signupDetails.clinicName}</Text>
                                        </View>
                                    </View>
                                </View>
                            </View>
                    </View>

                <View style={{backgroundColor: Color.white, paddingTop:responsiveWidth(1), paddingBottom:responsiveWidth(3)}}>
                    <View style={{marginTop:responsiveWidth(2),borderRadius: 10, marginLeft: responsiveWidth(4.5),}}>
                        <TouchableOpacity style={{ alignItems: 'center', justifyContent: 'center', borderRadius: 10, borderColor: Color.grayBorder, borderWidth: 1, height: responsiveHeight(7), width: responsiveWidth(92), backgroundColor: '#5715D2', }}
                            onPress={() => {
                                if (startDate || endingDate) {
                                    let doctorClinicName = this.state.selectedSignatureType == 'Doctor Name' ? 'Dr. ' + signupDetails.fname + (signupDetails.mname && signupDetails.mname.length ? ' ' : "") + signupDetails.mname + ' ' + signupDetails.lname : signupDetails.clinicName
                                    this.props.navigation.navigate('Recipient', {
                                        selectedContentType: selectedContentType,
                                        selectedContentTypeGuid: selectedContentTypeGuid,
                                        content: 'Hi %PatientName%' + (signupDetails.messageType == 'Email' ? '<br /><br />' : "\n") + this.state.content + "\n" + doctorClinicName
                                    })
                                } else {
                                    Snackbar.show({ text: 'Please select date ', duration: Snackbar.LENGTH_SHORT, backgroundColor: Color.primary });
                                }

                            }}>
                            <Text style={{ fontFamily: CustomFont.fontName, color: Color.white, fontSize: CustomFont.font14, textAlign: 'center' }}>Continue & Select Recipients</Text>
                        </TouchableOpacity>
                    </View>
                </View>
                </ScrollView>
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
)(NewMessageForm);
