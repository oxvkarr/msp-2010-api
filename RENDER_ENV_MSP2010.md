# Render Environment Variables for `msp-2010-api`

Use these on the Render Web Service created from this repo.

## Keep

```env
PORT=10000
```

## Rename from old MSP 2010 Render service

Old:

```env
MONGODB_URI=mongodb+srv://USER:PASSWORD@HOST/?appName=msp-2016
REMOTE_ASSET_BASE_URL=https://pub-2ec8e3c2f0a24e46ab1defac06482eb3.r2.dev/2010
```

New for this API:

```env
CUSTOMCONNSTR_URIMongoDB=mongodb+srv://USER:PASSWORD@HOST/msp_2010?appName=msp-2010
MSP2010_CDN_URL=https://pub-2ec8e3c2f0a24e46ab1defac06482eb3.r2.dev/2010
```

Important: add `/msp_2010` before the `?` in the MongoDB URI so Mongoose writes to the correct database.

## Add

```env
CUSTOMCONNSTR_SaltDB=put_a_long_random_secret_here
CUSTOMCONNSTR_SaltClient=put_another_long_random_secret_here
DevServer=false
ChecksumEnabled=false
LogEveryRequest=false
CORS_ORIGINS=https://pub-2ec8e3c2f0a24e46ab1defac06482eb3.r2.dev,http://127.0.0.1:80,http://localhost:80
```

## Remove / not needed for this API

```env
GIT_LFS_SKIP_SMUDGE
MONGODB_DB
MONGODB_STATE_COLLECTION
MSP_DEBUG
REAL_MSP_PROXY
REAL_MSP_SERVER
REMOTE_ASSET_BASE_URL
REMOTE_ASSET_CACHE
```

Those belong to the old launcher/local server flow, not this MSPRetro-style API.
