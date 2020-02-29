#!/bin/bash

if [ $1 == "production" ]
then
  yarn deploy-rules-production
  yarn deploy-api-production
else
	yarn deploy-rules
  yarn deploy-api
fi
