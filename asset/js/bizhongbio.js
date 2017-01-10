$(function() {
  var pageName = $(document.body).attr('id');// 页面名称

  switch(pageName) {
    case 'home':// 首页
      handleHome();
      break;
    case 'category':// 分类目录页面
      handleArticle();
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
        $('#menu-cat-nav').css('paddingTop', '48px');
      } else {
        $('#cat-header').removeClass('cat-header-fixed');
        $('#menu-cat-nav').css('paddingTop', '80px');
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
    $('body, html').animate({scrollTop: 0}, 600);
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
      if (event.keyCode === 37) {// 左方向键
        clearInterval(timer);
        slideIndex >= 2 ? slideIndex -= 2 : slideIndex += 2;
        slidesAnimation();
      } else if (event.keyCode === 39) {// 右方向键
        clearInterval(timer);
        slidesAnimation();
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

  // ------------------------------------------------------------------ 分类目录

  // 分类目录处理主函数
  function handleArticle() {
    // 点击分类目录导航链接，显示对应分类目录文章
    $('#menu-cat-nav li').each(function(i) {
      $(this).on('click', function() {
        $(this).addClass('current-menu-item').siblings().removeClass('current-menu-item');
        $('.posts').eq(i).show().siblings('.posts').hide();
      });
    });

    catHeaderFixed();
  }
});