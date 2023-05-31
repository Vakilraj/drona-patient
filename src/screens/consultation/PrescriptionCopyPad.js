import Moment from 'moment';
import React from 'react';
import {
	Alert,
	FlatList,
	Image,
	PermissionsAndroid,
	Platform,
	ScrollView,
	Text,
	TouchableOpacity,
	View
} from 'react-native';
import { responsiveHeight, responsiveFontSize, responsiveWidth } from 'react-native-responsive-dimensions';
import Snackbar from 'react-native-snackbar';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import Color from '../../components/Colors';
import CustomFont from '../../components/CustomFont';
import * as apiActions from '../../redux/actions/apiActions';
import * as signupActions from '../../redux/actions/signupActions';
import ThreeDotsModal from './ThreeDotsModal';
import UnselectedBox from '../../../assets/UnselectedBox.png'
import SelectedBox from '../../../assets/SelectedBox.png'

import noFiles from '../../../assets/noFiles.png'
let fullResponseArr = [];
class PrescriptionCopyPad extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			PastRxDataArray: []
		};

	}
	async componentDidMount() {
		let { actions, signupDetails } = this.props;
		let params = {
			"RoleCode": signupDetails.roleCode,
			"userGuid": signupDetails.UserGuid,
			"DoctorGuid": signupDetails.doctorGuid,
			"ClinicGuid": signupDetails.clinicGuid,
			"PatientGuid": signupDetails.patientGuid,
			"Data": {
				// "AppointmentGuid": from =='Past Encounters' ? pastAppointGuid: signupDetails.appoinmentGuid 
			}
		}
		actions.callLogin('V1/FuncForDrAppToGetPrescriptionDetailsMagicPad', 'post', params, signupDetails.accessToken, 'getMagicPadData');
	}

	async UNSAFE_componentWillReceiveProps(newProps) {
		if (newProps.responseData && newProps.responseData.tag) {
			let tagname = newProps.responseData.tag;
			let { actions, signupDetails, } = this.props;
			if (tagname === 'getMagicPadData') {
				try {
					if (newProps.responseData.statusCode == '0') {
						let data = newProps.responseData.data;
						let dataArr = data ? data.prescriptionMagicTabDatelist : [];
						fullResponseArr = dataArr;
						if (dataArr && dataArr.length > 0) {
							let tempDataArray = [];
							for (let i = 0; i < dataArr.length; i++) {
								let prescriptionData = dataArr[i];
								let symptomDataArr = prescriptionData.selectedSymptoms;
								let FindingsArr = prescriptionData.selectedFindings;
								let DiagnosisArr = prescriptionData.selectedDiagnosis;
								let MedicinesArr = prescriptionData.selectedMedicines;
								let InvestigationsArr = prescriptionData.selectedInvestigations;
								let InstructionsArr = prescriptionData.selectedInstructions;
								let ProcedureArr = prescriptionData.selectedProcedure;
								let symptomTxt = '', findingTxt = '', diagnosticTxt = '', medicineTxt = '', investigationTxt = '', instructionTxt = '', procedureTxt = '';
								if (symptomDataArr && symptomDataArr.length > 0) {
									for (let j = 0; j < symptomDataArr.length; j++) {
										let item = symptomDataArr[j];
										let tempStr = '';
										if (item.severityName)
											tempStr = item.severityName;
										if (item.since)
											tempStr += ' ' + item.since;
										if (tempStr)
											tempStr = '(' + tempStr + ')';
										symptomTxt += item.symptomName + ' ' + tempStr + '\n';
									}
								}

								if (FindingsArr && FindingsArr.length > 0) {
									for (let j = 0; j < FindingsArr.length; j++) {
										let item = FindingsArr[j];
										let tempStr = '';
										if (item.severityName)
											tempStr = item.severityName;
										if (item.since)
											tempStr += ' ' + item.since;
										if (tempStr)
											tempStr = '(' + tempStr + ')';
										findingTxt += item.findingName + ' ' + tempStr + '\n';
									}
								}

								if (DiagnosisArr && DiagnosisArr.length > 0) {
									for (let j = 0; j < DiagnosisArr.length; j++) {
										let item = DiagnosisArr[j];
										let tempStr = '';
										if (item.diagnosisStatus)
											tempStr = item.diagnosisStatus;
										if (item.since)
											tempStr += ' ' + item.since;
										if (tempStr)
											tempStr = '(' + tempStr + ')';
										diagnosticTxt += item.diagnosisName + ' ' + tempStr + '\n';
									}
								}

								if (MedicinesArr && MedicinesArr.length > 0) {
									for (let j = 0; j < MedicinesArr.length; j++) {
										let item = MedicinesArr[j];
										let tempStr = '';
										if (item.dosages)
											tempStr = item.medicineType;

										if (item.dosagePattern)
											tempStr += tempStr ? ', ' + item.dosagePattern : item.dosagePattern;
										if (item.medicineTimingFrequency)
											tempStr += tempStr ? ', ' + item.medicineTimingFrequency : item.medicineTimingFrequency;
										if (item.durationType)
											tempStr += ', ' + item.durationType + ' ';
										if (tempStr)
											tempStr = '(' + tempStr + ')'
										medicineTxt += item.medicineName + ' ' + tempStr + '\n';
									}
								}

								if (InvestigationsArr && InvestigationsArr.length > 0) {
									for (let j = 0; j < InvestigationsArr.length; j++) {
										let item = InvestigationsArr[j];
										let tempStr = '';
										if (item.notes)
											tempStr = item.notes;
										if (tempStr)
											tempStr = '(' + tempStr + ')'
										investigationTxt += item.investigationName + ' ' + tempStr + '\n';
									}
								}

								if (InstructionsArr && InstructionsArr.length > 0) {
									for (let j = 0; j < InstructionsArr.length; j++) {
										let item = InstructionsArr[j];
										if(item.instructionsName)
										instructionTxt += item.instructionsName + '\n';
									}
								}

								if (ProcedureArr && ProcedureArr.length > 0) {
									for (let j = 0; j < ProcedureArr.length; j++) {
										let item = ProcedureArr[j];
										procedureTxt += item.procedureName + '\n';
									}
								}

								let tmpInnerData = [];
								if (symptomTxt) {
									let innerObj = { title: symptomTxt, isSelect: false, prefix: 'Sx' }
									tmpInnerData.push(innerObj);
								}
								if (findingTxt) {
									let innerObj = { title: findingTxt, isSelect: false, prefix: 'Fx' }
									tmpInnerData.push(innerObj);
								}
								if (diagnosticTxt) {
									let innerObj = { title: diagnosticTxt, isSelect: false, prefix: 'Dx' }
									tmpInnerData.push(innerObj);
								}
								if (medicineTxt) {
									let innerObj = { title: medicineTxt, isSelect: false, prefix: 'Mx' }
									tmpInnerData.push(innerObj);
								}
								if (investigationTxt) {
									let innerObj = { title: investigationTxt, isSelect: false, prefix: 'Lab' }
									tmpInnerData.push(innerObj);
								}
								if (instructionTxt) {
									let innerObj = { title: instructionTxt, isSelect: false, prefix: 'Ins' }
									tmpInnerData.push(innerObj);
								}
								if (procedureTxt) {
									let innerObj = { title: procedureTxt, isSelect: false, prefix: 'Pro' }
									tmpInnerData.push(innerObj);
								}



								let temObj = { title: dataArr[i].pastPrescriptionDate, isSelect: false, data: tmpInnerData }
								tempDataArray.push(temObj);
								//console.log('-----' + JSON.stringify(temObj));
							}
							this.setState({ PastRxDataArray: tempDataArray })
						}
					}
				} catch (e) { }
			}
		}
	}

	selectAllValue = (item) => {
		let childs = item.data
		item.isSelect = !item.isSelect

		if (childs && childs.length > 0) {
			for (let i = 0; i < childs.length; i++) {
				childs[i].isSelect = item.isSelect
				this.setState({ PastRxDataArray: this.state.PastRxDataArray })
			}
		}
	}
	selectSingleValue = (childItem, index, parentIndex) => {
		//console.log(index+'--------++----'+parentIndex+'    '+JSON.stringify(this.state.PastRxDataArray));
		let tmpArr = [...this.state.PastRxDataArray];
		let childArr = tmpArr[parentIndex].data;
		childArr[index].isSelect = !childArr[index].isSelect;
		let parentFlag = true;
		for (let i = 0; i < childArr.length; i++) {
			if (!childArr[i].isSelect) {
				parentFlag = false;
				break;
			}
		}
		if (parentFlag)
			tmpArr[parentIndex].isSelect = true;
		else
			tmpArr[parentIndex].isSelect = false;

		tmpArr[parentIndex].data = childArr;

		this.setState({ PastRxDataArray: tmpArr });
	}
	renderListInner = ({ item, index }, parentIndex) => (
		<TouchableOpacity style={{ flexDirection: 'row', marginLeft: 10, marginRight: 10, marginTop: responsiveHeight(2) }} onPress={() => this.selectSingleValue(item, index, parentIndex)}>
			<View style={{ flex: 1 }}>
				<View style={{ height: responsiveFontSize(5), width: responsiveFontSize(5), borderRadius: 20, backgroundColor: Color.lightPurple, alignItems: 'center', justifyContent: 'center', }}>
					<Text style={{ color: Color.primary, fontSize: CustomFont.font14, fontFamily: CustomFont.fontName }}>{item.prefix}</Text>
				</View>
			</View>

			<View style={{ flex: 4 }}>
				<Text style={{
					color: Color.optiontext, fontSize: CustomFont.font14, fontFamily: CustomFont.fontName, marginLeft: 10
				}}>{item.title}</Text>
			</View>
			<View style={{ flex: 1 }}>
				<Image source={item.isSelect ? SelectedBox : UnselectedBox} style={{ height: 20, width: 20, alignContent: 'center', marginLeft: responsiveWidth(5), alignSelf: 'center' }} />
			</View>
		</TouchableOpacity>
	);
	renderSeparator = () => {
		return <View style={{ height: 1, width: '100%', backgroundColor: Color.newPurpleLine, }} />;
	};
	setCopiedData = () => {
		let tmpArr = [...this.state.PastRxDataArray];
		if (tmpArr && tmpArr.length > 0) {
			let statusFlag = false;
			for (let i = 0; i < tmpArr.length; i++) {
				let innerDArr = tmpArr[i].data;
				for (let j = 0; j < innerDArr.length; j++) {
					if (innerDArr[j].isSelect) {
						statusFlag = true;
						break;
					}
				}
			}
			if (statusFlag) {
				let tmpSelArr = [];
				for (let i = 0; i < tmpArr.length; i++) {
					tmpSelArr.push(tmpArr[i].data);
				}
				DRONA.getRxjsContext().next({ fullres: fullResponseArr, selectedItem: tmpSelArr });
				this.props.TabChangeFromRx();
			} else {
				Snackbar.show({ text: 'Please select atleast one item', duration: Snackbar.LENGTH_SHORT, backgroundColor: Color.primary });
			}

		} else {
			Snackbar.show({ text: 'No data available to save', duration: Snackbar.LENGTH_SHORT, backgroundColor: Color.primary });
		}

	}
	render() {
		let { actions, signupDetails } = this.props;
		return (
			<View style={{ flex: 1, backgroundColor: Color.lightGrayBg, }}>
				<View style={{ flex: 1 }}>
					{console.log('======= this.state.PastRxDataArray =======', JSON.stringify(this.state.PastRxDataArray))}
					{this.state.PastRxDataArray ?
						<View style={{ flex: 1 }}>
							<FlatList
								data={this.state.PastRxDataArray}
								showsVerticalScrollIndicator={false}
								renderItem={({ item, index }) => (
									<View style={{
										backgroundColor: Color.white,
										marginStart: 10, marginEnd: 10, marginTop: 15, borderRadius: 10
									}}>
										<TouchableOpacity style={{ flexDirection: 'row', marginLeft: 10, alignItems: 'center', marginTop: 15 }} onPress={() => this.selectAllValue(item)}>
											<Text style={{
												color: Color.black, fontWeight: CustomFont.fontWeight600,
												fontSize: CustomFont.font14, fontFamily: CustomFont.fontName
											}}>{item.title}</Text>
											<Image source={item.isSelect ? SelectedBox : UnselectedBox} style={{ height: 20, width: 20, resizeMode: 'contain', marginLeft: 10 }} />
										</TouchableOpacity>
										<FlatList
											data={item.data}
											style={{ marginBottom: 10 }}
											ItemSeparatorComponent={this.renderSeparator}
											showsVerticalScrollIndicator={false}
											renderItem={
												(childData) => this.renderListInner(childData, index)
											}
										/>
									</View>

								)}
							/>

						</View>
						: <View style={{
							flex: 1, backgroundColor: Color.white,
							marginStart: 10, marginEnd: 10, marginTop: 15, borderRadius: 10
						}}>
							<View style={{ alignItems: 'center' }}>
								<Image source={noFiles} style={{
									marginTop: responsiveHeight(8),
									justifyContent: 'center',
									resizeMode: 'contain', height: 220, width: 220,
								}} />
								<Text style={{
									color: Color.patientSearchName,
									fontSize: CustomFont.font14,
									fontWeight: CustomFont.fontWeight500,
									fontFamily: CustomFont.fontName,
									letterSpacing: 0,
									// opacity: 0.6,
									textAlign: 'center'
								}}>There are no data for preview</Text>
							</View>

						</View>
					}

					{/* -------Save Button --------- */}

					<View style={{ backgroundColor: Color.white, flexDirection: 'row', alignItems: 'center', borderTopLeftRadius: 20, borderTopRightRadius: 20, padding: 10, justifyContent: 'center' }}>

						<ThreeDotsModal item={this.props.item} nav={{ navigation: this.props.nav.navigation }} RefreshPatient={this.RefreshPatient} />
						{this.state.PastRxDataArray && this.state.PastRxDataArray.length > 0 ?
							<TouchableOpacity onPress={() => {
								this.setCopiedData()
							}} style={{ height: responsiveHeight(6), width: responsiveWidth(78), justifyContent: 'center', alignItems: 'center', marginLeft: responsiveWidth(3), marginRight: responsiveWidth(3), backgroundColor: Color.primary, borderRadius: 5, marginTop: 7, marginBottom: 7 }}>
								<Text style={{ color: Color.white, fontSize: CustomFont.font16 }}>Save</Text>
							</TouchableOpacity>
							:
							<View style={{ height: responsiveHeight(6), width: responsiveWidth(78), justifyContent: 'center', alignItems: 'center', marginLeft: responsiveWidth(3), marginRight: responsiveWidth(3), backgroundColor: Color.disabledBtn, borderRadius: 5, marginTop: 7, marginBottom: 7 }}>
								<Text style={{ fontFamily: CustomFont.fontName, color: Color.white, fontSize: CustomFont.font14, textAlign: 'center', fontWeight: CustomFont.fontWeight600 }}>Save & Preview Rx</Text>
							</View>
						}
					</View>
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
)(PrescriptionCopyPad);
