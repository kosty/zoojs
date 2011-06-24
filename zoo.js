function generateRandomName(){
    var chars = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXTZabcdefghiklmnopqrstuvwxyz!~*-[]_+";
    var string_length = 8;
    var randomstring = '';
    for (var i=0; i<string_length; i++) {
        var rnum = Math.floor(Math.random() * chars.length);
        randomstring += chars.substring(rnum,rnum+1);
    }
    return randomstring;
}

function generateUniqueFileName(callback){
    var id = generateRandomName();
    var filename = path.join(process.cwd(), "zoo", id+".txt");
    path.exists(filename, function(exists){
        if (!exists){
            callback(filename, id, res);
        } else {
            generateUniqueFileName(callback);
        }
    });
}

function createFile(filename, id, res){
    fs.writeFile(filename, JSON.stringify({"id" : id}), 'utf8', function(err){
        if (err) {
            res.writeHead(200, { 'Content-Type' : 'application/json; charset=utf-8' });
            res.end(JSON.stringify({"error" : 2, "message" : "failed writing to file "+filename}));
            return;
        }
            
        res.writeHead(302, { "Location" : '/'+id });
        res.end();
    });
}

exports.touchFile

exports.isUser = function(email){
    path.exists(filename, function(exists){
        if (! exists){
            createFile(filename, id, res);
            return;
        }
        
        fs.readFile(filename, 'utf8', function (err, data) {
            if (err) {
                req.writeHead(200, {'Content-Type' : 'text/plain; charset=utf-8'});
                req.end(err);
                return;
            }
            
            var json = JSON.parse(data);
            res.writeHead(200, {'Content-Type': 'text/html; charset=utf-8'});
            var params = { "$item" : "{}", "$email": undefined };
            if (json.topic)
                params["$item"] = data;
            if (req.session.auth)
                params["$email"] = req.session.email;
            eresig.fromFileToStream('./templates/index.tpl', params, res);
        });
    });
}

function pyshFile(){
    var userEntry = path.join(process.cwd(), "zoo", ".visitors", "email", req.body.email);
    path.exists(userEntry, function(ex0){
        if (!ex0){
            fs.mkdir(userEntry, 0755, function(err){
                if(err){
                    res.writeHead(200, { 'Content-Type' : 'application/json; charset=utf-8'});
                    res.end(JSON.stringify({"error":"1", "message": "Can't create user", "orig":err}));
                    return;
                }

                var nameEntry = path.join(userEntry, "name");
                fs.writeFile(nameEntry, req.body.name, 'utf8');

                var pwdEntry = path.join(userEntry, "pwd");
                var pwd = generateRandomName();
                fs.writeFile(pwdEntry, pwd, 'utf8', function(err){
                    if(err){
                        res.writeHead(200, { 'Content-Type' : 'application/json; charset=utf-8'});
                        res.end(JSON.stringify({"error":"1", "message": "Can't set password", "orig": err}));
                        return;
                    }
                    nodemailer.send_mail({
                        sender: "dilemma.in@gmail.com", 
                        to: req.body.email,
                        subject: "Welcome!",
                        body:"Hi,\n\nYou were registered on 'indilemma.nodester.com'\nusername: "+req.body.email+"\npassword: "+pwd+"\nEnjoy your stay ^_^ "},
                                         function(error, success){
                                             res.writeHead(200, { 'Content-Type' : 'application/json; charset=utf-8'});
                                             res.end(JSON.stringify({"error": (error ? "1" : "0"), "message": success}));
                                         });
                    return;
                });
            });
        } else {
            res.writeHead(200, { 'Content-Type' : 'application/json; charset=utf-8'});
            res.end(JSON.stringify({"error":"1", "message": "User already exists"}));
        }
    });
}



