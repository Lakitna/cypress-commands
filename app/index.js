setInterval(() => {
    const count = $('#list li').length;
    if (count < 5) {
        $('#list').append('<li>li ' + count + '</li>');
    }
}, 100);
