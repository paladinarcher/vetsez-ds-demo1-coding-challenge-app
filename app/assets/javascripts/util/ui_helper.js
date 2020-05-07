var UIHelper = (function () {
    function toggle_div(id) {
        const e = document.getElementById(id);
        if (e.style.display === "none") {
            e.style.display = 'block';
        } else {
            e.style.display = 'none';
        }
    }
    return {
        toggle_div: toggle_div
    }
})();