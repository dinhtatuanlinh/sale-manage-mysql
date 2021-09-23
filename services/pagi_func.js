module.exports = (currentPage, totalItems) => {

    if (isNaN(currentPage) || currentPage === undefined) currentPage = 1;

    var pagiParams = {
        itemsPerPage: 10,
        currentPage: currentPage,
        totalItems: totalItems
    }
    var position = (pagiParams.currentPage - 1) * pagiParams.itemsPerPage;
    pagiParams.position = position;
    var totalPages = Math.ceil(totalItems / pagiParams.itemsPerPage);
    pagiParams.totalPages = totalPages;
    return pagiParams
}