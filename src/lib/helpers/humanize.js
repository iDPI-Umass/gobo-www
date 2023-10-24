import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import updateLocale from "dayjs/plugin/updateLocale";

dayjs.extend( relativeTime );
dayjs.extend( updateLocale );

dayjs.updateLocale( "en", {
  relativeTime: {
    future: "in %s",
    past: "%s ago",
    s: "%d sec",
    m: "1 min",
    mm: "%d min",
    h: "1 h",
    hh: "%d h",
    d: "1 d",
    dd: "%d d"
  }
});


export const humanize = function ( time ) {
  try {
    const now = dayjs();
    const target = dayjs( time );
    const diff = now.diff( target );
   
    if ( diff < 604800000 ) {
      return dayjs( time ).fromNow( true );
    } else if ( now.$y === target.$y ) {
      return target.format("MMM DD");
    } else {
      return target.format("MMM DD, YYYY");
    }  
  } catch ( error ) {
    console.warn( time, error );
    return "";
  }
};