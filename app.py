from flask import Flask, request, jsonify
from flask_cors import CORS
from pymongo import MongoClient
from dotenv import load_dotenv
import os

load_dotenv()

app = Flask(__name__)
CORS(app)

# MongoDB setup
mongo_uri = os.getenv('MONGODB_URI')
client = MongoClient(mongo_uri)
db = client.timetable

@app.route('/timetable', methods=['GET'])
def get_timetable():
    timetable_data = list(db.timetable.find())
    for entry in timetable_data:
        entry['_id'] = str(entry['_id'])
    return jsonify(timetable_data)

@app.route('/timetable/<rfid>', methods=['GET'])
def get_timetable_by_rfid(rfid):
    timetable_data = list(db.timetable.find({'rfid': rfid}))
    for entry in timetable_data:
        entry['_id'] = str(entry['_id'])
    return jsonify(timetable_data)

@app.route('/timetable/<id>', methods=['PATCH'])
def update_timetable(id):
    data = request.get_json()
    if 'time' in data:
        db.timetable.update_one({'_id': ObjectId(id)}, {'$set': {'time': data['time']}})
    if 'teacher' in data:
        db.timetable.update_one({'_id': ObjectId(id)}, {'$set': {'teacher': data['teacher']}})
    return jsonify({'message': 'Timetable updated successfully'})

@app.route('/rfid', methods=['POST'])
def rfid_data():
    data = request.get_json()
    rfid = data.get('rfid')
    print(f"Received RFID data: {rfid}")
    return jsonify({'message': 'RFID data received', 'rfid': rfid})

if __name__ == '__main__':
    from bson.objectid import ObjectId
    app.run(debug=True)