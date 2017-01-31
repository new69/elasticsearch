var config = require("./config.json"),
  request = require("request"),
  userMapping;

userMapping = {
  "settings": {
    "analysis": {
      "filter": {
        "email_pattern": {
          "type": "pattern_capture",
          "preserve_original": true,
          "patterns": [
            "([^@]+)",
            "(\\p{L}+)",
            "(\\d+)",
            "@(.+)"
          ]
        },
      },
      "tokenizer" : {
        "my_edge_ngram_tokenizer" : {
          "type" : "edgeNGram",
          "min_gram" : "2",
          "max_gram" : "15",
          "token_chars": [ "letter", "digit" ]
        }
      },
      "analyzer": {
        "portuguese": {
          "tokenizer": "my_edge_ngram_tokenizer",
          "filter": ["standard", "lowercase", "asciifolding"]
        },
        "email_validation": {
          "tokenizer": "uax_url_email",
          "filter": ["email_pattern", "lowercase", "unique"]
        }
      }
    }
  },
  "mappings": {
    "user": {
      "properties": {
        "userId": {
          "type": "long"
        },
        "created": {
          "format": "dd/MM/yyyy HH:mm",
          "type": "date"
        },
        "name": {
          "type": "string",
          "analyzer": "portuguese"
        },
        "email": {
          "type": "string",
          "analyzer": "email_validation",
        },
        "friends": {
          "properties": {
            "name": {
              "type": "string",
              "analyzer": "portuguese"
            },
            "userId": {
              "type": "long"
            },
            "origin": {
              "type": "string"
            }
          }
        }
      }
    }
  }
}

request.del(config.elasticHost + '/' + config.docName + '/', function (err, res, body) {
  console.log('Removing Users');
  console.log('body: ', body);

  request.post(config.elasticHost + '/' + config.docName,
    {json: true, body: userMapping},
    function (err, res, body) {
      console.log('Creating new Users collection');
      console.log('body: ', body);
    }
  );
});

