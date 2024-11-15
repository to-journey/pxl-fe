$(document).ready(function () {
    const url = new URL(window.location.href);
    const params = new URLSearchParams(url.search);
    const userId = params.get('user_id');

    localStorage.setItem('user_id', userId);

    $(".game-card").click(function () {
        window.open($(this).attr('data-url'), '_self');
    });
});