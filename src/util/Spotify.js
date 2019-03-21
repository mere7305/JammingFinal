//const url = 'https://accounts.spotify.com/authorize';
const clientID = '677c546140364d029b56f9cc5a4a04ae';
//const responseType = 'token';
const redirectURI = 'http://localhost:3000';
//const scope = 'playlist-modify-public';
let accessToken = '';
let expiresIn = '';

const Spotify = {
  getAccessToken() {
    const url = window.location.href;
    if(accessToken) {
      return accessToken;
    }
    else if (url.match(/access_token=([^&]*)/) && url.match(/expires_in=([^&]*)/)) {
      accessToken = url.match(/access_token=([^&]*)/)
      expiresIn = url.match(/expires_in=([^&]*)/)
      window.setTimeout(() => accessToken = '', expiresIn * 1000);
      window.history.pushState('Access Token', null, '/');
    }
    else {
      window.location = `https://accounts.spotify.com/authorize?client_id=${clientID}&response_type=token&scope=playlist-modify-public&redirect_uri=${redirectURI}`;
    }
  },

  search(searchTerm) {
    return fetch(`https://api.spotify.com/v1/search?type=track&q=${searchTerm}`,
                  {headers: {Authorization: `Bearer ${accessToken}`}
                }).then(response => {
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
