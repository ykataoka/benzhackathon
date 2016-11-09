# This is the script to start demo

# pump gps data of tracks as if it is real-time
python ./data_process/pump_gps.py &
echo "Launching pump_gps.py..."
sleep 3s

# start web server for battery use real-time monitoring (Yasu's part)
cd server
node app.js &
echo "Launching web server for real-time monitoring..."
sleep 3s

# start gulp for smart routing demo (David's part)
cd ../siliconvalley.hack2016/blur-admin
echo "Launching dashboard for smart routing..."
gulp serve 
