/* 数据格式演示
var aqiSourceData = {
  "北京": {
    "2016-01-01": 10,
    "2016-01-02": 10,
    "2016-01-03": 10,
    "2016-01-04": 10
  }
};
*/

// 以下两个函数用于随机模拟生成测试数据
function getDateStr(dat) {
  var y = dat.getFullYear();
  var m = dat.getMonth() + 1;
  m = m < 10 ? '0' + m : m;
  var d = dat.getDate();
  d = d < 10 ? '0' + d : d;
  return y + '-' + m + '-' + d;
}
function randomBuildData(seed) {
  var returnData = {};
  var dat = new Date("2016-01-01");
  var datStr = ''
  for (var i = 1; i < 92; i++) {
    datStr = getDateStr(dat);
    returnData[datStr] = Math.ceil(Math.random() * seed);
    dat.setDate(dat.getDate() + 1);
  }
  return returnData;
}

var aqiSourceData = {
  "北京": randomBuildData(500),
  "上海": randomBuildData(300),
  "广州": randomBuildData(200),
  "深圳": randomBuildData(100),
  "成都": randomBuildData(300),
  "西安": randomBuildData(500),
  "福州": randomBuildData(100),
  "厦门": randomBuildData(100),
  "沈阳": randomBuildData(500)
};

// 用于渲染图表的数据
var chartData = {};

// 记录当前页面的表单选项
var pageState = {
  nowSelectCity: -1,
  nowGraTime: "day"
};
function columns(wrapperWidth, length) {          //计算柱的宽度和位置
  var columnObj = {};
  columnObj.width = Math.floor(wrapperWidth / (length * 2));
  columnObj.gutter = columnObj.width;
  columnObj.offsetLeft = Math.floor((wrapperWidth - columnObj.gutter * (length - 1) - columnObj.width * length) / 2);
  return columnObj;
}
function tooltipsContent(graTime, date, value) {  //生成tooltips里面的内容
  var dateArr = date.split('-');
  var tooltipsStr = '';
  switch (graTime) {
    case 'day':
      tooltipsStr = dateArr[0] + '年' + dateArr[1] + '月' + dateArr[2] + '日<br>[ AQI ]: ' + value;
      break;
    case 'week':
      tooltipsStr = dateArr[0] + '年第' + dateArr[2] + '周<br>[ AQI ]: ' + value;
      break;
    case 'month':
      tooltipsStr = dateArr[0] + '年' + dateArr[1] + '月<br>[ AQI ]: ' + value;
      break;
  }
  return tooltipsStr;
}
/**
 * 渲染图表
 */
function renderChart() {
  var chartHTML = '';
  var chartWrapper = document.getElementById('chart');
  var chartWidth = chartWrapper.clientWidth;
  var displayData = chartData[pageState.nowGraTime][pageState.nowSelectCity];
  var columnsLength = Object.keys(displayData).length;
  var column = columns(chartWidth, columnsLength);
  var i = 0;
  chartHTML += '<div class="tooltips"></div>';
  for (var key in displayData) {
    chartHTML += '<div class="aqi-column" style="height: 0px; width: ' + column.width + 'px; left: ' + (column.offsetLeft + (column.width + column.gutter) * i) + 'px; background-color:#98B8CC;" data-date="' + key + '"></div>';
    i++;
  }
  chartWrapper.innerHTML = chartHTML;
  setTimeout(function(){       //触发transition ,这样写好像不太好。暂时想不到好的。setTimeout延迟执行
    var j = 1;
    for (var key in displayData){ 
      chartWrapper.children[j].style.height = displayData[key] + 'px';
      j++;
    }
  },0);
  var tooltips = document.querySelector('.tooltips');
  chartWrapper.onmouseover = function(event) {  //事件委托. mouseover和mouseout会冒泡到chartWrapper
    var columnTarget = event.target;
    if(columnTarget.className == 'aqi-column') {
      var columnValue = parseInt(columnTarget.style.height);
      tooltips.innerHTML = tooltipsContent(pageState.nowGraTime, columnTarget.dataset.date, columnValue);
      // tooltips的transform，触发过渡效果.因为用all的话也会有opacity的效果. 如何transition只关注left和bottom的变化?
      tooltips.style.transform ='translate(' + (parseInt(columnTarget.style.left) + Math.floor(parseInt(columnTarget.style.width) / 2) - Math.floor(parseInt(tooltips.offsetWidth) / 2)) + 'px' + ',' + (parseInt(chartWrapper.offsetHeight) - columnValue - parseInt(tooltips.offsetHeight) - 10) + 'px' + ')';
      tooltips.style.opacity = '.8';
    }
  }
  chartWrapper.onmouseout = function(event) {
    var columnTarget = event.target;
    if(columnTarget.className == 'aqi-column') {
      tooltips.style.opacity = '0';
    }
  }
}

/**
 * 日、周、月的radio事件点击时的处理函数
 */
function graTimeChange(radio) {
  if (radio.value != pageState.nowGraTime) {  // 确定是否选项发生了变化 
    pageState.nowGraTime = radio.value;       // 设置对应数据
    var radioGroup = document.getElementsByName('gra-time');
    for (var i = 0; i < radioGroup.length; i++) {    // 样式变化
      radioGroup[i].previousElementSibling.className = '';
    }
    radio.previousElementSibling.className = 'active';
    renderChart();                               // 调用图表渲染函数
  }
}

/**
 * select发生变化时的处理函数
 */
function citySelectChange() {
  var citySelected = this.value;
  if (citySelected != pageState.nowSelectCity) {  // 确定是否选项发生了变化 
    pageState.nowSelectCity = citySelected;       // 设置对应数据
    renderChart();                                // 调用图表渲染函数
  }
}

/**
 * 初始化日、周、月的radio事件，当点击时，调用函数graTimeChange
 */
function initGraTimeForm() {
  document.getElementById('aqi-form').onclick = function(event) {
    if (event.target.name == 'gra-time') {
        graTimeChange(event.target);
    }
  }
}

/**
 * 初始化城市Select下拉选择框中的选项
 */
function initCitySelector() {
  // 读取aqiSourceData中的城市，然后设置id为city-select的下拉列表中的选项
  var select = document.getElementById('city-select');
  var cityArr = Object.getOwnPropertyNames(aqiSourceData);
  var optionStr = '';
  cityArr.forEach(function(item) {
    optionStr += '<option>' + item + '</option>';
  })
  select.innerHTML = optionStr;
  pageState.nowSelectCity = select.value;
  // 给select设置事件，当选项发生变化时调用函数citySelectChange
  select.onchange = citySelectChange;
}

/**
 * 初始化图表需要的数据格式
 */
function initAqiChartData() {
  // 将原始的源数据处理成图表需要的数据格式
  // 处理好的数据存到 chartData 中
  var weekDataCount = 0, monthDataCount = 0,
      weekObj = {}, monthObj = {};
  for (var city in aqiSourceData) {
    var weekObjTemp = {}, monthObjTemp = {};    // 加在外面的话 最后monthObj全部引用同一个monthObjTemp(全部都是最后的monthObjTemp)
    var cityDataObj = aqiSourceData[city];
    var dateArr = Object.getOwnPropertyNames(cityDataObj);
    var weekCount = 4, weekDayCount = 0;
    for (var i = 0; i < dateArr.length; i++) {
      monthDataCount += cityDataObj[dateArr[i]];
      weekDataCount += cityDataObj[dateArr[i]];
      weekCount++, weekDayCount++;
      if (i == dateArr.length - 1 || weekCount % 7 == 0) {
        var weekKey = dateArr[i].slice(0, 7) + '-' + Math.ceil(weekCount / 7),
            weekValue = Math.round(weekDataCount / weekDayCount);
        weekObjTemp[weekKey] = weekValue;
        weekDataCount = 0;
        weekDayCount = 0;
      }
      if (i == dateArr.length - 1 || dateArr[i+1].slice(5, 7) != dateArr[i].slice(5, 7)) {
        var monthKey = dateArr[i].slice(0, 7),
            monthValue = Math.round(monthDataCount / dateArr[i].slice(-2));
        monthObjTemp[monthKey] = monthValue;
        monthDataCount = 0;
      }
    }
    weekObj[city] = weekObjTemp;
    monthObj[city] = monthObjTemp;
  }
  chartData.day = aqiSourceData;
  chartData.week = weekObj;
  chartData.month = monthObj;
}

/**
 * 初始化函数
 */
function init() {
  initGraTimeForm();
  initCitySelector();
  initAqiChartData();
  renderChart();
}

init();