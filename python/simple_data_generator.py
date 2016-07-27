#!/usr/bin/python

from pykafka import KafkaClient
import random
import time
import sys

print 'Args = ', str(sys.argv[1])
loopCnt = int(sys.argv[1])


client = KafkaClient(hosts="localhost:9092")

topic = client.topics['realtime']



def makeMessage():
    cnt = random.randrange(1, 100)

    srcip_1 = random.randrange(1, 3)
    srcip_2 = random.randrange(1, 3)
    srcip_3 = random.randrange(1, 3)
    srcip_4 = random.randrange(1, 3)

    dstip_1 = random.randrange(1, 10)
    dstip_2 = random.randrange(1, 10)
    dstip_3 = random.randrange(1, 10)
    dstip_4 = random.randrange(1, 11)

    message = "%d %d.%d.%d.%d %d.%d.%d.%d" %(cnt, srcip_1, srcip_2, srcip_3, srcip_4, dstip_1, dstip_2, dstip_3, dstip_4)
    return message



with topic.get_sync_producer() as producer:
   # for i in range(loopCnt):
   n = 0
   while loopCnt:
        if n == loopCnt:
          break;
        else: n = n+1

        message = makeMessage()
        print(message)
        producer.produce(message)
        time.sleep(1)
