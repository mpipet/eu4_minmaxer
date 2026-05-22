Build/Run server image
----------------------



From cert folder
----------------

openssl genrsa -out http_ca.key 2048
openssl req -new -x509 -sha256 \
  -key http_ca.key \
  -out http_ca.crt \
  -days 3650 \
  -config openssl.cnf \
  -extensions v3_req

openssl pkcs12 -export \
  -in http_ca.crt \
  -inkey http_ca.key \
  -out http.p12 \
  -name es01 \
  -passout pass:changme

keytool -import \
  -alias ca \
  -file http_ca.crt \
  -keystore truststore.p12 \
  -storetype PKCS12 \
  -storepass changme \
  -noprompt

chmod 644 http_ca.crt http.p12 truststore.p12


@TODO
------
- configure pagination and see what to do with it
- Some modifiers uses many key for the same modifier example reform progress groth, fix...
Clergy loyalty equilibrium vs Brhamins
- Filter effect and remove effect fields
- KEEP only two digit after coma on values


