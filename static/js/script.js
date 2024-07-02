document.addEventListener('DOMContentLoaded', function() {
    // const form = document.getElementById('addDishForm');

    // submitButton.addEventListener('click', function(event) {
    //     event.preventDefault();

    //     const name = form.querySelector('input[type="text"]').value;
    //     const date = form.querySelector('#date').value;
    //     const mealType = form.querySelector('#type').value;
    //     const time = form.querySelector('#time').value;

    //     if (!name || !date || !mealType) {
    //         alert('Please fill out all required fields.');
    //         return;
    //     }

    //     const data = {
    //         name: name,
    //         date: date,
    //         meal_type: mealType,
    //         time: time
    //     };

    //     fetch('/api/meals', {
    //         method: 'POST',
    //         headers: {
    //             'Content-Type': 'application/json'
    //         },
    //         body: JSON.stringify(data)
    //     })
    //     .then(response => response.json())
    //     .then(data => {
    //         if (data.error) {
    //             alert('Error: ' + data.error);
    //         } else {
    //             alert('Meal added successfully');
    //             form.reset();
    //         }
    //     })
    //     .catch(error => {
    //         console.error('Error:', error);
    //         alert('An error occurred while adding the meal.');
    //     });
    // });
});


document.addEventListener('DOMContentLoaded', function() {
    
    const mealsList = document.getElementById('mealsList');

    function fetchMeals() {
        fetch('/api/meals')
            .then(response => response.json())
            .then(data => {
                if (data.length !== 0) {
                    mealsList.innerHTML = '';
                };
                data.forEach(meal => {
                    const card = document.createElement('div');
                    card.className = 'meal-card';
                    card.innerHTML = `
                        <div class="meal-name">${meal.name}</div>
                        <div class="meal-info"><span class="meal-label">Type:</span> ${meal.meal_type}</div>
                        <div class="meal-info"><span class="meal-label">Time:</span> ${meal.time ? meal.time : 'N/A'}</div>
                        <div class="meal-info"><span class="meal-label">Date:</span> ${meal.date}</div>
                        <div class="btn-container">
                            <button class="btn btn-update" onclick="updateMeal(${meal.id})">Update</button>
                            <button class="btn btn-delete" onclick="deleteMeal(${meal.id})">Delete</button>
                        </div>
                    `;
                    mealsList.appendChild(card);
                });
            })
            .catch(error => {
                console.error('eerror fetching meals:', error);
                mealsList.innerHTML = '<p>Error loading meals. Please try again later.</p>';
            });
    }

    const form = document.getElementById('addDishForm');

    submitButton.addEventListener('click', function(event) {
        event.preventDefault();

        const name = form.querySelector('input[type="text"]').value;
        const date = form.querySelector('#date').value;
        const mealType = form.querySelector('#type').value;
        const time = form.querySelector('#time').value;

        if (!name || !date || !mealType) {
            alert('Please fill out all required fields.');
            return;
        }

        const data = {
            name: name,
            date: date,
            meal_type: mealType,
            time: time
        };

        fetch('/api/meals', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        })
        .then(response => response.json())
        .then(data => {
            if (data.error) {
                alert('Error: ' + data.error);
            } else {
                alert('Meal added successfully');
                form.reset();
                fetchMeals();
            }
        })
        .catch(error => {
            console.error('Error:', error);
            alert('An error occurred while adding the meal.');
        });
    });

    fetchMeals();
});

function updateMeal(id) {
    alert('Update functionality to be implemented for meal ID: ' + id);
    // Implement the update functionality here
}

function deleteMeal(id) {
    if (confirm('Are you sure you want to delete this meal?')) {
        fetch('http://127.0.0.1:5001/api/meals/' + id, {
            method: 'DELETE'
        })
        .then(response => {
            if (response.ok) {
                alert('Meal deleted successfully.');
                location.reload(); // Reload the page to see the changes
            } else {
                alert('Error deleting meal.');
            }
        })
        .catch(error => {
            console.error('Error deleting meal:', error);
            alert('Error deleting meal.');
        });
    }
}
