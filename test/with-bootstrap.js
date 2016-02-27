(function boot() {
    console.log('booting css');
    /*   <link rel="stylesheet" href="https://highlightjs.org/static/demo/styles/github.css">
     <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.4/css/bootstrap.min.css">
     <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.0.0/codemirror.min.css"/>
     <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.0.0/theme/monokai.min.css"/>*/
    [
        "https://highlightjs.org/static/demo/styles/github.css",
        "https://maxcdn.bootstrapcdn.com/bootstrap/3.3.4/css/bootstrap.min.css",
        "https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.0.0/codemirror.min.css",
        "https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.0.0/theme/monokai.min.css"
    ].forEach(function (v) {
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = v;
        document.head.appendChild(link);
    })

})();