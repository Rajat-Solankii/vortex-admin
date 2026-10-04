const db = require('better-sqlite3')('D:/Desktop/Projects/Vortex/vortex.db', {readonly:true});
console.log(db.prepare("PRAGMA table_info(profiles)").all());
