import React from 'react';
import './App.css';
import SearchBar from '../SearchBar/SearchBar.js';
import SearchResults from '../SearchResults/SearchResults.js';
import Playlist from '../Playlist/Playlist.js';
import Spotify from '../../util/Spotify.js';


class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      searchResults: [],
      playlistName: 'New Playlist',
      playlistTracks: []
     }

     this.addTrack = this.addTrack.bind(this);
     this.removeTrack = this.removeTrack.bind(this);
     this.updatePlaylistName = this.updatePlaylistName.bind(this);
     this.savePlaylist = this.savePlaylist.bind(this);
     this.search = this.search.bind(this);
    }

  addTrack(track) {
    if (this.state.playlistTracks.find(savedTrack =>
      savedTrack.id === track.id)) {
        return;
    }
    else {
      let newPlaylistTracks = this.state.playlistTracks.push(track);
      this.setState({playlistTracks: newPlaylistTracks});
    }
  }

  removeTrack(track) {
    if(this.state.playlistTracks.find(savedTrack => savedTrack.id === track.id)) {
      this.state.playlistTracks.splice(track);
    }
    else {
      return;
    }
  }

   updatePlaylistName(name) {
     this.setState({playlistName: name})
   }

   savePlaylist() {
     let trackURIs = this.state.playlistTracks.map(track => {
        return trackURIs.push(track.uri)
        Spotify.savePlaylist(this.state.playlistName, trackURIs);
        this.setState({playlistName: 'New Playlist'});
        this.setState({playlistTracks: [] });
      })
    }

   search(searchTerm) {
     console.log(searchTerm)
     Spotify.search(searchTerm).then(searchResults => {
       this.setState({searchResults: searchResults});
     })
   }

  render() {
    return (
      <div>
        <h1>Ja<span className="highlight">mmm</span>ing</h1>
        <div className="App">
          <SearchBar onSearch={this.search} />
          <div className="App-playlist">
            <SearchResults onAdd={this.addTrack} searchResults={this.state.searchResults} />
            <Playlist playlistName={this.state.playlistName} playlistTracks={this.state.playlistTracks}
              onSave={this.savePlaylist}
              onNameChange={this.updatePlaylistName}
              onRemove={this.removeTraack} />
          </div>
        </div>
      </div>
    )
  }
}

export default App;
