import argparse
import json
import glob
import time
from influxdb import InfluxDBClient
import pandas as pd
from datetime import datetime 
import random

def battery_dummy_generator(battery_val):
    if battery_val < 0.0:
        return 100.0
    return battery_val - 0.2 * random.random()

def main(host='localhost', port=8086):
   
    # InfluxDB
    user = 'root'
    password = 'root'
    dbname = 'benz_realtime'
    dbuser = 'yasu'
    dbuser_password = 'my_secret_password'
    #query = 'select value from cpu_load_short;'
    client = InfluxDBClient(host, port, user, password, dbname)
    print("Drop database: " + dbname)
    client.drop_database(dbname)
    print("Create database: " + dbname)
    client.create_database(dbname)
    print host, port, user, password, dbname
    
    #print host, port, user, password, dbname

    # insert to influxdb
    # battery
    demianfiles = glob.glob('../data-dump/demian/*') # d
    angelafiles = glob.glob('../data-dump/angela/*') # a
    einsteinfiles = glob.glob('../data-dump/einstein/*') # e
    karlfiles = glob.glob('../data-dump/karl/*') # k

    # let's focus on demian file first
    #battery = [x for x in demianfiles if x.find('battery')!=-1] # useless!
    location_d = [x for x in demianfiles if x.find('location')!=-1]
    print location_d[0]
    location_d = pd.read_json(location_d[0])

    location_a = [x for x in angelafiles if x.find('location')!=-1]
    print location_a[0]
    location_a = pd.read_json(location_a[0])

    location_e = [x for x in einsteinfiles if x.find('location')!=-1]
    print location_e[0]
    location_e = pd.read_json(location_e[0])
    
    location_k = [x for x in karlfiles if x.find('location')!=-1]
    location_k = pd.read_json(location_k[0])
    
    loop_num = min(location_d.shape[0], \
                   location_a.shape[0], \
                   location_e.shape[0], \
                   location_k.shape[0])
    
    # insert to influxdb : every 1 second
    battery_val = 100.0
    for i in range(loop_num):
        
        # demian
        current_time = datetime.utcnow().strftime('%Y-%m-%dT%H:%M:%SZ')
        longitude    = location_d.iloc[i,:]['longitude']
        latitude     = location_d.iloc[i,:]['latitude']
        battery_val  = battery_dummy_generator(battery_val)
        battery_init = battery_dummy_generator(battery_val)
        
        temp = {"longitude" : longitude,
                "latitude" : latitude,
                "battery" : battery_val
        }
        json_body = [
            {
                "measurement": "car_data_d",
                "tags": {
                    "host": "server01",
                    "region": "us-west"
                },
                "time": current_time,
                "fields": temp
            }
        ]
        print temp
        client.write_points(json_body)
        
        # angela
        current_time = datetime.utcnow().strftime('%Y-%m-%dT%H:%M:%SZ')
        longitude    = location_a.iloc[i,:]['longitude']
        latitude     = location_a.iloc[i,:]['latitude']
        battery_val  = battery_dummy_generator(battery_val)
        temp = {"longitude" : longitude,
                "latitude" : latitude,
                "battery" : battery_val}
        json_body = [
            {
                "measurement": "car_data_a",
                "tags": {
                    "host": "server01",
                    "region": "us-west"
                },
                "time": current_time,
                "fields": temp
            }
        ]
        print temp
        client.write_points(json_body)

        # einstein
        current_time = datetime.utcnow().strftime('%Y-%m-%dT%H:%M:%SZ')
        longitude    = location_e.iloc[i,:]['longitude']
        latitude     = location_e.iloc[i,:]['latitude']
        battery_val  = battery_dummy_generator(battery_val)
        temp = {"longitude" : longitude,
                "latitude" : latitude,
                "battery" : battery_val}
        json_body = [
            {
                "measurement": "car_data_e",
                "tags": {
                    "host": "server01",
                    "region": "us-west"
                },
                "time": current_time,
                "fields": temp
            }
        ]
        print temp
        client.write_points(json_body)

        # karl
        current_time = datetime.utcnow().strftime('%Y-%m-%dT%H:%M:%SZ')
        longitude    = location_k.iloc[i,:]['longitude']
        latitude     = location_k.iloc[i,:]['latitude']
        battery_val  = battery_dummy_generator(battery_val)
        temp = {"longitude" : longitude,
                "latitude" : latitude,
                "battery" : battery_val}
        json_body = [
            {
                "measurement": "car_data_k",
                "tags": {
                    "host": "server01",
                    "region": "us-west"
                },
                "time": current_time,
                "fields": temp
            }
        ]
        print temp
        client.write_points(json_body)

        print "sleep!"
        time.sleep(1)
    
    # GPS data
    
    
def parse_args():
    parser = argparse.ArgumentParser(
        description='example code to play with InfluxDB')
    parser.add_argument('--host', type=str, required=False, default='localhost',
                        help='hostname of InfluxDB http API')
    parser.add_argument('--port', type=int, required=False, default=8086,
                        help='port of InfluxDB http API')
    return parser.parse_args()


if __name__ == '__main__':
    args = parse_args()
    print args.host
    print args.port
    main(host=args.host, port=args.port)
    
