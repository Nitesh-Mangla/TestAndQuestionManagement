exports.verifyRole  = (role) => {
    return  [
        (req, res, next) => {
             if(!role){
                 return res.status(400).json({
                     success: false,
                     status: 400,
                     data: [],
                     message: "Undefined role."
                 });
             }
             console.log(req.body?.user_details)
             if(!req.body?.user_details){
                 return res.status(401).json({
                     success: false,
                     status: 401,
                     data: [],
                     message: "Unauthorized user."
                 });
             }

             if(req.body?.user_details?.role !== role){
                 if(!req.user_detalis){
                     return res.status(400).json({
                         success: false,
                         status: 400,
                         data: [],
                         message: "You are not allowed to access resources."
                     });
                 }
             }

             next();
        }
    ]
}