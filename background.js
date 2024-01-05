chrome.runtime.onMessage.addListener(async (data, sender, sendResponse) => {
    videoInfo = await window.getBestAudioUrl(data);
    let filename = videoInfo.title.replace(/[/\\?%*:|"<>]/g, '-');

    chrome.downloads.download({
        url: videoInfo.url,
        filename: filename + ".webm"
    })
    return true
});
