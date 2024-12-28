import json
import os
import random
import dramatiq_actors

FILE_NAME = 'ipranges.json'

class IpRange: 
  def __init__(self, cidr=None) -> None:
    self.range = cidr

  def generate_list(self):
    if self.range:
      self._generate_custom_list()
    else:
      raise ValueError(f'CIDR range must be provided')

  def set_as_scanned(self, range):
    d = self._to_dict(FILE_NAME)
    d[range]['scanned'] = True
    self._to_json(d)
    
  def get_random_range(self):
    range_dict = self._to_dict(FILE_NAME)
    range_list = list(range_dict.items())
    list_length = len(range_list)
    c = 0
    scanned = True
    while scanned:
      _range, value = random.choice(range_list)
      scanned = value['scanned']
      c += 1 
      if c >= list_length:
        dramatiq_actors.worker_log.send("You've scanned the whole range 😱")
        self.generate_list()
        self.get_random_range()
    return _range

  def get_scanned_ips(self, filename) -> list:
    scannedList = self._to_dict(filename)
    ips = []
    for scan in scannedList: ips.append(scan['ip'])
    return ips

  def _generate_custom_list(self):
    # Assuming cidr is a list of CIDR ranges
    to_be_json = {cidr: {'scanned': False} for cidr in self.range}
    self._to_json(to_be_json)
    dramatiq_actors.worker_log.send(f'[{__name__}.py]: List written to {os.getcwd()}/{FILE_NAME}')

  def _to_json(self, dict, filename=FILE_NAME):
    with open(filename, 'w') as file:
      file.write(json.dumps(dict, indent=4))
      
  def _to_dict(self, filename):
    with open(filename, 'r') as file:
      return json.load(file)
