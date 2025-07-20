const parseBool=(val)=>{
    if(typeof val === 'string'){
        return val==='true'
    }
    return val
}
module.exports={
    parseBool
}