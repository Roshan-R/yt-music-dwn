async function getDetails(id) {
  let lang = 'en-US'.split('-');
  let hostt = 'https://www.youtube.com'
  let path = '/youtubei/v1/player?key=AIzaSyAO_FJ2SlqU8Q4STEHLGCilw_Y9_11qcW8'

  let body = await fetch(hostt + path, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      context: {
        client: { hl: lang[0], gl: lang[1], clientName: '3', clientVersion: '16.50', clientScreen: 'EMBED' },
        thirdParty: { embedUrl: hostt }
      },
      videoId: id
    })
  })

  let json = await body.json();
  let url = json.streamingData.adaptiveFormats.at(-1).url;
  let mime = json.streamingData.adaptiveFormats.at(-1).mimeType;
  let title = json.videoDetails.title;
  let thumbnail = json.videoDetails.thumbnail.thumbnails.at(-1).url;

  return { mime, url, title, thumbnail }

}

async function Download(id) {
  let details = await getDetails(id);
  console.log(details);
  chrome.runtime.sendMessage(details);
}


function createDownloadButton() {
  let button = document.createElement('button');
  button.type = 'button';
  button.innerHTML = 'Download';

  return button;
}

function getCurrentSongId(params) {
  let location = window.location.toString();
  const regex = "https://music.youtube.com/watch\\?v=([a-zA-Z0-9-]*)";
  let id = location.match(regex).at(-1)
  console.log("Id is: ", id);
  return id;
}

async function addPlayerDownloadButton() {
  let button = createDownloadButton();
  let container = document.querySelector('.middle-controls').
  querySelector('.middle-controls-buttons')
  button.onclick = function () {
    let id = getCurrentSongId();
    Download(id);
  }
  container.appendChild(button);
}


(async () => {
  addPlayerDownloadButton();
})();
