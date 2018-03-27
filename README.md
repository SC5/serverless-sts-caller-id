# Serverless STS Caller ID

A Serverless Plugin for the [Serverless Framework](http://www.serverless.com) which
helps allows to retrieve the user ID belonging to the AWS credentials currently being used with the help of STS (Security Token Service).

## Introduction

This plugins does the following:

* It provides a variable (`stsCallerId`) that contains the user ID of the AWS credentials being used

## Installation and configuration

In your service root, run:

```bash
npm install --save-dev serverless-sts-caller-id
```

Add the plugin to `serverless.yml`:

```yml
plugins:
  - serverless-sts-caller-id
```

## Usage

You can use the custom variable `stsCallerId` in `serverless.yml`. For example:

```yml
provider:
  stage: ${stsCallerId}
```

If you want to get a SHA1 hashed version of the ID, you can use `stsCallerId:hashed`:

```yml
provider:
  stage: ${stsCallerId:hashed}
```

You can also truncate the hash to a specific length:

```yml
provider:
  stage: ${stsCallerId:hashed:8}
```

## TODO

* Add tests

## Release History

* 2018/03/27 - v1.0.0 - Initial version


## License

Copyright (c) 2018 [Nordcloud](https://nordcloud.com/), licensed for users and contributors under MIT license.
https://github.com/SC5/serverless-sts-caller-id/blob/master/LICENSE