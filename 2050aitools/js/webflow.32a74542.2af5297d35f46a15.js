/*!
 * Webflow: Front-end site library v1.19.2
 * Mon Aug 28 2023 18:08:44 GMT+0000 (Coordinated Universal Time)
 */
(() => {
  var __webpack_modules__ = {
    "4vf": module => {
      (function() {
        var define, factory;

        (function(root) {
          var Slick = function(context, settings) {
            var _ = this, data, autoplayTimer, animType, animProp,
            slickList, slideTrack, slideCount, slideWidth, slideHeight,
            slideOffset, sliderWidth, sliderHeight, instanceUid,
            options = {
              accessibility: true,
              adaptiveHeight: false,
              appendArrows: $(context),
              appendDots: $(context),
              arrows: true,
              asNavFor: null,
              prevArrow: '<button class="slick-prev" aria-label="Previous" type="button">Previous</button>',
              nextArrow: '<button class="slick-next" aria-label="Next" type="button">Next</button>',
              autoplay: false,
              autoplaySpeed: 3000,
              centerMode: false,
              centerPadding: '50px',
              cssEase: 'ease',
              customPaging: function(slider, i) {
                return $('<button type="button" />').text(i + 1);
              },
              dots: false,
              dotsClass: 'slick-dots',
              draggable: true,
              easing: 'linear',
              edgeFriction: 0.35,
              fade: false,
              focusOnSelect: false,
              focusOnChange: false,
              infinite: true,
              initialSlide: 0,
              lazyLoad: 'ondemand',
              mobileFirst: false,
              pauseOnHover: true,
              pauseOnFocus: true,
              pauseOnDotsHover: false,
              respondTo: 'window',
              responsive: null,
              rows: 1,
              rtl: false,
              slide: 'div',
              slidee: 'slide',
              slidesToShow: 1,
              slidesToScroll: 1,
              speed: 500,
              swipe: true,
              swipeToSlide: false,
              touchMove: true,
              useCSS: true,
              useTransform: true,
              variableWidth: false,
              vertical: false,
              verticalSwiping: false,
              waitForAnimate: true,
              zIndex: 1000
            };
          , breakpointSettings = {
            0: {
              edgeFriction: settings.edgeFriction
            }
          }
          , _.$slider = $(context)
          , elementContext = $(context)
          , instance = $(context).data('slick') || {};
          
          _.$slidesCache = null

          _.defaults = options

          _.initials = {
            animating: false,
            dragging: false,
            autoPlayTimer: null,
            currentSlide: 0,
            currentLeft: null,
            direction: 1,
            $dots: null,
            dotsData: null,
            dotsCount: 0,
            dotsCurrentIndex: 0,
            fadeAllowed: !options.fade || options.slidesToShow === 1,
            instanceUid: instanceUid,
            htmlExpr: /<(.*?)\>.*?<\/\1\>|\s+_/g,
            index: 0,
            initialized: false,
            interrupted: false,
            lastArrowDirection: 0,
            lazyloadCounter: 0,
            listWidth: null,
            listHeight: null,
            loadCount: 0,
            maximums: {},
            multiplexer: false,
            mousewheelTimeout: null,
            navigating: false,
            onDemandLazyLoad: false,
            options: $.extend({}, options),
            paused: true,
            positionOffset: 0,
            progressBarDelay: null,
            progressBarPercentage: 0,
            progressBarPause: null,
            progressTimer: null,
            progressTimerAll: null,
            progressTimerEased: null,
            responsiveLevels: [],
            rows: options.rows,
            $slideTrack: null,
            $slides: null,
            sliding: false,
            slideCount: null,
            slideOffset: 0,
            slideWidth: options.variableWidth ? null : options.slideWidth,
            slideHeight: options.adaptiveHeight ? null : options.slideHeight,
            sliderWidth: null,
            sliderHeight: null,
            speed: options.speed,
            startingSlide: options.initialSlide,
            swipeLeft: null,
            swiping: false,
            slideCount: null,
            $slider: $(context),
            $slideTrack: $(null),
            touchObject: {},
            transformsEnabled: options.useTransform === false ? false : hasTransform,
            transitionType: options.speed === 0 ? 'none' : options.cssEase,
            transitionTime: options.speed === 0 ? 0 : options.speed
          };

          $.extend(_, _.initials);

          _.activeBreakpoint = null;
          _.animType = options.fade ? 'opacity' : _.getAnimType();
          _.animProp = _.animType === 'opacity' ? 'opacit'