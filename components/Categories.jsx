import { FlatList, StyleSheet } from 'react-native'
import React, { useEffect } from 'react'
import Category from './Category'
import { useRecoilState } from 'recoil'
import { buttonState } from '../atom/button'
import axios from 'axios'
import { keyringState } from '../atom/keyring'




const DUMMY_CATEGORIES_DATA = {
  categories: [
    {
      id:10011,
      category:"무드등",
      product: ["Neon Heart", "Cherry Cherry", "망고튤립", "행운의 고래"]
    },
    {
      id:10012,
      category:"액자",
      product: ["원목액자", "초슬릭알루미늄액자","캔버스액자","프리미엄아크릴디아섹액자"]
    },
  {
    id:20014,
    category:"버튼",
    choiceDesign:["MyImage","WebHard"],
    type:["PIN","MIRROR","MAGNET","OPENER"],
    material: ["유포지 150g"],
    sizeByType: {
      PIN:[{width:32,height:32,isSizeEditPossible: false},{width:44,height:44,isSizeEditPossible: false}, {width:58,height:58,isSizeEditPossible: false}, {width:75,height:75,isSizeEditPossible: false}],
      MIRROR:[{width:58,height:58,isSizeEditPossible: false}, {width:75,height:75,isSizeEditPossible: false}],
      MAGNET:[{width:32,height:32,isSizeEditPossible: false}, {width:58,height:58,isSizeEditPossible: false}],
      OPENER:[{width:58,height:58,isSizeEditPossible: false}]
    },
    imageByType: {
      PIN: 'https://images.adpiamall.com/manual/sample_pop_h_05.jpg',
      MIRROR: 'https://images.adpiamall.com/manual/sample_pop_h_06.jpg',
      MAGNET: 'https://images.adpiamall.com/manual/sample_pop_h_07.jpg',
      OPENER: 'https://images.adpiamall.com/manual/sample_pop_h_08.jpg'
    },
    ProcessingSize: {
      width:12,
      height:12
    },
    
    minimumQuantity: 4,
    ink: "수성잉크 4색",
    packagingMaterial: "OPP접착봉투 (개별포장)",
    options: ["코팅"],
    detailOption: [
    {
      title:"코팅",
      choice:["단면유광 핫코팅", "단면무광 핫코팅"]
    }
  ]
  },
  {
    id:20015,
    category:"마스킹테이프"
  },
  {
    id:20016,
    category:"하드폰케이스"
  },
  {
    id:20017,
    category:"투명폰케이스"
  },
  {
    id:20018,
    category:"에어팟케이스"
  },
  {
    id:20019,
    category:"부채"
  },
  {
    id:200110,
    category:"아크릴판"
  },
  {
    id:200111,
    category:"무드등"
  },
  {
    id:200112,
    category:"가림막"
  },
  {
    id:200113,
    category:"톡"
  },
  {
    id:200114,
    category:"키링",
    choiceDesign:["MyImage","WebHard"],
    type:["CIRCLE","SQUERE","HEART","FREEFORM"],
    material: ["투명아크릴(두께 3mm)","펄골드 (두께 3mm)","펄 홀로그램 (두께 3mm)","펄 로즈골드 (두께 3mm)"],
    sizeByType: {
      CIRCLE:[{width:39,height:44,isSizeEditPossible: false}],
      SQUERE:[{width:39,height:44,isSizeEditPossible: false}],
      HEART:[{width:42,height:44,isSizeEditPossible: false}],
      FREEFORM:[{width:50,height:60,isSizeEditPossible:true}]
    },
    // imageByType: {
    //   CIRCLE:
    //   SQUERE:
    //   HEART:
    //   FREEFORM:
    // },
    ProcessingSize: {width:2,height:2},
    minimumQuantity: 1,
    ink: "컬러+백색+컬러인쇄 (3layer)",
    packagingMaterial: "OPP접착봉투 (개별포장)",
    options: ["고리"],
    detailOption: [{
      title:"고리",
      choice:["자물쇠 골드", "자물쇠 실버","볼체인 보라","볼체인 블랙","볼체인 화이트","볼체인 핑크","볼체인 블루", "볼체인 실버"]
    }]
  },
  {
    id:200115,
    category:"명찰"
  },
  {
    id:200116,
    category:"비츠"
  },
  {
    id:200117,
    category:"꽃병"
  },
  {
    id:200118,
    category:"트레이"
  },
  {
    id:200119,
    category:"절곡"
  },
  {
    id:200120,
    category:"다보액자"
  }
]
}

const Categories = () => {
  const [button,setButton] = useRecoilState(buttonState);
  const [keyring,setKeyring] = useRecoilState(keyringState);
  const getAllProduct = async () => {
    try {
      const { data } = await axios.get('http://www.adpiamall.com/modules/api/estimate/print/init/options.php?category=RP3300&product=PRP033&goods_no=30');

      console.log(data);
      return data;
    } catch (error) {
      console.log(error.response.data); 
    }
  }

  useEffect(() => {
    getAllProduct().then((response) => {
      const paperSize = response.PAPERSIZE.slice(72,76);
      const processingSize = response.size.find((sz) => sz.id === "91")
      const optionQuantity = response.optionqty.filter((item) => item.cat_code === "RP3300");
      const shrinkSize = response.PRINTING.filter((item) => item.common_code.includes("SST"));
      const packaging = response.PRINTING.filter((item) => item.common_code.includes("OPP10") || item.common_code.includes("OPS10"))
      const coating = response.coating.filter((item) => item.type_code.includes("COT11") || item.type_code.includes("COT21"))
      const gettingData = {
        shrinkSize,
        paperSize,
        processingSize,
        optionQuantity,
        packaging,
        coating,
        buttonImage : response.buttonimage,
        rmat: response.rmatcode[0],
        orderCount: response.ordercount,  
        ink: response.ink[0],
      }
      
      const keyringMaterial = response.rmat.filter((item) =>
      item.rmat_code.includes('ACLP03RG0')
      || item.rmat_code.includes('ACLP03HG0')
      || item.rmat_code.includes('ACLP03GL0')
      || item.rmat_code.includes('ACL003TP0')
      )
      const keyringSize = response.PAPERSIZE.filter((item) =>
      item.size_type_code === 'CRP53'
      || item.size_type_code === 'CRP54'
      )
      const keyringType = response.krt_imgs
      const keyringQuantity = response.optionqty.filter((item) => item.cat_code ==='RP3300')
      const keyringBackface = ["반전","동일"]
      const keyringAccessories = response.PRINTING.filter((item) => item.h_code === "RNG");
      
      const keyringData = {
        keyringAccessories,
        keyringBackface,
        keyringMaterial,
        keyringQuantity,
        keyringType,
        keyringSize,
        keyringOrderCount: response.ordercount
      }
      setButton(gettingData)
      setKeyring(keyringData)
    });
  } ,[])
  
  
  return (
    <FlatList
    contentContainerStyle={[styles.container]}
    data={DUMMY_CATEGORIES_DATA.categories}
    renderItem={({item}) => <Category key={item.id} category={{...item}} />}
    numColumns={2}
    showsVerticalScrollIndicator={false}
    />
  )
}

export default Categories

const styles = StyleSheet.create({
  container:{
    justifyContent:'center',
    alignItems:'center',
    borderWidth:2,
    backgroundColor:'#77450c'
  }
  
})