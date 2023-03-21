import React, { useState } from 'react';
import {
    SafeAreaView,
    View,
    Text,
    StatusBar, Image, TextInput, TouchableOpacity, BackHandler, FlatList
} from 'react-native';

import * as signupActions from '../../redux/actions/signupActions';
import * as apiActions from '../../redux/actions/apiActions';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import Moment from 'moment';
import Color from '../../components/Colors';
import CustomFont from '../../components/CustomFont';
import CommonStyle from '../../components/CommonStyle.js';
import { responsiveFontSize, responsiveHeight, responsiveScreenFontSize, responsiveWidth } from 'react-native-responsive-dimensions';
import Plus from '../../../assets/plus.png';
import CrossIcon from '../../../assets/cross.png';
import Inclinic from '../../../assets/inclinic.png';
import selectedViolet from '../../../assets/selected_violet.png';
import clinic_image from '../../../assets/clinic_image.png';
import Snackbar from 'react-native-snackbar';
import AsyncStorage from 'react-native-encrypted-storage';

class ClinicList extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            clinicList: DRONA.getClinicList()
        };

    }


    async componentDidMount() {

        let { actions, signupDetails } = this.props;
        let tempArr = [...this.state.clinicList];
        let clinicArr = []
        for (let i = 0; i < tempArr.length; i++) {
            let tempObj = Object.assign({ isSelect: DRONA.getSelectedIndexClinic()==i ? true: false }, tempArr[i]);
            clinicArr.push(tempObj);
        }
        // if (!clinicArr)
        //     clinicArr.push('addclinic');
        this.setState({ clinicList: clinicArr });
        this.backHandler = BackHandler.addEventListener('hardwareBackPress', () => this.props.navigation.goBack())
    }

    async UNSAFE_componentWillReceiveProps(newProps) {
        if (newProps.responseData && newProps.responseData.tag) {
            let tagname = newProps.responseData.tag;
            let { actions, signupDetails, loading } = this.props;
            if (tagname === 'clinicDetails') {
            }
        }
    }
    clickOnItem = (item, index) => {
        let tempArr = [...this.state.clinicList];
        tempArr[DRONA.getSelectedIndexClinic()].isSelect = false
        tempArr[index].isSelect = true;
        this.setState({ clinicList: tempArr });

        let { actions, signupDetails } = this.props;
        signupDetails.clinicName = item.clinicName;
        signupDetails.clinicGuid = item.clinicGuid;
        signupDetails.clinicStatus = item.status;
        actions.setSignupDetails(signupDetails);
        
        DRONA.setSelectedIndexClinic(index);
			AsyncStorage.setItem('clinicGuid', item.clinicGuid);
            DRONA.setIsReloadApi(true)
            DRONA.setIsDrTimingsUpdated(true);
        setTimeout(() => {
            this.props.navigation.goBack();
        }, 300)
    }
    getdateFormat = (val) => {
        let str = '';
        try {
            str = Moment(val).format('DD/MM/YYYY');
        } catch (error) {
            str = val;
        }
        return str;
    }
    nameFormat = (item) => {
		let str = '';
		try {
			if (item.clinicName.includes(' ')) {
				let strArr = item.clinicName.trim().split('  ');
				if (strArr[1]) {
					str = strArr[0].substr(0, 1).toUpperCase() + strArr[1].substr(0, 1).toUpperCase()
				} else {
					str = strArr[0].substr(0, 2).toUpperCase();
				}
			} else {
				str = item.clinicName.substr(1, 2)
			}
		} catch (e) { }
		return str
	}
    renderList = ({ item, index }) => (
        <View>
            {item === 'addclinic' ? <TouchableOpacity style={{ flexDirection: 'row', backgroundColor: Color.lightGrayBg, paddingTop: responsiveHeight(2), paddingBottom: responsiveHeight(2) }}
                onPress={() => {
                    if (this.state.clinicList.length > 1) {
                        Snackbar.show({ text: 'You already added clinic', duration: Snackbar.LENGTH_SHORT, backgroundColor: Color.primary });
                    } else {
                        this.props.navigation.navigate('AddNewClinicDetails', { clinicName: '', from: 'Add' })
                    }


                }}>
                <View style={{ flex: 1, alignItems: 'center' }}>
                    <View style={{
                        height: responsiveFontSize(4), width: responsiveFontSize(4), backgroundColor: Color.primaryBlue, borderRadius: responsiveFontSize(2),
                        alignItems: 'center', justifyContent: 'center', marginTop: responsiveHeight(.5), opacity: .8
                    }}>
                        <Image source={Plus} style={{ height: responsiveFontSize(1.5), width: responsiveFontSize(1.5), resizeMode: 'contain' }} />
                    </View>
                </View>
                <View style={{ flex: 6, }}>
                    <Text style={{ fontFamily: CustomFont.fontNameBold, fontWeight: 'bold', fontSize: CustomFont.font14, color: Color.primaryBlue, marginTop: responsiveHeight(1) }}>Add a new clinic</Text>

                </View>
            </TouchableOpacity> :

                <TouchableOpacity style={{ flexDirection: 'row', backgroundColor: Color.white, marginTop: responsiveHeight(1.6), borderRadius: 10 }} onPress={() => {
                    this.clickOnItem(item, index);
                }}>
                    <View style={{ flex: 1.5, alignItems: 'center', justifyContent: 'center' }}>
                    <View style={{width: responsiveWidth(10), height: responsiveWidth(10), borderRadius: responsiveWidth(6), backgroundColor: '#EEE8FB', justifyContent: 'center', alignItems: 'center'}} >
							{item.clinicImageUrl ?
								<Image style={{ width: responsiveWidth(11), height: responsiveWidth(11), borderRadius: responsiveWidth(6), justifyContent: 'center', alignItems: 'center' }} source={{ uri: item.clinicImageUrl }} /> :
								<Text style={{ fontSize: CustomFont.font14, color: Color.profileImageText, fontFamily: CustomFont.fontName, fontWeight: '400', justifyContent: 'center', alignItems: 'center' }}>{this.nameFormat(item)}</Text>}
						</View>
                        
                    </View>
                    <View style={{ flex: 6, }}>
                        <Text style={{ fontFamily: CustomFont.fontName, fontWeight: 'bold', fontSize: CustomFont.font14, color: Color.fontColor, marginTop: responsiveHeight(1.6), }}>{item.clinicName}</Text>
                        <Text style={{ fontFamily: CustomFont.fontName, fontWeight: 'normal', fontSize: CustomFont.font12, color: Color.textItem, marginTop: responsiveHeight(1), }}>{this.getAddress(item)}</Text>
                        <Text style={{ fontFamily: CustomFont.fontName, fontWeight: 'normal', fontSize: CustomFont.font12, color: Color.textItem, marginTop: responsiveHeight(1), marginBottom: responsiveHeight(1.6) }}>Clinic No. : {item.clinicNumber}</Text>
                    </View>
                    <View style={{ flex: 1.5, alignItems: 'center', justifyContent: 'center', flexDirection: 'row' }}>
                        {item.isSelect ? <Image source={selectedViolet} style={{ height: responsiveFontSize(1.8), width: responsiveFontSize(1.8), resizeMode: 'contain', marginRight: responsiveWidth(1) }} />:null}
                        
                    </View>
                </TouchableOpacity>
            }
        </View>

    );
    getAddress = (item) => {
        let clinicAddr = '';
        if (item.clinicAddress) {
            clinicAddr = item.clinicAddress
        }
        if (item.clinicCity) {
            clinicAddr += item.clinicAddress ? ', ' + item.clinicCity : item.clinicCity
        }
        if (item.clinicState) {
            clinicAddr += ', ' + item.clinicState
        }

        if (item.clinicZip) {
            clinicAddr += ', ' + item.clinicZip
        }
        if (item.clinicCountry) {
            clinicAddr += ', ' + item.clinicCountry;
        }
        return clinicAddr;
    }
    render() {
        console.log('---------'+JSON.stringify(this.state.clinicList));
        return (
            <SafeAreaView style={CommonStyle.container}>
                <StatusBar backgroundColor={Color.statusBarNewColor} barStyle="dark-content" />
                <View style={{ flex: 1, backgroundColor: Color.lightGrayBg }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: Color.white, height: responsiveHeight(5) }}>
                        <TouchableOpacity style={{ padding: 10, flexDirection: 'row', alignItems: 'center' }} onPress={() => this.props.navigation.goBack()}>
                            <Image source={CrossIcon} style={{ height: responsiveWidth(4.5), width: responsiveWidth(5) }} />
                        </TouchableOpacity>
                        <Text style={{ marginLeft: 14, fontFamily: CustomFont.fontName, fontSize: CustomFont.font16, textAlign: 'center', marginLeft: responsiveWidth(30) }}>Your Clinics</Text>
                    </View>
                    <View style={{ margin: responsiveWidth(4) }}>
                        <FlatList
                            data={this.state.clinicList}
                            showsVerticalScrollIndicator={false}
                            renderItem={this.renderList}
                            extraData={this.state}
                            keyExtractor={(item, index) => index.toString()}
                        />
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
)(ClinicList);

