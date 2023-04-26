import React, { useState } from 'react';
import {
    SafeAreaView,
    View,
    Text, TouchableOpacity, FlatList, Image,Keyboard,Platform
} from 'react-native';
import styles from './style';

import * as signupActions from '../../redux/actions/signupActions';
import * as apiActions from '../../redux/actions/apiActions';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import _ from 'lodash';
import ic_menu from '../../../assets/ic_menu.png';
import Color from '../../components/Colors';
import CustomFont from '../../components/CustomFont';
import { responsiveWidth, responsiveHeight, responsiveFontSize } from 'react-native-responsive-dimensions';
import Carousel, { Pagination } from 'react-native-snap-carousel';
let cardId = '';
let slectedCity = '', selectedClinic = '', address = '';
class ECardHome extends React.Component {
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

            selectedCards: 0,
            featureCardsArr: [],
            activeSlide: 0,
            cardCategoryArr: [],
            eArray: [],
        };
        slectedCity = ''; selectedClinic = ''; address = '';
    }
    componentDidMount() {
		Keyboard.dismiss(0);
        let { actions, signupDetails } = this.props;

        let params = {
			"UserGuid": signupDetails.UserGuid,
            "DoctorGuid": signupDetails.doctorGuid, "Version": null,
            "Data": {
                "TopicCardGuid": null
            }
        }
        actions.callLogin('V1/FuncForDrAppToGetEcardList_V1', 'post', params, signupDetails.accessToken, 'ecardhome');
        //this.backHandler = BackHandler.addEventListener('hardwareBackPress', () => this.props.navigation.goBack())
    }

    async UNSAFE_componentWillReceiveProps(newProps) {
        if (newProps.responseData && newProps.responseData.tag) {
            let tagname = newProps.responseData.tag;
            let data = newProps.responseData.data;
            if (tagname === 'ecardhome') {
                if (newProps.responseData.statusCode === '0') {
                    this.setState({ featureCardsArr: data.featuredCardList });
                    let tempArr = data.ecardTopicList;
                    let tempObj = {};
                    tempObj.topicCardGuid = null;
                    tempObj.topicName = 'All Cards';
                    tempArr.splice(0, 0, tempObj);
                    this.setState({ cardCategoryArr: tempArr });
                    this.setState({ eArray: data.ecardList });
                }
            }
            else if (tagname == 'ecardtopic') {
                let dataTopic = newProps.responseData.data;
                if (newProps.responseData.statusCode === '0') {
                    this.setState({ eArray: data.ecardList });
                }
            }
        }
    }

    pressOnCard = (item, index) => {
        cardId = item.cardLanguageGuid;
       let eCardId = item.ecardGuid;
        this.props.nav.navigation.navigate('EditCard', { cardLanguageGuid: cardId, eCardsGuid: eCardId })
    }

    _renderItem = ({ item, index }) => {
        return (
            <View style={styles.ecard}>
                <TouchableOpacity onPress={() => this.pressOnCard(item, index)}>
                    <Image source={{ uri:  item.thumbnailUrl }} style={styles.img} />
                </TouchableOpacity></View>
        );
    }

    selectCategory = (item, index) => {
        let { actions, signupDetails } = this.props;
        this.setState({ selectedCards: index });
        let tempTopicId = '';
        if (index == 0) {
            tempTopicId = null;
        }
        else {
            tempTopicId = item.topicCardGuid;
        }
        let params = {
			"UserGuid": signupDetails.UserGuid,
            "DoctorGuid": signupDetails.doctorGuid, "Version": null,
            "Data": {
                "TopicCardGuid": tempTopicId
            }
        }
        actions.callLogin('V1/FuncForDrAppToGetEcardList', 'post', params, signupDetails.accessToken, 'ecardtopic');

    }

    renderList = (item, index) => {
        return (
            <TouchableOpacity style={[styles.rowView, {
                borderWidth: 1,
                borderColor: this.state.selectedCards === index ?
                    Color.liveBg : Color.borderColor,
                    borderRadius:10,
                    margin:5,
                backgroundColor: this.state.selectedCards === index ? '#F3ECEE' : Color.patientBackground
            }]} onPress={() => this.selectCategory(item, index)}>
                {/* <View style={styles.circle} /> */}
                <Text style={[styles.cName, { color: this.state.selectedCards === index ? Color.optiontext : Color.fontColor }]}>{item.topicName}</Text>
            </TouchableOpacity>
        )
    }
    renderCardList = (item, index) => {
        return (
            <View style={[styles.ecardcategory1, { marginLeft: index % 2 == 0 ? 5 : 15 }]}>
                <TouchableOpacity onPress={() => this.pressOnCard(item, index)}>
                    {/* <Image source={{ uri: item.thumbnailUrl }} style={styles.imgcategory} /> */}
                    <Image source={{ uri: item.thumbnailUrl}} style={styles.imgcategory} />
                </TouchableOpacity></View>
        );
    }

    render() {
        let { actions, signupDetails,loading } = this.props;
        //alert(this.props.navigation.state.params.selectedState);
        return (
            <View style={Platform.OS == 'android' ? styles.containerAndroid: styles.container}>
                {/* <View style={{ paddingLeft: responsiveWidth(4), paddingRight: responsiveWidth(4), height: Platform.OS == 'ios' ? 40 : responsiveHeight(7.5), flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-start', backgroundColor: Color.primary, width: '100%' }}>
                    <View style={{ flexDirection: 'row', flex: 1 }}>
                        <TouchableOpacity style={{ paddingRight: 15, flexDirection: 'row', alignItems: 'center' }} onPress={() => this.props.navigation.goBack()}>
                            <Image source={arrowBack} style={{ height: responsiveWidth(4.5), width: responsiveWidth(5) }} />
                        </TouchableOpacity>
                        <Text style={styles.headerTxt}>e Cards</Text>
                    </View>
                    <View style={{ flexDirection: 'row', flex: 1, justifyContent: 'flex-end' }}>
                        <TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center' }} onPress={() => this.props.navigation.goBack()}>
                            <Image source={crossIcon} style={{ height: responsiveWidth(6), width: responsiveWidth(6) }} />
                        </TouchableOpacity>
                    </View>
                </View> */}

                <TouchableOpacity onPress={() => this.props.nav.navigation.openDrawer()} style={{ backgroundColor: Color.white, flexDirection: 'row', height: responsiveHeight(7),alignItems:'center' }}>
                <TouchableOpacity onPress={() => this.props.nav.navigation.openDrawer()} >
								<Image style={{ resizeMode: 'contain', height: responsiveWidth(6), width: responsiveWidth(6), padding: responsiveHeight(1), marginLeft: responsiveWidth(2.1), marginTop: responsiveHeight(.35) }} source={ic_menu} />
							</TouchableOpacity>
						<Text style={{fontFamily: CustomFont.fontName, color: Color.fontColor, fontSize: CustomFont.font16, fontWeight: CustomFont.fontWeight700, marginLeft: responsiveWidth(4) }}>E Cards</Text>
					</TouchableOpacity>
  

                <View style={{ flex: 1, margin: responsiveWidth(3),marginTop: responsiveWidth(1) }}>
                    <View style={{ alignItems: 'flex-start', width: '100%', }}>
                        <Text style={styles.fea}>Featured e-Cards</Text>
                        <Carousel
                            layout={'default'}
                            // style = {{backgroundColor : 'red'}}
                            ref={(c) => { this._carousel = c; }}
                            data={this.state.featureCardsArr}
                            renderItem={this._renderItem}
                            sliderWidth={responsiveWidth(90)}
                            itemWidth={responsiveWidth(80)}
                            onSnapToItem={(index) => this.setState({ activeSlide: index })}
                        />
                        <View style={{ alignSelf: 'center', marginTop: -20 }}>
                            <Pagination
                                dotsLength={this.state.featureCardsArr.length}
                                activeDotIndex={this.state.activeSlide}
                                dotContainerStyle={{ marginLeft: 0 }}
                                dotColor={Color.liveBg}
                                inactiveDotColor='#E0E0E0'
                                dotStyle={{
                                    height: responsiveHeight(1), backgroundColor: Color.sliderDot,
                                    width: responsiveHeight(1), borderRadius: responsiveHeight(.5)
                                }}
                                inactiveDotScale={1}   
                                carouselRef={this._carousel}
                                tappableDots={!!this._carousel} />
                        </View>
                    </View>
                    <View>
                        <FlatList
                            data={this.state.cardCategoryArr}
                            horizontal={true}
                            showsVerticalScrollIndicator={false}
                            renderItem={({ item, index }) => this.renderList(item, index)}
                            extraData={this.state}
                            keyExtractor={(item, index) => index.toString()}
                        //onEndReached={this.loadMoreData}
                        />
                    </View>
                    {this.state.eArray && this.state.eArray.length>0 ? <FlatList
                        style={{ marginTop: responsiveHeight(1.2) }}
                        data={this.state.eArray}
                        horizontal={false}
                        numColumns={2}
                        showsVerticalScrollIndicator={true}
                        renderItem={({ item, index }) => this.renderCardList(item, index)}
                        extraData={this.state}
                        keyExtractor={(item, index) => index.toString()}
                    //onEndReached={this.loadMoreData}
                    /> : <View style={{alignItems:'center'}}>
                        <Text style={{fontSize:CustomFont.font18,color:Color.primary,marginTop:responsiveHeight(7)}}>{loading ? 'Please Wait..':'No Card available'} </Text>
                        </View>}
                    
                </View>
            </View>
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
)(ECardHome);