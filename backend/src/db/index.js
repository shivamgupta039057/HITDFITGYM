const { DB_NAME } = require("../Constants.js");
const mongoose = require("mongoose");

const getMongoUri = () => {
    const baseUri = (process.env.MONGODB_URI || "mongodb://localhost:27017").replace(
        /\/$/,
        "",
    );

    // URI already includes a database (e.g. mongodb://host:27017/gymdb)
    const hasDatabaseInUri = /mongodb(\+srv)?:\/\/[^/]+\/[^/?]+/.test(baseUri);

    return hasDatabaseInUri ? baseUri : `${baseUri}/${DB_NAME}`;
};

const ConnectDB = async () => {
    try {
        const connectionUri = getMongoUri();
        const ConnectionInstance = await mongoose.connect(connectionUri);
        console.log(
            `\n Mongoose Connected !! DB: ${ConnectionInstance.connection.name} Host: ${ConnectionInstance.connection.host}`,
        );
    } catch (error) {
        console.log("MONGOOSE CONNECTION ERROR", error);
        process.exit(1);
    }
};

module.exports = ConnectDB