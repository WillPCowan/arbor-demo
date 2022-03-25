# Start databases -------
# MongoDB
sudo systemctl start mongod

# Elasticsearch
sudo systemctl start elasticsearch

# Determine if databases are active (if grep returns result, return true)
MONGO_ACTIVE=[ -z "$(systemctl status mongod | grep "Active: active (running)")" ];
ES_ACTIVE=[ -z "$(systemctl status mongod | grep "Active: active (running)")" ];

# While mongo not active, do this .....
while [ ]

# While elasticsearch not active, do this ....

# Setup synchronisation scripts -------
node data_sharing/mongodb_streams/streamConceptNames.js