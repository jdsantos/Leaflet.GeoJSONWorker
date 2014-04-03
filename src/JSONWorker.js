self.addEventListener('message', function (e) {
    var resp = {};
    resp.result = JSON.parse(e.data);
    self.postMessage(resp);
}, false);