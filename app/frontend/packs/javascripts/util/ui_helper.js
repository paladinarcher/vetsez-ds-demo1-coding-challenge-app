var UIHelper = (function () {
    function toggle_div(id) {
    $('#'+id).toggle();
    }
    return {
        toggle_div: toggle_div
    }
})();

//export as follows:
gon.js.UIHelper = {};
gon.js.UIHelper.toggle_div = UIHelper.toggle_div;
