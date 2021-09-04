setInterval(() => {
    const count = $('#list li').length;
    if (count < 5) {
        $('#list').append(`<li>li ${count}</li>`);
    }

    const elems = [$('.counter'), $('input')];

    elems.forEach((elem) => {
        const val = +elem.text();
        if (val < 5) {
            elem.text(val + 1);
            elem.val(val + 1);
            elem.attr('data-attr', val + 1);
        }
    });
}, 100);
