/**
 * Created by PanJiaChen on 16/11/18.
 */

/**
 * @param {string} path
 * @returns {Boolean}
 */
export function isExternal(path) {
  return /^(https?:|mailto:|tel:)/.test(path)
}

/**
 * @param {string} str
 * @returns {Boolean}
 */
export function validUsername(str) {
  const valid_map = ['admin', 'editor']
  return valid_map.indexOf(str.trim()) >= 0
}


/**
 * 手机号 验证
 */
export function isvalidPhone(str) {
  const reg = /^1[3|4|5|7|8][0-9]\d{8}$/
  return reg.test(str)
}
/**
 * 贝壳收入 验证1-100
 */
export function validNum100(val) {
  const reg = /^((?!0)\d{1,2}|100)$/;
  return reg.test(Number(val))

}
/**
 *正数校验
 * @param {*} val
 * @param {*} dyVal
 */
export function validZNum(val) {

  const reg = /^(0+)?(99(\.99?)?|(\.99?)?|\.[0-9]+|0?[0-9](\.[0-9]{0,2})?|(0+)?[0-9][0-9](\.[0-9][0-9]?)?)$/;
  return reg.test(Number(val));


}

/*****
 * 数字校验
 */

export function myIsNaN(value) {
  value = Number(value)
  if(value > 0){
    return typeof value === 'number' && !isNaN(value);
  }else{
    return false;
  }

}


/**
 * 工作分成 动态调整上限值
 */
export function validDyNum(val, dyVal) {
  // if(val >= 0 && val <= dyVal){
  //   return
  // }
  // const reg =  new RegExp("^((?!0)\\d{1,2}|"+dyVal+")$")
  // // const reg = eval("\/^((?!0)\\d{1,2}|"+dyVal+")$\/");
  // return reg.test(Number(val))
  return (val >= 0 && val <= dyVal)
}
/**
 * 提成分成 <15
 */
export function validNum15(val) {
  return (val >= 0 && val <= 15)

}
/**
 *
 * 开户分成
 */
export function validNum20(val) {
  return (val > 0 && val <= 20)

}
/**
 *
 * 分润比例
 */
export function validNum2(val) {
  let len = 0;
  if(val.toString().indexOf('.')>0){
    if(val.toString().split(".")){
      len = val.toString().split(".")[1].length;
    }
  }

  return (val > 0 && val <= 2 &&  len<=1)

}
/**
 * 过滤银行卡号中间的空格
 */
export function filterSpace(val) {
  let sstr = val.replace(/\s*/g, '')
  return sstr;
}


/**
 * 保留有效数字位数（四舍五入）
 */
export function getFloat(num, n) {
	n = n ? parseInt(n) : 0;
	if(n <= 0) {
		return Math.round(num);
	}
	num = Math.round(num * Math.pow(10, n)) / Math.pow(10, n); //四舍五入
	num = Number(num).toFixed(n); //补足位数
	return num;
};


/***
 * 正整数验证
 *
 */
export function validzzs(num){
   num = Number(num);
   return /(^[1-9]\d*$)/.test(num)
}


/****
 * 银行卡 只校验是数字就行
 */

export function validBankCode(val){
  let reg = /^\d*$/;
  if(!reg.exec(val)){
    return false;
  }else{
    return true;
  }

}



/***
 * 验证 正整数或者两位以内的小数
 */
export function validFloat2(val){
  val = Number(val);
  return /^\d+(\.\d{1,2})?$/.test(val);
}



/***
 * 校验返预付和返预扣价格是否合理
 */

export function calcuReturn(val){
  // 校验大于0
  val = Number(val);
  return val>=0;
}




// 计算小数点后两位的数字取舍问题
export  function save2num(val,type) {
  var val_num = Number(val);
  var val_str = val + '';
  // 判定是否是小数
  var flag1 = val_str.indexOf('.') > -1;
  // 若是小数，判定是否多于两位
  var flag2 = false;
  if (flag1) {
      flag2 = val_str.split('.')[1].length > 2;
  }
  if (flag1 && flag2) { //如果是小数且位数多于两位
      var _val_numf;
      if(type=='sell'){//卖出的时候舍去第三位小数
          _val_numf = Number((val_num * 100 + '').split('.')[0]) ;
      }else{ //买入的时候第三位进位
          _val_numf = Number((val_num * 100 + '').split('.')[0]) + 1;
      }
      
      return _val_numf / 100;
  } else {
      return val_num;
  }
}
