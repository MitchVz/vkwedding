if (Meteor.isClient) {




    openPhotoSwipe = function() {
        var pswpElement = document.querySelectorAll('.pswp')[0];

        var items = [

            // Slide 1
            {
                mediumImage: {
                    src: '/images/gallery/photo_1_sm.jpg',
                    w:600,
                    h:426
                },
                originalImage: {
                    src: '/images/gallery/photo_1_lg.jpg',
                    w: 3000,
                    h: 2132
                }
            },
            // Slide 2
            {
                mediumImage: {
                    src: '/images/gallery/photo_21_sm.jpg',
                    w:600,
                    h:400
                },
                originalImage: {
                    src: '/images/gallery/photo_21_lg.jpg',
                    w: 3000,
                    h: 2000
                }
            },
            // Slide 3
            {
                mediumImage: {
                    src: '/images/gallery/photo_26_sm.jpg',
                    w:600,
                    h:400
                },
                originalImage: {
                    src: '/images/gallery/photo_26_lg.jpg',
                    w: 3000,
                    h: 2000
                }
            },
            // Slide 4
            {
                mediumImage: {
                    src: '/images/gallery/photo_37_sm.jpg',
                    w:600,
                    h:400
                },
                originalImage: {
                    src: '/images/gallery/photo_37_lg.jpg',
                    w: 3000,
                    h: 2000
                }
            }

        ];

        // define options (if needed)
        var options = {
            history: false,
            focus: false,

            showAnimationDuration: 0,
            hideAnimationDuration: 0
        };

        // initialise as usual
        var gallery = new PhotoSwipe( pswpElement, PhotoSwipeUI_Default, items, options);

        // create variable that will store real size of viewport
        var realViewportWidth,
            useLargeImages = false,
            firstResize = true,
            imageSrcWillChange;

        // beforeResize event fires each time size of gallery viewport updates
        gallery.listen('beforeResize', function() {
            // gallery.viewportSize.x - width of PhotoSwipe viewport
            // gallery.viewportSize.y - height of PhotoSwipe viewport
            // window.devicePixelRatio - ratio between physical pixels and device independent pixels (Number)
            //                          1 (regular display), 2 (@2x, retina) ...


            // calculate real pixels when size changes
            realViewportWidth = gallery.viewportSize.x * window.devicePixelRatio;

            // Code below is needed if you want image to switch dynamically on window.resize

            // Find out if current images need to be changed
            if(useLargeImages && realViewportWidth < 1000) {
                useLargeImages = false;
                imageSrcWillChange = true;
            } else if(!useLargeImages && realViewportWidth >= 1000) {
                useLargeImages = true;
                imageSrcWillChange = true;
            }

            // Invalidate items only when source is changed and when it's not the first update
            if(imageSrcWillChange && !firstResize) {
                // invalidateCurrItems sets a flag on slides that are in DOM,
                // which will force update of content (image) on window.resize.
                gallery.invalidateCurrItems();
            }

            if(firstResize) {
                firstResize = false;
            }

            imageSrcWillChange = false;

        });


        // gettingData event fires each time PhotoSwipe retrieves image source & size
        gallery.listen('gettingData', function(index, item) {

            // Set image source & size based on real viewport width
            if( useLargeImages ) {
                item.src = item.originalImage.src;
                item.w = item.originalImage.w;
                item.h = item.originalImage.h;
            } else {
                item.src = item.mediumImage.src;
                item.w = item.mediumImage.w;
                item.h = item.mediumImage.h;
            }

            // It doesn't really matter what will you do here,
            // as long as item.src, item.w and item.h have valid values.
            //
            // Just avoid http requests in this listener, as it fires quite often

        });


        // Note that init() method is called after gettingData event is bound
        gallery.init();
    };



}

