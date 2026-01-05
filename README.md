## Description
Nest backend appilication for a food ordering app

## Project setup

```bash
$ yarn install
```

## Compile and run the project

```bash
# development
$ yarn run start

# watch mode
$ yarn run start:dev

# production mode
$ yarn run start:prod
```

## Run tests

```bash
# unit tests
$ yarn run test

# test coverage
$ yarn run test:cov
```

# env 
create .env file in root folder and add the following environment variables

``` bash
JWT_SECRET=<secret key to generate  jwt token>
S3_SERVICE_PROFILE=<live(to upload image) or mock(to use random existing image, use this to get the app running quickly)>

#  below vars can be ignored if S3_SERVICE_PROFILE is set to mock
AWS_REGION=<region of s3 bucket>
AWS_S3_ENDPOINT=<aws end point>
AWS_ACCESS_KEY_ID=<access key id>
AWS_SECRET_ACCESS_KEY=<secret access key>
AWS_S3_DEFAULT_BUCKET_NAME=<default bucket name for food images>
```
