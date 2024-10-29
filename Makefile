REPO?=zerochass/cms
TAG?=production

AWS_ACCOUNT_ID?=116893520615
AWS_ECR_REGION?=us-east-1
AWS_ECR_DOMAIN?=$(AWS_ACCOUNT_ID).dkr.ecr.$(AWS_ECR_REGION).amazonaws.com
# IMAGE is an environment variable

sc: build-nginx build-php build-node

build-nginx: 
	docker build -t $(REPO):$(TAG)-nginx -f ./.docker-config/nginx/Dockerfile .

build-php:
	docker build -t $(REPO):$(TAG)-php -f ./.docker-config/php/Dockerfile ./.docker-config/php/

build-node:
	docker build --target production -t $(REPO):$(TAG)-node -f ./.docker-config/node/Dockerfile ./.docker-config/node/

ecr-login:
	aws ecr get-login --no-include-email --region $(AWS_ECR_REGION) | sh -

push: ecr-login build-$(IMAGE)

	docker tag $(REPO):$(TAG)-$(IMAGE) $(AWS_ECR_DOMAIN)/$(REPO):$(TAG)-$(IMAGE)
	docker push $(AWS_ECR_DOMAIN)/$(REPO):$(TAG)-$(IMAGE)
	
	docker image rm $(AWS_ECR_DOMAIN)/$(REPO):$(TAG)-$(IMAGE)

zippy: 
	rm -f ebdeploy.zip
	zip ebdeploy.zip Dockerrun.aws.json .ebextensions/*

zip-application:
	rm -f node/application.zip
	cd node && zip application.zip -r .next/* .npmrc package.json package-lock.json sitemap.js \
	    siteconfig.json next.config.js next-env.d.ts public/*