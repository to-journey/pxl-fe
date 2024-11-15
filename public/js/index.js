$(document).ready(function () {
    const url = new URL(window.location.href);
    const params = new URLSearchParams(url.search);
    let userId = params.get('user_id');

    if (userId) localStorage.setItem('user_id', userId);
    else userId = localStorage.getItem('user_id');

    const gameCards = $(".game-card");

    for (let i = 0; i < gameCards.length; i++) {
        $.get(`/api/checkGame/${$(gameCards[i]).attr('data-game-id')}/${userId}`, (res) => {
            $(gameCards[i]).toggleClass('played', res.played);
        });
    }

    $(".game-card").click(function () {
        const url = $(this).attr('data-url');
        if (url) window.open(url, '_self');
    });
});