import { ActivityIndicator, Image, ImageBackground, Modal, Pressable, ScrollView, StyleSheet, Text, useWindowDimensions, View } from 'react-native'
import React, { useCallback, useLayoutEffect, useState } from 'react'

import { buttonState } from '../atom/button';
import { useRecoilState } from 'recoil';
import { useNavigation } from '@react-navigation/native';
import QuantityModal from './QuantityModal';
import CoatingModal from './CoatingModal';
import { Camera } from 'expo-camera';
import { pictureState } from '../atom/picture';
import axios from 'axios';
import { removebgPictureState } from '../atom/removebgPicture';
import Progressbar from './Progressbar';


const choiceUploadMethod = ["마이 갤러리","웹하드 등록","카메라로 사진찍기"];

const CategoryDetailScreen = ({route}) => {
  const navigation = useNavigation();
  const { width } = useWindowDimensions()
  const [button, setButtonState] = useRecoilState(buttonState);
  const [selectedUploadMethod,setSelectedUploadMethod] = useState('');
  const [selectedButtonType,setSelectedButtonType] = useState('');
  const [selectedSize,setSelectedSize] = useState();
  const [selectedCount,setSelectedCount] = useState();
  const [isClickedChoiceProductCount,setIsClickedChoiceProductCount] = useState(false)
  const [selectedCoating,setSelectedCoating] = useState();
  const [isCoatingModalVisible,setisCoatingModalVisible] = useState(false);
  const [permissionStatus,setPermissionStatus] = useState(false);
  const [picture,setPicture] = useRecoilState(pictureState);
  const [removebgPicture,setRemovebgPicture] = useRecoilState(removebgPictureState);
  const [nowStep,setNowStep] = useState(0);
  const [totalStep,setTotalstep] = useState(0);
  // pending,fulfilled,loading
  const [removebgStatus,setRemovebgStatus] = useState('pending')
  const getGrantCameraPermissionHandler = async () => {
    try {
      const { status } = await Camera.requestCameraPermissionsAsync(); 
      if(status === 'granted'){
        setPermissionStatus(true);
        navigation.navigate('CameraScreen');
      }else{
        Alert.alert("카메라 접근 허용은 필수입니다.")
      } 
    } catch (error) {
      console.error(error.response.data);
    }
  }

  const selectUploadMethodHandler = useCallback((selectedItem) => {
    setSelectedUploadMethod(selectedItem)
  },[])

  const selectButtonTypeHandler = useCallback((selectedItem) => {
    setSelectedButtonType(selectedItem);
    setSelectedSize('');
    setSelectedCount('');
    setSelectedCoating('');
  },[])

  const selectSizeHandler = useCallback((selectedItem) => {
    setSelectedSize(selectedItem);
  },[])
  
  const selectQuantityHandler = useCallback((selectedItem) => {
    setIsClickedChoiceProductCount(prev => !prev)
    setSelectedCount(selectedItem);
  },[])

  const selectCoatingHandler = useCallback((slectedItem) => {
    setisCoatingModalVisible(prev => !prev)
    setSelectedCoating(slectedItem)
  },[])
  
  const removeBackgroundHandler = () => {
    
    try {
      // removal.ai
    const formData = new FormData()
    formData.append('image_url',picture.base64);
      const xhr = new XMLHttpRequest();
      xhr.withCredentials = true; 
      xhr.addEventListener("readystatechange",function() {
        if(this.readyState === 4) {
          console.log(this.responseText);
          setRemovebgPicture(JSON.parse(this.responseText));
        }
      })
      xhr.onprogress = (e) => {
        console.log(`Downloaded ${e.loaded} of ${e.total} bytes`)
        setRemovebgStatus('fulfilled')
      }
      xhr.upload.onload = () => {
        console.log(`upload is completed: ${xhr.status} ${xhr.response}`)
      }
      xhr.upload.onprogress = (e) => {
        console.log(`uploaded ${e.loaded} of ${e.total}`);
        setRemovebgStatus('loading');
        setNowStep(e.loaded);
        setTotalstep(e.total);
      }
      xhr.upload.onloadend = (e) => {
        console.log(`업로드 완료 후 파일을 다운로드 중입니다`); 
      }
      xhr.open("POST","https://api.removal.ai/3.0/remove");
      xhr.setRequestHeader("Rm-token","63baa122cab1e9.57184986")
      xhr.send(formData);


    } catch (error) {
      console.error(error.response.data);
    }
  }
  console.log(picture.base64)
  useLayoutEffect(() => { 
    navigation.setOptions({
      title: route.params.title,
    })
  },[navigation,route.params])
  // console.log(picture.base64 || '없음');
  // console.log(removebgPicture || '리무브비지없음');
  // console.log(picture || '픽쳐없음')
  // console.log(removebgPicture);
  return (
    <>

    <QuantityModal
      button={button} 
      isClickedChoiceProductCount={isClickedChoiceProductCount} 
      setIsClickedChoiceProductCount={setIsClickedChoiceProductCount}
      selectQuantityHandler={selectQuantityHandler}
      />
    <CoatingModal
      button={button}
      isCoatingModalVisible={isCoatingModalVisible}
      selectCoatingHandler={selectCoatingHandler}
      setIsCoatingModalVisible={setIsClickedChoiceProductCount}
    />


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
              style={({pressed}) => [styles.selectedButton,{borderColor: selectedCount ? '#2d63e2' :'#000'}]}
              >
              <Text style={[{textAlign:'center',color: selectedCount ? '#2d63e2' :'#000'}]}>{ selectedCount ? `${selectedCount}개` : "수량을 선택해주세요"}</Text>
            </Pressable>
            </>
            }
            {
              selectedCount &&
              <>
                <View style={{marginVertical:24 ,borderBottomWidth:1, borderBottomColor:'#2d63e2',paddingBottom:8}}>
                  <Text>코팅 선택</Text>
                </View>
                <Pressable
                  onPress={() => setisCoatingModalVisible(prev => !prev)}
                  style={[styles.selectedButton,{borderColor: selectedCoating ? '#2d63e2' :'#000'}]}
                  >
                  <Text style={[{textAlign:'center',color: selectedCoating ? '#2d63e2' :'#000'}]}>
                    { selectedCoating === 'COT21'
                    ? '단면무광 핫코팅'
                    : selectedCoating === 'COT11'
                    ? '단면유광 핫코팅'
                    : "코팅을 선택해주세요"}
                  </Text>
                </Pressable>
              </>
            }

            {(picture && removebgStatus !== 'fulfilled') && (
              <View style={{marginTop:40,justifyContent:'center',alignItems:'center'}}>
            <ImageBackground
              style={{width:200,height:200}}
              imageStyle={{width:200,height:200, borderRadius:200}} source={{uri: picture.uri}}
              />
              <Progressbar nowStep={nowStep} totalStep={totalStep} removebgStatus={removebgStatus} />

              <Pressable
                onPress={removeBackgroundHandler}
                style={{height:50,minWidth:160,marginTop:24,borderWidth:1,borderColor:'#2d63e2',justifyContent:'center',alignItems:'center',paddingHorizontal:24}}
                disabled={removebgStatus !== 'pending'}
              >
                
                {removebgStatus === 'pending' && <Text style={{color:'#2d63e2'}}>배경 제거하기</Text>}
                {removebgStatus === 'loading' && <ActivityIndicator color="#2d63e2" />}
                
              </Pressable>
              </View>
            )}
            {(removebgPicture && removebgStatus === 'fulfilled') && (
              <View style={{marginTop:40,justifyContent:'center',alignItems:'center'}}>
              <ImageBackground
                style={{width:200,height:200}}
                imageStyle={{width:200,height:200, borderRadius:200}} source={{uri: removebgPicture.preview}}
              />
              <Pressable
                onPress={() => {}}
                style={{height:50,minWidth:160,marginTop:24,borderWidth:1,borderColor:'#2d63e2',justifyContent:'center',alignItems:'center',paddingHorizontal:24}} 
              >
                <Text style={{color:'#2d63e2'}}>편집된 사진 확인하러 가기</Text>
              </Pressable>
              </View>
            )} 



            {
            (selectedCoating && selectedUploadMethod === '마이 갤러리')
            &&  <Pressable
                  onPress={() => {}}
                  style={({pressed}) => [{marginTop:40, height:60,width,justifyContent:'center',alignItems:'center',backgroundColor: pressed? '#6087e2' : '#2d63e2'}]}
                  >
                  <Text style={{color:'#fff',fontSize:24}}>사진 선택하러 가기</Text>
                </Pressable>
            }
            {
            (selectedCoating && selectedUploadMethod === '웹하드 등록')
            &&  <Pressable
                  onPress={() => {}}
                  style={({pressed}) => [{marginTop:40, height:60,width,justifyContent:'center',alignItems:'center',backgroundColor: pressed? '#6087e2' : '#2d63e2'}]}
                  >
                  <Text style={{color:'#fff',fontSize:24}}>웹하드로 이동</Text>
                </Pressable>
            }
            {
            (selectedCoating && selectedUploadMethod === '카메라로 사진찍기')
            &&  <Pressable
                  onPress={getGrantCameraPermissionHandler}
                  style={({pressed}) => [{marginTop:40, height:60,width,justifyContent:'center',alignItems:'center',backgroundColor: pressed? '#6087e2' : '#2d63e2'}]}
                  >
                  <Text style={{color:'#fff',fontSize:24}}>카메라 켜기</Text>
                </Pressable>
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
  },
  selectedButton: {borderRadius:16,borderWidth:1,paddingVertical:2,paddingHorizontal:4,width:124}
})