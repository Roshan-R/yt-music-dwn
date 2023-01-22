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
  button.innerHTML = `
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="1em"
        height="1em"
        viewBox="0 0 24 24"
        class="dwn-icon"
      >
        <path
          fill="currentColor"
          d="M12 15.575q-.2 0-.375-.063q-.175-.062-.325-.212l-3.6-3.6q-.275-.275-.275-.7q0-.425.275-.7q.275-.275.712-.288q.438-.012.713.263L11 12.15V5q0-.425.288-.713Q11.575 4 12 4t.713.287Q13 4.575 13 5v7.15l1.875-1.875q.275-.275.713-.263q.437.013.712.288q.275.275.275.7q0 .425-.275.7l-3.6 3.6q-.15.15-.325.212q-.175.063-.375.063ZM6 20q-.825 0-1.412-.587Q4 18.825 4 18v-2q0-.425.287-.713Q4.575 15 5 15t.713.287Q6 15.575 6 16v2h12v-2q0-.425.288-.713Q18.575 15 19 15t.712.287Q20 15.575 20 16v2q0 .825-.587 1.413Q18.825 20 18 20Z"
        />
      </svg>
      Download
    `;


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
//   Adding custom css for button
  let styleElement = document.createElement("style");
  styleElement.innerText = `
    button {
        color: #909090;
        background: none;
        font-size: 16px;
        font-family: "Roboto", sans-serif;
        cursor: pointer;
        display: flex;
        justify-content: center;
        align-items: center;
        gap: 4px;
        border: none;
        padding: .5rem 1rem;
        border-radius: 100px;
    }
    button:hover {
        background: rgba(255, 255, 255, 0.1);
    }
    button:active {
        background: rgba(255, 255, 255, 0.05);
    }
    svg.dwn-icon {
        height: 20px;
        width: 20px;
    }
  `;
  document.body.appendChild(styleElement);
  
  let button = createDownloadButton();
  let container = document.querySelector('.middle-controls').
  querySelector('.middle-controls-buttons')
  button.onclick = async() => {
    let id = getCurrentSongId();
    await Download(id);
  }
  container.appendChild(button);
}


(async () => {
  addPlayerDownloadButton();
})();
