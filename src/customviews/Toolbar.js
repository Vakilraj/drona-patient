import React, { Component } from 'react';
import {
    View,
    Text,
    Image,
    TouchableOpacity,
    Platform
} from 'react-native';
import Color from '../components/Colors';
import CustomFont from '../components/CustomFont';
import { responsiveHeight, responsiveFontSize, responsiveWidth } from 'react-native-responsive-dimensions';
import arrowBack from '../../assets/back_blue.png';
import ic_menu from '../../assets/ic_menu.png';
import notification from '../../assets/ic_notification.png';
import savedPost from '../../assets/savedPost.png';
import closeIconWhite from '../../assets/cross_white.png';
import Download from '../../assets/download.png';
import PlusIcon from '../../assets/plus_new.png';
import styles from './style';


const Toolbar = (props) => {
    return (
        <View>
            <View style={styles.mainView}>
                {
                    props.isNoBack ? null :
                        <TouchableOpacity style={{ marginLeft: responsiveWidth(2.1),flexDirection:'row',alignItems:'center' }} onPress={props.onBackPress}>
                            <Image source={arrowBack} style={styles.icon} />
                            <Text style={[styles.title, { marginLeft: props.isSideMenu ? responsiveWidth(4) : props.isNoBack ? responsiveWidth(2.1) : 20, }]}>{props.title}</Text>
                        </TouchableOpacity>
                }
                
                {
                    !props.isClose ? null :
                        <View style={{ paddingRight: 0, flex: 1, alignItems: 'flex-end' }}>
                            <TouchableOpacity onPress={props.onClose} style={{ justifyContent: 'center', height: 50, width: 50, alignItems: 'center' }}>
                                <Image source={closeIconWhite} style={{ marginLeft: 2, marginTop: 3, height: responsiveWidth(4), width: responsiveWidth(4), tintColor: Color.primary }} />
                            </TouchableOpacity>
                        </View>
                }
                {
                    !props.isOpenSavePost ? null :
                        <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-end' }}>
                            <TouchableOpacity onPress={props.onOpenSavePost}>
                                <Image style={[styles.icon, { marginEnd: 16 }]} source={savedPost} />
                            </TouchableOpacity>
                        </View>
                }
                {!props.isDownload ? null : <TouchableOpacity onPress={props.download}>
                    <Image style={{ height: 20, width: 20, marginEnd: 10, tintColor: Color.primary }} source={Download} />
                </TouchableOpacity>}
                {!props.isNotification ? null : <TouchableOpacity onPress={props.onNotification}>
                    <Image style={{height: responsiveFontSize(2.6), width: responsiveFontSize(2.6), marginEnd: 16 }} source={notification} />
                </TouchableOpacity>}
                {!props.isReset ? null : <TouchableOpacity onPress={props.onReset}>
                    <Text style = {{marginRight : responsiveWidth(4), color  : Color.primary , fontWeight : CustomFont.fontWeight700, fontFamily : CustomFont.fontName, fontSize : CustomFont.font14}}>Reset</Text>
                </TouchableOpacity>}

                {!props.isQrReset ? null : <TouchableOpacity onPress={props.onResetQrCode}>
                    <Text style = {{marginRight : responsiveWidth(4), color  : Color.primary , fontWeight : CustomFont.fontWeight700, fontFamily : CustomFont.fontName, fontSize : CustomFont.font14}}>Reset Code</Text>
                </TouchableOpacity>}

                {!props.isGraphAdd ? null : <TouchableOpacity onPress={props.onAddGraph}>
                   <Image style = {{marginRight  :responsiveWidth(4), resizeMode : 'contain', height  : responsiveHeight(3), width  :responsiveWidth(6)}} source = {PlusIcon}/>
                </TouchableOpacity>}
            </View>
            <View style={{ height: 1, backgroundColor: Color.bgColor }} />
        </View>
    )
}
export default Toolbar