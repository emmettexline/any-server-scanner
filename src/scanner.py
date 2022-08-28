import json
import dramatiq_actors
import cache
from mongo import DB
from time import sleep
from concolor import Color
from iprange import IpRange
import os
from scheduler import scheduler

PORT = '25565'
RATE = os.getenv('RATE')
SCANNED_FILE_NAME = 'res.json'
FOUND_FILE_NAME = 'found.json'
ip_range = IpRange()

def main():
  # Write missing files
  if not os.path.exists('ipranges.json'): ip_range.generate_list()
  if not os.path.exists(SCANNED_FILE_NAME): 
      with open(SCANNED_FILE_NAME, 'w') as file: file.write('')
  try:
    scheduler.start()
    while True:
      range = ip_range.get_random_range()
      range = '34.135.0.0/16'
      scan(range)
      ip_range.set_as_scanned(range)
      sleep(1)
      dramatiq_actors.worker_log.send(f'Range: {range} set as scanned', __name__)
  except KeyboardInterrupt:
    scheduler.shutdown()
    return 0

def scan(range):
  dramatiq_actors.worker_log.send(f'Scanning range: {Color.YELLOW}{range}{Color.END} for open {PORT} port @ {RATE} kp/s', __name__)
  command = f'masscan -p{PORT} {range} --rate {RATE} --wait {0} -oJ {SCANNED_FILE_NAME}'
  os.system(command)
  # Sleep: make sure the file is written before getting ip's
  sleep(1)
  ips = []
  try:
    ips = ip_range.get_scanned_ips(SCANNED_FILE_NAME)
    dramatiq_actors.worker_log.send(f'{len(ips)} ip(s) found in range: {Color.GREEN}{range}{Color.END}', __name__)
  except json.JSONDecodeError:
    dramatiq_actors.worker_log.send(f'No servers found in range {Color.RED}{range}{Color.END}', __name__)
  total = len(ips)
  count = 0
  for ip in ips:
    count += 1
    dramatiq_actors.slp.send(ip, count, total)

if __name__ == '__main__':
  main()
