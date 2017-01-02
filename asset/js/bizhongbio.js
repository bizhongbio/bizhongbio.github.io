$(function() {
  var pageName = $(document.body).attr('id');// 页面名称

  switch(pageName) {
    case 'home':// 首页
      handleHome();
      break;
    default:// 匹配不存在
      console.log('该页面暂无 JavaScript 操作！');
  }
  
  // 手机端导航的显示与隐藏
  $('#btn-nav').on('click', function() {
    $('#header, #cat-header').toggleClass('show-nav');
  });

  // 首页处理主函数
  function handleHome() {
    var len = $('#hero-slides .slide').length,
        slideIndex = 1,
        timer;

    // 首页 轮播图切换
    function slidesAnimation() {
      $('#hero-slides .slide').each(function(i) {
        $(this).eq(slideIndex).css('left', '0%').end().not(slideIndex).css('left', (-(slideIndex - i) * 100) + '%');
        $('.slides-nav a').eq(slideIndex).addClass('current').siblings().removeClass('current');
      });

      slideIndex >= len - 1 ? slideIndex = 0 : slideIndex++;
    }

    timer = setInterval(slidesAnimation, 6000);

    // 首页 点击轮播图导航切换
    $('.slides-nav a').each(function() {
      $(this).on('click', function(event) {
        clearInterval(timer);
        slideIndex = $(this).index();
        slidesAnimation();
        event.preventDefault();
      });
    });
  }
});