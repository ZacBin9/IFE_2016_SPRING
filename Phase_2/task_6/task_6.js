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
  leftOut : function(){},
  rightOut : function(){},
  render : function(){
    var queneStr = '';
    this.queneArray.forEach(function(item){
      queneStr += '<li>' + item + '</li>';
    });
    queneWrapper.innerHTML = queneStr;
  }
};
addHandler(document, 'click', function(event){
  var valueInput = document.getElementById('value-input').value;
  var target = event.target;
  switch (target.id) {
    case 'left-in':
      queneObj.leftIn(valueInput);
      break;
    case 'right-in':
      queneObj.rightIn(valueInput);
      break;
    case 'left-out':
      break;
    case 'right-out':
      break;
    default:
      break;
  }
})