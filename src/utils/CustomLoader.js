import React, { useState } from 'react';
import {
	View, Linking,
	Text, Image, TouchableOpacity, ScrollView, Modal, Dimensions, SafeAreaView, Card, TextInput, FlatList
} from 'react-native';
import { responsiveFontSize, responsiveHeight, responsiveWidth } from 'react-native-responsive-dimensions';
import Color from '../components/Colors';
import community from '../../assets/community-loader.png';

export default class NeewsFeed extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
		};

	}



	render() {
		return (
			<View style={{ flex: 1, backgroundColor: Color.bgColor }}>


				<View style={{ flex: 1, flexDirection: 'column', }}>
					<View style={{ flexDirection: 'column', backgroundColor: Color.white, margin: responsiveWidth(4),
						padding: responsiveWidth(3), borderRadius: responsiveWidth(3)
					}}>
						<View style={{ flexDirection: 'row', alignItems: 'center' }}>
							<Image source={community} style={{ height: responsiveFontSize(2), width: responsiveFontSize(2), borderRadius: responsiveFontSize(1) }} />
							<Text style={{
								marginLeft: responsiveWidth(2),
								backgroundColor: Color.community_loader, width: responsiveWidth(25),
								height: responsiveWidth(2), borderRadius: responsiveWidth(3)
							}}></Text>
						</View>
						<View style={{ flexDirection: 'column' }}>
							<Text style={{
								marginBottom: responsiveHeight(2), marginTop: responsiveHeight(2),
								backgroundColor: Color.community_loader, width: responsiveWidth(50),
								height: responsiveWidth(2.5), borderRadius: responsiveWidth(3)
							}}></Text>
						</View>
						<View style={{ flexDirection: 'column' }}>
							<Text style={{
								backgroundColor: Color.community_loader, width: responsiveWidth(85),
								height: responsiveWidth(2), borderRadius: responsiveWidth(3)
							}}></Text>
						</View>
					</View>

					<View style={{ flexDirection: 'column', backgroundColor: Color.white, margin: responsiveWidth(4),
						padding: responsiveWidth(3), borderRadius: responsiveWidth(3)
					}}>
						<View style={{ flexDirection: 'row', alignItems: 'center' }}>
							<Image source={community} style={{ height: responsiveFontSize(2), width: responsiveFontSize(2), borderRadius: responsiveFontSize(1) }} />
							<Text style={{
								marginLeft: responsiveWidth(2),
								backgroundColor: Color.community_loader, width: responsiveWidth(25),
								height: responsiveWidth(2), borderRadius: responsiveWidth(3)
							}}></Text>
						</View>
						<View style={{ flexDirection: 'column' }}>
							<Text style={{
								marginBottom: responsiveHeight(2), marginTop: responsiveHeight(2),
								backgroundColor: Color.community_loader, width: responsiveWidth(50),
								height: responsiveWidth(2.5), borderRadius: responsiveWidth(3)
							}}></Text>
						</View>
						<View style={{ flexDirection: 'column' }}>
							<Text style={{
								backgroundColor: Color.community_loader, width: responsiveWidth(85),
								height: responsiveWidth(2), borderRadius: responsiveWidth(3)
							}}></Text>
						</View>
					</View>

					<View style={{ flexDirection: 'column', backgroundColor: Color.white, margin: responsiveWidth(4),
						padding: responsiveWidth(3), borderRadius: responsiveWidth(3) }}>
						<View style={{ flexDirection: 'row', alignItems: 'center' }}>
							<Image source={community} style={{ height: responsiveFontSize(2), width: responsiveFontSize(2), borderRadius: responsiveFontSize(1) }} />
							<Text style={{
								marginLeft: responsiveWidth(2),
								backgroundColor: Color.community_loader, width: responsiveWidth(25),
								height: responsiveWidth(2), borderRadius: responsiveWidth(3)
							}}></Text>
						</View>
						<View style={{ flexDirection: 'column' }}>
							<Text style={{
								marginBottom: responsiveHeight(2), marginTop: responsiveHeight(2),
								backgroundColor: Color.community_loader, width: responsiveWidth(50),
								height: responsiveWidth(2.5), borderRadius: responsiveWidth(3)
							}}></Text>
						</View>
						<View style={{ flexDirection: 'column' }}>
							<Text style={{
								backgroundColor: Color.community_loader, width: responsiveWidth(85),
								height: responsiveWidth(2), borderRadius: responsiveWidth(3)
							}}></Text>
						</View>
					</View>

					<View style={{ flexDirection: 'column', backgroundColor: Color.white, margin: responsiveWidth(4),
						padding: responsiveWidth(3), borderRadius: responsiveWidth(3) }}>
						<View style={{ flexDirection: 'row', alignItems: 'center' }}>
							<Image source={community} style={{ height: responsiveFontSize(2), width: responsiveFontSize(2), borderRadius: responsiveFontSize(1) }} />
							<Text style={{
								marginLeft: responsiveWidth(2),
								backgroundColor: Color.community_loader, width: responsiveWidth(25),
								height: responsiveWidth(2), borderRadius: responsiveWidth(3)
							}}></Text>
						</View>
						<View style={{ flexDirection: 'column' }}>
							<Text style={{
								marginBottom: responsiveHeight(2), marginTop: responsiveHeight(2),
								backgroundColor: Color.community_loader, width: responsiveWidth(50),
								height: responsiveWidth(2.5), borderRadius: responsiveWidth(3)
							}}></Text>
						</View>
						<View style={{ flexDirection: 'column' }}>
							<Text style={{
								backgroundColor: Color.community_loader, width: responsiveWidth(85),
								height: responsiveWidth(2), borderRadius: responsiveWidth(3)
							}}></Text>
						</View>
					</View>

				</View>
			</View>
		);
	}
}