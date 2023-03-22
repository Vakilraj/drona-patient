import React, { useState } from 'react';
import {
	SafeAreaView,
	View,
	Text,
	StatusBar, Image, TouchableOpacity,
	FlatList, SectionList, ScrollView, BackHandler
} from 'react-native';
import styles from '../style';
import Moment from 'moment';
import * as signupActions from '../../../redux/actions/signupActions';
import * as apiActions from '../../../redux/actions/apiActions';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import arrowBack from '../../../../assets/back_blue.png';
import clockIcon from '../../../../assets/ic_past_encounter.png';
import rxIcon from '../../../../assets/rx.png'
import claIcon from '../../../../assets/ic_medical_histroy.png';
import upArrow from '../../../../assets/uparrow.png';
import downArrow from '../../../../assets/downarrow.png';
import Color from '../../../components/Colors';
import CustomFont from '../../../components/CustomFont';
import { responsiveFontSize, responsiveHeight, responsiveWidth } from 'react-native-responsive-dimensions';
var _ = require('lodash');
import Trace from '../../../service/Trace'
import ThreeDotsModal from '../ThreeDotsModal';
import { setLogEvent } from '../../../service/Analytics';
import needle from '../../../../assets/needle.png';
import ic_inclinic from '../../../../assets/ic_inclinic.png';
import vector_phone from '../../../../assets/vector_phone.png';

import Snackbar from 'react-native-snackbar';
import Edit from '../../../../assets/edit_primary.png';

let date = null, ifClickOnEdit = false, patientGuid = '', item = null;
class CN extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			
		};

	}
	async componentDidMount() {
		
	}
	render() {
		let { signupDetails } = this.props;
		//let item = this.props.navigation.state.params.item;
		return (
						<View style={{flex: 1, backgroundColor : Color.white, margin:responsiveWidth(3),borderRadius:10}}>
							
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
)(CN);