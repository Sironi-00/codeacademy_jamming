import React from "react";
import "./Track.css";

export class Track extends React.Component {
  constructor(props) {
    super(props);
    this.addTrack = this.addTrack.bind(this);
    this.removeTrack = this.removeTrack.bind(this);
  }
  
  renderAction() {
      return <button className="Track-action" onClick={ this.props.isRemoval ? this.removeTrack : this.addTrack }>
        { this.props.isRemoval ? '-' : '+' }
      </button>;
  }
  addTrack() {
    this.props.onAdd(this.props.track);
  }
  removeTrack() {
    this.props.onRemove(this.props.track);
  }

  render() {
    // eslint-disable-next-line
    const { _id, name, artist, album } = this.props.track;
    return (
      <div className="Track">
        <div className="Track-information">
          <h3>
            {name}
          </h3>
          <p>
            {artist} | {album}
          </p>
        </div>
        {this.renderAction()}
      </div>
    );
  }
}
