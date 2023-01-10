import { Modal, Pressable, ScrollView, StyleSheet, Text, TouchableOpacity, TouchableWithoutFeedback, View } from 'react-native'
import React from 'react'

const KeyringQuantityModal = ({isVisible,keyring,selectKeyringQuantityHandler,toggleKeyringQuantityModalHandler}) => {

  return (
    <Modal
    animationType='fade'
    transparent={true}
    visible={isVisible}
    onRequestClose={toggleKeyringQuantityModalHandler}
    onBack
    >
      <Pressable
      style={styles.modalBackground}
      onPress={toggleKeyringQuantityModalHandler}
      > 
        <TouchableWithoutFeedback>
          <View style={{width:'90%',height:200,elevation:4,shadowColor:'#2d63e2',borderTopLeftRadius:16,borderTopRightRadius:16,overflow:'hidden'}}>
            <ScrollView
              contentContainerStyle={{backgroundColor:'#fff',justifyContent:'center',alignItems:'center',paddingTop:24}}
              showsVerticalScrollIndicator={false}
              >
              {keyring.keyringQuantity.map((item) => 
                <Pressable
                  key={item.qty}
                  onPress={() => selectKeyringQuantityHandler(item.qty)}
                  style={{height:64,width:'100%'}}
                >
                  <Text style={{fontSize:18,textAlign:'center'}}>{item.qty}</Text>
                </Pressable>
              )}
              </ScrollView>
            </View>
          </TouchableWithoutFeedback>
      </Pressable>
    </Modal>
  )
}

export default KeyringQuantityModal

const styles = StyleSheet.create({
  modalBackground:{flex:1,justifyContent:'flex-end',alignItems:'center',backgroundColor:'rgba(0,0,0,0.2)'}
})