# Deployment from dev laptop to production setup

npm run build-staging-local

Compress-Archive -Force -Path ./dist/* -DestinationPath ./dist/memberz-org.zip

Write-Host -fore Cyan "`r`nCopying archive from ./dist/ to /home/runcloud/webapps/memberz-angular"
. pscp -i C:\Users\icewa\.ssh\TG-Personal.ppk "./dist/memberz-org.zip" "runcloud@memberz.org:/home/runcloud"

Write-Host -fore Cyan "`r`nDeploying files on remote /home/runcloud/webapps/memberz-angular"
. ssh -i C:\Users\icewa\.ssh\TG-Personal.pem "runcloud@app.memberz.org" "cd ~/webapps/memberz-angular; git pull; rm -rf dist; mkdir dist; cp ~/memberz-org.zip ~/webapps/memberz-angular/memberz-org.zip; unzip -o memberz-org.zip -d dist; rm -rf live-bak; mv live live-bak; rm -rf live; mv dist live; rm memberz-org.zip; exit;"
