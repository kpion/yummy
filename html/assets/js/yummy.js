(function () {

    // Wywoływana na starcie a także przy każdej zmianie rozm. okna.
    function onResize(){
        document.getElementById("right").style.height = document.getElementById("body").clientHeight + 'px';
        // Kwestia src dla video, inna dla dekstop i mobile.
        var screenWidth = $(window).width();
        if (screenWidth < 800){
            $('.smoke').attr('src','assets/video/smoke-mobile-3.webm')
            //$('.smoke').css('opacity',0.5);
            //$('.smoke')[0].playbackRate = 0.6;

        } else {
            $('.smoke').attr('src','assets/video/smoke.webm')
            $('.smoke').css('opacity',1);
            $('.smoke')[0].playbackRate = 1;
        }
    }
    window.addEventListener('resize', (event) => {
        onResize();
    });

    // Inicjalizacyjnie.
    onResize();

    // Czy menu (dot. mobilnej wersji) jest włączone czy wyłączone.
    var toggleMobileMenu = false;

    // Przyciski 'home', 'coś tam', 'kontakt'.
    var $li = $('.right ul li').click(function () {
        $li.removeClass('selected');
        $(this).addClass('selected');
        $('.text').hide();
        $('#' + $(this).attr("data-text")).show();
    });

    // Przycisk Call to action (coś w rodzaju "Skontaktuj się")
    $('.call-to-action').click(()=>{
        $('.right ul li[data-text="text-contact"]').click();
    });

    // Przycisk na mobilnych, pokazujący 'right' page (mobileMenu).
    $('#bMore').click(function () {
        toggleMobileMenu = !toggleMobileMenu;

        if (toggleMobileMenu) {
            $(".pizza").css("width", "0");
            $(".right").css("width", "100%");
            $(".right").css("display", "block");
            document.getElementById("right").style.height = document.getElementById("body").clientHeight + 'px';
        } else {
            $(".pizza").css("width", "100%");
            $(".right").css("width", "0");
            $(".right").css("display", "none");
        }
    });

}());