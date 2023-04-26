import React, { useState } from 'react';
import {
    SafeAreaView,
    ScrollView,
    View,
    Text, TextInput, TouchableOpacity, FlatList, Image, Alert
} from 'react-native';
import styles from './style';

import * as signupActions from '../../redux/actions/signupActions';
import * as apiActions from '../../redux/actions/apiActions';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import _ from 'lodash';
import arrowBack from '../../../assets/arrowBack.png';
import Color from '../../components/Colors';
import CustomFont from '../../components/CustomFont';
import { responsiveWidth, responsiveHeight } from 'react-native-responsive-dimensions';
import Snackbar from 'react-native-snackbar';
import AsyncStorage from 'react-native-encrypted-storage';
let fullArray = [];
let fullArrayForCity = [];
import CryptoJS from "react-native-crypto-js";
let slectedCity = '', selectedClinic = '', address = '';
class AddNewClinic extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isModalVisible: true,
            cityArr: [],
            clinicViewShowStatus: true,
            listShowStatusCity: false,
            listShowStatusClinic: false,
            clinicArray: [],
            clinicName: '',
            btnText: 'Next',
            fld1 : Color.inputdefaultBorder,
			fld2 : Color.inputdefaultBorder,
			
        };
        slectedCity = ''; selectedClinic = ''; address = '';
    }
    callOnFocus = (type) =>{
		if(type == '1'){
		  this.setState({fld1 : Color.primary})
		}
		else if(type == '2'){
			this.setState({fld2 : Color.primary})
		}
	}
	callOnBlur= (type) =>{
		if(type == '1'){
			this.setState({fld1 : Color.inputdefaultBorder})
		  }
		  else if(type == '2'){
			  this.setState({fld2 : Color.inputdefaultBorder})
		  }	  	  
	}
    componentDidMount() {
        let { actions, signupDetails } = this.props;
        let params = {
            "UserGuid": signupDetails.UserGuid,
            "Version": "",
            "Data": {
                 "stateGuId": null
                //"stateGuId": this.props.navigation.state.params.selectedState
            }
        }
        actions.callLogin('V1/FuncForDrAppToGetCityList', 'post', params, signupDetails.accessToken, 'cityListForClinic');
    }

    async UNSAFE_componentWillReceiveProps(newProps) {
        if (newProps.responseData && newProps.responseData.tag) {
            let tagname = newProps.responseData.tag;
            let { actions, signupDetails } = this.props;
            if (tagname === 'cityListForClinic') {
                let speciaArr = newProps.responseData.data;
                let tempArr = [];
                for (let i = 0; i < speciaArr.length; i++) {
                    tempArr.push({ label: speciaArr[i].cityName, value: speciaArr[i].cityGuId })
                }
                fullArrayForCity = speciaArr;
                this.setState({ cityArr: tempArr });

            } else if (tagname === 'clinicListNewClinic' && newProps.responseData.statusMessage === 'Success') {
                fullArray = newProps.responseData.data;
                fullArray.push({ clinicName: 'AddnewClinic', primaryNumber: 'AddnewClinic' })
                this.setState({ clinicArray: fullArray });
                //console.log(JSON.stringify(fullArray))

            } else if (tagname === 'JoinClinic') {
                if (newProps.responseData.accessToken && newProps.responseData.data) {
                    let { actions, signupDetails } = this.props;
                    let data = newProps.responseData.data;
                    signupDetails.accessToken = newProps.responseData.accessToken;
                    signupDetails.UserGuid = data.userInfo.userGuid;
                    actions.setSignupDetails(signupDetails);
                    try {
                        await AsyncStorage.setItem('userGuid', CryptoJS.AES.encrypt(data.userInfo.userGuid, 'MNKU').toString() );
                        await AsyncStorage.setItem('profile_complete', 'profile_complete');
                        DRONA.setClinicList(data.clinicDetailsList);
                    } catch (error) {

                    }
                    this.props.navigation.navigate('NewClinicRequestSentSuccess', { clinicName: this.state.clinicName, address: address, city: this.state.cityName });
                } else {
                    alert(newProps.responseData.statusMessage)
                }
            }
        }
    }
    SearchFilterFunctionClinic = (text) => {
        var searchResult = _.filter(fullArray, function (item) {
            return item.clinicName.toLowerCase().indexOf(text.toLowerCase()) > -1 || item.clinicName.indexOf('AddnewClinic') > -1;
        });
        this.setState({
            clinicArray: searchResult, clinicName: text, listShowStatusClinic: true
        });
        if (text && text.length > 1) {
            this.setState({ btnText: 'Create New Clinic' });
        } else {
            this.setState({ btnText: 'Next' });
        }
    }

    SearchFilterFunctionForCity = (text) => {
        var searchResult = _.filter(fullArrayForCity, function (item) {
            return item.cityName.toLowerCase().indexOf(text.toLowerCase()) > -1;
        });
        this.setState({
            cityArr: searchResult, cityName: text, listShowStatusCity: true
        });
    }


    clickOnClinic = (item) => {
        selectedClinic = item.clinicGuid;
        this.setState({ clinicName: item.clinicName, listShowStatusClinic: false, btnText: 'Join Clinic' })
        address = item.clinicAddress;
    }

    clickOnCity = (item) => {
        slectedCity = item.cityGuId;
        this.setState({ cityName: item.cityName, listShowStatusCity: false })
        let { actions, signupDetails } = this.props;
        let params = {
			"UserGuid": signupDetails.UserGuid, "data": { "cityGuid": slectedCity } }
        actions.callLogin('V1/FuncForDrAppToGetClinicList', 'post', params, signupDetails.accessToken, 'clinicListNewClinic');
    }

    gottoNext = () => {
        if (this.state.btnText === 'Next') {
            Snackbar.show({ text: 'Please select Clinic Or Click on create a new clinic', duration: Snackbar.LENGTH_SHORT, backgroundColor: Color.primary });
        } else if (this.state.btnText === 'Join Clinic') {
            if (!slectedCity) {
                Snackbar.show({ text: 'Please select City first', duration: Snackbar.LENGTH_SHORT, backgroundColor: Color.primary });
            } else if (!selectedClinic) {
                Snackbar.show({ text: 'Please select clinic', duration: Snackbar.LENGTH_SHORT, backgroundColor: Color.primary });
            } else {
                let { actions, signupDetails } = this.props;
                let params = {
                    "UserGuid": signupDetails.UserGuid,
                    "Version": "",
                    "Data": {
                        "UserGuid": signupDetails.UserGuid,
                        "CityGuid": slectedCity,
                        "ClinicGuid": selectedClinic
                    }
                }
                actions.callLogin('V1/FuncForDrAppToRegisterUserClinic', 'post', params, signupDetails.accessToken, 'JoinClinic');
            }
        } else {
            //create a new clinic
            this.props.navigation.navigate('AddNewClinicDetails', { clinicName: this.state.clinicName,from:'Add' })
        }
        //alert('This section is under development. waiting for Add new clinic complete screen design with address and proper infornation to complete the flow. ')


    }
    render() {
        let { actions, signupDetails } = this.props;
        //alert(this.props.navigation.state.params.selectedState);
        return (
            <SafeAreaView style={{ flex: 1, backgroundColor: Color.white }}>

                <View style={{ flex: 1, margin: responsiveWidth(6), }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', backgroundColor: Color.white, width: '100%' }}>
                        <TouchableOpacity style={{ paddingBottom: 20, flexDirection: 'row', alignItems: 'center' }} onPress={() => this.props.navigation.goBack()}>
                            <Image source={arrowBack} style={{ height: responsiveWidth(4.5), width: responsiveWidth(5) }} />
                        </TouchableOpacity>
                    </View>

                    <View style={{ alignItems: 'center', width: '100%' }}>
                        <Text style={{ fontFamily: CustomFont.fontNameBold, fontSize: CustomFont.font24, color: Color.fontColor, marginTop: responsiveHeight(1.5), fontWeight: 'bold', textAlign: 'center' }}>Add new clinic</Text>
                    </View>



                    <Text style={{ marginTop: responsiveHeight(6),color:Color.fontColor }}>Select City *</Text>
                    
                    <TextInput returnKeyType="done"
                    onFocus = {() => this.callOnFocus('1')}
                    onBlur = {() => this.callOnBlur('1')}
                    placeholderTextColor={Color.placeHolderColor}
                    style={[styles.createInputStylefornewClinic, {borderColor : this.state.fld1 }]} placeholder="Search" value={this.state.cityName} onChangeText={(cityName) => { return this.SearchFilterFunctionForCity(cityName); isModalVisible: true }} />


                    <View style={{ flexDirection: 'column', borderRadius: 7 }}>
                        {this.state.listShowStatusCity ? <View>
                            <FlatList style={{ marginTop: responsiveHeight(1.3), backgroundColor: '#fafafa' }}
                                data={this.state.cityArr}
                                renderItem={({ item, index }) => (
                                    <TouchableOpacity style={{ justifyContent: 'flex-start', }}
                                        onPress={() => this.clickOnCity(item)}>
                                        <Text style={{ fontFamily: CustomFont.fontName, color: Color.black, fontSize: CustomFont.font16, marginTop: responsiveHeight(1.3), marginLeft: 20, marginBottom: responsiveHeight(1.3)  }}>{item.cityName}</Text>
                                    </TouchableOpacity>
                                )}
                                keyExtractor={(item, index) => index.toString()}
                            />
                        </View> : null}
                    </View>

                    <View style={{ top: responsiveHeight(1.5) }} >
                    <Text style={{color:Color.fontColor}}>Clinic Name *</Text>
                        <TextInput returnKeyType="done"
                        onFocus = {() => this.callOnFocus('2')}
                        onBlur = {() => this.callOnBlur('2')}
                        placeholderTextColor={Color.placeHolderColor}
                        style={[styles.createInputStylefornewClinic, {borderColor : this.state.fld2 }]} placeholder="Enter your clinic's name" value={this.state.clinicName} onChangeText={(clinicName) => { return this.SearchFilterFunctionClinic(clinicName); }} />
                    </View>
                    <View style={{ flex: 1 }}>
                        {this.state.listShowStatusClinic && this.state.clinicArray.length > 0 ?

                            <View style={{
                                borderBottomLeftRadius: 4, borderBottomRightRadius: 4, borderWidth: 1, borderLeftColor: Color.createInputBorder, borderRightColor: Color.createInputBorder,
                                borderBottomColor: Color.createInputBorder, borderTopColor: Color.white
                            }}>
                                <FlatList style={{ marginTop: responsiveHeight(1.3), backgroundColor: '#fafafa' }}
                                    data={this.state.clinicArray}
                                    renderItem={({ item, index }) => (
                                        <View>
                                            {item.clinicName === 'AddnewClinic' ?
                                                <TouchableOpacity style={{ height: 40, justifyContent: 'flex-start', marginTop: 7, marginBottom: 7 }}
                                                    onPress={() => this.props.navigation.navigate('AddNewClinicDetails', { clinicName: this.state.clinicName,from:'Add' })}>
                                                    <Text style={{ fontFamily: CustomFont.fontName, color: Color.primary, fontSize: CustomFont.font16, marginTop: responsiveHeight(1.3), marginLeft: 20 }}>Create a new clinic</Text>
                                                </TouchableOpacity> :
                                                <TouchableOpacity style={{ justifyContent: 'flex-start', }}
                                                    onPress={() => this.clickOnClinic(item)}>
                                                    <Text style={{ fontFamily: CustomFont.fontName, color: Color.black, fontSize: CustomFont.font16, marginTop: responsiveHeight(1.3), marginLeft: 20,marginTop:10,marginBottom:10 }}>{item.clinicName}</Text>
                                                </TouchableOpacity>
                                            }
                                        </View>
                                    )}
                                    keyExtractor={(item, index) => index.toString()}
                                />
                            </View>
                            : null}

                    </View>
                    <View style={{ flexDirection: 'row', marginTop: responsiveHeight(1.6) }}>
                        <TouchableOpacity style={{ alignItems: 'center', justifyContent: 'center', borderRadius: 4, borderColor: Color.grayBorder, borderWidth: 1, height: responsiveHeight(7), width: responsiveWidth(87), backgroundColor: '#5715D2', }} onPress={() => {
                            this.gottoNext();
                        }}>
                            <Text style={{ fontFamily: CustomFont.fontName, color: Color.white, fontSize: CustomFont.font16, textAlign: 'center' }}>{this.state.btnText}</Text>
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
)(AddNewClinic);
