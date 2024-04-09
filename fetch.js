const apiUrl = 'http://localhost:3000';

// Function to fetch all characters
async function fetchCharacters() {
    try {
        const response = await fetch(`${apiUrl}/characters`);
        const characters = await response.json();
        return characters;
    } catch (error) {
        console.error('Error fetching characters:', error);
        return null;
    }
}

// Function to fetch a character by ID
async function fetchCharacterById(id) {
    try {
        const response = await fetch(`${apiUrl}/characters/${id}`);
        const character = await response.json();
        return character;
    } catch (error) {
        console.error(`Error fetching character with ID ${id}:`, error);
        return null;
    }
}

// Function to create a new character
async function createCharacter(name, game) {
    try {
        const response = await fetch(`${apiUrl}/characters`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ name, game })
        });
        const newCharacter = await response.json();
        return newCharacter;
    } catch (error) {
        console.error('Error creating character:', error);
        return null;
    }
}

// Function to update a character by ID
async function updateCharacter(id, name, game) {
    try {
        const response = await fetch(`${apiUrl}/characters/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ name, game })
        });
        const updatedCharacter = await response.json();
        return updatedCharacter;
    } catch (error) {
        console.error(`Error updating character with ID ${id}:`, error);
        return null;
    }
}

// Function to delete a character by ID
async function deleteCharacter(id) {
    try {
        const response = await fetch(`${apiUrl}/characters/${id}`, {
            method: 'DELETE'
        });
        if (response.ok) {
            return true;
        } else {
            console.error(`Failed to delete character with ID ${id}`);
            return false;
        }
    } catch (error) {
        console.error(`Error deleting character with ID ${id}:`, error);
        return false;
    }
}

// Export the functions
export { fetchCharacters, fetchCharacterById, createCharacter, updateCharacter, deleteCharacter };
