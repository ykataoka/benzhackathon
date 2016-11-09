import argparse
import json
import glob
import time
from influxdb import InfluxDBClient
import pandas as pd
from datetime import datetime , timedelta
import random

def battery_init_pred_gen(i):
    x1,y1 = 0,100
    x2,y2 = 972,-170
    x3,y3 = 2268,52
    x4,y4 = 2880,5
    X,Y = [], []
    t = i / 2880.
    x = (1-t*t*t)*x1 + 3*(1-t)*(1-t)*t*x2 + 3*(1-t)*t*t*x3 + t*t*t*x4
    y = (1-t*t*t)*y1 + 3*(1-t)*(1-t)*t*y2 + 3*(1-t)*t*t*y3 + t*t*t*y4
    return y

def battery_cur_gen(i):
    x1,y1 = 0,100
    x2,y2 = 972,-150
    x3,y3 = 2268,52
    x4,y4 = 2880,15
    X2,Y2 = [], []
    t = i / 2880.
    x = (1-t*t*t)*x1 + 3*(1-t)*(1-t)*t*x2 + 3*(1-t)*t*t*x3 + t*t*t*x4
    y = (1-t*t*t)*y1 + 3*(1-t)*(1-t)*t*y2 + 3*(1-t)*t*t*y3 + t*t*t*y4
    return y + (25.0*random.random() - 12.5)

def battery_after_pred_gen(i):
    x1,y1 = 0,100
    x2,y2 = 972,-150
    x3,y3 = 2268,52
    x4,y4 = 2880,15
    X2,Y2 = [], []
    t = i / 2880.
    x = (1-t*t*t)*x1 + 3*(1-t)*(1-t)*t*x2 + 3*(1-t)*t*t*x3 + t*t*t*x4
    y = (1-t*t*t)*y1 + 3*(1-t)*(1-t)*t*y2 + 3*(1-t)*t*t*y3 + t*t*t*y4
    return y

def main(host='localhost', port=8086):
   
    # InfluxDB
    user = 'root'
    password = 'root'
    dbname = 'benz_simulation'
    dbuser = 'yasu'
    dbuser_password = 'my_secret_password'
    client = InfluxDBClient(host, port, user, password, dbname)
    print("Create database: " + dbname)
    client.create_database(dbname)
    print host, port, user, password, dbname
    
    #print host, port, user, password, dbname
    time_now = datetime(2016, 11, 6, 9, 0, 0)
    time_now = time_now + timedelta(hours=8)    
    for i in range(2880):
        
        # Amy
        time_now = time_now + timedelta(seconds=10)
        battery_init_pred = battery_init_pred_gen(i) #i[s] from 8:00am

        if i <= 1440:
            battery_cur = battery_cur_gen(i) # add noise
        else:
            battery_cur = None
        if i >= 1440:
            battery_after_pred = battery_after_pred_gen(i) # add noise
        else:
            battery_after_pred = None
            
        temp = {"batter_init"   : battery_init_pred,
                "batter_now"    : battery_cur,
                "battery_after" : battery_after_pred
        }
        json_body = [
            {
                "measurement": "battery_data_d",
                "tags": {
                    "host": "server01",
                    "region": "us-west"
                },
                "time": time_now,
                "fields": temp
            }
        ]
        client.write_points(json_body)

    
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
    print "Done, insert_battery_Amy.py"
