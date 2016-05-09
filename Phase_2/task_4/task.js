/**
 * aqiData，存储用户输入的空气指数数据
 * 示例格式：
 * aqiData = {
 *    "北京": 90,
 *    "上海": 40
 * };
 */
var aqiData = {};
/**
 * 从用户输入中获取数据，向aqiData中增加一条数据
 * 然后渲染aqi-list列表，增加新增的数据
 */
function addAqiData() {
  var cityName = document.getElementById('aqi-city-input').value.trim();
  var aqiValue = document.getElementById('aqi-value-input').value.trim();
  if(!(cityName && aqiValue)) {
    alert('两个字段均不能为空');
    return;
  }
  if (!/^[a-zA-Z\u4e00-\u9fa5]+$/.test(cityName)) {
    alert('城市名必须为中英文字符');
    return;
  }
  if (!/^\d+$/.test(aqiValue)) {
    alert('空气质量指数必须为正整数');
    return;
  }
  aqiData[cityName] = aqiValue;
}

/**
 * 渲染aqi-table表格
 */
function renderAqiList() {
  var aqiStr = '<tr><td>城市</td><td>空气质量</td><td>操作</td></tr>';
  for (var props in aqiData) {
    aqiStr += '<tr><td>' + props + '</td><td>' + aqiData[props] + '</td><td><button data-city="' + props + '">删除</button></td></tr>'
  }
  document.getElementById('aqi-table').innerHTML = props ? aqiStr : '';

}

/**
 * 点击add-btn时的处理逻辑
 * 获取用户输入，更新数据，并进行页面呈现的更新
 */
function addBtnHandle() {
  addAqiData();
  renderAqiList();
}

/**
 * 点击各个删除按钮的时候的处理逻辑
 * 获取哪个城市数据被删，删除数据，更新表格显示
 */
function delBtnHandle(city) {
  // do sth.
  delete aqiData[city];
  renderAqiList();
}

function init() {

  // 在这下面给add-btn绑定一个点击事件，点击时触发addBtnHandle函数
  document.getElementById('add-btn').onclick = addBtnHandle;
  // 想办法给aqi-table中的所有删除按钮绑定事件，触发delBtnHandle函数
  document.getElementById('aqi-table').onclick = function(event) {
    var delCity = event.target.dataset.city;
    if (delCity) {                   //判断是否有data-city属性
      delBtnHandle(delCity);         //进行删除
    }
  };
}

init();