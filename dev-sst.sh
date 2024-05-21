if [ ! -f .env ]
then
  export $(cat .env.local | xargs)
fi

sst secret set AuthSecret $AUTH_SECRET --stage=dev
sst secret set PostgresURL $POSTGRES_URL --stage=dev
sst dev next dev --stage dev
