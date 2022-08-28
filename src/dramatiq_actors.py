from datetime import time, datetime
from concolor import Color
from statusping import StatusPing
from mongo import DB
import dramatiq
import cache
from dramatiq.brokers.redis import RedisBroker
redis_broker = RedisBroker(host="redis")
dramatiq.set_broker(redis_broker)

@dramatiq.actor
def worker_log(str, src=__name__):
  date = datetime.now()
  ts = date.strftime('%d-%b-%y %H:%M:%S')
  print(f'[{ts}][{src}.py] {str}')

@dramatiq.actor
def slp(ip, count, total):
  worker_log.send(f'[{count}/{total}] Checking server list ping of {Color.YELLOW}{ip}{Color.END}', __name__)
  try:
    status = StatusPing(ip)
    res = status.get_status()
    # Generate entry object
    ts = int(time() * 1000)
    entry = {
    'ip': ip,
    'foundAt': ts,
    }
    entry.update(res)
    cache.stage(entry)
    # Stage entry to redis store
    worker_log(f'CACHING????{entry}')
    worker_log.send(f'[{count}/{total}] {Color.GREEN}Succesfully{Color.END} pinged {Color.YELLOW}{ip}{Color.END}, staged to save to db.', __name__)
  except:
    worker_log.send(f'[{count}/{total}] {Color.RED}{ip}{Color.END} is not a minecraft server I guess', __name__)

@dramatiq.actor
def write_to_db():
  try:
    db = DB()
    entries = cache.getAll()
    worker_log(entries)
    if len(entries):
      db.insert_many(entries)
      worker_log.send(f'Succesfully added {Color.GREEN}{len(entries)}{Color.END} entries to db.')
      # Remove saved items from redis store
      keys = []
      for entry in entries:
        keys.append(str(entry['ip']) + str(entry['foundAt']))
      cache.unstageMany(keys)
    else:
      worker_log.send('No staged entries to add to db.')
  except Exception as e:
    worker_log.send(f'An {Color.RED}error{Color.END} ocurred on trying to write entries to mongo databse')
    raise Exception(f'An {Color.RED}error{Color.END} ocurred on trying to write entries to mongo database, Error{e}')
  






