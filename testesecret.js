
const jwt = require('jsonwebtoken');
const fs = require('fs');

var cert = Buffer.from(fs.readFileSync('secret'), 'base64').toString();
var pubcert = Buffer.from(fs.readFileSync('secret.pub'), 'base64').toString();

data = {
  "apps" : {
    "pay" : {
      "account" : {
        "amount_per_transaction" : 0,
        "created" : "",
        "name" : "",
        "payment_time" : "",
        "transfer" : "",
        "tx_adm" : 499,
        "tx_canc" : 0
      },
      "permissions" : {
        "orders" : [ "GET", "PUT", "POST", "DELETE" ],
        "reports" : [ "GET", "PUT", "POST", "DELETE" ],
        "statements" : [ "GET", "PUT", "POST", "DELETE" ],
        "transferences" : [ "GET", "PUT", "POST", "DELETE" ]
      }
    },
    "wallet" : {
      "account" : {
        "account" : "",
        "account_digit" : "",
        "agency" : "",
        "agency_digit" : "",
        "bank" : "",
        "cnpj" : "",
        "cpf" : "",
        "created" : "",
        "gateway_integration" : true,
        "id" : "",
        "legal_name" : "",
        "maturity" : 0,
        "name" : "",
        "withdrawal_fee_amount" : 0
      },
      "permissions" : {
        "accounts" : [ "GET" ],
        "orders" : [ "GET" ],
        "reports" : [ "GET", "POST" ],
        "statements" : [ "GET" ],
        "transfers" : [ "GET", "POST", "PUT" ],
        "withdrawals" : [ "GET", "POST", "PUT" ]
      }
    }
  },
  "identity" : {
    "time_zone" : "America/Sao_Paulo",
    "uid" : "3ivmWeoeweZPColP68enQfZoAOr1",
    "unique_token" : "ae8d5fa0-cf22-4e20-8f5d-f120447e226c"
  }
};

jwt.sign(data, cert, { algorithm: 'RS256', expiresIn: 300 }, function(err, token) {
    console.log(token);

    // jwt.verify(token, pubcert, { format: 'PKCS8', algorithms: ['RS256'] }, function(err, decoded) {
    //   console.log(decoded) // bar
    // });
});

