import React, { useState } from 'react';
import {
	SafeAreaView,
	View,
	Text,
	StatusBar, Image, TouchableOpacity,  BackHandler, FlatList
} from 'react-native';
import * as signupActions from '../../redux/actions/signupActions';
import * as apiActions from '../../redux/actions/apiActions';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
var _ = require('lodash');
import Color from '../../components/Colors';
import CustomFont from '../../components/CustomFont';
import CommonStyle from '../../components/CommonStyle.js';
import { responsiveFontSize, responsiveHeight, responsiveWidth } from 'react-native-responsive-dimensions';
import arrowBack from '../../../assets/back_blue.png';
import arrow_right from '../../../assets/chevron_right.png';

class ClinicSetupIndex extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			dataArray: ['', '', '', '', '', '', '', '', '', '', '', '', '', '', '', ''],
		};
	}
	async componentDidMount() {
		//alert(JSON.stringify(this.props.navigation.state.params.item));
		this.setState({ dataArray: this.props.navigation.state.params.item });
		this.backHandler = BackHandler.addEventListener('hardwareBackPress', () => this.props.navigation.goBack())
	}
	async UNSAFE_componentWillReceiveProps(newProps) {
		if (newProps.responseData && newProps.responseData.tag) {
			let tagname = newProps.responseData.tag;
			let { actions, signupDetails, loading } = this.props;
			if (tagname === 'clinicDetailsHome') {
				let data = newProps.responseData.data;

			}
		}

	}
	renderList = ({ item, index }) => (
		<TouchableOpacity style={{ marginLeft: responsiveWidth(4), marginEnd: responsiveWidth(4), marginTop: responsiveWidth(3), flexDirection: 'row', justifyContent: 'space-between', borderRadius: 10, backgroundColor: Color.white }}
			onPress={() => this.props.navigation.navigate('AnswerDetails', { item: item })}>
			<View style={{ padding: 10, flex: 1, flexDirection: 'row', }}>
				<View style={{ flex: 10, marginTop: responsiveHeight(1), marginBottom: responsiveHeight(1), marginLeft: responsiveHeight(1) }}>
					<Text style={{ fontSize: CustomFont.font14, color: Color.fontColor, fontWeight: CustomFont.fontWeight400, fontFamily: CustomFont.fontName }}>{item.helpTopicQuestion}</Text>
				</View>
				<View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
					<Image source={arrow_right} style={{ height: responsiveFontSize(2), width: responsiveFontSize(2), tintColor: Color.black, resizeMode: 'contain' }} />
				</View>
			</View>
		</TouchableOpacity>

	);
	render() {
		let { actions, signupDetails, loading } = this.props;
		return (
			<SafeAreaView style={CommonStyle.container}>
				<StatusBar backgroundColor={Color.statusBarNewColor} barStyle="dark-content" />
				<View style={{ flex: 1, backgroundColor: Color.patientBackground }}>
					<TouchableOpacity onPress={() => this.props.navigation.goBack()} style={{ backgroundColor: Color.white, flexDirection: 'row', height: responsiveHeight(7), alignItems: 'center' }}>
						<TouchableOpacity onPress={() => this.props.navigation.goBack()} >
							<Image source={arrowBack} style={{ marginLeft: responsiveWidth(3),  width: responsiveFontSize(3), height: responsiveFontSize(3.2), padding: responsiveHeight(1),  resizeMode:'contain' }} />
						</TouchableOpacity>
						<Text style={{ fontFamily: CustomFont.fontName, color: Color.fontColor, fontSize: CustomFont.font16, fontWeight: CustomFont.fontWeight700, marginLeft: responsiveWidth(4) }}>{DRONA.getQuestionListHeader()}</Text>
					</TouchableOpacity>
					<FlatList
					style={{marginTop:responsiveHeight(3)}}
						data={this.state.dataArray}
						renderItem={this.renderList}
						extraData={this.state}
						keyExtractor={(item, index) => index.toString()}
					/>
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
)(ClinicSetupIndex);