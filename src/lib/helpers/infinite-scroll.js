/*
This class takes the rapidly emitted scroll events from the feed component and
smooths them into an emitter that fires once when it's appropriate
*/


class ScrollSmoother {
  constructor ({ element }) {
    this.loopID = null;
    this.marker = null;
    this.inbox = null;
    this.element = element;
  }

  static create ({ element }) {
    return new ScrollSmoother({ element });
  }

  start () {
    this.loopID = window.requestAnimationFrame( this.watch.bind(this) );
  }

  stop () {
    if ( this.loopID != null ) {
      window.cancelAnimationFrame( this.loopID );
    }
  }

  update ( event ) {
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
    if ( this.inbox == null ) {
      return this.start();
    }

    if ( this.marker !== this.inbox ) {
      this.marker = this.inbox;
      const detail = { marker: this.marker };
      const event = new CustomEvent( "gobo-smooth-scroll", { detail });
      this.element.dispatchEvent( event );
    }

    this.start();
  }
}

export {
  ScrollSmoother
}


