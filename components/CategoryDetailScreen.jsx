import { ActivityIndicator, Image, Modal, Pressable, ScrollView, StyleSheet, Text, useWindowDimensions, View } from 'react-native'
import React, { useLayoutEffect, useState } from 'react'
import { buttonState } from '../atom/button';
import { useRecoilState } from 'recoil';
import { useNavigation } from '@react-navigation/native';


const choiceUploadMethod = ["마이 갤러리","웹하드 등록"];

const CategoryDetailScreen = ({route}) => {
  const navigation = useNavigation(); 
  const [button, setButtonState] = useRecoilState(buttonState);
  const [selectedUploadMethod,setSelectedUploadMethod] = useState('');
  const [selectedButtonType,setSelectedButtonType] = useState('');
  const [selectedSize,setSelectedSize] = useState();
  const [selectedCount,setSelectedCount] = useState();
  const [isClickedChoiceProductCount,setIsClickedChoiceProductCount] = useState(false)
  // buttonImage: [],
  // rmat: [],
  // paperSize: [],
  // processingSize: {},
  // optionQuantity: {},
  // orderCount: [],
  // shrinkSize: [],
  // ink : [],
  // packaging: [],
  // coating: [],


  const selectUploadMethodHandler = (selectedItem) => {
    setSelectedUploadMethod(selectedItem)
  }

  const selectButtonTypeHandler = (selectedItem) => {
    setSelectedButtonType(selectedItem);
    setSelectedSize('');
  }

  const selectSizeHandler = (selectedItem) => {
    setSelectedSize(selectedItem);
  }
  const selectCountHandler = (selectedItem) => {
    setSelectedCount(selectedItem);
  } 
  const { width } = useWindowDimensions()
  useLayoutEffect(() => { 
    navigation.setOptions({
      title: route.params.title,
    })
  },[navigation,route.params])
  // console.log(button);
  return (
    <>
    <Modal
      animationType='slide'
      transparent={true}
      visible={isClickedChoiceProductCount}
      onRequestClose={() => setIsClickedChoiceProductCount(prev => !prev)}
      >
        <View style={{flex:1,justifyContent:'flex-end',alignItems:'center',backgroundColor:'rgba(0,0,0,0.2)'}}>
        <View style={{width:260,height:160}}>
        <ScrollView
          contentContainerStyle={{backgroundColor:'#fff',justifyContent:'center',alignItems:'center'}}
          showsVerticalScrollIndicator={false}
          >
        {button.optionQuantity.map((item) => 
          <Pressable
            onPress={() => setIsClickedChoiceProductCount(prev => !prev)}
            style={{flex:1}}
          >

            <Text>{item.qty}</Text>
          </Pressable>
        )}
        </ScrollView>
        </View>
      </View>    
    </Modal>

    <ScrollView contentContainerStyle={styles.container}>
      {
      button ?
      (<View style={{justifyContent:'center',alignItems:'center'}}>
      <View style={{flex:1,justifyContent:'center',alignItems:'center'}}>
        <View style={{marginVertical:24 ,borderBottomWidth:1, borderBottomColor:'#2d63e2',paddingBottom:8}}>
          <Text>디자인 업로드 방법 선택하기</Text>
        </View>
        <View style={{flexDirection:'row', justifyContent:'center',alignItems:'center'}}>
          {choiceUploadMethod.map((item) => (
            <Pressable
              key={item}
              onPress={() => selectUploadMethodHandler(item)}
              style={({pressed}) => [styles.choiceDesignButton,{opacity: pressed ? 0.78 : 1},{borderColor: selectedUploadMethod === item ? '#574cbb' : 'black' }]}>
              <Text style={{color: selectedUploadMethod === item ? '#574cbb' : 'black' }}>{item}</Text>
            </Pressable>
          ))}
          </View>

         { selectedUploadMethod &&
          <>
          <View style={{marginVertical:24 ,borderBottomWidth:1, borderBottomColor:'#2d63e2',paddingBottom:8}}>
          <Text>버튼 유형 선택</Text>
        </View>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {button.buttonImage.map((item) => (
              <Pressable
                key={item.paper_name}
                onPress={() => selectButtonTypeHandler(item.paper_name)}
                style={[styles.buttonTypeButton,{backgroundColor: selectedButtonType === item.paper_name ? '#2d63e2' :'#f6f9ff'}]}
              >
                <Image style={{width:'100%',height:128,borderTopRightRadius:16,borderTopLeftRadius:16}} source={{uri: item.filename}} />
                <Text style={{color: selectedButtonType === item.paper_name ? '#fff' :'#000',fontWeight: selectedButtonType === item.paper_name ? 'bold' : 'normal'}}>{item.paper_name}</Text>
              </Pressable>
            ))}
            
          </ScrollView>
          </>}
           {
           selectedButtonType &&
            <View style={{marginVertical:24 ,borderBottomWidth:1, borderBottomColor:'#2d63e2',paddingBottom:8}}>
              <Text>사이즈 선택</Text>
            </View>
           } 
           <View style={{flexDirection:'row'}}>
           {selectedButtonType === '핀버튼' &&
           button.paperSize.map((size) => (
            <Pressable
              key={size.size_type_code}
              style={[styles.sizeButton,selectedSize === size.size_type_code ? styles.selectedSizeButton : null]}
              onPress={() => selectSizeHandler(size.size_type_code)}
              >
              <Text style={{color:selectedSize === size.size_type_code ? '#fff' : '#000'}}>{`${size.cut_norm_x_size} X ${size.cut_norm_y_size}`}</Text>
            </Pressable>
           ))}  
           </View>

           <View style={{flexDirection:'row'}}>
           {selectedButtonType === '거울버튼' && button.paperSize.filter((size) => size.cut_norm_x_size === '58' || size.cut_norm_x_size === '75' ).map((size) => (
            <Pressable
              key={size.size_type_code}
              style={[styles.sizeButton,selectedSize === size.size_type_code ? styles.selectedSizeButton : null]}
              onPress={() => selectSizeHandler(size.size_type_code)}
              >
              <Text style={{color:selectedSize === size.size_type_code ? '#fff' : '#000'}}>{`${size.cut_norm_x_size} X ${size.cut_norm_y_size}`}</Text>
            </Pressable>
           ))}
           </View>

           <View style={{flexDirection:'row'}}>
           {selectedButtonType === '자석버튼' && button.paperSize.filter((size) => size.cut_norm_x_size === '32' || size.cut_norm_x_size === '58' ).map((size) => (
            <Pressable
              key={size.size_type_code}
              style={[styles.sizeButton,selectedSize === size.size_type_code ? styles.selectedSizeButton : null]}
              onPress={() => selectSizeHandler(size.size_type_code)}
              >
              <Text style={{color:selectedSize === size.size_type_code ? '#fff' : '#000'}}>{`${size.cut_norm_x_size} X ${size.cut_norm_y_size}`}</Text>
            </Pressable>
           ))}  
           </View>

           <View style={{flexDirection:'row'}}>
           {selectedButtonType === '오프너버튼' && button.paperSize.filter((size) => size.cut_norm_x_size === '58' ).map((size) => (
            <Pressable
              key={size.size_type_code}
              style={[styles.sizeButton,selectedSize === size.size_type_code ? styles.selectedSizeButton : null]}
              onPress={() => selectSizeHandler(size.size_type_code)}
              >
              <Text style={{color:selectedSize === size.size_type_code ? '#fff' : '#000'}}>{`${size.cut_norm_x_size} X ${size.cut_norm_y_size}`}</Text>
            </Pressable>
           ))}
           </View>


            { selectedSize &&
            <>
              <View style={{marginVertical:24 ,borderBottomWidth:1, borderBottomColor:'#2d63e2',paddingBottom:8}}>
              <Text>수량 선택</Text>
            </View>
            <Pressable
              onPress={() => setIsClickedChoiceProductCount(prev => !prev)}
              style={{borderRadius:16,borderWidth:1,borderColor:'#000',paddingVertical:2,paddingHorizontal:4}}
              >
              <Text>{ selectedCount || "수량을 선택해주세요"}</Text>
            </Pressable>
            </>
            }
            
        </View>
      </View>)
      : <ActivityIndicator />
      }
    </ScrollView>
    </>
  )
}

export default CategoryDetailScreen

const styles = StyleSheet.create({
  container: {
    minHeight:'100%',
    backgroundColor:'#fff',
    
  },
  choiceDesignButton: {
    padding:4,
    marginVertical:12,
    marginHorizontal:6,
    borderWidth:1,
  },
  buttonTypeButton: {
    width:128,
    justifyContent:'center',
    alignItems:'center',
    marginHorizontal:8,
    borderRadius:16,
    
  },
  sizeButton:{
    padding:8,borderWidth:1,marginHorizontal:4,borderRadius:4
  },
  selectedSizeButton: {
    backgroundColor:'#2d63e2',
    borderColor:'transparent'
  }
})