import Redis, {RedisOptions} from 'ioredis'
const redisOptions: RedisOptions = {
  host: process.env.REDIS_HOST,
  port: Number(process.env.REDIS_PORT),
  password: process.env.REDIS_PASSWORD,
  db: Number(process.env.REDIS_DB),
  enableOfflineQueue: false,
  connectTimeout: 5000,
  retryStrategy(times){
    const delay = Math.min(times * 50, 2000);
    console.warn(`Redis lost connection, retrying in ${delay} ms`)
    return delay;
  }
  
}
const redis = new Redis(redisOptions)
let connected = false;
redis.on('ready',()=>{
  connected = true
  console.log('Redis Connected')
})
redis.on('error',()=>{
  console.error('Redis connection error')
  connected = false
})
redis.on('reconnect',()=>{
  console.log('Redis connected')
  connected = true
})
redis.on('end',()=>{
  console.error('Redis connection end')
  connected = false
})
export const redisWrapper = {
  async get(key:string) : Promise<string|null>{
    if(!connected) return null;
    try {
      return await redis.get(key);
    } catch (error) {
      console.error('Redis Get Error : ',error)
      return null
    }
  },
  async set(key:string, value:string, ttlSeconds?: number):Promise<boolean>{
    if(!connected) return false;
    try {
        if(ttlSeconds){
          await redis.set(key,value,'EX',ttlSeconds)
        }
        else{
          await redis.set(key,value)
        }
        return true;
    }
    catch(error){
      console.error("Redis Set Error : ",error)
      return false
    }
  },
  async delete(key:string): Promise<boolean>{
    if(!connected)return false
    try{
      await redis.del(key)
      return true
    }
    catch(error){
      console.error("Redis Delete Error : ",error)
      return false
    }
  },
  get client(){
    return redis
  }
} 
const gracefulShutdown = async()=>{
  console.log('Closing Redis Connection')
  await redis.quit()
  process.exit(0)
}
process.on('SIGINT',gracefulShutdown)
process.on('SIGTERM',gracefulShutdown)
export default redis;