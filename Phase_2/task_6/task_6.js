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
  leftIn : function(value){
    this.queueArray.unshift(value);
    this.render();
  },
  rightIn : function(value){
    this.queueArray.push(value);
    this.render();
  },
  leftOut : function(){
    if (this.queueArray.length > 0){
      alert(this.queueArray.shift());
      this.render();
    }else {
      alert('队列已空,不能再出啦');
    }
  },
  rightOut : function(){
    if (this.queueArray.length > 0){
      alert(this.queueArray.pop());
      this.render();
    }else {
      alert('队列已空,不能再出啦');
    }
  },
  deleteValue : function(index){
    this.queueArray.splice(index, 1);
    this.render();
  },
  render : function(){
    var queueStr = '';
    this.queueArray.forEach(function(item){
      queueStr += '<li>' + item + '</li>';
    });
    queueWrapper.innerHTML = queueStr;
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
  //四个按钮的时间
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
    default:
      break;
  }
})