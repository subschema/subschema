(function boot() {
    console.log('booting css');
    [
        "https://maxcdn.bootstrapcdn.com/bootstrap/3.3.4/css/bootstrap.min.css",
    ].forEach(function (v) {
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = v;
        document.head.appendChild(link);
    })

})();