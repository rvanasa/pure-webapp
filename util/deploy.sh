DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" >/dev/null && pwd )"
cd $DIR/..

nvm use 8 &&

rm -rf dist &&

heroku git:remote -a platformpure &&

node_modules/webpack-cli/bin/cli.js --bail --progress --profile &&

git commit -m "(Deploy)" &&
git push heroku master --force &&
git reset HEAD~1

rm -rf dist

##  Helpful for testing:  ##
# git add . && git commit --amend --no-edit && git push heroku master --force && heroku logs -t