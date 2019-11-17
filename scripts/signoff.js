(function() {
  function insertTextAtCursor(block_id, text) {
    let sel, range;
    if (window.getSelection) {
      sel = window.getSelection();
      if (sel.getRangeAt && sel.rangeCount) {
        range = sel.getRangeAt(0);
        // if input area is an editable gmail div, add message and link to the original are.na block
        if (
            (sel.anchorNode.getAttribute && sel.anchorNode.getAttribute("g_editable") === "true") ||
            (sel.anchorNode.parentNode.getAttribute && sel.anchorNode.parentNode.getAttribute("g_editable") === "true")
          ) {
          console.log("You seem to be writing in gmail, adding a hyperlinked sign-off message");
          let signoffA = document.createElement('a');
          signoffA.setAttribute('href', 'https://are.na/block/'+block_id);
          signoffA.appendChild(document.createTextNode(text));
          range.insertNode( signoffA );
        } else  {
          // range.insertNode( document.createTextNode(text) );
          console.log("You seem to be writing somewhere other than a gmail editor, so nothing is happening until the developer learns to handle other text input forms.");
          console.log("Nonetheless, here's your random sign-off message: ");
          console.log(text);
          console.log("Source: " + "https://are.na/block/" + block_id)
        }
      }
    }
  }

  browser.runtime.onMessage.addListener((message) => {
    if (message.command === "signoff") {
      insertTextAtCursor(message.id, message.content);
    }
  });
})();