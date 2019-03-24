//const url = 'https://accounts.spotify.com/authorize';
const clientID = 'insert clientID here';
const redirectURI = 'http://localhost:3000';
let accessToken = '';
let expiresIn = '';

const Spotify = {
  getAccessToken() {
   const url = window.location.href;
    if(accessToken) {
      return accessToken;
    }
    else if (url.match(/access_token=([^&]*)/)
        && url.match(/expires_in=([^&]*)/)) {
      accessToken = url.match(/access_token=([^&]*)/)[1];
      expiresIn = url.match(/expires_in=([^&]*)/)[1];
      window.setTimeout(() => accessToken = '', expiresIn * 1000);
      window.history.pushState('Access Token', null, '/');
      return accessToken;
    }
    else {
      window.location = `https://accounts.spotify.com/authorize?client_id=${clientID}&redirect_uri=${redirectURI}&scope=playlist-modify-public&response_type=token`;
    }
  },

  search(searchTerm) {
    let accessToken = Spotify.getAccessToken();
    if(!accessToken) {
      console.log('No Access Token');
      return [];
    }
    const headers = {Authorization: `Bearer ${accessToken}`};


    return fetch(`https://api.spotify.com/v1/search?q=${searchTerm}&type=track`, {headers: headers}).then(response => {
                  if (response.ok) {
                    return response.json();
                   }
                   throw new Error('Request failed!');
                  }, networkError => console.log(networkError.message)).then(jsonResponse => {
                    return jsonResponse.tracks.items.map(track => {
                      return {
                        id: track.id,
                        name: track.name,
                        artist: track.artists[0].name,
                        album: track.album.name,
                        uri: track.uri
                      };
                  })
                })
            },

  savePlaylist(playlistName, trackURIs) {
        const userAccessToken = accessToken;
        const headers = {
            "Authorization": `Bearer ${userAccessToken}`,
            "Content-Type": "application/json"
          };
        let userID = '';
        if(!playlistName || !trackURIs) {
          return;
        }
        else {
          return fetch('https://api.spotify.com/v1/me', {headers: headers}).then(response => {
            if(response.ok) {
              return response.json();
            }
            throw new Error('Request failed!');
          }, networkError => console.log(networkError.message)).then(jsonResponse => {
              userID=jsonResponse.id;
              return fetch(`https://api.spotify.com/v1/users/${userID}/playlists`, {
                headers: headers,
                method: 'POST',
                body: JSON.stringify({name: playlistName})
              })}).then(response =>{
                return response.json();
                }).then(jsonResponse => {
                  return fetch(`https://api.spotify.com/v1/users/${jsonResponse.owner.id}/playlists/${jsonResponse.id}/tracks`, {
                    headers: headers,
                    method: 'POST',
                    body: JSON.stringify({uris: trackURIs})
                  })}).then(response => {
                    return response.json();
                  }).then(jsonResponse => {
                  })
                }
              }
        }

export default Spotify;
