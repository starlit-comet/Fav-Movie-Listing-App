$env:PORT = 3232
$env:JWT_SECRET = "You-Can't-See-Me"
$env:JWT_EXPIRES_IN = "1d"
$env:CORS_ORIGIN="http://localhost:5173"
$env:JWT_EXPIRES_IN="7d"
$env:PASSWORD_SALT=10
$env:PBKDF2_ITERATIONS=100000
$env:PBKDF2_KEYLEN=64
$env:PBKDF2_DIGEST="sha512"
npm run dev
