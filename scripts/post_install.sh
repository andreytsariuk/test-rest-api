if [ -z "$(ls -A ./develop.env)" ] ; then
{
   echo "DB_CONNECTION_URL="
   echo "JWT_SECRET="
   echo "ES_CONNECTION_STRING="
   echo "ES_LOG="
   echo "ES_REQUEST_TIMEOUT="
   echo "ES_API_VERSION="  
   echo "ES_INDEX_PREFIX="
   echo "ES_INDEX_SUFFIX_PATTERN="
   echo "AWS_S3_BUCKET="
} >  './develop.env'
else
   echo "develop.env already exists"
fi   