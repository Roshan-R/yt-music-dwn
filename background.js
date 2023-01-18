chrome.runtime.onMessage.addListener((data, sender, sendResponse) => {
  console.log(data);
  let f = data.title.replace(/[/\\?%*:|"<>]/g, '-');
  chrome.downloads.download({
    url: data.url,
    filename: f + ".webm"
  })
  return true
});
