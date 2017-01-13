$(function() {
  var pageName = $(document.body).attr('id');// 页面名称

  switch(pageName) {
    case 'home':// 首页
      handleHome();
      break;
    case 'category':// 分类目录页面
      handleArticle();
      catHeaderFixed();
      break;
    case 'page-work':// 作品页面
      handleWork();

      // 当调整浏览器窗口的大小时，重新作品页面处理主函数
      $(window).on('resize', function() {
        handleWork();
      });
      break;
    default:// 匹配不存在
      console.log('Nothing to do.');
  }

  // ------------------------------------------------------------------ 公共
  
  // 手机端点击汉堡菜单链接，导航菜单显示与隐藏
  $('#btn-nav').on('click', function() {
    $('#header, #cat-header').toggleClass('show-nav');

    if ($('#header, #cat-header').hasClass('show-nav')) {
      $('#btn-nav i').removeClass('fa-navicon').addClass('fa-remove');
      $('body, html').on('touchmove', function(event) {
        event.preventDefault();
      });
    } else {
      $('#btn-nav i').removeClass('fa-remove').addClass('fa-navicon');
      $('body, html').off('touchmove');
    }
  });

  // 分类目录页面、文章页面、搜索页面、标签页面 分类目录头部固定
  function catHeaderFixed() {

    // 分类目录头部固定 滚动条距顶部 32 像素以上，分类目录头部固定，否则不固定
    $(window).on('scroll', function() {
      if ($(this).scrollTop() > 32) {
        $('#cat-header').addClass('cat-header-fixed');

        // 浏览器当前窗口文档对象宽度低于 768 像素执行
        if ($(window).width() < 768) {
          $('#menu-cat-nav').css('paddingTop', '48px');
        }
      } else {
        $('#cat-header').removeClass('cat-header-fixed');

        // 浏览器当前窗口文档对象宽度低于 768 像素执行
        if ($(window).width() < 768) {
          $('#menu-cat-nav').removeAttr("style");
        }
      }
    });
  }

  // 返回顶部 滚动条距顶部 600 像素以上，返回顶部链接出现，否则隐藏
  $(window).on('scroll', function() {
    if ($(this).scrollTop() > 600) {
      $('#go-top').fadeIn(300);
    } else {
      $('#go-top').fadeOut(300);
    }
  });

  // 返回顶部 点击返回顶部链接，返回顶部
  $('#go-top').on('click', function(event) {
    $('body, html').animate({'scrollTop': '0'}, 600);
    event.preventDefault();
  });

  // ------------------------------------------------------------------ 首页

  // 首页处理主函数
  function handleHome() {
    var len = $('#hero-slides .slide').length,// 轮播图张数
        slideIndex = 1,// 当前轮播图索引
        timer,// 定时器
        startPosition = {},// 开始位置
        endPosition = {},// 结束位置
        isScrolling = -1; // 判断是水平滚动还是垂直滚动

    // 轮播图自动切换
    function slidesAnimation() {
      $('#hero-slides .slide').each(function(i) {
        $(this).eq(slideIndex).css('left', '0%').end().not(slideIndex).css('left', (-(slideIndex - i) * 100) + '%');
        $('.slides-nav a').eq(slideIndex).addClass('current').siblings().removeClass('current');
      });

      slideIndex >= len - 1 ? slideIndex = 0 : slideIndex++;
    }

    timer = setInterval(slidesAnimation, 6000);

    // 点击轮播图导航菜单，切换轮播图
    $('.slides-nav a').each(function() {
      $(this).on('click', function(event) {
        clearInterval(timer);
        slideIndex = $(this).index();
        slidesAnimation();
        event.preventDefault();
      });
    });

    // 按下键盘左右方向键，切换轮播图
    $(document).on('keydown', function(event) {
      switch(event.keyCode) {
        case 37:// 左方向键
          clearInterval(timer);
          slideIndex >= 2 ? slideIndex -= 2 : slideIndex += 2;
          slidesAnimation();
          break;
        case 39:// 右方向键
          clearInterval(timer);
          slidesAnimation();
          break;
      }
    });

    // 触屏设备左右滑动，切换轮播图

    // 滑动开始
    $('#hero-slides').on('touchstart', function(event) {
      var touch = event.targetTouches[0];
      startPosition = {
        x: touch.pageX,
        y: touch.pageY
      };
    });

    // 滑动
    $('#hero-slides').on('touchmove', function(event) {
      if (event.targetTouches.length === 1) {
        var touch = event.targetTouches[0];
        endPosition = {
          x: touch.pageX - startPosition.x,
          y: touch.pageY - startPosition.y
        };
        isScrolling = Math.abs(endPosition.x) > Math.abs(endPosition.y) ? 0 : 1;// 0：水平滚动，1：垂直滚动

        if (isScrolling === 0) {// 水平滚动
          event.preventDefault();
        }
      }
    });

    // 滑动释放
    $('#hero-slides').on('touchend', function(event) {
      if (isScrolling === 0) {// 水平滚动
        if (endPosition.x > 10) {// 右滑
          clearInterval(timer);
          slideIndex >= 2 ? slideIndex -= 2 : slideIndex += 2;
          slidesAnimation();
        } else if (endPosition.x < -10) {// 左滑
          clearInterval(timer);
          slidesAnimation();
        }
      }
    });
  }

  // ------------------------------------------------------------------ 分类目录页面

  // 分类目录页面处理主函数
  function handleArticle() {

    // 点击分类目录导航链接，显示对应分类目录文章
    $('#menu-cat-nav li').each(function(i) {
      $(this).on('click', function() {
        $(this).addClass('current-menu-item').siblings().removeClass('current-menu-item');
        $('.posts').eq(i).show().siblings('.posts').hide();

        // 浏览器当前窗口文档对象宽度低于 768 像素执行
        if ($(window).width() < 768) {
          $('#cat-header').toggleClass('show-nav');
          $('#btn-nav i').removeClass('fa-remove').addClass('fa-navicon');
          $('#menu-cat-nav').removeAttr("style");
          $('body, html').off('touchmove');
        }
      });
    });
  }

  // ------------------------------------------------------------------ 作品页面

  // 作品页面处理主函数
  function handleWork() {
    var workWidth = $('#works .work').width(),// 单个作品宽度
        columns = Math.floor($('#works').width() / workWidth),// 作品列数
        columnsHeight = [];// 作品列高
    
    // 每个作品定位
    $('#works .work').each(function(i) {
      var columnIndex = 0;// 作品列索引
      if (i < columns) {// 作品第一行
        columnsHeight[i] = $(this).height();// 当前作品图片高度写进数组
        $(this).css({
          'position': 'absolute',
          'top': '0px',
          'left': i * workWidth + 'px'
        });
      } else {// 作品其它行
        var columnMinHeight = Math.min.apply(null, columnsHeight);// 作品图片最小列高
        $.each(columnsHeight, function(j) {
          if (columnsHeight[j] === columnMinHeight) {
            columnIndex = j;
          }
        });

        $(this).css({
          'position': 'absolute',
          'top': columnMinHeight + 'px',
          'left': columnIndex * workWidth + 'px'
        });
        columnsHeight[columnIndex] += $(this).height();
      }
    });

    $('#works').css({'height': Math.max.apply(null, columnsHeight) + 'px'});

    // 作品点击放大图片
    $('#works .work').on('click', function(event) {
      var self = $(this);// 当前点击的作品对象

      // 当前点击的作品有 work-current 类，不可再次点击
      if (!self.hasClass('work-current')) {
        var workLeft = self.css('left');// 当前点击的作品距离左边的距离

        $('#mask').css('display', 'block');
        $('body, html').scrollTop(self.offset().top);// 滚动条滚动到当前点击的作品距离文档的上方位置

        $(this).addClass('work-current').siblings().removeClass('work-current');
        $(this).css('left', '50%');
      }

      // 蒙版点击退出
      $('#mask').on('click', function() {
        self.removeClass('work-current').css('left', workLeft);
        $('#mask').css('display', 'none');
      });
    });
  }
});