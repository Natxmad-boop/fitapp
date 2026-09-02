// FitApp - Lógica del Registro Rápido
document.addEventListener("DOMContentLoaded", () => {
    const addBtn = document.getElementById("addBtn");
    const exerciseNameInput = document.getElementById("exerciseName");
    const exerciseRepsInput = document.getElementById("exerciseReps");
    const exerciseList = document.getElementById("exerciseList");

    // Cargar ejercicios guardados anteriormente (si los hay)
    loadExercises();

    addBtn.addEventListener("click", () => {
        const name = exerciseNameInput.value.trim();
        const reps = exerciseRepsInput.value.trim();

        if (name === "" || reps === "") {
            alert("Por favor, rellena ambos campos.");
            return;
        }

        const exerciseData = { name, reps };
        
        // Guardar en pantalla y en la memoria del navegador
        addExerciseToDOM(exerciseData);
        saveToLocalStorage(exerciseData);

        // Limpiar los inputs
        exerciseNameInput.value = "";
        exerciseRepsInput.value = "";
    });

    function addExerciseToDOM(exercise) {
        const li = document.createElement("li");
        li.innerHTML = `
            <span><strong>${exercise.name}</strong> - ${exercise.reps}</span>
            <button style="width: auto; padding: 6px 10px; background-color: #dc2626; font-size: 12px;" onclick="this.parentElement.remove()">X</button>
        `;
        exerciseList.appendChild(li);
    }

    function saveToLocalStorage(exercise) {
        let exercises = JSON.parse(localStorage.getItem("fitapp_exercises")) || [];
        exercises.push(exercise);
        localStorage.setItem("fitapp_exercises", JSON.stringify(exercises));
    }

    function loadExercises() {
        let exercises = JSON.parse(localStorage.getItem("fitapp_exercises")) || [];
        exercises.forEach(exercise => addExerciseToDOM(exercise));
    }
});
