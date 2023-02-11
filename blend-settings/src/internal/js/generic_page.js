if (typeof variable !== typeof undefined) {
    Sortable = undefined
} else {
    window.Sortable = require('sortablejs')
}

function truncateText(text, maxLength=30) {
    let truncated = text

    if (truncated.length > maxLength) {
        truncated = truncated.substr(0, maxLength) + '...';
    }

    return truncated;
}