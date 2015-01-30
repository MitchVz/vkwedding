if (Meteor.isClient) {


    initPhotoSwipeFromDOM = function(gallerySelector) {

        var parseThumbnailElements = function(el) {
            var thumbElements = el.childNodes,
                numNodes = thumbElements.length,
                items = [],
                el,
                childElements,
                thumbnailEl,
                size,
                item;

            for (var i = 0; i < numNodes; i++) {
                el = thumbElements[i];

                // include only element nodes
                if(el.nodeType !== 1) {
                    continue;
                }

                childElements = el.childNodes[1].children;

                size = el.childNodes[1].getAttribute('data-size').split('x');

                // create slide object
                item = {
                    src: el.childNodes[1].getAttribute('href'),
                    w: parseInt(size[0], 10),
                    h: parseInt(size[1], 10),
                    author: el.childNodes[1].getAttribute('data-author')
                };

                item.el = el.childNodes[1]; // save link to element for getThumbBoundsFn

                if(childElements.length > 0) {
                    item.msrc = childElements[0].getAttribute('src'); // thumbnail url
                    if(childElements.length > 1) {
                        item.title = childElements[1].innerHTML; // caption (contents of figure)
                    }
                }


                var mediumSrc = el.childNodes[1].getAttribute('data-med');
                if(mediumSrc) {
                    size = el.childNodes[1].getAttribute('data-med-size').split('x');
                    // "medium-sized" image
                    item.m = {
                        src: mediumSrc,
                        w: parseInt(size[0], 10),
                        h: parseInt(size[1], 10)
                    };
                }
                // original image
                item.o = {
                    src: item.src,
                    w: item.w,
                    h: item.h
                };

                items.push(item);
            }

            return items;
        };

        // find nearest parent element
        var closest = function closest(el, fn) {
            return el && ( fn(el) ? el : closest(el.parentNode, fn) );
        };

        var onThumbnailsClick = function(e) {
            e = e || window.event;
            e.preventDefault ? e.preventDefault() : e.returnValue = false;

            var eTarget = e.target || e.srcElement;

            var clickedListItem = closest(eTarget, function(el) {
                return el.tagName === 'A';
            });

            if(!clickedListItem) {
                return;
            }

            var clickedGallery = clickedListItem.parentNode.parentNode;

            var childNodes = clickedListItem.parentNode.parentNode.childNodes,
                numChildNodes = childNodes.length,
                nodeIndex = 0,
                index;

            for (var i = 0; i < numChildNodes; i++) {
                if(childNodes[i].nodeType !== 1) {
                    continue;
                }

                if(childNodes[i].childNodes[1] === clickedListItem) {
                    index = nodeIndex;
                    break;
                }
                nodeIndex++;
            }

            if(index >= 0) {
                openPhotoSwipe( index, clickedGallery );
            }
            return false;
        };

        var photoswipeParseHash = function() {
            var hash = window.location.hash.substring(1),
                params = {};

            if(hash.length < 5) { // pid=1
                return params;
            }

            var vars = hash.split('&');
            for (var i = 0; i < vars.length; i++) {
                if(!vars[i]) {
                    continue;
                }
                var pair = vars[i].split('=');
                if(pair.length < 2) {
                    continue;
                }
                params[pair[0]] = pair[1];
            }

            if(params.gid) {
                params.gid = parseInt(params.gid, 10);
            }

            if(!params.hasOwnProperty('pid')) {
                return params;
            }
            params.pid = parseInt(params.pid, 10);
            return params;
        };

        var openPhotoSwipe = function(index, galleryElement, disableAnimation) {
            var pswpElement = document.querySelectorAll('.pswp')[0],
                gallery,
                options,
                items;

            items = parseThumbnailElements(galleryElement);

            // define options (if needed)
            options = {
                index: index,

                galleryUID: galleryElement.getAttribute('data-pswp-uid'),

                getThumbBoundsFn: function(index) {
                    // See Options->getThumbBoundsFn section of docs for more info
                    var thumbnail = items[index].el.children[0],
                        pageYScroll = window.pageYOffset || document.documentElement.scrollTop,
                        rect = thumbnail.getBoundingClientRect();

                    return {x:rect.left, y:rect.top + pageYScroll, w:rect.width};
                },

                addCaptionHTMLFn: function(item, captionEl, isFake) {
                    if(!item.title) {
                        captionEl.children[0].innerText = '';
                        return false;
                    }
                    captionEl.children[0].innerHTML = item.title +  '<br/><small>Photo: ' + item.author + '</small>';
                    return true;
                }

            };

            // Setting minimal options
            options.mainClass = 'pswp--minimal--dark';
            options.barsSize = {top:0,bottom:0};
            options.captionEl = false;
            options.fullscreenEl = true;
            options.shareEl = false;
            options.bgOpacity = 0.85;
            options.tapToClose = true;
            options.tapToToggleControls = false;


            if(disableAnimation) {
                options.showAnimationDuration = 0;
            }

            // Pass data to PhotoSwipe and initialize it
            gallery = new PhotoSwipe( pswpElement, PhotoSwipeUI_Default, items, options);

            // see: http://photoswipe.com/documentation/responsive-images.html
            var realViewportWidth,
                useLargeImages = false,
                firstResize = true,
                imageSrcWillChange;

            gallery.listen('beforeResize', function() {

                var dpiRatio = window.devicePixelRatio ? window.devicePixelRatio : 1;
                dpiRatio = Math.min(dpiRatio, 2.5);
                realViewportWidth = gallery.viewportSize.x * dpiRatio;


                if(realViewportWidth >= 1200 || (!gallery.likelyTouchDevice && realViewportWidth > 800) || screen.width > 1200 ) {
                    if(!useLargeImages) {
                        useLargeImages = true;
                        imageSrcWillChange = true;
                    }

                } else {
                    if(useLargeImages) {
                        useLargeImages = false;
                        imageSrcWillChange = true;
                    }
                }

                if(imageSrcWillChange && !firstResize) {
                    gallery.invalidateCurrItems();
                }

                if(firstResize) {
                    firstResize = false;
                }

                imageSrcWillChange = false;

            });

            gallery.listen('gettingData', function(index, item) {
                if( useLargeImages ) {
                    item.src = item.o.src;
                    item.w = item.o.w;
                    item.h = item.o.h;
                } else {
                    item.src = item.m.src;
                    item.w = item.m.w;
                    item.h = item.m.h;
                }
            });

            gallery.init();
        };

        // select all gallery elements
        var galleryElements = document.querySelectorAll( gallerySelector );
        for(var i = 0, l = galleryElements.length; i < l; i++) {
            galleryElements[i].setAttribute('data-pswp-uid', i+1);
            galleryElements[i].onclick = onThumbnailsClick;
        }

        // Parse URL and open gallery if it contains #&pid=3&gid=1
        var hashData = photoswipeParseHash();
        if(hashData.pid > 0 && hashData.gid > 0) {
            openPhotoSwipe( hashData.pid - 1 ,  galleryElements[ hashData.gid - 1 ], true );
        }
    };



    //openPhotoSwipe = function() {
    //    var pswpElement = document.querySelectorAll('.pswp')[0];
    //
    //    var items = [
    //
    //        // Slide 1
    //        {
    //            mediumImage: {
    //                src: '/images/gallery/photo_1_sm.jpg',
    //                w:600,
    //                h:426
    //            },
    //            originalImage: {
    //                src: '/images/gallery/photo_1_lg.jpg',
    //                w: 3000,
    //                h: 2132
    //            }
    //        },
    //        // Slide 2
    //        {
    //            mediumImage: {
    //                src: '/images/gallery/photo_21_sm.jpg',
    //                w:600,
    //                h:400
    //            },
    //            originalImage: {
    //                src: '/images/gallery/photo_21_lg.jpg',
    //                w: 3000,
    //                h: 2000
    //            }
    //        },
    //        // Slide 3
    //        {
    //            mediumImage: {
    //                src: '/images/gallery/photo_26_sm.jpg',
    //                w:600,
    //                h:400
    //            },
    //            originalImage: {
    //                src: '/images/gallery/photo_26_lg.jpg',
    //                w: 3000,
    //                h: 2000
    //            }
    //        },
    //        // Slide 4
    //        {
    //            mediumImage: {
    //                src: '/images/gallery/photo_37_sm.jpg',
    //                w:600,
    //                h:400
    //            },
    //            originalImage: {
    //                src: '/images/gallery/photo_37_lg.jpg',
    //                w: 3000,
    //                h: 2000
    //            }
    //        }
    //
    //    ];
    //
    //    // define options (if needed)
    //    var options = {
    //        history: true,
    //        focus: false,
    //
    //        showAnimationDuration: 0,
    //        hideAnimationDuration: 0
    //    };
    //
    //    // initialise as usual
    //    var gallery = new PhotoSwipe( pswpElement, PhotoSwipeUI_Default, items, options);
    //
    //    // create variable that will store real size of viewport
    //    var realViewportWidth,
    //        useLargeImages = false,
    //        firstResize = true,
    //        imageSrcWillChange;
    //
    //    // beforeResize event fires each time size of gallery viewport updates
    //    gallery.listen('beforeResize', function() {
    //        // gallery.viewportSize.x - width of PhotoSwipe viewport
    //        // gallery.viewportSize.y - height of PhotoSwipe viewport
    //        // window.devicePixelRatio - ratio between physical pixels and device independent pixels (Number)
    //        //                          1 (regular display), 2 (@2x, retina) ...
    //
    //
    //        // calculate real pixels when size changes
    //        realViewportWidth = gallery.viewportSize.x * window.devicePixelRatio;
    //
    //        // Code below is needed if you want image to switch dynamically on window.resize
    //
    //        // Find out if current images need to be changed
    //        if(useLargeImages && realViewportWidth < 1000) {
    //            useLargeImages = false;
    //            imageSrcWillChange = true;
    //        } else if(!useLargeImages && realViewportWidth >= 1000) {
    //            useLargeImages = true;
    //            imageSrcWillChange = true;
    //        }
    //
    //        // Invalidate items only when source is changed and when it's not the first update
    //        if(imageSrcWillChange && !firstResize) {
    //            // invalidateCurrItems sets a flag on slides that are in DOM,
    //            // which will force update of content (image) on window.resize.
    //            gallery.invalidateCurrItems();
    //        }
    //
    //        if(firstResize) {
    //            firstResize = false;
    //        }
    //
    //        imageSrcWillChange = false;
    //
    //    });
    //
    //
    //    // gettingData event fires each time PhotoSwipe retrieves image source & size
    //    gallery.listen('gettingData', function(index, item) {
    //
    //        // Set image source & size based on real viewport width
    //        if( useLargeImages ) {
    //            item.src = item.originalImage.src;
    //            item.w = item.originalImage.w;
    //            item.h = item.originalImage.h;
    //        } else {
    //            item.src = item.mediumImage.src;
    //            item.w = item.mediumImage.w;
    //            item.h = item.mediumImage.h;
    //        }
    //
    //        // It doesn't really matter what will you do here,
    //        // as long as item.src, item.w and item.h have valid values.
    //        //
    //        // Just avoid http requests in this listener, as it fires quite often
    //
    //    });
    //
    //
    //    // Note that init() method is called after gettingData event is bound
    //    gallery.init();
    //};

}

