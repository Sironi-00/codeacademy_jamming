let userToken;
let tokenExpire;

const clientId = '*********************';
const redirectURL = 'http://localhost:3000/';


const Spotify = {
        getAccessToken: function() {
            if (userToken) {
                return userToken;
            }
            // Check url
            let url = window.location.href;
            let matchToken = url.match(/access_token=([^&]*)/);
            let matchExpire = url.match(/expires_in=([^&]*)/);

            if (matchToken && matchExpire ) {
                userToken = matchToken[1];
                tokenExpire = matchExpire[1];

                window.setTimeout(() => userToken = '', tokenExpire * 1000);
                window.history.pushState('Access Token', null, '/');
                return userToken;
            } else {
                window.location = `https://accounts.spotify.com/authorize?client_id=${clientId}&response_type=token&scope=playlist-modify-public&redirect_uri=${redirectURL}`;
            }
        },
        search:async function(term) {
            if (term.length < 1) return [];
            const currentUserToken = await Spotify.getAccessToken();

            try {
                let response = await fetch(`https://api.spotify.com/v1/search?type=track&q=${term}`, {
                    headers: { Authorization: `Bearer ${currentUserToken}` }
                });
                if(response.ok) {
                    let responseJson = await response.json();
                    if (responseJson.tracks.items.length < 1) return [];
                    return responseJson.tracks.items.map(track=> {
                        return {
                            id:track.id,
                            name: track.name,
                            artist: track.artists[0].name,
                            album: track.album.name,
                            uri: track.uri
                        }
                    })
                }
            } catch (e) {
                console.log("Spotify API\n\n", e);
                return [];
            }
        }, 
        savePlaylist: async function(playlistName, URIs) {
            if (URIs.length < 1) return;
            const currentUserToken = await Spotify.getAccessToken();
            const headers = { Authorization: `Bearer ${currentUserToken}` }
            let userId;

            let request = await fetch('https://api.spotify.com/v1/me', {headers: headers});
            if (request.ok) {
                let responseJson = await request.json();
                userId = responseJson.id;
            }

            let playlistID; 
            let response = await fetch(`https://api.spotify.com/v1/users/${userId}/playlists`, {
                headers:headers,
                method: 'POST',
                body: JSON.stringify({name:playlistName})
            });
            if (response.ok) {
                let responseJson = await response.json();
                playlistID = responseJson.id;
            }
            let responseTrack = await fetch(`https://api.spotify.com/v1/users/${userId}/playlists/${playlistID}/tracks`, {
                headers: headers,
                method: 'POST',
                body: JSON.stringify({uris: URIs})
            })
            if (!responseTrack.ok) {
                console.log(responseTrack);
            }
        }
};

export { Spotify };
