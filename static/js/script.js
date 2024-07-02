document.addEventListener('DOMContentLoaded', function() {
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
            }
        })
        .catch(error => {
            console.error('Error:', error);
            alert('An error occurred while adding the meal.');
        });
    });
});
