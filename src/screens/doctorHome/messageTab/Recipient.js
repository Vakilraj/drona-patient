import React, { useState, useEffect, useRef } from 'react';
import {
    SafeAreaView,
    View,
    Text,
    StatusBar,
    Image, FlatList,
    TouchableOpacity, BackHandler, ScrollView,
} from 'react-native';
import styles from './style';
import Color from '../../../components/Colors';
import CommonStyle from '../../../components/CommonStyle.js';
import CustomFont from '../../../components/CustomFont';
import { responsiveHeight, responsiveWidth } from 'react-native-responsive-dimensions';
import Toolbar from '../../../customviews/Toolbar.js';
import TickIcon from '../../../../assets/green_tick.png';
import DropDownPicker from 'react-native-dropdown-picker';
import { setApiHandle } from "../../../service/ApiHandle"
import Modal from 'react-native-modal';

import * as signupActions from '../../../redux/actions/signupActions';
import * as apiActions from '../../../redux/actions/apiActions';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { setLogEvent } from '../../../service/Analytics';

let consultantwithinGuid = null
let genderId = null
let ageGroupId = null
let tagsGuidId = null
let data = {}
let genderPreviousFlag = 999
const Recipient = (props) => {
    const [consultList, setConsultList] = useState([])
    const [genderList, setGenderList] = useState([])
    const [ageGroupList, setAgeGroupList] = useState([])
    const [tempData, setTempData] = useState([])
    const [tagData, setTagData] = useState([])
    const [selectedData, setSelectedData] = useState([])
    const [count, setCount] = useState(0)
    const [searchTxt, setSearchTxt] = useState('')
    const [isSent, setIsSent] = useState(false)
    const [isSuccessMessageSent, setIsSuccessMessageSent] = useState(false)
    const [isMale, setisMale] = useState('')
    const [isFemale, setisFemale] = useState('')
    const [isOther, setisOther] = useState('')
    const [genderData, setgenderData] = useState([])
    const [isActive, setisActive] = useState(false)

    let { actions, signupDetails } = props

    useEffect(() => {
        const backHandler = BackHandler.addEventListener('hardwareBackPress', handleBackPress)
        consultantwithinGuid = null;
        genderId = null;
        ageGroupId = null;
        tagsGuidId = null;
        data = {};
        // for unmount
        return function cleanUp() {
            backHandler.remove();
        }
    }, []);

    const handleBackPress = () => {
        props.navigation.goBack();
        return true;
    }

    useEffect(() => {
        getRecipientList()
    }, []);

    const getRecipientList = () => {
        let params = {
			"UserGuid": signupDetails.UserGuid,
            "DoctorGuid": signupDetails.doctorGuid,
            "ClinicGuid": signupDetails.clinicGuid,
            "Data": {
                "ListOfFilter": [
                    { "Key": "ConsultantwithinGuid", "Value":  consultantwithinGuid ? [consultantwithinGuid] : consultantwithinGuid },
                    { "Key": "GenderGuid", "Value": genderId ?  [genderId] : genderId},
                    { "Key": "AgeGroupGuid", "Value": ageGroupId ? [ageGroupId] : ageGroupId},
                    { "Key": "tagsGuid", "Value": tagsGuidId }
                ]
            }
        };
        actions.callLogin('V1/FuncForDrAppToGetRecipientList', 'post', params, signupDetails.accessToken, 'RecipientList');
    }

    const sendMessage = () => {
        let params = {
			"RoleCode": signupDetails.roleCode,
            "DoctorGuid": signupDetails.doctorGuid,
            "UserGuid":signupDetails.UserGuid,
            "ClinicGuid": signupDetails.clinicGuid,
            "Data": {
                "MessageType": signupDetails.messageType,
                "ContentTypeList": [{
                    "ContentTypeGuid": props.navigation.getParam('selectedContentTypeGuid'),
                    "ContentTypeTitle": props.navigation.getParam('selectedContentType'),
                    "Content": props.navigation.getParam('content')
                }],
                "patientInfoList": data.patientInfoList,
            }
        };
        actions.callLogin('V1/FuncForDrAppToSendMessageToAllRecipient', 'post', params, signupDetails.accessToken, 'sendMessage');
        setLogEvent("new_message_preview", { "sent_message": "click", "UserGuid": signupDetails.UserGuid, })
        DRONA.setIsReloadApi(true);
    }

    useEffect(() => {
        setApiHandle(handleApi, props)
    }, [props.responseData]);

    const handleApi = (response, tag) => {
        if (tag === 'RecipientList') {
            data = response
            let tempArr = [{ label: "All", consultantWithinGuid: null }];
            for (const element of response.consultList) {
                let tempObj = {};
                tempObj.label = element.consultantWithin;
                tempObj.consultantWithinGuid = element.consultWithInGuid;
                tempArr.push(tempObj)
            }
            setConsultList(tempArr)

            tempArr = [{ label: "All", genderId: null }];
            for (const element of response.genderList) {
                let tempObj = {};
                tempObj.label = element.genderName;
                tempObj.genderId = element.genderGuid;
                tempArr.push(tempObj)
            }
            setGenderList(tempArr)
            let temArrGender = [];
            for (let i = 0; i < response.genderList.length; i++) {
                if (genderPreviousFlag == i) {
                    let tempObj = Object.assign({ isActive: true }, response.genderList[i]);
                    temArrGender.push(tempObj);
                } else {
                    let tempObj = Object.assign({ isActive: false }, response.genderList[i]);
                    temArrGender.push(tempObj);
                }
            }
            setgenderData(temArrGender);

            tempArr = [{ label: "All", ageGroupId: null }];
            for (const element of response.ageGroupList) {
                let tempObj = {};
                tempObj.label = element.ageGroupName;
                tempObj.ageGroupId = element.ageGroupGuid;
                tempArr.push(tempObj)
            }
            setAgeGroupList(tempArr)

            setTempData(response.tagsList)
            if (response.patientInfoList && response.patientInfoList.length)
                setCount(response.patientInfoList.length)
            else setCount(0)
        } else if (tag === 'sendMessage') {
            success()
        }
    }

    const validation = () => {
        if (data && data.patientInfoList && data.patientInfoList.length) sendMessage();
        else alert('No Patient Available')
    }

    const success = () => {
        setIsSuccessMessageSent(true)
        setTimeout(() => {
            props.navigation.navigate('Messages');
        }, 3000);
        let eventName = "send_message"
        if (signupDetails.isNewMessage) {
            eventName = "new_message"
            signupDetails.isNewMessage = false
        }
            setLogEvent(eventName)
    }

    const tagChangeText = (text) => {
        setSearchTxt(text)
        if (text.trim().length >= 1) {
            setTagData([])
            let tempArr = []
            for (let i = 0; i < tempData.length; i++) {
                let item = tempData[i]
                if (item.tagsName.toUpperCase().includes(text.toUpperCase())) {
                    tempArr.push(item)
                }
            }
            // if (tempArr.length == 0) {
            //     tempArr.push({ "tagsName": text, "tagsGuidId": '' })
            // }
            if (tempArr.length > 0) setTagData(tempArr)
        } else {
            setTagData([])
        }
    }

    const addTag = (item) => {
        // this.setState({selectedData : tempArr})
        if (selectedData.indexOf(item) == -1 && selectedData.length < 1) {
            selectedData.push(item)
            setSelectedData(selectedData)
            setSearchTxt('')
            setTagData([])
            // if (tagsGuidId == null) tagsGuidId = []
            // tagsGuidId.push(item.tagsGuid)
            tagsGuidId = item.tagsGuid
            getRecipientList()
        }
    }

    const removeTag = (item, index) => {
        selectedData.splice(index, 1);
        setSelectedData(selectedData)
        // tagsGuidId.splice(index, 1)
        tagsGuidId = ''
        getRecipientList()
    }

    // const renderItem = (item, index) => {
    //     return (
    //         <TouchableOpacity style={styles.rowView} onPress={() => addTag(item)}>
    //             <View style={styles.circle} />
    //             <Text style={styles.qusTxt}>{item.tagsName}</Text>
    //         </TouchableOpacity>
    //     )
    // }

    {/* <TouchableOpacity style={{width:responsiveWidth(25), flex: 1, alignItems: 'center', justifyContent: 'center', height: responsiveHeight(6), borderColor: isMale ? Color.liveBg : Color.createInputBorder, borderWidth: 1.5, borderRadius: 4, backgroundColor: isMale ? Color.genderSelection : Color.white, marginEnd: 5, }} onPress={() => getRecipientList()}> */ }

    const renderItem = (item, index) => {
        return (
            <View style={{ flex: 1, flexDirection: 'row', flexWrap: 'wrap', alignItems: 'flex-start', marginTop: responsiveWidth(1.5) }}>
                <TouchableOpacity style={{
                    marginRight: responsiveWidth(1.6),
                    borderColor: item.isActive ? '#FF739B' : '#e8e1FF', width: responsiveWidth(26.5), height: responsiveHeight(6.5), borderRadius: 6, justifyContent: 'center', alignItems: 'center', borderWidth: 1
                }}
                    onPress={() => {
                        genderId = item.genderGuid;
                        //genderId = item.genderId;
                        let tmp = [...genderData];
                        if (genderPreviousFlag != 999)
                            tmp[genderPreviousFlag].isActive = false;
                        tmp[index].isActive = true;
                        setgenderData(tmp);
                        genderPreviousFlag = index
                        getRecipientList()
                    }}>
                    <Text style={{ color: Color.textItem, marginLeft: responsiveWidth(3), marginRight: responsiveWidth(3), fontSize: CustomFont.font14, }}>{item.genderName}</Text>
                </TouchableOpacity>
            </View>
        )
    }

    const renderTag = (item, index) => {
        return (
            <View style={styles.tagView}>
                <Text style={{ fontFamily: CustomFont.fontName, fontSize: CustomFont.font18, color: Color.white }}>{item.tagsName}</Text>
                <TouchableOpacity style={{
                    alignItems: 'center', justifyContent: 'center',
                    height: 15, width: 15, borderRadius: 7.5, marginLeft: 8,
                    backgroundColor: Color.white,
                }}
                    onPress={() => removeTag(item, index)}>
                    <Text style={{ fontFamily: CustomFont.fontName, color: Color.weekdaycellPink, fontSize: CustomFont.font10 }}>X</Text>
                    {/* <Image style={{ height: responsiveFontSize(2.5), width: responsiveFontSize(2.5) }} source={CloseIcon}></Image> */}
                </TouchableOpacity>
            </View>
        )
    }

    const renderSeparatorTag = () => {
        return <View style={{ marginLeft: 1 }} />;
    };

    return (
        <SafeAreaView style={CommonStyle.safeArea}>
            <View style={styles.container}>
                <StatusBar backgroundColor={Color.statusBarNewColor} barStyle="dark-content" />
                {/* <Loader ref={refs} /> */}
                <Toolbar
                    title={"Select Recipient"}
                    onBackPress={() => props.navigation.goBack()} />

                <View style={{ backgroundColor: Color.newBgColor }}>

                    <ScrollView >
                        <View style={{ backgroundColor: Color.white, margin: responsiveWidth(4), paddingBottom: responsiveWidth(36), borderRadius: 10 }}>

                            <View style={{ marginStart: 15, marginEnd: 15, }}>

                                <Text style={{ fontSize: CustomFont.font14, color: Color.text2, fontWeight: 'bold', fontFamily: CustomFont.fontName, marginTop: 20, marginBottom: responsiveWidth(2) }}>Recipients Details</Text>

                                <Text style={[styles.consult]}>Patients Consulted within</Text>
                                <DropDownPicker
                                    zIndex={999}
                                    items={consultList}
                                    // defaultValue={this.title}
                                    containerStyle={styles.dropDown}
                                    style={{ borderColor: Color.createInputBorder, marginTop: responsiveWidth(1.5) }}
                                    itemStyle={{
                                        justifyContent: 'flex-start'
                                    }}
                                    globalTextStyle={{color:Color.fontColor}}
                                    dropDownStyle={{ backgroundColor: Color.white, zIndex: 999 }}
                                    onChangeItem={item => { consultantwithinGuid = item.consultantWithinGuid; getRecipientList() }}
                                    placeholder="Select"
                                     placeholderTextColor = {Color.placeHolderColor}
                                    labelStyle={{ fontSize: CustomFont.font14, color: Color.textGrey }}
                                />

                                <Text style={[styles.consult]}>Gender</Text>
                                {/* <DropDownPicker
                                    zIndex={888}
                                    items={genderList}
                                    // defaultValue={this.title}
                                    containerStyle={styles.dropDown}
                                    style={{ borderColor: Color.createInputBorder, marginTop: 4 }}
                                    itemStyle={{
                                        justifyContent: 'flex-start'
                                    }}
                                    dropDownStyle={{ backgroundColor: Color.white, zIndex: 999 }}
                                    onChangeItem={item => { genderId = item.genderId; getRecipientList() }}
                                    placeholder="Select"
                                    labelStyle={{ fontSize: CustomFont.font14, color: Color.textGrey }}
                                /> */}

                                <View style={{ marginTop: responsiveWidth(1.5) }}>
                                    <FlatList

                                        data={genderData}
                                        //horizontal={true}
                                        numColumns={3}
                                        renderItem={({ item, index }) => renderItem(item, index)}
                                        ItemSeparatorComponent={renderSeparatorTag} />
                                </View>

                                <Text style={[styles.consult]}>Age Group</Text>
                                <DropDownPicker
                                    zIndex={777}
                                    items={ageGroupList}
                                    // defaultValue={this.title}
                                    containerStyle={styles.dropDown}
                                    style={{ borderColor: Color.createInputBorder, marginTop: responsiveWidth(1.5) }}
                                    itemStyle={{
                                        justifyContent: 'flex-start'
                                    }}
                                    globalTextStyle={{color:Color.fontColor}}
                                    dropDownStyle={{ backgroundColor: Color.white, zIndex: 999 }}
                                    onChangeItem={item => { ageGroupId = item.ageGroupId; getRecipientList() }}
                                    placeholder="Select Age Group"
                                    placeholderTextColor = {Color.placeHolderColor}
                                    labelStyle={{ fontSize: CustomFont.font14, color: Color.textGrey }}
                                />

                                {/* <Text style={styles.consult}>Tags</Text>

                        <TextInput style={styles.createInputStyle} placeholder="Add Tags"
                            onChangeText={tagChangeText} value={searchTxt} />

                        <View style={{ flexDirection: 'row', flexWrap: 'wrap', alignItems: 'flex-start', }}>
                            {selectedData.map((item, index) => renderTag(item, index), this)}
                        </View>

                        {tagData.length > 0 ?
                            <FlatList
                                style={{ marginTop: 24 }}
                                data={tagData}
                                renderItem={({ item, index }) => renderItem(item, index)}
                                ItemSeparatorComponent={renderSeparatorTag} /> : null
                        } */}

                            </View>
                        </View>
                    </ScrollView>

                    <TouchableOpacity onPress={() => { validation() }} style={{ marginLeft: responsiveWidth(4), width: responsiveWidth(92), alignItems: 'center', justifyContent: 'center', borderRadius: 6, height: responsiveHeight(7), backgroundColor: Color.primary, marginTop: responsiveWidth(0) }} >
                        <Text style={{ fontFamily: CustomFont.fontName, color: Color.white, fontSize: CustomFont.font14, textAlign: 'center' }}>{'Send Message (' + count + ')'} </Text>
                    </TouchableOpacity>


                </View>

                {/*
                <Modal isVisible={isSent} avoidKeyboard={true} onBackButtonPress={() => setIsSent(false)} >
                    <View style={styles.modelViewCamera}>
                        <View>
                            <Image style={styles.image} source={TickIcon} />
                        </View>
                        <Text style={styles.title}>{signupDetails.messageType + " sent to " + count + " patient"}</Text>
                        <Text style={styles.msg}>{"You can check the status on message history"}</Text>
                    </View>
                </Modal> */}

                <Modal isVisible={isSuccessMessageSent}>
                    <View style={[styles.modelViewMessage2]}>
                        <Image source={TickIcon} style={{ height: 65, width: 65, marginTop: 30 }} />
                        <Text style={{ marginTop: 20, textAlign: 'center', color: Color.darkText, fontSize: CustomFont.font22, fontFamily: CustomFont.fontName }}>
                            {count > 1 ? signupDetails.messageType + " sent to " + count +  " patients" :signupDetails.messageType + " sent to " + count +  " patient"}
                        </Text>
                        <TouchableOpacity
                            onPress={() => { setIsSuccessMessageSent(false) }
                            }
                            style={{ borderRadius: 5, justifyContent: 'center', alignItems: 'center', backgroundColor: Color.primary, margin: 20, paddingTop: 8, paddingBottom: 8, paddingStart: 27, paddingEnd: 27 }}>
                            <Text style={{ color: Color.white, fontSize: CustomFont.font16, fontFamily: CustomFont.fontName }}>Ok</Text>
                        </TouchableOpacity>
                    </View>
                </Modal>

            </View>
        </SafeAreaView>
    );
}
// export default AboutUs
const mapStateToProps = state => ({
    signupDetails: state.signupReducerConfig.signupDetails,
    responseData: state.apiResponseDataConfig.responseData,
    loading: state.apiResponseDataConfig.loading,
});
const ActionCreators = Object.assign({}, apiActions, signupActions);
const mapDispatchToProps = dispatch => ({ actions: bindActionCreators(ActionCreators, dispatch), });
export default connect(mapStateToProps, mapDispatchToProps,)(Recipient);
