setInterval(() => {
    const count = $('#list li').length;
    if (count < 5) {
        $('#list').append('<li>li ' + count + '</li>');
    }

    const elem = $('.counter');
    const val = +elem.text();
    if (val < 5) {
        elem.text(val + 1);
    }
}, 100);
