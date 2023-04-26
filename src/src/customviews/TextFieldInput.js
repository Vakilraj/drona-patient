import React from 'react'
import Color from '../components/Colors';
import { View, Text, TextInput, TouchableOpacity, Image } from 'react-native';
import CustomFont from '../components/CustomFont';
import { responsiveHeight, responsiveFontSize, responsiveWidth } from 'react-native-responsive-dimensions';
import error from '../../assets/error.png';
import calendar from '../../assets/calendar_blue2.png';
import search from '../../assets/ic_search.png';
import ic_down from '../../assets/ic_down1.png';
import remove_promo from '../../assets/remove_promo1.png';
import ic_delete_promo from '../../assets/ic_delete_promo.png';

import styles from './style';
// import Language from '../utils/Language.js'
export default function TextFieldInput(props) {

    return (
        <View style={props.style}>
            {props.labelName ? <Text style={styles.tfiHeading}>{props.labelName} {props.isStarNeed != 0 ? <Text style={{ color: Color.red }}>*</Text> : ''}</Text> : null}

            <TouchableOpacity style={props.isBorder ? styles.mainViewTFIBorder : styles.mainViewTFI} onPress={props.onPressCal}>
                {props.isSearch ? <Image source={search} style={styles.tfiIconLeft} /> : null}
                {props.isPromo ? <Image source={remove_promo} style={styles.tfiIconLeft} /> : null}
                <TextInput value={props.value} autoFocus={false} maxLength={props.maxLength}
                    editable={props.editable ? props.editable : true}
                    returnKeyType={props.returnKeyType ? props.returnKeyType : 'done'} textContentType="oneTimeCode" keyboardType={props.keyboardType}
                    placeholder={props.placeholder}
                    placeholderTextColor={Color.lightgray}
                    onChangeText={props.onChangeText}
                    onFocus={props.onFocus}
                    onBlur={props.onBlur}
                    style={[styles.tfiTI, { paddingStart: props.isSearch ? 12 : 16, }]} />
                {props.isDropdown ? <Image source={ic_down} style={styles.tfiIcon} /> : null}
                {props.isAlert && !props.isDate ? <Image source={error} style={styles.tfiIcon} /> : null}
                {props.isDate ? <Image source={calendar} style={styles.tfiIcon} /> : null}
                {
                    props.isPromo ?
                        <TouchableOpacity style={{flexDirection:'row',alignItems:'center'}} onPress={props.onRemovePromo}>
                           <Image source={ic_delete_promo} style={styles.tfiIcon} /> 
                           <Text style={{ color:"#D44747",fontSize:CustomFont.font12,fontFamily:CustomFont.fontNameBold,marginEnd:16}}>Remove</Text>
                        </TouchableOpacity> : null
                }
                {/* {props.isDate ? null : null} */}
            </TouchableOpacity>

            {/* {!props.isExample ? null : <Text style={[styles.tfiAlert, { color: Color.lightgray }]}>{Language.language.example}. 7259098765</Text>}
            {props.isAlert ? <Text style={styles.tfiAlert}>{props.alertMsg ? props.alertMsg : Language.language.enterFieldWarning}</Text> : null} */}
        </View>
    )
}
