/*
This class takes the rapidly emitted scroll events from the feed component and
smooths them into an emitter that fires once when it's appropriate
*/


class ScrollSmoother {
  constructor ({ element }) {
    this.loopID = null;
    this.marker = null;
    this.inbox = null;
    this.isStopped = true;
    this.element = element;
  }

  static create ({ element }) {
    return new ScrollSmoother({ element });
  }

  start () {
    this.isStopped = false;
    this.watch();
  }

  stop () {
    this.isStopped = true;
    this.marker = null;
    this.inbox = null;
    if ( this.loopID != null ) {
      window.cancelAnimationFrame( this.loopID );
    }
    this.loopID = null;
  }

  update ( event ) {
    if ( this.isStopped === true ) {
      return;
    }

    // We only care about downward scrolling.
    if ( event.deltaY <= 0 ) {
      return;
    }

    const current = this.element.scrollHeight - this.element.scrollTop;
    if ( current < 3 * this.element.offsetHeight ) {
      this.inbox = this.element.scrollHeight;
    }
  }

  watch () {
    if ( this.isStopped === true ) {
      return;
    }

    if ( this.inbox != null && this.marker !== this.inbox ) {
      this.marker = this.inbox;
      const detail = { marker: this.marker };
      const event = new CustomEvent( "gobo-smooth-scroll", { detail });
      this.element.dispatchEvent( event );
    }

    this.loopID = window.requestAnimationFrame( this.watch.bind(this) );
  }
}

export {
  ScrollSmoother
}


