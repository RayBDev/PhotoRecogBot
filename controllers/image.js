const { ClarifaiStub, grpc } = require('clarifai-nodejs-grpc');

const stub = ClarifaiStub.grpc();

const metadata = new grpc.Metadata();
metadata.set('authorization', `Key ${process.env.CLARIFAI_API_KEY}`);

const handleApiCall = (req, res) => {
  let model_id;
  switch (req.body.input.type) {
    case 'general':
      model_id = 'general-image-detection';
      break;
    case 'face':
      model_id = 'face-detection';
      break;
    case 'apparel':
      model_id = 'apparel-detection';
      break;
    default:
      model_id = 'general-image-detection';
      break;
  }

  stub.PostModelOutputs(
    {
      // This is the model ID of a publicly available General model. You may use any other public or custom model ID.
      model_id,
      inputs: [{ data: { image: { url: req.body.input.url } } }],
    },
    metadata,
    (err, response) => {
      if (err) {
        console.log(err);
        return res.status(400).json('Error: ' + err);
      }

      if (response.status.code !== 10000) {
        console.log('error', response);
        return res
          .status(400)
          .json(
            'Received failed status: ' +
              response.status.description +
              '\n' +
              response.status.details
          );
      }
      console.log(response);
      res.json(response);
    }
  );
};

const handleImage = (req, res, db) => {
  const { id, url, type, created_at } = req.body;

  db.select('url')
    .from('photos')
    .where('url', '=', url)
    .then((data) => {
      if (!data[0]) {
        db.transaction((trx) => {
          db('photos')
            .transacting(trx)
            .insert([{ url, created_at, type, user_id: id }])
            .then((response) => {
              if (response) {
                return db('users')
                  .transacting(trx)
                  .where('id', '=', id)
                  .increment('entries', 1)
                  .returning('entries')
                  .then((entries) => {
                    res.json(entries[0]);
                  });
              }
            })
            .then(trx.commit)
            .catch(trx.rollback);
        });
      } else {
        db.select('entries')
          .from('users')
          .where('id', '=', id)
          .then((entries) => {
            res.json(entries[0]);
          })
          .catch((err) => {
            console.log(err);
            res.status(400).json('Entries not found');
          });
      }
    })
    .catch((err) => {
      console.log(err);
      res.status(400).json(err);
    });
};

const returnImages = (req, res, db) => {
  const imageLimit = parseInt(req.params.limit);
  const imageType = req.params.type;

  if (imageType === 'all') {
    db.select('url', 'type')
      .from('photos')
      .orderBy('created_at', 'desc')
      .limit(imageLimit)
      .then((urls) => {
        res.json(urls);
      })
      .catch((err) => res.status(400).json('database error'));
  } else {
    db.select('url', 'type')
      .from('photos')
      .where('type', '=', imageType)
      .orderBy('created_at', 'desc')
      .limit(imageLimit)
      .then((urls) => {
        res.json(urls);
      })
      .catch((err) => res.status(400).json('database error'));
  }
};

module.exports = { handleImage, handleApiCall, returnImages };
