import { Image, Modal, Pressable, ScrollView, StyleSheet, Text, TouchableOpacity, TouchableWithoutFeedback, View } from 'react-native'
import React from 'react'

const KeyringAccessoriesModal = ({isVisible,keyring,selectKeyringAccessoryHandler,toggleKeyringAccessoriesModalHandler}) => {

  return (
    <Modal
    animationType='fade'
    transparent={true}
    visible={isVisible}
    onRequestClose={toggleKeyringAccessoriesModalHandler}
    onBack
    >
      <Pressable
      style={styles.modalBackground}
      onPress={toggleKeyringAccessoriesModalHandler}
      > 
        <TouchableWithoutFeedback>
          <View style={{width:'90%',height:200,elevation:4,shadowColor:'#2d63e2',borderTopLeftRadius:16,borderTopRightRadius:16,overflow:'hidden'}}>
            <ScrollView
              contentContainerStyle={{backgroundColor:'#fff',justifyContent:'center',alignItems:'center',paddingTop:24}}
              showsVerticalScrollIndicator={false}
              >
              {keyring.keyringAccessories.slice(1).map((item) => 
                <TouchableOpacity
                  key={item.common_code}
                  onPress={() => selectKeyringAccessoryHandler(item.code_name,item.thumbnail)}
                  style={{height:64,width:'100%'}}
                >
                  <View style={{paddingHorizontal:24,justifyContent:'flex-start',alignItems:'center',flexDirection:'row'}}>
                  <Image style={{width:48,height:48,borderRadius:48,marginRight:24}} source={{uri: item.thumbnail }} />
                  <Text style={{fontSize:18,textAlign:'center'}}>{item.code_name}</Text>
                  </View>
                </TouchableOpacity>
              )}
              </ScrollView>
            </View>
          </TouchableWithoutFeedback>
      </Pressable>
    </Modal>
  )
}

export default KeyringAccessoriesModal

const styles = StyleSheet.create({
  modalBackground:{flex:1,justifyContent:'flex-end',alignItems:'center',backgroundColor:'rgba(0,0,0,0.2)'}
})