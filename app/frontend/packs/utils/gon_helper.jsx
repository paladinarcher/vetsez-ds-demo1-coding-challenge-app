class GonHelper {
    static getImagePath(img) {
        return gon.packs.paths.images[img];
    }

    static getImageUrl(img) {
        return gon.packs.urls.images[img];
    }

    static getRoute(route) {
        return gon.routes[route];
    }
}
export default GonHelper;
