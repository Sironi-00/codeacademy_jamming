import React from "react";
import "./App.css";

import { SearchBar } from "../SearchBar/SearchBar";
import { SearchResults } from "../SearchResults/SearchResults";
import { Playlist } from "../Playlist/Playlist";

import { Spotify } from "../../util/spotify";

export class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      searchResults: [],
      playlistName: 'The amaxing playlist',
      playlistTracks: [],
    };
    this.addTrack = this.addTrack.bind(this);
    this.removeTrack = this.removeTrack.bind(this);
    this.updatePlaylistName = this.updatePlaylistName.bind(this);
    this.savePlaylist = this.savePlaylist.bind(this);
    this.search = this.search.bind(this);
  }
  addTrack(track) {
    if (this.state.playlistTracks.find(savedTrack => savedTrack.id === track.id)) {
      return;
    } else {
      let newState = this.state.playlistTracks
      newState.push(track);
      this.setState({playlistTracks: newState});
    }
  }
  removeTrack(track) {
    let newState = this.state.playlistTracks.filter(savedTrack=> {
      return savedTrack !== track
    });

    this.setState({playlistTracks: newState});
  }
  updatePlaylistName(newName) {
    this.setState({playlistName: newName});
  }
  async search(term) {
    let data = await Spotify.search(term);
    this.setState({searchResults: data})
  }
  savePlaylist() {
    let uriArray = this.state.playlistTracks.map(savedTrack=> savedTrack.uri);
    
    Spotify.savePlaylist(this.state.playlistName, uriArray).then(
      ()=> {
        this.setState({ playlistName: 'New Playlist' });
        this.setState({ playlistTracks: [] });
      }
    )
  }
  render() {
    return (
      <div>
        <h1>
          Ja<span className="highlight">mmm</span>ing
        </h1>
        <div className="App">
          <SearchBar onSearch={this.search} />
          <div className="App-playlist">
            <SearchResults searchResults={this.state.searchResults} onAdd={this.addTrack} />
            <Playlist playlistName={this.state.playlistName} playlistTracks={this.state.playlistTracks} onRemove={this.removeTrack} onNameChange={this.updatePlaylistName} onSave={this.savePlaylist} />
          </div>
        </div>
      </div>
    );
  }
}
