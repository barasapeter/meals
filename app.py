from datetime import datetime


from flask import Flask, render_template, request, jsonify
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
import os, utils

from flask_wtf.csrf import CSRFProtect

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///' + os.path.join(app.root_path, 'database', 'data.db')
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['SECRET_KEY'] = 'My Mary' 

db = SQLAlchemy(app)
csrf = CSRFProtect(app)
CORS(app)

class Meal(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(80), nullable=False)
    date = db.Column(db.Date, nullable=False)
    meal_type = db.Column(db.String(80), nullable=False)
    time = db.Column(db.Time, nullable=True)

def create_database():
    if not os.path.exists(os.path.join(app.root_path, 'database')):
        os.makedirs(os.path.join(app.root_path, 'database'))
    db.create_all()

@app.route('/api/meals', methods=['POST'])
@csrf.exempt
def add_meal():
    data = request.get_json()

    name = data.get('name')
    date_str = data.get('date')
    meal_type = data.get('meal_type')
    time_str = data.get('time')

    if not name or not date_str or not meal_type:
        return jsonify({'error': 'Missing required parameters'}), 400

    try:
        date = datetime.strptime(date_str, '%Y-%m-%d').date()
        time = datetime.strptime(time_str, '%H:%M').time() if time_str else None
    except ValueError as e:
        return jsonify({'error': 'Invalid date or time format'}), 400

    new_meal = Meal(name=name, date=date, meal_type=meal_type, time=time)

    try:
        db.session.add(new_meal)
        db.session.commit()
        return jsonify({'message': 'Meal added successfully'}), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500
    finally:
        db.session.close()


@app.route('/api/meals', methods=['GET'])
@csrf.exempt
def get_meals():
    meals = Meal.query.all()
    meals_list = []
    for meal in meals:
        meals_list.append({
            'id': meal.id,
            'name': meal.name,
            'date': f'{utils.CustomCalendar.week_day_name(meal.date.strftime('%Y-%m-%d'))} {meal.date.strftime('%Y-%m-%d')} ',
            'meal_type': meal.meal_type,
            'time': meal.time.strftime('%H:%M') if meal.time else None
        })
    return jsonify(meals_list), 200

@app.route('/api/meals/<int:meal_id>', methods=['DELETE'])
@csrf.exempt
def delete_meal(meal_id):
    meal = Meal.query.get(meal_id)
    
    if not meal:
        return jsonify({'error': 'Meal not found'}), 404

    try:
        db.session.delete(meal)
        db.session.commit()
        return jsonify({'message': 'Meal deleted successfully'}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500
    finally:
        db.session.close()

@app.route('/')
def index():
    return render_template('index.html')

if __name__ == '__main__':
    with app.app_context():
        create_database()
    app.run(debug=True, host='0.0.0.0', port=5001)
