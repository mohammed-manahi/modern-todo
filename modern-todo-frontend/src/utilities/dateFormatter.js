import {format, formatDistanceToNow } from 'date-fns';

function formatDate(rawDate) {
    const parsedDate = new Date(rawDate);
    const formattedDate = format(parsedDate, 'MMMM do, yyyy hh:mm:ss a');
    return formattedDate;
}

function formatTimeDuration(date){
    return  formatDistanceToNow(new Date(date),{addSuffix: true});
}

export {formatDate, formatTimeDuration};