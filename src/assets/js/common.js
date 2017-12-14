// 删除数组中的指定值
  function removeByValue(arr,val) {
    for (var i = 0; i < arr.length; i++) {
      if (arr[i] == val) {
        arr.splice(i, 1);
        break;
      }
    }
  }

// 修改日期格式
  function dateFormat(val,mark){
    return val.substr(0,4) + mark + val.substr(4,2) + mark + val.substr(6,2);
  }

// 获取当前日期
  function curDate(val) {
    var date = new Date();
    var y = date.getFullYear();
    var m = date.getMonth() + 1;
    var d = '';
    if(val == -1){
      d = date.getDate()-1;
    } else {
      d = date.getDate();
    }
    if (m < 10){
      m = '0'+m;
    }
    if (d < 10){
      d = '0'+d;
    }
    if(val == 1 || val == -1){
      return y+''+m+''+d;
    } else {
      return y+'-'+m+'-'+d;
    }
  }

  function GMTToStr(time){
    let date = new Date(time)
    let Str=date.getFullYear() + '-' +
    (date.getMonth() + 1) + '-' + 
    date.getDate() + ' ' +
    date.getHours() + ':' +
    date.getMinutes() + ':' +
    date.getSeconds()
    return Str
  }

//  function date2Str(val) {
    let date2Str = (dt, fmt)=>
    {
      const placeHolders = [
        [(x, y)=>y.replace('%Y', x.getFullYear()), '%Y'],
        [(x, y)=>y.replace('%m', String(x.getMonth() + 1)), '%m'],
        [(x, y)=>y.replace('%d', String(x.getDate())), '%d'],
        [(x, y)=>y.replace('%H', String(x.getHours())), '%H'],
        [(x, y)=>y.replace('%M', String(x.getMinutes())), '%M'],
        [(x, y)=>y.replace('%S', String(x.getSeconds())), '%S'],
        [(x, y)=>y.replace('%s', String(x.getTime())), '%s'],
      ];
      const ph = placeHolders;
      for (var f of placeHolders)
      {
        let formatter = f[0];
        fmt = formatter(dt, fmt);
      }
      return fmt;
    }
//  }

//  function str2Date(val){
    const str2Date = (str, fmt) =>
    {
      const placeHolders = [
        [(x, y)=>x.setYear(y), '%Y', '(\\d{2,4})'],
        [(x, y)=>x.setMonth(y - 1), '%m', '(\\d{1,2})'],
        [(x, y)=>x.setDate(y), '%d', '(\\d{1,2})'],
        [(x, y)=>x.setHours(y), '%H', '(\\d{1,2})'],
        [(x, y)=>x.setMinutes(y), '%M', '(\\d{1,2})'],
        [(x, y)=>x.setSeconds(y), '%S', '(\\d{1,2})'],
        [(x, y)=>x.setTime(y), '%s', '(\\d+)'],
      ];
      const ph = placeHolders;
      const phIndex = ph.map(x => [x[0], fmt.search(x[1]), x[2], x[1]])
                .filter(x => x[1] != -1)
                .sort((x, y)=> x[1] >y[1]);
      const patternStr = phIndex.reduce((x, y)=> x.replace(y[3], y[2]), fmt);
      const pattern = new RegExp(patternStr);
      const m = pattern.exec(str);
      var d = new Date(0);
      for (var p in phIndex)
      {
        var setter = phIndex[p][0];
        var groupIndex = Number(p) + 1;
        setter(d, Number(m[groupIndex]));
      }
      return d;
    }
//  }

//  计算某个日期之前或者之后的日期
function getOtherDate(date,interval){
  let expireDate = new Date(date);
  expireDate.setDate(expireDate.getDate() + interval);
  return expireDate.getFullYear()+"-"+(expireDate.getMonth()+1)+"-"+expireDate.getDate();
}

// 比较两个日期的大小
function compareDate(date1,date2){
  console.log(date1,date2);
  if(date1){
    var d1 = new Date(date1.replace(/\-/g,"\/"));
  }
  if(date2){
    var d2 = new Date(date2.replace(/\-/g,"\/"));
  }
  return d1>=d2;
}

// 根据id获取对应下拉菜单的选项
  var selectVal =  GLOBAL.selectOption;
  function getSelect(flag,id){
    if (selectVal[flag]){
      for(var i=0; i<selectVal[flag].options.length; i++){
        if (selectVal[flag].options[i].id == id){
          return selectVal[flag].options[i].text;
        }
      }
    }
  }
// 将一级数组转换为三级数组
  function resetData(item){
    var dataList = [];
    // 添加isCheck参数，判断分类是否选中
    for(var z=0; z<item.length; z++){
      item[z]['isCheck'] = 0;
    }
    var data = item;
    // 获取一级诊断分类
    for(var i=0; i<data.length; i++){
      if(data[i].parentid == 0){
        dataList.push(data[i]);
      }
    }
    // 获取二级诊断分类
    for(var k=0; k<dataList.length; k++){
      dataList[k]['child'] = [];
      for(var j=0; j<data.length; j++){
        if (data[j].parentid == dataList[k].id){
          dataList[k]['child'].push(data[j]);
        }
      }
    }
    // 获取三级诊断分类
    for(var x=0; x<dataList.length; x++){
      for(var y=0; y<dataList[x]['child'].length; y++){
        dataList[x]['child'][y]['child'] = [];
        for (var l=0; l<data.length; l++){
          if (data[l].parentid == dataList[x]['child'][y].id){
            dataList[x]['child'][y]['child'].push(data[l]);
          }
        }
      }
    }
    return dataList;
  }

  // 将三级分类中的每一个对象都加一个check字段
  function addCheck(item){
    for(var i=0; i<item.length; i++){
      item[i]['isCheck'] = false;
      if(item[i]['child']){
        for(var j=0; j<item[i]['child'].length; j++){
          item[i]['child'][j]['isCheck'] = false;
          if(item[i]['child'][j]['child']){
            for(var k=0; k<item[i]['child'][j]['child'].length; k++){
              item[i]['child'][j]['child'][k]['isCheck'] = false;
            }
          }
        }
        // 使用递归函数会导致选中不起作用，原因待查
        //addCheck(item[i]['child']);
      } else {
        break;
      }
    }
    return item;
  }

  // 判断对象是否存在于指定数组中
  function contains(arr, obj) {
    var i = arr.length;
    while (i--) {
      if (arr[i] === obj) {
        return true;
      }
    }
    return false;
  }

// 倒序排序对象
  function reverseObj(obj) {
    var arr = [];
    for (var i in obj) {
      arr.push([obj[i],i]);
    }
    arr.reverse();
    var len = arr.length;
    var objs = {};
    for (var j = 0; j < len; j++) {
      objs[arr[j][1]] = arr[j][0];
    }
    return objs;
  }
export {
  removeByValue,
  curDate,
  getOtherDate,
  getSelect,
  resetData,
  contains,
  addCheck,
  reverseObj,
  dateFormat,
  compareDate,
  date2Str,
  str2Date
}
