module.exports = function PresNext(URL, currentPage, totalPage) {
    let url = URL.href;
    let pathname = URL.pathname;
    let origin = URL.origin;
    const PageReg = /[1-9]+/g;
    // let nextPage = undefined;
    // presPage = undefined;
    // pres_pathname = undefined;
    // next_pathname = undefined;

    const presPage = currentPage == 1 ? ""
        : String.prototype.concat.call(origin,
            pathname.replace(PageReg, String(Number(currentPage) - 1)));

    const nextPage = currentPage == totalPage ? ""
        : String.prototype.concat.call(origin,
            pathname.replace(PageReg, String(Number(currentPage) + 1)));

    // if (currentPage == 1) {
    //     presPage = url;
    // } else {
    //     pres_pathname = pathname.replace(PageReg, String(Number(currentPage) - 1));
    //     presPage = String.prototype.concat.call(origin, pres_pathname);
    // }

    // if (currentPage == totalPage) {
    //     nextPage = url;
    // } else {
    //     next_pathname = pathname.replace(PageReg, String(Number(currentPage) + 1));
    //     nextPage = String.prototype.concat.call(origin, next_pathname);
    // }

    return {
        nextPage,
        presPage
    }


};