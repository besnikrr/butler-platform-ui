function timeDifference(date1: number, date2: number) {
    let difference = date1 - date2;

    const daysDifference = Math.floor(difference / 1000 / 60 / 60 / 24);
    difference -= daysDifference * 1000 * 60 * 60 * 24

    const hoursDifference = Math.ceil(difference / 1000 / 60 / 60);
    difference -= hoursDifference * 1000 * 60 * 60

    return [daysDifference, hoursDifference]
}

export default timeDifference;
