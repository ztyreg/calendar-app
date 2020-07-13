function getCalendar(date) {
    let calendar = '';
    let cur_date = firstMonday(date);
    for (let i = 0; i < 6; i++) {
        let row = '<tr>';
        for (let i = 0; i < 7; i++) {
            row += `<td class="border" style="width: ${1 / 7 * 100}%; height: 100%">${cur_date.getDate()}</td>`;
            cur_date = new Date(cur_date.getTime() + DAY_IN_MILLISECONDS);
        }
        row += '</tr>';
        calendar += row;
    }
    return calendar;
}

