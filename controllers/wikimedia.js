const axios = require('axios');

function composers(req, res, next) {
  axios
    .get(`https://en.wikipedia.org/w/api.php?action=query&format=json&titles=${req.params.name}&redirects=1`)
    .then(data => {
      return res.json(data.data);
    })
    .catch(next);
}

module.exports = {
  composers
};
