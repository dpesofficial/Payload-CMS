//  RUN cat custom.js motors.js two-col-slider.js > final.js on windows terminal
// JavaScript to add the 'loaded' class to the body element on page load
window.addEventListener("DOMContentLoaded", function () {
  document.body.classList.add("loaded");
});

(function ($) {
  const SCROLL_SPY_DEPRECIATED = (function () {
    const $anchorMenu = $(".anchor_menu");
    const $textElement = $anchorMenu.find(".anchor_left h5");
    const initialText = $textElement.text();

    const observerIntersection = function (entries) {
      // Hamburger is visible for responsive display only. So, if visible, then we are in mobile view.
      const isMobile = $(".header-mega .mega-menu .hamburger").is(":visible");

      entries.forEach((entry) => {
        const id = entry.target.id;

        if (entry.isIntersecting && id && id !== "#") {
          $anchorMenu.find("a.active").removeClass("active");
          $anchorMenu.find('a[href="#' + id + '"]').addClass("active");
          if (isMobile) {
            const text = $anchorMenu.find("a.active").text();
            $textElement.text(text);
          } else {
            $textElement.text(initialText);
          }
        } else {
          $anchorMenu.find('a[href="#' + id + '"]').removeClass("active");
        }
      });

      if (!$anchorMenu.find("a.active").length) {
        $textElement.text(initialText);
      }
    };

    const init = function () {
      if (typeof undefined === typeof window.IntersectionObserver) {
        return;
      }

      const observeThreshold = [];
      $.each($(".anchor_block"), function (index, element) {
        const height = $(element).outerHeight(true);
        const threshold = 200; // in px.

        observeThreshold.push((threshold / height).toFixed(2));
      });

      console.log(observeThreshold);

      const observer = new IntersectionObserver(observerIntersection, {
        root: null,
        rootMargin: "0px",
        threshold: observeThreshold,
      });

      $.each($(".anchor_block"), function (index, ele) {
        observer.observe(ele);
      });
    };

    return {
      init: init,
    };
  })();

  // SCROLL_SPY_DEPRECIATED.init();

  const SCROLL_SYP = (function () {
    const $watchElement = $(".anchor_block");

    if (!$watchElement.length) {
      return {
        init: function () { },
      };
    }

    const windowHeight = $(window).innerHeight();
    const viewPortThreshold = 0.4 * windowHeight;
    const $anchorMenu = $(".anchor_menu");
    const $textElement = $anchorMenu.find(".anchor_left h5");
    const initialText = $textElement.text().trim();
    let currentElement = null;
    let timeOut = null;

    const updateAnchorMenuText = function (prevText, nextText, isMobile) {
      if (!isMobile) {
        $anchorMenu.find("a.active").removeClass("active");
      }

      if (prevText && prevText !== nextText) {
        $textElement.text(nextText);
      }
    };

    const scrollSpy = function () {
      const currentText = $textElement.text().trim();

      try {
        $.each($watchElement, function (index, element) {
          if ($(element).find(".anchor_block").length) {
            $.each($(element).find(".anchor_block"), function (index, element) {
              const id = element.id;

              if (id && id !== "#") {
                if (
                  element.getBoundingClientRect().top - viewPortThreshold <=
                  0 &&
                  element.getBoundingClientRect().bottom - viewPortThreshold >=
                  0
                ) {
                  currentElement = element;
                  throw new Error("hasActiveMenu"); // Break loop
                }
              }
            });
          }

          const id = element.id;

          if (id && id !== "#") {
            if (
              element.getBoundingClientRect().top - viewPortThreshold <= 0 &&
              element.getBoundingClientRect().bottom - viewPortThreshold >= 0
            ) {
              currentElement = element;
              throw new Error("hasActiveMenu"); // Break loop
            }
          }
        });

        // currentElement = null;
        throw new Error("noActiveMenu");
      } catch (Exception) {
        const message = Exception.message;
        const isMobile = $(".header-mega .mega-menu .hamburger").is(":visible");

        if ("noActiveMenu" === message) {
          const $_watchElements = [];
          $.each($watchElement, function (index, e) {
            $_watchElements.push(e);
          });

          const indexOf = $_watchElements.indexOf(currentElement);
          if (0 === indexOf) {
            updateAnchorMenuText(currentText, initialText, isMobile);
            return;
          }

          updateAnchorMenuText(currentText, currentText, isMobile);
          return;
        }

        if (null === currentElement) {
          // updateAnchorMenuText(currentText, currentText, isMobile);
          return;
        }

        if (typeof undefined === typeof currentElement.id) {
          // updateAnchorMenuText(currentText, currentText, isMobile);
          return;
        }

        const id = currentElement.id;
        if (!id || "" == id) {
          // updateAnchorMenuText(currentText, currentText, isMobile);
          return;
        }

        if (!$anchorMenu.find('a[href="#' + id + '"]').length) {
          // updateAnchorMenuText(currentText, currentText, isMobile);
          return;
        }

        if ("hasActiveMenu" === message && null !== currentElement) {
          $anchorMenu.find("a.active").removeClass("active");
          $anchorMenu.find('a[href="#' + id + '"]').addClass("active");

          if (isMobile) {
            const text = $anchorMenu.find("a.active").text().trim();

            updateAnchorMenuText(currentText, text, isMobile);
          }
        }
      }
    };

    const init = function () {
      $(window).on("scroll", scrollSpy);
      $(window).on("resize orientationchange", scrollSpy);

      $anchorMenu.on("click", ".anchor_left h5", function (e) {
        e.preventDefault();
        let target = $("body");
        const isMobile = $(".header-mega .mega-menu .hamburger").is(":visible");

        if (isMobile && $anchorMenu.find("a.active").length) {
          target = $anchorMenu.find("a.active").attr("href");
        }

        $("html, body").animate({ scrollTop: $(target).offset().top - 100 }, 0);
        return false;
      });

      $anchorMenu.on("click", ".anchor_head", function (e) {
        e.preventDefault();
        const $target = $("body");

        $("html, body").animate({ scrollTop: $target.offset().top - 100 }, 0);

        e.stopPropagation(); // Prevent the click event from bubbling up to the anchor_menu
        $(".anchor_menu").removeClass("popup-active");
        $("#overlay_anchor").removeClass("overlay-shown");
        $(".header-mega").removeClass("lower-zindex");
        $target.removeClass("overflow-hide");

        return false;
      });
    };

    return {
      init: init,
    };
  })();

  SCROLL_SYP.init();
})(jQuery);

(function ($) {
  if (jQuery(".interactive_component").length > 0) {
    // Instantly scroll the page to the top
    jQuery("html, body").scrollTop(0);
  }

  const SHUTTER_APPLICATIONS = (function () {
    const $applicationWrapper = $(".shutter-applications");

    // Default slider, i.e., slider of initial active state tab content.
    const defaultSlider = function () {
      const $firstSlider = $applicationWrapper.find(
        ".description.active .application-showcase-slider"
      );
      if ($firstSlider.length) {
        $firstSlider.slick({
          prevArrow:
            '<button type="button" class="slick-prev"><svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="40.113" height="40.113" viewBox="0 0 40.113 40.113"><defs><clipPath id="clip-path"><rect id="Rectangle_2108" data-name="Rectangle 2108" width="40.113" height="40.113" transform="translate(0 0)" fill="#1d283c"/></clipPath></defs><g id="Group_2431" data-name="Group 2431" transform="translate(40.113 40.113) rotate(180)"><g id="Group_2381" data-name="Group 2381" clip-path="url(#clip-path)"><path id="Path_8260" data-name="Path 8260" d="M34.231,5.866A20.057,20.057,0,1,0,40.113,20.04,20.056,20.056,0,0,0,34.231,5.866" fill="#121e2e" fill-rule="evenodd"/><path id="Path_8261" data-name="Path 8261" d="M18.6,25.309l-1.365-1.365,3.872-3.878-3.87-3.894L18.6,14.8l5.255,5.252Z" fill="#fff" fill-rule="evenodd"/></g></g></svg></button>',
          nextArrow:
            '<button type="button" class="slick-next"><svg id="Group_2430" data-name="Group 2430" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="40.113" height="40.113" viewBox="0 0 40.113 40.113"><defs><clipPath id="clip-path"><rect id="Rectangle_2108" data-name="Rectangle 2108" width="40.113" height="40.113" transform="translate(0 0)" fill="#1d283c"/></clipPath></defs><g id="Group_2381" data-name="Group 2381" clip-path="url(#clip-path)"><path id="Path_8260" data-name="Path 8260" d="M34.231,5.866A20.057,20.057,0,1,0,40.113,20.04,20.056,20.056,0,0,0,34.231,5.866" fill="#121e2e" fill-rule="evenodd"/><path id="Path_8261" data-name="Path 8261" d="M18.6,25.309l-1.365-1.365,3.872-3.878-3.87-3.894L18.6,14.8l5.255,5.252Z" fill="#fff" fill-rule="evenodd"/></g></svg></button>',
        });
      }
    };

    // Other tab content slider.
    const tabSliders = function () {
      console.log($(".shutter-applications .nav-link"));
      $applicationWrapper.on("click", ".nav-link", function (event) {
        const target = $(event.currentTarget).data("bs-target");

        const $targetSlider = $(target).find(".application-showcase-slider");
        // If slider already initialized, do nothing.
        setTimeout(function () {
          if ($targetSlider.length) {
            if ($targetSlider.hasClass("slick-initialized")) {
              $targetSlider.slick("unslick");
            }
            $targetSlider.slick({
              prevArrow:
                '<button type="button" class="slick-prev"><svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="40.113" height="40.113" viewBox="0 0 40.113 40.113"><defs><clipPath id="clip-path"><rect id="Rectangle_2108" data-name="Rectangle 2108" width="40.113" height="40.113" transform="translate(0 0)" fill="#1d283c"/></clipPath></defs><g id="Group_2431" data-name="Group 2431" transform="translate(40.113 40.113) rotate(180)"><g id="Group_2381" data-name="Group 2381" clip-path="url(#clip-path)"><path id="Path_8260" data-name="Path 8260" d="M34.231,5.866A20.057,20.057,0,1,0,40.113,20.04,20.056,20.056,0,0,0,34.231,5.866" fill="#121e2e" fill-rule="evenodd"/><path id="Path_8261" data-name="Path 8261" d="M18.6,25.309l-1.365-1.365,3.872-3.878-3.87-3.894L18.6,14.8l5.255,5.252Z" fill="#fff" fill-rule="evenodd"/></g></g></svg></button>',
              nextArrow:
                '<button type="button" class="slick-next"><svg id="Group_2430" data-name="Group 2430" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="40.113" height="40.113" viewBox="0 0 40.113 40.113"><defs><clipPath id="clip-path"><rect id="Rectangle_2108" data-name="Rectangle 2108" width="40.113" height="40.113" transform="translate(0 0)" fill="#1d283c"/></clipPath></defs><g id="Group_2381" data-name="Group 2381" clip-path="url(#clip-path)"><path id="Path_8260" data-name="Path 8260" d="M34.231,5.866A20.057,20.057,0,1,0,40.113,20.04,20.056,20.056,0,0,0,34.231,5.866" fill="#121e2e" fill-rule="evenodd"/><path id="Path_8261" data-name="Path 8261" d="M18.6,25.309l-1.365-1.365,3.872-3.878-3.87-3.894L18.6,14.8l5.255,5.252Z" fill="#fff" fill-rule="evenodd"/></g></svg></button>',
            });
          }
        }, 300);
      });
    };

    const init = function () {
      if (!$applicationWrapper.length) {
        return;
      }

      defaultSlider();
      tabSliders();
    };

    return {
      init: init,
    };
  })();

  SHUTTER_APPLICATIONS.init();
})(jQuery);

jQuery(document).ready(function ($) {
  function heroSlick() {
    $(".hero_parent").slick({
      slidesToShow: 1,
      slidesToScroll: 1,
      arrows: false,
      dots: true,
      fade: true,
      asNavFor: ".hero_child",
      speed: 500,
      cssEase: "linear",
      infinite: true,
      rows: 0,
    });
    $(".hero_child").slick({
      slidesToShow: 1,
      slidesToScroll: 1,
      asNavFor: ".hero_parent",
      dots: false,
      arrows: false,
      autoplay: true,
      autoplaySpeed: 6000,
      speed: 500,
      cssEase: "linear",
      infinite: true,
      rows: 0,
    });
  }
  function logoCarousel() {
    $(".logo-carousel").slick({
      speed: 5000,
      pauseOnHover: false,
      autoplay: true,
      autoplaySpeed: 0,
      cssEase: "linear",
      slidesToShow: 5,
      slidesToScroll: 1,
      infinite: true,
      arrows: false,
      variableWidth: true,
    });
  }
  function scrollTop() {
    var $scrollToTopButton = $(".footer .widget_media_image img");
    // logic
    $scrollToTopButton.on("click", function () {
      $("html, body").animate({ scrollTop: 0 }, 800);
      return false;
    });
  }

  function menuSticky() {
    // Check if .anchor_menu exists
    if (jQuery(".anchor_menu").length === 0) {
      return; // Exit the function if .anchor_menu does not exist
    }

    let prevScrollPos = jQuery(window).scrollTop();
    let body = jQuery("body"); // Use jQuery to select the body
    let scrollThreshold = jQuery(window).height() * 0.1; // 10% of window height

    jQuery(window).on("scroll", function () {
      const currentScrollPos = jQuery(window).scrollTop();

      if (currentScrollPos < scrollThreshold) {
        body.removeClass("is_scrolling_up is_scrolling_down");
      } else if (prevScrollPos > currentScrollPos) {
        body.addClass("is_scrolling_up").removeClass("is_scrolling_down");
      } else {
        body.removeClass("is_scrolling_up").addClass("is_scrolling_down");
      }

      prevScrollPos = currentScrollPos;
    });
  }

  // Initialize the function
  jQuery(document).ready(function () {
    menuSticky();
  });

  function updateBodyPadding() {
    var headerMegaHeight = $(".header-mega").outerHeight() || 0;
    var anchorMenuHeight = $(".anchor_menu").outerHeight() || 0;
    var totalHeight = headerMegaHeight + anchorMenuHeight;

    // Check if body has .logged-in class and subtract 32px if true
    if ($("body").hasClass("logged-in")) {
      totalHeight -= 32;
    }

    $("body").css("padding-top", totalHeight + "px");
  }

  // Debounce function to delay the execution
  function debounce(func, delay) {
    let timeout;
    return function () {
      clearTimeout(timeout);
      timeout = setTimeout(func, delay);
    };
  }

  // Update padding on page load
  updateBodyPadding();

  // Update padding on window resize or orientation change with debounce
  $(window).on("resize orientationchange", debounce(updateBodyPadding, 400));
  $(window).on("load", function () {
    // Run updateBodyPadding after the window has fully loaded
    updateBodyPadding();
    // Run updateBodyPadding again after 1 second
    setTimeout(updateBodyPadding, 1000);
    // console.log("padding after window load");
  });

  // ADD CARET
  $(
    ".header-mega .mega-menu .menu-mega-menu-container .menu > li.menu-item-has-children > a"
  ).each(function () {
    if (!$(this).find(".toggle-caret").length) {
      $(this).append('<span class="toggle-caret"></span>');
    }
  });

  function hamburgerIcon() {
    $(".hamburger").on("click", function () {
      if (
        $("body").hasClass("single-landing_page") &&
        $(window).width() < 1080
      ) {
        event.preventDefault();
        event.stopPropagation();
        event.stopImmediatePropagation();
        $(".anchor_menu").click();
      } else {
        $(this).toggleClass("is-active");
        $(this).parent().toggleClass("menu-open");
        setTimeout(() => {
          $("body").toggleClass("animatembl");
        }, 100);
        $("body").toggleClass("body-fix");
      }
    });

    // 2nd level menu

    // Static-clone patch: this used to be wrapped in a one-off
    // `if ($(window).innerWidth() < 1081)` check, so the width at page load
    // decided forever whether the caret worked. Opening the page wide and then
    // narrowing it (a browser resize, or switching on a device toolbar) left
    // the carets inert. Bind unconditionally and test the width per click.
    $(".toggle-caret").click(function (event) {
      if ($(window).innerWidth() >= 1081) {
        return;
      }
      event.preventDefault();
      event.stopPropagation(); // Stop propagation to prevent triggering click events on parent elements
      var $this = $(this).parent().parent();

      if ($this.hasClass("active")) {
        $this.removeClass("active");
        $("#primary-menu > li").show();
      } else {
        $("#primary-menu > li").removeClass("active").hide();
        $("#primary-menu > li.hide-desktop").show();
        $this.addClass("active").show();
      }
    });

    $("#primary-menu > li").click(function (event) {
      if ($(window).innerWidth() >= 1081) {
        return;
      }
      event.stopPropagation(); // Prevents hiding/showing when clicking on sub-items
    });
  }

  function debounce(func, wait, immediate) {
    var timeout;
    return function () {
      var context = this,
        args = arguments;
      var later = function () {
        timeout = null;
        if (!immediate) func.apply(context, args);
      };
      var callNow = immediate && !timeout;
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
      if (callNow) func.apply(context, args);
    };
  }

  function moveSalesNum() {
    if ($(window).width() < 1081) {
      $(".sales-num").prependTo(".menu-mega-menu-container");
    } else {
      $(".sales-num").appendTo(".header-mega");
    }
    $(".mega-imgs").appendTo(".menu-mega-menu-container");
  }

  // Scroll to target, self-correcting if layout shifts during/after the scroll
  function scrollToEnquireForm($target, offset, speed, attempts) {
    attempts = attempts === undefined ? 3 : attempts;

    // Signal to header.php script not to interfere
    window.__tsManualScroll = true;

    $('html, body').stop(true).animate(
      { scrollTop: $target.offset().top - offset },
      speed,
      function () {
        setTimeout(function () {
          var expected = $target.offset().top - offset;
          var actual = $(window).scrollTop();

          if (attempts > 0 && Math.abs(actual - expected) > 5) {
            scrollToEnquireForm($target, offset, 0, attempts - 1);
          } else {
            window.__tsManualScroll = false;
          }
        }, 300);
      }
    );
  }

  $('.get-a-quote a').on('click', function (e) {

    var target = $('#enquire-form');

    if (target.length) {
      e.preventDefault();
      scrollToEnquireForm(target, 100, 500);
    } else {
      e.preventDefault();
      window.location.href = $(this).attr('href');
    }
  });

  // HASH SCROLL ON PAGE LOAD (replaces old header.php inline script)
  // e.g. landing on /#enquire-form from an inner page
  (function () {
    if (!window.location.hash) return;

    var hashTarget = document.getElementById(window.location.hash.slice(1));
    if (!hashTarget) return;

    var $hashTarget = $(hashTarget);
    var userScrolled = false;

    // If the user scrolls on their own, stop correcting
    ['wheel', 'touchstart', 'keydown'].forEach(function (evt) {
      document.addEventListener(evt, function () { userScrolled = true; }, { once: true });
    });

    // Smooth scroll now (scrollToEnquireForm self-corrects on completion)
    scrollToEnquireForm($hashTarget, 100, 500);

    // After full load + late form injections, verify — snap instantly if off
    $(window).on('load', function () {
      [800, 2000].forEach(function (delay) {
        setTimeout(function () {
          if (userScrolled) return;
          var expected = $hashTarget.offset().top - 100;
          if (Math.abs($(window).scrollTop() - expected) > 5) {
            $('html, body').stop(true).scrollTop(expected); // instant, 0 animation
          }
        }, delay);
      });
    });
  })();

  function animatedCarousel() {
    // $('.slider_animation1').slick({
    //     speed: 15000,
    //     pauseOnHover: false,
    //     autoplay: true,
    //     autoplaySpeed: 0,
    //     cssEase: 'linear',
    //     slidesToShow: 4,
    //     slidesToScroll: 1,
    //     arrows: false,
    //     rows: 0,
    //     infinite: true,
    //     rtl: true,
    //     responsive: [
    //         {
    //           breakpoint: 1080,
    //           settings: {
    //             slidesToShow: 3,
    //             slidesToScroll: 1,
    //             infinite: true,
    //             dots: true
    //           }
    //         },
    //         {
    //             breakpoint: 767,
    //             settings: {
    //               slidesToShow: 2,
    //               slidesToScroll: 1,
    //               infinite: true,
    //               dots: true
    //             }
    //         },
    //     ]
    // });
    // $('.slider_animation2').slick({
    //     speed: 15000,
    //     pauseOnHover: false,
    //     autoplay: true,
    //     autoplaySpeed: 0,
    //     cssEase: 'linear',
    //     slidesToShow: 4,
    //     slidesToScroll: 1,
    //     arrows: false,
    //     rtl: false,
    //     rows: 0,
    //     infinite: true,
    //     responsive: [
    //         {
    //           breakpoint: 1080,
    //           settings: {
    //             slidesToShow: 3,
    //             slidesToScroll: 1,
    //             infinite: true,
    //             dots: true
    //           }
    //         },
    //         {
    //             breakpoint: 767,
    //             settings: {
    //               slidesToShow: 2,
    //               slidesToScroll: 1,
    //               infinite: true,
    //               dots: true
    //             }
    //         },
    //     ]
    // });
  }

// function googleRating() {
//     let starCount = $(".ti-stars.star-lg").children().length;

//     if (starCount < 10) {
//       starCount = starCount + ".0";
//     }

//     let reviewCount = $(".ti-rating-text .nowrap strong").text().trim();

//     if (!reviewCount) {
//       reviewCount = "288 reviews";
//     }

//     $(".google-total").text(reviewCount);
//     $(".star-reviews .num").text(reviewCount);

//     // apply average on top immediately after setting
//     applyAverage();
//   }

//   function applyAverage() {
//     const target = document.querySelector(".star-reviews .num");
//     if (!target) return;

//     const currentValue = target.textContent.trim();
//     const trustindexCount = parseInt(currentValue.match(/(\d+)/)?.[1]);
//     if (!trustindexCount) return;

//     const starReviewsEl = document.querySelector(".star-reviews");
//     let trustindexRating = null;
//     starReviewsEl.childNodes.forEach(function(node) {
//       if (node.nodeType === 3) {
//         const match = node.textContent.match(/([\d.]+)\s*from/);
//         if (match) trustindexRating = parseFloat(match[1]);
//       }
//     });

//     const productReviewEl = document.querySelector('[data-product_review]');
//     const productReviewText = productReviewEl ? productReviewEl.textContent.trim() : null;
//     const productReviewMatch = productReviewText ? productReviewText.match(/([\d.]+)\s*from\s*(\d+)\s*reviews/) : null;

//     if (!trustindexRating || !productReviewMatch) return;

//     const productRating = parseFloat(productReviewMatch[1]);
//     const productCount = parseInt(productReviewMatch[2]);
// //     console.log('GOOGLE — trustindexCount:', trustindexCount, 'trustindexRating:', trustindexRating);
// // console.log('PRODUCT — productCount:', productCount, 'productRating:', productRating);
//     const avgCount = Math.round((trustindexCount + productCount) / 2) + " reviews";
//     const avgRating = (Math.floor((trustindexRating + productRating) / 2 * 10) / 10).toFixed(1);

//     target.textContent = avgCount;

//     starReviewsEl.childNodes.forEach(function(node) {
//       if (node.nodeType === 3 && node.textContent.match(/([\d.]+)\s*from/)) {
//         node.textContent = node.textContent.replace(/([\d.]+)\s*from/, avgRating + ' from ');
//       }
//     });

//     // console.log('avgRating applied:', avgRating, '| avgCount applied:', avgCount);
//   }

 

  // function iconAniamtion(){
  //     jQuery('.iconBox_4col').waypoint(function(direction) {
  //         if (direction === 'down') {
  //             jQuery(this.element).addClass('in-view');
  //             setTimeout(() => {
  //                 document.querySelectorAll('.animateStart').forEach((player, index) => {
  //                     setTimeout(() => {
  //                         player.play();
  //                     }, index * 800); // Adjust the 300ms increment as needed to match your CSS delays
  //                 });
  //             }, 500); // 1000 milliseconds = 1 second
  //         }
  //     }, {
  //         offset: '80%' // Trigger when 70% of the section is visible
  //     });

  // }

  (function ($) {
    const ICON_ANIMATION = (function () {
      const observerIntersection = function (entries, iconObserver) {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            console.log(`Element ${entry.target} is in view.`);
            entry.target.classList.add("in-view");
            setTimeout(() => {
              document
                .querySelectorAll(".animateStart")
                .forEach((player, index) => {
                  setTimeout(() => {
                    // Static-clone patch: a Lottie failure here used to throw
                    // inside the IntersectionObserver callback and stop every
                    // other section from ever receiving .in-view.
                    try {
                      player.play();
                    } catch (e) {
                      /* icon animation unavailable, section still reveals */
                    }
                  }, index * 800); // Adjust the 800ms increment as needed to match your CSS delays
                });
            }, 500); // 500 milliseconds = 0.5 seconds
            iconObserver.unobserve(entry.target); // Unobserve the target after it has been triggered
          }
        });
      };

      const init = function () {
        if (typeof window.IntersectionObserver === "undefined") {
          return;
        }

        const observer = new IntersectionObserver(observerIntersection, {
          root: null,
          rootMargin: "0px",
          threshold: 0.2, // Trigger when 20% of the element is visible
        });

        $.each($(".iconBox_4col"), function (index, ele) {
          observer.observe(ele);
          console.log(`Observing element ${ele}.`);
        });

        // Add hover event listener to replay Lottie animations
        document.querySelectorAll(".animateStart").forEach((player) => {
          player.addEventListener("mouseover", () => {
            console.log(`Replaying animation for element ${player}.`);
            player.stop();
            player.play();
          });
        });
      };

      return {
        init: init,
      };
    })();

    $(document).ready(function () {
      ICON_ANIMATION.init();
    });
  })(jQuery);

  document.addEventListener("DOMContentLoaded", () => {
    document.querySelectorAll(".thank-top .animateStart").forEach((player) => {
      player.stop();
      player.play();
    });
  });

  function imgGridAnimate() {
    const images = [
      ...document.querySelectorAll(".slider_animation-grid.marquee > div"),
    ];
    const lerp = (a, b, n) => (1 - n) * a + n * b;
    const map = (x, a, b, c, d) => ((x - a) * (d - c)) / (b - a) + c;

    // Function to set height equal to width
    const setEqualHeightWidth = () => {
      images.forEach((img) => {
        if (!img.classList.contains("discover")) {
          const width = img.offsetWidth;
          img.style.height = `${width}px`;
        } else {
          img.style.height = ""; // Reset height for .discover elements
        }
      });
    };

    // Initial call to set heights
    setEqualHeightWidth();

    // Call setEqualHeightWidth on window resize
    window.addEventListener("resize", setEqualHeightWidth);

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return;
    }

    const startAnimation = () => {
      // Initial GSAP animation for images
      gsap.fromTo(
        ".slider_animation-grid.marquee > div",
        {
          scale: 1.2,
          autoAlpha: 0,
          ease: "power3.inOut",
        },
        {
          scale: 1,
          autoAlpha: 1,
          stagger: 0.1,
          duration: 2.5,
        }
      );

      // Each image drifts on a tween that restarts itself on complete, so it
      // writes a transform every frame for as long as the page stays open. Track
      // the live tweens so they only run while the grid is actually on screen.
      const drifting = [];
      let onScreen = false;

      images.forEach((img) => {
        let values = { x: 0, y: 0 };
        const xStart = 150; // Increased range for more noticeable movement
        const yStart = 0; // Fixed value for no vertical movement
        const state = { tween: null };

        const randomMovement = () => {
          const randomX = gsap.utils.random(-xStart, xStart);

          state.tween = gsap.to(values, {
            x: randomX,
            y: yStart,
            duration: gsap.utils.random(6, 10), // Increased duration for slightly more speed
            ease: "power1.inOut",
            onUpdate: () => {
              gsap.set(img, { x: values.x, y: values.y });
            },
            onComplete: randomMovement,
          });

          if (!onScreen) {
            state.tween.pause();
          }
        };

        drifting.push(state);
        randomMovement();
      });

      const setDrifting = (running) => {
        onScreen = running;
        drifting.forEach((state) => {
          if (!state.tween) {
            return;
          }
          if (running) {
            state.tween.play();
          } else {
            state.tween.pause();
          }
        });
      };

      const grid = document.querySelector(".slider_animation-grid.marquee");

      if (!grid || typeof IntersectionObserver === "undefined") {
        setDrifting(true);
        return;
      }

      new IntersectionObserver(
        (entries) => {
          setDrifting(entries[0].isIntersecting);
        },
        { rootMargin: "200px" }
      ).observe(grid);
    };

    // GSAP comes from a CDN and WP Rocket may delay it until first interaction,
    // which is long after DOMContentLoaded. Referencing it directly here would
    // throw and take every later init call in this handler down with it, so wait
    // for it instead. Gives up if it never arrives (blocked, CDN down).
    if (typeof gsap !== "undefined") {
      startAnimation();
      return;
    }

    let waited = 0;
    const gsapPoll = setInterval(() => {
      waited += 200;
      if (typeof gsap !== "undefined") {
        clearInterval(gsapPoll);
        startAnimation();
      } else if (waited >= 10000) {
        clearInterval(gsapPoll);
      }
    }, 200);
  }

  function tabSlide() {
    const $navLinks = $(".selector_tab .nav-link");
    const $navIndicator = $('<div class="nav-indicator"></div>');
    $(".selector_tab .nav-tabs").append($navIndicator);
    const $select = $("select#shutter_slector");

    function updateIndicator() {
      const $activeNavLink = $(".selector_tab .nav-link.active");
      const navTabs = $(".selector_tab .nav-tabs")[0];

      if ($activeNavLink.length > 0 && navTabs) {
        const navTabsRect = navTabs.getBoundingClientRect();
        const activeNavLinkRect = $activeNavLink[0].getBoundingClientRect();

        $navIndicator.css({
          width: activeNavLinkRect.width + "px",
          left: activeNavLinkRect.left - navTabsRect.left + "px",
        });
      }
    }

    $navLinks.on("click", function () {
      $navLinks.removeClass("active");
      const $this = $(this);
      const value = $this.data("value");

      $this.addClass("active");
      $select.find("option:selected").prop("selected", false);
      $select.find('option[value="' + value + '"]').prop("selected", true);
      updateIndicator();

      const text = $select.find("option:selected").text();
      $(".open_popup").text(text);
    });

    $select.on("change", function () {
      $navLinks.removeClass("active");
      const value = $(this).val();
      const text = $(this).find("option:selected").text();
      $(".selector_tab #tab-" + value).addClass("active");

      updateIndicator();

      $(".selector_tab .tab-pane.show").removeClass("show");
      $(".selector_tab .tab-pane.active").removeClass("active");
      $(".selector_tab #tab-" + value + "-pane").addClass("active");
      $(".selector_tab #tab-" + value + "-pane").addClass("show");

      $(".open_popup").text(text);
    });

    updateIndicator(); // Initial call to set indicator position
  }

  function colorTooltip() {
    if (jQuery('[data-bs-toggle="tooltip"]').length) {
      jQuery('[data-bs-toggle="tooltip"]').tooltip();

      document
        .querySelectorAll(".stripe-patters.shutter_color li a")
        .forEach(function (tooltipTriggerEl) {
          var tooltip = new bootstrap.Tooltip(tooltipTriggerEl);
          // Add click event listener to hide the tooltip on click
          tooltipTriggerEl.addEventListener("click", function () {
            tooltip.hide();
          });
        });
    }
  }

  function colorSelector() {
    // Add 'active' class to the first color selector link initially
    $(".color_selector li:first-child a").addClass("active");

    // Show the default image (black shutter) on page load
    $("#black_shutter").addClass("active");

    // Handle click on color selector links
    $(".color_selector a").on("click", function (e) {
      e.preventDefault();

      // Remove 'active' class from all links except the clicked one
      $(this).closest(".color_selector").find("a.active").removeClass("active");

      // Toggle 'active' class for the clicked link
      $(this).toggleClass("active");

      // Get the image ID associated with the selected color
      var imageId = $(this).data("image-id");

      // Remove 'active' class from all images
      $(this)
        .closest(".color_selector")
        .siblings(".shutter_image")
        .children()
        .removeClass("active");

      // Add 'active' class to the corresponding image based on the selected color
      $("#" + imageId).addClass("active");
    });
  }

  function customPopup() {
    $(".open_popup").on("click", function (e) {
      e.preventDefault();
      var $this = $(this);
      var $overlay = $this.next(".overlay");
      var $popup = $overlay.next(".popup");

      if ($(window).width() < 768) {
        $overlay.addClass("overlay-shown");
        $popup.addClass("popup-shown");
        $(".header-mega").toggleClass("lower-zindex");
        $("body").toggleClass("overflow-hide");
      }
    });

    $(".closePopup").on("click", function (e) {
      e.preventDefault();
      $(this).closest(".popup").removeClass("popup-shown");
      $(".overlay").removeClass("overlay-shown");
      $(".header-mega").toggleClass("lower-zindex");
      $("body").toggleClass("overflow-hide");
    });

    const navLinks = document.querySelectorAll(".nav-link");
    navLinks.forEach((link) => {
      link.addEventListener("shown.bs.tab", scrollToActiveTab);
    });
    function scrollToActiveTab() {
      const navTabs = document.querySelector(".nav-tabs");
      const activeTab = document.querySelector(".nav-link.active");
      if (navTabs && activeTab) {
        const offsetLeft = activeTab.offsetLeft;
        const offsetWidth = activeTab.offsetWidth;
        const containerWidth = navTabs.clientWidth;
        // Calculate the scroll position to center the active tab
        const newScrollPosition =
          offsetLeft - (containerWidth / 2 - offsetWidth / 2);
        // Smoothly scroll the nav container to the new position
        navTabs.scrollTo({
          left: newScrollPosition,
          behavior: "smooth",
        });
      }
    }

    $(".popup_list a").on("click", function (e) {
      const $navIndicator = $(".nav-indicator");

      function updateIndicator1() {
        const $activeNavLink = $(".nav-link.active");
        const navTabsRect = $(".nav-tabs")[0].getBoundingClientRect();
        const activeNavLinkRect = $activeNavLink[0].getBoundingClientRect();

        $navIndicator.css({
          width: activeNavLinkRect.width + "px",
          left: activeNavLinkRect.left - navTabsRect.left + "px",
        });
      }

      e.preventDefault();
      const $select = $("select#shutter_slector");

      var selectedText = $(this).text();
      const value = $(this).data("value");

      $(".tab-pane.show").removeClass("show");
      $(".tab-pane.active").removeClass("active");
      $("#tab-" + value + "-pane").addClass("active");
      $("#tab-" + value + "-pane").addClass("show");

      $select.find("option:selected").prop("selected", false);
      $select.find('option[value="' + value + '"]').prop("selected", true);

      $(".nav-link.active").removeClass("active");
      $("#tab-" + value).addClass("active");

      updateIndicator1();

      $(".open_popup").text(selectedText);
      $(".popup").removeClass("popup-shown"); // remove the class instead of hiding
      $(".overlay").removeClass("overlay-shown"); // remove the class instead of hiding
      $(".header-mega").removeClass("lower-zindex");
      $("body").removeClass("overflow-hide");

      // POPUP SLIDE POSITION
      scrollToActiveTab();
    });

    $("#overlay").on("click", function () {
      $(".popup").removeClass("popup-shown");
      $(this).removeClass("overlay-shown");
      $(".header-mega").removeClass("lower-zindex");
      $("body").removeClass("overflow-hide");
    });
  }

  function anchorMenu() {
    var anchorMenuElement = $(".anchor_menu");
    var headerElement = $(".header-mega");
    var headerHeight = headerElement.outerHeight();
    var lastScrollTop = 0;

    if (anchorMenuElement.length) {
      var menuOffset = anchorMenuElement.offset().top;

      $(window).scroll(function () {
        var scrollDistance = $(window).scrollTop();

        if (scrollDistance >= menuOffset - headerHeight) {
          if (!anchorMenuElement.hasClass("sticky")) {
            anchorMenuElement.addClass("sticky");
          }

          if (scrollDistance < lastScrollTop) {
            if (!anchorMenuElement.hasClass("anchor-up")) {
              anchorMenuElement.addClass("anchor-up");
            }
          } else {
            if (anchorMenuElement.hasClass("anchor-up")) {
              anchorMenuElement.removeClass("anchor-up");
            }
          }

          lastScrollTop = scrollDistance;
        } else {
          if (anchorMenuElement.hasClass("sticky")) {
            anchorMenuElement.removeClass("sticky anchor-up");
          }
        }

        // $(".anchor_block").each(function (i) {
        //     if ($(this).position().top <= scrollDistance + headerHeight) {
        //         anchorMenuElement.find("a.active").removeClass("active");
        //         anchorMenuElement.find("a").eq(i).addClass("active");
        //     }
        // });

        // var offsetLast = $(".anchor_block").last().offset().top;

        // if (scrollDistance > offsetLast + $(".anchor_block").last().height()) {
        //     $(".anchor_menu li a").removeClass("active");
        // }

        // var offsetFirst = $(".anchor_block").first().offset().top;

        // if (scrollDistance < offsetFirst - $(".anchor_block").first().height()) {
        //     $(".anchor_menu li a").removeClass("active");
        // }
      });
    }
  }

  function anchorMenuClick() {
    $(".anchor_menu a:not(.closePopup)").on("click", function (e) {
      e.preventDefault();

      const targetId = $(this).attr("href");

      if ($(targetId).length) {
        $("html, body").animate(
          {
            scrollTop:
              $(targetId).offset().top - $(".header-mega").outerHeight(),
          },
          400,
          function () {
            $(".anchor_menu li a").removeClass("active");
            $(e.target).addClass("active");
          }
        );
      }

      const currentURL = window.location.href.split("#")[0];
      const newURL = currentURL + targetId;

      if (history.pushState) {
        history.pushState(null, null, newURL);
      } else {
        window.location.hash = targetId;
      }
    });
  }

  function anchorPopup() {
    $(".anchor_menu .anchor_right a")
      .not(".closePopup")
      .on("click", function (e) {
        e.preventDefault(); // Prevent default anchor behavior
        e.stopPropagation(); // Prevent the click event from bubbling up to the anchor_menu
        const $this = $(this); // Reference to the clicked anchor
        // Extract the hash part from the href attribute
        const targetId = $this.attr("href").split("#")[1]; // Get the part after the # symbol
        const $target = $("#" + targetId); // Find the target element by ID
        if ($target.length) {
          // Get the current scroll position and the target element's position
          const currentScroll = $(window).scrollTop();
          let targetOffset = $target.offset().top; // Adjust for any fixed headers
          // Determine scroll direction and adjust offset if scrolling up
          if (targetOffset < currentScroll) {
            // console.log('Scrolling up to the section.');
            targetOffset -= 100; // Add 100px to the offset if scrolling up
          } else if (targetOffset > currentScroll) {
            // console.log('Scrolling down to the section.');
          } else {
            // console.log('Already at the section.');
          }
          // Animate scrolling to the target element with adjusted offset
          $("html, body").animate({ scrollTop: targetOffset }, 0);
        }

        $(".anchor_menu").removeClass("popup-active");
        $("#overlay_anchor").removeClass("overlay-shown");
        $(".header-mega").removeClass("lower-zindex");
        $("body").removeClass("overflow-hide");
      });

    if ($(window).width() <= 1080) {
      $(".anchor_menu").on("click", function (e) {
        $(this).addClass("popup-active");
        $(".header-mega").addClass("lower-zindex");
        $("body").addClass("overflow-hide");
        $("#overlay_anchor").addClass("overlay-shown");
        e.stopPropagation(); // Prevent the click event from bubbling up
      });

      $("#overlay_anchor, .closePopup").on("click", function (e) {
        e.stopPropagation(); // Prevent the click event from bubbling up to the anchor_menu
        $(".anchor_menu").removeClass("popup-active");
        $(".header-mega").removeClass("lower-zindex");
        $("body").removeClass("overflow-hide");
        $("#overlay_anchor").removeClass("overlay-shown");
      });
    }
  }

  function residentalApplicationMobileSlider() {
    var $navPills = $("#application-lists");
    var $scrollToPrev = $("#scrollToPrev");
    var $scrollToNext = $("#scrollToNext");
    var scrollStep = $navPills.find(".nav-link").outerWidth(true); // Width of each nav-link including margin

    var currentPosition = 0;
    var navPillsWidth = $navPills.outerWidth();
    var navItemsWidth = $navPills.find(".nav-link").length * scrollStep;

    // Show/hide previous button based on initial position
    $scrollToPrev.toggleClass("hidden", currentPosition <= 0);

    // Scroll to previous items
    $scrollToPrev.on("click", function () {
      if (currentPosition >= scrollStep) {
        currentPosition -= scrollStep;
        $navPills.animate({ scrollLeft: currentPosition }, 500);
        $scrollToNext.removeClass("hidden");
      }
      $scrollToPrev.toggleClass("hidden", currentPosition <= 0);
      updateScrollClasses();
    });

    // Scroll to next items
    $scrollToNext.on("click", function () {
      if (currentPosition + navPillsWidth < navItemsWidth) {
        currentPosition += scrollStep;
        $navPills.animate({ scrollLeft: currentPosition }, 500);
        $scrollToPrev.removeClass("hidden");
      }
      $scrollToNext.toggleClass(
        "hidden",
        currentPosition + navPillsWidth >= navItemsWidth
      );
      $(".application_navigate")
        .removeClass("scroll_right")
        .addClass("scroll_left");
      updateScrollClasses();
    });

    // Function to update scroll classes
    function updateScrollClasses() {
      var maxScrollLeft = navItemsWidth - navPillsWidth;
      var currentScrollLeft = $navPills.scrollLeft();

      if (currentScrollLeft <= 0) {
        $(".application_navigate")
          .removeClass("scroll_left")
          .addClass("scroll_right");
      } else if (currentScrollLeft >= maxScrollLeft) {
        $(".application_navigate")
          .removeClass("scroll_right")
          .addClass("scroll_left");
      } else {
        $(".application_navigate").removeClass("scroll_left scroll_right");
      }
    }

    // Event listener for scroll event to handle drag-based scrolling
    $navPills.on("scroll", function () {
      currentPosition = $navPills.scrollLeft();
      $scrollToPrev.toggleClass("hidden", currentPosition <= 0);
      $scrollToNext.toggleClass(
        "hidden",
        currentPosition + navPillsWidth >= navItemsWidth
      );
      updateScrollClasses();
    });

    // Initial call to set scroll classes
    updateScrollClasses();
  }

  function sliderShowroom() {
    if ($(".slider_showroom-component").length) {
      $(".slider_showroom-component").slick({
        slidesToShow: 4,
        slidesToScroll: 1,
        arrows: true,
        dots: false,
        speed: 200,
        infinite: true,
        rows: 0,
        prevArrow:
          '<button type="button" class="slick-prev"><svg xmlns="http://www.w3.org/2000/svg" width="40.112" height="40.113" viewBox="0 0 40.112 40.113"><g id="leftarrow_white" transform="translate(1735.113 12223.594) rotate(180)"><path id="Path_8260" data-name="Path 8260" d="M34.231,5.866A20.057,20.057,0,1,0,40.113,20.04,20.056,20.056,0,0,0,34.231,5.866" transform="translate(1695 12183.48)" fill="#d7e3e6" fill-rule="evenodd"/><path id="Path_8261" data-name="Path 8261" d="M18.6,25.309l-1.365-1.365,3.872-3.878-3.87-3.894L18.6,14.8l5.255,5.252Z" transform="translate(1695 12183.48)" fill="#1d283c" fill-rule="evenodd"/></g></svg></button>',
        nextArrow:
          '<button type="button" class="slick-next"><svg xmlns="http://www.w3.org/2000/svg" width="40.112" height="40.113" viewBox="0 0 40.112 40.113"><g id="rightarrow_white" transform="translate(-1695.001 -12183.48)"><path id="Path_8260" data-name="Path 8260" d="M34.231,5.866A20.057,20.057,0,1,0,40.113,20.04,20.056,20.056,0,0,0,34.231,5.866" transform="translate(1695 12183.48)" fill="#d7e3e6" fill-rule="evenodd"/><path id="Path_8261" data-name="Path 8261" d="M18.6,25.309l-1.365-1.365,3.872-3.878-3.87-3.894L18.6,14.8l5.255,5.252Z" transform="translate(1695 12183.48)" fill="#1d283c" fill-rule="evenodd"/></g></svg></button>',
        responsive: [
          {
            breakpoint: 1280,
            settings: {
              slidesToShow: 3,
              slidesToScroll: 1,
            },
          },
          {
            breakpoint: 992,
            settings: {
              slidesToShow: 2,
              slidesToScroll: 1,
            },
          },
          {
            breakpoint: 767,
            settings: {
              slidesToShow: 1,
              slidesToScroll: 1,
              speed: 600,
            },
          },
        ],
      });
    }
  }

  function iconSlider() {
    if ($(".icons_row").length) {
      $(".icons_row").each(function () {
        var $slider = $(this);

        $slider.slick({
          slidesToShow: 7,
          slidesToScroll: 1,
          arrows: true,
          dots: false,
          infinite: false,
          rows: 0,
          prevArrow:
            '<button type="button" class="slick-prev"><svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="40.113" height="40.113" viewBox="0 0 40.113 40.113"><defs><clipPath id="clip-path"><rect id="Rectangle_2108" data-name="Rectangle 2108" width="40.113" height="40.113" transform="translate(0 0)" fill="#1d283c"/></clipPath></defs><g id="Group_2431" data-name="Group 2431" transform="translate(40.113 40.113) rotate(180)"><g id="Group_2381" data-name="Group 2381" clip-path="url(#clip-path)"><path id="Path_8260" data-name="Path 8260" d="M34.231,5.866A20.057,20.057,0,1,0,40.113,20.04,20.056,20.056,0,0,0,34.231,5.866" fill="#121e2e" fill-rule="evenodd"/><path id="Path_8261" data-name="Path 8261" d="M18.6,25.309l-1.365-1.365,3.872-3.878-3.87-3.894L18.6,14.8l5.255,5.252Z" fill="#fff" fill-rule="evenodd"/></g></g></svg></button>',
          nextArrow:
            '<button type="button" class="slick-next"><svg id="Group_2430" data-name="Group 2430" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="40.113" height="40.113" viewBox="0 0 40.113 40.113"><defs><clipPath id="clip-path"><rect id="Rectangle_2108" data-name="Rectangle 2108" width="40.113" height="40.113" transform="translate(0 0)" fill="#1d283c"/></clipPath></defs><g id="Group_2381" data-name="Group 2381" clip-path="url(#clip-path)"><path id="Path_8260" data-name="Path 8260" d="M34.231,5.866A20.057,20.057,0,1,0,40.113,20.04,20.056,20.056,0,0,0,34.231,5.866" fill="#121e2e" fill-rule="evenodd"/><path id="Path_8261" data-name="Path 8261" d="M18.6,25.309l-1.365-1.365,3.872-3.878-3.87-3.894L18.6,14.8l5.255,5.252Z" fill="#fff" fill-rule="evenodd"/></g></svg></button>',
          responsive: [
            {
              breakpoint: 1081,
              settings: {
                slidesToShow: 6,
                slidesToScroll: 1,
              },
            },
            {
              breakpoint: 992,
              settings: {
                slidesToShow: 5,
                slidesToScroll: 1,
              },
            },
            {
              breakpoint: 767,
              settings: {
                slidesToShow: 2.5,
                slidesToScroll: 1,
              },
            },
          ],
        });

        // Function to check if arrows are enabled and add/remove class
        function checkArrows() {
          $slider.each(function () {
            var $thisSlider = $(this);
            if (!$thisSlider.find(".slick-arrow").length) {
              $thisSlider.parent().addClass("no-arrows");
            } else {
              $thisSlider.parent().removeClass("no-arrows");
            }
          });
        }

        // Run check on init
        setTimeout(function () {
          checkArrows();
        }, 600);

        // Run check on window resize
        $(window).on("resize", function () {
          setTimeout(function () {
            checkArrows();
          }, 600);
        });

        $slider.on("afterChange", function (event, slick, currentSlide) {
          if (currentSlide >= slick.slideCount - slick.options.slidesToShow) {
            $slider.addClass("reached-last");
          } else {
            $slider.removeClass("reached-last");
          }
        });
      });
    }
  }
  function cherubiniSlider() {
    if ($(".cherubini_slider").length) {
      let $slider = $(".cherubini_slider");

      // $slider.on(
      //   "init reInit afterChange",
      //   function (event, slick, currentSlide) {
      //     let i = (currentSlide ? currentSlide : 0) + 1;
      //     $(".slide-count").text(i + " of " + slick.slideCount);
      //   }
      // );

      $slider.slick({
        slidesToShow: 2,
        slidesToScroll: 1,
        arrows: true,
        dots: false,
        speed: 200,
        infinite: true,
        rows: 0,
        prevArrow:
          '<button type="button" class="slick-prev"><svg xmlns="http://www.w3.org/2000/svg" width="40.112" height="40.113" viewBox="0 0 40.112 40.113"><g id="leftarrow_white" transform="translate(1735.113 12223.594) rotate(180)"><path id="Path_8260" data-name="Path 8260" d="M34.231,5.866A20.057,20.057,0,1,0,40.113,20.04,20.056,20.056,0,0,0,34.231,5.866" transform="translate(1695 12183.48)" fill="#d7e3e6" fill-rule="evenodd"/><path id="Path_8261" data-name="Path 8261" d="M18.6,25.309l-1.365-1.365,3.872-3.878-3.87-3.894L18.6,14.8l5.255,5.252Z" transform="translate(1695 12183.48)" fill="#1d283c" fill-rule="evenodd"/></g></svg></button>',
        nextArrow:
          '<button type="button" class="slick-next"><svg xmlns="http://www.w3.org/2000/svg" width="40.112" height="40.113" viewBox="0 0 40.112 40.113"><g id="rightarrow_white" transform="translate(-1695.001 -12183.48)"><path id="Path_8260" data-name="Path 8260" d="M34.231,5.866A20.057,20.057,0,1,0,40.113,20.04,20.056,20.056,0,0,0,34.231,5.866" transform="translate(1695 12183.48)" fill="#d7e3e6" fill-rule="evenodd"/><path id="Path_8261" data-name="Path 8261" d="M18.6,25.309l-1.365-1.365,3.872-3.878-3.87-3.894L18.6,14.8l5.255,5.252Z" transform="translate(1695 12183.48)" fill="#1d283c" fill-rule="evenodd"/></g></svg></button>',
        responsive: [
          {
            breakpoint: 768,
            settings: {
              slidesToShow: 1,
              slidesToScroll: 1,
              speed: 600,
              centerMode: true,
              centerPadding: "60px",
            },
          },
        ],
      });

      // Add slide count element
      // $slider.after(
      //   '<div class="slide-count">1 of ' +
      //     $slider.slick("getSlick").slideCount +
      //     "</div>"
      // );
    }
  }

  function iconTooltip() {
    // Show tooltip on click
    $(".icons_row .icon_block").on("click hover", function (event) {
      // Remove active class from all other icon_blocks
      $(".icons_row .icon_block").not(this).removeClass("active");

      // Toggle active class on the clicked icon_block
      $(this).toggleClass("active");

      // Prevent event from bubbling up to the document
      event.stopPropagation();
    });

    // Close tooltip if clicked outside
    $(document).on("click", function () {
      $(".icons_row .icon_block").removeClass("active");
    });

    // Prevent closing tooltip when clicking inside an icon_block
    $(".icons_row .icon_block").on("click", function (event) {
      event.stopPropagation();
    });
  }

  function filterPopup() {
    if ($(".filter_head-mob").length) {
      $(".filter_head-mob").on("click", function () {
        $(".filter_wrap").addClass("active");
        $(".overlay").addClass("overlay-shown");
        $("body").addClass("overflow-hide");
      });

      $(".overlay, .closePopup").on("click", function (event) {
        event.preventDefault();
        $(".filter_wrap").removeClass("active");
        $(".overlay").removeClass("overlay-shown");
        $("body").removeClass("overflow-hide");
      });
    }
  }
  function applyStickyBehavior() {
    if (window.matchMedia("(max-width: 767px)").matches) {
      if ($(".filter_head-mob").length) {
        var filterHeadMob = $(".filter_head-mob");
        var offset = filterHeadMob.offset().top;

        $(window).on("scroll", function () {
          if ($(window).scrollTop() > offset) {
            filterHeadMob.addClass("filter_sticky");
          } else {
            filterHeadMob.removeClass("filter_sticky");
          }
        });
      }
    } else {
      // Remove sticky behavior and event listeners for larger screens
      $(window).off("scroll");
      $(".filter_head-mob").removeClass("filter_sticky");
    }
  }

  function projectsSlider() {
    if ($(".projects_slider").length) {
      $(".projects_slider").on("init", function (event, slick) {
        // Add swipe-right class on first load
        $(this).addClass("swipe-right");
      });

      $(".projects_slider").slick({
        slidesToShow: 2.15,
        slidesToScroll: 1,
        arrows: true,
        dots: false,
        speed: 1000,
        infinite: false,
        rows: 0,
        variableWidth: true,
        cssEase: "ease-out", // Added this line for smooth ease-out animation
        prevArrow:
          '<button type="button" class="slick-prev"><svg xmlns="http://www.w3.org/2000/svg" width="62.625" height="62.624" viewBox="0 0 62.625 62.624"><g id="Group_3179" data-name="Group 3179" transform="translate(-1776.668 -3268.188)"><path id="Path_6293" data-name="Path 6293" d="M62.625,31.288A31.331,31.331,0,1,1,53.449,9.177a31.285,31.285,0,0,1,9.176,22.111" transform="translate(1776.668 3268.188)" fill="#043654" fill-rule="evenodd"/><path id="Path_6294" data-name="Path 6294" d="M28.243,31.311l6.134-6.131,1.591,1.593L31.45,31.32l4.519,4.53-1.592,1.593Z" transform="translate(1775.08 3268.188)" fill="#fff"/></g></svg></button>',
        nextArrow:
          '<button type="button" class="slick-next"><svg xmlns="http://www.w3.org/2000/svg" width="62.625" height="62.624" viewBox="0 0 62.625 62.624"><g id="Group_2121" data-name="Group 2121" transform="translate(-1760.688 -2094.188)"><path id="Path_6293" data-name="Path 6293" d="M0,31.288A31.331,31.331,0,1,0,9.176,9.177,31.285,31.285,0,0,0,0,31.288" transform="translate(1760.688 2094.188)" fill="#043654" fill-rule="evenodd"/><path id="Path_6294" data-name="Path_6294" d="M35.969,31.311,29.835,25.18l-1.591,1.593,4.518,4.547-4.519,4.53,1.592,1.593Z" transform="translate(1760.688 2094.188)" fill="#fff"/></g></svg></button>',
        responsive: [
          {
            breakpoint: 1540,
            settings: {
              slidesToShow: 2.2,
              slidesToScroll: 1,
              variableWidth: true,
            },
          },
          {
            breakpoint: 1081,
            settings: {
              slidesToShow: 2.15,
              slidesToScroll: 1,
              variableWidth: true,
            },
          },
          {
            breakpoint: 767,
            settings: {
              slidesToShow: 1.15,
              slidesToScroll: 1,
              variableWidth: true,
            },
          },
        ],
      });

      // Add event listener for after change
      $(".projects_slider").on(
        "afterChange",
        function (event, slick, currentSlide) {
          var slidesToShow = slick.options.slidesToShow;
          var lastSlideIndex = slick.slideCount - slidesToShow;

          if (currentSlide >= lastSlideIndex) {
            $(".projects_slider")
              .removeClass("swipe-right")
              .addClass("swipe-left");
          } else {
            $(".projects_slider")
              .removeClass("swipe-left")
              .addClass("swipe-right");
          }
        }
      );
    }
  }

  function fancyboxTrigger() {
  if (typeof Fancybox !== "undefined") {
    Fancybox.bind("[data-fancybox]", {
      // Your custom options
    });
  }
}

function matchBlocks() {
  if (typeof $.fn.matchHeight === "undefined") {
    return;
  }

  // Reset any inline height style
  $(".featured_block, .icon_content h4, .motors_block, .c_slide-img img, .c_slide-content").css("height", "");

  $(".featured_block").matchHeight();
  $(".icon_content h4").matchHeight();
  $(".motors_block").matchHeight();
  $(".c_slide-img img").matchHeight();
  $(".c_slide-content").matchHeight();
}

  // function contactPopUp() {
  //     $(document).on('gform_post_submission', function(event, formId) {
  //         console.log('Confirmation loaded for form ID:', formId);
  //         if (formId === gform_3) {
  //             $('.form_success-pop').show();
  //         }
  //     });
  // }

  function handleResizeAndOrientationChange() {
    moveSalesNum();
    customPopup();
    // anchorMenu();
    anchorPopup();
    // anchorMenuClick();
    residentalApplicationMobileSlider();
    // applyStickyBehavior();
  }

  // Event listener for resize
  $(window).on("resize", debounce(handleResizeAndOrientationChange, 250));

  // Event listener for orientation change
  $(window).on(
    "orientationchange",
    debounce(handleResizeAndOrientationChange, 250)
  );

  function bookNow_redirect() {
    // Function to get query parameter by name
    function getQueryParameter(name) {
      let urlParams = new URLSearchParams(window.location.search);
      return urlParams.get(name);
    }

    // Get the 'parm' parameter from the URL
    let parm = getQueryParameter("parm");

    // Check if the 'parm' parameter exists
    if (parm) {
      // Append its value to the .thank-top h2 text
      $(".thank-top h2").append(" " + parm);
    }
  }

  function contactConfirm() {
    // Function to get query parameter by name
    function getQueryParameter(name) {
      let urlParams = new URLSearchParams(window.location.search);
      return urlParams.get(name);
    }

    // Check if the 'success' parameter is 'true'
    if (getQueryParameter("success") === "true") {
      // Scroll to the .get-in-touch section
      $("html, body").animate(
        {
          scrollTop: $(".get-in-touch").offset().top - 50,
        },
        1000
      ); // Adjust the duration as needed

      // Set opacity of .form_success-pop to 1 for 5 seconds, then back to 0
      $(".form_success-pop").css("opacity", "1");
      setTimeout(function () {
        $(".form_success-pop").css("opacity", "0");
      }, 5000); // 5000 milliseconds = 5 seconds
    }
  }

  function youtubePlay() {
    $(".image_block.has--video").on("click", function (e) {
      e.preventDefault();

      var $this = $(this);
      var iframe = $this.find("iframe");
      var videoSrc = iframe.attr("src");

      // Hide the play icon immediately
      $this.find(".play_icon").fadeOut("slow");
      // After the image is fully hidden, update the src and autoplay the video
      if (videoSrc.indexOf("?") > -1) {
        iframe.attr("src", videoSrc + "&autoplay=1");
      } else {
        iframe.attr("src", videoSrc + "?autoplay=1");
      }
      // Fade out the sibling image slowly
      $this.find("img").fadeOut(800, function () {
        // Show the iframe
        iframe.show();
      });
    });
  }

  // MAKE FIRESHIELD ACTIVE
  function activateLastTab() {
    // Trigger click on the last tab
    $(".shutter_select #shutter_slector option").last().prop("selected", true);

    $(".shutter_select .nav-link").last().trigger("click");

    // Get the index of the last tab
    var index = $(".shutter_select .nav-link").length - 1; // Zero-based index

    // Remove 'active' class from all tabs and panes
    $(".shutter_select .nav-link").removeClass("active");
    $(".shutter_select .tab-pane").removeClass("active show");

    // Add 'active' class to the last tab and pane
    $(".shutter_select .nav-link").eq(index).addClass("active");
    $(".shutter_select .tab-pane").eq(index).addClass("active show");
  }

  function interactiveTab() {
    var $mainSlider = $(".interactive_main");
    var $navSlider = $(".interactive_nav");

    $(".interactive_wrap").css("opacity", 0);
    $(".interactive_main").on("init", function () {
      setTimeout(() => {
        $(".interactive_main").slick("slickNext");
      }, 1000);
      setTimeout(() => {
        $(".interactive_nav").slick("slickGoTo", 0);
      }, 1500);
      setTimeout(() => {
        $(".interactive_nav").slick("slickGoTo", 0);
        $(".interactive_wrap").css("opacity", 1);
      }, 2500);
      setTimeout(() => {
        if ($(window).innerWidth() < 768) {
          $(".interactive_component .interactive_nav .slick-list").css(
            "overflow",
            "visible"
          );
        }
      }, 1000);
    });

    var autoplayTriggered = false; // Flag to track if autoplay has been triggered
    var activeSlideIndex = 0; // To store the index of the active slide
    $(".interactive_main").slick({
      slidesToShow: 1,
      slidesToScroll: 1,
      arrows: false,
      fade: true,
      autoplay: false,
      autoplaySpeed: 10000,
      speed: 1000,
      asNavFor: ".interactive_nav",
      rows: 0,
      pauseOnHover: false,
      pauseOnFocus: false,
      responsive: [
        {
          breakpoint: 768,
          settings: {
            speed: 300,
          },
        },
      ],
    });

    $(".interactive_main").on(
      "afterChange",
      function (event, slick, currentSlide) {
        var $navWrap = $(".interactive-nav-mobile-wrap"); // Parent scroll container
        var $navItems = $(".interactive_nav-mobile .icon-svg"); // All navigation items
        var $activeItem = $navItems.eq(currentSlide); // Current active item

        // Remove 'active' class and add it to the current one
        $navItems.removeClass("active");
        $activeItem.addClass("active");

        // Calculate offset of the active item relative to the parent container
        var navWrapOffset = $navWrap.offset().left;
        var itemOffset = $activeItem.offset().left;
        var scrollLeft =
          $navWrap.scrollLeft() + (itemOffset - navWrapOffset) - 30; // 20px as padding

        // Smoothly scroll to the active item
        $navWrap.animate({ scrollLeft: scrollLeft }, 500);
      }
    );

    // Handle navigation click
    // $(".interactive_nav-mobile .icon-svg").on("click", function () {
    //   var index = $(this).index(); // Get index of clicked item
    //   $(".interactive_main").slick("slickGoTo", index); // Move slider to the selected index
    // });
    function handleIconClick() {
      if ($(window).width() < 768) {
        $(".interactive_nav-mobile .icon-svg").on("click", function () {
          var $this = $(this);

          if ($this.hasClass("active")) {
            $this.addClass("is-paused");
            $(".interactive_main").slick("slickPause");
            $(".interactive_nav").slick("slickPause");
          } else {
            var index = $this.index();
            $(".interactive_main").slick("slickGoTo", index);
          }
        });

        $(document).on("click", function (event) {
          if (!$(event.target).closest(".icon-svg.active").length) {
            $(".icon-svg").removeClass("is-paused");
            $(".interactive_main").slick("slickPlay");
            $(".interactive_nav").slick("slickPlay");
          }
        });
      }
    }

    // Run the function on page load and on window resize
    $(document).ready(handleIconClick);
    $(window).on("resize", function () {
      $(".interactive_nav-mobile .icon-svg").off("click");
      $(document).off("click");
      handleIconClick();
    });

    $(".interactive_nav").slick({
      slidesToShow: 5,
      slidesToScroll: 1,
      asNavFor: ".interactive_main",
      dots: false,
      focusOnSelect: false,
      autoplay: false,
      autoplaySpeed: 10000,
      rows: 0,
      pauseOnHover: false,
      pauseOnFocus: false,
      init: function (event, slick) { },
      responsive: [
        {
          breakpoint: 768,
          settings: {
            slidesToShow: 2,
            slidesToScroll: 1,
            centerMode: true,
            autoplay: true,
            variableWidth: true,
            speed: 1200,
            focusOnSelect: true,
          },
        },
      ],
    });

    $(".interactive_nav").on(
      "afterChange",
      function (event, slick, currentSlide) {
        activeSlideIndex = currentSlide;
        console.log("activeSlideIndex is" + activeSlideIndex);
      }
    );

    // Check when the sliders come into view
    $(window).on("scroll", function () {
      var slider = $(".interactive_main");

      if (isElementInView(slider) && !autoplayTriggered) {
        // Go to the first slide

        // After alert, start autoplay on the main slider
        $(".interactive_main").slick("slickPlay");
        if ($(window).innerWidth() < 768) {
          $(".interactive_nav").slick("slickGoTo", 0);
        } else {
          $(".interactive_nav").slick("slickGoTo", 2);
        }
        $(".interactive_nav").slick("slickGoTo", 0);

        // Set the flag to true to prevent autoplay from triggering again
        autoplayTriggered = true;
      }
    });

    // Listen for click events on the navigation slider
    // Listen for click events on the navigation slider
    // Listen for click events on the navigation slider
    $(".interactive_nav").on("click", ".slick-slide", function () {
      if ($(window).innerWidth() > 768) {
        // Get the clicked slide index
        var clickedSlideIndex = $(this).data("slick-index");
        console.log("clickedSlideIndex is " + clickedSlideIndex);
        $mainSlider.slick("slickPlay"); // Restart autoplay
        // Go to the specific slide in the main slider
        // Trigger the alert only if the clicked slide index matches the active slide index
        if (clickedSlideIndex === activeSlideIndex) {
          $mainSlider.slick("slickPause");
          $(this).addClass("is-clicked");
        }
        $(".interactive_main").slick("slickGoTo", clickedSlideIndex);
      }
    });

    // Function to check if an element is in view
    function isElementInView(element) {
      var elementTop = element.offset().top;
      var elementBottom = elementTop + element.outerHeight();
      var viewportTop = $(window).scrollTop();
      var viewportBottom = viewportTop + $(window).height();

      return elementBottom > viewportTop && elementTop < viewportBottom;
    }

    // Check if the element with class 'interactive_nav' exists
    let resizeTimeout;

    $(window).resize(function () {
      // Clear the previous timeout to reset the delay
      clearTimeout(resizeTimeout);

      // Set a new timeout to run the actions once after resizing stops
      resizeTimeout = setTimeout(function () {
        // Check if the slick slider elements exist
        if ($(".interactive_main").length > 0 && $mainSlider.length > 0) {
          // Play the main slider
          $mainSlider.slick("slickPlay");
          // Go to the next slide in the interactive main slider
          $(".interactive_main").slick("slickNext");
        }
      }, 1500); // 1500ms = 1.5 seconds
    });

    // Stop autoplay when a nav item is clicked
    // $(".interactive_nav-item").click(function () {
    //   $(this).addClass("is-clicked");
    //   $mainSlider.slick("slickPause"); // Pause the autoplay
    // });

    // Restart autoplay when the mouse moves away from the slider
    // $(".interactive_wrap").mouseleave(function () {
    //   $mainSlider.slick("slickPlay"); // Restart autoplay
    //   $(".interactive_nav-item").removeClass("is-clicked");
    // });
    $(document).on("click", function (event) {
      if (!$(event.target).closest(".interactive_wrap").length) {
        $mainSlider.slick("slickPlay"); // Restart autoplay
        $(".interactive_nav-item").removeClass("is-clicked");
      }
    });

    // Restart autoplay if stopped
    //    $(".interactive_nav").on("click touchstart", function () {
    //      setTimeout(() => {
    //        $(".interactive_main, .interactive_nav").slick("slickPlay");
    //      }, 1000);
    //    });
  }
  function startProgressAnimation() {
    // Reset all progress bars instantly
    // $('.interactive_nav-item .progress-bar').css({
    //     'stroke-dashoffset': '0',
    //     'transition': 'none' // No animation for previous slides
    // });
    // // Animate only the active slide
    // $('.interactive_nav .slick-current .progress-bar').css({
    //     'stroke-dashoffset': '263.9',
    //     'transition': 'stroke-dashoffset 10s linear'
    // });
  }
  function progressAnimationMobile() {
    if ($(window).width() < 768) {
      function startBorderAnimation() {
        $(".interactive_nav-item .border-svg rect").css(
          "stroke-dashoffset",
          "400"
        ); // Reset all
        $(".slick-current .border-svg rect").css("stroke-dashoffset", "0"); // Animate active
      }

      // Run animation when slider is initialized
      // startBorderAnimation();

      // Run animation when slider is initialized
      $(".interactive_nav").on("init", function () {
        // startBorderAnimation();
      });

      // Run animation before the slide changes
      $(".interactive_nav").on("beforeChange", function () {
        // startBorderAnimation();
      });

      // Run animation after the slide changes
      $(".interactive_nav").on("afterChange", function () {
        // startBorderAnimation();
      });
    }
  }

  // Call the function when needed
  $(document).ready(function () {
    // activateLastTab();
  });

  function gform_validation() {
    // Select the form container element where dynamic elements are added
    var $formContainer = $(".container"); // Replace with the actual container
    // Function to validate phone number
    function validatePhoneNumber($phoneInput) {
      if ($phoneInput.length) {
        var inputValue = $phoneInput.val();
        var $parentField = $phoneInput.closest(".gfield");
        if (inputValue.length === 10 && $.isNumeric(inputValue)) {
          $parentField.addClass("validated"); // Add validated class
        } else {
          $parentField.removeClass("validated"); // Remove validated class
        }
      }
    }
    // Function to validate other text inputs
    function validateTextInputs($otherTextInputs) {
      $otherTextInputs.each(function () {
        var $input = $(this);
        var $parentField = $input.closest(".gfield");
        if ($input.val().trim() !== "") {
          $parentField.addClass("validated"); // Add validated class if not empty
        } else {
          $parentField.removeClass("validated"); // Remove validated class if empty
        }
      });
    }
    // Function to validate email inputs
    function validateEmailInputs($emailInputs) {
      $emailInputs.each(function () {
        var $input = $(this);
        var $parentField = $input.closest(".gfield");
        var emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; // Simple email validation regex
        if (emailPattern.test($input.val())) {
          $parentField.addClass("validated"); // Add validated class if email is valid
        } else {
          $parentField.removeClass("validated"); // Remove validated class if email is invalid
        }
      });
    }
    // Function to validate select fields
    function validateSelectFields($selectFields) {
      $selectFields.each(function () {
        var $select = $(this);
        var $parentField = $select.closest(".gfield");
        if ($select.val() !== "") {
          $parentField.addClass("validated"); // Add validated class if a value is selected
        } else {
          $parentField.removeClass("validated"); // Remove validated class if no value is selected
        }
      });
    }
    // Event delegation
    $formContainer.on("input", 'input[type="text"]', function () {
      validateTextInputs($(this));
    });
    $formContainer.on(
      "input",
      'input[placeholder="Phone number"]',
      function () {
        validatePhoneNumber($(this));
      }
    );
    $formContainer.on("input", 'input[type="email"]', function () {
      validateEmailInputs($(this));
    });
    $formContainer.on("change", "select", function () {
      validateSelectFields($(this));
    });
    // Initial validation on page load if there are pre-filled values
    validatePhoneNumber($('input[placeholder="Phone number"]'));
    validateTextInputs($('input[type="text"]'));
    validateEmailInputs($('input[type="email"]'));
    validateSelectFields($("select"));
  }
  $(document).ready(function () {
    gform_validation();
  });

  heroSlick();
  logoCarousel();
  scrollTop();
  // menuSticky();
  hamburgerIcon();
  moveSalesNum();
  // animatedCarousel();
  // googleRating();
  // $(window).on('load', function() {
  //     googleRating();
  //      setTimeout(function() {
  //       googleRating();
  //   }, 5000);
  //      setTimeout(function() {
  //       googleRating();
  //   }, 10000);
  // });
  // iconAniamtion();
  if ($(".marquee").length) {
    imgGridAnimate();
  }

  tabSlide();
  colorTooltip();
  colorSelector();
  customPopup();
  // anchorMenu();
  anchorPopup();
  residentalApplicationMobileSlider();
  sliderShowroom();
  cherubiniSlider();
  iconSlider();
  iconTooltip();
  // filterPopup();
  // applyStickyBehavior();
  projectsSlider();
  fancyboxTrigger();
  matchBlocks();
  $(window).on("resize", function () {
    setTimeout(function () {
      matchBlocks();
    }, 1000); // 1 second delay


  });
  // anchorMenuClick();

  // contactPopUp();
  bookNow_redirect();
  contactConfirm();
  if ($(".interactive_main").length) {
    interactiveTab();
  }
  startProgressAnimation();
  // progressAnimationMobile();
  $(".interactive_nav").on("beforeChange", function () {
    $(".interactive_nav-item").removeClass("is-clicked");
    startProgressAnimation();
    // progressAnimationMobile();
  });

  $(".mobile-enquiry").on("click", function (e) {
    e.preventDefault();
    const link = $(this).find("a").attr("href"); // keep original href

    // Close the hamburger menu
    $("a.hamburger.is-active").click();

    // Scroll or redirect after delay
    setTimeout(function () {
      const target = $("#enquire-form");

      if (target.length) {
        scrollToEnquireForm(target, 100, 400);
      } else {
        window.location.href = link; // 👉 fallback to homepage/#enquire-form
      }
    }, 800);
  });

});

document.addEventListener("DOMContentLoaded", () => {
  // console.log("DOM fully loaded and parsed");

  setTimeout(() => {
    document.querySelectorAll(".thank-top .animateStart").forEach((player) => {
      player.stop();
      player.play();
    });
  }, 1000); // Adjust the timeout delay as needed (1000 ms = 1 second)
});

// $(window).on('resize orientationchange', function(){
//     interactiveTab();
// });

jQuery(function ($) {
    $('.btn_primary').each(function () {

        var $el = $(this);
        var text = $el.text().trim();

        if (text === 'Enquire now') {
            $el.text('Get a quote');
        }

    });
});


//  RUN cat custom.js motors.js two-col-slider.js > final.js on windows terminal
jQuery(document).ready(function ($) {
  $(".control-1-slider").slick({
    slidesToShow: 3,
    slidesToScroll: 3,
    infinite: true,
    autoplay: false,
    dots: false,
    arrows: true,
    prevArrow:
      '<button type="button" class="slick-prev"><svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="40.113" height="40.113" viewBox="0 0 40.113 40.113"><defs><clipPath id="clip-path"><rect id="Rectangle_2108" data-name="Rectangle 2108" width="40.113" height="40.113" transform="translate(0 0)" fill="#1d283c"/></clipPath></defs><g id="Group_2431" data-name="Group 2431" transform="translate(40.113 40.113) rotate(180)"><g id="Group_2381" data-name="Group 2381" clip-path="url(#clip-path)"><path id="Path_8260" data-name="Path 8260" d="M34.231,5.866A20.057,20.057,0,1,0,40.113,20.04,20.056,20.056,0,0,0,34.231,5.866" fill="#121e2e" fill-rule="evenodd"/><path id="Path_8261" data-name="Path 8261" d="M18.6,25.309l-1.365-1.365,3.872-3.878-3.87-3.894L18.6,14.8l5.255,5.252Z" fill="#fff" fill-rule="evenodd"/></g></g></svg></button>',
    nextArrow:
      '<button type="button" class="slick-next"><svg id="Group_2430" data-name="Group 2430" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="40.113" height="40.113" viewBox="0 0 40.113 40.113"><defs><clipPath id="clip-path"><rect id="Rectangle_2108" data-name="Rectangle 2108" width="40.113" height="40.113" transform="translate(0 0)" fill="#1d283c"/></clipPath></defs><g id="Group_2381" data-name="Group 2381" clip-path="url(#clip-path)"><path id="Path_8260" data-name="Path 8260" d="M34.231,5.866A20.057,20.057,0,1,0,40.113,20.04,20.056,20.056,0,0,0,34.231,5.866" fill="#121e2e" fill-rule="evenodd"/><path id="Path_8261" data-name="Path 8261" d="M18.6,25.309l-1.365-1.365,3.872-3.878-3.87-3.894L18.6,14.8l5.255,5.252Z" fill="#fff" fill-rule="evenodd"/></g></svg></button>',
    responsive: [
      {
        breakpoint: 992,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 2,
          centerMode: true,
          centerPadding: "52px",
        },
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
          centerMode: true,
          centerPadding: "52px",
        },
      },
    ],
  });

  // Function to update visibility based on active span
  function updateVisibility() {
    // Hide all control wrappers
    $(".control-1-wrap, .control-2-wrap").hide();
    // Show the wrapper corresponding to the active span
    if ($(".control-1").hasClass("active")) {
      $(".control-1-wrap").show();
      $(".control-1-slider").slick("setPosition");
    } else if ($(".control-2").hasClass("active")) {
      $(".control-2-wrap").show();
      $(".control-1-slider").slick("setPosition");
    }
  }

  // Initial visibility update
  updateVisibility();

  // Click event to toggle active class and update visibility
  $(".controls-12 span").on("click", function () {
    // Remove 'active' class from all spans
    $(".controls-12 span").removeClass("active");
    // Add 'active' class to the clicked span
    $(this).addClass("active");
    // Update visibility based on the new active span
    updateVisibility();
    $(".control-2-wrap .control-card-wrap .control-card").matchHeight();
    $(".control-1-slider").slick("setPosition");
    // setTimeout(() => {
    //   $(window).trigger("resize");
    //   if( $(window).innerWidth() < 767 ){
    //     $(".slick-next").click();
    //   }
    // }, 1000);

  });

  $(".grid-toggle a").on("click", function (e) {
    e.preventDefault();
    $(".grid-toggle").hide();
    $(".grid-collapse").show();
    $(".control-1-slider").hide();
    $(".control-grid").fadeIn().css("display", "flex");

    // GRID MATCHHEIGHT
    $(".control-1-grid .control-card-wrap .control-card").matchHeight();
    $(".control-1-slider").slick("setPosition");

    $("html, body").animate(
      {
        scrollTop: $(".controls-12").offset().top - 50,
      },
      600
    ); // 600ms scroll speed
  });

  // Debounce resize event
  let resizeTimer;
  $(window).on("resize", function () {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(function () {
      $(".control-1-grid .control-card-wrap .control-card").matchHeight();
    }, 200); // delay in ms
  });

  $(".grid-collapse a").on("click", function (e) {
    e.preventDefault();
    $(".grid-toggle").show();
    $(".control-1-slider").show();
    $(".control-grid").hide();
    $(".grid-collapse").hide();
    $(".control-1-slider").slick("setPosition");
    $("html, body").animate(
      {
        scrollTop: $(".controls-12").offset().top - 50,
      },
      600
    ); // 600ms scroll speed
  });

  $(".anchor_wrap ul a").on("click", function (e) {
    e.preventDefault(); // Prevent the default anchor link behavior

    var target = $(this).attr("href"); // Get the target section
    var headerHeight = $(".anchor_menu").outerHeight(); // Get the height of the sticky header

    // Scroll to the target section with the offset
    var offsetAdjustment = window.innerWidth > 1300 ? -0 : 0;

    $("html, body").animate(
      {
        scrollTop: $(target).offset().top - headerHeight + offsetAdjustment,
      },
      500
    );
  });
});



document.addEventListener("DOMContentLoaded", function () {
  const section = document.querySelector(".excellence-video");
  const iframe = document.querySelector(".excellence-video .vimeoPlayer");

  if (!iframe || !section) return;

  const player = new Vimeo.Player(iframe);

  function isInViewport(el) {
    const rect = el.getBoundingClientRect();
    return rect.top < window.innerHeight && rect.bottom > 0;
  }

  function handleScroll() {
    if (isInViewport(section)) {
      player.play().catch((err) => {
        console.log("Play failed:", err.name);
      });
    } else {
      player.pause();
    }
  }

  window.addEventListener("scroll", handleScroll);
  handleScroll(); // Trigger once on load
});




// REVIEW SLIDER
jQuery(document).ready(function ($) {
  var $slider  = $('.review-slider');
  if (!$slider.length) return;
  var isQuote  = !!$slider.closest('#quote').length;

  $slider.on('init', function () {
    $slider.find('.review-card').each(function () {
      var $content = $(this).find('.review-content');
      var $toggle  = $(this).find('.read-more-toggle');
      if ($content.height() <= 160) $toggle.hide();
    });
  });

  $slider.slick(isQuote ? {
    slidesToShow: 1,
    slidesToScroll: 1,
    infinite: true,
    arrows: true,
    dots: false,
    centerMode: true,
    centerPadding: '506px',
    autoplay: false,
    draggable: false,
    swipe: true,
    responsive: [
      { breakpoint: 1600, settings: { slidesToShow: 1, centerMode: true, centerPadding: '300px', draggable: false, swipe: true } },
      { breakpoint: 1200, settings: { slidesToShow: 1, centerMode: true, centerPadding: '80px', draggable: true, swipe: true } },
      { breakpoint: 768,  settings: { slidesToShow: 1, centerMode: false, centerPadding: '0px', draggable: true, swipe: true } }
    ]
  } : {
    slidesToShow: 4,
    slidesToScroll: 1,
    infinite: true,
    arrows: true,
    dots: false,
    draggable: false,
    swipe: true,
    autoplay: true,
    autoplaySpeed: 4000,
    responsive: [
      { breakpoint: 1500, settings: { slidesToShow: 3, draggable: false, swipe: false } },
      { breakpoint: 992,  settings: { slidesToShow: 2, draggable: true,  swipe: true  } },
      { breakpoint: 600,  settings: { slidesToShow: 1, draggable: true,  swipe: true  } }
    ]
  });

  $slider.on('click', '.read-more-toggle', function () {
    var $card    = $(this).closest('.review-card');
    var $content = $card.find('.review-content');
    var $btn     = $(this);
    var expanded = $btn.hasClass('is-expanded');

    $('.review-card').removeClass('expanded');
    $('.review-content').removeClass('expanded');
    $('.read-more-toggle').removeClass('is-expanded').text('Read more');

    if (!expanded) {
      $card.addClass('expanded');
      $content.addClass('expanded');
      $btn.addClass('is-expanded').text('Read less');
    }

    $slider.slick('setPosition');
  });

  $('.two_col-img.slider').slick({
        slidesToShow: 1,
        slidesToScroll: 1,
        arrows: true,
        dots: false,
        infinite: true,
        prevArrow: '<button type="button" class="slick-prev"><svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="40.113" height="40.113" viewBox="0 0 40.113 40.113"><defs><clipPath id="clip-path"><rect id="Rectangle_2108" data-name="Rectangle 2108" width="40.113" height="40.113" transform="translate(0 0)" fill="#1d283c"/></clipPath></defs><g id="Group_2431" data-name="Group 2431" transform="translate(40.113 40.113) rotate(180)"><g id="Group_2381" data-name="Group 2381" clip-path="url(#clip-path)"><path id="Path_8260" data-name="Path 8260" d="M34.231,5.866A20.057,20.057,0,1,0,40.113,20.04,20.056,20.056,0,0,0,34.231,5.866" fill="#1D283C" fill-rule="evenodd"/><path id="Path_8261" data-name="Path 8261" d="M18.6,25.309l-1.365-1.365,3.872-3.878-3.87-3.894L18.6,14.8l5.255,5.252Z" fill="#fff" fill-rule="evenodd"/></g></g></svg></button>',
        nextArrow: '<button type="button" class="slick-next"><svg id="Group_2430" data-name="Group 2430" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="40.113" height="40.113" viewBox="0 0 40.113 40.113"><defs><clipPath id="clip-path"><rect id="Rectangle_2108" data-name="Rectangle 2108" width="40.113" height="40.113" transform="translate(0 0)" fill="#1d283c"/></clipPath></defs><g id="Group_2381" data-name="Group 2381" clip-path="url(#clip-path)"><path id="Path_8260" data-name="Path 8260" d="M34.231,5.866A20.057,20.057,0,1,0,40.113,20.04,20.056,20.056,0,0,0,34.231,5.866" fill="#1D283C" fill-rule="evenodd"/><path id="Path_8261" data-name="Path 8261" d="M18.6,25.309l-1.365-1.365,3.872-3.878-3.87-3.894L18.6,14.8l5.255,5.252Z" fill="#fff" fill-rule="evenodd"/></g></svg></button>',
    });

});


jQuery(document).ready(function($) {
  var $slider = $('.work-slider');

  // Initialize Slick
  $slider.slick({
    slidesToShow: 2.3,
    slidesToScroll: 2,
    arrows: true,
    infinite: false,
    dots: false,
    autoplay: false,
       prevArrow: '<button type="button" class="slick-prev"><svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="40.113" height="40.113" viewBox="0 0 40.113 40.113"><defs><clipPath id="clip-path"><rect id="Rectangle_2108" data-name="Rectangle 2108" width="40.113" height="40.113" transform="translate(0 0)" fill="#1d283c"/></clipPath></defs><g id="Group_2431" data-name="Group 2431" transform="translate(40.113 40.113) rotate(180)"><g id="Group_2381" data-name="Group 2381" clip-path="url(#clip-path)"><path id="Path_8260" data-name="Path 8260" d="M34.231,5.866A20.057,20.057,0,1,0,40.113,20.04,20.056,20.056,0,0,0,34.231,5.866" fill="#1D283C" fill-rule="evenodd"/><path id="Path_8261" data-name="Path 8261" d="M18.6,25.309l-1.365-1.365,3.872-3.878-3.87-3.894L18.6,14.8l5.255,5.252Z" fill="#fff" fill-rule="evenodd"/></g></g></svg></button>',
        nextArrow: '<button type="button" class="slick-next"><svg id="Group_2430" data-name="Group 2430" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="40.113" height="40.113" viewBox="0 0 40.113 40.113"><defs><clipPath id="clip-path"><rect id="Rectangle_2108" data-name="Rectangle 2108" width="40.113" height="40.113" transform="translate(0 0)" fill="#1d283c"/></clipPath></defs><g id="Group_2381" data-name="Group 2381" clip-path="url(#clip-path)"><path id="Path_8260" data-name="Path 8260" d="M34.231,5.866A20.057,20.057,0,1,0,40.113,20.04,20.056,20.056,0,0,0,34.231,5.866" fill="#1D283C" fill-rule="evenodd"/><path id="Path_8261" data-name="Path 8261" d="M18.6,25.309l-1.365-1.365,3.872-3.878-3.87-3.894L18.6,14.8l5.255,5.252Z" fill="#fff" fill-rule="evenodd"/></g></svg></button>',
        responsive: [
        {
          breakpoint: 1024,
          settings: {
            slidesToShow: 1.8,
            slidesToScroll: 1
          }
        },
        {
          breakpoint: 768,
          settings: {
            slidesToShow: 1,
            slidesToScroll: 1,
            centerMode: true,       // enable center mode
            centerPadding: '30px'   // 50px padding on mobile
          }
        }
      ]

  });

  // Vimeo setup
  var vimeoPlayers = [];
  $slider.find('.vimeo iframe').each(function(i) {
    var player = new Vimeo.Player(this);
    vimeoPlayers.push(player);
  });

  function setActiveVideo(index) {
    $('.work-slider .vimeo iframe').css({
      opacity: '0',
      transition: 'opacity 0.4s ease'
    });
    $('.work-slider .vimeo iframe').eq(index).css('opacity', '1');
  }

  function playOnly(index) {
    vimeoPlayers.forEach((player, i) => {
      if (i === index) player.play();
      else player.pause();
    });
  }

  // On initial load
  if (vimeoPlayers.length) {
    setActiveVideo(0);
    playOnly(0);
  }

  // On slide change
  $slider.on('afterChange', function(event, slick, currentSlide) {
    setActiveVideo(currentSlide);
    playOnly(currentSlide);
  });

  // On hover — play hovered video
  $slider.on('mouseenter', '.item', function() {
    const $iframe = $(this).find('.vimeo iframe');
    const index = $('.work-slider .vimeo iframe').index($iframe);

    // make only this video visible
    $('.work-slider .vimeo iframe').css('opacity', '0');
    $iframe.css('opacity', '1');

    // pause others, play this one
    vimeoPlayers.forEach((player, i) => {
      if (i === index) player.play();
      else player.pause();
    });
  });

  // On mouse leave — revert to active slide video
  $slider.on('mouseleave', '.item', function() {
    const currentSlide = $slider.slick('slickCurrentSlide');
    setActiveVideo(currentSlide);
    playOnly(currentSlide);
  });
});


// WORK RESIZE
jQuery(document).ready(function($) {
    function adjustWordSliderMargin() {
        const $work = $('#work');
        if ($work.length) {
            const containerOffset = $work.find('.container').offset().left || 0;
            $('.word-slider-wrap').css('margin-left', containerOffset + 15 + 'px');
        }
    }

    // Run on load
    adjustWordSliderMargin();

    // Run on resize
    $(window).on('resize', function() {
        adjustWordSliderMargin();
    });
});

// WORK RESIZE



// REVIEWS ANIMATION

jQuery(document).ready(function($) {
    const $container = $('.reviews-layered');
    // --- MOBILE WRAPPER FUNCTION ---
   (function createMobileWrapper() {
    // Create a new mobile wrapper
    const $mobileWrap = $('<div class="reviews-mobile-wrap"></div>');
    $container.before($mobileWrap);
    $mobileWrap.append($container); // move original container inside

    const $cards = $container.find('.review-card-link');

    // Calculate cards per row dynamically for 3 rows
    const totalCards = $cards.length;
    const cardsPerRow = Math.ceil(totalCards / 3); // divide total into 3 rows

    // Create a single inner wrapper for all rows
    const $rowsWrapper = $('<div class="reviews-rows-wrapper"></div>');
    $mobileWrap.append($rowsWrapper);

    for (let i = 0; i < totalCards; i += cardsPerRow) {
      const $cloneRow = $('<div class="reviews-row"></div>');

      // Take next set of cards
      $cards.slice(i, i + cardsPerRow).each(function() {
        $cloneRow.append($(this).clone(true, true));
      });

      $rowsWrapper.append($cloneRow);
    }

    // Add class to original container for desktop styling
    $container.addClass('reviews-desktop');
  })();



 // --- DESKTOP STAGGERED ANIMATION ---
const $cards = $container.find('.review-card');
let visibleCount = 0;
let delay = 100;
const maxVisible = 15;
const slowDelay = 2000;

if ($container.css('position') === 'static') {
  $container.css('position', 'relative');
}

function getStaggeredPosition(index) {
  const cardW = $cards.eq(0).outerWidth();
  const cardH = $cards.eq(0).outerHeight();
  const containerW = $container.innerWidth();
  const containerH = $container.innerHeight();

  const cols = Math.max(1, Math.floor(containerW / cardW));

  let rowIndex;
  let colIndex;

  // FIRST 20 → original behavior (natural grid)
  if (index < 20) {
    rowIndex = Math.floor(index / cols);
    colIndex = index % cols;
  } 
  // AFTER 20 → force into row 0 or 1 randomly
  else {
    rowIndex = Math.random() < 0.5 ? 0 : 1;
    colIndex = Math.floor(Math.random() * cols);
  }

  let left = colIndex * cardW;

  // Center row
  const rowOffset = (containerW - cols * cardW) / 2;
  left += rowOffset;

  // Stagger
  left += (Math.random() - 0.5) * cardW * 0.6;
  let top = rowIndex * cardH + (Math.random() - 0.5) * cardH * 0.3;

  // Clamp (same as original intent)
  left = Math.min(Math.max(0, left), containerW - cardW);
  top = Math.min(Math.max(0, top), containerH - cardH);

  return { top, left };
}


function positionCard($card, index) {
  const pos = getStaggeredPosition(index);
  $card.css({
    top: pos.top + 'px',
    left: pos.left + 'px',
    'z-index': index + 1
  });
}

function showNext() {
  if (visibleCount < $cards.length) {
    const $card = $cards.eq(visibleCount);
    $card.removeClass('hidden').addClass('visible');
    positionCard($card, visibleCount);

    visibleCount++;

    if (visibleCount < maxVisible) {
      delay += 50;
      setTimeout(showNext, delay);
    } else {
      setInterval(() => {
        if (visibleCount < $cards.length) {
          const $nextCard = $cards.eq(visibleCount);
          $nextCard.removeClass('hidden').addClass('visible');
          positionCard($nextCard, visibleCount);
          visibleCount++;
        }
      }, slowDelay);
    }
  }
}

// --- Intersection Observer ---
const observer = new IntersectionObserver(
  (entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        showNext();
        obs.unobserve(entry.target); // run once
      }
    });
  },
  { threshold: 0.2 } // trigger when 10% of container is visible
);

if ($container && $container.length && $container[0] instanceof Element) {
    observer.observe($container[0]);
}


  $(window).on('resize', function() {
    $cards.filter('.visible').each(function(index) {
      positionCard($(this), index);
    });
  });
});


// REVIEWS ANIMATION - row stagger with last row centered
jQuery(document).ready(function ($) {
  const scrollSpeed = 0.5;
  const intervalTime = 20;
  const restartDelay = 2000; // 2 seconds after drag ends

  function initRow($row, index) {
    let scrollInterval = null;
    let restartTimeout = null;
    let isDragging = false;
    let startX = 0;
    let startTranslate = 0;
    let currentTranslate = 0;

    const startDelay = index * 500;

    // wrap inner items
    if (!$row.find(".scroll-inner").length) {
      $row.wrapInner('<div class="scroll-inner"></div>');
    }
    const $inner = $row.find(".scroll-inner");

    const maxScroll = $inner[0].scrollWidth - $row.outerWidth();

    // Auto-scroll function
    function startScroll() {
      if (scrollInterval) return;

      scrollInterval = setInterval(() => {
        if (isDragging) return; // pause while dragging

        currentTranslate += scrollSpeed;

        // Loop reset at end
        if (currentTranslate >= maxScroll) currentTranslate = 0;

        $inner.css("transform", `translateX(${-currentTranslate}px)`);
      }, intervalTime);
    }

    function stopScroll() {
      clearInterval(scrollInterval);
      scrollInterval = null;
    }

    // --- Drag Start ---
    $row.on("mousedown touchstart", function (e) {
      if ($(e.target).closest("[data-fancybox]").length) return;

      isDragging = true;
      startX = e.pageX || e.originalEvent.touches[0].pageX;
      startTranslate = currentTranslate;

      // stop any pending restart
      if (restartTimeout) clearTimeout(restartTimeout);

      // console.log(`🖐 Drag started on reviews-row ${index}`);
    });

    // --- Drag Move ---
    $row.on("mousemove touchmove", function (e) {
      if (!isDragging) return;

      const x = e.pageX || e.originalEvent.touches[0].pageX;
      const walk = startX - x;

      currentTranslate = startTranslate + walk;

      // clamp
      if (currentTranslate < 0) currentTranslate = 0;
      if (currentTranslate > maxScroll) currentTranslate = maxScroll;

      $inner.css("transform", `translateX(${-currentTranslate}px)`);

      // console.log(`💨 Reviews-row ${index} is being dragged, moved: ${walk}px`);

      e.preventDefault(); // prevent page scroll
    });

    // --- Drag End ---
    $row.on("mouseup touchend touchcancel mouseleave", function () {
      if (!isDragging) return;

      isDragging = false;

      // Log scroll %
      const scrollPercent = (currentTranslate / maxScroll) * 100;
      // console.log(`✋ Drag ended on reviews-row ${index}: scroll %: ${scrollPercent.toFixed(2)}%`);

      if (scrollPercent >= 100) {
        console.log("🎉 Reviews-row reached 100% scroll!");
      }

      // After 2 seconds, reset scroll-inner to beginning
      restartTimeout = setTimeout(() => {
        currentTranslate = 0;
        $inner.css("transform", `translateX(0px)`);
        // console.log(`🔄 Reviews-row ${index} reset to start after 2 seconds`);
      }, restartDelay);
    });

    // Observe visibility
    setTimeout(() => {
      rowObserver.observe($row[0]);
    }, startDelay);

    return { startScroll, stopScroll };
  }

  let rowControllers = [];

  const rowObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        const index = $(entry.target).data("scroll-index");
        const controller = rowControllers[index];

        if (entry.isIntersecting) {
          controller.startScroll();
        } else {
          controller.stopScroll();
        }
      });
    },
    {
      threshold: 0.2,
      rootMargin: "-150px 0px -150px 0px"
    }
  );

  $(".reviews-row").each(function (index) {
    $(this).attr("data-scroll-index", index);
    rowControllers[index] = initRow($(this), index);
  });
});



// REVIEWS ANIMATION


// STAR REPLACE
window.addEventListener('load', () => {
  setTimeout(() => {
    const oldUrl = "https://cdn-icons-png.flaticon.com/512/1828/1828884.png";
    const newUrl = "https://www.titanshutters.com.au/wp-content/uploads/2025/11/titan-star.svg";

    document.querySelectorAll(`img[src="${oldUrl}"]`).forEach(img => {
      img.src = newUrl;
    });
  }, 1000); // 1 second
});

// STAR REPLACE




// FANCYBOX ROTATE FIX
let activeTriggercc = null;
let handling = false;

// ✅ Capture dynamically added Fancybox triggers
document.addEventListener("click", (e) => {
  const trigger = e.target.closest("[data-fancybox]");
  if (!trigger) return;

  activeTriggercc = trigger;
  console.log("Fancybox opened by:", trigger);
});

// Shared safe handler
function handleFancyboxReset() {
  const instance = Fancybox.getInstance();

  // Run ONLY when Fancybox is open and not already handling
  if (!instance || !activeTriggercc || handling) return;

  handling = true;
  console.log("Resetting Fancybox");

  instance.close();

  setTimeout(() => {
    console.log("Reopening Fancybox");
    activeTriggercc.click();
    handling = false;
  }, 1000);
}

// 🔁 Orientation change
window.addEventListener("orientationchange", handleFancyboxReset);

// 🔁 Resize (throttled by handling flag)
window.addEventListener("resize", handleFancyboxReset);


// FANCYBOX ROTATE FIX


jQuery(function ($) {
    const $items = $('.cus-review, .measure, .fast-response');
    let index = 0;
    let timer = null;

    function showItem(i) {
        $items.stop(true, true).hide();
        $items.eq(i).fadeIn(400);
    }

    function startRotation() {
        if (timer) return;

        showItem(index);

        timer = setInterval(function () {
            index = (index + 1) % $items.length;
            showItem(index);
        }, 3000); // change interval as needed
    }

    function stopRotation() {
        clearInterval(timer);
        timer = null;
        $items.show(); // restore desktop layout
    }

    function checkWidth() {
        if ($(window).width() <= 769) {
            startRotation();
        } else {
            stopRotation();
        }
    }

    checkWidth();

    $(window).on('resize', function () {
        checkWidth();
    });
});//  RUN cat custom.js motors.js two-col-slider.js > final.js on windows terminal


jQuery(document).ready(function ($) {
    $(".two_col-gallery").slick({
        slidesToShow: 1,
        slidesToScroll: 1,
        arrows: true,
        dots: false,
        infinite: true,
        prevArrow:
          '<button type="button" class="slick-prev"><svg xmlns="http://www.w3.org/2000/svg" width="40.112" height="40.113" viewBox="0 0 40.112 40.113"><g id="leftarrow_white" transform="translate(1735.113 12223.594) rotate(180)"><path id="Path_8260" data-name="Path 8260" d="M34.231,5.866A20.057,20.057,0,1,0,40.113,20.04,20.056,20.056,0,0,0,34.231,5.866" transform="translate(1695 12183.48)" fill="#1d283c" fill-rule="evenodd"/><path id="Path_8261" data-name="Path 8261" d="M18.6,25.309l-1.365-1.365,3.872-3.878-3.87-3.894L18.6,14.8l5.255,5.252Z" transform="translate(1695 12183.48)" fill="#d7e3e6" fill-rule="evenodd"/></g></svg></button>',
        nextArrow:
          '<button type="button" class="slick-next"><svg xmlns="http://www.w3.org/2000/svg" width="40.112" height="40.113" viewBox="0 0 40.112 40.113"><g id="rightarrow_white" transform="translate(-1695.001 -12183.48)"><path id="Path_8260" data-name="Path 8260" d="M34.231,5.866A20.057,20.057,0,1,0,40.113,20.04,20.056,20.056,0,0,0,34.231,5.866" transform="translate(1695 12183.48)" fill="#1d283c" fill-rule="evenodd"/><path id="Path_8261" data-name="Path 8261" d="M18.6,25.309l-1.365-1.365,3.872-3.878-3.87-3.894L18.6,14.8l5.255,5.252Z" transform="translate(1695 12183.48)" fill="#d7e3e6" fill-rule="evenodd"/></g></svg></button>',
    });
});


// STICKY BOTTOM
(function () {
    const stickyBar = document.querySelector("#sticky-bottom");

    const targets = document.querySelectorAll(
        ".book-now, .get-in-touch, #blue-quote, .has-quote"
    );

    if (!stickyBar) return;

    function isSectionVisible(el) {
        const rect = el.getBoundingClientRect();

        return (
            rect.top < window.innerHeight &&
            rect.bottom > 0
        );
    }

    function check() {
        const scrolledEnough = window.scrollY > window.innerHeight / 2;

        let sectionActive = false;

        targets.forEach((el) => {
            if (isSectionVisible(el)) {
                sectionActive = true;
            }
        });

        const shouldShow = scrolledEnough && !sectionActive;

        if (shouldShow) {
            stickyBar.classList.add("is-visible");
            stickyBar.style.opacity = "1";
            stickyBar.style.pointerEvents = "auto";
        } else {
            stickyBar.classList.remove("is-visible");
            stickyBar.style.opacity = "0";
            stickyBar.style.pointerEvents = "none";
        }
    }

    window.addEventListener("scroll", check, { passive: true });
    window.addEventListener("resize", check);

    check();
})();