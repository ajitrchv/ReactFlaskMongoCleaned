from flask import Flask, Response, request
import json
from bson import ObjectId

import pymongo

app = Flask(__name__)


try:
    mongo = pymongo.MongoClient(host="localhost", port=27017, serverSelectionTimeoutMS=1000)
    mongo.server_info()
    db = mongo.crudapp
except Exception as ex:
    print(ex)
    print("Can't connect to db")

#############################################################################################

@app.route("/users", methods=["GET"])
def get_user():
    try:
        data = list(db.users.find())
        for user in data:
            user["_id"]=str(user["_id"])
        if(data==[]):
            return Response(
                    response=json.dumps({"message":"no data in the Database"}), status=200, mimetype="application/json"
                )

        else:
            return Response(
                    response=json.dumps(data), status=200, mimetype="application/json"
                )
    except Exception as ex:
        print(ex)
        return Response(
            response=json.dumps({"message":"unable to get data!"}), status=500, mimetype="application/json"
        )

################################################################################################

@app.route("/users", methods=["POST"])
def add_user():
    if(db.users.find_one({"mail":request.json["mail"]})):
         return Response(
            response=json.dumps({"message":"user exists!"}),
            status=200,
            mimetype="application/json"
        )
    
    try:
        user={
            "name":request.json["name"],
            "mail":request.json["mail"],
            "password":request.json["password"],
            }
        dbResponse = db.users.insert_one(user)
        return Response(
            response=json.dumps({"message":dbResponse.inserted_id}),
            status=200,
            mimetype="application/json"
        )
    except Exception as ex:
        print(ex)
        return Response(
            response=json.dumps({"message":"unable to insert data!"}),
            status=500, mimetype="application/json"
        ) 

#######################################################################################

@app.route("/users/<id>",methods=["PATCH"])
def update(id):
    try:
        dbResponse=db.users.update_one({
            "_id":ObjectId(id)
        },
        {"$set":{"name":request.json["name"],
        "mail":request.json["mail"],
        "password":request.json["password"]}}
        )

        if(dbResponse.modified_count == 1):
            return Response(
            response=json.dumps({"message":"updated user!", "id":str(ObjectId(id))}),
            status=200, mimetype="application/json"
        ) 
        else:
            return Response(
            response=json.dumps({"message":"Nothing to update!"}),
            status=200, mimetype="application/json"
        ) 


    
    except Exception as ex:
        print(ex)
        return Response(
            response=json.dumps({"message":"unable to update data!"}),
            status=500, mimetype="application/json"
        ) 
################################################################

@app.route("/users/mail",methods=["POST"])
def find_user():
    try:
        data=(db.users.find_one({"mail":request.json["mail"]}))
        #data["_id"]=str(ObjectId(data["_id"]))
        return Response(
            response=json.dumps({
                "name":data["name"],
                "mail":data["mail"],
                "password":data["password"],
                "message":"user found"
            }),
            status=200, mimetype="application/json"
            )

    
    except Exception as ex:
        print(ex)
        return Response(
            response=json.dumps({"message":"user not found"}),
            status=200, mimetype="application/json"
        ) 

####################################################################

@app.route("/users/<id>", methods=["DELETE"])
def delete_user(id):
    try:
        dbResponse = db.users.delete_one({"_id":ObjectId(id)})
        if(dbResponse.deleted_count == 1):
            return Response(
            response=json.dumps({"message":"User deleted!","id":str(ObjectId(id))}),
            status=200, mimetype="application/json"
        ) 
        else:
            return Response(
            response=json.dumps({"message":"User not found!","id":str(ObjectId(id))}),
            status=200, mimetype="application/json"
        ) 


    except Exception as ex:
        print(ex)
        return Response(
            response=json.dumps({"message":"unable to delete the user!"}),
            status=500, mimetype="application/json"
        ) 

if __name__ == "__main__":
    app.run(debug=True)