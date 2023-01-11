import {ActivityIndicator,Alert,Image,ImageBackground,Modal,Pressable,ScrollView,StyleSheet,Text,TouchableOpacity,useWindowDimensions,View} from 'react-native';
import React, { useCallback, useLayoutEffect, useState } from 'react';

import { buttonState } from '../atom/button';
import { useRecoilState } from 'recoil';
import { useNavigation } from '@react-navigation/native';
import QuantityModal from './QuantityModal';
import CoatingModal from './CoatingModal';
import { Camera } from 'expo-camera';
import { pictureState } from '../atom/picture';
import { removebgPictureState } from '../atom/removebgPicture';
import Progressbar from './Progressbar';
import * as ImagePicker from 'expo-image-picker';
import RegisterWebhardModal from './RegisterWebhardModal';
import { keyringState } from '../atom/keyring';
import KeyringQuantityModal from './KeyringQuantityModal';
import KeyringAccessoriesModal from './KeyringAccessoriesModal';

const choiceUploadMethod = ['마이 갤러리', '웹하드 등록', '카메라로 사진찍기'];

const CategoryDetailScreen = ({ route }) => {
  const navigation = useNavigation();
  const { width } = useWindowDimensions();
  const [button, setButtonState] = useRecoilState(buttonState);
  const [keyring, setKeyring] = useRecoilState(keyringState);
  const [removebgPicture, setRemovebgPicture] = useRecoilState(removebgPictureState);
  const [picture, setPicture] = useRecoilState(pictureState);
  const [selectedUploadMethod, setSelectedUploadMethod] = useState('');
  const [selectedButtonType, setSelectedButtonType] = useState('');
  const [selectedSize, setSelectedSize] = useState();
  const [selectedCount, setSelectedCount] = useState();
  const [selectedCoating, setSelectedCoating] = useState();
  const [permissionStatus, setPermissionStatus] = useState(false);
  const [removebgStatus, setRemovebgStatus] = useState('pending'); // pending,fulfilled,loading
  const [mediaLibraryPermissionStatus, setMediaLibraryPermissionStatus] = ImagePicker.useMediaLibraryPermissions();
  const [keyringType,setKeyringType] = useState();
  const [keyringQuantity,setKeyringQuantity] = useState();
  const [nowStep, setNowStep] = useState(0);
  const [totalStep, setTotalstep] = useState(0);
  const [webhardAddress, setWebhardAddress] = useState('');
  const [keyringBackface,setKeyringBackface] = useState('');
  const [keyringAccessory,setKeyringAccessory] = useState({title:'',imageURL:''});
  const [isRegisterWebhardModalVisible, setIsRegisterWebhardModalVisible] = useState(false);
  const [isClickedChoiceProductCount, setIsClickedChoiceProductCount] = useState(false);
  const [isCoatingModalVisible, setisCoatingModalVisible] = useState(false);
  const [isKeyringQuantityModalVisible,setIsKeyringQuantityModalVisible] = useState(false);
  const [isKeyringAccessoriesModalVisible,setIsKeyringAccessoriesModalVisible] = useState(false);


  const toggleKeyringAccessoriesModalHandler = () => {
    setIsKeyringAccessoriesModalVisible(prev => !prev)
  }

  const selectKeyringAccessoryHandler = (title,image) => {
    setIsKeyringAccessoriesModalVisible(false);
    setKeyringAccessory(() => ({
      title:title,
      imageURL:image
    }))
  }

  const selectKeyringQuantityHandler = (selectedquantity) => {
    setKeyringQuantity(selectedquantity);
    setIsKeyringQuantityModalVisible(false);
  }
  const toggleKeyringQuantityModalHandler = () => {
    setIsKeyringQuantityModalVisible(prev => !prev)
  }
  const selectKeyringTypeHandler = (selectedType) => {
    setKeyringType(selectedType);
  }
  const selectKeyringBackfaceHandler = (selectedBackface) => {
    setKeyringBackface(selectedBackface);
  }
  const inputWebhardAddressHandler = useCallback((text) => {
    setWebhardAddress(text);
    console.log(text);
  }, []);

  const initialzingInfomationAboutImage = useCallback(() => {
    setRemovebgStatus('pending');
    setRemovebgPicture('');
    setPicture('');
    setNowStep(0);
    setTotalstep(0);
  }, []);

  const openCameraHandler = async () => {
    initialzingInfomationAboutImage();
    try {
      const { status } = await Camera.requestCameraPermissionsAsync();
      if (status === 'granted') {
        setPermissionStatus(true);
        navigation.navigate('CameraScreen',{
          title: route.params.title
        });
      } else {
        Alert.alert('카메라 접근 허용은 필수입니다.');
      }
    } catch (error) {
      console.error(error.response.data);
    }
  };

  const selectUploadMethodHandler = useCallback((selectedItem) => {
    setSelectedUploadMethod(selectedItem);
    setPicture('');
    setRemovebgPicture('');
  }, []);

  const selectButtonTypeHandler = useCallback((selectedItem) => {
    setSelectedButtonType(selectedItem);
    setSelectedSize('');
    setSelectedCount('');
    setSelectedCoating('');
  }, []);

  const selectSizeHandler = useCallback((selectedItem) => {
    setSelectedSize(selectedItem);
  }, []);

  const selectQuantityHandler = useCallback((selectedItem) => {
    setIsClickedChoiceProductCount((prev) => !prev);
    setSelectedCount(selectedItem);
  }, []);

  const selectCoatingHandler = useCallback((slectedItem) => {
    setisCoatingModalVisible((prev) => !prev);
    setSelectedCoating(slectedItem);
  }, []);
  // console.log(keyring);
  
  const pickGalleryImageHandler = async () => {
    initialzingInfomationAboutImage();
    if (!mediaLibraryPermissionStatus.granted) {
      const permission = await setMediaLibraryPermissionStatus();
      if (!permission.granted) {
        return Alert.alert('갤러리 접근권한 허용은 필수입니다.');
      }
    }
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      base64: true,
      aspect: [1, 1],
      quality: 1,
    });
    console.log(result.assets);
    if (!result.canceled) {
      setPicture(result.assets[0]);
    }
  };

  const saveRemoveBgPictureHandler = async () => {
    const { status } = await MediaLibrary.requestPermissionsAsync();
    if (status === 'granted') {
      await MediaLibrary.saveToLibraryAsync(removebgPicture.uri);
    }
  };

  const isRegisterWebhardModalHandler = () => {
    setIsRegisterWebhardModalVisible((prev) => !prev);
  };

  const removeBackgroundHandler = () => {
    try {
      // removal.ai
      const formData = new FormData();
      formData.append('image_url', picture.base64);
      const xhr = new XMLHttpRequest();
      xhr.withCredentials = true;
      xhr.addEventListener('readystatechange', function () {
        if (this.readyState === 4) {
          console.log(this.responseText);
          setRemovebgPicture(JSON.parse(this.responseText));
        }
      });
      xhr.onprogress = (e) => {
        console.log(`Downloaded ${e.loaded} of ${e.total} bytes`);
        setRemovebgStatus('fulfilled');
      };
      xhr.upload.onload = () => {
        console.log(`upload is completed: ${xhr.status} ${xhr.response}`);
      };
      xhr.upload.onprogress = (e) => {
        console.log(`uploaded ${e.loaded} of ${e.total}`);
        setRemovebgStatus('loading');
        setNowStep(e.loaded);
        setTotalstep(e.total);
      };
      xhr.upload.onloadend = (e) => {
        console.log(`업로드 완료 후 파일을 다운로드 중입니다`);
      };
      xhr.open('POST', 'https://api.removal.ai/3.0/remove');
      xhr.setRequestHeader('Rm-token', '63baa122cab1e9.57184986');
      xhr.send(formData);
    } catch (error) {
      console.error(error.response.data);
    }
  };
  useLayoutEffect(() => {
    navigation.setOptions({
      title: route.params.title,
    });
  }, [navigation, route.params]);
  if (route.params.title === '버튼') {
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
        <RegisterWebhardModal
          isRegisterWebhardModalHandler={isRegisterWebhardModalHandler}
          isRegisterWebhardModalVisible={isRegisterWebhardModalVisible}
          inputWebhardAddressHandler={inputWebhardAddressHandler}
          webhardAddress={webhardAddress}
        />
        <ScrollView contentContainerStyle={styles.container}>
          {button ? (
            <View style={{ justifyContent: 'center', alignItems: 'center' }}>
              <View
                style={{
                  flex: 1,
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
              >
                <View
                  style={{
                    marginVertical: 24,
                    borderBottomWidth: 1,
                    borderBottomColor: '#2d63e2',
                    paddingBottom: 8,
                  }}
                >
                  <Text>디자인 업로드 방법 선택하기</Text>
                </View>
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}
                >
                  {choiceUploadMethod.map((item) => (
                    <Pressable
                      key={item}
                      onPress={() => selectUploadMethodHandler(item)}
                      style={({ pressed }) => [
                        styles.choiceDesignButton,
                        { opacity: pressed ? 0.78 : 1 },
                        {
                          borderColor:
                            selectedUploadMethod === item ? '#574cbb' : 'black',
                        },
                      ]}
                    >
                      <Text
                        style={{
                          color:
                            selectedUploadMethod === item ? '#574cbb' : 'black',
                        }}
                      >
                        {item}
                      </Text>
                    </Pressable>
                  ))}
                </View>

                {selectedUploadMethod && (
                  <>
                    <View
                      style={{
                        marginVertical: 24,
                        borderBottomWidth: 1,
                        borderBottomColor: '#2d63e2',
                        paddingBottom: 8,
                      }}
                    >
                      <Text>버튼 유형 선택</Text>
                    </View>
                    <ScrollView
                      horizontal
                      showsHorizontalScrollIndicator={false}
                    >
                      {button.buttonImage.map((item) => (
                        <Pressable
                          key={item.paper_name}
                          onPress={() =>
                            selectButtonTypeHandler(item.paper_name)
                          }
                          style={[
                            styles.buttonTypeButton,
                            {
                              backgroundColor:
                                selectedButtonType === item.paper_name
                                  ? '#2d63e2'
                                  : '#f6f9ff',
                            },
                          ]}
                        >
                          <Image
                            style={{
                              width: '100%',
                              height: 128,
                              borderTopRightRadius: 16,
                              borderTopLeftRadius: 16,
                            }}
                            source={{ uri: item.filename }}
                          />
                          <Text
                            style={{
                              color:
                                selectedButtonType === item.paper_name
                                  ? '#fff'
                                  : '#000',
                              fontWeight:
                                selectedButtonType === item.paper_name
                                  ? 'bold'
                                  : 'normal',
                            }}
                          >
                            {item.paper_name}
                          </Text>
                        </Pressable>
                      ))}
                    </ScrollView>
                  </>
                )}
                {selectedButtonType && (
                  <View
                    style={{
                      marginVertical: 24,
                      borderBottomWidth: 1,
                      borderBottomColor: '#2d63e2',
                      paddingBottom: 8,
                    }}
                  >
                    <Text>사이즈 선택</Text>
                  </View>
                )}
                <View style={{ flexDirection: 'row' }}>
                  {selectedButtonType === '핀버튼' &&
                    button.paperSize.map((size) => (
                      <Pressable
                        key={size.size_type_code}
                        style={[
                          styles.sizeButton,
                          selectedSize === size.size_type_code
                            ? styles.selectedSizeButton
                            : null,
                        ]}
                        onPress={() => selectSizeHandler(size.size_type_code)}
                      >
                        <Text
                          style={{
                            color:
                              selectedSize === size.size_type_code
                                ? '#fff'
                                : '#000',
                          }}
                        >{`${size.cut_norm_x_size} X ${size.cut_norm_y_size}`}</Text>
                      </Pressable>
                    ))}
                </View>

                <View style={{ flexDirection: 'row' }}>
                  {selectedButtonType === '거울버튼' &&
                    button.paperSize
                      .filter(
                        (size) =>
                          size.cut_norm_x_size === '58' ||
                          size.cut_norm_x_size === '75'
                      )
                      .map((size) => (
                        <Pressable
                          key={size.size_type_code}
                          style={[
                            styles.sizeButton,
                            selectedSize === size.size_type_code
                              ? styles.selectedSizeButton
                              : null,
                          ]}
                          onPress={() => selectSizeHandler(size.size_type_code)}
                        >
                          <Text
                            style={{
                              color:
                                selectedSize === size.size_type_code
                                  ? '#fff'
                                  : '#000',
                            }}
                          >{`${size.cut_norm_x_size} X ${size.cut_norm_y_size}`}</Text>
                        </Pressable>
                      ))}
                </View>

                <View style={{ flexDirection: 'row' }}>
                  {selectedButtonType === '자석버튼' &&
                    button.paperSize
                      .filter(
                        (size) =>
                          size.cut_norm_x_size === '32' ||
                          size.cut_norm_x_size === '58'
                      )
                      .map((size) => (
                        <Pressable
                          key={size.size_type_code}
                          style={[
                            styles.sizeButton,
                            selectedSize === size.size_type_code
                              ? styles.selectedSizeButton
                              : null,
                          ]}
                          onPress={() => selectSizeHandler(size.size_type_code)}
                        >
                          <Text
                            style={{
                              color:
                                selectedSize === size.size_type_code
                                  ? '#fff'
                                  : '#000',
                            }}
                          >{`${size.cut_norm_x_size} X ${size.cut_norm_y_size}`}</Text>
                        </Pressable>
                      ))}
                </View>

                <View style={{ flexDirection: 'row' }}>
                  {selectedButtonType === '오프너버튼' &&
                    button.paperSize
                      .filter((size) => size.cut_norm_x_size === '58')
                      .map((size) => (
                        <Pressable
                          key={size.size_type_code}
                          style={[
                            styles.sizeButton,
                            selectedSize === size.size_type_code
                              ? styles.selectedSizeButton
                              : null,
                          ]}
                          onPress={() => selectSizeHandler(size.size_type_code)}
                        >
                          <Text
                            style={{
                              color:
                                selectedSize === size.size_type_code
                                  ? '#fff'
                                  : '#000',
                            }}
                          >{`${size.cut_norm_x_size} X ${size.cut_norm_y_size}`}</Text>
                        </Pressable>
                      ))}
                </View>

                {selectedSize && (
                  <>
                    <View
                      style={{
                        marginVertical: 24,
                        borderBottomWidth: 1,
                        borderBottomColor: '#2d63e2',
                        paddingBottom: 8,
                      }}
                    >
                      <Text>수량 선택</Text>
                    </View>
                    <Pressable
                      onPress={() =>
                        setIsClickedChoiceProductCount((prev) => !prev)
                      }
                      style={({ pressed }) => [
                        styles.selectedButton,
                        { borderColor: selectedCount ? '#2d63e2' : '#000' },
                      ]}
                    >
                      <Text
                        style={[
                          {
                            textAlign: 'center',
                            color: selectedCount ? '#2d63e2' : '#000',
                          },
                        ]}
                      >
                        {selectedCount
                          ? `${selectedCount}개`
                          : '수량을 선택해주세요'}
                      </Text>
                    </Pressable>
                  </>
                )}
                {selectedCount && (
                  <>
                    <View
                      style={{
                        marginVertical: 24,
                        borderBottomWidth: 1,
                        borderBottomColor: '#2d63e2',
                        paddingBottom: 8,
                      }}
                    >
                      <Text>코팅 선택</Text>
                    </View>
                    <Pressable
                      onPress={() => setisCoatingModalVisible((prev) => !prev)}
                      style={[
                        styles.selectedButton,
                        { borderColor: selectedCoating ? '#2d63e2' : '#000' },
                      ]}
                    >
                      <Text
                        style={[
                          {
                            textAlign: 'center',
                            color: selectedCoating ? '#2d63e2' : '#000',
                          },
                        ]}
                      >
                        {selectedCoating === 'COT21'
                          ? '단면무광 핫코팅'
                          : selectedCoating === 'COT11'
                          ? '단면유광 핫코팅'
                          : '코팅을 선택해주세요'}
                      </Text>
                    </Pressable>
                  </>
                )}

                {picture && removebgStatus !== 'fulfilled' && (
                  <View
                    style={{
                      marginTop: 40,
                      justifyContent: 'center',
                      alignItems: 'center',
                    }}
                  >
                    <ImageBackground
                      style={{ width: 200, height: 200 }}
                      imageStyle={{
                        width: 200,
                        height: 200,
                        borderRadius: 200,
                      }}
                      source={{ uri: picture.uri }}
                    />
                    <Progressbar
                      nowStep={nowStep}
                      totalStep={totalStep}
                      removebgStatus={removebgStatus}
                    />
                    <Pressable
                      onPress={removeBackgroundHandler}
                      style={{
                        height: 50,
                        minWidth: 160,
                        marginTop: 24,
                        borderWidth: 1,
                        borderColor: '#2d63e2',
                        justifyContent: 'center',
                        alignItems: 'center',
                        paddingHorizontal: 24,
                      }}
                      disabled={removebgStatus !== 'pending'}
                    >
                      {removebgStatus === 'pending' && (
                        <Text style={{ color: '#2d63e2' }}>배경 제거하기</Text>
                      )}
                      {removebgStatus === 'loading' && (
                        <ActivityIndicator color="#2d63e2" />
                      )}
                    </Pressable>
                  </View>
                )}
                {removebgPicture && removebgStatus === 'fulfilled' && (
                  <View
                    style={{
                      marginTop: 40,
                      justifyContent: 'center',
                      alignItems: 'center',
                    }}
                  >
                    <ImageBackground
                      style={{ width: 200, height: 200 }}
                      imageStyle={{
                        width: 200,
                        height: 200,
                        borderRadius: 200,
                      }}
                      source={{ uri: removebgPicture.preview }}
                    />
                    <Pressable
                      onPress={saveRemoveBgPictureHandler}
                      style={{
                        height: 50,
                        minWidth: 160,
                        marginTop: 24,
                        borderWidth: 1,
                        borderColor: '#2d63e2',
                        justifyContent: 'center',
                        alignItems: 'center',
                        paddingHorizontal: 24,
                      }}
                    >
                      <Text style={{ color: '#2d63e2' }}>
                        배경이 제거된 사진 저장
                      </Text>
                    </Pressable>
                  </View>
                )}
                {selectedUploadMethod === '웹하드 등록' && webhardAddress && (
                  <View
                    style={{
                      height: 48,
                      justifyContent: 'center',
                      alignItems: 'center',
                      marginTop: 24,
                    }}
                  >
                    <Text style={{ fontSize: 18, fontWeight: '500' }}>
                      등록한 웹하드 주소
                    </Text>

                    <View
                      style={{
                        paddingVertical: 8,
                        borderBottomColor: '#2d63e2',
                        borderBottomWidth: 1,
                      }}
                    >
                      <Text style={{ fontSize: 18, fontWeight: '600' }}>
                        {webhardAddress}
                      </Text>
                    </View>
                  </View>
                )}
                {selectedCoating && selectedUploadMethod === '마이 갤러리' && (
                  <Pressable
                    onPress={pickGalleryImageHandler}
                    style={({ pressed }) => [
                      {
                        marginTop: 40,
                        height: 60,
                        width,
                        justifyContent: 'center',
                        alignItems: 'center',
                        backgroundColor: pressed ? '#6087e2' : '#2d63e2',
                      },
                    ]}
                  >
                    <Text style={{ color: '#fff', fontSize: 24 }}>
                      사진 선택하러 가기
                    </Text>
                  </Pressable>
                )}
                {selectedCoating && selectedUploadMethod === '웹하드 등록' && (
                  <Pressable
                    onPress={isRegisterWebhardModalHandler}
                    style={({ pressed }) => [
                      {
                        marginTop: 40,
                        height: 60,
                        width,
                        justifyContent: 'center',
                        alignItems: 'center',
                        backgroundColor: pressed ? '#6087e2' : '#2d63e2',
                      },
                    ]}
                  >
                    <Text style={{ color: '#fff', fontSize: 24 }}>
                      웹하드 등록
                    </Text>
                  </Pressable>
                )}
                {selectedCoating &&
                  selectedUploadMethod === '카메라로 사진찍기' && (
                    <Pressable
                      onPress={openCameraHandler}
                      style={({ pressed }) => [
                        {
                          marginTop: 40,
                          height: 60,
                          width,
                          justifyContent: 'center',
                          alignItems: 'center',
                          backgroundColor: pressed ? '#6087e2' : '#2d63e2',
                        },
                      ]}
                    >
                      <Text style={{ color: '#fff', fontSize: 24 }}>
                        카메라 켜기
                      </Text>
                    </Pressable>
                  )}
              </View>
            </View>
          ) : (
            <ActivityIndicator />
          )}
        </ScrollView>
      </>
    );
  }
  if (route.params.title === '키링' && keyring) {
    return (
      <>
      <KeyringQuantityModal
        isVisible={isKeyringQuantityModalVisible}
        keyring={keyring}
        selectKeyringQuantityHandler={selectKeyringQuantityHandler}
        toggleKeyringQuantityModalHandler={toggleKeyringQuantityModalHandler}
      />
      <KeyringAccessoriesModal
        isVisible={isKeyringAccessoriesModalVisible}
        keyring={keyring}
        selectKeyringAccessoryHandler={selectKeyringAccessoryHandler}
        toggleKeyringAccessoriesModalHandler={toggleKeyringAccessoriesModalHandler}
      />
      <RegisterWebhardModal
        isRegisterWebhardModalHandler={isRegisterWebhardModalHandler}
        isRegisterWebhardModalVisible={isRegisterWebhardModalVisible}
        inputWebhardAddressHandler={inputWebhardAddressHandler}
        webhardAddress={webhardAddress}
      />
      <ScrollView style={styles.container}>
        <View
          style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}
        >
          <View
            style={{
              marginVertical: 24,
              borderBottomWidth: 1,
              borderBottomColor: '#2d63e2',
              paddingBottom: 8,
            }}
          >
            <Text>디자인 업로드 방법 선택하기</Text>
          </View>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            {choiceUploadMethod.map((item) => (
              <Pressable
                key={item}
                onPress={() => selectUploadMethodHandler(item)}
                style={({ pressed }) => [
                  styles.choiceDesignButton,
                  { opacity: pressed ? 0.78 : 1 },
                  {
                    borderColor:
                      selectedUploadMethod === item ? '#2d63e2' : 'black',
                  },
                ]}
              >
                <Text
                  style={{
                    color: selectedUploadMethod === item ? '#2d63e2' : 'black',
                  }}
                >
                  {item}
                </Text>
              </Pressable>
            ))}
          </View>
          {selectedUploadMethod && (
            <>
              <View
                style={{
                  marginVertical: 24,
                  borderBottomWidth: 1,
                  borderBottomColor: '#2d63e2',
                  paddingBottom: 8,
                }}
              >
                <Text>키링 유형 선택하기</Text>
              </View>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={{paddingHorizontal:8}}
                >
                {keyring.keyringType.map((item) => (
                  <Pressable
                    key={item.part_type}
                    onPress={() => selectKeyringTypeHandler(item.part_type)}
                    style={() => [{
                      marginRight: 8,
                      justifyContent: 'center',
                      alignItems: 'center',
                      borderRadius:16,
                    }, keyringType === item.part_type ? styles.selectedTypeButton : null]}
                  >
                    <Image
                      style={{ width: 96, height: 96, borderRadius: 16 }}
                      source={{ uri: item.filename }}
                    />
                    <Text style={keyringType === item.part_type ? {color:'#fff'} : null}>{item.paper_name}</Text>
                  </Pressable>
                ))}
               
              </ScrollView>
            </>
          )}
          { keyringType
          && 
        <View style={{justifyContent:'center',alignItems:'center',marginTop:24}}>

          <View style={{justifyContent:'center',alignItems:'center'}}>    
            <Text style={{borderBottomWidth:1,borderBottomColor:'#2d63e2'}}>재단 사이즈</Text>
          {(keyringType === 'KRT01' || keyringType === 'KRT02')
          && <Text>
              {keyring.keyringSize[0].cut_norm_x_size} * {keyring.keyringSize[0].cut_norm_y_size}
            </Text>}
            {(keyringType === 'KRT03')
          && <Text>
              {keyring.keyringSize[1].cut_norm_x_size} * {keyring.keyringSize[1].cut_norm_y_size}
            </Text>}
          </View>
          <View style={{justifyContent:'center',alignItems:'center'}}>
          <Text style={{borderBottomWidth:1,borderBottomColor:'#2d63e2'}}>작업 사이즈</Text>
          {(keyringType === 'KRT01' || keyringType === 'KRT02')
          && <Text>{+keyring.keyringSize[0].cut_norm_x_size + 2} * {+keyring.keyringSize[0].cut_norm_y_size + 2}</Text>}
          {(keyringType === 'KRT03')
          && <Text>{+keyring.keyringSize[1].cut_norm_x_size + 2} * {+keyring.keyringSize[1].cut_norm_y_size + 2}</Text>}
          </View>
          <View style={{marginTop:8}}>
            <Text style={{color:'#c9c9c9',fontSize:12}}>* 키링의 사이즈는 유형별로 고유하며 변경 불가합니다.</Text>
            <Text style={{color:'#c9c9c9',fontSize:12}}>* 모든 사이즈는 밀리미터 단위입니다.</Text>
          </View>
        </View>
          }
          {
            keyringType &&
            <View style={{justifyContent:'center',alignItems:'center'}}>
              <View
                style={{
                  marginVertical: 24,
                  borderBottomWidth: 1,
                  borderBottomColor: '#2d63e2',
                  paddingBottom: 8,
                }}
              >
                <Text>수량</Text>
              </View>
              <View style={{flexDirection:'row'}}>
                <TouchableOpacity 
                onPress={toggleKeyringQuantityModalHandler}
                style={{marginRight:8, paddingHorizontal:8,paddingVertical:4,borderWidth:1,borderColor:'#000',minWidth:96,justifyContent:'center',alignItems:'center'}}>
                  <Text style={{color:'#000'}}>{keyringQuantity ? `${keyringQuantity}개`: '개수를 선택해주세요'}</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                onPress={() => {return Alert.alert("서비스 준비중입니다.")}}
                style={{ paddingHorizontal:8,paddingVertical:4,borderWidth:1,borderColor:'#000',minWidth:96,justifyContent:'center',alignItems:'center'}}>
                  <Text style={{color:'#000'}}>종류를 선택해주세요</Text>
                </TouchableOpacity>
              </View>
            </View>
          }
          {
            keyringQuantity &&
            <View style={{justifyContent:'center',alignItems:'center'}}>
              <View
                style={{
                  marginVertical: 24,
                  borderBottomWidth: 1,
                  borderBottomColor: '#2d63e2',
                  paddingBottom: 8,
                }}
              >
                <Text>후면방향</Text>
              </View>
              <View style={{flexDirection:'row'}}>
              {keyring.keyringBackface.map((item) => (
                <Pressable
                key={item}
                onPress={() => selectKeyringBackfaceHandler(item)}
                style={[{paddingVertical:4,paddingHorizontal:16,height:40,justifyContent:'center',alignItems:'center'},keyringBackface === item ? {backgroundColor:'#2d63e2'} : {backgroundColor:'#fff'}]}>
                  <Text style={keyringBackface === item ? {color:'#fff'} : {color:'#000'}}>{item}</Text>
                </Pressable>
              ))}
              </View>
            </View>
          }
          {
            keyringBackface &&
            <View style={{justifyContent:'center',alignItems:'center',marginVertical:24}}>
              <View
                style={{
                  marginVertical: 24,
                  borderBottomWidth: 1,
                  borderBottomColor: '#2d63e2',
                  paddingBottom: 8,
                }}
              >
                <Text>고리</Text>
              </View>
              <TouchableOpacity
              onPress={toggleKeyringAccessoriesModalHandler}
              style={{height:56,minWidth:80,borderWidth:1,borderColor:'#ccc',justifyContent:'center',alignItems:'center',paddingHorizontal:8}}
              >
                {!keyringAccessory.title && <Text>고리를 선택해주세요</Text>}
            {keyringAccessory.title && (
              <View style={{paddingHorizontal:24,justifyContent:'flex-start',alignItems:'center',flexDirection:'row'}}>
                <Image style={{width:48,height:48,borderRadius:48,marginRight:24}} source={{uri: keyringAccessory.imageURL }} />
                <Text style={{fontSize:18,textAlign:'center'}}>{keyringAccessory.title}</Text>
              </View>
            )}
              </TouchableOpacity>
            </View>
          }

                {picture && removebgStatus !== 'fulfilled' && (
                  <View
                    style={{
                      marginTop: 40,
                      justifyContent: 'center',
                      alignItems: 'center',
                    }}
                  >
                    <ImageBackground
                      style={{ width: 200, height: 200 }}
                      imageStyle={{
                        width: 200,
                        height: 200,
                        borderRadius: 200,
                      }}
                      source={{ uri: picture.uri }}
                    />
                    <Progressbar
                      nowStep={nowStep}
                      totalStep={totalStep}
                      removebgStatus={removebgStatus}
                    />
                    <Pressable
                      onPress={removeBackgroundHandler}
                      style={{
                        height: 50,
                        minWidth: 160,
                        marginTop: 24,
                        borderWidth: 1,
                        borderColor: '#2d63e2',
                        justifyContent: 'center',
                        alignItems: 'center',
                        paddingHorizontal: 24,
                      }}
                      disabled={removebgStatus !== 'pending'}
                    >
                      {removebgStatus === 'pending' && (
                        <Text style={{ color: '#2d63e2' }}>배경 제거하기</Text>
                      )}
                      {removebgStatus === 'loading' && (
                        <ActivityIndicator color="#2d63e2" />
                      )}
                    </Pressable>
                  </View>
                )}
                {removebgPicture && removebgStatus === 'fulfilled' && (
                  <View
                    style={{
                      marginTop: 40,
                      justifyContent: 'center',
                      alignItems: 'center',
                    }}
                  >
                    <ImageBackground
                      style={{ width: 200, height: 200 }}
                      imageStyle={{
                        width: 200,
                        height: 200,
                        borderRadius: 200,
                      }}
                      source={{ uri: removebgPicture.preview }}
                    />
                    <Pressable
                      onPress={saveRemoveBgPictureHandler}
                      style={{
                        height: 50,
                        minWidth: 160,
                        marginTop: 24,
                        borderWidth: 1,
                        borderColor: '#2d63e2',
                        justifyContent: 'center',
                        alignItems: 'center',
                        paddingHorizontal: 24,
                      }}
                    >
                      <Text style={{ color: '#2d63e2' }}>
                        배경이 제거된 사진 저장
                      </Text>
                    </Pressable>
                  </View>
                )}

                {selectedUploadMethod === '웹하드 등록' && webhardAddress && (
                  <View
                    style={{
                      height: 48,
                      justifyContent: 'center',
                      alignItems: 'center',
                      marginTop: 24,
                    }}
                  >
                    <Text style={{ fontSize: 18, fontWeight: '500' }}>
                      등록한 웹하드 주소
                    </Text>

                    <View
                      style={{
                        paddingVertical: 8,
                        borderBottomColor: '#2d63e2',
                        borderBottomWidth: 1,
                      }}
                    >
                      <Text style={{ fontSize: 18, fontWeight: '600' }}>
                        {webhardAddress}
                      </Text>
                    </View>
                  </View>
                )}
          {keyringAccessory.title && selectedUploadMethod === '마이 갤러리' && (
                  <Pressable
                    onPress={pickGalleryImageHandler}
                    style={({ pressed }) => [
                      {
                        marginTop: 40,
                        height: 60,
                        width,
                        justifyContent: 'center',
                        alignItems: 'center',
                        backgroundColor: pressed ? '#6087e2' : '#2d63e2',
                      },
                    ]}
                  >
                    <Text style={{ color: '#fff', fontSize: 24 }}>
                      사진 선택하러 가기
                    </Text>
                  </Pressable>
                )}
                {keyringAccessory.title && selectedUploadMethod === '웹하드 등록' && (
                  <Pressable
                    onPress={isRegisterWebhardModalHandler}
                    style={({ pressed }) => [
                      {
                        marginTop: 40,
                        height: 60,
                        width,
                        justifyContent: 'center',
                        alignItems: 'center',
                        backgroundColor: pressed ? '#6087e2' : '#2d63e2',
                      },
                    ]}
                  >
                    <Text style={{ color: '#fff', fontSize: 24 }}>
                      웹하드 등록
                    </Text>
                  </Pressable>
                )}
                {keyringAccessory.title &&
                  selectedUploadMethod === '카메라로 사진찍기' && (
                    <Pressable
                      onPress={openCameraHandler}
                      style={({ pressed }) => [
                        {
                          marginTop: 40,
                          height: 60,
                          width,
                          justifyContent: 'center',
                          alignItems: 'center',
                          backgroundColor: pressed ? '#6087e2' : '#2d63e2',
                        },
                      ]}
                    >
                      <Text style={{ color: '#fff', fontSize: 24 }}>
                        카메라 켜기
                      </Text>
                    </Pressable>
                  )}
        </View>
      </ScrollView>
      </>
    );
  }
};

export default CategoryDetailScreen;

const styles = StyleSheet.create({
  container: {
    minHeight: '100%',
    backgroundColor: '#fff',
  },
  choiceDesignButton: {
    padding: 4,
    marginVertical: 12,
    marginHorizontal: 6,
    borderWidth: 1,
  },
  buttonTypeButton: {
    width: 128,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 8,
    borderRadius: 16,
  },
  sizeButton: {
    padding: 8,
    borderWidth: 1,
    marginHorizontal: 4,
    borderRadius: 4,
  },
  selectedSizeButton: {
    backgroundColor: '#2d63e2',
    borderColor: 'transparent',
  },
  selectedButton: {
    borderRadius: 16,
    borderWidth: 1,
    paddingVertical: 2,
    paddingHorizontal: 4,
    width: 124,
  },
  selectedTypeButton:{
    backgroundColor:'#2d63e2'
  }
});
