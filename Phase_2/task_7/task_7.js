//跨浏览器的绑定事件函数
function addHandler(element, type, handler){
  if (element.addEventListener){
    element.addEventListener(type, handler, false);
  } else if (element.attachEvent) {
    element.attachEvent('on' + type, handler);
  } else {
    element['on' + type] = hander;
  }
}
var queueWrapper = document.getElementById('queue');
var buttonGroup = document.getElementsByTagName('input');
//建立队列对象
var queueObj = {
  queueArray : [],
  //空吗
  isFull : function(){
    return (this.queueArray.length === 60);
  },
  //满吗
  isEmpty : function(){
    return (this.queueArray.length === 0);
  },
  //左入
  leftIn : function(value){
    if (this.isFull()){
      alert('队列已满，不能超过60个');
      return;
    }
    if (value >= 10 && value <= 100){
      this.queueArray.unshift(value);
      this.render();
    }else {
      alert('请输入10-100的数字')
    }
  },
  //右入
  rightIn : function(value){
    if (this.isFull()){
      alert('队列已满，不能超过60个');
      return;
    }
    if (value >= 10 && value <= 100){
      this.queueArray.push(value);
      this.render();
    }else {
      alert('请输入10-100的数字')
    }
  },
  //左出
  leftOut : function(){
    if (!this.isEmpty()){
      alert(this.queueArray.shift());
      this.render();
    }else {
      alert('队列已空,不能再出啦');
    }
  },
  //右出
  rightOut : function(){
    if (!this.isEmpty()){
      alert(this.queueArray.pop());
      this.render();
    }else {
      alert('队列已空,不能再出啦');
    }
  },
  //删除
  deleteValue : function(index){
    this.queueArray.splice(index, 1);
    this.render();
  },
  //渲染
  render : function(){
  //var columnWidth = Math.floor((document.body.clientWidth - 300) / 60) + 'px';
    var queueStr = '';
    this.queueArray.forEach(function(item){
      queueStr += '<div style="height:' + (item * 2) + 'px"></div>';
    });
    queueWrapper.innerHTML = queueStr;
  },
  //随机
  random : function(){
    var arr = [];
    for (var i=0; i<50; i++){
      arr[i] = Math.floor(Math.random() * 90 + 10);
    }
    this.queueArray = arr;
    this.render();
  },
  /*quickSort : function(arr){
    if (arr.length <= 1){
      return arr;
    }
    var pivotIndex = Math.floor(arr.length / 2);
    var pivot = arr[pivotIndex];
    var left = [];
    var right = [];
    for (var i=0; i<arr.length; i++){
      if (i !== pivotIndex){
        if (arr[i] < pivot){
          left.push(arr[i]);
        }else {
          right.push(arr[i]);
        }
      }
    }
    return this.quickSort(left).concat([pivot], this.quickSort(right));
  },*/
  //排序 快排too difficult 先用冒泡吧
  bubbleSort : function(speed){
    var arr = this.queueArray;
    var len = arr.length;
    var i = 0, times = 0, temp = 0, that = this;
    function bubble() {
      if (i === len - 1 - times) {
        i = 0;
        times++;
      }
      if (arr[i] > arr[i+1]){
        temp = arr[i];
        arr[i] = arr[i+1];
        arr[i+1] = temp;
        that.render();
      }
      i++;
      if (times < len - 1){
        setTimeout(bubble, speed); 
      }else {
        alert('排好了咯');
      }
    }
    setTimeout(bubble, speed);
  }
};
//绑定事件
addHandler(document, 'click', function(event){
  var target = event.target;
  //点击元素删除事件
  if (target.parentNode.id === 'queue') {
    var index = 0;
    while (target !== queueWrapper.children[index]){
      index++;
    }
    queueObj.deleteValue(index);
    return;
  }
  var valueInput = document.getElementById('value-input').value;
  switch (target.id) {
    case 'left-in':
      if((/^[0-9]+.?[0-9]*$/).test(valueInput)) {
        queueObj.leftIn(parseFloat(valueInput));
      }else {
        alert('请输入有效的数字');
      }
      break;
    case 'right-in':
      if((/^[0-9]+.?[0-9]*$/).test(valueInput)) {
        queueObj.rightIn(parseFloat(valueInput));
      }else {
        alert('请输入有效的数字');
      }
      break;
    case 'left-out':
      queueObj.leftOut();
      break;
    case 'right-out':
      queueObj.rightOut();
      break;
    case 'random':
      queueObj.random();
      break;
    case 'sort':
      queueObj.bubbleSort(100);
      break;
    default:
      break;
  }
})