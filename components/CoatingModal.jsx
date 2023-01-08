import { Modal, Pressable, ScrollView, StyleSheet, Text, TouchableOpacity, TouchableWithoutFeedback, View } from 'react-native'
import React from 'react'

const CoatingModal = ({isCoatingModalVisible,setIsCoatingModalVisible,button,selectCoatingHandler}) => {

  
  return (
    <Modal
    animationType='fade'
    transparent={true}
    visible={isCoatingModalVisible}
    onRequestClose={() => setIsCoatingModalVisible(prev => !prev)}
    onBack
    >

  <Pressable
  style={styles.modalBackground}
  onPress={() => setIsCoatingModalVisible(prev => !prev)}
  >
   
    <TouchableWithoutFeedback>
      <View style={{width:'90%',elevation:4,shadowColor:'#2d63e2',borderTopLeftRadius:16,borderTopRightRadius:16,overflow:'hidden'}}>
        <ScrollView
          contentContainerStyle={{backgroundColor:'#fff',justifyContent:'center',alignItems:'center',paddingTop:24}}
          showsVerticalScrollIndicator={false}
          >
          {button.coating.map((item) => 
            <Pressable
              key={item.type_code}
              onPress={() =>selectCoatingHandler(item.type_code)}
              style={{height:64,width:'100%'}}
            >
              {item.type_code === 'COT21' && <Text style={{fontSize:18,textAlign:'center'}}>단면무광 핫코팅</Text>}
              {item.type_code === 'COT11' && <Text style={{fontSize:18,textAlign:'center'}}>단면유광 핫코팅</Text>}
            </Pressable>
          )}
          </ScrollView>
        </View>
      </TouchableWithoutFeedback>
   
    </Pressable>
  </Modal>
  )
}

export default CoatingModal

const styles = StyleSheet.create({
  modalBackground:{flex:1,justifyContent:'flex-end',alignItems:'center',backgroundColor:'rgba(0,0,0,0.2)'}
})