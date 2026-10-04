const db = require('better-sqlite3')('D:/Desktop/Projects/Vortex/vortex.db', {readonly:true});
console.log(db.prepare("SELECT name FROM sqlite_master WHERE type='table'").all());
