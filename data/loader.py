import json

#Opening file and loading all json values
json_data=open('bikes.json', 'r')
data = json.load(json_data)
columns = dict([(d["fieldName"], index) for (index, d) in  enumerate(data["meta"]["view"]["columns"])])

def newParking():
  return {
      'status' : "",
      'placement' : "",
      'location_name' : "",
      'address' : "",
      'spaces' : 0,
      'racks' : 0,
      'latitude' : 0,
      'longitude' : 0
      }

parkings = []
statuses = {}
status_count = 0
placements = {}
placement_count = 0

for parking in data["data"]:
  p = newParking()
  p['status'] = parking[columns["status"]]
  p['placement'] = parking[columns["placement"]]
  p['location_name'] = parking[columns["location_name"]]
  p['address'] = parking[columns["yr_inst"]] 
  p['spaces'] = parking[columns["spaces"]] 
  p['racks'] = parking[columns["racks_installed"]] 
  p['latitude'] = parking[columns["coordinates"]][1]
  p['longitude'] = parking[columns["coordinates"]][2]
  if not p['status'] in statuses:
    status_count = status_count + 1
    statuses[p['status']] = status_count
  if not p['placement'] in placements:
    placement_count = placement_count + 1
    placements[p['placement']] = placement_count
  p['status'] = statuses[p['status']]
  p['placement'] = placements[p['placement']]
  for key, value in p.items():
    if value == None:
      p[key] = '0'
  parkings.append(p)

print "Executing"
statement = []
for placement, key in placements.items():
  statement.append("INSERT INTO placement ( id, name ) VALUES (%d, '%s')" % (key, placement))

for status, key in statuses.items():
  statement.append("INSERT INTO status ( id, name ) VALUES (%d, '%s')" % (key,status))

for parking in parkings:
  statement.append("INSERT INTO parking_slot ( location_name, address, spaces, racks, latitude, longitude, placement_id, status_id) VALUES ('%s', '%s', %s, %s, %s, %s, %s, %s)" % (parking["location_name"].replace('\'', '"'), parking["address"].replace("\'", '"'), parking["spaces"], parking["racks"], parking["latitude"], parking["longitude"], parking["placement"], parking["status"])) 

import io
f = io.open("seed.sql", 'w', encoding='utf8')
f.write(";".join(statement))
