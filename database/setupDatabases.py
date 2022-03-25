import os

def startService(serviceName):
  print("Starting {nm} -> ".format(nm=serviceName), end='')
  stat = os.system("sudo service {nm} start".format(nm=serviceName))
  if stat == 0:
    print(" STARTED")
  else:
    print(" ERROR")
    print("Issue starting {nm} service.".format(nm=serviceName))
    exit(1)


def stopService(serviceName):
  print("Stopping {nm} -> ".format(nm=serviceName), end='')
  stat = os.system("sudo service {nm} stop".format(nm=serviceName))
  if stat == 0:
    print(" STOPPED")
  else:
    print(" ERROR")
    print("Issue stopping {nm} service.".format(nm=serviceName))
    exit(1)

# Start a mongodb change stream script
def startStream(streamName):
  streamsDir = "./data_sharing/mongodb_streams/streams"
  print("  > {nm} ->".format(nm=streamName), end='')
  stat = os.system("node {dir}/{nm}".format(dir=streamsDir, nm=streamName))
  # Stream continues to run and doesn't disconnect from shell/cli, Ctrl+c
  # kills process and thus closes stream
  print("Stream closed")


try:
  # Start mongod service
  startService("mongod")

  # Start elasticsearch service
  startService("elasticsearch")

  # Start database synchronisation scripts
  print("Starting mongodb streams...")
  startStream("streamConceptNames.js") # Mongo -> ES, stream concept names

  # Python will pause at this point 
except:
  print("Error during database and stream setup")
finally:
  stopService("mongod")
  stopService("elasticsearch")

# On SIG

# Finish
exit(0)
