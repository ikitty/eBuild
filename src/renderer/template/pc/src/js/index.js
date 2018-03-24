(function () {
    var D = new Date();

    document.getElementById('time').innerHTML = D.getFullYear() + '-' + (D.getMonth()+1) + '-' + D.getDay()
})();
