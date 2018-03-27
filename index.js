'use strict';

const AWS = require('aws-sdk');
const crypto = require('crypto');
const Promise = require('bluebird');

const VARIABLE_PREFIX = 'stsCallerId';
const sts = new AWS.STS();

function sha1(data) {
  return crypto.createHash('sha1').update(data).digest('hex');
}

class Plugin {
  constructor(serverless, options) {
    this.callerId = undefined;
    const delegate = serverless.variables.getValueFromSource.bind(serverless.variables);

    serverless.variables.getValueFromSource = (variableString) => {
      if (variableString.startsWith(VARIABLE_PREFIX)) {
        if (this.callerId !== undefined) {
          return Promise.resolve(this.callerId)
        }
        return sts.getCallerIdentity()
          .promise()
          .then(data => {
            const callerId = data.UserId;
            if (variableString == VARIABLE_PREFIX) {
              return callerId;
            }
            let variableParts = variableString.split(`${VARIABLE_PREFIX}:`);
            if (variableParts.length > 1) {
              variableParts = variableParts[1].split(':');
              const suffix = variableParts[0];
              if (suffix == 'hashed') {
                console.log(variableParts);
                const hashedCallerId = sha1(callerId);
                if (variableParts.length === 2) {
                  console.log(variableParts);
                  const hashLength = parseInt(variableParts[1]);
                  if (hashLength) {
                    return hashedCallerId.slice(0, hashLength);
                  }
                }
                return hashedCallerId;
              }
            }
          })
          .then((res) => {
            if (!res) {
                return delegate(variableString);
            }
            return res;
          });
      }
      return delegate(variableString);
    }
  }
}

module.exports = Plugin;