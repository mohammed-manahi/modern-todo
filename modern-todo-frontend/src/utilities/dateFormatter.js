import {format} from 'date-fns';

function formatDate(rawDate) {
    const parsedDate = new Date(rawDate);
    const formattedDate = format(parsedDate, 'MMMM do, yyyy hh:mm:ss a');
    return formattedDate;
}

export {formatDate};