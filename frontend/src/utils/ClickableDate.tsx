/** Renders a date's year as a clickable link followed by the remaining month/day digits. */
export default function ClickableDate({ date, onClick }: ClickableDate) {
    const year = date?.substring(0, 4);
    const monthDay = date?.substring(4);
    const onClickYear = (e: React.MouseEvent<HTMLAnchorElement>) => {
        e.preventDefault();
        onClick(year);
    }
    return (
        <>
          <a className="text-blue-400 hover:underline" href="" onClick={onClickYear}>{year}</a>{monthDay}
        </>
    );
}
