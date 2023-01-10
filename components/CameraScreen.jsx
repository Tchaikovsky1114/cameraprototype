import { StyleSheet,Text,TouchableOpacity,useWindowDimensions,View } from 'react-native';
import React, { useEffect, useRef, useState } from 'react';
import * as ImagePicker from 'expo-image-picker';
import * as MediaLibrary from 'expo-media-library';
import { LinearGradient } from 'expo-linear-gradient';
import { AutoFocus, Camera, CameraType } from 'expo-camera';
import { useRecoilState } from 'recoil';
import { pictureState } from '../atom/picture';
import { removebgPictureState } from '../atom/removebgPicture';
import CameraPreview from './CameraPreview';
import { getDownloadURL, ref, uploadBytes, uploadString } from 'firebase/storage';
import { storage } from '../firebaseConfig';
import uuid from 'react-native-uuid';

const CameraScreen = ({ navigation,route }) => {
  const cameraRef = useRef(null);
  const [previewVisible, setPreviewVisible] = useState(false);
  const [capturedImage, setCapturedImage] = useState(null);
  const { width } = useWindowDimensions();
  // const height = Math.round((width * 16) / 9);
  const [cameraType, setCameraType] = useState(CameraType.back);
  const [picture, setPicture] = useRecoilState(pictureState);
  const [removebgPicture, setRemovebgPicture] = useRecoilState(removebgPictureState);
  const [zoomLevel,setZoomLevel] = useState(0);
  const [toggleWhiteBalance,setToggleWhiteBalance] = useState(0)

  const takePictureHandler = async () => { 
    if (!cameraRef.current) return;
    await cameraRef.current
      .takePictureAsync({
        base64: true,
      })
      .then((data) => {
        setPreviewVisible(true);
        setCapturedImage(data);
      });
  };


  const retakePictureHandler = () => {
    setPreviewVisible(false);
    setCapturedImage(null);
  };

  const savePictureHandler = async () => {
    try {
      const { status } = await MediaLibrary.requestPermissionsAsync();
      if (status === 'granted') {
        await MediaLibrary.saveToLibraryAsync(capturedImage.uri).then(() => {
          setRemovebgPicture(null);
          setPicture(capturedImage);
        }).then(() => {
          uploadImageAsync(capturedImage.uri,'originalPhoto/')
        });
      }
      navigation.navigate('CategoryDetail', {
        title: route.params.title,
      });
    } catch (error) {
      console.error(error);
    }
  };
  async function uploadImageAsync(uri,photoURL) { 
    const blob = await new Promise((resolve, reject) => { 
      const xhr = new XMLHttpRequest(); 
      xhr.onload = function () { 
        resolve(xhr.response); 
      }; 
      xhr.onerror = function (e) { 
        console.log(e); 
      reject(new TypeError("네트워크 요청 실패")); 
      }; 
      xhr.responseType = "blob"; 
      xhr.open("GET", uri, true); 
      xhr.send(null);
    }); 
    const storageRef = ref(storage,`${photoURL}${uuid.v4()}`);
      uploadBytes(storageRef,blob)
      .then(async (snapshot) => {
        // 추후 downloadURL을 fireStore에 유저 정보- 유저 사진 모음집에 저장
        // 사진집을 만들 수 있게끔..?
        const downloadURL = await getDownloadURL(storageRef);
        console.log(downloadURL);
      }).catch((error) => console.log(error));
    blob.close()
 }
  
  const editPictureHandler = async () => {
    const { status } = await MediaLibrary.requestPermissionsAsync();
    if(status !== 'granted') {
      return Alert.alert("갤러리 접근권한 허용은 필수입니다.")
    }
    
      await MediaLibrary.saveToLibraryAsync(capturedImage.uri).then(() => {
        setRemovebgPicture(null);
        setPicture(capturedImage);
      })
      .then( async() => {
        let result = await ImagePicker.launchImageLibraryAsync({
          mediaTypes: ImagePicker.MediaTypeOptions.Images,
          allowsEditing: true,
          base64:true,
          aspect: [4,3],
          quality:1,
        })
        if(!result.canceled){
          setPicture(result.assets[0]);
          return result.assets[0]
        }
      }).then((response) => {
        uploadImageAsync(response.uri,'editPhoto/');
        navigation.navigate('CategoryDetail', {
          title: route.params.title,
        });
      });
  }
  const toggleWhiteBalanceHandler = () => {
    if(toggleWhiteBalance > 4){
      setToggleWhiteBalance(0)
    }
    setToggleWhiteBalance(prev => prev += 1);
  }
  const toggleCameraType = () => {
    setCameraType((prev) =>
      prev === CameraType.back ? CameraType.front : CameraType.back
    );
  };

  const zoomInHandler = () => {
    if(zoomLevel > 0.9) return;
    setZoomLevel(prev => prev += 0.1)
  }
  const zoomOutHandler = () => {
    if(zoomLevel < 0.1) return;
    setZoomLevel(prev => prev -= 0.1)
  }

  useEffect(() => {
    navigation.setOptions({
      title: '상품 사진 등록',
    });
  }, []);

  return previewVisible && capturedImage ? (
    <CameraPreview
      photo={capturedImage}
      retakePictureHandler={retakePictureHandler}
      savePictureHandler={savePictureHandler}
      editPictureHandler={editPictureHandler}
    />
  ) : (
    <View style={{ flex: 1,justifyContent:'flex-start',alignItems:'center',backgroundColor:'#6861a7',position: 'relative',paddingVertical:40 }}>
      <LinearGradient
      colors={['#140e66','transparent']}
      style={{position:'absolute',left:0,right:0,top:0,height: 400}}
      />
      <View
          style={{
            position:'absolute',
            justifyContent: 'center',
            alignItems: 'center',
            width,
            bottom:-32,
            zIndex:9999
          }}
        >
        <TouchableOpacity
          onPress={takePictureHandler}
          style={styles.touchButton}
        >
          <LinearGradient
            colors={['#93C6F9', '#97B4FA', '#A768FE']}
            start={[0, 0]}
            end={[1, 0.7]}
            location={[0.25, 0.4, 1]}
            style={styles.touchButton}
          >
            <Text style={{ color: '#fff',fontWeight:'bold' }}>Click Me!</Text> 
          </LinearGradient>
        </TouchableOpacity>
          
        </View>
      <View style={{borderRadius:32,overflow:'hidden'}}>
      <Camera
        style={{width,borderRadius:32,height:'100%' }}
        ref={cameraRef}
        type={cameraType}
        zoom={zoomLevel}
        autoFocus={AutoFocus.on}
        whiteBalance={toggleWhiteBalance}
      >
        
        <View
          style={{
            justifyContent: 'flex-start',
            alignItems: 'flex-start',
            width,
            marginTop: 40,
          }}
        >
          <TouchableOpacity
            onPress={toggleCameraType}
            style={styles.flipButton}
          >
            <Text style={{ color: '#fff' }}>카메라 전환</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={toggleWhiteBalanceHandler}
            style={[styles.flipButton,{marginTop:16}]}
          >
            <Text style={{ color: '#fff' }}>밸런스 필터링</Text>
          </TouchableOpacity>
        </View>
        
        
        
        <View
          style={{
            justifyContent: 'flex-start',
            alignItems: 'flex-end',
            width,
          }}
        >
          <TouchableOpacity
            onPress={zoomInHandler}
            style={styles.zoomInButton}
          >
            <Text style={{ color: '#fff' }}>확대</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={zoomOutHandler}
            style={styles.zoomOutButton}
          >
            <Text style={{ color: '#fff' }}>축소</Text>
          </TouchableOpacity>
        </View>
      </Camera>
      </View>
    </View>
  );
};

export default CameraScreen;

const styles = StyleSheet.create({
  touchButton: {
    borderRadius: 200,
    width: 70,
    height: 70,
    bottom: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  flipButton: {
    borderRadius: 8,
    marginLeft: 8,
    width: 80,
    height: 40,
    backgroundColor: '#f41',
    opacity:0.78,
    bottom: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  zoomInButton: {
    marginRight: 8,
    marginVertical:8,
    borderRadius: 8,
    width: 40,
    height: 32,
    backgroundColor: '#f41',
    opacity:0.78,
    bottom: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  zoomOutButton:{
    marginRight: 8,
    marginVertical:8,
    borderRadius: 8,
    width: 40,
    height: 32,
    backgroundColor: '#2d63e2',
    opacity:0.78,
    bottom: 20,
    justifyContent: 'center',
    alignItems: 'center',
  }
});
