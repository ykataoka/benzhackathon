# This is the script to set up data storage for demo

# start influxdb and grafana
influxd
grafana start

# insert data to Battery Use of Amy
python ./data_process/insert_battery_Amy.py

# insert data to Battery Use of Yasu
python ./data_process/insert_battery_Yasu.py
