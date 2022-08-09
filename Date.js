module.exports.getDate=function()//also use simple export
{
     let options = { weekday: 'long',
                     year: 'numeric',
                    month: 'long', 
                    day: 'numeric' 
                  };
    let today  = new Date();
    let day=today.toLocaleDateString("en-US", options);
    return day;
}

module.exports.getDay=function()
{
     let options = { weekday: 'long',
                   };
    let today  = new Date();
    let day=today.toLocaleDateString("en-US", options);
    return day;
}