import { Queue } from 'bullmq';
import Redis from 'ioredis';

let _connection: Redis | null = null;
let _fileUploadQueue: Queue | null = null;

export const getConnection = () => {
  if (!_connection) {
    const redisUrl = process.env.REDIS_URL || 'redis://localhost:6379';
    console.log(`Connecting to Redis at: ${redisUrl}`);
    _connection = new Redis(redisUrl, {
      maxRetriesPerRequest: null,
      lazyConnect: true,
    });
  }
  return _connection;
};

export const getFileUploadQueue = async () => {
  if (!_fileUploadQueue) {
    const connection = getConnection();
    
    if (!connection.status || connection.status === 'wait') {
      console.log('Establishing Redis connection...');
      await connection.connect();
    }
    
    _fileUploadQueue = new Queue('file-upload', { connection });
    console.log('Queue initialized');
  }
  return _fileUploadQueue;
};