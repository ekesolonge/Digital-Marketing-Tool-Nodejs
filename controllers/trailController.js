const connection = require('../models/db')

const auditTrail = ()=>{

}




auditTrail.logTrail = (trail)=>{
    connection.query(`insert INTO trail (actor,action,type) VALUE ('${trail.actor}','${trail.action}','${trail.type}',)`,(err, resp)=>{
      if(err)  {
          console.log(err.sqlmessage)
      }
    })
}
module.exports = auditTrail;