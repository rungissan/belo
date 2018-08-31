import mongoose from 'mongoose';
import { mongodb }from '../config';

mongoose.Promise = global.Promise;

const connectToDb = async () => {
    try {
        await mongoose.connect(mongodb, {
            useMongoClient: true
        });
        console.info('Connected to mongo!!!');
       // logger.info('Connected to mongo!!!');
    }
    catch (err) {
        console.error(err);
        //logger.error('Could not connect to MongoDB');
    }
}

export default connectToDb;