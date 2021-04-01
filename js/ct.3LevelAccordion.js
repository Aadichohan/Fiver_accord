(function($) {


    $(document).ready(function(){


        //Add uberHelper to wrap the text inside 'a' element
        var particularAccordions = [
            "glossy","sport","paper","flat","pointer","lines","slick","simple","classic"
        ];


        $.each(particularAccordions ,function(index, value){

            $("ul[class*="+value+"] > li  a, ul[class*="+value+"] > li span")
                .contents()
                .filter(function(){
                    return this.nodeType !== 1;
                })
                .wrap( "<div class='uberHelper accordionIcon'></div>" )
        });


//Some accordions require these tags with this class in order to help style them properly.

        var particularAccordions2 = [
            "glossy","sport","paper","flat","lines","slick","simple","ribbon"
        ];

        $.each(particularAccordions2 ,function(index, value){

            $(".skin-"+value+" > li > a").append( $( "<div class='helper'></div>" ) );
            $(".skin-"+value+" > li > a > .helper").append( $( "<div class='helper2'></div>" ) );


            $(".skin-"+value+" > li > span").append( $( "<div class='helper'></div>" ) );
            $(".skin-"+value+" > li > span > .helper").append( $( "<div class='helper2'></div>" ) );


            $(".skin-"+value+" > li > ul > li > a").append( $( "<div class='helper'></div>" ) );
            $(".skin-"+value+" > li > ul > li > a > .helper").append( $( "<div class='helper2'></div>" ) )

            $(".skin-"+value+" > li > ul > li > span").append( $( "<div class='helper'></div>" ) );
            $(".skin-"+value+" > li > ul > li > span > .helper").append( $( "<div class='helper2'></div>" ) )

        });


//There are always someone or something that needs extra love. Just like this accordion.
        $(".skin-pointer > li > a").append( $( "<div class='independentHelper'></div>" ) );



        //Get rid of content in parent with no children (so imply that they are just a link)
        // and show number of children elements in accordions (new version). --------->

        //Count how many elements are there in the first and second level of accordion.
        var firstLevel = [];
        var secondLevel = [];

        //Loop through every ul element that contains class that begins with 'skin-',
        //so it indicates accordion element.


        $( "ul[class*='skin-']" ).each(function(index) {

            //Just to make sure that each accordion will
            $(this).addClass("skin"+(index+1));

            //Check how many children are there on the first and second level
            firstLevel[index+1] = $(".skin" + (index+1) + " > li > a").length;
            secondLevel[index+1]= $(".skin" + (index+1) + "  > li > ul > li").length;

            //Core of adding counters and removing unnecessary icons
            for(var j = 1; j <= firstLevel[index+1]+1; j++) {
                //
                //    // 'coun-children' adds counter
                if($(".skin" + (index+1)).hasClass('count-children')) {
                    $(".skin" + (index+1) + " > li:nth-child(" + (j) + ") > a")
                        .attr('data-content', $(".skin" + (index+1) + " > li:nth-child(" + (j) + ") > ul > li > a").length).addClass("accordion");
                }
                //
                // 'noContent' removes icon
                if ($(".skin" + (index+1) + " >li:nth-child(" + (j) + ") > ul > li > a").length == 0) {
                    $(".skin" + (index+1) + " >li:nth-child(" + (j) + ") > a").addClass("noContent");
                }
                //    //
                for (var k = 1; k < secondLevel[index+1]+1; k++) {
                    if($(".skin" + (index+1)).hasClass('count-children')) {
                        $(".skin" + (index+1) + " >li:nth-child(" + (j) + ") > ul > li:nth-child(" + (k) + ") >*")
                            .attr('data-content', $(".skin" + (index+1) + " > li:nth-child(" + (j) + ") > ul > li:nth-child(" + (k) + ") > ul > li >*").length)
                            .addClass("accordion");
                        $(".skin" + (index+1) + " >li:nth-child(" + (j) + ") > ul > li:nth-child(" + (k) + ") > ul").removeClass('accordion');
                    }

                    //        //
                    if ($(".skin" + (index+1) + " > li:nth-child(" + (j) + ") > ul > li:nth-child(" + (k) + ") > ul > li > *").length == 0) {
                        $(".skin" + (index+1) + " >li:nth-child(" + (j) + ") > ul > li:nth-child(" + (k) + ") > *").addClass("noContent");
                    }
                }
            }
        });
        //  <--------- Counters and icons

    });


    /** public methods **/
    var methods;
    methods = {
        /** constructor **/
        init: function (options) {
            options = $.extend({}, $.fn.ctAccordion.defaults, options);

            return this.each(function () { //uncomment this to allow multiple instances on one constructor call
                var $menu = $(this).addClass(options.myClass).data("ctAccordion", {
                    options: options
                });

                // set the numerical path for each ul
                var ulNumID = 1;
                $("ul", $menu).each(function () {
                    $(this).data("ctAccordion", {
                        numID: ulNumID++
                    });
                }).find("li").addClass(options.collapsedPathClass);

                // hide all sub positions
                $menu.find("ul").hide();

                // show all default expanded positions (think stateful)
                $(options.defaultExpanded, $menu).each(function () {

                    // if i'm expanded - remove collapsed class :)
                    $(this).removeClass(options.collapsedPathClass);
                }).parents("li").addClass(options.expandedPathClass).removeClass(options.collapsedPathClass);

                if ($(options.defaultExpanded, $menu).length) {
                    setOpened.apply($menu, [$(options.defaultExpanded, $menu)]);
                }

                // interactivity
                $("a + ul", $menu).prev("a").addClass(options.headerClass).bind(options.event, function () {
                    if ($(this).next("ul").is(":not(:hidden)")) {
                        // hide submenu
                        setCollapsed.apply($menu, [$(this)]);
                    } else {
                        // show submenu
                        setOpened.apply($menu, [$(this), options.oneOpenAtTime]);
                    }

                    return false;
                });
            });


            return this;
        },

        /** search method: pass searched query as an argument,
         *    positions having it will show and highlight automagicaly
         */
        search: function (query) {
            var $menu = $(this),
                data = $menu.data("ctAccordion"),
                options = data.options,
                regex = new RegExp(query, "i");

            hideUnused.apply($menu);
             console.log('regex '+query);
            $("li>a, >li>ul>li>ul>li, p", $menu).each(function () {

                var matches = $(this).text().match(regex);

                if (matches != "" && matches != null) {

                    var $el = $(this);
                    if ($(this)[0].nodeName == "LI") {
                        $el = $(this).closest("ul").prev("a");
                    }
                    console.log('query '+query);
                    setOpened.apply($menu, [$el, false]);
                    $el.addClass(options.foundPhraseClass);
                    var src_str = $(".searchMatch").next().html();
                    src_str = src_str.replace("<mark><mark>", "");
                    src_str = src_str.replace("</mark></mark>", "");
                    var term = query;
                    term = term.replace(/(\s+)/,"(<[^>]+>)*$1(<[^>]+>)*");
                    var pattern = new RegExp("("+term+")", "gi");
                    src_str = src_str.replace(pattern, "<mark>$1</mark>");
                    src_str = src_str.replace(/(<mark>[^<>]*)((<[^>]+>)+)([^<>]*<\/mark>)/,"$1</mark>$2<mark>$4");
                    $(".searchMatch").next().html(src_str);

                } else {
                    $(this).removeClass(options.foundPhraseClass);
                }
            });

            return this;
        },
        /**
         * open menu on selected positions
         */
        open: function (level1Index, level2Index) {
            var $menu = $(this),
                data = $menu.data("ctAccordion"),
                options = data.options;

            level1Index--;

            return $(this).each(function () {
                if (level1Index < 0) {
                    return;
                }
                var $level1 = $(">li>a", $menu);

                if (level1Index > $level1.length) {
                    return;
                }
                var $el = $level1.eq(level1Index);
                setOpened.apply($menu, [$el, options.oneOpenAtTime]);

                if (level2Index != undefined) {
                    level2Index--;

                    $level2 = $el.next("ul").find(">li>a");
                    if (level2Index < 0 || level2Index > $level2.length) {
                        return;
                    }

                    var $el = $level2.eq(level2Index);
                    setOpened.apply($menu, [$el, options.oneOpenAtTime]);


                }
            });
        },
        /** Get or set any option. If no value is specified, will act as a getter **/
        option: function (key, value) {
            if (typeof key === "string") {
                if (value === undefined) {
                    // behave as a "getter"
                    var $container = $(this),
                        data = $container.data("ctAccordion");

                    return data.options[key];
                } else {
                    // behave as a "setter"
                    var $container = $(this),
                        data = $container.data("ctAccordion");

                    data.options[key] = value;
                    $container.data("ctAccordion", data);

                    return this;
                }
            }
        }
    };


    /**
     * gets the "path" to the given element
     */
    var getNumericalPath = function($el) {
        var myNumericalPath = [];

        $el.parents("ul").each(function(i, ul) {
            var data = $(ul).data("ctAccordion");

            var i = parseInt(data.numID);
            if(!isNaN(i)) {
                myNumericalPath.push(i);
            }
        });

        return myNumericalPath;
    };



    /**
     * hide all currently not used "uls" - ie
     * those that aren't directly aboce clicked element
     *
     */
    var hideUnused = function($el) {
        var $menu = $(this),
            data = $menu.data("ctAccordion"),
            options = data.options;

        //debugger;
        if($el === undefined) {
            // just hide all
            setCollapsed.apply($menu, [$("li."+options.expandedPathClass+" > a."+options.headerClass)]);

        } else {
            var path = getNumericalPath($el);


            $("ul:visible", $menu).each(function(i, ul){
                var $ul = $(ul),
                    data = $ul.data("ctAccordion");

                var myNumID = parseInt(data.numID);

                if($.inArray(myNumID, path) == -1) {
                    setCollapsed.apply($menu, [$($ul.prev("."+options.headerClass)[0])]);
                }
            });
        }
    };


    /**
     * hides the node
     */
    var setCollapsed = function($element) {
        var $menu = $(this),
            data = $menu.data("ctAccordion"),
            options = data.options;

        options.onClose.apply($menu, [$element]);

        $element.nextAll("ul").slideUp("fast").find("li").removeClass(options.expandedPathClass).addClass(options.collapsedPathClass);
        $element.closest("li").removeClass(options.expandedPathClass).addClass(options.collapsedPathClass);
    };

    /**
     * opens node and the path if required.
     * Optionally closes all the other nodes.
     */
    var setOpened = function($element, doHideUnused) {
        if(doHideUnused === undefined || doHideUnused == true) {
            hideUnused.apply($(this), [$element]);
        }

        var $menu = $(this),
            data = $menu.data("ctAccordion"),
            options = data.options;

        options.onOpen.apply($menu, [$element]);


        $element.nextAll("ul").slideDown(options.speed, options.easing);

        // show all that is upper if needed
        openPath.apply($(this), [$element.closest("li")]);

    };


    /**
     *
     * Show all elements above given one.
     * In other words: show full path to the
     * given element
     *
     * @return
     */
    var openPath = function($li) {
        var $menu = $(this),
            data = $menu.data("ctAccordion"),
            options = data.options;

        $li.addClass(options.expandedPathClass).removeClass(options.collapsedPathClass);
        var $parentUl = $li.closest("ul").slideDown("fast");
        if($parentUl.length == 0) {
            return;
        }

        var $parentLi = $parentUl.closest("li");

        if($parentLi.length > 0) {
            openPath.apply($menu, [$($parentLi[0])]);
        }

        return;
    };

    $.fn.ctAccordion = function(method) {
        if ( methods[method] ) {
            return methods[method].apply( this, Array.prototype.slice.call( arguments, 1 ));
        } else if ( typeof method === 'object' || ! method ) {
            methods.init.apply( this, arguments );
        } else {
            $.error( 'Method ' +  method + ' does not exist on 3 Level Accordion!' );
        }
    };


    /** default values for plugin options **/
    $.fn.ctAccordion.defaults = {
        headerClass: "head",
        defaultExpanded: ".expanded",
        expandedPathClass: "open",
        collapsedPathClass: "closed",
        foundPhraseClass: "searchMatch",
        event: "click",
        myClass: "ctAccordion",
        oneOpenAtTime: false,
        easing: "linear",
        speed: 200,
        onOpen: $.noop,
        onClose: $.noop
    };

})(jQuery);