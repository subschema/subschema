if (!global){
    global = window;
    window.global = window;
}
module.exports = global;