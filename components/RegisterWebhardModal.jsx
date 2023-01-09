import { Modal, Pressable, StyleSheet, Text, TextInput, View } from 'react-native'
import React from 'react'

const RegisterWebhardModal = ({isRegisterWebhardModalHandler,isRegisterWebhardModalVisible,inputWebhardAddressHandler,webhardAddress}) => {
  const registerWebhardHandler = () => {
    isRegisterWebhardModalHandler();
    console.log('closed');
  }
  return (
    <Modal
    animationType='fade'
    transparent={true}
    visible={isRegisterWebhardModalVisible}
    onRequestClose={isRegisterWebhardModalHandler}
    >
      <View style={{flex:1,backgroundColor:'rgba(0,0,0,0.2)',justifyContent:'center',alignItems:'center'}}>
        <View style={{width:'80%',justifyContent:'center',alignItems:'center',backgroundColor:'#fff',padding:16,elevation:4,borderRadius:16}}>
          <TextInput
            value={webhardAddress}
            onChangeText={(text) =>inputWebhardAddressHandler(text)}
            style={{height:53,borderBottomWidth:1,borderBottomColor:'#2d63e2'}}
            placeholder="웹하드 주소를 입력해주세요."
            keyboardType='url'
            clearButtonMode='always'
            cursorColor="#2d63e2"

          />
          <View style={{flexDirection:'row',width:'100%',justifyContent:'space-between',paddingHorizontal:24,marginVertical:16}}>
            <Pressable
            onPress={registerWebhardHandler}
            style={{borderWidth:1,borderColor:'#2d63e2',paddingHorizontal:8,paddingVertical:4,borderRadius:8}}>
              <Text style={{color:'#2d63e2'}}>등록</Text>
            </Pressable>
            <Pressable
            onPress={isRegisterWebhardModalHandler}
            style={{borderWidth:1,borderColor:'#f41',paddingHorizontal:8,paddingVertical:4,borderRadius:8}}>
              <Text style={{color:'#f41'}}>닫기</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  )
}

export default RegisterWebhardModal

const styles = StyleSheet.create({})