$(document).ready(() => {

    // scroll fixed menu
    let nav = $('#navmenu');
    $(document).scroll(function(event) {
        if ($(this).scrollTop() >= 400) {
            nav.addClass('fix-nav');
            $('#search-bar').addClass('fix-search');
        } else {
            nav.removeClass('fix-nav');
            $('#search-bar').removeClass('fix-search');
        }
    });

    //flowtype
    $('.main__ritem-header h3').flowtype({
        minimum: 500,
        maximum: 1200,
        minFont: 20,
        maxFont: 40,
        fontRatio: 30
    });

	$('#showall').flowtype({
        minimum: 500,
        maximum: 1200,
        minFont: 12,
        maxFont: 40,
        fontRatio: 30
    });



})
