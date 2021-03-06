var $ = function(id) {
  return document.getElementById(id);
};
var slides = function() {
  var oPerNum = index,
  oNextNum = len - 1 - index;
  oSSImageAll[index].style.left = '0%';
  for (var i = 0; i < oPerNum; i++) {
    oSSImageAll[i].style.left = ( - (oPerNum - i) * 100) + '%';
  }
  for (var j = index + 1; j < len; j++) {
    oSSImageAll[j].style.left = ((j - index) * 100) + '%';
  }
  for (var k = 0; k < pwvLen; k++) {
    oPWVImageAll[k].index = k;
    if (k == pwvIndex) {
      oPWVImageAll[k].style.cssText = 'z-index: 2;opacity: 1;';
      for (var r = 0; r < pwvLen; r++) {
        oPWVImageAll[r].index = r;
        if (k != r) {
          oPWVImageAll[r].style.cssText = 'z-index: 1;opacity: 0;';
        }
      }
    }
  }
  index >= len - 1 ? index = 0 : index++;
  pwvIndex >= pwvLen - 1 ? pwvIndex = 0 : pwvIndex++;
};
var oSSImage = $('section-slides-image'),
oSSImageAll = oSSImage.getElementsByTagName('figure'),
len = oSSImageAll.length,
oPWVImage = $('section-pwv-image'),
oPWVImageAll = oPWVImage.getElementsByTagName('figure'),
pwvLen = oPWVImageAll.length,
index = 1,
pwvIndex = 1,
timer = setInterval(slides, 4000),
oSAImage = $('section-articles-image'),
oSCategory = $('section-category'),
ofontAwesome = $('section-font-awesome-image'),
oGoTop = $('go-top'),
screenWidth = document.documentElement.clientWidth || document.body.clientWidth,
screenHeight = document.documentElement.clientHeight || document.body.clientHeight;

var addEvent = function(obj, event, fn) {
  if (obj.addEventListener) {
    obj.addEventListener(event, fn, false);
  } else if (obj.attachEvent) {
    obj.attachEvent('on' + event, fn);
  }
};
// 滚动特效
var scrollEvevt = function() {
  var scrollHeight = document.documentElement.scrollTop || document.body.scrollTop;
  // 返回顶部
  if (scrollHeight >= 900) {
    oGoTop.style.display = 'block';
  } else {
    oGoTop.style.display = 'none';
  }
  if (scrollHeight > 567 && scrollHeight <= 1134) {
    oSAImage.style.cssText = 'animation: articles-show 3s ease forwards;';
  }
  if (scrollHeight > 1134 && scrollHeight <= 1803) {
    oSCategory.className = 'section section-category section-category-fadeIn';
  }
  if (scrollHeight > 2323 && scrollHeight <= 2973) {
    ofontAwesome.style.opacity = '1';
  }
};
addEvent(window, 'scroll',
function() {
  scrollEvevt();
});
addEvent(window, 'resize',
function() {
  screenWidth = document.documentElement.clientWidth || document.body.clientWidth;
  screenHeight = document.documentElement.clientHeight || document.body.clientHeight;
  scrollEvevt();
});