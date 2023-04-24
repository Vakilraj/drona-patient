import CheckBox from '@react-native-community/checkbox';
import React from 'react';
import {
    Dimensions, FlatList, Image, SafeAreaView,
    ScrollView, StatusBar, Text, TextInput, TouchableOpacity, View, BackHandler
} from 'react-native';
import Modal from 'react-native-modal';
import { responsiveFontSize, responsiveHeight, responsiveWidth } from 'react-native-responsive-dimensions';
import Snackbar from 'react-native-snackbar';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import assistantWarning from '../../../assets/assistant_warning.png';
import CrossIcon from '../../../assets/cross_primary.png';
import Color from '../../components/Colors';
import CommonStyle from '../../components/CommonStyle.js';
import CustomFont from '../../components/CustomFont';
import { default as EmailValidator, default as Validator } from '../../components/Validator';
import * as apiActions from '../../redux/actions/apiActions';
import * as signupActions from '../../redux/actions/signupActions';
import styles from './style';
import { setLogEvent } from '../../service/Analytics';
import ThreeDotsModal from '../consultation/ThreeDotsModal';

class AddAssistant extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            firstName: '',
            lastName: '',
            mobileNumber: '',
            emailId: '',
            fld1: Color.newBorder,
            fld2: Color.newBorder,
            fld3: Color.newBorder,
            fld4: Color.newBorder,
            actionArr: [],
            allowAccessArr: [],
            isEdit: false,
            deleteModal: false,
            isMale: false,
            isFemale: false,
            isOther: false,
            assistanceUserGuid: '',
            assistanceGuid: '',
            genderList: [],
            genderGuid: '',
            emailAlert: '',
            FnameValidationError: false,
            LnameValidationError: false,
        };
    }

    componentDidMount() {

        var isEdit = this.props.navigation.state.params.isEdit
        var assistanceGuid = this.props.navigation.state.params.assistanceGuid
        var assistanceUserGuid = this.props.navigation.state.params.assistanceUserGuid
        //alert(assistanceUserGuid)
        this.setState({
            isEdit: isEdit,
            assistanceGuid: assistanceGuid,
            assistanceUserGuid: assistanceUserGuid,

        })

        let { actions, signupDetails } = this.props;
        let params = {
            "DoctorGuid": signupDetails.doctorGuid,
            "ClinicGuid": DRONA.getClinicGuid(),
            "UserGuid": signupDetails.UserGuid,
            "Data": {
                "AssistanceGuid": isEdit ? assistanceGuid : null,
                "AssistanceUserGuid": isEdit ? assistanceUserGuid : null
            }
        }
        actions.callLogin('V1/FuncForDrAppToGetEditAssistanceDetails', 'post', params, signupDetails.accessToken, 'getEditAssistanceDetails');

        this.backHandler = BackHandler.addEventListener('hardwareBackPress',
            () => this.props.navigation.goBack())
    }

    async UNSAFE_componentWillReceiveProps(newProps) {
        if (newProps.responseData && newProps.responseData.tag) {
            let tagname = newProps.responseData.tag;
            if (tagname === 'getEditAssistanceDetails') {
                let assistantData = newProps.responseData.data;
                this.setState({
                    actionArr: assistantData.staticAccess,
                    allowAccessArr: assistantData.allowAccess,
                    genderList: assistantData.genderList
                })
                if (this.state.isEdit) {
                    this.setState({
                        firstName: newProps.responseData.data.assistanceFirstName,
                        lastName: newProps.responseData.data.assistanceLastName,
                        emailId: newProps.responseData.data.email,
                        mobileNumber: newProps.responseData.data.phoneNo,
                        genderGuid: newProps.responseData.data.genderGuid
                    })
                }
            } else if (tagname === 'addUpdateAssistanceDetails') {

                if (newProps.responseData.statusCode == -1) {
                    this.props.navigation.state.params.isUpdate(newProps.responseData.data)
                    this.props.navigation.goBack()
                }
                setTimeout(() => {
                    Snackbar.show({ text: newProps.responseData.statusMessage, duration: Snackbar.LENGTH_SHORT, backgroundColor: Color.primary });
                }, 500)
                if (!this.state.isEdit) setLogEvent("add_assistant")
            } else if (tagname === 'deleteAssistanceDetails') {
                this.setState({
                    deleteModal: false
                })
                if (newProps.responseData.statusCode == 0) {
                    this.props.navigation.state.params.isUpdate(newProps.responseData.data)
                    this.props.navigation.goBack()
                }
                setTimeout(() => {
                    Snackbar.show({ text: newProps.responseData.statusMessage, duration: Snackbar.LENGTH_SHORT, backgroundColor: Color.primary });
                }, 500)
            } else if (tagname === 'searchAssistant') {
                if (newProps.responseData.statusCode == 0) {
                    let data = newProps.responseData.data;
                    if (data) {
                        this.setState({
                            firstName: data.assistanceFirstName,
                            lastName: data.assistanceLastName,
                            emailId: data.email,
                            assistanceUserGuid: data.assistanceUserGuid,
                            assistanceGuid: data.assistanceGuid,
                            genderGuid: data.genderGuid,
                        })
                    }else{
                        this.setState({
                            firstName: '',
                            lastName: '',
                            emailId: '',
                            assistanceUserGuid: '',
                            assistanceGuid: '',
                            genderGuid: '',
                        })
                    }
                }else{
                    setTimeout(()=>{
                        Snackbar.show({ text: newProps.responseData.statusMessage, duration: Snackbar.LENGTH_SHORT, backgroundColor: Color.primary });
                    },1000)
                }

            }
        }
    }

    renderAllowAccessItem = (item, index) => {
        return (
            <TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center', marginTop: 20, padding: 2 }} onPress={() => {
                let newValue = this.state.allowAccessArr[index].isAuthorized
                this.state.allowAccessArr[index].isAuthorized = newValue == '0' ? '1' : '0';
                this.setState({ allowAccessArr: this.state.allowAccessArr })
            }}>
                <CheckBox
                    disabled={false}
                    value={item.isAuthorized == '0' ? false : true}
                    onValueChange={(newValue) => {
                        this.state.allowAccessArr[index].isAuthorized = newValue ? '1' : '0';
                        this.setState({ allowAccessArr: this.state.allowAccessArr })
                    }}
                    tintColors={{ true: Color.liveBg, false: Color.unselectedCheckBox }}
                    style={{ height: responsiveFontSize(2.5), width: responsiveFontSize(2.5), color: Color.mediumGrayTxt, marginLeft: 5 }}
                />
                <Text style={{ fontSize: CustomFont.font14, color: Color.optiontext, marginLeft: 15, fontWeight: CustomFont.fontWeight400, fontFamily: CustomFont.fontName }}>{item.accessFunction}</Text>
            </TouchableOpacity>
        )
    }
    onAdd = () => {
        if (!this.state.firstName || !this.state.firstName.trim()) {
            Snackbar.show({ text: 'Please enter first name', duration: Snackbar.LENGTH_SHORT, backgroundColor: Color.primary });
        }
        else if (!this.state.lastName || !this.state.lastName.trim()) {
            Snackbar.show({ text: 'Please enter last name', duration: Snackbar.LENGTH_SHORT, backgroundColor: Color.primary });
        }
        else if (!this.state.genderGuid) {
            Snackbar.show({ text: 'Please select gender', duration: Snackbar.LENGTH_SHORT, backgroundColor: Color.primary });
        }
        else if (!Validator.isNameValidate(this.state.firstName) || !Validator.isNameValidate(this.state.lastName)) {
            Snackbar.show({ text: 'Name should contain only alphabets', duration: Snackbar.LENGTH_SHORT, backgroundColor: Color.primary });
        } else if (!this.state.mobileNumber) {
            Snackbar.show({ text: 'Please enter mobile number', duration: Snackbar.LENGTH_SHORT, backgroundColor: Color.primary });
        }
        else if (this.state.mobileNumber.length != 10) {
            Snackbar.show({ text: 'Mobile number should be 10 digit', duration: Snackbar.LENGTH_SHORT, backgroundColor: Color.primary });
        } else if (!Validator.isMobileValidate(this.state.mobileNumber)) {
            Snackbar.show({ text: 'Mobile number should contain only number', duration: Snackbar.LENGTH_SHORT, backgroundColor: Color.primary });
        }
        // else if (!this.state.emailId) {
        //     Snackbar.show({ text: 'Please enter email id', duration: Snackbar.LENGTH_SHORT, backgroundColor: Color.primary });
        // }
        else if (this.state.emailId && !EmailValidator.isEmailValid(this.state.emailId)) {
            Snackbar.show({ text: 'Please Enter valid email', duration: Snackbar.LENGTH_SHORT, backgroundColor: Color.primary });
        }
        else {
            let { actions, signupDetails } = this.props;
            let params = {
                "ClinicGuid": DRONA.getClinicGuid(),
                "DoctorGuid": signupDetails.doctorGuid,
                "UserGuid": signupDetails.UserGuid,
                "Data": {
                    "AllowAccess": this.state.allowAccessArr,
                    "assistancefirstname": this.state.firstName.trim(),
                    "assistancelastname": this.state.lastName.trim(),
                    "email": this.state.emailId,
                    "PhoneNo": this.state.mobileNumber,
                    "GenderGuid": this.state.genderGuid,
                    "AssistanceUserGuid": this.state.assistanceUserGuid ,
                    "AssistanceGuid": this.state.assistanceGuid ,
                }
            }
            //console.log("finalReq - ",JSON.stringify(params));
            actions.callLogin('V15/FuncForDrAppToAddUpdateAssistanceDetails', 'post', params, signupDetails.accessToken, 'addUpdateAssistanceDetails');
            setLogEvent("add_staff", { "save_update": 'click', "UserGuid": signupDetails.UserGuid̦ })
        }
    }

    deleteAssistant = () => {

        let { actions, signupDetails } = this.props;
        let params = {
            "DoctorGuid": signupDetails.doctorGuid,
            "ClinicGuid": DRONA.getClinicGuid(),
            "UserGuid": signupDetails.UserGuid,
            "Data": {
                "AssistanceGuid": this.state.assistanceGuid,
                "AssistanceUserGuid": this.state.assistanceUserGuid
            }
        }
        actions.callLogin('V1/FuncForDrAppToDeleteAssistanceDetails', 'post', params, signupDetails.accessToken, 'deleteAssistanceDetails');
        setLogEvent("add_staff", { "delete_staff": 'click', "UserGuid": signupDetails.UserGuid̦ })
    }

    clickGender = (gender) => {
        if (gender === 'male') {
            this.setState({ isMale: true, isFemale: false, isOther: false })
        } else if (gender === 'female') {
            this.setState({ isMale: false, isFemale: true, isOther: false })
        } else {
            this.setState({ isMale: false, isFemale: false, isOther: true })
        }
    }

    fNameValidation = (item) => {
        if (Validator.isNameValidateAss(item)) {
            this.setState({ FnameValidationError: false, firstName: item })
            // alert('matched' + item)
        }
        else if (item == '') {
            this.setState({ FnameValidationError: false, firstName: item })
        }
        else {
            this.setState({ FnameValidationError: true, firstName: item })
            // alert('not matched' + item)
        }
    }

    lNameValidation = (item) => {
        if (Validator.isNameValidateAss(item)) {
            this.setState({ LnameValidationError: false, lastName: item })
            // alert('matched' + item)
        }
        else if (item == '') {
            this.setState({ LnameValidationError: false, lastName: item })
        }
        else {
            this.setState({ LnameValidationError: true, lastName: item })
            // alert('not matched' + item)
        }
    }

    renderItem = (item, index) => {
        return (
            <TouchableOpacity style={{ flex: 1, alignItems: 'center', justifyContent: 'center', height: responsiveHeight(6), borderColor: this.state.genderGuid === item.genderGuid ? Color.liveBg : Color.createInputBorder, borderWidth: 1.5, borderRadius: 4, backgroundColor: this.state.genderGuid === item.genderGuid ? Color.genderSelection : Color.white, marginEnd: 5, }}
                onPress={() =>
                    this.setState({
                        genderGuid: item.genderGuid
                    })
                }>
                <Text style={{ color: this.state.isMale ? Color.optiontext : Color.optiontext, fontSize: CustomFont.font14, fontWeight: CustomFont.fontWeight500 }}>{item.genderName}</Text>
            </TouchableOpacity>
        )
    }
    renderSeparatorTag = () => {
        return <View style={{ marginLeft: 1 }} />;
    };
    searchAssistantWithMobile = (mobileNumber) => {
        if (mobileNumber) {
            if (Validator.isMobileValidate(mobileNumber)) {
                this.setState({ mobileNumber: mobileNumber });
                if (mobileNumber.length == 10) {
                    let { actions, signupDetails } = this.props;
                    let params = {
                        "DoctorGuid": signupDetails.doctorGuid,
                        "ClinicGuid": DRONA.getClinicGuid(),
                        "UserGuid": signupDetails.UserGuid,
                        "Data": {
                            "PhoneNo": mobileNumber
                        }
                    }
                    actions.callLogin('V15/FuncForDrAppToSearchAssistanceDetails', 'post', params, signupDetails.accessToken, 'searchAssistant');
                }
            }
        } else
            this.setState({ mobileNumber });
    }


    render() {
        return (
            <SafeAreaView style={CommonStyle.container}>
                <StatusBar backgroundColor='#2D1D4BCC' barStyle="dark-content" />

                <View style={{ flex: 1, backgroundColor: Color.white }}>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', margin: 20 }}>
                        <Text style={{ fontFamily: CustomFont.fontName, fontSize: CustomFont.font18, color: Color.black, fontWeight: '700', }}>{this.state.isEdit ? "Edit Assistant" : "Add assistant"}</Text>
                        <TouchableOpacity onPress={() => {
                            this.props.navigation.goBack()
                        }}>
                            <Image source={CrossIcon} style={{ height: responsiveFontSize(2), width: responsiveFontSize(2), resizeMode: 'contain' }} />
                        </TouchableOpacity>

                    </View>
                    <ScrollView>
                        <View style={{ flex: 1, margin: 20, marginTop: 0 }}>
                            <Text style={styles.tiTitle}>Mobile Number</Text>
                            <View>
                                <TextInput returnKeyType="done" style={[styles.modelTextInput1, { borderColor: this.state.fld3 }]}
                                    placeholder="Enter Mobile Number"
                                    keyboardType={'number-pad'}
                                    maxLength={10}
                                    value={this.state.mobileNumber}
                                    onChangeText={mobileNumber => this.searchAssistantWithMobile(mobileNumber)}
                                    placeholderTextColor={Color.placeHolderColor}
                                    onBlur={() => this.setState({ fld3: Color.newBorder })} onFocus={() => this.setState({ keyboardAvoiding: responsiveHeight(-50), fld3: Color.primary })} editable={!this.state.isEdit} />
                            </View>

                            <Text style={{ ...styles.tiTitle, marginTop: 10 }}>First Name </Text>
                            <View>
                                <TextInput returnKeyType="done" style={[styles.modelTextInput1, { borderColor: this.state.fld1, }]}
                                    placeholder="Enter First Name"
                                    value={this.state.firstName}
                                    onChangeText={(text) => {
                                        return this.fNameValidation(text)
                                    }}
                                    // onChangeText={text => {
                                    //     this.setState({ firstName: text });
                                    // }}
                                    placeholderTextColor={Color.placeHolderColor}
                                    onBlur={() => this.setState({ fld1: Color.newBorder })} onFocus={() => this.setState({ keyboardAvoiding: responsiveHeight(-50), fld1: Color.primary })} />
                                {this.state.FnameValidationError ? <Text style={{ color: 'red', marginTop: 10 }}>Please enter letter only</Text> : null}
                            </View>


                            <Text style={styles.tiTitle}>Last Name </Text>
                            <View>
                                <TextInput returnKeyType="done" style={[styles.modelTextInput1, { borderColor: this.state.fld2, }]}
                                    placeholder="Enter Last Name"
                                    value={this.state.lastName}
                                    onChangeText={(text) => {
                                        return this.lNameValidation(text)
                                    }}
                                    // onChangeText={text => {
                                    //     this.setState({ lastName: text });
                                    // }}
                                    placeholderTextColor={Color.placeHolderColor}
                                    onBlur={() => this.setState({ fld2: Color.newBorder })} onFocus={() => this.setState({ keyboardAvoiding: responsiveHeight(-50), fld2: Color.primary })} />
                                {this.state.LnameValidationError ? <Text style={{ color: 'red', marginTop: 10 }}>Please enter letter only</Text> : null}
                            </View>

                            {this.state.genderList && this.state.genderList.length > 0 ?
                                <View>
                                    <Text style={styles.tiTitle}>Gender</Text>
                                    <View style={{ marginTop: responsiveWidth(1.5) }}>
                                        <FlatList
                                            data={this.state.genderList}
                                            numColumns={3}
                                            renderItem={({ item, index }) => this.renderItem(item, index)}
                                            ItemSeparatorComponent={this.renderSeparatorTag} />
                                    </View>
                                </View> : null}


                            <Text style={styles.tiTitle}>Email ID</Text>
                            <View>
                                <TextInput returnKeyType="done" style={[styles.modelTextInput1, { borderColor: this.state.fld4 }]}
                                    placeholder="Enter Email ID"
                                    keyboardType={'email-address'}
                                    value={this.state.emailId}
                                    // onChangeText={text => {
                                    //     this.setState({ emailId: text.trim() });
                                    // }}
                                    onChangeText={emailId => {

                                        if (emailId) {
                                            if (Validator.isEmailValid(emailId.trim())) {
                                                this.setState({ emailAlert: '' });
                                            }
                                            else {
                                                this.setState({ emailAlert: 'Please enter valid email id' });
                                            }
                                            this.setState({ emailId: emailId.trim() })
                                        } else {
                                            this.setState({ emailId })
                                            this.setState({ emailAlert: 'Please enter email id' });
                                        }
                                    }
                                    }
                                    placeholderTextColor={Color.placeHolderColor}
                                    onBlur={() => this.setState({ fld4: Color.newBorder })} onFocus={() => this.setState({ keyboardAvoiding: responsiveHeight(-50), fld4: Color.primary })} />
                                {this.state.emailAlert ? <Text style={{ marginLeft: 5, fontSize: CustomFont.font12, color: Color.red }}>{this.state.emailAlert}</Text> : null}
                            </View>
                            {this.state.actionArr.length > 0 ?
                                <View style={{ borderRadius: 10, backgroundColor: Color.profileBg, marginTop: responsiveHeight(3), paddingBottom: responsiveHeight(2) }}>

                                    <View style={{ flexDirection: 'row', margin: responsiveWidth(3), marginBottom: responsiveWidth(1), alignItems: 'center' }}>

                                        <Image source={assistantWarning} style={{ height: responsiveFontSize(2), width: responsiveFontSize(2), resizeMode: 'contain' }} />

                                        <Text style={{ fontFamily: CustomFont.fontName, fontSize: CustomFont.font14, color: Color.optiontext, fontWeight: '400', marginLeft: 10 }}>Your assistants can always perform{'\n'}the following actions:</Text>

                                    </View>

                                    {this.state.actionArr.map((value, index) => {
                                        return <View style={{ flexDirection: 'row', alignItems: 'center', marginLeft: responsiveWidth(6), marginTop: responsiveWidth(2) }}>
                                            <View style={{
                                                borderRadius: Math.round(Dimensions.get('window').width + Dimensions.get('window').height) / 2,
                                                width: 5,
                                                height: 5,
                                                backgroundColor: Color.optiontext,
                                                justifyContent: 'center',
                                                alignItems: 'center'
                                            }}></View>
                                            <Text style={styles.actionTitle}>{value.accessFunction}</Text>
                                        </View>
                                    })}
                                </View> : null}
                            {this.state.allowAccessArr.length > 0 ?
                                <View style={{ marginBottom: responsiveHeight(5) }}>
                                    <Text style={{ fontFamily: CustomFont.fontName, fontSize: CustomFont.font14, color: Color.black, fontWeight: CustomFont.fontWeight700, marginTop: responsiveWidth(4), marginLeft: responsiveWidth(1) }}>Allow Access To</Text>
                                    <FlatList
                                        data={this.state.allowAccessArr}
                                        renderItem={({ item, index }) => this.renderAllowAccessItem(item, index)}
                                        keyExtractor={(item, index) => index.toString()}
                                    />
                                </View> : null}

                            <View style={{ flexDirection: 'row', backgroundColor: Color.white, borderTopLeftRadius: 10, borderTopRightRadius: 10, marginTop: 10, paddingLeft: 5, paddingRight: 5 }}>
                                <TouchableOpacity
                                    onPress={() => {
                                        let { signupDetails } = this.props;
                                        setLogEvent("add_staff", { "cancel": 'click', "UserGuid": signupDetails.UserGuid̦ })
                                        this.state.isEdit ? this.setState({ deleteModal: true }) : this.props.navigation.goBack()
                                    }}
                                    style={{ margin: 5, marginLeft: 0, borderRadius: 5, justifyContent: 'center', alignItems: 'center', backgroundColor: this.state.isEdit ? '#FBEDED' : Color.lightPurple, flex: 1, height: responsiveHeight(5) }}>
                                    <Text style={{ color: this.state.isEdit ? Color.darkOrange : Color.primary, fontSize: CustomFont.font14, fontFamily: CustomFont.fontName, fontWeight: CustomFont.fontWeight700 }}>{this.state.isEdit ? 'Delete' : 'Cancel'}</Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    onPress={() => {
                                        if (this.state.LnameValidationError || this.state.FnameValidationError) {
                                            console.log('ddd');
                                        }
                                        else {
                                            this.onAdd()
                                        }
                                    }}
                                    style={{ margin: 5, marginRight: 0, borderRadius: 5, justifyContent: 'center', alignItems: 'center', backgroundColor: this.state.LnameValidationError || this.state.FnameValidationError ? Color.grayTxt : Color.primary, flex: 1, height: responsiveHeight(5) }}>
                                    <Text style={{ color: Color.white, fontSize: CustomFont.font14, fontFamily: CustomFont.fontName, fontWeight: CustomFont.fontWeight700 }}>{this.state.isEdit ? 'Save' : 'Add'}</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </ScrollView>
                </View>
                <Modal isVisible={this.state.deleteModal} onRequestClose={() => this.setState({ deleteModal: false })}>
                    <View style={{ flexDirection: 'column', marginLeft: responsiveWidth(4), marginRight: responsiveWidth(4), backgroundColor: 'white', padding: 25, borderRadius: 7 }}>
                        <View style={{ flexDirection: 'row' }}>
                            <View style={{ flex: 8, alignItems: 'flex-start', }}>
                                <Text style={{ fontFamily: CustomFont.fontName, color: Color.black, fontSize: CustomFont.font18, fontWeight: CustomFont.fontWeight700, textAlign: 'center' }}>Delete Assistant?</Text>
                            </View>
                            <View style={{ flex: 2, alignItems: 'flex-end' }}>
                                <TouchableOpacity onPress={() => {
                                    this.setState({ deleteModal: false })
                                }}>
                                    <Image source={CrossIcon} style={{ height: responsiveHeight(4), width: responsiveWidth(4), resizeMode: 'contain' }} />
                                </TouchableOpacity>
                            </View>
                        </View>
                        <View>
                            <Text style={{ fontFamily: CustomFont.fontName, color: Color.text1, fontSize: CustomFont.font14, lineHeight: 23 }}>Are you sure you want to delete{'\n'}Assistant {this.state.firstName + " " + this.state.lastName}?</Text>
                        </View>

                        <View style={{ marginTop: responsiveHeight(6), marginBottom: 20 }}>
                            <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
                                <View style={{ flex: 3, }}>
                                    <TouchableOpacity style={{ alignItems: 'center', justifyContent: 'center', borderRadius: 4, borderColor: Color.grayBorder, borderWidth: 1, height: responsiveHeight(5.4), width: responsiveWidth(30), backgroundColor: Color.buttonSecondary }} onPress={() => {
                                        this.setState({ deleteModal: false });
                                    }}>
                                        <Text style={{ fontFamily: CustomFont.fontName, color: Color.primary, fontSize: CustomFont.font16, textAlign: 'center' }}>Cancel</Text>
                                    </TouchableOpacity>
                                </View>
                                <View style={{ flex: 3, }}>
                                    <TouchableOpacity style={{ alignItems: 'center', justifyContent: 'center', borderRadius: 4, borderColor: Color.grayBorder, borderWidth: 1, height: responsiveHeight(5.4), width: responsiveWidth(35), backgroundColor: Color.primary }} onPress={() => {
                                        this.deleteAssistant()
                                    }}>
                                        <Text style={{ fontFamily: CustomFont.fontName, color: Color.white, fontSize: CustomFont.font16, textAlign: 'center' }}>Yes, Delete</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </View>
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
)(AddAssistant);
