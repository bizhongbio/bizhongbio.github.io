function main() {
  function $(id) {
    return document.getElementById(id);
  }

  var onoscroll = $('home') || $('category') || $('page') || $('single') || $('archive') || $('search') || $('tag') || $('404') || $('feed'),
      oBody = document.body || document.getElementsByTagName('body')[0],
      oHeader = $('header') || $('cat-header'),
      oHeaderW = oHeader.getElementsByTagName('div')[0].offsetWidth,
      oNav = $('btn-nav'),
      oMenuNav = oHeader.getElementsByTagName('ul')[0] || $('menu-cat-nav'),
      oShowNav = true,
      oSearch = $('btn-search'),
      oSearchform = $('searchform'),
      oSearchInput = $('s'),
      oGoTop = $('go-top'),
      screenWidth = document.documentElement.clientWidth || document.body.clientWidth,
      screenHeight = document.documentElement.clientHeight || document.body.clientHeight;

  function addEvent(obj, event, fn) {
    if (obj.addEventListener) {
      obj.addEventListener(event, fn, false);
    } else if (obj.attachEvent) {
      obj.attachEvent('on' + event, fn);
    }
  }

  // 阻止元素默认行为
  function stopDefault(e) {
    if (e && e.preventDefault) {// 非IE
      e.preventDefault();
    } else {// IE
      window.event.returnValue = false;
    }
    return false;
  }

  // 阻止冒泡事件
  function cancelBubble(e) {
    if (e && e.stopPropagation) {// 非IE
      e.stopPropagation();
    } else {// IE
      window.event.cancelBubble = true;
    }
    return false;
  }

  // 搜索框的显示与隐藏
  function showSearch() {
    if (screenWidth <= 1023) {
      oSearchform.style.cssText = 'display:block;';
      oSearchInput.style.width = (oHeaderW - 32) + 'px';
      oSearchInput.focus();
      var oMask = document.createElement('div');
      oMask.id = 'mask';
      oBody.appendChild(oMask);
      oSearchInput.onclick = function(e) {
        cancelBubble(e);
      };
      $('mask').onclick = function() {
        oSearchform.style.cssText = '';
        oSearchInput.style.width = 'auto';
        oSearchInput.blur();
        oBody.removeChild(oMask);
      };
    }
  }

  // 导航菜单的显示与隐藏
  function showNav() {
    if (screenWidth <= 767) {
      var oNavIcon = oNav.getElementsByTagName('i')[0];

      if (oShowNav) {
        oMenuNav.style.height = '321px';
        oNavIcon.className = 'fa fa-remove';
        oSearch.style.display = 'none';
        if ($('menu-cat-nav')) {
          $('menu-cat-nav').style.top = '48px';
        }
        var oMask = document.createElement('div');
        oMask.id = 'mask';
        oBody.appendChild(oMask);
        oShowNav = false;
        $('mask').onclick = function() {
          oMenuNav.style.height = '0px';
          oNavIcon.className = 'fa fa-navicon';
          oSearch.style.cssText = '';
          oBody.removeChild(oMask);
          oShowNav = true;
        };
      } else {
        oMenuNav.style.height = '0px';
        oNavIcon.className = 'fa fa-navicon';
        oSearch.style.cssText = '';
        oBody.removeChild($('mask'));
        oShowNav = true;
      }
    }
  }

  // 滚动特效
  function scrollEvevt() {
    var scrollHeight = document.documentElement.scrollTop || document.body.scrollTop;

    // 返回顶部
    if (scrollHeight >= 900) {
      oGoTop.style.display = 'block';
    } else {
      oGoTop.style.display = 'none';
    }
    if ($('category') || $('tag') || $('search') || $('single')) {
      var oMenuCatNav = $('menu-cat-nav');

      if (scrollHeight >= 32) {
        oHeader.className = 'cat-header-fixed';
        oMenuCatNav.style.top = '48px';
      } else {
        oHeader.className = 'cat-header';
        oMenuCatNav.style.top = '80px';
      }
    }
  }

  if ($('home')) {// 首页
    var oSlides = $('hero-slides'),
        oSlideAll = oSlides.getElementsByTagName('section'),
        len = oSlideAll.length,
        oSlidesNav = oSlides.getElementsByTagName('nav')[0],
        oSlidesNavAll = oSlidesNav.getElementsByTagName('a'),
        items = oSlidesNavAll.length,
        oSlideIndex = 1,
        timer = null;

    // 图片轮播
    function slides() {
      var oPerNum = oSlideIndex,
          oNextNum = len - 1 - oSlideIndex;

      oSlideAll[oSlideIndex].style.left = '0%';
      for (var i = 0; i < oPerNum; i++) {
        oSlideAll[i].style.left = (-(oPerNum - i) * 100) + '%';
      }
      for (var j = oSlideIndex + 1; j < len; j++) {
        oSlideAll[j].style.left = ((j - oSlideIndex) * 100) + '%';
      }
      for (var k = 0; k < items; k++) {
        if (k == oSlideIndex) {
          oSlidesNavAll[k].className = 'current';
        } else {
          oSlidesNavAll[k].removeAttribute('class');
        }
      }
      oSlideIndex >= len - 1 ? oSlideIndex = 0 : oSlideIndex++;
    }

    // 自动切换
    timer = setInterval(slides, 6000);

    // 鼠标移入清除定时器
    oSlides.onmouseover = function() {
      clearInterval(timer);
    };

    // 鼠标移出设置定时器
    oSlides.onmouseout = function() {
      timer = setInterval(slides, 6000);
    };

    // 点击轮播图导航菜单切换
    for (var i = 0; i < items; i++) {
      oSlidesNavAll[i].index = i;
      oSlidesNavAll[i].onclick = function(e) {
        clearInterval(timer);
        oSlideIndex = this.index;
        slides();
        stopDefault(e);
      };
    }

    // 按键盘左右键切换
    document.onkeydown = function(event) {
      var e = event || window.event || arguments.callee.caller.arguments[0];

      if (e && e.keyCode == 37) {// 键盘左键
        clearInterval(timer);
        oSlideIndex >= 2 ? oSlideIndex -= 2 : oSlideIndex += 2;
        slides();
      } else if (e && e.keyCode == 39) {// 键盘右键
        clearInterval(timer);
        slides();
      }
    };
  } else if ($('page-work')) {// 作品页面
    // 作品瀑布流布局
    function waterfall(parent, children) {
      var oWorks = $(parent),
          oWorkAll = oWorks.getElementsByTagName(children),
          oWorkW = oWorkAll[0].offsetWidth,
          oColumns = Math.floor(oWorks.offsetWidth / oWorkW),
          oColumnsH = [],
          oClickAgain = false;

      for (var i = 0, len = oWorkAll.length; i < len; i++) {
        var oColumnIndex;

        if (i < oColumns) {
          oColumnsH[i] = oWorkAll[i].offsetHeight;
          oWorkAll[i].style.cssText = 'position:absolute;top:0px;left:' + i * oWorkW + 'px;';
        } else {
          var oColumnMinH = Math.min.apply(null, oColumnsH);

          for (j in oColumnsH) {
            if (oColumnsH[j] === oColumnMinH) {
              oColumnIndex = j;
            }
          }
          oWorkAll[i].style.cssText = 'position:absolute;top:' + oColumnMinH + 'px;left:' + oColumnIndex * oWorkW + 'px;';
          oColumnsH[oColumnIndex] += oWorkAll[i].offsetHeight;
        }
      }
      oWorks.style.height = Math.max.apply(null, oColumnsH) + 'px';
      for (var i = 0, len = oWorkAll.length; i < len; i++) {
        oWorkAll[i].index = i;
        oWorkAll[i].onclick = function() {
          if (!oClickAgain) {
            var oWorkC = oWorkAll[this.index],
              oWorkCT = oWorkC.style.top,
              oWorkCL = oWorkC.style.left,
              scrollHeight = document.documentElement.scrollTop || document.body.scrollTop,
              oBoundingClientT = oWorkC.getBoundingClientRect().top;

            scrollHeight += oBoundingClientT;
            document.documentElement.scrollTop = document.body.scrollTop = scrollHeight;
            oWorkC.className += ' work-current';
            oWorkC.style.left = '50%';
            oClickAgain = true;
            var oWorkMask = document.createElement('div');
            oWorkMask.id = 'work-mask';
            oBody.appendChild(oWorkMask);
            if (oClickAgain) {
              var oWorkMask = $('work-mask');
              oWorkMask.onclick = function() {
                oWorkC.className = 'work';
                oWorkC.style.left = oWorkCL;
                oClickAgain = false;
                oBody.removeChild(oWorkMask);
              };
            }
          }
        };
      }
    }

    waterfall('works', 'article');
  } else if ($('page-video')) {// 视频页面
    var oVideos = $('videos'),
        oVideoAll = oVideos.getElementsByTagName('article'),
        oVideoH = oVideoAll[0].offsetHeight,
        oVideoT = 0,
        oCount = 0,
        oClickAgain = false,
        oVideoSrc = [
          'videos/video-20151031.mp4',
          'videos/video-20150922.mp4',
          'videos/video-20150407.mp4',
          'videos/video-20140619.mp4'
        ];

    for (var i = 0, len = oVideoAll.length; i < len; i++) {
      if (i % 2 === 0) {
        oVideoAll[i].style.cssText = 'position:absolute;top:' + oVideoT + 'px;left:0%;';
        oCount++;
      } else {
        oVideoAll[i].style.cssText = 'position:absolute;top:' + oVideoT + 'px;left:50%;';
        oCount++;
      }
      if (oCount % 2 === 0) {
        oVideoT += oVideoH;
      }
    }
    oVideos.style.height = (oVideoH * (oVideoAll.length / 2) + 64) + 'px';

    // 视频点击特效
    for (var i = 0, len = oVideoAll.length; i < len; i++) {
      oVideoAll[i].index = i;
      oVideoAll[i].onclick = function() {
        if (!oClickAgain) {
          var oVideoC = oVideoAll[this.index],
              oVideoCL = oVideoC.style.left,
              scrollHeight = document.documentElement.scrollTop || document.body.scrollTop,
              oBoundingClientT = oVideoC.getBoundingClientRect().top;

          scrollHeight += (oBoundingClientT - (screenHeight - oVideoH) / 2);
          document.documentElement.scrollTop = document.body.scrollTop = scrollHeight;
          oBody.style.overflowY = 'hidden';
          oVideoC.className += ' video-current';
          oVideoC.style.left = '50%';
          oClickAgain = true;
          var oVideoMask = document.createElement('div');
          oVideoMask.id = 'video-mask';
          oBody.appendChild(oVideoMask);
          var oVideoPlayer = document.createElement('video');
          oVideoPlayer.className = 'video-player';
          oVideoPlayer.src = oVideoSrc[this.index];
          oVideoPlayer.controls = 'controls';
          oVideoPlayer.autoplay = 'autoplay';
          oVideoPlayer.innerHTML = '您的浏览器不支持视频标签';
          oVideoCover = oVideoC.getElementsByTagName('div')[0];
          oVideoCover.insertBefore(oVideoPlayer, oVideoCover.firstChild);
          if (oClickAgain) {
            var oVideoMask = $('video-mask');
            oVideoMask.onclick = function() {
              oBody.style.overflowY = 'visible';
              oVideoC.className = 'video';
              oVideoC.style.left = oVideoCL;
              oClickAgain = false;
              oBody.removeChild(oVideoMask);
              oVideoCover.removeChild(oVideoPlayer);
            };
          }
        }
      };
    }
  }

  addEvent(oSearch, 'click', function() {
    showSearch();
  });

  addEvent(oNav, 'click', function() {
    showNav();
  });

  addEvent(window, 'scroll', function() {
    scrollEvevt();
  });

  addEvent(window, 'resize', function() {
    screenWidth = document.documentElement.clientWidth || document.body.clientWidth;
    screenHeight = document.documentElement.clientHeight || document.body.clientHeight;
    oHeaderW = oHeader.getElementsByTagName('div')[0].offsetWidth;
    scrollEvevt();
    if ($('page-work')) {
      waterfall('works', 'article');
    }
  });
};

document.addEventListener('DOMContentLoaded', main, false);