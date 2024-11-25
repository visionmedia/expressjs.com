/*
 Copyright (c) 2016 StrongLoop, IBM, and Express Contributors
 License: MIT
*/

$(function(){
  var doc = $(document);

  // top link
  $('#top').click(function(e){
    $('html, body').animate({scrollTop : 0}, 500);
    return false;
  });

  // scrolling links
  var added;
  doc.scroll(function(e){
    if (doc.scrollTop() > 5) {
      if (added) return;
      added = true;
      $('body').addClass('scroll');
    } else {
      $('body').removeClass('scroll');
      added = false;
    }
  })

  // code highlight

  $('code.language-js').each(function(){
    $(this).addClass('language-javascript').removeClass('language-js')
  })

  $('code.language-sh').each(function(){
    $(this).parent().addClass('language-sh')
  })

  Prism.highlightAll()

  // menu bar

  var headings = $('h2, h3').map(function(i, el){
    return {
      top: $(el).offset().top - 200,
      id: el.id
    }
  });

  function closest() {
    var h;
    var top = $(window).scrollTop();
    var i = headings.length;
    while (i--) {
      h = headings[i];
      if (top >= h.top) return h;
    }
  }

  var currentApiPrefix;
  var parentMenuSelector;
  var lastApiPrefix;

  $(window).bind('load resize', function() {

    $('#menu').css('height', ($(this).height() - 150) + 'px');

  });

  $(document).scroll(function() {
    var h = closest();
    if (!h) return;

    currentApiPrefix = h.id.split('.')[0];
    parentMenuSelector = '#'+ currentApiPrefix + '-menu';

    $(parentMenuSelector).addClass('active');

    if (lastApiPrefix && (lastApiPrefix != currentApiPrefix)) {
      $('#'+ lastApiPrefix + '-menu').removeClass('active');
    }

    $('#menu li a').removeClass('active');

    var a = $('a[href="#' + h.id + '"]');
    a.addClass('active');

    lastApiPrefix = currentApiPrefix.split('.')[0];
  })

  // i18n notice
  if (readCookie('i18nClose')) {
    $('#i18n-notice-box').hide()
  }
  else {
    $('#close-i18n-notice-box').on('click', function () {
      $('#i18n-notice-box').hide()
      createCookie('i18nClose', 1);
    })
  }
})



function createCookie(name, value, days) {
  var expires;

  if (days) {
    var date = new Date();
    date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
    expires = "; expires=" + date.toGMTString();
  } else {
   expires = "";
  }
  document.cookie = encodeURIComponent(name) + "=" + encodeURIComponent(value) + expires + "; path=/";
}

function readCookie(name) {
  var nameEQ = encodeURIComponent(name) + "=";
  var ca = document.cookie.split(';');
  for (var i = 0; i < ca.length; i++) {
    var c = ca[i];
    while (c.charAt(0) === ' ') c = c.substring(1, c.length);
    if (c.indexOf(nameEQ) === 0) return decodeURIComponent(c.substring(nameEQ.length, c.length));
  }
  return null;
}

function eraseCookie(name) {
  createCookie(name, "", -1);
}
