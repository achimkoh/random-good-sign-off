// Fetch channel metadata to check how many sign-off blocks there are
async function fetchChannelLength() {
  const url = 'https://api.are.na/v2/channels/good-sign-offs/thumb';
  let response = await fetch(url, {mode: 'cors'});
  console.log(response);
  let data = await response.json();
  return data.length;
}

// Fetch a random sign-off
async function fetchRandomSignoff() {
  const url = 'https://api.are.na/v2/channels/good-sign-offs/contents?per=1&page=';
  let channelLength = await fetchChannelLength();
  let page_num = Math.floor(Math.random() * channelLength);
  let response = await fetch(url+page_num);
  let data = await response.json();
  let signoff = Object({id: data.contents[0].id, content: data.contents[0].content});
  console.log(signoff);
  return signoff;
}

function reportError(error) {
  console.error(`Could not fetch signoff: ${error}`);
}

// Send the retrieved sign-off to active tab
async function sendSignoff(tabs) {
  let signoff = await fetchRandomSignoff();
  browser.tabs.query({active: true, currentWindow: true})
    .then( (tabs) => {
      browser.tabs.sendMessage(tabs[0].id, {
        command: "signoff",
        id: signoff.id,
        content: signoff.content
      });      
    }).catch(reportError);
}

browser.browserAction.onClicked.addListener(sendSignoff);