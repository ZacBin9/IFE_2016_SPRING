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
var queneWrapper = document.getElementById('quene');
var buttonGroup = document.getElementsByTagName('input');
//建立队列对象
var queneObj = {
  queneArray : [],
  leftIn : function(value){
    this.queneArray.unshift(value);
    this.render();
  },
  rightIn : function(value){
    this.queneArray.push(value);
    this.render();
  },
  leftOut : function(){
    if (this.queneArray.length > 0){
      alert(this.queneArray.shift());
      this.render();
    }else {
      alert('队列已空,不能再出啦');
    }
  },
  rightOut : function(){
    if (this.queneArray.length > 0){
      alert(this.queneArray.pop());
      this.render();
    }else {
      alert('队列已空,不能再出啦');
    }
  },
  deleteValue : function(index){
    this.queneArray.splice(index, 1);
    this.render();
  },
  render : function(){
    var queneStr = '';
    this.queneArray.forEach(function(item){
      queneStr += '<li>' + item + '</li>';
    });
    queneWrapper.innerHTML = queneStr;
  }
};

//绑定事件
addHandler(document, 'click', function(event){
  var target = event.target;
  //点击元素删除事件
  if (target.parentNode.id === 'quene') {
    var index = 0;
    while (target !== queneWrapper.children[index]){
      index++;
    }
    queneObj.deleteValue(index);
    return;
  }
  //四个按钮的时间
  var valueInput = document.getElementById('value-input').value;
  switch (target.id) {
    case 'left-in':
      if((/^[0-9]+.?[0-9]*$/).test(valueInput)) {
        queneObj.leftIn(parseFloat(valueInput));
      }else {
        alert('请输入有效的数字');
      }
      break;
    case 'right-in':
      if((/^[0-9]+.?[0-9]*$/).test(valueInput)) {
        queneObj.rightIn(parseFloat(valueInput));
      }else {
        alert('请输入有效的数字');
      }
      break;
    case 'left-out':
      queneObj.leftOut();
      break;
    case 'right-out':
      queneObj.rightOut();
      break;
    default:
      break;
  }
})